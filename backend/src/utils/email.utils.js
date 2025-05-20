// utils/email.utils.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendJoinPoolEmail = async ({ to, userName, poolName, creatorName }) => {
    const msg = {
        to, // user who requested to join
        from: 'no-reply@poolconnect.com', // or your verified sender
        subject: `You've been accepted to the pool: ${poolName}`,
        html: `
      <h2>🎉 You're in!</h2>
      <p>Hi ${userName},</p>
      <p>Your request to join the pool <strong>${poolName}</strong> created by <strong>${creatorName}</strong> has been accepted.</p>
      <p>You're now a member. Check the app to view pool details and connect with others!</p>
      <p>See you there!</p>
    `
    };

    try {
        await sgMail.send(msg);
        console.log(`Join confirmation email sent to ${to}`);
    } catch (error) {
        console.error('Error sending join confirmation email:', error.response?.body || error.message);
    }
};
