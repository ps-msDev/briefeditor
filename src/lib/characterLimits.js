// Character limits for form fields
export const CHAR_LIMITS = {
  // Sender/Recipient Info
  name: 100,              // Name fields
  street: 80,             // Street addresses
  city: 50,               // City addresses
  phone: 20,              // Phone numbers
  email: 100,             // Email addresses
  
  // Letter Content
  subject: 150,           // Subject line
  salutation: 100,        // Salutation
  body: 5000,             // Main letter body (textarea)
  closing: 50,           // Closing line
  signature: 100,         // Signature name
  footerText: 500,       // Footer text
  
  // Legal Info
  companyName: 100,       // Company name
  registeredOffice: 40,   // Registered office city
  companyWebsite: 50,    // Website URL
  bankDetails: 100,       // Bank details (IBAN)
  vatId: 20,              // VAT ID
  managingDirectors: 100, // Managing directors names
  supervisoryBoard: 100,  // Supervisory board members
  registrationCourt: 40,  // Registration court
  hrbNumber: 20,          // HRB number
  date: 20,               // Date field
  
  // PDF Export
  pdfFilename: 100,       // PDF filename (without .pdf extension)
};

