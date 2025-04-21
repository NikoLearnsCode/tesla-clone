const fetchLoader = document.getElementById('fetchLoader');
const spinner = document.querySelector('.spinner');
const logo = document.querySelector('.spinner-logo');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');
const cartContainer = document.getElementById('cart-container');

if (fetchLoader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      fetchLoader.classList.add('hidden');
    }, 300);
  });
}


if (fetchLoader) {
  spinner.style.animationPlayState = 'paused';
  logo.style.animationPlayState = 'paused';

  setTimeout(() => {
    spinner.style.animationPlayState = 'running';
    logo.style.animationPlayState = 'running';
  }, 50);
}

// Delete och Update
document.addEventListener('click', async (e) => {
  const button = e.target.closest('.increment-button, .decrement-button');
  if (button) {
    const configId = button.getAttribute('data-config-id');

    const isIncrement = button.classList.contains('increment-button');
    const change = isIncrement ? 1 : -1;

    try {
      const response = await fetch('/checkout/update-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({configId, change}),
      });

      const result = await response.json();
      if (result.success) {
        location.reload();
      }
    } catch (error) {
      console.error('Ett fel uppstod:', error);
    }
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: 'smooth',
  });
}

function scrollToForm() {
  const topValue =
    scrollTopBtn && scrollBottomBtn ? document.body.scrollHeight : 0;
  window.scrollTo({
    top: topValue,
    left: 0,
    behavior: 'smooth',
  });
}

function scrollToCard() {
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: 'smooth',
  });
}

// Funktion för att toggla synlighet för scroll-knappar
function updateScrollButtonsVisibility() {
  const viewportHeight = window.innerHeight;
  const totalHeight = document.body.scrollHeight;
  const shouldShow = totalHeight > viewportHeight * 1.5;

  [scrollTopBtn, scrollBottomBtn].forEach((btn) => {
    if (btn) {
      btn.classList.toggle('btn-hidden', !shouldShow);
    }
  });
}

function initScrollButtons() {
  if (!scrollTopBtn || !scrollBottomBtn) return;
  ['resize', 'load'].forEach((event) =>
    window.addEventListener(event, updateScrollButtonsVisibility)
  );
}

initScrollButtons();

const toggleCard = () => {
  try {
    const cardBtn = document.querySelector('.card-btn');
    const card = document.getElementById('card');
    const payButton = document.getElementById('payButton');
    if (!cardBtn || !card || !payButton) {
      console.error('Required elements not found');
      return;
    }
    card.classList.remove('hidden');
    cardBtn.classList.add('hidden');
    payButton.classList.remove('hidden');
    payButton.disabled = false;
    payButton.classList
      .remove
      // 'cursor-not-allowed',
      // 'opacity-50',
      // 'bg-blue-300',
      // 'border-blue-300'
      ();
    payButton.classList
      .add
      // 'bg-blue-500',
      // 'border-blue-500',
      // 'hover:bg-blue-600',
      // 'hover:border-blue-600'
      ();
    updateScrollButtonsVisibility();
    scrollToCard();
  } catch (error) {
    console.error('Error in toggleCard:', error);
  }
};

const toggleCheckoutForm = () => {
  try {
    const checkoutForm = document.getElementById('checkoutForm');
    const openPaymentModal = document.querySelector('.open-payment');
    const cardBtn = document.querySelector('.card-btn');
    const payButton = document.getElementById('payButton');
    if (!checkoutForm || !openPaymentModal || !cardBtn || !payButton) {
      console.error('Required elements not found');
      return;
    }
    openPaymentModal.classList.add('hidden');
    checkoutForm.classList.remove('hidden');
    cardBtn.classList.remove('hidden');
    payButton.classList.remove('hidden');
    updateScrollButtonsVisibility();
    scrollToForm();
  } catch (error) {
    console.error('Error in toggleCheckoutForm:', error);
  }
};

// const checkoutForm = document.getElementById('checkoutForm');
// if (checkoutForm) {
//   checkoutForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     window.location.href = '/order-confirmation';
//   });
// }
