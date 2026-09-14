document.addEventListener('DOMContentLoaded', () => {
  // Translation dictionary
  const translations = {
    en: {
      label_language: 'Language',
      label_currency: 'Currency',
      label_campaign_start: 'Campaign Start',
      label_campaign_end: 'Campaign End',
      label_total_revenue: 'Total Revenue',
      label_avg_order_value: 'Avg. Order Value',
      label_prospects: 'Prospects',
      label_leads: 'Leads',
      label_customers: 'Customers',
      label_lead_response_rate: 'Lead Response Rate',
      label_prospect_response_rate: 'Prospect Response Rate'
    },
    es: {
      label_language: 'Idioma',
      label_currency: 'Moneda',
      label_campaign_start: 'Inicio de Campaña',
      label_campaign_end: 'Fin de Campaña',
      label_total_revenue: 'Ingresos Totales',
      label_avg_order_value: 'Valor Promedio de Orden',
      label_prospects: 'Prospectos',
      label_leads: 'Clientes Potenciales',
      label_customers: 'Clientes',
      label_lead_response_rate: 'Tasa de Respuesta de Clientes Potenciales',
      label_prospect_response_rate: 'Tasa de Respuesta de Prospectos'
    },
    fr: {
      label_language: 'Langue',
      label_currency: 'Devise',
      label_campaign_start: 'Début de Campagne',
      label_campaign_end: 'Fin de Campagne',
      label_total_revenue: 'Revenu Total',
      label_avg_order_value: 'Valeur Moyenne de la Commande',
      label_prospects: 'Prospects',
      label_leads: 'Pistes',
      label_customers: 'Clients',
      label_lead_response_rate: 'Taux de Réponse des Pistes',
      label_prospect_response_rate: 'Taux de Réponse des Prospects'
    },
    de: {
      label_language: 'Sprache',
      label_currency: 'Währung',
      label_campaign_start: 'Kampanienstart',
      label_campaign_end: 'Kampagnenende',
      label_total_revenue: 'Gesamtumsatz',
      label_avg_order_value: 'Durchschnittlicher Bestellwert',
      label_prospects: 'Aussichten',
      label_leads: 'Leads',
      label_customers: 'Kunden',
      label_lead_response_rate: 'Lead-Antwortsatz',
      label_prospect_response_rate: 'Aussichtsantwortsatz'
    }
  };

  // Get input elements
  const totalRevenueInput = document.getElementById('total-revenue');
  const avgOrderValueInput = document.getElementById('avg-order-value');
  const leadRateSlider = document.getElementById('lead-rate');
  const prospectRateSlider = document.getElementById('prospect-rate');
  
  // Get control elements
  const languageSelect = document.getElementById('language');
  const currencySelect = document.getElementById('currency');
  const campaignStartInput = document.getElementById('campaign-start');
  const campaignEndInput = document.getElementById('campaign-end');
  const currencySymbols = document.querySelectorAll('.number-box .symbol');

  // Get metric card elements
  const metricCards = document.querySelectorAll('.metric-card');
  const prospectCard = metricCards[0];
  const leadCard = metricCards[1];
  const customerCard = metricCards[2];

  // Get bar stacks for chart
  const barStacks = document.querySelectorAll('.bar-stack');
  const maxValue = 120; // Maximum scale for chart (from legend: 120 people)

  // Function to get numeric value from input field
  const getInputValue = (inputElement) => {
    return parseFloat(inputElement.value) || 0;
  };

  // Function to update all translations
  const updateLanguage = (lang) => {
    const langTranslations = translations[lang] || translations['en'];
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (langTranslations[key]) {
        element.textContent = langTranslations[key];
      }
    });
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
    const revenue = getInputValue(totalRevenueInput);
    const avgOrderValue = getInputValue(avgOrderValueInput);
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

  // Update currency symbols when currency changes
  const updateCurrencySymbols = () => {
    const selectedOption = currencySelect.options[currencySelect.selectedIndex];
    const symbol = selectedOption.getAttribute('data-symbol');
    currencySymbols.forEach(el => {
      el.textContent = symbol;
    });
  };

  // Set up event listeners for revenue and AOV inputs
  totalRevenueInput.addEventListener('input', calculate);
  avgOrderValueInput.addEventListener('input', calculate);

  // Set up event listener for currency changes
  currencySelect.addEventListener('change', updateCurrencySymbols);

  // Set up event listener for language changes
  languageSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
  });

  // Set up event listeners for all sliders
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((slider) => {
    slider.addEventListener('input', () => {
      updateSliderValue(slider);
      calculate();
    });
    updateSliderValue(slider);
  });

  // Initialize currency symbols
  updateCurrencySymbols();

  // Initialize language
  updateLanguage(languageSelect.value);

  // Perform initial calculation
  calculate();
});
