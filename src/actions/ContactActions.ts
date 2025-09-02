"use server";

import nodemailer from "nodemailer";
import { generateEmailHtml } from "@/lib/emailTemplate";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  projectDescription: string;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("SMTP configuration is missing from environment variables");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // false for port 587
      requireTLS: true, // force TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    // Verify connection
    await transporter.verify();

    // Prepare email content
    const subject = `Nova poruka s web stranice od ${data.firstName} ${data.lastName}`;
    
    // Generate HTML content from template
    const htmlContent = generateEmailHtml(data);
    
    // Plain text fallback
    const textContent = `
Nova poruka s kontakt forme

Ime: ${data.firstName}
Prezime: ${data.lastName}
Email: ${data.email}
Telefon: ${data.phone}
Usluga: ${data.service}

Opis projekta:
${data.projectDescription}

Ova poruka je poslana iz kontakt forme na web stranici.
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"MSK Kontakt Forma" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to your own email
      replyTo: data.email, // Allow replying directly to the sender
      subject: subject,
      text: textContent.trim(),
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId,
      message: "Poruka je uspješno poslana!"
    };

  } catch (error) {
    console.error("Error sending email:", error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovno."
    };
  }
}