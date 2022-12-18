'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// Modal Window
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (event) {
  // event.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  console.log('closed model clicked')
};
// for(var i=0; i<btnsOpenModal.length; i++) {
//   btnsOpenModal[i].addEventListener('click', openModal);
//   console.log('clicked');
// }

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', (e) => {
  const secCords = section1.getBoundingClientRect();
  // console.log('h/w viewport: ', document.documentElement.clientHeight, document.documentElement.clientWidth);
  // *** 1
  //scrolling 
  // window.scrollTo(secCords.left + window.pageXOffset, 
  //   secCords.top + window.pageYOffset);

  // *** 2
  // window.scrollTo({
  //   left: secCords.left + window.pageXOffset,
  //   top: secCords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // *** 3 Moder way
  section1.scrollIntoView({ behavior: 'smooth' });
})

// Page Navigation

// ******** old way -> performance will loss
// document.querySelectorAll('.nav__link').forEach((link) => (
//   link.addEventListener('click',
//     function(e)  {
//       e.preventDefault();
//       const id = this.getAttribute('href');
//       console.log(id);
//       document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     })
// ))

// ******* Event Delegation
// 1. Add event listeners to common parent elements
// 2. Determine what element is originated the event

// Header Menu Functionality
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

// Tabbed Component 
const Tabs = document.querySelectorAll('.operations__tab');
const TabContainer = document.querySelector('.operations__tab-container')
const OperationContent = document.querySelectorAll('.operations__content');

TabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;
  // Removing active class
  Tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  OperationContent.forEach(TabContent => TabContent.classList.remove('operations__content--active'))

  clicked.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu Button Animation
function handleMenuHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}
const nav = document.querySelector('.nav');

// Passing "argument" into handler 
// Mouse Over 
nav.addEventListener('mouseover', handleMenuHover.bind(.5));
// Mouse out
nav.addEventListener('mouseout', handleMenuHover.bind(1));


// Sticky Top Navigation

// old way
/*
  const intialCordinates = section1.getBoundingClientRect();

  window.addEventListener('scroll', function() {
    if(this.window.scrollY > intialCordinates.top   ) {
      nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
  });
*/
// Efficient and Modern way
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],  // 0 = out of view, 1 = completly visible
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1)
// Sticky Top Navigation

const header = document.querySelector('header');
const navheight = nav.getBoundingClientRect().height;

const StickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}


const headerObserver = new IntersectionObserver(StickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
})

headerObserver.observe(header);

// *** Revealing section elements ***
const allSections = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')

  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})

// *** Img lazy loading ***
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', (e) => {
    entry.target.classList.remove('lazy-img');
  })
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(function (signleImg) {
  imgObserver.observe(signleImg);
})

//  *** slider  start***
const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const rightBtn = document.querySelector('.slider__btn--right');
  const leftBtn = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots')
  const maxSlides = slides.length;
  let currentSlide = 0;
  
  const createDot = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button type="button" class="dots__dot" data-slide="${i}"></button>`)
    })
  }
  
  const gotoSlides = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    })
  }

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
  
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  
  const init = function() {
    // create dot button function initialization
    createDot();
    // Initial state 
    gotoSlides(0);
    // dot active class initialization
    activateDot(0);
    // create dot button function initialization
  }
  init();
  
  const nextSlide = function () {
    if (currentSlide === maxSlides - 1)
      currentSlide = 0;
    else
      currentSlide++;
  
    gotoSlides(currentSlide);
    activateDot(currentSlide);
  }
  const previousSlide = function () {
    if (currentSlide === 0)
      currentSlide = maxSlides - 1;
    else
      currentSlide--;
  
    gotoSlides(currentSlide);
    activateDot(currentSlide);
  }
  // Next slide
  rightBtn.addEventListener('click', nextSlide)
  // Previous slide
  leftBtn.addEventListener('click', previousSlide)
  
  document.addEventListener('keydown', (event) => {
    event.key === 'ArrowRight' && nextSlide();
    event.key === 'ArrowLeft' && previousSlide();
  })
  // slider dot button
  
  //dot active class function 
  dotContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      const { slide } = event.target.dataset;
      gotoSlides(slide);
      activateDot(slide);
    }
  })
}
slider()
//  *** slider  end***

// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log('HTML parse and DOM Tree built!', e);
// })

// window.addEventListener('load', function(e) {
//   console.log('Page fully loaded', e);
// })
// window.addEventListener('beforeunload ', function(e) {
//   e.preventDefault();
//   console.log('Page fully loaded', e);
//   // e.returnValue = '';
// });

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
// Researching 
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great!!!');

// };

// h1.addEventListener('click', alertH1, true);


// setTimeout(() => ( h1.removeEventListener('mouseenter', ()=> console.log('remove event handler') ) ),
//   3000)

// h1.onmouseenter = function (e) {
//   alert('Onmouse Enter: Great !!!!!')
// }


// ********** capture phase & buble phase ****************
// const randomInt = (min, max ) => (
//    Math.floor(Math.random() * (max - min +1) + min));

// console.log(randomInt(0, 255));
// const randomColor = ()=> (
//    `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`
// )

// console.log(typeof(randomColor()))
// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor  = randomColor();
//   console.log('Link', e.target, e.currentTarget)
//   // e.stopPropagation();
// })
// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor  = randomColor();
//   console.log('Nav Links', e.target, e.currentTarget)
// })
// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor  = randomColor();
//   console.log('Nav', e.target, e.currentTarget)
// })


// 190: Dom Traversing
// const h1 = document.querySelector('h1');

// console.log(h1.childNodes);
// console.log(h1.children);

// // console.log(h1.parentElement);
// // console.log(h1.parentNode);

// h1.firstElementChild.style.color = 'orangered'
// h1.lastElementChild.style.color = 'red'

// h1.closest('h1').style.background = 'var(--gradient-primary)'

// // console.log(h1.closest('h1'));

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.nextSibling);


// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function(el) {

//   if(el !== h1) el.style.transform = 'scale(.8)'
// })

