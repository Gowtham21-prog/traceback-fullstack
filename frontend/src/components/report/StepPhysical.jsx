import Icon from '../Icon';

export default function StepPhysical({ data, onChange, onNext, onBack }) {
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <div className="fstep on" data-step="2">
      <div className="fsh">
        <div className="fsh-num">02 / 04</div>
        <div className="fsh-title">Physical Description</div>
        <div className="fsh-sub">Detailed physical characteristics for identification</div>
      </div>
      <div className="fg">
        <div className="fi">
          <label>HEIGHT</label>
          <select value={data.height || ''} onChange={set('height')}>
            <option value="">Select height</option>
            {['Below 4ft', '4ft - 4.5ft', '4.5ft - 5ft', '5ft - 5.3ft', '5.3ft - 5.6ft', '5.6ft - 5.9ft', '5.9ft - 6ft', 'Above 6ft'].map(
              (h) => (
                <option key={h}>{h}</option>
              )
            )}
          </select>
        </div>
        <div className="fi">
          <label>WEIGHT</label>
          <select value={data.weight || ''} onChange={set('weight')}>
            <option value="">Select weight</option>
            {['Below 30 kg', '30–45 kg', '45–55 kg', '55–65 kg', '65–75 kg', '75–90 kg', 'Above 90 kg'].map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="fi">
          <label>EYE COLOR</label>
          <select value={data.eye || ''} onChange={set('eye')}>
            <option value="">Select</option>
            {['Black', 'Dark Brown', 'Brown', 'Hazel', 'Green', 'Blue'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="fi">
          <label>HAIR COLOR</label>
          <select value={data.hair || ''} onChange={set('hair')}>
            <option value="">Select</option>
            {['Black', 'Dark Brown', 'Brown', 'Grey', 'White', 'Bald'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="fi">
          <label>COMPLEXION</label>
          <select value={data.complexion || ''} onChange={set('complexion')}>
            <option value="">Select</option>
            {['Very Fair', 'Fair', 'Wheatish', 'Brown', 'Dark Brown', 'Dark'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="fi">
          <label>BUILD</label>
          <select value={data.build || ''} onChange={set('build')}>
            <option value="">Select</option>
            {['Slim/Thin', 'Athletic', 'Average', 'Stocky/Stout', 'Heavy/Obese'].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="fi-divider"></div>
        <div className="fi full">
          <label>IDENTIFYING MARKS / SCARS / TATTOOS</label>
          <textarea
            rows="3"
            value={data.marks || ''}
            onChange={set('marks')}
            placeholder="Describe any birthmarks, scars, tattoos, or other unique physical features..."
          ></textarea>
        </div>
        <div className="fi full">
          <label>MEDICAL CONDITIONS / DISABILITIES (if any)</label>
          <textarea
            rows="2"
            value={data.medical || ''}
            onChange={set('medical')}
            placeholder="Any known medical conditions, mental health issues, or disabilities relevant to search..."
          ></textarea>
        </div>
      </div>
      <div className="sn">
        <button type="button" className="btn-prev" onClick={onBack}>
          <Icon name="arrow_back" />
          BACK
        </button>
        <button type="button" className="btn-next" onClick={() => onNext(data)}>
          NEXT: LAST SEEN
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  );
}
