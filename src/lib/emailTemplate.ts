import fs from 'fs';
import path from 'path';
import { ContactFormData } from '@/actions/ContactActions';

export function generateEmailHtml(data: ContactFormData): string {
  try {
    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'contact-email.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace placeholders with actual data
    const replacements: Record<string, string> = {
      '{{FIRST_NAME}}': data.firstName,
      '{{LAST_NAME}}': data.lastName,
      '{{EMAIL}}': data.email,
      '{{PHONE}}': data.phone,
      '{{SERVICE}}': data.service,
      '{{PROJECT_DESCRIPTION}}': data.projectDescription,
      '{{TIMESTAMP}}': new Date().toLocaleString('hr-HR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Zagreb'
      })
    };
    
    // Perform all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return htmlTemplate;
  } catch (error) {
    console.error('Error generating email HTML:', error);
    
    // Fallback to simple HTML if template fails
    return `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Nova poruka s kontakt forme</h2>
        <p><strong>Ime:</strong> ${data.firstName}</p>
        <p><strong>Prezime:</strong> ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Usluga:</strong> ${data.service}</p>
        <p><strong>Opis projekta:</strong></p>
        <p>${data.projectDescription}</p>
        <hr>
        <p><small>Ova poruka je poslana iz kontakt forme na web stranici.</small></p>
      </div>
    `;
  }
}