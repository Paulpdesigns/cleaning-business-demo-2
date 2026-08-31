(() => {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const config = window.SITE_CONFIG;
  const pricing = config.pricing;
  const steps = [...form.querySelectorAll('.quote-step')];
  const quoteStepCount = 6;
  const progress = form.querySelector('.quote-progress-fill');
  const status = form.querySelector('.quote-status');
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  let index = 0;

  const value = name => form.querySelector(`[name="${name}"]:checked`)?.value || '';
  const title = name => form.querySelector(`[name="${name}"]:checked`)?.closest('label')?.querySelector('strong')?.textContent || value(name);
  const selectedExtras = () => [...form.querySelectorAll('[name="extras"]:checked')];
  const isCommercial = () => ['office', 'commercial'].includes(value('property')) || value('service') === 'office';

  const render = () => {
    steps.forEach((step, i) => step.hidden = i !== index);
    status.textContent = index < quoteStepCount ? `Step ${index + 1} of ${quoteStepCount}` : 'Your details';
    progress.style.width = `${(Math.min(index + 1, quoteStepCount) / quoteStepCount) * 100}%`;
    back.hidden = index === 0;
    next.textContent = index === 4 ? 'See my estimate' : index === 5 ? 'Request this quote' : index === steps.length - 1 ? 'Send quote request' : 'Continue';
    form.querySelectorAll('[data-residential]').forEach(el => el.hidden = isCommercial());
    form.querySelectorAll('[data-commercial]').forEach(el => el.hidden = !isCommercial());
    if (index === steps.length - 2) calculate();
  };

  const validate = () => {
    const step = steps[index];
    const required = [...step.querySelectorAll('[required]')].filter(input => !input.closest('[hidden]'));
    const radioNames = [...new Set(required.filter(input => input.type === 'radio').map(input => input.name))];
    for (const name of radioNames) {
      if (!form.querySelector(`[name="${name}"]:checked`)) {
        step.querySelector(`[name="${name}"]`)?.focus();
        step.classList.add('has-error');
        return false;
      }
    }
    for (const input of required.filter(input => input.type !== 'radio')) {
      if (!input.checkValidity()) { input.reportValidity(); return false; }
    }
    step.classList.remove('has-error');
    return true;
  };

  const calculate = () => {
    const service = value('service');
    const property = value('property');
    const frequency = value('frequency');
    let total = pricing.servicePrices[service] + pricing.propertyAdjustments[property];
    if (isCommercial()) total += pricing.commercialSizes[value('commercialSize')] || 0;
    else total += (pricing.bedroomPrices[value('bedrooms')] || 0) + (pricing.bathroomPrices[value('bathrooms')] || 0);
    total += selectedExtras().reduce((sum, input) => sum + pricing.addons[input.value], 0);
    total *= 1 - (pricing.frequencyDiscounts[frequency] || 0);
    const low = Math.round(total / 5) * 5;
    const high = Math.round((total * 1.18) / 5) * 5;
    form.querySelector('[data-estimate]').textContent = `${config.business.currencySymbol}${low} - ${config.business.currencySymbol}${high}`;
    form.querySelector('[data-duration]').textContent = `${Math.max(2, Math.round(total / 32))}-${Math.max(3, Math.round(total / 28))} hours`;
    form.querySelector('[data-summary-service]').textContent = title('service');
    form.querySelector('[data-summary-property]').textContent = title('property');
    form.querySelector('[data-summary-size]').textContent = isCommercial() ? title('commercialSize') : `${title('bedrooms')}, ${title('bathrooms')}`;
    form.querySelector('[data-summary-frequency]').textContent = title('frequency');
    form.querySelector('[data-summary-extras]').textContent = selectedExtras().map(input => input.closest('label').querySelector('strong').textContent).join(', ') || 'None';
  };

  form.addEventListener('change', event => {
    const card = event.target.closest('.choice');
    if (card && event.target.type === 'radio') {
      card.parentElement.querySelectorAll('.choice').forEach(choice => choice.classList.toggle('selected', choice.contains(event.target)));
    }
    if (event.target.name === 'service' && event.target.value === 'office') {
      const office = form.querySelector('[name="property"][value="office"]');
      office.checked = true;
    }
  });
  back.addEventListener('click', () => { index = Math.max(0, index - 1); render(); form.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  next.addEventListener('click', () => {
    if (!validate()) return;
    if (index < steps.length - 1) { index++; render(); form.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else {
      const customerFields = [...steps[index].querySelectorAll('[required]')];
      if (!customerFields.every(field => field.checkValidity())) { form.reportValidity(); return; }
      form.querySelector('.quote-actions').hidden = true;
      form.querySelector('.quote-success').hidden = false;
    }
  });
  render();
})();
