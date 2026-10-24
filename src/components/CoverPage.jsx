import aimIcon from '../assets/aim-icon.png';

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
            GenAI can facilitate OSS contribution production and GSoC mentoring, but it makes it harder to tell what newcomers actually understand. Mentors make up the difference by checking more, which drains the time and goodwill that keep them mentoring. This dashboard shows how these effects build across the mentoring pipeline, how mentors and organizations respond, and what support they want from GSoC. It also introduces AIM, a framework that helps organizations choose GenAI practices they can sustain by weighing what use is acceptable, when to step in, and how much mentoring capacity they have.
          </p>
        </div>
        <section className="cover-questions" aria-label="Research questions">
          <article className="research-question">
            <h2>RQ1</h2>
            <p>
              How does GenAI affect mentoring across GSoC's pipeline, and what
              does it mean for the program's ability to renew itself?
            </p>
          </article>
          <article className="research-question">
            <h2>RQ2</h2>
            <p>
              How do mentors and organizations respond, and what support do
              they expect from GSoC?
            </p>
          </article>
        </section>
      </section>
      <section className="cover-explore" aria-label="Explore the manuscript">
        <a className="explore-card" href="#/impacts">
          <h2>
            Impacts <span aria-hidden="true">↗</span>
          </h2>
          <p>
            Explore GenAI-related challenges, opportunities, and their
            connections to GSoC sustainability.
          </p>
        </a>
        <a className="explore-card" href="#/strategies">
          <h2>
            Strategies <span aria-hidden="true">↗</span>
          </h2>
          <p>
            Examine reported practices and proposals for establishing trust
            and governing GenAI use.
          </p>
        </a>
        <a className="explore-card explore-aim" href="#/aim">
          <h2>
            <span>
              <img src={aimIcon} alt="" /> AIM
            </span>
            <span aria-hidden="true">↗</span>
          </h2>
          <p>
            Explore a conceptual framework connecting <strong>Acceptable GenAI use</strong>,{' '}
            <strong>Integration into the mentoring pipeline</strong>, and{' '}
            <strong>Mentoring capacity</strong>.
          </p>
        </a>
      </section>
    </main>
  );
}
