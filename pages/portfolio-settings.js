/**
 * Portfolio Settings Modal Engine
 * Handles settings modal toggling, theme switching, layout scale, and certificates view mode.
 */
(function() {
  'use strict';

  function injectSettingsStyles() {
    if (document.getElementById('portfolioSettingsStyles')) return;
    const css = `
      #portfolioSettingsModal.settings-modal-backdrop {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999999 !important;
        background: rgba(3, 5, 10, 0.85) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        transition: opacity 0.25s ease, visibility 0.25s ease !important;
      }
      #portfolioSettingsModal.settings-modal-backdrop.open {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      #portfolioSettingsModal .settings-card {
        width: 90% !important;
        max-width: 440px !important;
        background: rgba(13, 17, 28, 0.96) !important;
        border: 1.5px solid rgba(0, 230, 118, 0.4) !important;
        border-radius: 20px !important;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 230, 118, 0.25) !important;
        padding: 24px !important;
        color: #ffffff !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        transform: translateY(20px) scale(0.95) !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-sizing: border-box !important;
      }
      #portfolioSettingsModal.settings-modal-backdrop.open .settings-card {
        transform: translateY(0) scale(1) !important;
      }
      #portfolioSettingsModal .settings-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin-bottom: 20px !important;
        padding-bottom: 12px !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      #portfolioSettingsModal .settings-header h2 {
        font-size: 15px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        margin: 0 !important;
      }
      #portfolioSettingsModal .settings-close-btn {
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        color: #ffffff !important;
        width: 30px !important;
        height: 30px !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 13px !important;
        transition: all 0.2s ease !important;
      }
      #portfolioSettingsModal .settings-close-btn:hover {
        background: rgba(239, 68, 68, 0.3) !important;
        color: #ef4444 !important;
        border-color: #ef4444 !important;
      }
      #portfolioSettingsModal .settings-section {
        margin-bottom: 18px !important;
      }
      #portfolioSettingsModal .settings-label {
        font-size: 11px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        color: #00e5b9 !important;
        margin-bottom: 10px !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      #portfolioSettingsModal .settings-options-group {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)) !important;
        gap: 8px !important;
      }
      #portfolioSettingsModal .settings-opt-btn {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #8e9aaf !important;
        padding: 10px 8px !important;
        border-radius: 12px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        text-align: center !important;
        transition: all 0.2s ease !important;
        outline: none !important;
      }
      #portfolioSettingsModal .settings-opt-btn:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
        border-color: rgba(0, 229, 185, 0.4) !important;
      }
      #portfolioSettingsModal .settings-opt-btn.active {
        background: linear-gradient(135deg, rgba(0, 229, 185, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%) !important;
        border-color: #00e5b9 !important;
        color: #ffffff !important;
        box-shadow: 0 0 16px rgba(0, 229, 185, 0.3) !important;
        font-weight: 700 !important;
      }
      #portfolioSettingsModal .settings-save-footer {
        display: flex !important;
        justify-content: flex-end !important;
        gap: 10px !important;
        margin-top: 22px !important;
        padding-top: 14px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      #portfolioSettingsModal .btn-settings-save {
        background: #00e5b9 !important;
        color: #040508 !important;
        border: none !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        padding: 10px 20px !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      #portfolioSettingsModal .btn-settings-save:hover {
        box-shadow: 0 0 20px rgba(0, 229, 185, 0.6) !important;
        transform: translateY(-1px) !important;
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.id = 'portfolioSettingsStyles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  function initPortfolioSettings() {
    injectSettingsStyles();

    // Inject Settings Modal HTML if not present
    if (!document.getElementById('portfolioSettingsModal')) {
      const modalHTML = `
        <div class="settings-modal-backdrop" id="portfolioSettingsModal" style="display:none; opacity:0; pointer-events:none;">
          <div class="settings-card">
            <div class="settings-header">
              <h2>⚙️ Global Settings &amp; Customization</h2>
              <button class="settings-close-btn" id="closeSettingsBtn" title="Close Settings">✕</button>
            </div>

            <div class="settings-section">
              <div class="settings-label">🎨 Theme Visual Style</div>
              <div class="settings-options-group">
                <button class="settings-opt-btn active" data-theme="default">✨ Cyan Cyber</button>
                <button class="settings-opt-btn" data-theme="obsidian">🖤 Obsidian</button>
                <button class="settings-opt-btn" data-theme="neon">💚 Neon Glow</button>
              </div>
            </div>

            <div class="settings-section">
              <div class="settings-label">🃏 Certificates Display Layout</div>
              <div class="settings-options-group">
                <button class="settings-opt-btn active" data-viewmode="arena">⚔️ Gaming Arena</button>
                <button class="settings-opt-btn" data-viewmode="book">📖 Deck Stack</button>
                <button class="settings-opt-btn" data-viewmode="slider">↔ Slide View</button>
              </div>
            </div>

            <div class="settings-section">
              <div class="settings-label">📐 Layout Density &amp; Card Scale</div>
              <div class="settings-options-group">
                <button class="settings-opt-btn active" data-scale="default">Standard</button>
                <button class="settings-opt-btn" data-scale="micro">Compact</button>
              </div>
            </div>

            <div class="settings-save-footer">
              <button class="btn-settings-save" id="saveSettingsBtn">Save &amp; Apply</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('portfolioSettingsModal');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const openBtns = document.querySelectorAll('.open-portfolio-settings-btn');

    function openModal() {
      if (!modal) return;
      modal.style.display = 'flex';
      requestAnimationFrame(() => {
        modal.classList.add('open');
      });
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      setTimeout(() => {
        if (!modal.classList.contains('open')) {
          modal.style.display = 'none';
        }
      }, 250);
    }

    // Load persisted settings
    const savedTheme = localStorage.getItem('ram_portfolio_theme') || 'default';
    const savedScale = localStorage.getItem('ram_portfolio_scale') || 'default';
    const savedViewMode = localStorage.getItem('ram_portfolio_viewmode') || 'arena';

    applyTheme(savedTheme);
    applyScale(savedScale);

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Delegate click on open-portfolio-settings-btn in case dynamically added
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('.open-portfolio-settings-btn');
      if (openBtn) {
        e.preventDefault();
        openModal();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    if (modal) {
      // Theme selection
      const themeBtns = modal.querySelectorAll('[data-theme]');
      themeBtns.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
          themeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
          themeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const t = btn.dataset.theme;
          localStorage.setItem('ram_portfolio_theme', t);
          applyTheme(t);
        });
      });

      // ViewMode selection
      const viewModeBtns = modal.querySelectorAll('[data-viewmode]');
      viewModeBtns.forEach(btn => {
        if (btn.dataset.viewmode === savedViewMode) {
          viewModeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
          viewModeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const m = btn.dataset.viewmode;
          localStorage.setItem('ram_portfolio_viewmode', m);
          if (typeof window.setCertificatesViewMode === 'function') {
            window.setCertificatesViewMode(m);
          }
        });
      });

      // Scale selection
      const scaleBtns = modal.querySelectorAll('[data-scale]');
      scaleBtns.forEach(btn => {
        if (btn.dataset.scale === savedScale) {
          scaleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
          scaleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const s = btn.dataset.scale;
          localStorage.setItem('ram_portfolio_scale', s);
          applyScale(s);
        });
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const activeThemeBtn = modal ? modal.querySelector('[data-theme].active') : null;
        const activeViewModeBtn = modal ? modal.querySelector('[data-viewmode].active') : null;
        const activeScaleBtn = modal ? modal.querySelector('[data-scale].active') : null;

        const selectedTheme = activeThemeBtn ? activeThemeBtn.dataset.theme : 'default';
        const selectedViewMode = activeViewModeBtn ? activeViewModeBtn.dataset.viewmode : 'arena';
        const selectedScale = activeScaleBtn ? activeScaleBtn.dataset.scale : 'default';

        localStorage.setItem('ram_portfolio_theme', selectedTheme);
        localStorage.setItem('ram_portfolio_viewmode', selectedViewMode);
        localStorage.setItem('ram_portfolio_scale', selectedScale);

        applyTheme(selectedTheme);
        applyScale(selectedScale);

        if (typeof window.setCertificatesViewMode === 'function') {
          window.setCertificatesViewMode(selectedViewMode);
        }

        closeModal();
      });
    }
  }

  function applyTheme(theme) {
    document.body.classList.remove('theme-obsidian', 'theme-neon');
    if (theme === 'obsidian') {
      document.body.classList.add('theme-obsidian');
    } else if (theme === 'neon') {
      document.body.classList.add('theme-neon');
    }
  }

  function applyScale(scale) {
    document.body.classList.remove('scale-micro');
    if (scale === 'micro') {
      document.body.classList.add('scale-micro');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioSettings);
  } else {
    initPortfolioSettings();
  }
})();
