const navBar = document.querySelector("header");
const title = document.querySelector("h1");
const logo = document.querySelector(".OLEElogo");
const newsBtn = document.querySelector(".newsBtn");

document.getElementById("year").textContent = new Date().getFullYear();

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

function updateHeaderHeight() {
  const header = document.querySelector("header");
  if (header) {
    const exactHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      "--header-h",
      exactHeight + "px",
    );
  }
}

window.addEventListener("resize", updateHeaderHeight);
updateHeaderHeight();
