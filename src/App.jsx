import { useEffect, useRef, useState } from 'react';
import AiOrientationSection from './components/AiOrientationSection';
import DemographicsSection from './components/DemographicsSection';

const TABS = ['Intro', 'Challenges', 'Strategies', 'Qualities', 'Enduring Values'];
const INTRO_SLIDES = [
  { id: 'intro-research-status', label: 'Research Status' },
  { id: 'intro-who', label: 'Who We Interviewed' },
  { id: 'intro-ai-orientation', label: 'AI Orientation' },
];
const tabId = (tab) => tab.toLowerCase().replaceAll(' ', '-');

function Intro() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef(null);
  const activeSlideRef = useRef(0);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const observer = new ResizeObserver(() => {
      scroller.scrollTo({ left: activeSlideRef.current * scroller.clientWidth });
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  const goToSlide = (index) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    activeSlideRef.current = index;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: 'smooth' });
    setActiveSlide(index);
  };

  const syncActiveSlide = (event) => {
    const { clientWidth, scrollLeft } = event.currentTarget;
    if (!clientWidth) return;
    const nextSlide = Math.max(0, Math.min(INTRO_SLIDES.length - 1, Math.round(scrollLeft / clientWidth)));
    if (nextSlide !== activeSlideRef.current) {
      activeSlideRef.current = nextSlide;
      setActiveSlide(nextSlide);
    }
  };

  const navigateSlidesWithKeyboard = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToSlide(Math.min(activeSlide + 1, INTRO_SLIDES.length - 1));
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToSlide(Math.max(activeSlide - 1, 0));
    }
  };

  return (
    <main id="intro-panel" className="intro-page" role="tabpanel" aria-labelledby="intro-tab">
      <div
        ref={scrollerRef}
        className="intro-scroller"
        tabIndex={0}
        aria-label="Intro gallery. Use horizontal scrolling or the navigation dots to change sections."
        onScroll={syncActiveSlide}
        onKeyDown={navigateSlidesWithKeyboard}
      >
        <section
          id="intro-research-status"
          className="intro-slide research-slide"
          aria-labelledby="project-title"
        >
          <div className="slide-frame research-frame">
            <div className="research-copy">
              <h1 id="project-title">
                GSoC as AI-to-OSS Infrastructure:
                <em>Turning AI-Assisted Work into Sustainable Open Source Contribution</em>
              </h1>
              <p className="hero-copy">
                We examine how structured mentoring and accountability in GSoC shape AI-assisted output into 
                maintainable contributions and longer-term participation in open source.
              </p>
            </div>

            <div className="research-stages">
              <span className="section-kicker research-status-label">01 · Research status</span>
              <h2>From interviews to a traceable code structure</h2>
              <div className="coding-map" aria-label="Major research stages">
                <div className="coding-step">
                  <span>01</span>
                  <strong>15 interviews</strong>
                  <p>Semi-structured conversations with sampled GSoC mentors and administrators</p>
                </div>
                <div className="coding-step">
                  <span>02</span>
                  <strong>Preliminary open coding</strong>
                  <p>Interview material organized into five empirical codebooks</p>
                </div>
                <div className="coding-step">
                  <span>03</span>
                  <strong>Literature scaffold</strong>
                  <p>An independent codebook defines the full GSoC mentoring pipeline based on previous literature</p>
                </div>
                <div className="coding-step">
                  <span>04</span>
                  <strong>Interactive synthesis</strong>
                  <p>The dashboard turns the preliminary code structure into interactive traceable views</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DemographicsSection />
        <AiOrientationSection />
      </div>

      <nav className="intro-dots" aria-label="Intro sub-pages">
        {INTRO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show ${slide.label}`}
            aria-controls={slide.id}
            aria-current={activeSlide === index ? 'step' : undefined}
            onClick={() => goToSlide(index)}
          >
            <span className="sr-only">{slide.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function Placeholder({ tab }) {
  return (
    <main
      id={`${tabId(tab)}-panel`}
      className="page placeholder"
      role="tabpanel"
      aria-labelledby={`${tabId(tab)}-tab`}
    >
      <span className="section-kicker">Next research view</span>
      <h1>{tab}</h1>
      <p>This tab is reserved for the next implementation stage.</p>
    </main>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Intro');
  const tabRefs = useRef([]);

  const activateTabFromKeyboard = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + TABS.length) % TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TABS.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    setActiveTab(TABS[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      <header className="site-header">
        <a
          className="brand"
          href="#main-content"
          aria-label="GSoC AI-to-OSS home"
          onClick={() => setActiveTab('Intro')}
        >
          <span className="brand-mark" aria-hidden="true">G</span>
          <span>GSoC AI-to-OSS</span>
        </a>
        <nav className="tabs" aria-label="Dashboard sections" role="tablist">
          {TABS.map((tab, index) => {
            const id = tabId(tab);
            return (
              <button
                id={`${id}-tab`}
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${id}-panel`}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(event) => activateTabFromKeyboard(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </header>
      <div id="main-content">{activeTab === 'Intro' ? <Intro /> : <Placeholder tab={activeTab} />}</div>
    </>
  );
}
