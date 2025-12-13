// Attach smooth scrolling behavior for primary calls-to-action
const scheduleBtn = document.getElementById('scheduleBtn');
const detailsBtn = document.getElementById('detailsBtn');
const overviewSection = document.getElementById('overview');
const detailsPdfPath = 'Brochure.pdf';

const smoothScrollTo = (target) => {
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.pageYOffset - 20;
  window.scrollTo({ top, behavior: 'smooth' });
};

scheduleBtn?.addEventListener('click', () => {
  // Create message for WhatsApp
  const whatsappMessage = `Hello! I would like to schedule a visit to AR Properties. Please let me know the available time slots.`;
  
  // Send to your WhatsApp
  const whatsappUrl = `https://wa.me/919391610412?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Open WhatsApp directly
  window.open(whatsappUrl, '_blank');
});

// Download PDF when "Get More Details" is clicked
detailsBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!detailsPdfPath) return;
  const link = document.createElement('a');
  link.href = detailsPdfPath;
  link.download = 'Brochure.pdf';
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  document.body.appendChild(link);
  link.click();
  link.remove();
});

// Contact form submit -> send to Apps Script endpoint
const contactForm = document.getElementById('contactForm');
const contactEndpoint = 'https://script.google.com/macros/s/AKfycbxFbFH0vRxwBUMriuc8tVDRsGKxUL7Qz8C6V6G7cC01NXUQoiEp62Q7qnRwpieFX5AxmA/exec';

const sendContactForm = (event) => {
  event.preventDefault();
  if (!contactForm) return;
 const formData = new FormData(contactForm);

  fetch(contactEndpoint, {
    method: "POST",
    body: formData,
    mode: "no-cors"
  })
    .then(() => {
      alert("Form submitted successfully!");
      contactForm.reset();
    })
    .catch(err => console.error(err));
};

contactForm?.addEventListener('submit', sendContactForm);
