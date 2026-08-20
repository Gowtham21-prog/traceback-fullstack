import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import CaseTypeSelector from '../components/CaseTypeSelector';
import StepProgress from '../components/StepProgress';
import StepPerson from '../components/report/StepPerson';
import StepPhysical from '../components/report/StepPhysical';
import StepLastSeen from '../components/report/StepLastSeen';
import StepReporter from '../components/report/StepReporter';
import GeneralComplaintForm from '../components/report/GeneralComplaintForm';
import SuccessModal from '../components/SuccessModal';
import PosterModal from '../components/PosterModal';
import { useToast } from '../hooks/useToast';
import { createCase } from '../lib/api';
import { buildComplaintText, mailtoUrl, whatsappShareForCase } from '../lib/complaint';

export default function Report() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [caseType, setCaseType] = useState('missing_person');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [person, setPerson] = useState({});
  const [physical, setPhysical] = useState({});
  const [lastSeen, setLastSeen] = useState({});
  const [reporter, setReporter] = useState({});

  const [successOpen, setSuccessOpen] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [savedCase, setSavedCase] = useState(null);
  const [complaintText, setComplaintText] = useState('');

  const resetMissingPersonForm = () => {
    setStep(1);
    setPerson({});
    setPhysical({});
    setLastSeen({});
    setReporter({});
  };

  const submitMissingPerson = async (reporterData, termsAccepted) => {
    if (!termsAccepted) {
      showToast('Please accept the declaration to continue.', 'warn');
      return;
    }
    if (!person.name) {
      showToast('Please fill in the missing person\u2019s name.', 'warn');
      return;
    }
    if (!lastSeen.location || !lastSeen.date) {
      showToast('Please complete the last seen details.', 'warn');
      return;
    }
    if (!reporterData.name || !reporterData.phone) {
      showToast('Please provide your name and phone number.', 'warn');
      return;
    }

    setSubmitting(true);
    const stationRaw = lastSeen.station || '';
    const [stName, stEmail, stPhone] = stationRaw.split('|');
    const station = { name: stName || 'Police Station', email: stEmail || 'police@tnpolice.gov.in', phone: stPhone || '' };

    const payload = {
      case_type: 'missing_person',
      full_name: person.name,
      age: parseInt(person.age, 10) || null,
      gender: person.gender,
      dob: person.dob,
      blood_group: person.blood,
      photo: person.photo || '',
      status: 'missing',
      last_seen_location: lastSeen.location,
      last_seen_date: lastSeen.date,
      last_seen_time: lastSeen.time,
      last_seen_wearing: lastSeen.wearing,
      height: physical.height,
      weight: physical.weight,
      eye_color: physical.eye,
      hair_color: physical.hair,
      complexion: physical.complexion,
      build: physical.build,
      identifying_marks: physical.marks,
      medical: physical.medical,
      description: lastSeen.description,
      places: lastSeen.places,
      reporter_name: reporterData.name,
      reporter_phone: reporterData.phone,
      reporter_phone2: reporterData.phone2,
      reporter_relation: reporterData.relation,
      reporter_email: reporterData.email,
      reporter_address: reporterData.address,
      police_station: station.name,
      police_email: station.email,
      police_phone: station.phone,
    };

    try {
      const res = await createCase(payload);
      const caseNo = res.report_number || res.data?.report_number;
      const text = buildComplaintText({
        caseNo,
        station,
        person: { name: person.name, age: person.age, gender: person.gender, dob: person.dob, blood: person.blood },
        physical,
        lastSeen,
        reporter: reporterData,
      });

      window.location.href = mailtoUrl(station.email, `\uD83D\uDEA8 URGENT: Missing Person Report - ${person.name} | Case ${caseNo}`, text);

      setComplaintText(text);
      setSavedCase({ ...res.data, id: res.data?.id || res.data?._id });
      showToast('✅ Case saved!', 'success');
      setSuccessOpen(true);
      resetMissingPersonForm();
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const submitGeneralComplaint = async (data, termsAccepted) => {
    if (!termsAccepted) {
      showToast('Please accept the declaration to continue.', 'warn');
      return;
    }
    setSubmitting(true);
    const stationRaw = data.station || '';
    const [stName, stEmail, stPhone] = stationRaw.split('|');

    const payload = {
      case_type: caseType,
      full_name: data.victim_name || data.rname,
      status: 'investigating',
      reporter_name: data.rname,
      reporter_phone: data.rphone,
      reporter_email: data.remail,
      reporter_address: data.raddress,
      incident_date: data.inc_date,
      incident_time: data.inc_time,
      incident_location: data.inc_location,
      incident_description: data.inc_desc,
      item_description: data.item_desc,
      item_serial: data.item_serial,
      item_value: data.item_value,
      vehicle_number: data.vehicle_number,
      vehicle_type: data.vehicle_type,
      vehicle_model: data.vehicle_model,
      suspect_description: data.suspect,
      police_station: stName || 'Police Station',
      police_email: stEmail || 'police@tnpolice.gov.in',
      police_phone: stPhone || '',
    };

    try {
      const res = await createCase(payload);
      const caseNo = res.report_number || res.data?.report_number;
      setSavedCase({ ...res.data, id: res.data?.id || res.data?._id });
      setComplaintText(`Complaint ${caseNo} filed for ${payload.full_name || 'complainant'}.\nIncident: ${data.inc_desc || ''}`);
      showToast('✅ Complaint filed!', 'success');
      setSuccessOpen(true);
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-offset">
      <div className="rp-header">
        <div className="rp-inner">
          <button className="back-btn" onClick={() => navigate('/')}>
            <Icon name="arrow_back" style={{ fontSize: 14 }} />
            BACK
          </button>
          <div className="sec-eyebrow" style={{ marginBottom: 10 }}>
            SECURE REPORT
          </div>
          <h1 className="rp-h">
            FILE <em>COMPLAINT</em>
          </h1>
          <p className="rp-sub">
            All information is securely processed and dispatched to the selected police station as an official
            complaint under Section 154 CrPC.
          </p>
        </div>
      </div>

      <CaseTypeSelector value={caseType} onChange={setCaseType} />

      {caseType === 'missing_person' ? (
        <>
          <StepProgress step={step} />
          <div className="form-body">
            {step === 1 && <StepPerson data={person} onChange={setPerson} onNext={() => setStep(2)} />}
            {step === 2 && <StepPhysical data={physical} onChange={setPhysical} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <StepLastSeen data={lastSeen} onChange={setLastSeen} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && (
              <StepReporter
                data={reporter}
                onChange={setReporter}
                onBack={() => setStep(3)}
                onSubmit={submitMissingPerson}
                submitting={submitting}
              />
            )}
          </div>
        </>
      ) : (
        <div className="form-body">
          <GeneralComplaintForm caseType={caseType} onSubmit={submitGeneralComplaint} submitting={submitting} />
        </div>
      )}

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        caseNo={savedCase?.report_number}
        complaintText={complaintText}
        onViewCases={() => {
          setSuccessOpen(false);
          navigate('/search');
        }}
        onGoHome={() => {
          setSuccessOpen(false);
          navigate('/');
        }}
        onMakePoster={() => {
          setSuccessOpen(false);
          setPosterOpen(true);
        }}
        onWhatsApp={() => savedCase && whatsappShareForCase(savedCase)}
      />

      <PosterModal open={posterOpen} onClose={() => setPosterOpen(false)} caseData={savedCase} />
    </div>
  );
}
