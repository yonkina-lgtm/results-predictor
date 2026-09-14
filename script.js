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

  // Get bar stacks for chart
  const barStacks = document.querySelectorAll('.bar-stack');
  const maxValue = 120; // Maximum scale for chart (from legend: 120 people)

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

  // Calculate and update chart bars
  const updateChartBars = (clients, leads, prospects) => {
    barStacks.forEach((stack, index) => {
      const month = index + 1;
      // Monthly growth factor: each month gets progressively larger
      const monthFactor = month / 6;

      // Calculate values for this month
      const monthCustomers = Math.round(clients * monthFactor);
      const monthLeads = Math.round(leads * monthFactor);
      const monthProspects = Math.round(prospects * monthFactor);

      // Total height is based on largest value
      const totalHeight = monthCustomers + monthLeads + monthProspects;
      const maxHeight = maxValue;
      const scale = totalHeight > 0 ? Math.min(totalHeight / maxHeight, 1) * 100 : 0;

      // Calculate proportions for each segment
      const customersHeight = totalHeight > 0 ? (monthCustomers / totalHeight) * scale : 0;
      const leadsHeight = totalHeight > 0 ? (monthLeads / totalHeight) * scale : 0;
      const prospectsHeight = totalHeight > 0 ? (monthProspects / totalHeight) * scale : 0;

      // Update segments
      const segments = stack.querySelectorAll('.segment');
      if (segments[0]) segments[0].style.height = `${prospectsHeight}%`;
      if (segments[1]) segments[1].style.height = `${leadsHeight}%`;
      if (segments[2]) segments[2].style.height = `${customersHeight}%`;

      // Update tooltip
      const tooltipText = `Month #${month} Prospects: ${monthProspects} Leads: ${monthLeads} Customers: ${monthCustomers}`;
      stack.setAttribute('data-tooltip', tooltipText);
    });
  };

  // Calculate and update all metrics and chart
  const calculate = () => {
    const revenue = getNumberBoxValue(totalRevenueEl);
    const avgOrderValue = getNumberBoxValue(avgOrderValueEl);
    const leadRate = parseFloat(leadRateSlider.value);
    const prospectRate = parseFloat(prospectRateSlider.value);

    // Avoid division by zero
    if (avgOrderValue === 0 || leadRate === 0 || prospectRate === 0) {
      return;
    }

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

    // Update chart bars
    updateChartBars(clients, leads, prospects);
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

  // Perform initial calculation
  calculate();
});
