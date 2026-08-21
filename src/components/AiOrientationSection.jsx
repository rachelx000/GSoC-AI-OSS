import { useCallback, useMemo, useState } from 'react';
import { rollup } from 'd3';
import AiUseStanceHeatmap from './AiUseStanceHeatmap';
import { participants, stanceCodes } from '../data/demographics';

export default function AiOrientationSection() {
  const [activeStance, setActiveStance] = useState('AI Accommodator');
  const stanceCounts = useMemo(
    () => rollup(participants, (group) => group.length, (participant) => participant.stance),
    [],
  );
  const activeCode = stanceCodes.find((code) => code.name === activeStance) ?? stanceCodes[0];
  const selectStance = useCallback((stance) => setActiveStance(stance), []);

  return (
    <section
      id="intro-ai-orientation"
      className="intro-slide orientation-slide"
      aria-labelledby="orientation-title"
    >
      <div className="slide-frame orientation-frame">
        <div className="orientation-layout">
          <div className="orientation-sidebar">
            <header className="orientation-heading">
              <span className="section-kicker">03 · AI orientation</span>
              <h2 id="orientation-title">Use frequency and stance are distinct dimensions</h2>
            </header>

            <aside className="stance-codebook" aria-labelledby="stance-codebook-title">
              <div className="stance-codebook-heading">
                <h3 id="stance-codebook-title">AI stance codes</h3>
              </div>

              <div
                className="stance-codebook-scroll"
                aria-label="Scrollable AI stance definitions"
                role="region"
                tabIndex={0}
              >
                <div className="stance-code-list" aria-label="AI stance code selector">
                  {stanceCodes.map((code) => {
                    const count = stanceCounts.get(code.name) ?? 0;
                    return (
                      <button
                        key={code.name}
                        type="button"
                        aria-pressed={activeStance === code.name}
                        onClick={() => setActiveStance(code.name)}
                      >
                        <span>{code.name.replace('AI ', '')}</span>
                        <small>{count}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="stance-definition" aria-live="polite">
                  <div>
                    <span>Inspected stance</span>
                    <strong>{activeCode.name}</strong>
                  </div>
                  <p>{activeCode.definition}</p>
                  {activeCode.name === 'AI Fatalist' && (
                    <small><b>Note:</b> Defined in the codebook but no interviewee carries this stance.</small>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <AiUseStanceHeatmap
            participants={participants}
            description="OSS AI-use frequency is self-reported, and stance is a preliminary analyst-coded orientation. Please select a heatmap cell or code to inspect the codebook definition."
            onStanceSelect={selectStance}
          />
        </div>
      </div>
    </section>
  );
}
