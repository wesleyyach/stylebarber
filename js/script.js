const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
const navLinks = document.querySelectorAll(".desktop-nav a");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const bookingForm = document.querySelector(".booking-form");
const toast = document.querySelector(".toast");
const dateInput = document.querySelector('input[name="data"]');

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(now.getDate()).padStart(2, "0")}`;
dateInput.min = today;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 4000);
};

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 1600;
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(target * easedProgress);

    counter.textContent = target >= 1000 ? `${currentValue}+` : currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target >= 1000 ? `${target}+` : target;
    }
  };

  requestAnimationFrame(updateCounter);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const sections = [
  "servicos",
  "experiencia",
  "equipe",
  "planos",
  "galeria",
  "contato",
]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const syncActiveLink = () => {
  const offset = window.scrollY + 180;
  let currentSection = sections[0].id;

  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("is-active", isCurrent);
  });
};

window.addEventListener("scroll", syncActiveLink, { passive: true });
syncActiveLink();

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const nome = formData.get("nome");
  const servico = formData.get("servico");

  bookingForm.reset();
  dateInput.min = today;

  showToast(
    `Obrigado, ${nome}! Sua solicitacao para "${servico}" foi enviada. Nossa equipe vai te chamar em breve.`
  );
});
