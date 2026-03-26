// ！！！汉堡菜单开关JS！！！

function toggleMenu() {
  const nav = document.getElementById("navMenu");
  nav.classList.toggle("active");
}

// 点击空白关闭菜单
document.addEventListener("click", function(e) {
  const nav = document.getElementById("navMenu");
  const toggleBtn = document.querySelector(".menu-toggle");

  // 如果点击的不是菜单，也不是按钮
  if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
    nav.classList.remove("active");
  }
});