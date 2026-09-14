document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('input[type="range"]');

  sliders.forEach((slider) => {
    const updateValue = () => {
      const wrapper = slider.closest('.range-wrap');
      const output = wrapper?.querySelector('.range-value');
      if (!output) return;

      const value = Number(slider.value);
      output.textContent = `${value.toFixed(2)}%`;
    };

    slider.addEventListener('input', updateValue);
    updateValue();
  });
});
