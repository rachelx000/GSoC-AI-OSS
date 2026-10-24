"""Read protected LaTeX sources and refresh the dashboard's static data."""

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANUSCRIPT = ROOT / "references/manuscript"
SUPPLEMENT = ROOT / "references/supplemental"


def uncomment(text):
    return re.sub(r"(?<!\\)%[^\n]*", "", text)


def braced(text, start):
    """Return the content and end position of a balanced LaTeX argument."""
    assert text[start] == "{"
    depth = 1
    index = start + 1
    while depth:
        if text[index] in "{}" and text[index - 1] != "\\":
            depth += 1 if text[index] == "{" else -1
        index += 1
    return text[start + 1 : index - 1], index


def arguments(text, command, count=1):
    matches = []
    for match in re.finditer(re.escape("\\" + command) + r"\s*(?=\{)", text):
        cursor = match.end()
        args = []
        for _ in range(count):
            while text[cursor].isspace():
                cursor += 1
            value, cursor = braced(text, cursor)
            args.append(value)
        matches.append((args, match.start(), cursor))
    return matches


def plain(text):
    for escaped, character in [(r"\%", "%"), (r"\&", "&"), (r"\_", "_")]:
        text = text.replace(escaped, character)
    text = text.replace("``", "“").replace("''", "”").replace("`", "‘")
    text = text.replace("---", "—").replace("--", "–")
    text = re.sub(r"\\(?:textbf|textit|emph|hl|strut|AIMInitial)\b", "", text)
    text = text.replace("\\\\", " ").replace("~", " ")
    text = text.replace("{", "").replace("}", "")
    return re.sub(r"\s+", " ", text).strip()


def table_rows(path, prefix):
    text = uncomment(path.read_text())
    rows = []
    for match in re.finditer(r"(?m)^(" + prefix + r"\d+)\s*&", text):
        depth, cursor = 0, match.start()
        cells, cell_start = [], cursor
        while cursor < len(text):
            char = text[cursor]
            if char in "{}" and (cursor == 0 or text[cursor - 1] != "\\"):
                depth += 1 if char == "{" else -1
            if depth == 0 and text[cursor : cursor + 2] == "\\\\":
                cells.append(text[cell_start:cursor].strip())
                break
            if depth == 0 and char == "&" and text[cursor - 1] != "\\":
                cells.append(text[cell_start:cursor].strip())
                cell_start = cursor + 1
            cursor += 1
        rows.append((cells, text[: match.start()]))
    return rows


def excerpts(cell):
    quotes = []
    for command in ("myquote", "unused"):
        for args, start, end in arguments(cell, command):
            participant = re.match(r"\s*\[(P\d+)\]", cell[end:])
            assert participant, cell[end : end + 50]
            quotes.append(
                {
                    "text": plain(args[0]),
                    "participant": participant.group(1),
                    "position": start,
                }
            )
    quotes.sort(key=lambda quote: quote["position"])
    assert quotes
    return [
        {key: value for key, value in quote.items() if key != "position"}
        for quote in quotes
    ]


GROUPS = [
    {
        "id": "entry",
        "name": "Entry and early preparation",
        "range": "S0–S3",
        "stageIds": ["S0", "S1", "S2", "S3"],
        "color": "#4E6598",
        "tint": "#F0F3FA",
    },
    {
        "id": "mentoring",
        "name": "Mentoring, review, and evaluation",
        "range": "S4–S6",
        "stageIds": ["S4", "S5", "S6"],
        "color": "#685C91",
        "tint": "#F0EBF8",
    },
    {
        "id": "retention",
        "name": "Retention and role transition",
        "range": "S7",
        "stageIds": ["S7"],
        "color": "#94566B",
        "tint": "#F9EDF2",
    },
    {
        "id": "governance",
        "name": "Cross-stage governance",
        "range": "S0–S7",
        "stageIds": ["X"],
        "color": "#895447",
        "tint": "#FEF5EF",
    },
]

STAGE_ROWS = [
    (
        "S0",
        "Pre-engagement",
        "Prospective newcomers find a project of interest, contact its community, and sometimes make early contributions.",
        ["silva2017long", "silva2020google"],
    ),
    (
        "S1",
        "Proposal preparation",
        "Applicants turn their interest into a feasible project plan through proposal preparation.",
        ["trainer2014community", "silva2020theory"],
    ),
    (
        "S2",
        "Applicant review and selection",
        "Mentors use proposals to assess applicants’ readiness and project fit, and select contributors within the organization’s mentoring capacity.",
        ["silva2020theory", "trainer2014community", "tan2023understanding"],
    ),
    (
        "S3",
        "Bonding and initial onboarding",
        "Selected contributors learn project tools, workflows, and community norms as working relationships begin to form.",
        ["balali2018", "steinmacher2019", "tan2023understanding"],
    ),
    (
        "S4",
        "Contributing and mentoring",
        "Contributors move into substantive project work, building skills through mentors’ guidance and feedback.",
        [
            "silva2020theory",
            "popoola2025empirical",
            "feng2024guiding",
            "tan2023understanding",
        ],
    ),
    (
        "S5",
        "Contribution review",
        "Review and revision inform decisions about acceptance or integration. Issue, pull-request, and commit interactions support an ongoing cycle between contributing and review.",
        ["silva2020theory", "popoola2025empirical", "raoofian2025openment"],
    ),
    (
        "S6",
        "Evaluation and completion",
        "Milestones and midterm and final pass/fail decisions assess contributors’ progress and participation alongside the ongoing contribution-review cycle.",
        ["silva2020google", "tan2023understanding"],
    ),
    (
        "S7",
        "Retention and role transition",
        "After graduation, contributors may continue participating in their communities, sometimes returning as mentors. This transition can renew the mentoring cycle.",
        ["silva2020google", "trainer2014community", "tan2023understanding"],
    ),
    (
        "X",
        "Governance",
        "Rules, accountability, coordination, and mentor capacity support activities across the pipeline. Governance is a cross-stage layer in the RQ1 figure, rather than an additional chronological stage.",
        ["gsoc_roles", "gsoc_ai_guidance2026"],
    ),
]

EFFECT_STAGE = {
    "S0": ["CH1", "CH2"],
    "S1": ["CH3"],
    "S2": ["CH4", "CH5"],
    "S3": ["OP1"],
    "S4": ["OP2", "CH6", "CH7", "CH8", "CH9"],
    "S5": ["CH10", "CH11", "CH12", "CH13", "CH14", "OP3"],
    "S6": ["CH15"],
    "S7": ["CH16"],
    "X": ["CH17", "CH18", "CH19", "CH20"],
}

# These are the colored, grouped paths in rq1-latest.svg, not per-excerpt causal links.
PATHWAYS = [
    {
        "id": "screening",
        "name": "Entry screening",
        "color": "#4E6598",
        "effectIds": [f"CH{i}" for i in range(1, 6)],
        "impactIds": ["IM1", "IM6"],
    },
    {
        "id": "development",
        "name": "Learning, contribution, and review",
        "color": "#8A8CBF",
        "effectIds": ["OP1", *[f"CH{i}" for i in range(6, 16)], "OP3"],
        "impactIds": ["IM2", "IM3", "IM4"],
    },
    {
        "id": "renewal",
        "name": "Mentoring support and renewal",
        "color": "#D3A0B0",
        "effectIds": ["OP2", "CH16"],
        "impactIds": ["IM7"],
    },
    {
        "id": "governance",
        "name": "Governance and mentor capacity",
        "color": "#EFA484",
        "effectIds": [f"CH{i}" for i in range(17, 21)],
        "impactIds": ["IM5", "IM6", "IM8"],
    },
]

IMPLICATIONS = {
    "IM1": [
        (
            "adverse",
            "GenAI makes it harder to identify capable, committed newcomers.",
        ),
        ("adverse", "GenAI makes screening take more effort."),
    ],
    "IM2": [
        ("adverse", "GenAI weakens artifacts as evidence of competence."),
        (
            "adverse",
            "GenAI demands greater mentor attention to building trust.",
        ),
        (
            "beneficial",
            "GenAI increases the importance of developing trusted contributors.",
        ),
    ],
    "IM3": [
        (
            "adverse",
            "GenAI dependence may weaken skills, judgment, and career credibility.",
        ),
        ("beneficial", "GenAI assistance can support learning."),
    ],
    "IM4": [
        (
            "adverse",
            "Unreliable GenAI output and maintenance debt threaten lasting value of GSoC-funded work.",
        ),
        ("beneficial", "GenAI can accelerate contribution delivery."),
    ],
    "IM5": [
        (
            "adverse",
            "OSS policy fragmentation and GenAI-driven enforcement demands may strain governance.",
        ),
        (
            "beneficial",
            "GenAI assistance can improve organizational routines.",
        ),
    ],
    "IM6": [
        (
            "adverse",
            "GenAI-driven distrust and additional workload may hinder welcoming, diverse and engaged OSS participation.",
        )
    ],
    "IM7": [
        (
            "adverse",
            "GenAI-weakened project attachment may disrupt the renewal pathway.",
        ),
        (
            "adverse",
            "GenAI-driven mentor withdrawal threatens support for future capacity.",
        ),
    ],
    "IM8": [
        (
            "adverse",
            "GenAI-driven verification burdens and reduced satisfaction may weaken continued participation.",
        ),
        (
            "beneficial",
            "GenAI assistance reduces effort required for certain mentoring tasks.",
        ),
    ],
}


def bibliography():
    text = (MANUSCRIPT / "references.bib").read_text()
    records = {}
    for match in re.finditer(r"@\w+\s*\{([^,]+),", text):
        body, _ = braced(text, text.index("{", match.start()))
        fields = {}
        for field in re.finditer(r"(?m)^\s*(\w+)\s*=\s*\{", body):
            value, _ = braced(body, body.index("{", field.start()))
            fields[field.group(1).lower()] = plain(value)
        author = fields.get("author", "")
        first = author.split(" and ")[0].split(",")[0]
        if "," not in author.split(" and ")[0]:
            first = first.split(" ")[-1]
        label = (
            "Google Summer of Code"
            if author == "Google Summer of Code"
            else first + (" et al." if " and " in author else "")
        )
        published_url = re.search(
            r"https?://[^\s}]+", fields.get("howpublished", "")
        )
        records[match.group(1)] = {
            "title": fields.get("title", match.group(1)),
            "label": (
                f"{label} ({fields['year']})" if fields.get("year") else label
            ),
            "url": fields.get("url")
            or (
                "https://doi.org/" + fields["doi"]
                if fields.get("doi")
                else published_url.group(0) if published_url else None
            ),
        }
    return records


def build():
    stages = []
    for identifier, name, definition, references in STAGE_ROWS:
        group = next(
            group for group in GROUPS if identifier in group["stageIds"]
        )
        stages.append(
            {
                "id": identifier,
                "name": name,
                "definition": definition,
                "referenceIds": references,
                "groupId": group["id"],
                "effectIds": EFFECT_STAGE[identifier],
            }
        )

    effects = []
    for cells, _ in table_rows(
        SUPPLEMENT / "tables/effects_definitions.tex", r"(?:CH|OP)"
    ):
        identifier, name, evidence = cells
        stage = next(
            stage for stage in stages if identifier in stage["effectIds"]
        )
        effects.append(
            {
                "id": identifier,
                "name": plain(name),
                "kind": (
                    "opportunity"
                    if identifier.startswith("OP")
                    else "challenge"
                ),
                "stageId": stage["id"],
                "groupId": stage["groupId"],
                "excerpts": excerpts(evidence),
            }
        )

    impacts = []
    for cells, _ in table_rows(
        SUPPLEMENT / "tables/sustainability_impacts_definitions.tex", "IM"
    ):
        identifier, name, definition, evidence = cells
        impacts.append(
            {
                "id": identifier,
                "name": plain(name),
                "figureName": (
                    "Contributor-to-mentor renewal"
                    if identifier == "IM7"
                    else plain(name)
                ),
                "definition": plain(definition),
                "excerpts": excerpts(evidence),
                "implications": [
                    {"kind": kind, "text": text}
                    for kind, text in IMPLICATIONS[identifier]
                ],
            }
        )

    strategy_groups = [
        {
            "id": "trust",
            "name": "Establishing trust in applicants",
            "description": "Build evidence of readiness beyond polished proposals and entry contributions.",
            "color": "#4E6598",
        },
        {
            "id": "accountability",
            "name": "Governing GenAI use and maintaining accountability",
            "description": "Choose a GenAI boundary while keeping understanding, checking, and responsibility with people.",
            "color": "#685C91",
        },
        {
            "id": "program",
            "name": "Sharing guidance and verification across the program",
            "description": "Share support across organizations while retaining local autonomy.",
            "color": "#895447",
        },
    ]
    strategies = []
    evidence_by_id = {
        cells[0]: excerpts(cells[2])
        for cells, _ in table_rows(
            SUPPLEMENT / "tables/strategies_definitions.tex", "ST"
        )
    }
    for cells, _ in table_rows(MANUSCRIPT / "tables/rq2_strategies.tex", "ST"):
        identifier, name, definition = cells
        number = int(identifier[2:])
        group_id = (
            "trust"
            if number <= 4
            else "accountability" if number <= 13 else "program"
        )
        status = {
            "ST2": "Reported and planned",
            "ST3": "Proposed response",
            "ST7": "Reported and proposed criterion",
            "ST14": "Program-level proposal",
        }.get(identifier)
        strategies.append(
            {
                "id": identifier,
                "name": plain(name),
                "definition": plain(definition),
                "groupId": group_id,
                "status": status,
                "excerpts": evidence_by_id[identifier],
            }
        )

    framework = uncomment(
        (MANUSCRIPT / "tables/framework_table.tex").read_text()
    )
    rows = arguments(framework, "GenAIStanceRow", 3)
    assert len(rows) == 4
    stance_names = [
        "Prohibitionist",
        "Skeptic",
        "Accommodator",
        "Pragmatist",
        "Advocate",
    ]
    stance_colors = ["#92C5DE", "#D1E5F0", "#F7F7F7", "#FDDBC7", "#F4A582"]
    stance_tints = ["#E4F0F7", "#F4F8FB", "#FDFDFD", "#FEF6F1", "#FCE8E0"]
    stances = [
        {
            "id": name.lower(),
            "name": name,
            "color": color,
            "tint": tint,
            "actions": {},
        }
        for name, color, tint in zip(stance_names, stance_colors, stance_tints)
    ]
    for row_id, (args, _, _) in zip(
        ["boundary", "entry", "mentoring", "governance"], rows
    ):
        cells = arguments(args[2], "GenAICell")
        assert len(cells) == 5
        for stance, (cell, _, _) in zip(stances, cells):
            stance["actions"][row_id] = [
                plain(action[0][0]) for action in arguments(cell[0], "Action")
            ]
            assert stance["actions"][row_id]
    capacity_text = framework.split(r"\begin{tabularx}{\linewidth}{*{4}", 1)[1]
    capacity_names = [
        "GenAI boundary",
        "Entry and early preparation",
        "Mentoring, review, and evaluation",
        "Governance",
    ]
    capacity = []
    for name, (cell, _, _) in zip(
        capacity_names, arguments(capacity_text, "GenAICell")
    ):
        capacity.append(
            {
                "name": name,
                "actions": [
                    plain(action[0][0])
                    for action in arguments(cell[0], "Action")
                ],
            }
        )
    assert len(capacity) == 4

    references = bibliography()
    required_refs = {key for stage in stages for key in stage["referenceIds"]}
    assert required_refs <= references.keys(), (
        required_refs - references.keys()
    )
    return {
        "sources": {
            "effects": "references/supplemental/tables/effects_definitions.tex",
            "impacts": "references/supplemental/tables/sustainability_impacts_definitions.tex",
            "strategies": "references/manuscript/tables/rq2_strategies.tex",
            "strategyEvidence": "references/supplemental/tables/strategies_definitions.tex",
            "framework": "references/manuscript/tables/framework_table.tex",
            "relationships": "references/manuscript/figures/rq1-latest.svg",
            "pipeline": "references/manuscript/sections/2_GSoC.tex",
        },
        "groups": GROUPS,
        "stages": stages,
        "effects": effects,
        "impacts": impacts,
        "pathways": PATHWAYS,
        "strategyGroups": strategy_groups,
        "strategies": strategies,
        "stances": stances,
        "capacity": capacity,
        "references": {key: references[key] for key in sorted(required_refs)},
    }


if __name__ == "__main__":
    data = build()
    destination = ROOT / "src/data/manuscript.json"
    serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if "--check" in sys.argv:
        if destination.read_text() != serialized:
            raise SystemExit(
                "Dashboard data differs from its manuscript sources. Run the sync script."
            )
        print("Dashboard data matches the manuscript and supplemental tables.")
    else:
        destination.write_text(serialized)
        print(
            f"Updated {destination.relative_to(ROOT)} from manuscript and supplement."
        )
    print(
        f"{len(data['effects'])} effects, {len(data['impacts'])} functions, {len(data['strategies'])} strategies, {len(data['stances'])} stances."
    )
