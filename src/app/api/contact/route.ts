import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, service, message, contactEmail } = data;

    // Use SMTP or a mock logging mechanism depending on env setup
    // Since we may not have an SMTP server configured yet, we will log and try to send.
    // If NEXT_PUBLIC_SMTP_HOST is missing, we will simulate a success but just log it.
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`, 
        to: contactEmail || 'hello@nexoloom.com', // fallback
        replyTo: email,
        subject: `New Lead: ${service} - ${name}`,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}
        `,
        html: `
          <h3>New Lead Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
          <br/>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      console.log("Email successfully dispatched via SMTP to", contactEmail);
    } else {
      console.log("-----------------------------------------");
      console.log("MOCK EMAIL SENT TO ADMIN:", contactEmail);
      console.log("-----------------------------------------");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("Service:", service);
      console.log("Message:", message);
      console.log("-----------------------------------------");
      console.log("Provide SMTP_HOST, SMTP_USER, SMTP_PASS in .env to send real emails.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in contact route:", error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
