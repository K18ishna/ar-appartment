// Attach smooth scrolling behavior for primary calls-to-action
const scheduleBtn = document.getElementById('scheduleBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
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
whatsappBtn?.addEventListener('click', () => {
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

// Floating Contact Popup Logic (vanilla JS)
(function () {
  const SUBMITTED_KEY = 'floatingFormSubmitted';
  const REAPPEAR_MS = 5000;
  const TYPING_GRACE_MS = 2000; // delay popup while user is typing

  const popup = document.getElementById('contactPopup');
  const closeBtn = document.getElementById('popupClose');
  const form = document.getElementById('floatingContactForm');
  const submitBtn = document.getElementById('fp-submit');
  const nameInput = document.getElementById('fp-name');
  const phoneInput = document.getElementById('fp-phone');
  const emailInput = document.getElementById('fp-email');
  const messageInput = document.getElementById('fp-message');

  if (!popup || !form) return;

  let showTimer = null;
  let typingTimer = null;
  let isTyping = false;
  let permanentlyHidden = false;

  const hasSubmitted = () => localStorage.getItem(SUBMITTED_KEY) === 'true';
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const openPopup = () => {
    if (hasSubmitted() || permanentlyHidden) return;
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
  };

  const closePopup = () => {
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
  };

  const schedulePopup = (delay = REAPPEAR_MS) => {
    clearTimeout(showTimer);
    if (hasSubmitted() || permanentlyHidden) return;
    showTimer = setTimeout(() => {
      if (isTyping) {
        // postpone while typing; reschedule after grace
        schedulePopup(TYPING_GRACE_MS);
      } else {
        openPopup();
      }
    }, delay);
  };

  // Prevent popup while typing anywhere (basic heuristic)
  const markTyping = () => {
    isTyping = true;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => { isTyping = false; }, TYPING_GRACE_MS);
  };
  document.addEventListener('keydown', markTyping, { passive: true });
  document.addEventListener('input', markTyping, { passive: true });

  // Inline validation utilities
  const setError = (input, message) => {
    const errEl = document.getElementById(`${input.id}-error`);
    if (!errEl) return;
    errEl.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) { setError(nameInput, 'Name is required.'); return false; }
    setError(nameInput, ''); return true;
  };

  const validatePhone = () => {
    const raw = phoneInput.value.trim();
    const digits = raw.replace(/\D/g, '');
    if (!digits) { setError(phoneInput, 'Phone number is required.'); return false; }
    if (digits.length < 7 || digits.length > 15) { setError(phoneInput, 'Enter 7-15 digits.'); return false; }
    setError(phoneInput, ''); return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!val) { setError(emailInput, 'Email is required.'); return false; }
    // Basic email format check
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok) { setError(emailInput, 'Enter a valid email.'); return false; }
    setError(emailInput, ''); return true;
  };

  const updateSubmitState = () => {
    const baseValid = validateName() && validatePhone();
    const valid = isMobile() ? baseValid : (baseValid && validateEmail());
    submitBtn.disabled = !valid;
  };

  // Attach validation handlers
  nameInput.addEventListener('input', () => { setError(nameInput, ''); updateSubmitState(); });
  phoneInput.addEventListener('input', () => { setError(phoneInput, ''); updateSubmitState(); });
  emailInput.addEventListener('input', () => { setError(emailInput, ''); updateSubmitState(); });
  nameInput.addEventListener('blur', validateName);
  phoneInput.addEventListener('blur', validatePhone);
  emailInput.addEventListener('blur', validateEmail);

  // Close button reappears after 5s unless submitted
  closeBtn?.addEventListener('click', () => {
    closePopup();
    schedulePopup(REAPPEAR_MS);
  });

  // Submit: log data, set localStorage, hide permanently
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const baseValid = validateName() && validatePhone();
    const fullValid = isMobile() ? baseValid : (baseValid && validateEmail());
    if (!fullValid) {
      updateSubmitState();
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: isMobile() ? 'Not provided' : emailInput.value.trim(),
      message: isMobile() ? 'Not provided' : messageInput.value.trim(),
      ts: new Date().toISOString(),
    };
    console.log('Floating contact form submitted:', payload);

    // Send via same Apps Script endpoint as main contact form
    try {
      const fd = new FormData();
      fd.append('name', payload.name);
      fd.append('phone', payload.phone);
      fd.append('email', payload.email);
      fd.append('message', payload.message);

      fetch(contactEndpoint, { method: 'POST', body: fd, mode: 'no-cors' })
        .then(() => {
          // Mark submitted and hide permanently
          localStorage.setItem(SUBMITTED_KEY, 'true');
          permanentlyHidden = true;
          clearTimeout(showTimer);
          closePopup();
        })
        .catch((err) => {
          console.error('Popup submit error:', err);
          // Still mark as submitted to avoid reappearing
          localStorage.setItem(SUBMITTED_KEY, 'true');
          permanentlyHidden = true;
          clearTimeout(showTimer);
          closePopup();
        });
    } catch (err) {
      console.error('Popup form build error:', err);
      localStorage.setItem(SUBMITTED_KEY, 'true');
      permanentlyHidden = true;
      clearTimeout(showTimer);
      closePopup();
    }
  });

  // Initial schedule (only if not submitted)
  if (!hasSubmitted()) {
    schedulePopup(REAPPEAR_MS);
  }
})();
