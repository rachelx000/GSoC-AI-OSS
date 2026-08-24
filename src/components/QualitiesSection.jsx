import { useMemo, useState } from 'react';
import {
  respondentBands,
  respondentColor,
  respondentTextColor,
} from '../data/challengeColors';
import { qualities, qualityLayers } from '../data/qualities';
import DefinitionBlocks from './DefinitionBlocks';

const SAMPLE_SIZE = 15;
const LITERATURE_URL = 'https://doi.ieeecomputersociety.org/10.1109/CHASE66643.2025.00031';
const qualityById = new Map(qualities.map((quality) => [quality.id, quality]));

function QualityCoverageLegend() {
  return (
    <aside className="qualities-legend" aria-label="Respondent count color scale">
      <span>Number of respondents (n = {SAMPLE_SIZE})</span>
      <div className="qualities-legend-scale">
        {respondentBands.map((band) => (
          <span
            key={band.label}
            style={{ '--band-color': band.color, '--band-ink': band.ink }}
          >
            {band.label}
          </span>
        ))}
      </div>
    </aside>
  );
}

function QualityCard({ quality, selected, onSelect }) {
  const coverageColor = quality.respondentCount === 0
    ? '#f0efeb'
    : respondentColor(quality.respondentCount);
  const coverageInk = quality.respondentCount === 0
    ? '#36566a'
    : respondentTextColor(quality.respondentCount);

  return (
    <button
      type="button"
      className="quality-card"
      aria-pressed={selected}
      aria-controls="quality-detail-row"
      onClick={onSelect}
      style={{ '--quality-color': coverageColor, '--quality-ink': coverageInk }}
    >
      <span className="quality-card-copy">
        <strong>{quality.name}</strong>
      </span>
      <span className="quality-card-count" aria-label={`${quality.respondentCount} of ${SAMPLE_SIZE} interviewees`}>
        <strong>{quality.respondentCount}</strong> / {SAMPLE_SIZE}
      </span>
    </button>
  );
}

function QualityLayer({ layer, activeQualityId, onSelect }) {
  const layerQualities = layer.qualityIds.map((id) => qualityById.get(id));
  const isRelational = layer.id === 'relational';

  return (
    <section
      className={`quality-layer quality-layer-${layer.id}`}
      aria-labelledby={`quality-layer-${layer.id}`}
      style={{ '--quality-count': layerQualities.length }}
    >
      <header className="quality-layer-heading">
        <div>
          <span>{layer.provenance === 'literature' ? 'Prior literature' : 'AI-era addition'}</span>
          <h2 id={`quality-layer-${layer.id}`}>{layer.name}</h2>
        </div>
      </header>

      <div className="quality-layer-body">
        {isRelational && (
          <div className="quality-pre-ai-order">
            <strong>Higher pre-AI importance</strong>
            <i aria-hidden="true" /> 
            <strong>Lower pre-AI importance</strong>
          </div>
        )}
        <div className="quality-card-list">
          {layerQualities.map((quality) => (
            <QualityCard
              key={quality.id}
              quality={quality}
              selected={activeQualityId === quality.id}
              onSelect={() => onSelect(quality.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function QualityDetail({ quality }) {
  if (!quality) {
    return (
      <section id="quality-detail-row" className="quality-detail quality-detail-empty" aria-live="polite">
        <div>
          <span className="section-kicker">Quality Inspection</span>
          <h2>Please select any quality above</h2>
        </div>
      </section>
    );
  }

  const coverageColor = quality.respondentCount === 0
    ? '#f0efeb'
    : respondentColor(quality.respondentCount);

  return (
    <section
      id="quality-detail-row"
      className="quality-detail"
      aria-live="polite"
      style={{ '--quality-color': coverageColor }}
    >
      <div className="quality-detail-definition">
        <div className="quality-detail-heading">
          <div className="quality-detail-title-row">
            <span>{quality.id}</span>
            <h2>{quality.name}</h2>
          </div>
          <div className="quality-detail-meta-row">
            <span className="quality-detail-count"><strong>{quality.respondentCount}</strong> / {SAMPLE_SIZE}</span>
            <span className="quality-detail-origin" data-origin={quality.provenance}>
              {quality.provenance === 'literature' ? 'Prior literature' : 'AI-era addition'}
            </span>
          </div>
        </div>
        <DefinitionBlocks
          definition={quality.definition}
          referenceUrl={quality.provenance === 'literature' ? LITERATURE_URL : undefined}
          referenceLabel="Feng et al. (2025)"
        />
      </div>

      <div className="quality-detail-evidence">
        <h3>Representative open codes</h3>
        {quality.representativeCodes.length > 0 ? (
          <div className="quality-evidence-list">
            {quality.representativeCodes.map((item, index) => (
              <article className="quality-evidence-card" key={`${quality.id}-${item.code}-${index}`}>
                <div>
                  <strong>{item.code}</strong>
                  <span>{item.source}</span>
                </div>
                <details>
                  <summary>Verbatim excerpt</summary>
                  <blockquote>{item.quote}</blockquote>
                </details>
              </article>
            ))}
          </div>
        ) : (
          <p className="quality-empty-evidence">
            No directly coded interview excerpt is linked to this quality in the workbook audit trail.
          </p>
        )}
      </div>
    </section>
  );
}

export default function QualitiesSection() {
  const [activeQualityId, setActiveQualityId] = useState(null);
  const activeQuality = useMemo(
    () => qualities.find((quality) => quality.id === activeQualityId) ?? null,
    [activeQualityId],
  );

  return (
    <main
      id="qualities-panel"
      className="qualities-page"
      role="tabpanel"
      aria-labelledby="qualities-tab"
    >
      <div className="qualities-frame">
        <header className="qualities-overview">
          <div>
            <h1>GSoC Mentorship Qualities in the AI-era</h1>
          </div>
          <QualityCoverageLegend />
        </header>

        <section className="qualities-layers" aria-label="Layered mentoring quality model">
          {qualityLayers.map((layer) => (
            <QualityLayer
              key={layer.id}
              layer={layer}
              activeQualityId={activeQualityId}
              onSelect={setActiveQualityId}
            />
          ))}
        </section>

        <QualityDetail quality={activeQuality} />
      </div>
    </main>
  );
}
