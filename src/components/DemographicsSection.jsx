import { useMemo } from 'react';
import { rollup } from 'd3';
import DistributionChart from './DistributionChart';
import {
  orgSizeOrder,
  participants,
  roleOrder,
  tenureOrder,
} from '../data/demographics';

const ORGANIZATION_SIZE_NOTE = [
  { label: 'Small', definition: '<10 regular contributors' },
  { label: 'Medium', definition: '10-50 regular contributors' },
  { label: 'Large', definition: '51-200 regular contributors' },
  { label: 'Very Large', definition: '>200 regular contributors' },
];

function summarize(field, order) {
  const counts = rollup(participants, (group) => group.length, (participant) => participant[field]);
  return order.map((label) => ({ label, count: counts.get(label) ?? 0 }));
}

export default function DemographicsSection() {
  const distributions = useMemo(
    () => ({
      roles: summarize('role', roleOrder),
      tenure: summarize('mentorTenure', tenureOrder),
      orgSize: summarize('orgSize', orgSizeOrder),
    }),
    [],
  );

  return (
    <section
      id="intro-who"
      className="intro-slide interview-slide"
      aria-labelledby="demographics-title"
    >
      <div className="slide-frame interview-frame">
        <header className="slide-heading interview-heading">
          <div>
            <span className="section-kicker">02 · Who we interviewed</span>
            <h2 id="demographics-title">A purposive, maximum-variation interview sample</h2>
          </div>
          <p>
            From 132 GSoC mentors and organization administrators who completed a pre-survey, we
            purposively selected 15 interviewees to maximize variation in role, mentoring tenure,
            organization size, and AI stance. The sampling targets analytical breadth, not statistical
            representativeness.
          </p>
        </header>

        <div className="sample-facts" aria-label="Sampling summary">
          <div><strong>132</strong><span>Pre-survey Respondents</span></div>
          <div><strong>15</strong><span>Interview Participants</span></div>
          <div><strong>3</strong><span>GSoC Role Profiles</span></div>
          <div><strong>4</strong><span>Organization Scales</span></div>
        </div>

        <div className="chart-grid chart-grid-three interview-charts">
          <DistributionChart
            title="GSoC role"
            description="Role in the GSoC 2026"
            data={distributions.roles}
            color="#99c1de"
            compact
          />
          <DistributionChart
            title="Mentoring tenure"
            description="Mentoring experience in OSS"
            data={distributions.tenure}
            color="#9fcac7"
            compact
          />
          <DistributionChart
            title="Organization size"
            description="Normalized organization scales"
            data={distributions.orgSize}
            color="#e6c8b8"
            infoNote={ORGANIZATION_SIZE_NOTE}
            compact
          />
        </div>

        <aside className="sampling-warning" aria-labelledby="limitation-title">
          <span aria-hidden="true">!</span>
          <p>
            <strong id="limitation-title">Gender representation is highly uneven:</strong>{' '}
            The interview sample consists of 14 male and 1 non-binary participants. Women and
            other gender groups are underrepresented.
          </p>
        </aside>
      </div>
    </section>
  );
}
