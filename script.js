// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all classes
  const themeManager = new GlobalThemeManager();
  new PageAnimations();
  new KeyboardShortcutsPanel();
  new ThemeSwitcher(themeManager);

  // Expose themeManager globally for keyboard shortcuts
  window.myApp = { themeManager };
});

// --- GLOBAL THEME MANAGER ---
class GlobalThemeManager {
  constructor() {
    this.storageKey = 'portfolio-global-theme';
    this.notification = document.getElementById('themeNotification');
    this.currentTheme = this.getStoredTheme();
    this.applyTheme(this.currentTheme);
  }

  getStoredTheme() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) return stored;
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'dark';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  setTheme(theme) {
    if (theme === this.currentTheme) return;

    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem(this.storageKey, theme);
    this.showNotification(theme);
  }

  showNotification(theme) {
    if (!this.notification) return;

    const iconMap = {
      light: 'fa-sun',
      dark: 'fa-moon',
      blue: 'fa-water',
      purple: 'fa-paint-brush',
      green: 'fa-leaf',
      graphite: 'fa-adjust',
    };

    const iconEl = this.notification.querySelector('.theme-notification-icon');
    const textEl = this.notification.querySelector('.theme-notification-text');

    iconEl.innerHTML = `<i class="fas ${iconMap[theme]}"></i>`;
    textEl.textContent = `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`;

    this.notification.classList.add('active');
    setTimeout(() => {
      this.notification.classList.remove('active');
    }, 2500);
  }
}

// --- PAGE REVEAL ANIMATIONS ---
class PageAnimations {
  constructor() {
    this.sections = document.querySelectorAll('main section');
    this.init();
  }

  init() {
    if (this.sections.length === 0) return;
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    this.sections.forEach((section) => observer.observe(section));
  }
}

// --- KEYBOARD SHORTCUTS PANEL & LISTENER ---
class KeyboardShortcutsPanel {
  constructor() {
    this.toggleButton = document.querySelector('.keyboard-shortcuts-toggle');
    this.panel = document.querySelector('.keyboard-shortcuts-panel');
    if (!this.toggleButton || !this.panel) return;
    this.init();
  }

  init() {
    this.toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.panel.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (
        this.panel.classList.contains('active') &&
        !this.panel.contains(e.target)
      ) {
        this.panel.classList.remove('active');
      }
    });
  }
}

// --- THEME SWITCHER ---
class ThemeSwitcher {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.toggleButton = document.querySelector('.theme-switcher-toggle');
    this.panel = document.querySelector('.theme-switcher-panel');
    this.themeItems = document.querySelectorAll('.theme-switcher-panel li');

    if (!this.toggleButton || !this.panel) return;
    this.init();
  }

  init() {
    this.toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.panel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (this.panel.classList.contains('active') && !this.panel.contains(e.target)) {
        this.panel.classList.remove('active');
      }
    });

    this.themeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        this.themeManager.setTheme(theme);
        this.panel.classList.remove('active');
      });
    });
  }
}

// Global listener for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && window.myApp && window.myApp.themeManager) {
    const key = e.key;
    const themes = ['dark', 'light', 'blue', 'purple', 'green', 'graphite'];

    if (key >= '1' && key <= '6') {
      e.preventDefault();
      window.myApp.themeManager.setTheme(themes[parseInt(key) - 1]);
    }
  }
});
