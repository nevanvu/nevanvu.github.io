document.addEventListener("DOMContentLoaded", () => {
  let darkTheme = "dark";
  let lightTheme = "light";
  let darkMode = "dark-mode";
  let lightMode = "light-mode";

  const toggleButton = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme == darkTheme) {
    document.body.classList.toggle(darkMode);
  } else if (currentTheme == lightTheme) {
    document.body.classList.toggle(lightMode);
  }

  toggleButton.addEventListener("click", () => {
    let theme;
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle(lightMode);
      theme = document.body.classList.contains(lightMode)
        ? lightTheme
        : darkTheme;
    } else {
      document.body.classList.toggle(darkMode);
      theme = document.body.classList.contains(darkMode)
        ? darkTheme
        : lightTheme;
    }
    localStorage.setItem("theme", theme);
  });
});