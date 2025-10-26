// Character limits for form fields
export const CHAR_LIMITS = {
  // Sender Info (displayed as single line "name | street | city")
  senderName: 25,        // Sender name (can be longer since it wraps)
  senderStreet: 40,      // Sender street (can be longer since it wraps)
  senderCity: 40,        // Sender city (can be longer since it wraps)
  
  // Recipient Info (displayed as separate lines)
  recipientName: 50,      // Recipient name (single line)
  recipientAddressSupplement: 80,  // Recipient address supplement (Adresszusatz) - between name and street
  recipientStreet: 50,    // Recipient street (single line)
  recipientCity: 50,      // Recipient city (single line)
  
  // Shared info
  name: 25,              // Name fields (legacy, kept for compatibility)
  street: 45,            // Street addresses (legacy, kept for compatibility)
  city: 40,              // City addresses (legacy, kept for compatibility)
  phone: 30,             // Phone numbers
  email: 40,             // Email addresses
  
  // Letter Content
  subject: 150,           // Subject line
  salutation: 150,        // Salutation
  body: 1500,             // Main letter body (textarea)
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

