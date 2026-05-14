const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.TO_EMAIL || 'rom.guruji.tech@gmail.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name, whatsapp, email, business,
    package: pkg, pages, logo, domain, reference, notes
  } = req.body;

  const pagesList = Array.isArray(pages) ? pages.join(', ') : (pages || 'Not specified');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:sans-serif;background:#f5f5f5;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;">
    <div style="background:#080808;padding:24px 32px;">
      <div style="font-family:monospace;font-size:20px;font-weight:700;color:#f0ebe0;">
        script<span style="color:#e8c547;">.in</span>
      </div>
      <div style="color:#8a8070;font-size:12px;margin-top:4px;font-family:monospace;">New Order Request</div>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td colspan="2" style="padding:0 0 16px;font-size:18px;font-weight:700;color:#080808;border-bottom:2px solid #e8c547;">
          ${business || name}
        </td></tr>
        ${row('Name', name)}
        ${row('WhatsApp', whatsapp)}
        ${row('Email', email)}
        ${row('Business', business)}
        ${row('Package', pkg)}
        ${row('Pages Needed', pagesList)}
        ${row('Has Logo?', logo)}
        ${row('Has Domain?', domain)}
        ${row('Reference Sites', reference || '—')}
        ${row('Additional Notes', notes || '—')}
      </table>
      <div style="margin-top:24px;padding:16px;background:#fffbeb;border-left:3px solid #e8c547;font-size:13px;color:#555;">
        <strong>Next step:</strong> Reply to this email or WhatsApp ${whatsapp} with a payment link for 50% advance (${pkg === 'Multipage Website — ₹5,000' ? '₹2,500' : pkg === 'Landing Page — ₹2,500' ? '₹1,250' : 'TBD'}).
      </div>
    </div>
    <div style="background:#f5f5f5;padding:16px 32px;font-size:11px;color:#999;font-family:monospace;">
      Submitted via script.in order form · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    </div>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'script.in <onboarding@resend.dev>',
      to: [TO],
      reply_to: email,
      subject: `New Order: ${pkg || 'Website'} — ${business || name}`,
      html,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

function row(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;font-family:monospace;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;">${value || '—'}</td>
    </tr>`;
}
