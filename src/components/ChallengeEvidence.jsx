import {
  categoryLabels,
  literatureReferences,
} from '../data/challenges';
import { respondentColor, respondentTextColor } from '../data/challengeColors';
import { getChallengeEvidence } from '../data/challengeEvidence';

function ReferenceLinks({ referenceIds }) {
  return (
    <div className="literature-links">
      {referenceIds.map((referenceId) => {
        const reference = literatureReferences[referenceId];
        return (
          <a key={referenceId} href={reference.url} target="_blank" rel="noreferrer">
            {reference.label}
            <span aria-hidden="true">↗</span>
          </a>
        );
      })}
    </div>
  );
}

export function LiteratureEvidence({ stage }) {
  return (
    <section className="literature-evidence" aria-labelledby={`literature-${stage.id}`}>
      <header>
        <div>
          <span className="evidence-provenance">Literature-derived scaffold</span>
          <h3 id={`literature-${stage.id}`}>Why this stage is in the pipeline</h3>
        </div>
        <span className="literature-theme">{stage.literatureTheme}</span>
      </header>

      <div className="literature-reference-grid">
        <div>
          <span>Primary reference</span>
          <ReferenceLinks referenceIds={stage.primaryReferences} />
        </div>
        <div>
          <span>Additional support</span>
          <ReferenceLinks referenceIds={stage.additionalReferences} />
        </div>
      </div>

      <p>{stage.literatureSupport}</p>
    </section>
  );
}

export function ChallengeDetail({ challenge }) {
  if (!challenge) return null;

  return (
    <article
      id={`challenge-${challenge.id.replaceAll('.', '-')}`}
      className="challenge-detail"
      data-category={challenge.category}
      style={{
        '--respondent-color': respondentColor(challenge.participantCount),
        '--respondent-ink': respondentTextColor(challenge.participantCount),
      }}
    >
      <header>
        <div>
          <span className="challenge-category">
            <span>{challenge.id.replace('CH-', '')}</span>
            <span aria-hidden="true">·</span>
            <span className="challenge-category-tag">{categoryLabels[challenge.category]}</span>
          </span>
          <h3>{challenge.name}</h3>
        </div>
        <div className="challenge-detail-counts" aria-label="Challenge evidence counts">
          <span><strong>{challenge.participantCount}</strong> / 15 interviewees</span>
          <span><strong>{challenge.openCodeCount}</strong> open codes</span>
        </div>
      </header>

      <div className="challenge-detail-grid">
        <div className="challenge-definition">
          <span>Definition</span>
          <p>{challenge.definition}</p>
        </div>
        <div className="open-code-evidence">
          <span>Representative open codes</span>
          <ul>
            {challenge.openCodes.map(([openCode, source]) => (
              <li key={`${challenge.id}-${openCode}`}>
                <div className="open-code-heading">
                  <span>{openCode}</span>
                  <small>{source}</small>
                </div>
                <details className="open-code-source">
                  <summary>Verbatim quote / evidence</summary>
                  <p>{getChallengeEvidence(challenge.id, source)}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function ChallengeCollection({ challenges }) {
  if (!challenges.length) {
    return (
      <div className="no-stage-challenge">
        <strong>No stage-specific challenge reported</strong>
        <p>
          The current codebook assigns no challenge directly to this stage; none is inferred from
          the literature scaffold.
        </p>
      </div>
    );
  }

  return (
    <div className="challenge-collection">
      {challenges.map((challenge) => (
        <ChallengeDetail key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
}
