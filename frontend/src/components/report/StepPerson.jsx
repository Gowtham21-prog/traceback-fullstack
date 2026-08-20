import { useState } from 'react';
import Icon from '../Icon';
import { uploadPhoto } from '../../lib/api';
import { useToast } from '../../hooks/useToast';

export default function StepPerson({ data, onChange, onNext }) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  const onPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show an instant local preview while the real upload happens in the background.
    const previewReader = new FileReader();
    previewReader.onload = (ev) => onChange((prev) => ({ ...prev, photoPreview: ev.target.result }));
    previewReader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await uploadPhoto(file);
      if (res.success) {
        onChange((prev) => ({ ...prev, photo: res.url }));
      } else {
        showToast('Photo upload failed. You can continue without it.', 'warn');
      }
    } catch (err) {
      showToast(err.message || 'Photo upload failed. You can continue without it.', 'warn');
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = data.photoPreview || data.photo;

  return (
    <div className="fstep on" data-step="1">
      <div className="fsh">
        <div className="fsh-num">01 / 04</div>
        <div className="fsh-title">Personal Information</div>
        <div className="fsh-sub">Basic details about the missing person</div>
      </div>

      {!previewSrc ? (
        <label className="photo-area" htmlFor="photoInput">
          <input type="file" id="photoInput" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={onPhoto} />
          <div className="pu-ico">
            <Icon name="add_photo_alternate" style={{ fontSize: 32, color: 'var(--text3)' }} />
          </div>
          <div className="pu-t">Upload Photo</div>
          <div className="pu-s">JPG, PNG, WEBP up to 8MB · Click to browse</div>
        </label>
      ) : (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img className="photo-prev" src={previewSrc} alt="Preview" style={{ display: 'block', opacity: uploading ? 0.5 : 1 }} />
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="hourglass_top" style={{ fontSize: 22, color: 'var(--blue)' }} />
            </div>
          )}
        </div>
      )}

      <div className="fg">
        <div className="fi full">
          <label>
            FULL NAME <span className="req">*</span>
          </label>
          <input type="text" value={data.name || ''} onChange={set('name')} placeholder="Full name of the missing person" required />
        </div>
        <div className="fi">
          <label>AGE</label>
          <input type="number" min="0" max="120" value={data.age || ''} onChange={set('age')} placeholder="Age in years" />
        </div>
        <div className="fi">
          <label>GENDER</label>
          <select value={data.gender || ''} onChange={set('gender')}>
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Transgender</option>
            <option>Other</option>
          </select>
        </div>
        <div className="fi">
          <label>DATE OF BIRTH</label>
          <input type="date" value={data.dob || ''} onChange={set('dob')} />
        </div>
        <div className="fi">
          <label>BLOOD GROUP</label>
          <select value={data.blood || ''} onChange={set('blood')}>
            <option value="">Select</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="fi">
          <label>AADHAAR / ID NUMBER (Optional)</label>
          <input type="text" value={data.aadhar || ''} onChange={set('aadhar')} placeholder="Last 4 digits only for identification" />
        </div>
        <div className="fi">
          <label>SPOKEN LANGUAGE</label>
          <select value={data.lang || ''} onChange={set('lang')}>
            <option value="">Select</option>
            {['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi', 'English', 'Other'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sn" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn-next" onClick={() => onNext(data)}>
          NEXT: PHYSICAL DESCRIPTION
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  );
}
