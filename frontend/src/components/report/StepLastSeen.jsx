import { useState } from 'react';
import Icon from '../Icon';
import { POLICE_STATIONS } from '../../data/mockCases';
import { useToast } from '../../hooks/useToast';

export default function StepLastSeen({ data, onChange, onNext, onBack }) {
  const { showToast } = useToast();
  const [stations, setStations] = useState(POLICE_STATIONS);
  const [detecting, setDetecting] = useState(false);
  const [locStatus, setLocStatus] = useState('');

  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  const detectNearby = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported.', 'warn');
      return;
    }
    setDetecting(true);
    setLocStatus('Requesting location access...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setLocStatus(`📍 (${lat.toFixed(3)}, ${lon.toFixed(3)}) — fetching stations...`);
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const geoData = await geoRes.json();
          const city = geoData.address?.city || geoData.address?.town || geoData.address?.county || '';
          const state = geoData.address?.state || '';
          const overpassQ = `[out:json][timeout:15];(node["amenity"="police"](around:10000,${lat},${lon});way["amenity"="police"](around:10000,${lat},${lon}););out center 15;`;
          const ovRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQ)}`);
          const ovData = await ovRes.json();
          const elements = ovData.elements || [];
          if (elements.length > 0) {
            const seen = new Set();
            const next = [];
            elements.forEach((el) => {
              const name = el.tags?.name || el.tags?.['name:en'] || 'Police Station';
              if (seen.has(name)) return;
              seen.add(name);
              const elLat = el.lat || el.center?.lat;
              const elLon = el.lon || el.center?.lon;
              let dist = '';
              if (elLat && elLon) {
                const d =
                  Math.round(
                    Math.sqrt(Math.pow((elLat - lat) * 111, 2) + Math.pow((elLon - lon) * 111 * Math.cos((lat * Math.PI) / 180), 2)) * 10
                  ) / 10;
                dist = ` (~${d}km)`;
              }
              const phone = el.tags?.phone || el.tags?.['contact:phone'] || '100';
              const email = el.tags?.email || el.tags?.['contact:email'] || 'police@tnpolice.gov.in';
              next.push({ label: `${name}${dist}`, value: `${name}|${email}|${phone}` });
            });
            setStations(next);
            showToast(`✅ Found ${elements.length} stations near you!`, 'info');
            setLocStatus(`✅ ${elements.length} stations near ${city}${city && state ? ', ' : ''}${state}`);
          } else {
            setLocStatus('No nearby stations found. Showing default list.');
          }
        } catch {
          setLocStatus('⚠️ Network error.');
          showToast('Could not fetch stations. Select manually.', 'warn');
        }
        setDetecting(false);
      },
      (err) => {
        const msgs = { 1: 'Location denied.', 2: 'Unavailable.', 3: 'Timed out.' };
        showToast(msgs[err.code] || 'Location error.', 'warn');
        setLocStatus('❌ ' + (msgs[err.code] || 'Error'));
        setDetecting(false);
      },
      { timeout: 12000, maximumAge: 60000 }
    );
  };

  return (
    <div className="fstep on" data-step="3">
      <div className="fsh">
        <div className="fsh-num">03 / 04</div>
        <div className="fsh-title">Last Seen Information</div>
        <div className="fsh-sub">Where and when was the person last seen?</div>
      </div>
      <div className="fg">
        <div className="fi">
          <label>
            DATE LAST SEEN <span className="req">*</span>
          </label>
          <input type="date" value={data.date || ''} onChange={set('date')} required />
        </div>
        <div className="fi">
          <label>TIME LAST SEEN</label>
          <input type="time" value={data.time || ''} onChange={set('time')} />
        </div>
        <div className="fi full">
          <label>
            LAST SEEN LOCATION <span className="req">*</span>
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={set('location')}
            placeholder="Specific location — area, landmark, or full address..."
            required
          />
        </div>
        <div className="fi full">
          <label>WHAT THEY WERE WEARING</label>
          <input type="text" value={data.wearing || ''} onChange={set('wearing')} placeholder="Color and type of clothing in detail..." />
        </div>
        <div className="fi full">
          <label>POSSIBLE DESTINATIONS / PLACES THEY FREQUENT</label>
          <textarea
            rows="2"
            value={data.places || ''}
            onChange={set('places')}
            placeholder="Schools, friends' houses, markets, temples, workplaces..."
          ></textarea>
        </div>
        <div className="fi-divider"></div>
        <div className="fi full">
          <label>
            NEAREST POLICE STATION <span className="req">*</span>
          </label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={detectNearby}
              disabled={detecting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0,217,255,.08)',
                color: 'var(--cyan)',
                border: '1px solid rgba(0,217,255,.28)',
                padding: '9px 18px',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'var(--fm)',
                fontSize: 10,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                opacity: detecting ? 0.6 : 1,
              }}
            >
              <Icon name="my_location" style={{ fontSize: 16, color: 'var(--cyan)' }} />
              {detecting ? 'DETECTING...' : 'AUTO-DETECT NEARBY STATIONS'}
            </button>
            <div style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--text3)', letterSpacing: '.8px' }}>{locStatus}</div>
          </div>
          <select value={data.station || ''} onChange={set('station')} required>
            <option value="">Select station closest to last seen location...</option>
            {stations.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="fi-hint">Click "Auto-Detect" to find nearest police stations based on GPS, or select manually</div>
        </div>
        <div className="fi full">
          <label>ADDITIONAL CIRCUMSTANCES / REASONS FOR DISAPPEARANCE</label>
          <textarea
            rows="4"
            value={data.description || ''}
            onChange={set('description')}
            placeholder="Any other relevant details — reasons, who they were with, suspicious activity, route they may have taken..."
          ></textarea>
        </div>
      </div>
      <div className="sn">
        <button type="button" className="btn-prev" onClick={onBack}>
          <Icon name="arrow_back" />
          BACK
        </button>
        <button type="button" className="btn-next" onClick={() => onNext(data)}>
          NEXT: YOUR DETAILS
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  );
}
