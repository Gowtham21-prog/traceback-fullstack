import { Fragment } from 'react';

const STEPS = [
  { n: 1, label: 'PERSON' },
  { n: 2, label: 'PHYSICAL' },
  { n: 3, label: 'LAST SEEN' },
  { n: 4, label: 'REPORTER' },
];

export default function StepProgress({ step }) {
  return (
    <div className="prog-wrap">
      <div className="prog-bar">
        {STEPS.map((s, i) => (
          <Fragment key={s.n}>
            <div className={`ps ${step === s.n ? 'on' : ''} ${step > s.n ? 'done' : ''}`} data-step={s.n}>
              <div className="ps-circle">{s.n}</div>
              <div className="ps-lbl">{s.label}</div>
            </div>
            {i < STEPS.length - 1 && <div className={`p-line ${step > s.n ? 'done' : ''}`}></div>}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
