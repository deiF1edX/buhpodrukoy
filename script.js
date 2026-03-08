document.addEventListener("DOMContentLoaded", () => {
  // 1. Инициализация карусели (Swiper)
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  // 2. Мобильное меню
  const menuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Открыть/закрыть меню
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("translate-x-full");
    // Превращаем гамбургер в крестик (анимация)
    const spans = menuBtn.querySelectorAll("span");
    spans[0].classList.toggle("rotate-45");
    spans[0].classList.toggle("translate-y-2");
    spans[1].classList.toggle("opacity-0");
    spans[2].classList.toggle("-rotate-45");
    spans[2].classList.toggle("-translate-y-2");
  });

  // Закрыть меню при клике на ссылку
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
    });
  });

  // 3. Попап
  const popup = document.getElementById("popup");
  const popupFormContainer = document.getElementById("popupFormContainer");
  const successMsg = document.getElementById("successMsg");
  const openBtns = document.querySelectorAll(".open-popup");
  const closeBtn = document.getElementById("closePopup");

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      popup.classList.remove("hidden");
      popup.classList.add("flex");
      popupFormContainer.style.display = "block";
      successMsg.classList.add("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    popup.classList.remove("flex");
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.add("hidden");
      popup.classList.remove("flex");
    }
  });

  // 4. Отправка формы через Vercel API (БЕЗОПАСНО)
  async function sendToTelegram(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    // Собираем данные в простой объект
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
    };

    try {
      // Отправляем запрос не в телеграм, а на НАШ сервер Vercel
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Показать успех
        if (formId === "heroForm") {
          popup.classList.remove("hidden");
          popup.classList.add("flex");
        }
        popupFormContainer.style.display = "none";
        successMsg.classList.remove("hidden");
        form.reset();
      } else {
        alert("Ошибка отправки. Попробуйте позже.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка сети. Напишите нам в WhatsApp.");
    }
  }

  // Навешиваем обработчики на формы
  document.getElementById("heroForm").addEventListener("submit", (e) => {
    e.preventDefault();
    sendToTelegram("heroForm");
  });

  document.getElementById("popupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    sendToTelegram("popupForm");
  });

  // 5. Анимация появления при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });
  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
});
