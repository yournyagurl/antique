import emailModel from '../models/email.model.js';
import enquiryModel from '../models/enquiry.model.js';
import transporter from '../lib/nodeemailer.js';

export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await emailModel.create({ email });
    res.status(200).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while subscribing.' });
  }
};

export const notifySubscribers = async (product) => {
    const emails = await emailModel.find({});
    
    // Ensure the product has images and pick the first one
    const productImageUrl = Array.isArray(product.image) && product.image.length > 0 
        ? product.image[0]  // Use the first image URL
        : "https://yourwebsite.com/default-image.jpg";  // Fallback image  

    for (let { email } of emails) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: `✨ New Product Alert: ${product.name}!`,
                html: `
                  <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1>🌿 New Arrival: ${product.name}</h1>
                    <img src="${productImageUrl}" alt="${product.name}" style="max-width:350px; margin:20px; border-radius: 8px;">
                    <br><br>
                    <a href="https://yourwebsite.com/product/${product._id}" 
                       style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
                      View Product
                    </a>
                  </div>
                `,
            });
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
        }
    }
};



export const sendEnquiry = async (req, res) => {
  const { firstName, lastName, email, phone, postcode, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
  }

  try {
    const newEnquiry = new enquiryModel({ firstName, lastName, email, phone, postcode, message });
    await newEnquiry.save();

    // Email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Enquiry Received',
      html: `
        Hello ${firstName},<br/><br/>
        Thank you for reaching out!<br/><br/>
        We appreciate you taking the time to get in touch with us. Our team is currently reviewing your message, and we will get back to you shortly with a response.<br/><br/>
        Regards,<br/>
        Stokes Interiors and Collectibles<br/>
      `,
    });

    // Email to business owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Enquiry Received',
      text: `New enquiry received from ${firstName} ${lastName}.
Email: ${email}
Phone: ${phone}
Postcode: ${postcode}

Message:
${message}`,
    });

    res.json({ success: true, message: 'Enquiry submitted successfully!' });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

