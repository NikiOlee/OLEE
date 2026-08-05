const navBar = document.querySelector("header");
const title = document.querySelector("h1");
const logo = document.querySelector(".OLEElogo");
const newsBtn = document.querySelector(".newsBtn");

document.getElementById("year").textContent = new Date().getFullYear();

// Логика шапки при скролле
window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    document.body.classList.add("scrolled");
    navBar.classList.remove("normal");
    navBar.classList.add("small");
    logo.classList.remove("normalLogo");
    logo.classList.add("smallLogo");
    title.textContent = "";
  } else {
    document.body.classList.remove("scrolled");
    navBar.classList.remove("small");
    navBar.classList.add("normal");
    logo.classList.remove("smallLogo");
    logo.classList.add("normalLogo");
    title.textContent = "OLEE";
  }

  const logos = document.querySelectorAll(".flying-logo");
  logos.forEach((item) => {
    const speed = item.getAttribute("data-speed");
    const rotation = item.getAttribute("data-rotation") || 0;
    const yPos = -(window.scrollY * speed);

    item.style.transform = `translateY(${yPos}px) rotateZ(${rotation}deg)`;
  });
});

// Анимация появления блоков при скролле (оптимизировано под ПК и мобилки)
const blockObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.05,
    rootMargin: "0px 0px 50px 0px",
  }
);

document.querySelectorAll(".block").forEach((block) => {
  blockObserver.observe(block);
});

// Прокрутка слайдера
function slideLeft() {
  document
    .querySelector(".olee-slider")
    .scrollBy({ left: -280, behavior: "smooth" });
}

function slideRight() {
  document
    .querySelector(".olee-slider")
    .scrollBy({ left: 280, behavior: "smooth" });
}

// 1. Логика FAQ (Аккордеон)
document.querySelectorAll(".block ul li").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

// 2. Копирование текста по клику на .copy
document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", () => {
    const textToCopy =
      btn.getAttribute("data-copy") ||
      btn.parentElement.innerText.replace("📋", "").replace("✅", "").trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalIcon = btn.innerHTML;
      btn.innerHTML = "✅";
      setTimeout(() => {
        btn.innerHTML = originalIcon;
      }, 1500);
    });
  });
});