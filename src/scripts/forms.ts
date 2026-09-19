/**
 * Shared behavior for the event and rental forms (Formspree).
 * - Validates fields and shows messages next to them
 * - Sends with fetch so the visitor stays on the page
 * - Honeypot field "_gotcha" stops most spam bots (Formspree drops those submissions)
 * - Clear success and error states, announced to screen readers
 */

const messages: Record<string, string> = {
  valueMissing: 'Please fill this in.',
  typeMismatch: 'Please check the format.',
  patternMismatch: 'Please check the format.',
  rangeUnderflow: 'That number is too low.',
  rangeOverflow: 'That number is too high.',
  badInput: 'Please enter a number.',
};

function errorFor(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const v = field.validity;
  if (v.valid) return '';
  if (field.dataset.message) return field.dataset.message;
  if (v.typeMismatch && field.type === 'email') return 'Please enter a valid email, like name@example.com.';
  for (const key of Object.keys(messages)) {
    if (v[key as keyof ValidityState]) return messages[key];
  }
  return 'Please check this field.';
}

function showError(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const msg = errorFor(field);
  const id = `${field.id}-error`;
  let el = document.getElementById(id);
  if (msg) {
    if (!el) {
      el = document.createElement('p');
      el.id = id;
      el.className = 'field-error';
      field.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', [field.dataset.describedby, id].filter(Boolean).join(' '));
  } else {
    el?.remove();
    field.removeAttribute('aria-invalid');
    if (field.dataset.describedby) field.setAttribute('aria-describedby', field.dataset.describedby);
    else field.removeAttribute('aria-describedby');
  }
  return !msg;
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-formspree]:not([data-bound])').forEach((form) => {
    form.dataset.bound = '';
    form.noValidate = true;
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const fields = () =>
      [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')]
        .filter((f) => f.name !== '_gotcha' && f.type !== 'hidden' && f.type !== 'checkbox');

    fields().forEach((f) => {
      if (f.getAttribute('aria-describedby')) f.dataset.describedby = f.getAttribute('aria-describedby')!;
      f.addEventListener('blur', () => { if (f.value || f.hasAttribute('aria-invalid')) showError(f); });
      f.addEventListener('input', () => { if (f.hasAttribute('aria-invalid')) showError(f); });
    });

    const setStatus = (kind: 'success' | 'error' | 'sending' | '', html = '') => {
      if (!status) return;
      status.dataset.kind = kind;
      status.innerHTML = html;
      status.hidden = !kind;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Custom rule hook (e.g. "pick at least one item")
      form.dispatchEvent(new CustomEvent('validate'));

      const invalid: HTMLElement[] = fields().filter((f) => !showError(f));
      // Checkbox groups show their own message (see RentalForm); just count and focus them here.
      const badBox = form.querySelector<HTMLInputElement>('input[type="checkbox"]:invalid');
      if (badBox) invalid.push(badBox);
      invalid.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      if (invalid.length) {
        setStatus('error', `<strong>Please fix ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.</strong>`);
        invalid[0].focus();
        return;
      }

      const phoneLink = form.dataset.phoneHref;
      const phone = form.dataset.phone;
      const phoneA = `<a class="underline font-semibold" href="${phoneLink}">${phone}</a>`;
      const callLine = `Please call us at ${phoneA}.`;

      if ((form.getAttribute('action') ?? '').includes('[PLACEHOLDER')) {
        setStatus('error', `<strong>This form isn't connected yet.</strong> ${callLine}`);
        return;
      }

      // Spam trap: real people never fill this hidden field.
      const trap = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
      if (trap?.value) {
        setStatus('success', '<strong>Thanks! We got your request.</strong>');
        return;
      }

      submit?.setAttribute('disabled', '');
      setStatus('sending', 'Sending…');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        form.dispatchEvent(new CustomEvent('reset-extra'));
        setStatus('success', `<strong>Thanks! We got your request.</strong> We'll be in touch soon. Need an answer sooner? ${callLine}`);
        status?.focus();
      } catch {
        setStatus('error', `<strong>Sorry, something went wrong and your request wasn't sent.</strong> Please try again, or call us at ${phoneA}.`);
        status?.focus();
      } finally {
        submit?.removeAttribute('disabled');
      }
    });
  });
}
