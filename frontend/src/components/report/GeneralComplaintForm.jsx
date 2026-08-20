import { useState } from 'react';
import Icon from '../Icon';
import { CASE_TYPES, POLICE_STATIONS } from '../../data/mockCases';

const LABELS = {
  mobile_theft: { title: 'Mobile Theft Complaint', sub: 'Report a stolen phone or device', item: 'DEVICE DESCRIPTION', serial: 'IMEI NUMBER', hasVehicle: false, hasItem: true },
  chain_snatching: { title: 'Chain Snatching Complaint', sub: 'Report jewellery snatched', item: 'ITEM DESCRIPTION', serial: 'SERIAL / HALLMARK NO.', hasVehicle: false, hasItem: true },
  vehicle_theft: { title: 'Vehicle Theft Complaint', sub: 'Report a stolen car or bike', hasVehicle: true, hasItem: false },
  robbery: { title: 'Robbery Complaint', sub: 'Report a mugging or armed theft', item: 'ITEMS TAKEN', serial: 'SERIAL NO. (if any)', hasVehicle: false, hasItem: true },
  cybercrime: { title: 'Cybercrime Complaint', sub: 'Report online fraud or hacking', item: 'ACCOUNT / PLATFORM AFFECTED', serial: 'TRANSACTION / REFERENCE ID', hasVehicle: false, hasItem: true },
  burglary: { title: 'Burglary Complaint', sub: 'Report a break-in or house theft', item: 'ITEMS STOLEN', serial: 'SERIAL NO. (if any)', hasVehicle: false, hasItem: true },
  assault: { title: 'Assault Complaint', sub: 'Report physical violence', hasVehicle: false, hasItem: false },
  found_person: { title: 'Found Person Report', sub: 'Report someone you found', hasVehicle: false, hasItem: false },
  other: { title: 'General Complaint', sub: 'Describe the incident clearly', hasVehicle: false, hasItem: false },
};

export default function GeneralComplaintForm({ caseType, onSubmit, submitting }) {
  const meta = LABELS[caseType] || LABELS.other;
  const typeInfo = CASE_TYPES.find((c) => c.type === caseType);
  const [data, setData] = useState({});
  const [terms, setTerms] = useState(false);
  const set = (key) => (e) => setData((d) => ({ ...d, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data, terms);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="fstep on" data-step="1" style={{ display: 'block' }}>
        <div className="fsh">
          <div className="fsh-num">01 / 01</div>
          <div className="fsh-title">{typeInfo ? `${typeInfo.icon} ${meta.title}` : meta.title}</div>
          <div className="fsh-sub">{meta.sub}</div>
        </div>

        <div className="fi-row">
          <div className="fi">
            <label>
              COMPLAINANT NAME <span className="req">*</span>
            </label>
            <input type="text" value={data.rname || ''} onChange={set('rname')} placeholder="Your full name" required />
          </div>
          <div className="fi">
            <label>
              PHONE NUMBER <span className="req">*</span>
            </label>
            <input type="tel" value={data.rphone || ''} onChange={set('rphone')} placeholder="10-digit mobile number" required />
          </div>
          <div className="fi">
            <label>EMAIL</label>
            <input type="email" value={data.remail || ''} onChange={set('remail')} placeholder="your@email.com" />
          </div>
          <div className="fi">
            <label>YOUR ADDRESS</label>
            <input type="text" value={data.raddress || ''} onChange={set('raddress')} placeholder="Full address" />
          </div>
        </div>

        {caseType !== 'other' && (
          <>
            <div style={{ margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>VICTIM / OWNER DETAILS</span>
            </div>
            <div className="fi-row">
              <div className="fi">
                <label>NAME</label>
                <input type="text" value={data.victim_name || ''} onChange={set('victim_name')} placeholder="Victim or owner name" />
              </div>
              <div className="fi">
                <label>AGE</label>
                <input type="number" min="1" max="120" value={data.victim_age || ''} onChange={set('victim_age')} placeholder="Age" />
              </div>
              <div className="fi">
                <label>GENDER</label>
                <select value={data.victim_gender || ''} onChange={set('victim_gender')}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </>
        )}

        {meta.hasItem && (
          <>
            <div style={{ margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>{meta.item}</span>
            </div>
            <div className="fi-row">
              <div className="fi full">
                <label>DESCRIPTION</label>
                <input
                  type="text"
                  value={data.item_desc || ''}
                  onChange={set('item_desc')}
                  placeholder="e.g. Samsung Galaxy S23, Black colour"
                />
              </div>
              <div className="fi">
                <label>{meta.serial}</label>
                <input type="text" value={data.item_serial || ''} onChange={set('item_serial')} placeholder="Reference / serial number" />
              </div>
              <div className="fi">
                <label>ESTIMATED VALUE (₹)</label>
                <input type="text" value={data.item_value || ''} onChange={set('item_value')} placeholder="e.g. 25000" />
              </div>
            </div>
          </>
        )}

        {meta.hasVehicle && (
          <>
            <div style={{ margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>VEHICLE DETAILS</span>
            </div>
            <div className="fi-row">
              <div className="fi">
                <label>
                  VEHICLE NUMBER <span className="req">*</span>
                </label>
                <input
                  type="text"
                  value={data.vehicle_number || ''}
                  onChange={set('vehicle_number')}
                  placeholder="TN 32 AB 1234"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div className="fi">
                <label>VEHICLE TYPE</label>
                <select value={data.vehicle_type || ''} onChange={set('vehicle_type')}>
                  <option value="">Select</option>
                  <option>Two-Wheeler (Bike/Scooter)</option>
                  <option>Four-Wheeler (Car)</option>
                  <option>Auto Rickshaw</option>
                  <option>Lorry / Truck</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="fi">
                <label>MAKE & MODEL</label>
                <input type="text" value={data.vehicle_model || ''} onChange={set('vehicle_model')} placeholder="e.g. Honda Activa 6G, White" />
              </div>
            </div>
          </>
        )}

        <div style={{ margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>INCIDENT DETAILS</span>
        </div>
        <div className="fi-row">
          <div className="fi">
            <label>
              DATE OF INCIDENT <span className="req">*</span>
            </label>
            <input type="date" value={data.inc_date || ''} onChange={set('inc_date')} required />
          </div>
          <div className="fi">
            <label>TIME OF INCIDENT</label>
            <input type="time" value={data.inc_time || ''} onChange={set('inc_time')} />
          </div>
          <div className="fi full">
            <label>
              LOCATION OF INCIDENT <span className="req">*</span>
            </label>
            <input type="text" value={data.inc_location || ''} onChange={set('inc_location')} placeholder="Street, area, city where it happened" required />
          </div>
          <div className="fi full">
            <label>
              DESCRIBE WHAT HAPPENED <span className="req">*</span>
            </label>
            <textarea rows="4" value={data.inc_desc || ''} onChange={set('inc_desc')} placeholder="Describe the incident in detail..." required></textarea>
          </div>
        </div>

        <div style={{ margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>SUSPECT DESCRIPTION (if known)</span>
        </div>
        <div className="fi full">
          <label>SUSPECT DETAILS</label>
          <textarea
            rows="3"
            value={data.suspect || ''}
            onChange={set('suspect')}
            placeholder="Physical appearance, name, vehicle used, direction fled..."
          ></textarea>
        </div>

        <div style={{ margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '.08em' }}>POLICE STATION</span>
        </div>
        <div className="fi-row">
          <div className="fi full">
            <select value={data.station || ''} onChange={set('station')} style={{ width: '100%' }}>
              <option value="">Select police station...</option>
              {POLICE_STATIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="decl">
          <label className="decl-row">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <div className="dbox"></div>
            <div className="decl-txt">
              I declare that the information provided is true and accurate. I understand that filing a false report
              is punishable under <strong>Section 182 IPC</strong>.
            </div>
          </label>
        </div>

        <div className="sn" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-submit" disabled={submitting}>
            <Icon name="send" style={{ fontSize: 18 }} />
            {submitting ? 'SENDING...' : 'SEND COMPLAINT'}
          </button>
        </div>
      </div>
    </form>
  );
}
