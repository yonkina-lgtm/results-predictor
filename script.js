document.addEventListener('DOMContentLoaded', () => {
  // Get input elements
  const totalRevenueEl = document.getElementById('total-revenue');
  const avgOrderValueEl = document.getElementById('avg-order-value');
  const leadRateSlider = document.getElementById('lead-rate');
  const prospectRateSlider = document.getElementById('prospect-rate');

  // Get metric card elements
  const metricCards = document.querySelectorAll('.metric-card');
  const prospectCard = metricCards[0];
  const leadCard = metricCards[1];
  const customerCard = metricCards[2];

  // Function to extract numeric value from a number-box element
  const getNumberBoxValue = (element) => {
    const numberSpan = element.querySelector('span:last-child');
    return parseFloat(numberSpan?.textContent) || 0;
  };

  // Function to update metric card value
  const updateMetricCard = (card, value, percentage = null) => {
    const metricValue = card.querySelector('.metric-value');
    if (metricValue) {
      metricValue.textContent = Math.round(value);
    }

    if (percentage !== null) {
      const metricPercent = card.querySelector('.metric-percent');
      if (metricPercent) {
        metricPercent.textContent = `${Math.round(percentage)}%`;
      }
      const metricBar = card.querySelector('.metric-bar span');
      if (metricBar) {
        metricBar.style.width = `${Math.min(percentage, 100)}%`;
      }
    }
  };

  // Calculate and update all metrics
  const calculate = () => {
    const revenue = getNumberBoxValue(totalRevenueEl);
    const avgOrderValue = getNumberBoxValue(avgOrderValueEl);
    const leadRate = parseFloat(leadRateSlider.value);
    const prospectRate = parseFloat(prospectRateSlider.value);

    // Formula 01: Clients = Revenue / Average Order Value
    const clients = revenue / avgOrderValue;

    // Formula 02: Leads = Clients * 100 / Lead Response Rate
    const leads = clients * 100 / leadRate;

    // Formula 03: Prospects = Leads * 100 / Prospect Response Rate
    const prospects = leads * 100 / prospectRate;

    // Update metric cards
    updateMetricCard(customerCard, clients);
    updateMetricCard(leadCard, leads, leadRate);
    updateMetricCard(prospectCard, prospects, prospectRate);
  };

  // Update range slider display value
  const updateSliderValue = (slider) => {
    const wrapper = slider.closest('.range-wrap');
    const output = wrapper?.querySelector('.range-value');
    if (!output) return;

    const value = Number(slider.value);
    output.textContent = `${value.toFixed(2)}%`;
  };

  // Set up event listeners for all sliders
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((slider) => {
    slider.addEventListener('input', () => {
      updateSliderValue(slider);
      calculate();
    });
    updateSliderValue(slider);
  });

  // Set up event listeners for input number boxes
  // Listen for changes on the number-box elements (if they become editable in the future)
  // For now, we'll just do an initial calculation
  // Note: If you make these elements editable, add appropriate event listeners

  // Perform initial calculation
  calculate();
});
