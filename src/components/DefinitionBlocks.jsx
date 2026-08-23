const PRE_AI_LABEL = 'Pre-AI definition:';
const AI_ERA_DIVIDER = '\n\nAI-era meaning:';

function LiteratureReference({ url, label }) {
  if (!url) return null;

  return (
    <div className="literature-links definition-subblock-reference">
      <a href={url} target="_blank" rel="noreferrer">
        {label}
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export default function DefinitionBlocks({ definition, referenceUrl, referenceLabel }) {
  if (!definition.startsWith(PRE_AI_LABEL) || !definition.includes(AI_ERA_DIVIDER)) {
    return (
      <>
        <p>{definition}</p>
        <LiteratureReference url={referenceUrl} label={referenceLabel} />
      </>
    );
  }

  const [preAiDefinition, aiEraMeaning] = definition.split(AI_ERA_DIVIDER);

  return (
    <div className="definition-comparison">
      <div className="definition-subblock definition-subblock-pre-ai">
        <span>Pre-AI definition</span>
        <p>{preAiDefinition.slice(PRE_AI_LABEL.length).trim()}</p>
        <LiteratureReference url={referenceUrl} label={referenceLabel} />
      </div>
      <div className="definition-subblock definition-subblock-ai-era">
        <span>AI-era meaning</span>
        <p>{aiEraMeaning.trim()}</p>
      </div>
    </div>
  );
}
