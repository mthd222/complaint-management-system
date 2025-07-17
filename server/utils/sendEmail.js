const nodemailer = require('nodemailer');

// This function will hold our transporter configuration
let transporter;

// Create a single test account and transporter when the server starts
const setupEtherealTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  // 1. Create a new Ethereal test account
  let testAccount = await nodemailer.createTestAccount();

  console.log('************************************');
  console.log('ETHEREAL DEMO EMAIL ACCOUNT CREATED');
  console.log('User: %s', testAccount.user);
  console.log('Pass: %s', testAccount.pass);
  console.log('************************************');


  // 2. Create a transporter object using the Ethereal account
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter;
};


const sendEmail = async (options) => {
  // Ensure the transporter is ready
  const emailTransporter = await setupEtherealTransporter();

  const mailOptions = {
    from: '"Complaint System" <noreply@example.com>', // Sender address
    to: options.to,          // List of receivers
    subject: options.subject, // Subject line
    html: options.html,       // HTML body
  };

  // Send the email
  try {
    let info = await emailTransporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    // Log the URL to preview the sent email
    console.log('************************************');
    console.log('PREVIEW EMAIL AT THIS URL:');
    console.log(nodemailer.getTestMessageUrl(info));
    console.log('************************************');

  } catch (error) {
    console.error('Error sending demo email:', error);
  }
};

module.exports = sendEmail;