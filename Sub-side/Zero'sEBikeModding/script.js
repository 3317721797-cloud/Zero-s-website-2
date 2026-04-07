// 滚动动画
const items = document.querySelectorAll(".fade-in");

function reveal() {
  const trigger = window.innerHeight * 0.85;

  items.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

// 鼠标动效
document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  document.querySelectorAll(".floating-img").forEach((img, i) => {
    img.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
  });
});