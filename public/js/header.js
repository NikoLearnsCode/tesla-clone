const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('mobileMenuBtn');
const mainLinks = document.getElementById('mainNavUl');
const closeNav = document.querySelector('.close-nav');
const body = document.body;
const overlay = document.querySelector('.overlay');
const menuTriggers = document.querySelectorAll('.nav-toggle');
const backButtons = document.querySelectorAll('.backBtn-nav');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');
const spinner = document.querySelector('.spinner');
const logo = document.querySelector('.spinner-logo');
const videos = document.querySelectorAll('.scroll-video');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const pageLoader = document.getElementById('pageLoader');

let mobileMenuOpen = false;

// // Scroll till sektioner
// const sections = document.querySelectorAll('.image');
// let currentSectionIndex = 0;
// let isScrolling = false;

// window.addEventListener(
//   'wheel',
//   (event) => {
//     // Om mobilmenyn är öppen > avbryt
//     if (mobileMenuOpen) return;
//     event.preventDefault();

//     if (isScrolling) return;

//     if (event.deltaY > 0) {
//       gotoNextSection();
//     } else {
//       gotoPrevSection();
//     }
//   },
//   {passive: false}
// );

// window.addEventListener('keydown', (event) => {
//   // Om mobilmenyn är öppen > avbryt
//   if (mobileMenuOpen) return;

//   if (
//     event.key === 'ArrowDown' ||
//     event.key === 'ArrowUp' ||
//     event.key === 'PageDown' ||
//     event.key === 'PageUp'
//   ) {
//     event.preventDefault();
//   } else {
//     return;
//   }

//   if (isScrolling) return;

//   if (event.key === 'ArrowDown' || event.key === 'PageDown') {
//     gotoNextSection();
//   } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
//     gotoPrevSection();
//   }
// });

// function gotoNextSection() {
//   if (currentSectionIndex < sections.length - 1) {
//     currentSectionIndex++;
//     scrollToSection(currentSectionIndex);
//   }
// }

// function gotoPrevSection() {
//   if (currentSectionIndex > 0) {
//     currentSectionIndex--;
//     scrollToSection(currentSectionIndex);
//   }
// }

// function scrollToSection(index) {
//   isScrolling = true;

//   sections[index].scrollIntoView({
//     behavior: 'smooth',
//   });

//   setTimeout(() => {
//     isScrolling = false;
//   }, 700);
// }

function scrollToTop() {
  currentSectionIndex = 0;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', scrollToTop);
}

if (pageLoader) {
  spinner.style.animationPlayState = 'paused';
  logo.style.animationPlayState = 'paused';

  setTimeout(() => {
    spinner.style.animationPlayState = 'running';
    logo.style.animationPlayState = 'running';
  }, 50);

  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 300);
  });
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    mainLinks.classList.add('opacity-0', 'invisible');
    body.style.overflow = '';
    overlay.classList.remove('active');

    mobileMenuOpen = false;
  }
}
document.addEventListener('keydown', handleEscapeKey);

// ÖPPNA/STÄNG MOBILMENY
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    mainLinks.classList.remove('opacity-0', 'invisible');
    body.style.overflow = 'hidden';
    overlay.classList.add('active');

    // Meny öppnas
    mobileMenuOpen = true;
  });

  if (closeNav) {
    closeNav.addEventListener('click', () => {
      mainLinks.classList.add('opacity-0', 'invisible');
      body.style.overflow = '';
      overlay.classList.remove('active');

      // Meny stängs
      mobileMenuOpen = false;
    });
  }
}

// DROPDOWN I MOBILVY
menuTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    if (window.innerWidth < 1024) {
      e.stopPropagation();
      const dropdownMenu = trigger.querySelector('.dropdown-menu');
      dropdownMenu.classList.remove('opacity-0', 'invisible');
      body.style.overflow = 'hidden';
      mobileMenuOpen = true;
    }
  });
});

// Stäng dropdown med tillbaka-knappen
backButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdownMenu = button.closest('.dropdown-menu');
    dropdownMenu.classList.add('opacity-0', 'invisible');
  });
});

// ÅTERSTÄLL MENY VID RESIZE
if (mainLinks) {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      dropdownMenus.forEach((menu) => {
        menu.classList.add('opacity-0', 'invisible');
      });
      mainLinks.classList.add('opacity-0', 'invisible');
      body.style.overflow = 'auto';
      overlay.classList.remove('active');
      mobileMenuOpen = false;
    }
  });
}

// HOVER-EFFEKTER I NAV (DESKTOP)
if (mainLinks) {
  const mainNav = document.querySelector('#mainNav');

  mainLinks.addEventListener('mouseover', (e) => {
    if (window.innerWidth >= 1024) {
      const li = e.target.closest('li');
      if (!li || li.classList.contains('no-active')) {
        mainNav.classList.remove('nav-active');
        overlay.classList.remove('active');
        mobileMenuOpen = false;
      } else {
        mainNav.classList.add('nav-active');
        overlay.classList.add('active');
        mobileMenuOpen = true;
      }
    }
  });

  mainLinks.addEventListener('mouseout', (e) => {
    if (window.innerWidth >= 1024) {
      if (!mainLinks.contains(e.relatedTarget)) {
        mainNav.classList.remove('nav-active');
        overlay.classList.remove('active');
        mobileMenuOpen = false;
      }
    }
  });
}

// VIDEO PLAY/PAUSE OBSERVE
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      // console.log(`Ìs intersection: ${entry.isIntersecting}`);
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  },
  {threshold: 0.1}
);
videos.forEach((video) => observer.observe(video));

// SCROLL NAV
let lastScrollY = window.scrollY || 0;
const scrollThreshold = 0;

window.addEventListener('scroll', function () {
  if (mobileMenuOpen) return;

  if (navbar) {
    if (window.scrollY > 0) {
      navbar.classList.add('navbar-scroll');
    } else {
      navbar.classList.remove('navbar-scroll');
    }

    if (window.scrollY > lastScrollY && window.scrollY > scrollThreshold) {
      navbar.classList.add('navbar-hidden');
    } else if (window.scrollY < lastScrollY) {
      navbar.classList.remove('navbar-hidden');
    }
  }

  lastScrollY = window.scrollY;
});
