import aimIcon from '../assets/AIM.svg';
import impactIcon from '../assets/impact.svg';
import strategyIcon from '../assets/strategy.svg';
import mailingListIcon from '../assets/mailing-list.svg';
import interviewIcon from '../assets/interview.svg';

export default function CoverPage() {
  return (
    <main
      id="cover-page"
      className="cover-page"
      aria-labelledby="project-title"
    >
      <section className="cover-hero">
        <div className="cover-copy">
          <h1 id="project-title">Mentorship, Interrupted</h1>
          <p className="cover-subtitle">
            How GenAI Disrupts the GSoC Pipeline and Why Mentors Matter More
          </p>
          <p className="cover-description">
            Mentoring grows OSS’s next maintainers. GenAI weakens the evidence
            mentors use to judge newcomers’ learning, shifting their time toward
            verification and putting that renewal at risk.
          </p>
          <aside className="cover-takeaway" aria-label="Guiding question">
            <p>
              How can communities build trust in newcomers while sustaining the
              mentors who develop them?
            </p>
            <svg className="cover-question-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.4 9a2.6 2.6 0 0 1 5.2 0c0 1.8-2.6 2-2.6 3.8" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r=".9" fill="currentColor" stroke="none" />
            </svg>
          </aside>
        </div>
        <section className="cover-questions" aria-label="Research questions">
          <article className="research-question">
            <h2 className="content-heading">RQ1</h2>
            <p>
              How does GenAI affect mentoring across GSoC's pipeline, and what
              does it mean for the program's ability to renew itself?
            </p>
          </article>
          <article className="research-question">
            <h2 className="content-heading">RQ2</h2>
            <p>
              How do mentors and organizations respond, and what support do
              they expect from GSoC?
            </p>
          </article>
        </section>
      </section>
      <section className="study-overview" aria-labelledby="study-overview-title">
        <h2 className="eyebrow subheader" id="study-overview-title">How we built the findings</h2>
        <div className="study-phase-grid">
          <article className="study-phase study-phase-mailing" aria-labelledby="mailing-phase-title">
            <div className="study-phase-content">
              <span className="eyebrow subheader">Exploratory analysis</span>
              <h3 className="content-heading" id="mailing-phase-title">GSoC mentors’ mailing list</h3>
              <p className="study-phase-description">
                We screened all archived threads from Nov 2022 to Mar 2026 and analyzed the GenAI 
                discussions to surface mentoring concerns and responses.
              </p>
            </div>
            <div className="study-phase-visual">
              <img className="study-phase-icon" src={mailingListIcon} alt="" />
              <dl className="study-phase-metrics">
                <div><dt>Threads</dt><dd>15</dd></div>
                <div><dt>Replies</dt><dd>194</dd></div>
              </dl>
            </div>
            <p className="study-phase-output">Shaped the interview probes</p>
          </article>
          <div className="study-phase-connector" aria-hidden="true">
            <svg viewBox="0 0 40 24" fill="none"><path d="M2 12h34m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <article className="study-phase study-phase-interviews" aria-labelledby="interview-phase-title">
            <div className="study-phase-content">
              <span className="eyebrow subheader">Explanatory interviews</span>
              <h3 className="content-heading" id="interview-phase-title">Semi-structured interviews</h3>
              <p className="study-phase-description">
                Explained how GenAI-related concerns played out in mentoring practice, governance choices, and mentor capacity.
              </p>
            </div>
            <div className="study-phase-visual">
              <img className="study-phase-icon" src={interviewIcon} alt="" />
              <dl className="study-phase-metrics">
                <div><dt>Interviews</dt><dd>15</dd></div>
              </dl>
              <p className="study-phase-participants">GSoC mentors<br />and Org Admins</p>
            </div>
            <p className="study-phase-output">Developed impact findings and response strategies</p>
          </article>
        </div>
      </section>
      <section className="cover-contributions" aria-labelledby="contributions-title">
        <h2 className="eyebrow subheader" id="contributions-title">Our contributions</h2>
        <div className="cover-explore">
          <a className="explore-card" href="#/impacts">
            <h2 className="content-heading">
              Sustainability impacts across the mentoring cycle
              <img className="explore-card-icon" src={impactIcon} alt="" />
            </h2>
            <p>
              Trace how pressures compound from selection through review to
              contributor-to-mentor renewal, converging on mentor capacity.
            </p>
            <span className="explore-link">Explore GenAI impacts <span aria-hidden="true">→</span></span>
          </a>
          <a className="explore-card" href="#/strategies">
            <h2 className="content-heading">
              Building trust and governing GenAI
              <img className="explore-card-icon" src={strategyIcon} alt="" />
            </h2>
            <p>
              Explore strategies to assess applicants, govern GenAI use, and keep contributors accountable, 
              as well as the proposed program support.
            </p>
            <span className="explore-link">Explore GenAI strategies <span aria-hidden="true">→</span></span>
          </a>
          <a className="explore-card explore-aim" href="#/aim">
            <h2 className="content-heading">
              AIM: responses mentors can sustain
              <img className="explore-card-icon" src={aimIcon} alt="" />
            </h2>
            <p>
              Connect <strong>A</strong>cceptable GenAI use,{' '}
              <strong>I</strong>ntegration into the mentoring pipeline, and{' '}
              <strong>M</strong>entoring capacity to guide project decisions.
            </p>
            <span className="explore-link">Explore AIM <span aria-hidden="true">→</span></span>
          </a>
        </div>
      </section>
    </main>
  );
}
