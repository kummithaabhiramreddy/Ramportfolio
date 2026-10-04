/* ==========================================================================
   RAM OS PLATFORM ENGINE — DUAL OS (PC/MOBILE), COGNISPHERE AI & PLAY STORE
   ========================================================================== */

(function () {
  'use strict';

  if (window.self !== window.top) {
    return; // Prevent duplicate OS / AI elements inside iframe slide view
  }

  // State Management
  const OSState = {
    mode: localStorage.getItem('ramOS_mode') || window.OS_CONFIG.system.defaultMode || 'pc',
    installedAppIds: JSON.parse(localStorage.getItem('ramOS_installed')) || 
      window.OS_CONFIG.apps.filter(a => a.installed).map(a => a.id),
    openWindows: [],
    activeCategory: 'All',
    searchQuery: '',
    activeWindowZIndex: 100
  };

  let elements = {};

  // Initialize OS Platform
  function initOS() {
    createOSDOMStructure();
    createAskCognispherePill();
    cacheDOMElements();
    bindEvents();
    bindMainPageSearch();
    renderOS();
    startClock();
  }

  // Create the "Ask Cognisphere" Top-Right Pill Capsule Widget
  function createAskCognispherePill() {
    if (document.getElementById('askCognispherePillWrap') || document.getElementById('osAskCognispherePillWrap')) return;

    const pillHTML = `
      <div class="os-ask-cognisphere-pill-wrap" id="osAskCognispherePillWrap">
        <div class="os-ask-cognisphere-pill-btn" id="osAskCognispherePillBtn" title="Ask Cognisphere AI">
          <div class="os-ask-cognisphere-pill-icon">
            <img src="../images/cognisphere-icon-trimmed.svg" alt="Cognisphere Logo" onerror="this.src='../images/cognisphere-icon-trimmed.svg'">
          </div>
          <span class="os-ask-cognisphere-pill-text">Ask Cognisphere</span>
          <span class="os-ask-cognisphere-pill-cursor"></span>
        </div>

        <div class="os-ask-cognisphere-dropdown" id="osAskCognispherePillDropdown">
          <input type="text" class="os-ask-cognisphere-input" id="osAskCognispherePillInput" placeholder="Ask Cognisphere AI or search apps..." autocomplete="off" />
          <div class="os-ask-cognisphere-results" id="osAskCognispherePillResults"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', pillHTML);
    bindAskCognispherePillEvents();
  }

  // Bind Ask Cognisphere Pill Widget Events
  function bindAskCognispherePillEvents() {
    const pillBtn = document.getElementById('osAskCognispherePillBtn') || document.getElementById('askCognispherePillBtn');
    const dropdown = document.getElementById('osAskCognispherePillDropdown') || document.getElementById('askCognispherePillDropdown');
    const input = document.getElementById('osAskCognispherePillInput') || document.getElementById('askCognispherePillInput');
    const results = document.getElementById('osAskCognispherePillResults') || document.getElementById('askCognispherePillResults');

    if (!pillBtn) return;

    pillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.openCognisphereAI === 'function') {
        window.openCognisphereAI();
        return;
      }
      if (dropdown) {
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open') && input) {
          input.focus();
          renderPillResults('');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (dropdown && !e.target.closest('#osAskCognispherePillWrap') && !e.target.closest('#askCognispherePillWrap')) {
        dropdown.classList.remove('open');
      }
    });

    if (input) {
      input.addEventListener('input', (e) => {
        renderPillResults(e.target.value.toLowerCase().trim());
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = input.value.trim();
          if (dropdown) dropdown.classList.remove('open');
          handleCognisphereSearch(query);
        }
      });
    }

    function renderPillResults(val) {
      if (!results) return;
      let matches = window.OS_CONFIG.apps;
      if (val) {
        matches = matches.filter(a => a.name.toLowerCase().includes(val) || a.description.toLowerCase().includes(val));
      } else {
        matches = matches.slice(0, 5); // Show top 5 suggested apps by default
      }

      if (matches.length > 0) {
        results.innerHTML = matches.map(app => `
          <div class="os-ask-cognisphere-item" data-id="${app.id}">
            <span style="font-size:18px;">${app.icon}</span>
            <div style="flex:1; min-width:0;">
              <div style="font-size:12.5px; font-weight:600; color:#fff;">${app.name}</div>
              <div style="font-size:10.5px; color:var(--os-text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${app.tagline}</div>
            </div>
          </div>
        `).join('');

        results.querySelectorAll('.os-ask-cognisphere-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            if (dropdown) dropdown.classList.remove('open');
            window.showOSPlatform('pc');
            launchApp(id);
          });
        });
      } else {
        results.innerHTML = `
          <div style="padding:10px; font-size:11.5px; color:var(--os-text-muted); text-align:center;">
            Press Enter to query Cognisphere AI...
          </div>
        `;
      }
    }
  }

  // Create the main OS modal overlay structure
  function createOSDOMStructure() {
    if (document.getElementById('osPlatformModal')) return;

    const modalHTML = `
      <div id="osPlatformModal">
        <!-- Top Navigation Shell Header -->
        <header class="os-shell-header">
          <div class="os-brand-logo">
            <img src="../images/cognisphere-icon-trimmed.svg" alt="Cognisphere Logo" onerror="this.src='../images/cognisphere-icon-trimmed.svg'">
            <span id="osBrandNameText">${window.OS_CONFIG.system.brandName}</span>
          </div>

          <div class="os-mode-switcher">
            <button class="os-mode-btn ${OSState.mode === 'pc' ? 'active' : ''}" id="osModePCBtn">
              🖥️ PC Desktop
            </button>
            <button class="os-mode-btn ${OSState.mode === 'mobile' ? 'active' : ''}" id="osModeMobileBtn">
              📱 Mobile Phone
            </button>
          </div>

          <button class="os-close-btn" id="osClosePlatformBtn" title="Close OS Platform">✕</button>
        </header>

        <!-- Viewport Container -->
        <main class="os-viewport" id="osViewport">
          <!-- PC Mode Layout -->
          <div class="pc-desktop-container" id="pcDesktopLayout" style="display: ${OSState.mode === 'pc' ? 'flex' : 'none'};">
            <div class="pc-desktop-screen" id="pcDesktopScreen">
              <!-- Cognisphere AI Search Widget -->
              <div class="pc-cognisphere-widget">
                <img src="../images/cognisphere-icon-trimmed.svg" alt="Cognisphere Logo" onerror="this.src='../images/cognisphere-icon-trimmed.svg'">
                <input type="text" class="cognisphere-input" id="pcCognisphereInput" placeholder="Search apps, projects, or ask Cognisphere AI..." />
                <button class="cognisphere-btn" id="pcCognisphereSearchBtn">➔</button>
              </div>

              <!-- Desktop Apps Grid -->
              <div class="pc-app-grid" id="pcAppGrid"></div>
            </div>

            <!-- Taskbar -->
            <footer class="pc-taskbar">
              <div class="pc-taskbar-left">
                <button class="pc-start-btn" id="pcStartMenuBtn">
                  <span>⚡</span> Start
                </button>
                <button class="pc-taskbar-app-icon" id="pcPlayStoreTaskbarBtn" title="Play Store">
                  🛍️
                </button>
              </div>

              <div class="pc-taskbar-center" id="pcTaskbarAppList"></div>

              <div class="pc-taskbar-right">
                <div class="pc-clock" id="pcClock">12:00 PM</div>
              </div>
            </footer>
          </div>

          <!-- Mobile Mode Layout -->
          <div class="mobile-os-container" id="mobileOSLayout" style="display: ${OSState.mode === 'mobile' ? 'flex' : 'none'};">
            <div class="mobile-phone-frame">
              <div class="mobile-phone-notch">
                <div class="mobile-phone-camera"></div>
              </div>

              <div class="mobile-status-bar">
                <span id="mobileClock">12:00</span>
                <span>📶 5G 🔋 98%</span>
              </div>

              <div class="mobile-screen-body" id="mobileScreenBody">
                <div>
                  <!-- Cognisphere AI Widget Mobile -->
                  <div class="mobile-cognisphere-widget">
                    <img src="../images/cognisphere-icon-trimmed.svg" alt="Cognisphere Logo" onerror="this.src='../images/cognisphere-icon-trimmed.svg'">
                    <input type="text" class="cognisphere-input" id="mobileCognisphereInput" placeholder="Search ${window.OS_CONFIG.system.searchEngineName}..." />
                  </div>

                  <!-- Mobile Apps Grid -->
                  <div class="mobile-app-grid" id="mobileAppGrid"></div>
                </div>

                <!-- Bottom Dock -->
                <div class="mobile-dock" id="mobileDock">
                  <div class="mobile-app-item" id="mobileDockStoreBtn">
                    <div class="mobile-app-icon" style="background: rgba(0, 230, 118, 0.15);">🛍️</div>
                    <span class="mobile-app-name">Store</span>
                  </div>
                  <div class="mobile-app-item" id="mobileDockSearchBtn">
                    <div class="mobile-app-icon" style="background: rgba(0, 240, 255, 0.15);">
                      <img src="../images/cognisphere-icon-trimmed.svg" style="width:24px;height:24px;" onerror="this.src='../images/cognisphere-icon-trimmed.svg'">
                    </div>
                    <span class="mobile-app-name">Cognisphere</span>
                  </div>
                  <div class="mobile-app-item" id="mobileDockByteloopBtn">
                    <div class="mobile-app-icon" style="background: rgba(123, 97, 255, 0.15);">⚡</div>
                    <span class="mobile-app-name">ByteLoop</span>
                  </div>
                </div>

                <!-- Gesture Bar -->
                <div class="mobile-gesture-bar">
                  <div class="mobile-home-pill"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Play Store Modal / App Hub -->
          <div class="playstore-modal" id="playStoreModal">
            <div class="playstore-header">
              <div class="playstore-title">
                <span>🛍️</span>
                <span>${window.OS_CONFIG.system.storeName}</span>
              </div>
              <input type="text" class="playstore-search" id="playStoreSearchInput" placeholder="Search Play Store apps..." />
              <button class="os-close-btn" id="closePlayStoreBtn">✕</button>
            </div>

            <div class="playstore-categories" id="playStoreCategories"></div>
            <div class="playstore-body" id="playStoreAppGrid"></div>
          </div>
        </main>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Cache element references
  function cacheDOMElements() {
    elements = {
      modal: document.getElementById('osPlatformModal'),
      pcLayout: document.getElementById('pcDesktopLayout'),
      mobileLayout: document.getElementById('mobileOSLayout'),
      pcModeBtn: document.getElementById('osModePCBtn'),
      mobileModeBtn: document.getElementById('osModeMobileBtn'),
      closeBtn: document.getElementById('osClosePlatformBtn'),
      pcAppGrid: document.getElementById('pcAppGrid'),
      mobileAppGrid: document.getElementById('mobileAppGrid'),
      pcTaskbarList: document.getElementById('pcTaskbarAppList'),
      playStoreModal: document.getElementById('playStoreModal'),
      closePlayStoreBtn: document.getElementById('closePlayStoreBtn'),
      pcPlayStoreTaskbarBtn: document.getElementById('pcPlayStoreTaskbarBtn'),
      mobileDockStoreBtn: document.getElementById('mobileDockStoreBtn'),
      mobileDockByteloopBtn: document.getElementById('mobileDockByteloopBtn'),
      playStoreCategories: document.getElementById('playStoreCategories'),
      playStoreAppGrid: document.getElementById('playStoreAppGrid'),
      playStoreSearchInput: document.getElementById('playStoreSearchInput'),
      pcCognisphereInput: document.getElementById('pcCognisphereInput'),
      pcCognisphereSearchBtn: document.getElementById('pcCognisphereSearchBtn'),
      mobileCognisphereInput: document.getElementById('mobileCognisphereInput'),
      pcClock: document.getElementById('pcClock'),
      mobileClock: document.getElementById('mobileClock')
    };
  }

  // Event Listeners
  function bindEvents() {
    elements.pcModeBtn.addEventListener('click', () => switchMode('pc'));
    elements.mobileModeBtn.addEventListener('click', () => switchMode('mobile'));
    elements.closeBtn.addEventListener('click', hideOSPlatform);

    elements.pcPlayStoreTaskbarBtn.addEventListener('click', togglePlayStore);
    if (elements.mobileDockStoreBtn) {
      elements.mobileDockStoreBtn.addEventListener('click', togglePlayStore);
    }
    if (elements.mobileDockByteloopBtn) {
      elements.mobileDockByteloopBtn.addEventListener('click', () => launchApp('byteloop'));
    }
    elements.closePlayStoreBtn.addEventListener('click', () => {
      elements.playStoreModal.classList.remove('open');
    });

    elements.playStoreSearchInput.addEventListener('input', (e) => {
      OSState.searchQuery = e.target.value.toLowerCase();
      renderPlayStoreApps();
    });

    elements.pcCognisphereInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCognisphereSearch(e.target.value);
    });
    elements.pcCognisphereSearchBtn.addEventListener('click', () => {
      handleCognisphereSearch(elements.pcCognisphereInput.value);
    });
    elements.mobileCognisphereInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCognisphereSearch(e.target.value);
    });
  }

  // Bind Main Page Search Widget
  function bindMainPageSearch() {
    const mainInput = document.getElementById('mainCognisphereInput');
    const mainBtn = document.getElementById('mainCognisphereSearchBtn');
    const dropdown = document.getElementById('mainCognisphereDropdown');

    if (!mainInput) return;

    mainInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (!val) {
        dropdown.classList.remove('open');
        return;
      }

      const matches = window.OS_CONFIG.apps.filter(app => 
        app.name.toLowerCase().includes(val) || 
        app.description.toLowerCase().includes(val) ||
        app.category.toLowerCase().includes(val)
      );

      if (matches.length > 0) {
        dropdown.innerHTML = matches.map(app => `
          <div class="cognisphere-result-item" data-id="${app.id}">
            <span class="cognisphere-result-icon">${app.icon}</span>
            <div>
              <div class="cognisphere-result-title">${app.name}</div>
              <div class="cognisphere-result-desc">${app.tagline}</div>
            </div>
          </div>
        `).join('');

        dropdown.classList.add('open');

        dropdown.querySelectorAll('.cognisphere-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            window.showOSPlatform('pc');
            launchApp(id);
            dropdown.classList.remove('open');
          });
        });
      } else {
        dropdown.innerHTML = `
          <div style="padding:12px; font-size:12px; color:var(--os-text-muted); text-align:center;">
            Press Enter to search Cognisphere AI...
          </div>
        `;
        dropdown.classList.add('open');
      }
    });

    mainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        dropdown.classList.remove('open');
        handleCognisphereSearch(mainInput.value);
      }
    });

    if (mainBtn) {
      mainBtn.addEventListener('click', () => {
        dropdown.classList.remove('open');
        handleCognisphereSearch(mainInput.value);
      });
    }

    document.querySelectorAll('.cognisphere-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const appId = chip.getAttribute('data-app-id');
        if (appId === 'playstore') {
          window.showOSPlatform('pc');
          togglePlayStore();
        } else if (appId) {
          window.showOSPlatform('pc');
          launchApp(appId);
        }
      });
    });
  }

  // Switch between PC and Mobile modes
  function switchMode(mode) {
    OSState.mode = mode;
    localStorage.setItem('ramOS_mode', mode);

    elements.pcModeBtn.classList.toggle('active', mode === 'pc');
    elements.mobileModeBtn.classList.toggle('active', mode === 'mobile');

    elements.pcLayout.style.display = mode === 'pc' ? 'flex' : 'none';
    elements.mobileLayout.style.display = mode === 'mobile' ? 'flex' : 'none';
  }

  // Render OS Desktop & Installed Apps
  function renderOS() {
    renderInstalledApps();
    renderPlayStoreCategories();
    renderPlayStoreApps();
  }

  function getInstalledApps() {
    return window.OS_CONFIG.apps.filter(app => OSState.installedAppIds.includes(app.id));
  }

  function renderInstalledApps() {
    const installed = getInstalledApps();

    elements.pcAppGrid.innerHTML = installed.map(app => `
      <div class="pc-app-shortcut" data-id="${app.id}">
        <div class="pc-app-icon-wrap" style="background: ${app.iconColor}22; border-color: ${app.iconColor}44;">
          ${app.icon}
        </div>
        <span class="pc-app-title">${app.name}</span>
      </div>
    `).join('');

    elements.pcAppGrid.querySelectorAll('.pc-app-shortcut').forEach(el => {
      el.addEventListener('click', () => launchApp(el.getAttribute('data-id')));
    });

    elements.mobileAppGrid.innerHTML = installed.map(app => `
      <div class="mobile-app-item" data-id="${app.id}">
        <div class="mobile-app-icon" style="background: ${app.iconColor}25;">${app.icon}</div>
        <span class="mobile-app-name">${app.name}</span>
      </div>
    `).join('');

    elements.mobileAppGrid.querySelectorAll('.mobile-app-item').forEach(el => {
      el.addEventListener('click', () => launchApp(el.getAttribute('data-id')));
    });
  }

  function renderPlayStoreCategories() {
    elements.playStoreCategories.innerHTML = window.OS_CONFIG.categories.map(cat => `
      <button class="playstore-cat-pill ${OSState.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
        ${cat}
      </button>
    `).join('');

    elements.playStoreCategories.querySelectorAll('.playstore-cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        OSState.activeCategory = btn.getAttribute('data-cat');
        renderPlayStoreCategories();
        renderPlayStoreApps();
      });
    });
  }

  function renderPlayStoreApps() {
    let filtered = window.OS_CONFIG.apps;

    if (OSState.activeCategory !== 'All') {
      filtered = filtered.filter(app => app.category === OSState.activeCategory);
    }

    if (OSState.searchQuery) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(OSState.searchQuery) ||
        app.description.toLowerCase().includes(OSState.searchQuery)
      );
    }

    elements.playStoreAppGrid.innerHTML = filtered.map(app => {
      const isInstalled = OSState.installedAppIds.includes(app.id);
      return `
        <div class="store-app-card">
          <div class="store-card-head">
            <div class="store-card-icon" style="background: ${app.iconColor}22;">${app.icon}</div>
            <div style="flex:1;">
              <div style="font-size:14px; font-weight:600; color:var(--os-text);">${app.name}</div>
              <div style="font-size:11px; color:var(--os-text-muted);">${app.tagline}</div>
              <div style="font-family:'DM Mono',monospace; font-size:10.5px; color:var(--os-accent-lime); margin-top:2px;">
                ⭐ ${app.rating} • 📥 ${app.downloads}
              </div>
            </div>
          </div>
          <p style="font-size:11.5px; color:var(--os-text-muted); line-height:1.4;">${app.description}</p>
          <button class="store-install-btn ${isInstalled ? 'installed' : ''}" data-id="${app.id}">
            ${isInstalled ? '✓ Installed (Open)' : 'Install App'}
          </button>
        </div>
      `;
    }).join('');

    elements.playStoreAppGrid.querySelectorAll('.store-install-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const appId = btn.getAttribute('data-id');
        toggleInstallApp(appId);
      });
    });
  }

  function toggleInstallApp(appId) {
    if (OSState.installedAppIds.includes(appId)) {
      launchApp(appId);
      elements.playStoreModal.classList.remove('open');
    } else {
      OSState.installedAppIds.push(appId);
      localStorage.setItem('ramOS_installed', JSON.stringify(OSState.installedAppIds));
      renderInstalledApps();
      renderPlayStoreApps();
    }
  }

  function launchApp(appId) {
    const app = window.OS_CONFIG.apps.find(a => a.id === appId);
    if (!app) return;

    if (OSState.mode === 'pc') {
      createPCWindow(app);
    } else {
      createMobileAppView(app);
    }
  }

  function bringToFront(winEl) {
    if (!winEl) return;
    OSState.activeWindowZIndex += 1;
    winEl.style.zIndex = OSState.activeWindowZIndex;
    winEl.classList.remove('minimized');
    
    // Update taskbar active state
    const windowId = winEl.id;
    if (elements.pcTaskbarList) {
      elements.pcTaskbarList.querySelectorAll('.pc-taskbar-app-icon').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tb_${windowId}`);
      });
    }
  }

  function createPCWindow(app) {
    // Check if app window already exists
    const existingWin = document.querySelector(`.os-window[data-app-id="${app.id}"]`);
    if (existingWin) {
      bringToFront(existingWin);
      return;
    }

    const windowId = `win_${app.id}_${Date.now()}`;
    OSState.activeWindowZIndex += 1;

    const windowHTML = `
      <div class="os-window" id="${windowId}" data-app-id="${app.id}" style="z-index: ${OSState.activeWindowZIndex};">
        <div class="os-window-header">
          <div class="os-window-title">
            <span>${app.icon}</span>
            <span>${app.name}</span>
          </div>
          <div class="os-window-controls">
            <button class="win-btn win-min" id="min_${windowId}" title="Minimize"></button>
            <button class="win-btn win-max" id="max_${windowId}" title="Maximize"></button>
            <button class="win-btn win-close" id="close_${windowId}" title="Close"></button>
          </div>
        </div>
        <div class="os-window-body">
          <iframe src="${app.url}" class="os-window-iframe" loading="lazy"></iframe>
        </div>
      </div>
    `;

    elements.pcLayout.querySelector('.pc-desktop-screen').insertAdjacentHTML('beforeend', windowHTML);
    const winEl = document.getElementById(windowId);

    // Create taskbar button
    let tbBtn = null;
    if (elements.pcTaskbarList) {
      tbBtn = document.createElement('button');
      tbBtn.className = 'pc-taskbar-app-icon active';
      tbBtn.id = `tb_${windowId}`;
      tbBtn.title = app.name;
      tbBtn.innerHTML = `<span>${app.icon}</span>`;
      elements.pcTaskbarList.appendChild(tbBtn);

      tbBtn.addEventListener('click', () => {
        if (winEl.classList.contains('minimized')) {
          bringToFront(winEl);
        } else if (winEl.style.zIndex == OSState.activeWindowZIndex) {
          winEl.classList.add('minimized');
          tbBtn.classList.remove('active');
        } else {
          bringToFront(winEl);
        }
      });
    }

    // Close button
    document.getElementById(`close_${windowId}`).addEventListener('click', (e) => {
      e.stopPropagation();
      winEl.remove();
      if (tbBtn) tbBtn.remove();
    });

    // Minimize button
    document.getElementById(`min_${windowId}`).addEventListener('click', (e) => {
      e.stopPropagation();
      winEl.classList.add('minimized');
      if (tbBtn) tbBtn.classList.remove('active');
    });

    // Maximize button
    document.getElementById(`max_${windowId}`).addEventListener('click', (e) => {
      e.stopPropagation();
      winEl.classList.toggle('maximized');
      bringToFront(winEl);
    });

    winEl.addEventListener('mousedown', () => {
      bringToFront(winEl);
    });

    makeDraggable(winEl);
  }

  function makeDraggable(winEl) {
    const header = winEl.querySelector('.os-window-header');
    const iframe = winEl.querySelector('.os-window-iframe');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    function onPointerDown(e) {
      if (e.target.closest('.os-window-controls')) return;
      if (winEl.classList.contains('maximized')) return;
      
      isDragging = true;
      winEl.classList.add('is-dragging');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - winEl.offsetLeft;
      offsetY = clientY - winEl.offsetTop;

      if (iframe) iframe.style.pointerEvents = 'none';
      bringToFront(winEl);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let left = clientX - offsetX;
      let top = clientY - offsetY;

      // Clamp within desktop viewport
      const maxLeft = window.innerWidth - 80;
      const maxTop = window.innerHeight - 80;
      left = Math.max(-100, Math.min(left, maxLeft));
      top = Math.max(0, Math.min(top, maxTop));

      winEl.style.left = `${left}px`;
      winEl.style.top = `${top}px`;
    }

    function onPointerUp() {
      if (isDragging) {
        isDragging = false;
        winEl.classList.remove('is-dragging');
        if (iframe) iframe.style.pointerEvents = 'auto';
      }
    }

    header.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    header.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: true });
    document.addEventListener('touchend', onPointerUp);
  }

  function createMobileAppView(app) {
    let mobileView = document.getElementById('mobileAppOverlay');
    if (!mobileView) {
      mobileView = document.createElement('div');
      mobileView.id = 'mobileAppOverlay';
      mobileView.style.cssText = `
        position: absolute; inset: 0; z-index: 1000; background: #000;
        display: flex; flex-direction: column; animation: mobileAppSlide 0.25s ease;
      `;
      document.querySelector('.mobile-phone-frame').appendChild(mobileView);
    }

    mobileView.innerHTML = `
      <div style="height:40px; background:#12121c; display:flex; align-items:center; justify-content:space-between; padding:0 14px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <button id="mobileBackHomeBtn" style="background:none; border:none; color:var(--os-accent-lime); font-size:12px; cursor:pointer; font-family:'DM Mono',monospace;">← Back</button>
        <span style="font-size:12px; font-weight:bold; color:#fff;">${app.name}</span>
        <span></span>
      </div>
      <iframe src="${app.url}" style="flex:1; width:100%; border:none;"></iframe>
    `;

    document.getElementById('mobileBackHomeBtn').addEventListener('click', () => {
      mobileView.remove();
    });
  }

  function handleCognisphereSearch(query) {
    if (!query) return;

    const match = window.OS_CONFIG.apps.find(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) || 
      a.id.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      window.showOSPlatform('pc');
      launchApp(match.id);
    } else {
      window.showOSPlatform('pc');
      alert(`🤖 Cognisphere AI Search results for: "${query}"\n\nLaunching AI Assistant Studio...`);
      launchApp('ai-future');
    }
  }

  function togglePlayStore() {
    elements.playStoreModal.classList.toggle('open');
  }

  function startClock() {
    function update() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (elements.pcClock) elements.pcClock.textContent = timeStr;
      if (elements.mobileClock) elements.mobileClock.textContent = timeStr;
    }
    update();
    setInterval(update, 10000);
  }

  window.showOSPlatform = function (mode) {
    if (mode) switchMode(mode);
    const modal = document.getElementById('osPlatformModal');
    if (modal) modal.classList.add('open');
  };

  function hideOSPlatform() {
    const modal = document.getElementById('osPlatformModal');
    if (modal) modal.classList.remove('open');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOS);
  } else {
    initOS();
  }
})();
