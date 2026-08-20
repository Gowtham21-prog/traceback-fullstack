export function buildComplaintText({ caseNo, station, person, physical, lastSeen, reporter }) {
  const bar = '━'.repeat(40);
  return `TRACEBACK — MISSING PERSON COMPLAINT
Case Number: ${caseNo}
Filed: ${new Date().toLocaleString('en-IN')} IST
${bar}

TO: ${station.name}
${station.phone ? 'Phone: ' + station.phone + '\n' : ''}
This is an official missing person complaint. Please initiate search procedures immediately as per Section 154 CrPC.

${bar}
MISSING PERSON DETAILS
${bar}
Full Name:   ${person.name}
Age:         ${person.age || 'Unknown'}
Gender:      ${person.gender || 'Unknown'}
DOB:         ${person.dob || 'Unknown'}
Blood Group: ${person.blood || 'Unknown'}

${bar}
PHYSICAL DESCRIPTION
${bar}
Height:      ${physical.height || 'Unknown'}
Weight:      ${physical.weight || 'Unknown'}
Eye Color:   ${physical.eye || 'Unknown'}
Hair Color:  ${physical.hair || 'Unknown'}
Complexion:  ${physical.complexion || 'Unknown'}
Build:       ${physical.build || 'Unknown'}
ID Marks:    ${physical.marks || 'None'}
${physical.medical ? 'Medical:     ' + physical.medical + '\n' : ''}
${bar}
LAST SEEN
${bar}
Date:        ${lastSeen.date || 'Unknown'}
Time:        ${lastSeen.time || 'Unknown'}
Location:    ${lastSeen.location || 'Unknown'}
Wearing:     ${lastSeen.wearing || 'Unknown'}
${lastSeen.places ? 'Places:      ' + lastSeen.places + '\n' : ''}
${lastSeen.description ? 'Details:\n' + lastSeen.description + '\n\n' : ''}
${bar}
REPORTER DETAILS
${bar}
Name:        ${reporter.name}
Relation:    ${reporter.relation || 'Unknown'}
Phone:       ${reporter.phone}${reporter.phone2 ? ' / ' + reporter.phone2 : ''}
Email:       ${reporter.email || 'N/A'}
Address:     ${reporter.address || 'Not provided'}

Please contact ${reporter.phone} for more information.
Filed via TraceBack Portal · Case: ${caseNo}
Portal: TraceBack Missing Persons Registry
${bar}`;
}

export function mailtoUrl(stationEmail, subject, body) {
  return `mailto:${stationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappShareForCase(c) {
  const text = `🚨 *MISSING PERSON ALERT* 🚨

*Name:* ${c.full_name}
${c.age ? '*Age:* ' + c.age + ' years\n' : ''}${c.gender ? '*Gender:* ' + c.gender + '\n' : ''}${
    c.last_seen_location ? '*Last Seen:* ' + c.last_seen_location + '\n' : ''
  }${c.last_seen_date ? '*Date:* ' + c.last_seen_date + '\n' : ''}${
    c.last_seen_wearing ? '*Wearing:* ' + c.last_seen_wearing + '\n' : ''
  }
*Contact reporter:* 📞 ${c.reporter_phone || 'Police 100'}

*Case No:* ${c.report_number}
*Filed via TraceBack Portal*

🙏 _Please share widely — every share can save a life_
📞 Police Emergency: 100`;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

export function whatsappSOS() {
  const text = `🚨 *EMERGENCY — MISSING PERSON*

I need help! Someone is missing.

Please call Police: 100
Child Helpline: 1098
Emergency: 112

_Sent via TraceBack Missing Persons Portal_`;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

export function printComplaint(caseNo, text) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<html><head><title>Missing Person Complaint - ${caseNo}</title>
<style>body{font-family:monospace;font-size:13px;padding:40px;max-width:700px;margin:0 auto}
pre{white-space:pre-wrap;line-height:1.8}
h1{font-size:16px;margin-bottom:20px}
@media print{button{display:none}}
</style></head><body>
<button onclick="window.print()" style="margin-bottom:20px;padding:8px 16px;background:#1a90f5;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px">🖨️ Print</button>
<pre>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`);
  win.document.close();
}

export function posterText(c) {
  return `⚠️ MISSING PERSON ⚠️

${(c.full_name || '').toUpperCase()}
${c.age ? 'Age: ' + c.age : ''}${c.gender ? ' | ' + c.gender : ''}

Last Seen: ${c.last_seen_date || 'Unknown'}
Location: ${c.last_seen_location || 'Unknown'}
${c.last_seen_wearing ? 'Wearing: ' + c.last_seen_wearing + '\n' : ''}
IF YOU HAVE INFORMATION:
📞 ${c.reporter_phone || 'Police 100'}

Case: ${c.report_number}`;
}

export function printPosterElement(el) {
  if (!el) return;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<html><head><title>Missing Person Poster</title><style>
body{font-family:sans-serif;display:flex;justify-content:center;padding:40px}
@media print{button{display:none}}
</style></head><body>
<div>
<button onclick="window.print()" style="margin-bottom:20px;padding:8px 16px;background:#dc2626;color:#fff;border:none;border-radius:6px;cursor:pointer">🖨️ Print Poster</button>
${el.outerHTML}
</div></body></html>`);
  win.document.close();
}
