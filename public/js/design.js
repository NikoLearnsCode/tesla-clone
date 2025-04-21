const pageLoader = document.getElementById('pageLoader');
const galleryContainer = document.querySelector('.product-detail-gallery');
const imageButtons = document.querySelectorAll('.image-btn');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const rangeElement = document.querySelector('#range-spec .range');
const speedElement = document.querySelector('#speed-spec .speed');
const accelerationElement = document.querySelector(
  '#acceleration-spec .acceleration'
);
const fetchLoader = document.getElementById('fetchLoader');
const autopilotOptions = document.querySelectorAll('.autopilot-option');

const spinner = document.querySelector('.spinner');
const logo = document.querySelector('.spinner-logo');

let currentWheel = 'Standard'; // Standardhjulstorlek
let carsData = null; // Hållare för JSON-arrayen
let index = 0; // Startindex för bilder
let currentColor = 'gray'; // Standardfärg
let currentVariant = '';
let currentAutopilot = 'Grundläggande Autopilot';

async function fetchCarsData(model) {
  try {
    fetchLoader.classList.remove('hidden');

    const response = await fetch(`/design/cars/${model}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    carsData = [data];
    console.log('data', carsData);

    updateGallery(currentColor);
    setupColorOptions();
    setupWheelOptions();
    updatePrice();
    createMotorOptions(carsData[0].specs);
    setupMotorClickEvents();
  } catch (error) {
    console.error('Kunde inte ladda JSON-data:', error);
  } finally {
    setTimeout(() => {
      fetchLoader.classList.add('hidden');
    }, 300);
  }
}

function getCarModelFromUrl() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[2];
}

function createMotorOptions(specs) {
  const container = document.getElementById('motor-options-container');
  container.innerHTML = '';

  specs.forEach((spec, index) => {
    const motorOption = document.createElement('div');
    motorOption.className = `motor-option cursor-pointer flex justify-between text-sm mqxs:text-sm p-3 font-medium mt-${
      index === 0 ? '10' : '3'
    } border transition text-gray-500 shadow-sm  rounded`;
    motorOption.setAttribute('data-motor', spec.name);
    const nameSpan = document.createElement('span');
    nameSpan.textContent = spec.name;
    const priceSpan = document.createElement('span');
    priceSpan.className = 'text-nowrap';
    priceSpan.textContent = formatPrice(spec.price);
    motorOption.appendChild(nameSpan);
    motorOption.appendChild(priceSpan);
    container.appendChild(motorOption);

    // Markera första variant som aktiv
    if (index === 0) {
      currentVariant = spec.name;
      markActiveVariant(motorOption);
      updateSpecs(spec.name);
      updatePrice();
    }
  });
}

// Hämta rätt hjul-objekt
function getWheelData(size) {
  const modelData = carsData[0];
  return modelData.wheels.find((wheel) => wheel.size === size);
}

// Hämta rätt färg-data inom ett wheel-objekt
function getColorData(wheelData, colorKey) {
  return wheelData.colors.find((colorObj) => colorObj.key === colorKey);
}

// Uppdatera galleriet baserat på vald färg
function updateGallery(color) {
  if (!carsData) return;

  const wheelData = getWheelData(currentWheel);
  if (!wheelData) {
    console.error('Hjulstorlek saknas:', currentWheel);
    return;
  }
  const colorData = getColorData(wheelData, color);
  if (!colorData) {
    console.error('Färgen saknas för vald hjulstorlek:', color);
    return;
  }

  const images = colorData.images;
  const currentImage = document.getElementById('current-image');
  const currentColorElement = document.getElementById('current-color');
  const currentColorPriceElement = document.querySelector(
    '.current-color-price'
  );
  const currentWheelPriceElement = document.querySelector(
    '.current-wheel-price'
  );

  currentImage.src = images[index];
  currentImage.alt = colorData.name;
  currentColorElement.textContent = colorData.name;
  currentColorPriceElement.textContent = formatPrice(colorData.price);
  currentWheelPriceElement.textContent = formatPrice(wheelData.price);

  updateGalleryClasses(images, index, currentImage);
  setupImageNavigation(images, currentImage);
}

// Hantera klasser för bilder
function updateGalleryClasses(images, index, currentImage) {
  currentImage.classList.remove('object-contain', 'object-cover');
  if (index < images.length - 2) {
    currentImage.classList.add('object-contain');
  } else {
    currentImage.classList.add('object-cover');
  }
}

// Ställ in navigering mellan bilder
function setupImageNavigation(images, currentImage) {
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      index = (index - 1 + images.length) % images.length;
      currentImage.src = images[index];
      updateGalleryClasses(images, index, currentImage);
    };

    nextBtn.onclick = () => {
      index = (index + 1) % images.length;
      currentImage.src = images[index];
      updateGalleryClasses(images, index, currentImage);
    };
  }
}

// Färgval
function setupColorOptions() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedColor = option.dataset.color;
      currentColor = selectedColor; // Uppdatera aktuell färg

      // Avmarkera alla alternativ
      colorOptions.forEach((opt) => {
        opt.classList.remove('border-black');
        opt.classList.add('border-transparent');
      });

      // Markera klickad färg
      option.classList.remove('border-transparent');
      option.classList.add('border-black');

      // Uppdatera galleriet med den valda färgen
      updateGallery(selectedColor);
      updatePrice();
    });
  });

  // Markera standardfärgen vid start
  const defaultOption = document.querySelector(
    `[data-color="${currentColor}"]`
  );
  if (defaultOption) {
    defaultOption.classList.remove('border-transparent');
    defaultOption.classList.add('border-black');
  }
}

// Hjulval
function setupWheelOptions() {
  const wheelOptions = document.querySelectorAll('.wheel-option');
  const wheelNameElement = document.getElementById('current-wheel');

  // Markera standardhjulstorleken
  const defaultWheelOption = document.querySelector(
    `.wheel-option[data-wheel="${currentWheel}"]`
  );

  if (defaultWheelOption) {
    defaultWheelOption.classList.add('border-black', 'border-2');
    defaultWheelOption.classList.remove('border-transparent');

    // Sätt initialt hjul-namn
    const wheelData = getWheelData(currentWheel);
    if (wheelData && wheelNameElement) {
      wheelNameElement.textContent = wheelData.name;
    }
  }

  // Lägg till klickhändelser för alla hjulval
  wheelOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedWheel = option.dataset.wheel;
      if (selectedWheel !== currentWheel) {
        currentWheel = selectedWheel;
        updateGallery(currentColor);
        updatePrice();
        // Uppdatera hjul-namnet
        const wheelData = getWheelData(currentWheel);
        if (wheelData && wheelNameElement) {
          wheelNameElement.textContent = wheelData.name;
        }
      }

      // Rensa markering på alla
      wheelOptions.forEach((opt) => {
        opt.classList.remove('border-black');
        opt.classList.add('border-transparent');
      });

      // Markera valt hjul
      option.classList.remove('border-transparent');
      option.classList.add('border-black');
    });
  });
}

// Animerad räknare för range, speed, acceleration
function animateNumber(element, start, end, duration, decimals = 0) {
  const range = end - start;
  const increment = range / (duration / 10);
  let currentValue = start;

  if (element.animationTimer) {
    clearInterval(element.animationTimer);
  }
  element.animationTimer = setInterval(() => {
    currentValue += increment;
    if (
      (increment > 0 && currentValue >= end) ||
      (increment < 0 && currentValue <= end)
    ) {
      currentValue = end;
      clearInterval(element.animationTimer);
    }

    element.textContent = currentValue.toFixed(decimals).replace('.', ',');
  }, 10);
}

function updatePrice() {
  if (!carsData) return;

  const modelData = carsData[0];
  let totalPrice = 0;

  // 1 Variant
  const selectedVariant = modelData.specs.find(
    (s) => s.name === currentVariant
  );

  if (selectedVariant) {
    totalPrice += getValidPrice(selectedVariant.price);
  }

  // 2 Wheel
  const selectedWheel = modelData.wheels.find((w) => w.size === currentWheel);

  if (selectedWheel) {
    totalPrice += getValidPrice(selectedWheel.price);
    // 3 Färg
    const selectedColorObj = selectedWheel.colors.find(
      (c) => c.key === currentColor
    );

    if (selectedColorObj) {
      totalPrice += getValidPrice(selectedColorObj.price);
    }
  }
  // 4 Autopilot
  const selectedAutopilot = modelData.autopilotPackages.find(
    (a) => a.name === currentAutopilot
  );

  if (selectedAutopilot) {
    totalPrice += getValidPrice(selectedAutopilot.price);
  }

  // Format och uppdatera
  const formattedPrice = formatPrice(totalPrice);
  const totalPriceElement = document.getElementById('total-price');

  if (totalPriceElement) {
    totalPriceElement.textContent = formattedPrice;
  }
  return totalPrice;
}

// Hjälpfunktion för att hantera priser
function getValidPrice(price) {
  if (!price) return 0;
  if (price === 'Inkluderat') return 0;
  const digitsOnly = price.toString().replace(/\D/g, '');
  return parseInt(digitsOnly, 10) || 0;
}

function formatPrice(price) {
  return price === 0
    ? 'Inkluderat'
    : price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kr';
}

function formatCheckout(price) {
  if (price === 0) {
    return '✔';
  }
  const formattedPrice =
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kr';
  return price > 0 ? `+ ${formattedPrice}` : formattedPrice;
}

// Uppdatera specs för vald variant
function updateSpecs(variantName) {
  if (!carsData) return;

  const modelData = carsData[0];
  const specs = modelData.specs.find((s) => s.name === variantName);

  if (!specs) {
    console.error('Specifikationer saknas för:', variantName);
    return;
  }

  // Plocka ut siffrorna ur texten
  const newRange = parseInt(specs.range, 10);
  const newSpeed = parseInt(specs.speed, 10);
  const newAcceleration = parseFloat(specs.acceleration.replace(',', '.'));

  animateNumber(
    rangeElement,
    parseInt(rangeElement.textContent, 10) || 0,
    newRange,
    500,
    0
  );
  animateNumber(
    speedElement,
    parseInt(speedElement.textContent, 10) || 0,
    newSpeed,
    500,
    0
  );
  animateNumber(
    accelerationElement,
    parseFloat(accelerationElement.textContent.replace(',', '.')) || 0,
    newAcceleration,
    500,
    1
  );
}

function markActiveVariant(activeOption) {
  document.querySelectorAll('.motor-option').forEach((option) => {
    option.classList.remove('border-gray-800', 'bg-gray-50', 'text-gray-800');
  });

  activeOption.classList.add('border-gray-800', 'bg-gray-50', 'text-gray-800');
}

function setupMotorClickEvents() {
  const motorOptions = document.querySelectorAll('.motor-option');

  motorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const motorName = option.getAttribute('data-motor');

      currentVariant = motorName;
      updateSpecs(motorName);
      markActiveVariant(option);
      updatePrice();
    });
  });
}

// Autopilot-kort
autopilotOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const selectedAutopilot = option.dataset.autopilot;
    currentAutopilot = selectedAutopilot;
    autopilotOptions.forEach((opt) => {
      opt.classList.remove('border-black', 'bg-gray-50', 'text-gray-800');
      opt.classList.add('border-gray-300', 'text-gray-500');
    });
    option.classList.add('border-black', 'bg-gray-50', 'text-gray-800');
    option.classList.remove('border-gray-300', 'text-gray-500');
    updatePrice();
  });
});

// Galleri-knappar
if (galleryContainer) {
  galleryContainer.addEventListener('mouseover', () => {
    imageButtons.forEach((button) => {
      button.classList.remove('opacity-0');
      nextBtn.classList.remove('translate-x-5');
      prevBtn.classList.remove('-translate-x-5');
    });
  });

  galleryContainer.addEventListener('mouseout', () => {
    imageButtons.forEach((button) => {
      button.classList.add('opacity-0');
      nextBtn.classList.add('translate-x-5');
      prevBtn.classList.add('-translate-x-5');
    });
  });

  // Tangentbordsnavigering för galleriet
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // Visa knappar vid sidladdning
  const event = new Event('mouseover');
  galleryContainer.dispatchEvent(event);

  setTimeout(() => {
    const eventOut = new Event('mouseout');
    galleryContainer.dispatchEvent(eventOut);
  }, 3000);
}

if (pageLoader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 300);
  });
}

//Spinner-synk
if (fetchLoader || pageLoader) {
  spinner.style.animationPlayState = 'paused';
  logo.style.animationPlayState = 'paused';

  setTimeout(() => {
    spinner.style.animationPlayState = 'running';
    logo.style.animationPlayState = 'running';
  }, 50);
}
document.addEventListener('DOMContentLoaded', () => {
  const model = getCarModelFromUrl();
  if (model) {
    fetchCarsData(model);
  }
});

//Samla data för att skicka till backend och checkout
function collectDataToCart() {
  let firstImage = '';
  let wheelName = '';
  let wheelPrice = 0;
  let colorName = '';
  let colorPrice = 0;
  let variantPrice = 0;
  let autopilotPrice = 0;
  let tractionForce = '';
  let tractionPrice = 0;
  let productId = '';

  // Hämta data för hjul och färg
  if (carsData) {
    const wheelData = getWheelData(currentWheel);
    if (wheelData) {
      wheelName = wheelData.name;
      wheelPrice = wheelData.price || 0;

      const colorData = getColorData(wheelData, currentColor);
      if (colorData) {
        colorName = colorData.name;
        colorPrice = colorData.price || 0;
        if (colorData.images && colorData.images.length > 0) {
          firstImage = colorData.images[0];
        }
      }
    }
    // Hämta data Variant
    const modelData = carsData[0];
    const selectedVariant = modelData.specs.find(
      (s) => s.name === currentVariant
    );
    if (selectedVariant) {
      variantPrice = getValidPrice(selectedVariant.price);
    }
    const tractionData = modelData.traction && modelData.traction[0];
    if (tractionData) {
      tractionForce = tractionData.force;
      tractionPrice = getValidPrice(tractionData.price);
    }

    // Hämta data Autopilot
    const selectedAutopilot = modelData.autopilotPackages.find(
      (a) => a.name === currentAutopilot
    );
    if (selectedAutopilot) {
      autopilotPrice = getValidPrice(selectedAutopilot.price);
    }

    productId = modelData.id;
  }

  const selectedConfig = {
    id: productId,
    model: getCarModelFromUrl(),
    image: firstImage,

    // Hjul & färg
    wheel: wheelName,
    wheelPrice: wheelPrice,
    color: colorName,
    colorPrice: colorPrice,

    // Traction
    traction: tractionForce,
    tractionPrice: tractionPrice,

    // Variant
    variant: currentVariant,
    variantPrice: variantPrice,

    // Autopilot
    autopilot: currentAutopilot,
    autopilotPrice: autopilotPrice,

    // Totalpris
    totalPrice: updatePrice(),
  };

  return selectedConfig;
}

//Add
const submitCarConfig = document.getElementById('submit-car-config');

if (submitCarConfig) {
  submitCarConfig.addEventListener('click', async () => {
    const selectedConfig = collectDataToCart();
    // console.log('Data som skickas till backend:', selectedConfig);
    try {
      const response = await fetch('/checkout/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedConfig),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.success) {
        // console.log('Nuvarande varukorg:', result.cart);
        window.location.href = '/checkout';
      }
    } catch (error) {
      console.error('Ett fel uppstod vid skickning av data:', error);
      alert('Kunde inte lägga till produkten. Försök igen.');
    }
  });
}
