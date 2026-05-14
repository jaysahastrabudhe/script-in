const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.TO_EMAIL || 'rom.guruji.tech@gmail.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name, whatsapp, company, projectType, productCount,
    paymentGateway, features, budget, timeline, description
  } = req.body;

  const featuresList = Array.isArray(features) ? features.join(', ') : (features || 'None specified');

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
      <div style="color:#8a8070;font-size:12px;margin-top:4px;font-family:monospace;">Custom Quote Request</div>
    </div>
    <div style="padding:32px;">
      <div style="background:#080808;padding:16px 20px;margin-bottom:24px;">
        <div style="font-family:monospace;font-size:22px;font-weight:700;color:#e8c547;">${budget || 'Budget TBD'}</div>
        <div style="font-size:12px;color:#888;margin-top:2px;">${projectType || 'Custom Project'} · ${timeline || 'Timeline TBD'}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td colspan="2" style="padding:0 0 16px;font-size:18px;font-weight:700;color:#080808;border-bottom:2px solid #e8c547;">
          ${company || name}
        </td></tr>
        ${row('Name', name)}
        ${row('WhatsApp', whatsapp)}
        ${row('Company', company)}
        ${row('Project Type', projectType)}
        ${row('Scale', productCount)}
        ${row('Payment Gateway', paymentGateway)}
        ${row('Features', featuresList)}
        ${row('Budget', budget)}
        ${row('Timeline', timeline)}
        ${row('Project Description', description)}
      </table>
    </div>
    <div style="background:#f5f5f5;padding:16px 32px;font-size:11px;color:#999;font-family:monospace;">
      Submitted via script.in custom quote form · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    </div>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'script.in <onboarding@resend.dev>',
      to: [TO],
      reply_to: whatsapp,
      subject: `Custom Quote: ${projectType || 'Project'} — ${company || name} (${budget || 'Budget TBD'})`,
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
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;font-family:monospace;width:160px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;">${value || '—'}</td>
    </tr>`;
}
