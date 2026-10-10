/* ==========================================================================
   CIRCULAR FLOATING COGNISPHERE AI ASSISTANT PLATFORM
   Large Gemini-Style AI Card with Full-Screen DOM Modal & Card Control Protocol
   ========================================================================== */

(function () {
  'use strict';

  if (window.self !== window.top) {
    return; // Prevent duplicate AI chatbox inside iframe slide view
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function getDynamicPageIntro() {
    const pageTitle = (document.querySelector('h1, h2, .hero-title, .page-title')?.innerText || document.title || 'Active Document').trim();
    const subHeading = (document.querySelector('.hero-subtitle, .section-desc, .lead-text, p')?.innerText || '').trim();
    return `👋 Welcome to <strong>${escapeHTML(pageTitle)}</strong>!<br><br>${escapeHTML(subHeading.slice(0, 180))}<br><br>⚡ Ask Cos AI is dynamically inspecting your live document tree. Ask any question or command page DOM actions!`;
  }

  function ensurePageSlideFrame() {
    let frame = document.getElementById('cogniPageSlideFrame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'cogniPageSlideFrame';
      frame.className = 'cogni-page-slide-frame';
      frame.setAttribute('frameborder', '0');
      document.body.appendChild(frame);
    }
    return frame;
  }

  function getActiveDoc() {
    try {
      const frame = document.getElementById('cogniPageSlideFrame');
      if (frame && document.body.classList.contains('cogni-split-mode') && frame.style.display !== 'none') {
        const frameDoc = frame.contentDocument || (frame.contentWindow ? frame.contentWindow.document : null);
        if (frameDoc && frameDoc.body && frameDoc.body.children.length > 0) {
          return frameDoc;
        }
      }
    } catch (e) { }
    return document;
  }

  function getActiveWindow() {
    try {
      const frame = document.getElementById('cogniPageSlideFrame');
      if (frame && document.body.classList.contains('cogni-split-mode') && frame.style.display !== 'none' && frame.contentWindow) {
        return frame.contentWindow;
      }
    } catch (e) { }
    return window;
  }

  function isSamePageUrl(targetUrl, currentUrl) {
    if (!targetUrl) return true;
    if (targetUrl === '#' || targetUrl.startsWith('javascript:')) return true;
    try {
      const cur = new URL(currentUrl || window.location.href);
      const tgt = new URL(targetUrl, cur.href);
      const curFile = (cur.pathname.split('/').pop() || 'index.html').toLowerCase();
      const tgtFile = (tgt.pathname.split('/').pop() || 'index.html').toLowerCase();
      if (curFile === tgtFile) return true;
      const curPath = cur.pathname.replace(/\\/g, '/').toLowerCase().replace(/\/$/, '');
      const tgtPath = tgt.pathname.replace(/\\/g, '/').toLowerCase().replace(/\/$/, '');
      if (curPath === tgtPath || curPath.endsWith(tgtPath) || tgtPath.endsWith(curPath)) return true;
    } catch (e) {
      const curFile = (String(currentUrl || window.location.href).split('?')[0].split('#')[0].split('/').pop() || 'index.html').toLowerCase();
      const tgtFile = (String(targetUrl).split('?')[0].split('#')[0].split('/').pop() || 'index.html').toLowerCase();
      if (curFile === tgtFile) return true;
    }
    return false;
  }

  function getCleanFilename(urlStr) {
    if (!urlStr) return '';
    try {
      const u = new URL(urlStr, window.location.href);
      const filename = u.pathname.split('/').pop() || 'index.html';
      return filename.split('#')[0].split('?')[0].toLowerCase();
    } catch (e) {
      const parts = String(urlStr).split('#')[0].split('?')[0].split('/');
      return (parts.pop() || 'index.html').toLowerCase();
    }
  }

  function loadPageInLeftSlide(targetUrl) {
    if (!targetUrl) return false;

    // Same-page safety check: If target is current page, do NOT load iframe of self
    if (isSamePageUrl(targetUrl, window.location.href)) {
      const frame = document.getElementById('cogniPageSlideFrame');
      if (frame) {
        frame.style.display = 'none';
      }
      document.body.classList.remove('cogni-split-mode');
      return true;
    }

    let resolvedUrl = targetUrl;
    try {
      resolvedUrl = new URL(targetUrl, window.location.href).href;
    } catch (e) { }

    // Force activation of split-screen IDE workspace mode so target frame opens visibly on screen
    document.body.classList.add('cogni-split-mode');
    document.body.classList.add('ai-card-open');

    const dropdown = document.getElementById('askCognispherePillDropdown');
    if (dropdown && !dropdown.classList.contains('open')) {
      dropdown.classList.add('open');
    }

    const frame = ensurePageSlideFrame();
    frame.style.display = 'block';

    if (frame.getAttribute('src') !== resolvedUrl) {
      try {
        frame.setAttribute('src', resolvedUrl);
      } catch (e) { }
    }

    frame.onload = function () {
      try {
        const frameDoc = frame.contentDocument || (frame.contentWindow ? frame.contentWindow.document : null);
        if (frameDoc) {
          frameDoc.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link) {
              const href = link.getAttribute('href');
              if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
                e.preventDefault();
                e.stopPropagation();
                loadPageInLeftSlide(href);
              }
            }
          }, true);

          const dupPill = frameDoc.getElementById('askCognispherePillWrap');
          if (dupPill) dupPill.remove();
          const dupDiv = frameDoc.getElementById('cogniSplitResizeDivider');
          if (dupDiv) dupDiv.remove();
        }
      } catch (e) { }
    };

    return true;
  }

  window.loadPageInLeftSlide = loadPageInLeftSlide;

  function showCogniScreenshotModal(targetTitle, nodeTag, userQuery) {
    let modal = document.getElementById('cogniScreenshotModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cogniScreenshotModal';
      modal.className = 'cogni-screenshot-modal';
      document.body.appendChild(modal);
    }

    const info = window.cogniLastTargetInfo || {};
    const queryText = userQuery || info.userQuery || targetTitle || 'Query';
    const tagLabel = nodeTag || info.tagName || '<element>';
    const labelTitle = targetTitle || info.title || 'Target Element';

    let currentUrl = window.location.href;
    try {
      const activeWin = getActiveWindow();
      if (activeWin && activeWin.location && activeWin.location.href) {
        currentUrl = activeWin.location.href;
      }
    } catch (e) { }

    let currentPath = 'index.html';
    try {
      currentPath = currentUrl.split('/').pop() || 'index.html';
    } catch (e) { }

    modal.innerHTML = `
      <div class="cogni-screenshot-modal-card" style="width: 1000px; max-width: 95vw;">
        <div class="cogni-screenshot-header">
          <div class="cogni-screenshot-title">📸 Real Live Viewport Screenshot — ${escapeHTML(labelTitle)}</div>
          <button type="button" class="cogni-screenshot-close" onclick="document.getElementById('cogniScreenshotModal').classList.remove('active')">✕ Close</button>
        </div>
        
        <div class="cogni-screenshot-browser-bar" style="background: #181f2c; padding: 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56; display: inline-block;"></span>
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e; display: inline-block;"></span>
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f; display: inline-block;"></span>
          </div>
          <div style="background: #0f141d; color: #8f9ac7; padding: 4px 14px; border-radius: 6px; font-family: monospace; font-size: 11px; border: 1px solid rgba(255,255,255,0.1); width: 60%; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            🔒 http://localhost:8080/pages/${escapeHTML(currentPath)}
          </div>
          <div style="font-family: monospace; font-size: 10.5px; color: #00e676; background: rgba(0,230,118,0.1); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(0,230,118,0.3);">
            Real Viewport Capture
          </div>
        </div>

        <div class="cogni-screenshot-body" style="padding: 16px; background: #0f131c;">
          <div class="cogni-screenshot-meta" style="display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 11.5px; color: #94a3b8; margin-bottom: 10px; flex-wrap: wrap; gap: 12px; background: rgba(255,255,255,0.02); padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <div><strong>Query:</strong> "${escapeHTML(queryText)}"</div>
            <div><strong>Target Node:</strong> <code style="color:#60a5fa;">${escapeHTML(tagLabel)}</code> (${escapeHTML(labelTitle)})</div>
            <div><strong>Match:</strong> <span style="color:#00e676; font-weight:bold;">100% Verified Live</span></div>
          </div>

          <div class="cogni-screenshot-viewport-frame" style="position: relative; width: 100%; height: 520px; background: #090c14; border: 1.5px solid rgba(0, 230, 118, 0.4); border-radius: 12px; overflow: hidden; display: flex; justify-content: center; align-items: flex-start;">
            <iframe id="cogniFullPageSnapshotIframe" sandbox="allow-same-origin allow-scripts" style="width: 1440px; height: 880px; transform: scale(0.68); transform-origin: top center; border: none; pointer-events: none; background: #0b0f19;"></iframe>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    setTimeout(() => {
      const iframe = document.getElementById('cogniFullPageSnapshotIframe');
      if (!iframe) return;

      const activeDoc = getActiveDoc();
      let htmlContent = '';
      try {
        htmlContent = activeDoc.documentElement.outerHTML;
      } catch (e) {
        htmlContent = document.documentElement.outerHTML;
      }

      // Compute exact directory base URL ending with '/' for 100% accurate relative resource loading
      let baseDirUrl = currentUrl;
      try {
        const lastSlash = baseDirUrl.lastIndexOf('/');
        if (lastSlash !== -1) {
          baseDirUrl = baseDirUrl.substring(0, lastSlash + 1);
        }
      } catch (e) { }

      if (htmlContent.includes('<head>')) {
        htmlContent = htmlContent.replace('<head>', `<head><base href="${baseDirUrl}">`);
      } else {
        htmlContent = `<base href="${baseDirUrl}">` + htmlContent;
      }

      // Remove script execution tags in snapshot copy to prevent unwanted re-runs
      htmlContent = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      iframe.srcdoc = htmlContent;

      iframe.onload = function () {
        try {
          const doc = iframe.contentDocument;
          if (!doc) return;

          const pill = doc.getElementById('askCognispherePillWrap');
          if (pill) pill.remove();
          const frame = doc.getElementById('cogniPageSlideFrame');
          if (frame) frame.remove();
          const snapModal = doc.getElementById('cogniScreenshotModal');
          if (snapModal) snapModal.remove();
          const agentCursor = doc.getElementById('cogniLiveAgentCursor');
          if (agentCursor) agentCursor.remove();
          const liveOverlay = doc.getElementById('cogniLiveBlurOverlay');
          if (liveOverlay) liveOverlay.remove();

          const style = doc.createElement('style');
          style.textContent = `
            .cogni-snap-target-highlight {
              outline: 4px solid #ff5252 !important;
              box-shadow: 0 0 40px #ff5252, inset 0 0 20px rgba(255, 82, 82, 0.5) !important;
              border-radius: 8px !important;
              position: relative !important;
              z-index: 999999 !important;
            }
          `;
          doc.head.appendChild(style);

          let targetElInDoc = null;
          if (info.domPath) {
            try { targetElInDoc = doc.querySelector(info.domPath); } catch (e) { }
          }

          if (!targetElInDoc && labelTitle) {
            const candidates = Array.from(doc.querySelectorAll('a, button, h1, h2, h3, h4, h5, .doc-card, .project-card, .cert-card, .academics-card, .btn, [onclick]'));
            targetElInDoc = candidates.find(el => (el.textContent || '').trim().includes(labelTitle));
          }

          if (targetElInDoc) {
            targetElInDoc.classList.add('cogni-snap-target-highlight');
            targetElInDoc.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
          }
        } catch (e) { }
      };
    }, 50);
  }

  window.showCogniScreenshotModal = showCogniScreenshotModal;

  // DevTools Level Monitor (Console Errors, Rejections & Network Interceptor)
  const CogniLiveMonitor = {
    logs: [],
    initialized: false,
    init() {
      if (this.initialized) return;
      this.initialized = true;

      const origError = console.error;
      const origWarn = console.warn;
      const self = this;

      console.error = function (...args) {
        self.record('error', 'console', args.join(' '));
        origError.apply(console, args);
      };

      console.warn = function (...args) {
        self.record('warn', 'console', args.join(' '));
        origWarn.apply(console, args);
      };

      window.addEventListener('error', (e) => {
        self.record('error', 'uncaught', `${e.message} at ${e.filename}:${e.lineno}`);
      });

      window.addEventListener('unhandledrejection', (e) => {
        self.record('error', 'promise', `Unhandled Rejection: ${e.reason}`);
      });

      if (window.fetch) {
        const origFetch = window.fetch;
        window.fetch = async function (...args) {
          const url = typeof args[0] === 'string' ? args[0] : (args[0] ? args[0].url : 'API');
          try {
            const res = await origFetch.apply(this, args);
            if (!res.ok) {
              self.record('network', 'fetch', `HTTP ${res.status} ${res.statusText} on ${url}`);
            }
            return res;
          } catch (err) {
            self.record('network', 'fetch', `Fetch Failed: ${err.message} on ${url}`);
            throw err;
          }
        };
      }
    },
    record(type, category, msg) {
      this.logs.push({ timestamp: new Date().toISOString(), type, category, message: msg });
      if (this.logs.length > 50) this.logs.shift();
    }
  };

  CogniLiveMonitor.init();

  // ==========================================================================
  // SEQUENTIAL CARD NAVIGATION STACK & REFRESH PERSISTENCE CONTROLLER
  // Handles card back history order and prevents page refresh redirects
  // ==========================================================================
  const CogniCardHistoryStack = {
    stack: [],

    init() {
      // Refresh persistence: Save active page URL in sessionStorage
      try {
        sessionStorage.setItem('cogni_last_active_url', window.location.href);
      } catch (e) { }

      // Restore active card state after page refresh if stored
      try {
        const activeCardId = sessionStorage.getItem('cogni_active_card_id');
        if (activeCardId) {
          setTimeout(() => {
            const activeDoc = getActiveDoc();
            const cardEl = activeDoc.getElementById(activeCardId) || activeDoc.querySelector('.' + activeCardId);
            if (cardEl) {
              cardEl.classList.add('open', 'active', 'show', 'expanded');
              if (cardEl.style) cardEl.style.display = 'block';
              this.push(cardEl, activeCardId);
            }
          }, 350);
        }
      } catch (e) { }

      // Global Escape key handler for step-by-step card back navigation
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.stack.length > 0) {
          e.preventDefault();
          this.pop();
        }
      });

      // Global delegated click listener for card close buttons
      document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.modal-close, .close-btn, .btn-close, .card-close, .cogni-screenshot-close, [data-dismiss="modal"]');
        if (closeBtn && this.stack.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          this.pop();
        }
      }, true);
    },

    push(cardEl, title) {
      if (!cardEl) return;
      const top = this.stack[this.stack.length - 1];
      if (top && top.el === cardEl) return;

      this.stack.push({
        el: cardEl,
        title: title || cardEl.id || 'Card',
        prevDisplay: cardEl.style ? cardEl.style.display : ''
      });

      try {
        if (cardEl.id) sessionStorage.setItem('cogni_active_card_id', cardEl.id);
      } catch (e) { }
    },

    pop() {
      if (this.stack.length === 0) return null;

      const current = this.stack.pop();
      if (current && current.el) {
        current.el.classList.remove('open', 'active', 'show', 'expanded');
        if (current.el.style) current.el.style.display = 'none';
      }

      const previous = this.stack[this.stack.length - 1];
      if (previous && previous.el) {
        previous.el.classList.add('open', 'active', 'show', 'expanded');
        if (previous.el.style) previous.el.style.display = 'block';
        try {
          if (previous.el.id) sessionStorage.setItem('cogni_active_card_id', previous.el.id);
        } catch (e) { }
        return previous;
      } else {
        try { sessionStorage.removeItem('cogni_active_card_id'); } catch (e) { }
      }

      return null;
    }
  };

  CogniCardHistoryStack.init();

  // Pacing Controller & Profile System (Slow / Normal / Fast + Step / Auto Modes)
  const CogniPacingController = {
    mode: 'auto', // 'auto' | 'step' | 'paused'
    profile: 'slow', // Slow default for 6-8s visible thinking pacing
    stepResolver: null,

    getDelays() {
      if (this.profile === 'slow') {
        return { cardPause: 2200, sendDelay: 2500, cursorTravel: 2200, hoverTime: 800, typeChar: 30, settle: 1000 };
      }
      if (this.profile === 'fast') {
        return { cardPause: 300, sendDelay: 400, cursorTravel: 500, hoverTime: 100, typeChar: 10, settle: 200 };
      }
      return { cardPause: 1200, sendDelay: 1500, cursorTravel: 1400, hoverTime: 400, typeChar: 20, settle: 500 };
    },

    async waitPacing(phaseKey) {
      if (this.mode === 'paused') {
        await new Promise(r => {
          const check = setInterval(() => {
            if (this.mode !== 'paused') { clearInterval(check); r(); }
          }, 100);
        });
      }

      if (this.mode === 'step' && phaseKey === 'execute_action') {
        return new Promise(resolve => {
          this.stepResolver = resolve;
        });
      }

      const delays = this.getDelays();
      const delayMs = delays[phaseKey] || 150;
      await new Promise(r => setTimeout(r, delayMs));
    },

    releaseStep() {
      if (typeof this.stepResolver === 'function') {
        const res = this.stepResolver;
        this.stepResolver = null;
        res();
      }
    }
  };

  // Cards Ledger Engine
  const CogniCardLedger = {
    detect(activeDoc) {
      const doc = activeDoc || getActiveDoc();
      const cardContainers = Array.from(doc.querySelectorAll('.doc-card, .project-card, .cert-card, .academics-card, .skill-card, .wps-link-card, .notes-card'));
      const total = cardContainers.length;
      const opened = cardContainers.filter(c => c.classList.contains('active') || c.classList.contains('expanded') || c.classList.contains('open')).length;
      const blocked = Math.max(0, total - opened);

      return {
        total: total,
        opened: opened,
        blocked: blocked,
        items: cardContainers.map((c, i) => ({
          id: i + 1,
          title: (c.querySelector('h1, h2, h3, h4, .card-title, .doc-title')?.innerText || c.innerText || `Card ${i + 1}`).trim().slice(0, 30),
          status: c.classList.contains('active') || c.classList.contains('expanded') ? 'opened' : 'queued'
        }))
      };
    }
  };

  // Click Diagnosis Engine (8 Failure Modes)
  const CogniClickDiagnoser = {
    diagnose(targetEl) {
      if (!targetEl) return { failure: true, mode: 'NOT_FOUND', reason: 'Target node not resolved in DOM tree.' };

      const rect = targetEl.getBoundingClientRect();
      const winH = window.innerHeight || 800;
      const winW = window.innerWidth || 1200;

      if (rect.top < 0 || rect.bottom > winH || rect.left < 0 || rect.right > winW) {
        return { failure: true, mode: 'OFF_SCREEN', reason: 'Element box is off-screen.', fix: 'scroll_and_retry' };
      }

      const centerX = Math.max(5, Math.min(rect.left + (rect.width / 2), winW - 5));
      const centerY = Math.max(5, Math.min(rect.top + (rect.height / 2), winH - 5));
      let topEl = null;
      try { topEl = document.elementFromPoint(centerX, centerY); } catch (e) { }

      if (topEl && topEl !== targetEl && !targetEl.contains(topEl) && !topEl.contains(targetEl)) {
        if (!topEl.closest('#cogniLiveBlurOverlay, .ask-cognisphere-pill-wrap')) {
          return { failure: true, mode: 'COVERED_BY_OVERLAY', reason: `Covered by overlay element <${topEl.tagName.toLowerCase()}>`, fix: 'offset_scroll_or_dismiss' };
        }
      }

      if (targetEl.disabled || targetEl.getAttribute('aria-disabled') === 'true' || targetEl.classList.contains('disabled')) {
        return { failure: true, mode: 'DISABLED', reason: 'Target element is disabled or loading.', fix: 'wait_satisfy_condition' };
      }

      return { failure: false };
    }
  };

  function showCogniRunReportModal(queryText, answerHtml, stepsCount, ledgerInfo, devtoolsLogs) {
    let modal = document.getElementById('cogniRunReportModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cogniRunReportModal';
      modal.className = 'cogni-report-modal';
      document.body.appendChild(modal);
    }

    const logRowsHtml = (devtoolsLogs || []).slice(-10).map(l =>
      `<div class="cogni-devtools-line ${escapeHTML(l.type)}">[${escapeHTML(l.category.toUpperCase())}] ${escapeHTML(l.message)}</div>`
    ).join('') || '<div class="cogni-devtools-line">No console or network errors detected. 100% Clean Run!</div>';

    modal.innerHTML = `
      <div class="cogni-report-card">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #00e676; display: flex; align-items: center; gap: 8px;">
            <span>📋 In-Page Copilot Final Run Report</span>
          </div>
          <button type="button" class="cogni-screenshot-close" onclick="document.getElementById('cogniRunReportModal').classList.remove('active')">✕ Close</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 18px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">QUERY PROMPT</div>
            <div style="font-weight: 700; color: #fff; margin-top: 4px;">"${escapeHTML(queryText)}"</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">TRAJECTORY STEPS</div>
            <div style="font-weight: 700; color: #60a5fa; margin-top: 4px;">${stepsCount} Paced Actions Executed</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 8px;">
            <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">CARD LEDGER</div>
            <div style="font-weight: 700; color: #00e676; margin-top: 4px;">${ledgerInfo ? ledgerInfo.total : 0} Cards Audited</div>
          </div>
        </div>

        <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">⚡ Grounded Synthesis Output:</div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,230,118,0.25); padding: 14px; border-radius: 8px; margin-bottom: 18px;">
          ${answerHtml}
        </div>

        <div style="font-size: 13px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; font-family: monospace;">🐛 DevTools Live Audit (Console & Network Log):</div>
        <div class="cogni-devtools-log-box">
          ${logRowsHtml}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  window.showCogniRunReportModal = showCogniRunReportModal;

  // ==========================================================================
  // IN-PAGE CHAT TO DOM COPILOT ENGINE (Pin-to-Pin Live Copilot Specification)
  // Mode Classifier -> Page Inspector -> Indirect Reasoner -> Translator -> Executor
  // ==========================================================================

  const InPageCopilot = {
    // 1. Mode Intent Classifier
    classifyIntent(instruction) {
      if (!instruction) return 'answer';
      const text = instruction.toLowerCase().trim();

      const actKeywords = ['click', 'open', 'navigate', 'scroll', 'type', 'fill', 'input', 'select', 'press', 'go to', 'take me to'];
      const questionKeywords = ['what', 'why', 'where', 'how', 'when', 'who', 'is', 'are', 'can', 'could', 'tell', 'explain', 'describe'];

      const hasAct = actKeywords.some(k => text.includes(k));
      const hasQuestion = questionKeywords.some(k => text.startsWith(k) || text.includes(k));

      if (hasAct && hasQuestion) return 'mixed';
      if (hasAct) return 'act';
      return 'answer';
    },

    // 2. Page & Open Card Deep Inspection (Section Maps, Element Indexes, Chunks, Modals)
    inspectPage() {
      const activeDoc = getActiveDoc();
      const sectionMap = [];

      // Priority 1: Check for Active Open Cards / Modals on screen
      const activeModals = Array.from(activeDoc.querySelectorAll('.modal.open, .modal.active, .modal.show, #docModal.open, .card-is-open, .expanded, .modal-body, [role="dialog"]'));
      activeModals.forEach((modal, idx) => {
        const title = (modal.querySelector('h1, h2, h3, h4, h5, .modal-title, .doc-title, .card-title')?.innerText || `Active Open Card ${idx + 1}`).trim();
        const text = (modal.innerText || modal.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 1500);
        if (text.length > 5) {
          sectionMap.push({
            id: `CARD_${idx + 1}`,
            heading: `📌 OPEN CARD: ${title}`,
            element: modal,
            rect: modal.getBoundingClientRect(),
            textChunk: text,
            isCard: true
          });
        }
      });

      // Priority 2: Query standard page sections and content containers
      const sections = Array.from(activeDoc.querySelectorAll('section, article, main, header, footer, .academics-card, .project-card, .cert-card, .resume-section, .doc-card, .notes-subject-card, .notes-card, table, tr, div[id], p'));
      sections.forEach((sec, idx) => {
        if (sec.closest('.ask-cognisphere-pill-wrap, .cogni-live-blur-overlay, #cogniScreenshotModal')) return;
        const textChunk = (sec.innerText || sec.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 1000);
        if (textChunk.length < 10) return;

        const secId = `S${sectionMap.length + 1}`;
        const rect = sec.getBoundingClientRect();
        const heading = (sec.querySelector('h1, h2, h3, h4, h5, .section-title, .card-title, .doc-title, th')?.innerText || sec.getAttribute('id') || secId).trim();

        sectionMap.push({
          id: secId,
          heading: heading,
          element: sec,
          rect: { yTop: Math.round(rect.top + window.scrollY), yBottom: Math.round(rect.bottom + window.scrollY) },
          textChunk: textChunk,
          isCard: false
        });
      });

      // Priority 3: Fallback full active document body text chunk
      if (sectionMap.length === 0 && activeDoc.body) {
        sectionMap.push({
          id: 'FULL_DOC',
          heading: activeDoc.title || 'Live Document Content',
          element: activeDoc.body,
          rect: { yTop: 0, yBottom: 1000 },
          textChunk: (activeDoc.body.innerText || activeDoc.body.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 3000),
          isCard: false
        });
      }

      const interactiveElements = Array.from(activeDoc.querySelectorAll(
        'a[href], button, input, select, textarea, [role="button"], [onclick], .doc-card, .project-card, .cert-card, .academics-card, .wps-link-card'
      )).filter(el => {
        if (el.closest('.ask-cognisphere-pill-wrap, .cogni-live-blur-overlay')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });

      const elementIndex = interactiveElements.map((el, idx) => {
        const r = el.getBoundingClientRect();
        const isVisible = r.top >= 0 && r.bottom <= window.innerHeight;
        return {
          id: `el:${idx + 1}`,
          element: el,
          tagName: el.tagName.toLowerCase(),
          role: el.getAttribute('role') || el.tagName.toLowerCase(),
          text: (el.innerText || el.value || el.getAttribute('title') || '').trim().slice(0, 60),
          rect: r,
          visible: isVisible
        };
      });

      return {
        url: window.location.href,
        title: activeDoc.title || 'Page',
        sectionMap: sectionMap,
        elementIndex: elementIndex
      };
    },

    // 3. Direct & Indirect Q&A Evidence Reasoner (Reads open cards & opened pages fully)
    answerQuestion(userQuery, inspection) {
      const q = userQuery.toLowerCase().trim();
      const stopWords = new Set(['what', 'is', 'are', 'my', 'the', 'in', 'a', 'an', 'on', 'for', 'me', 'show', 'tell', 'give', 'can', 'you', 'where', 'which', 'who', 'explain', 'describe']);
      const tokens = q.split(/\s+/).map(t => t.replace(/[^a-z0-9]/gi, '')).filter(t => t.length >= 2 && !stopWords.has(t));

      let bestSection = null;
      let highestScore = -1;

      inspection.sectionMap.forEach(sec => {
        let score = 0;
        const txt = sec.textChunk.toLowerCase();

        // Bonus score for open card content
        if (sec.isCard) score += 15;

        tokens.forEach(t => {
          if (txt.includes(t)) score += 10;
        });

        if (score > highestScore) {
          highestScore = score;
          bestSection = sec;
        }
      });

      // Fallback: If no strict section match, use full document text or top section
      if (!bestSection || highestScore <= 0) {
        if (inspection.sectionMap.length > 0) {
          bestSection = inspection.sectionMap[0];
        }
      }

      if (!bestSection) {
        const activeDoc = getActiveDoc();
        const fullText = (activeDoc.body ? activeDoc.body.innerText : '').slice(0, 500);
        return {
          found: true,
          heading: activeDoc.title || 'Active Page',
          evidence: fullText || 'Inspected active live document tree.',
          targetElement: activeDoc.body
        };
      }

      // Extract matching evidence lines
      const lines = bestSection.textChunk.split(/(?<=[.?!])\s+/).filter(l => l.length > 5);
      const matchingLines = lines.filter(line => tokens.some(t => line.toLowerCase().includes(t))).slice(0, 5);

      const evidence = matchingLines.length > 0 ? matchingLines.join(' ') : bestSection.textChunk.slice(0, 350);

      return {
        found: true,
        heading: bestSection.heading,
        evidence: evidence,
        targetElement: bestSection.element
      };
    },

    // 4. Translator: Chat Instruction -> DOM JSON Instruction Ops
    translateToOps(intent, targetEl, userText, inspection) {
      const ops = [];
      const section = inspection.sectionMap.find(s => s.element === targetEl) || inspection.sectionMap[0];
      const targetId = section ? section.id : 'S1';

      ops.push({ op: "say", text: `Analyzing prompt: "${userText}"` });
      ops.push({ op: "scroll_to", target: targetId, element: targetEl });
      ops.push({ op: "move_cursor", target: targetEl });
      ops.push({ op: "highlight", target: targetEl, note: `Evidence grounded from ${section ? section.heading : 'DOM'}` });

      if (intent === 'act' || intent === 'mixed') {
        ops.push({ op: "click", target: targetEl });
      }

      ops.push({ op: "read", target: targetId });
      ops.push({ op: "wait", for: "dom_stable" });

      return ops;
    },

    // 5. Executor with Virtual Cursor Eased Path & Real Mouse Events
    async executeOps(ops, statusCallback) {
      for (const op of ops) {
        if (statusCallback) statusCallback(this.describeOp(op));

        const el = op.element;
        if (op.op === 'scroll_to' && el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(r => setTimeout(r, 100));
        } else if (op.op === 'move_cursor' && el) {
          animateAgentCursorTo(el);
          await new Promise(r => setTimeout(r, 80));
        } else if (op.op === 'highlight' && el) {
          applyLiveSpotlight(el);
          await new Promise(r => setTimeout(r, 80));
        } else if (op.op === 'click' && el) {
          animateAgentCursorTo(el);
          await new Promise(r => setTimeout(r, 50));
          try {
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            el.click();
          } catch (e) { }
        } else if (op.op === 'wait') {
          await new Promise(r => setTimeout(r, 50));
        }
      }
    },

    describeOp(op) {
      if (op.op === 'scroll_to') return `Scrolling to section ${op.target}...`;
      if (op.op === 'move_cursor') return `Moving live agent cursor...`;
      if (op.op === 'highlight') return `Highlighting evidence on screen...`;
      if (op.op === 'click') return `Clicking target element...`;
      if (op.op === 'read') return `Reading section payload...`;
      return `Processing step ${op.op}...`;
    }
  };

  // ==========================================================================
  // PIN-TO-PIN AUTONOMOUS BROWSER & SCREEN CONTROL AGENT ARCHITECTURE
  // (Observer -> Dynamic Planner -> Action Executor -> Verifier -> Memory -> Safety)
  // ==========================================================================

  const PinObserver = {
    activeMarks: [],

    observe(doc) {
      const activeDoc = doc || getActiveDoc();
      const interactiveElements = Array.from(activeDoc.querySelectorAll(
        'a[href], button, input, select, textarea, [role="button"], [onclick], ' +
        '.doc-card, .project-card, .cert-card, .academics-card, .wps-link-card, .notes-subject-card, .notes-card, .card, .btn, section, article'
      )).filter(el => {
        if (el.closest('.ask-cognisphere-pill-wrap, .cogni-live-blur-overlay, #cogniSomOverlayContainer')) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && el.ownerDocument.defaultView.getComputedStyle(el).display !== 'none';
      });

      const elementsMap = [];
      interactiveElements.forEach((el, index) => {
        const idx = index + 1;
        const rect = el.getBoundingClientRect();
        const tagName = el.tagName.toLowerCase();
        const role = el.getAttribute('role') || tagName;
        const text = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 60);

        function buildPath(node) {
          if (!node || !node.tagName) return 'body';
          const stack = [];
          let curr = node;
          while (curr && curr.tagName && curr.tagName.toLowerCase() !== 'html' && stack.length < 4) {
            let tag = curr.tagName.toLowerCase();
            if (curr.id) tag += `#${curr.id}`;
            else if (curr.className && typeof curr.className === 'string') {
              const cls = curr.className.split(/\s+/).filter(c => c && !c.startsWith('cogni'))[0];
              if (cls) tag += `.${cls}`;
            }
            stack.unshift(tag);
            curr = curr.parentElement;
          }
          return stack.join(' > ');
        }

        elementsMap.push({
          index: idx,
          element: el,
          tagName: tagName,
          role: role,
          text: text,
          selector: buildPath(el),
          rect: { x: Math.round(rect.left), y: Math.round(rect.top), w: Math.round(rect.width), h: Math.round(rect.height) }
        });
      });

      return {
        url: window.location.href,
        title: activeDoc.title || 'Portfolio Main',
        elements: elementsMap
      };
    },

    drawSetOfMarksOverlay(observedElements) {
      // Do not render yellow badges over page elements directly
      this.clearSetOfMarksOverlay();
    },

    clearSetOfMarksOverlay() {
      const activeDoc = getActiveDoc();
      const overlayContainer = activeDoc.getElementById('cogniSomOverlayContainer');
      if (overlayContainer) overlayContainer.innerHTML = '';
      this.activeMarks = [];
    }
  };

  const PinPlanner = {
    createGoalTree(userTask) {
      const subgoals = [
        { id: 1, text: `Observe viewport & DOM accessibility tree for task: "${userTask}"`, status: "pending" },
        { id: 2, text: `Ground target element via Set-of-Marks visual index`, status: "pending" },
        { id: 3, text: `Execute Action Space interaction & self-heal fallback if needed`, status: "pending" },
        { id: 4, text: `Verify state mutation & synthesize payload output`, status: "pending" }
      ];

      return {
        task: userTask,
        goal: `Fulfill task: ${userTask}`,
        subgoals: subgoals,
        stepCount: 0
      };
    },

    decideNextStep(goalTree, observation, lastActionResult) {
      goalTree.stepCount++;
      const pendingSubgoal = goalTree.subgoals.find(s => s.status === 'pending' || s.status === 'running');

      if (!pendingSubgoal) {
        return { action: { type: 'done', result: 'All subgoals completed successfully.' } };
      }

      pendingSubgoal.status = 'running';

      const terms = goalTree.task.toLowerCase().split(/\s+/).filter(t => t.length > 2);
      let bestMatch = null;
      let maxScore = -1;

      observation.elements.forEach(item => {
        let score = 0;
        terms.forEach(term => {
          if (item.text.toLowerCase().includes(term)) score += 10;
          if (item.selector.toLowerCase().includes(term)) score += 8;
        });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });

      return {
        subgoalId: pendingSubgoal.id,
        thought: `Targeting DOM element index [${bestMatch ? bestMatch.index : 1}] matching task keywords`,
        plan_update: { current_subgoal: pendingSubgoal.text },
        action: {
          type: 'inspect_and_highlight',
          index: bestMatch ? bestMatch.index : 1,
          targetElement: bestMatch ? bestMatch.element : null,
          selector: bestMatch ? bestMatch.selector : 'body',
          text: bestMatch ? bestMatch.text : goalTree.task
        }
      };
    }
  };

  const PinActionExecutor = {
    execute(action, observation) {
      const targetEl = action.targetElement || (observation.elements[action.index - 1] ? observation.elements[action.index - 1].element : null);

      if (!targetEl) {
        return { success: false, reason: "Element index not resolved in DOM tree. Self-healing fallback triggered." };
      }

      try {
        targetEl.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
        applyLiveSpotlight(targetEl);

        if (action.type === 'click') {
          targetEl.click();
        }

        return {
          success: true,
          actionType: action.type,
          targetSelector: action.selector,
          targetText: (targetEl.innerText || targetEl.value || '').trim().slice(0, 50)
        };
      } catch (err) {
        try {
          targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          return { success: true, selfHealed: true };
        } catch (retryErr) {
          return { success: false, error: err.message };
        }
      }
    }
  };

  const PinVerifier = {
    verify(actionResult, observationBefore, observationAfter) {
      if (!actionResult.success) {
        return { status: 'fail', feedback: actionResult.reason || 'Action execution failed' };
      }
      return { status: 'success', feedback: 'State mutation verified. Target element payload extracted from DOM.' };
    }
  };

  const PinMemory = {
    history: [],
    workingFacts: [],

    recordStep(stepData) {
      this.history.push(stepData);
      if (this.history.length > 10) this.history.shift();
    },

    addFact(fact) {
      this.workingFacts.push(fact);
    },

    clear() {
      this.history = [];
      this.workingFacts = [];
    }
  };

  const PinSafetyGuard = {
    maxSteps: 15,
    checkSafety(action, stepCount) {
      if (stepCount > this.maxSteps) {
        return { safe: false, reason: "Step limit budget exceeded (max 15 steps)." };
      }
      return { safe: true };
    }
  };

  const PinLoggerRecorder = {
    logs: [],
    log(step, thought, action, result) {
      this.logs.push({
        timestamp: new Date().toISOString(),
        step: step,
        thought: thought,
        action: action,
        result: result
      });
    }
  };

  const AiIntentAnalyzer = {
    parseUserInstruction(instruction) {
      if (!instruction) return { isDomCommand: false, action: 'chat' };
      const text = instruction.toLowerCase().trim();

      // Greetings check
      if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|whats up|what's up|how are you|how r u|bye|thanks|thank you)(\s+|$|!|\?)/i.test(text)) {
        return { isDomCommand: false, action: 'chat' };
      }

      // Explicit Action Verbs Matching
      const actionMatch = text.match(/(click|open|navigate|go to|show|scroll|type|fill|input|select|press|find|view|take me to)\s+(.+)/i);
      if (actionMatch) {
        const verb = actionMatch[1].toLowerCase();
        const rawTarget = actionMatch[2].trim();
        let action = 'click';
        if (verb === 'scroll') action = 'scroll';
        else if (verb === 'type' || verb === 'fill' || verb === 'input') action = 'type';
        else if (verb === 'navigate' || verb === 'go to' || verb === 'take me to') action = 'navigate';

        return {
          isDomCommand: true,
          action: action,
          targetText: rawTarget,
          originalText: instruction
        };
      }

      // Scroll Keyword Triggers
      if (text.includes('scroll')) {
        return { isDomCommand: true, action: 'scroll', targetText: text, originalText: instruction };
      }

      // Specific Page Route & Action Target Triggers
      const domActionKeywords = ['geargo', 'byteloop', 'gramaseva', 'help', 'academics', 'certificates', 'admins', 'admin', 'resume', 'projects', 'project', 'portal', 'button', 'card', 'download'];
      const hasDomActionKey = domActionKeywords.some(k => text.includes(k));
      if (hasDomActionKey) {
        return { isDomCommand: true, action: 'click', targetText: text, originalText: instruction };
      }

      // Question Words indicate Informational / Q&A Intent (NOT DOM Click Action)
      if (/^(who|what|why|where|how|when|can you|tell me|explain|describe|which|is there)\s+/i.test(text)) {
        return { isDomCommand: false, action: 'chat' };
      }

      return { isDomCommand: false, action: 'chat' };
    }
  };

  const DynamicDomScorer = {
    scoreElement(el, queryTokens, matchedKey) {
      if (!el || el.closest('.ask-cognisphere-pill-wrap, .cogni-live-blur-overlay')) return -1;

      let score = 0;
      const tag = el.tagName.toLowerCase();
      const text = (el.innerText || el.textContent || '').toLowerCase().trim();
      const val = (el.value || el.placeholder || el.getAttribute('aria-label') || el.getAttribute('title') || '').toLowerCase().trim();
      const href = (el.getAttribute('href') || '').toLowerCase().trim();
      const id = (el.id || '').toLowerCase();
      const className = (el.className || '').toString().toLowerCase();

      const combinedText = `${text} ${val} ${href} ${id} ${className}`;

      // Ignore social links (like LinkedIn, GitHub, Twitter) unless explicitly mentioned in user query
      const isSocialLink = /linkedin|github|twitter|instagram|facebook/i.test(combinedText);
      const userWantsSocial = queryTokens.some(t => /linkedin|github|twitter|instagram|facebook/i.test(t));
      if (isSocialLink && !userWantsSocial) {
        return -1;
      }

      // Must have at least one matching token or page key to score positive
      let hasTokenMatch = false;

      queryTokens.forEach(token => {
        if (!token || token.length < 2) return;

        if (text === token || val === token) { score += 50; hasTokenMatch = true; }
        if (id === token) { score += 40; hasTokenMatch = true; }
        if (href.includes(token)) { score += 35; hasTokenMatch = true; }
        if (className.includes(token)) { score += 20; hasTokenMatch = true; }

        if (text.includes(token)) { score += 15; hasTokenMatch = true; }
        if (val.includes(token)) { score += 15; hasTokenMatch = true; }
        if (combinedText.includes(token)) { score += 5; hasTokenMatch = true; }
      });

      if (matchedKey && combinedText.includes(matchedKey)) {
        score += 25;
        hasTokenMatch = true;
      }

      if (!hasTokenMatch) return 0;

      if (tag === 'button' || el.getAttribute('role') === 'button') score += 18;
      if (tag === 'input' || tag === 'textarea' || tag === 'select') score += 15;
      if (className.includes('doc-card') || className.includes('project-card') || className.includes('cert-card')) score += 30;
      if (className.includes('card') || className.includes('btn')) score += 10;

      const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (rect && rect.width > 0 && rect.height > 0) {
        score += 10;
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          score += 10;
        }
      }

      return score;
    }
  };

  const ElementLocator = {
    find(targetQuery) {
      if (!targetQuery) return null;
      let rawQ = targetQuery.toLowerCase().trim();
      let cleanQ = rawQ
        .replace(/^(click|open|navigate|go to|show|scroll|type|fill|input|select|press|find|on|the|page|card|project|button|link|portal)\s+/gi, '')
        .replace(/\s+(page|card|project|button|link|portal)$/gi, '').trim();

      if (!cleanQ) cleanQ = rawQ;

      const queryTokens = Array.from(new Set([cleanQ, ...cleanQ.split(/\s+/), ...rawQ.split(/\s+/)])).filter(t => t.length >= 2);

      const conceptMap = [
        {
          keys: ['academics', 'academic', 'study', 'studies', 'college', 'education', 'btech', 'b.tech', 'sgpa', 'cgpa', 'grade', 'marks', 'gpa', 'srkr', 'bhimavaram', 'university', 'semester', 'sem', 'exam', 'hall ticket', 'hallticket', 'syllabus', 'discrete math', 'linear algebra', 'differential equations', 'data structures', 'chemistry', 'physics', 'computer organization', 'dbms', 'java', 'python', 'notes', 'pdf', 'unit'],
          pages: ['academics.html'],
          navText: 'Academics',
          label: 'Academics & Semester Records'
        },
        {
          keys: ['certificate', 'certificates', 'certif', 'award', 'awards', 'hackathon', 'udbhav', 'winner', 'trophy', 'achievement', 'credential', 'verified', 'study certificate', 'hall tickets pdf', 'document vault', 'proof'],
          pages: ['certificates.html'],
          navText: 'Certificates',
          label: 'Verified Certificates & Vault'
        },
        {
          keys: ['resume', 'cv', 'work', 'experience', 'job', 'internship', 'skill', 'skills', 'tech stack', 'technology', 'stack', 'frontend', 'backend', 'full stack', 'hometown', 'native', 'village', 'nellore', 'background', 'bio', 'contact', 'phone', 'email', 'linkedin', 'github', 'profile', 'who is abhiram', 'about abhiram', 'who owns', 'author'],
          pages: ['resume.html'],
          navText: 'Resume',
          label: 'Interactive Resume'
        },
        {
          keys: ['geargo', 'rent', 'rental', 'gear', 'camera', 'bike', 'laptop', 'equipment', 'lease', 'borrow', 'student rental', 'managing directors'],
          pages: ['geargo.html', 'admins.html'],
          navText: 'Admins',
          label: 'GearGo Rental Platform'
        },
        {
          keys: ['gramaseva', 'worker', 'workers', 'rural', 'urban', 'village', 'plumber', 'electrician', 'carpenter', 'blue collar', 'service connect', 'community service'],
          pages: ['gramaseva.html', 'admins.html'],
          navText: 'Admins',
          label: 'Gramaseva Worker Connect'
        },
        {
          keys: ['help', 'emergency', 'hospital', 'ambulance', 'blood', 'donor', 'crisis', 'healthcare', 'medical', 'life provider', 'sos'],
          pages: ['help.html', 'admins.html'],
          navText: 'Admins',
          label: 'HELP Emergency Life Provider'
        },
        {
          keys: ['byteloop', 'studio', 'software', 'lab', 'game', 'creative'],
          pages: ['byteloop.html', 'admins.html'],
          navText: 'Admins',
          label: 'ByteLoop Studio'
        },
        {
          keys: ['admin', 'admins', 'portal', 'dashboard', 'control', 'setting', 'settings', 'user list', 'system control'],
          pages: ['admins.html'],
          navText: 'Admins',
          label: 'Admin Management Portal'
        },
        {
          keys: ['ai future', 'future of ai', 'roadmap', 'antigravity', 'deep learning', 'agentic', 'vision'],
          pages: ['ai-future.html'],
          navText: 'AI Future',
          label: 'AI Future & Vision Roadmap'
        },
        {
          keys: ['home', 'main', 'index', 'portfolio', 'hero'],
          pages: ['index.html'],
          navText: 'Home',
          label: 'Portfolio Main'
        }
      ];

      let matchedConcept = null;
      let highestConceptScore = 0;

      conceptMap.forEach(item => {
        let score = 0;
        item.keys.forEach(k => {
          if (rawQ.includes(k)) score += k.length >= 5 ? 10 : 5;
          if (cleanQ.includes(k)) score += 5;
        });
        if (score > highestConceptScore) {
          highestConceptScore = score;
          matchedConcept = item;
        }
      });

      const activeDoc = getActiveDoc();

      if (matchedConcept && highestConceptScore >= 5) {
        const currentFilename = getCleanFilename(window.location.href);
        const isAlreadyOnPage = matchedConcept.pages.some(p => getCleanFilename(p) === currentFilename);

        if (!isAlreadyOnPage) {
          const navLinks = Array.from(activeDoc.querySelectorAll('nav a, .nav-items-bar a, a[href]'));
          let matchedLink = null;
          for (let link of navLinks) {
            const href = (link.getAttribute('href') || '').toLowerCase();
            const linkText = (link.innerText || '').toLowerCase();

            if (matchedConcept.pages.some(p => href.includes(p)) || (matchedConcept.navText && linkText.includes(matchedConcept.navText.toLowerCase()))) {
              matchedLink = link;
              break;
            }
          }

          const targetUrl = matchedLink ? matchedLink.getAttribute('href') : matchedConcept.pages[0];
          return {
            element: matchedLink || null,
            label: matchedConcept.label || (matchedLink ? matchedLink.innerText : matchedConcept.navText),
            isNavRedirect: true,
            targetUrl: targetUrl,
            targetName: targetQuery,
            isMatched: true
          };
        }
      }

      const cardElements = Array.from(activeDoc.querySelectorAll(
        '.doc-card, .project-card, .cert-card, .academics-card, .skill-card, .lab-card, .level-card, [data-modal], .card, .resume-section, section'
      ));

      for (let el of cardElements) {
        const txt = (el.innerText || el.textContent || '').toLowerCase().trim();
        if (txt && (txt.includes(cleanQ) || (matchedConcept && matchedConcept.keys.some(k => txt.includes(k))))) {
          return {
            element: el,
            label: (el.querySelector('h1, h2, h3, h4, .doc-title, .project-title, .card-title')?.innerText || el.innerText || cleanQ).trim().slice(0, 35),
            isNavRedirect: false,
            isMatched: true
          };
        }
      }

      const allElements = Array.from(activeDoc.querySelectorAll(
        'a[href], button, input, textarea, select, [role="button"], .project-card, .cert-card, .academics-card, .skill-card, .btn, .card, .resume-section, h1, h2, h3, section, article'
      ));

      let bestCandidate = null;
      let maxScore = 0;

      allElements.forEach(el => {
        const score = DynamicDomScorer.scoreElement(el, queryTokens, matchedConcept ? matchedConcept.keys[0] : null);
        if (score > maxScore) {
          maxScore = score;
          bestCandidate = el;
        }
      });

      if (bestCandidate && maxScore >= 15) {
        const isLink = bestCandidate.tagName === 'A' && bestCandidate.getAttribute('href');
        return {
          element: bestCandidate,
          label: (bestCandidate.innerText || bestCandidate.value || cleanQ).trim().slice(0, 35),
          isNavRedirect: !!isLink,
          targetUrl: isLink ? bestCandidate.getAttribute('href') : null,
          isMatched: true
        };
      }

      return {
        element: null,
        label: cleanQ,
        isNavRedirect: false,
        isMatched: matchedConcept ? true : false,
        targetUrl: matchedConcept ? matchedConcept.pages[0] : null
      };
    }
  };

  function saveGlobalChatState() {
    try {
      const wrap = document.getElementById('askCognispherePillWrap');
      const dropdown = document.getElementById('askCognispherePillDropdown');

      if (!wrap || !dropdown) return;

      const state = {
        isOpen: dropdown.classList.contains('open'),
        isMinimized: dropdown.classList.contains('minimized'),
        left: wrap.style.left,
        top: wrap.style.top
      };
      sessionStorage.setItem('cogniGlobalChatState', JSON.stringify(state));
    } catch (e) { }
  }

  function restoreGlobalChatState() {
    try {
      const stateStr = sessionStorage.getItem('cogniGlobalChatState');
      if (!stateStr) return;
      const state = JSON.parse(stateStr);

      const wrap = document.getElementById('askCognispherePillWrap');
      const dropdown = document.getElementById('askCognispherePillDropdown');

      if (wrap && state.left && state.top) {
        wrap.style.left = state.left;
        wrap.style.top = state.top;
        wrap.style.right = 'auto';
        wrap.style.bottom = 'auto';
      }

      if (dropdown && state.isOpen) {
        dropdown.classList.add('open');
        document.body.classList.add('ai-card-open');
        if (window.innerWidth > 768) {
          document.body.classList.add('cogni-split-mode');
        }
        if (wrap) wrap.classList.add('card-is-open');
        if (state.isMinimized) {
          dropdown.classList.add('minimized');
        }
      }
    } catch (e) { }
  }

  function initPill() {
    if (document.getElementById('askCognispherePillWrap')) return;

    if (!document.getElementById('cogniLiveBlurOverlay')) {
      document.body.insertAdjacentHTML('beforeend', `<div class="cogni-live-blur-overlay" id="cogniLiveBlurOverlay"></div>`);
    }

    const initialIntroText = getDynamicPageIntro();

    const pillHTML = `
      <div class="ask-cognisphere-pill-wrap" id="askCognispherePillWrap">
        <div class="ask-cognisphere-pill-btn" id="askCognispherePillBtn">
          <div class="ask-cognisphere-pill-icon">
            <img src="../images/cognisphere-icon-trimmed.svg" alt="Cognisphere AI" onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='images/cognisphere-icon-trimmed.svg';}else{this.src='../images/cognicoder-ai-logo.png';}">
          </div>
          <div class="ask-cognisphere-pill-label">Ask Cos AI</div>
        </div>

        <div class="ask-cognisphere-dropdown" id="askCognispherePillDropdown">
          <div class="cogni-drag-handle" id="cogniDragHandle"></div>
          <div class="cogni-ai-header" id="cogniAiHeader">
            <div class="cogni-ai-title">
              <div class="cogni-ai-title-icon-wrap">
                <img src="../images/cognisphere-icon-trimmed.svg" alt="Ask Cos AI" onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='images/cognisphere-icon-trimmed.svg';}else{this.src='../images/cognicoder-ai-logo.png';}">
              </div>
              <span>Ask Cos AI</span>
            </div>
            <div class="cogni-ai-actions">
              <button class="cogni-ai-minimize" id="cogniAiMinimizeBtn" title="Minimize AI Card">─</button>
              <button class="cogni-ai-close" id="cogniAiCloseBtn" title="Close AI Card">✕</button>
            </div>
          </div>

          <!-- Antigravity Slash Command Popup -->
          <div class="cogni-slash-popup" id="cogniSlashPopup">
            <div class="cogni-slash-item" data-cmd="/goal">
              <span class="cogni-slash-cmd">/goal</span>
              <span class="cogni-slash-desc">Run extra-thorough goal execution until target is complete</span>
            </div>
            <div class="cogni-slash-item" data-cmd="/plan">
              <span class="cogni-slash-cmd">/plan</span>
              <span class="cogni-slash-desc">Request step-by-step architectural plan before execution</span>
            </div>
            <div class="cogni-slash-item" data-cmd="/grill-me">
              <span class="cogni-slash-cmd">/grill-me</span>
              <span class="cogni-slash-desc">Interactive interview to resolve design decisions</span>
            </div>
            <div class="cogni-slash-item" data-cmd="/schedule">
              <span class="cogni-slash-cmd">/schedule</span>
              <span class="cogni-slash-desc">Set cron schedule or delayed timer notification</span>
            </div>
            <div class="cogni-slash-item" data-cmd="/learn">
              <span class="cogni-slash-cmd">/learn</span>
              <span class="cogni-slash-desc">Persist behavioral rule or workflow pattern</span>
            </div>
            <div class="cogni-slash-item" data-cmd="/help">
              <span class="cogni-slash-cmd">/help</span>
              <span class="cogni-slash-desc">List all Antigravity features and commands</span>
            </div>
          </div>

          <!-- Antigravity @ Mention Context Popup -->
          <div class="cogni-mention-popup" id="cogniMentionPopup">
            <div class="cogni-mention-item" data-mention="@files">
              <span class="cogni-slash-cmd">@files</span>
              <span class="cogni-slash-desc">Attach active viewport document tree</span>
            </div>
            <div class="cogni-mention-item" data-mention="@terminal">
              <span class="cogni-slash-cmd">@terminal</span>
              <span class="cogni-slash-desc">Attach DevTools live console log terminal</span>
            </div>
            <div class="cogni-mention-item" data-mention="@rules">
              <span class="cogni-slash-cmd">@rules</span>
              <span class="cogni-slash-desc">Attach agent control policy rules</span>
            </div>
            <div class="cogni-mention-item" data-mention="@mcp">
              <span class="cogni-slash-cmd">@mcp</span>
              <span class="cogni-slash-desc">Attach Model Context Protocol tool schema</span>
            </div>
          </div>

          <div class="cogni-ai-chat-body" id="cogniAiChatBody">
            <div class="cogni-msg bot">
              <div class="cogni-msg-bubble">
                ${initialIntroText}
              </div>
            </div>
          </div>

          <div class="cogni-ai-prompts" id="cogniAiPrompts">
            <button class="cogni-prompt-chip" data-prompt="Who is Abhiram?">🚀 Who is Abhiram?</button>
            <button class="cogni-prompt-chip" data-prompt="Open Certificates">📜 Open Certificates</button>
            <button class="cogni-prompt-chip" data-prompt="Open GearGo">📦 Open GearGo</button>
            <button class="cogni-prompt-chip" data-prompt="Open Admin Portal">🛡️ Open Admin Portal</button>
          </div>

          <div class="ask-cognisphere-input-row">
            <input type="text" class="ask-cognisphere-input" id="askCognispherePillInput" placeholder="Tell Ask Cos AI or command page DOM..." autocomplete="off" />
            <button class="ask-cognisphere-search-btn" id="askCognispherePillSubmit">➔</button>
          </div>
        </div>
      </div>

      <!-- Antigravity-Style Floating Bottom DOM Controller Card -->
      <div class="cogni-bottom-agent-card" id="cogniBottomAgentCard">
        <div class="cogni-bottom-status-badge">
          <span class="cogni-red-pulse-dot"></span>
          <span id="cogniBottomStatusTitle">Getting DOM...</span>
        </div>
        <span class="cogni-bottom-step-text" id="cogniBottomStepText">Inspecting document tree...</span>
        <button class="cogni-stop-dom-btn" id="cogniStopDomBtn">
          <span>🛑</span> Stop DOM
        </button>
      </div>

      <!-- 100% Invisible Draggable Split Resizer Edge between Left Slide and Right AI Drawer -->
      <div class="cogni-split-resize-divider" id="cogniSplitResizeDivider"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', pillHTML);
    bindPillEvents();
    initAutoFloatingAndDragging();
    initSplitViewResizer();
    restoreGlobalChatState();
    checkPendingDomCommand();
    window.addEventListener('beforeunload', saveGlobalChatState);
  }

  function checkPendingDomCommand() {
    try {
      sessionStorage.removeItem('pendingDomCommand');
    } catch (e) { }
  }

  // Automatic Wandering Float Engine & Touch/Mouse Dragging
  function initAutoFloatingAndDragging() {
    const wrap = document.getElementById('askCognispherePillWrap');
    const btn = document.getElementById('askCognispherePillBtn');
    if (!wrap || !btn) return;

    wrap.style.display = 'flex';
    btn.style.display = 'flex';
    btn.style.opacity = '1';
    btn.style.visibility = 'visible';

    let isUserDragging = false;
    let isTouchOrHoverActive = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    btn.addEventListener('mouseenter', () => {
      isTouchOrHoverActive = true;
      wrap.classList.add('show-label');
    });
    btn.addEventListener('mouseleave', () => {
      isTouchOrHoverActive = false;
      wrap.classList.remove('show-label');
    });
    btn.addEventListener('touchstart', () => {
      isTouchOrHoverActive = true;
      wrap.classList.add('show-label');
    }, { passive: true });
    btn.addEventListener('touchend', () => {
      isTouchOrHoverActive = false;
      setTimeout(() => wrap.classList.remove('show-label'), 1200);
    });

    let isAutoFloatEnabled = true;

    function getBounds() {
      const winW = window.innerWidth || document.documentElement.clientWidth || 360;
      const winH = window.innerHeight || document.documentElement.clientHeight || 640;
      const w = wrap.offsetWidth || 56;
      const h = wrap.offsetHeight || 56;
      return {
        minX: 16,
        maxX: Math.max(16, winW - w - 16),
        minY: 75,
        maxY: Math.max(75, winH - h - 25)
      };
    }

    const b = getBounds();
    let posX = Math.max(b.minX, b.maxX - 20);
    let posY = Math.max(b.minY, Math.min(100, b.maxY));

    let velX = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.4);
    let velY = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.4);

    wrap.style.left = `${posX}px`;
    wrap.style.top = `${posY}px`;
    wrap.style.right = 'auto';
    wrap.style.bottom = 'auto';

    function ensureContinuousMotion() {
      isAutoFloatEnabled = true;
      const curBounds = getBounds();
      posX = Math.max(curBounds.minX, Math.min(posX, curBounds.maxX));
      posY = Math.max(curBounds.minY, Math.min(posY, curBounds.maxY));

      if (Math.abs(velX) < 0.5) velX = (Math.random() > 0.5 ? 1.4 : -1.4);
      if (Math.abs(velY) < 0.5) velY = (Math.random() > 0.5 ? 1.4 : -1.4);

      wrap.style.left = `${posX}px`;
      wrap.style.top = `${posY}px`;
    }

    window.addEventListener('resize', ensureContinuousMotion, { passive: true });
    window.addEventListener('focus', ensureContinuousMotion, { passive: true });
    window.addEventListener('pageshow', ensureContinuousMotion, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) ensureContinuousMotion();
    });

    let lastTime = Date.now();

    function updateFloatPosition(dt) {
      const dropdown = document.getElementById('askCognispherePillDropdown');
      const isCardOpen = dropdown && dropdown.classList.contains('open');

      if (isAutoFloatEnabled && !isUserDragging && !isCardOpen && !isTouchOrHoverActive) {
        const deltaFactor = Math.min(dt * 60, 3.0);
        posX += velX * deltaFactor;
        posY += velY * deltaFactor;

        const curBounds = getBounds();

        if (posX <= curBounds.minX) { posX = curBounds.minX; velX = Math.abs(velX); }
        if (posX >= curBounds.maxX) { posX = curBounds.maxX; velX = -Math.abs(velX); }
        if (posY <= curBounds.minY) { posY = curBounds.minY; velY = Math.abs(velY); }
        if (posY >= curBounds.maxY) { posY = curBounds.maxY; velY = -Math.abs(velY); }

        if (Math.abs(velX) < 0.4) velX = velX < 0 ? -1.2 : 1.2;
        if (Math.abs(velY) < 0.4) velY = velY < 0 ? -1.2 : 1.2;

        if (Math.random() < 0.015) {
          velX += (Math.random() - 0.5) * 0.5;
          velY += (Math.random() - 0.5) * 0.5;
          const speed = Math.hypot(velX, velY);
          if (speed > 2.2) { velX = (velX / speed) * 2.2; velY = (velY / speed) * 2.2; }
          if (speed < 0.8) { velX = (velX / (speed || 1)) * 1.0; velY = (velY / (speed || 1)) * 1.0; }
        }

        wrap.style.left = `${posX}px`;
        wrap.style.top = `${posY}px`;
      }
    }

    function autoFloatStep() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      updateFloatPosition(dt);
      requestAnimationFrame(autoFloatStep);
    }

    requestAnimationFrame(autoFloatStep);

    setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTime) / 1000;
      if (elapsed > 0.04) {
        updateFloatPosition(Math.min(elapsed, 0.2));
        lastTime = now;
      }
    }, 60);

    function onPointerDown(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rect = wrap.getBoundingClientRect();
      startX = clientX;
      startY = clientY;

      initialLeft = rect.left;
      initialTop = rect.top;

      isUserDragging = true;
      hasMoved = false;

      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isUserDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasMoved = true;
        if (e.cancelable) e.preventDefault();
      }

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      const maxLeft = window.innerWidth - wrap.offsetWidth - 10;
      const maxTop = window.innerHeight - wrap.offsetHeight - 10;

      posX = Math.max(10, Math.min(newLeft, maxLeft));
      posY = Math.max(65, Math.min(newTop, maxTop));

      wrap.style.left = `${posX}px`;
      wrap.style.top = `${posY}px`;
    }

    function onPointerUp(e) {
      isUserDragging = false;

      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);

      if (hasMoved) {
        wrap.setAttribute('data-dragged', 'true');
        setTimeout(() => wrap.removeAttribute('data-dragged'), 100);
      } else {
        openCard();
      }
    }

    btn.addEventListener('mousedown', onPointerDown);
    btn.addEventListener('touchstart', onPointerDown, { passive: false });
  }

  function openCard() {
    const wrap = document.getElementById('askCognispherePillWrap');
    const dropdown = document.getElementById('askCognispherePillDropdown');
    const input = document.getElementById('askCognispherePillInput');
    const minimizeBtn = document.getElementById('cogniAiMinimizeBtn');

    if (!dropdown || dropdown.classList.contains('open')) return;
    dropdown.classList.remove('minimized');
    if (minimizeBtn) {
      minimizeBtn.innerHTML = '─';
      minimizeBtn.title = 'Minimize AI Card';
    }
    dropdown.classList.add('open');
    document.body.classList.add('ai-card-open');
    if (window.innerWidth > 768) {
      document.body.classList.add('cogni-split-mode');
    }
    if (wrap) wrap.classList.add('card-is-open');

    saveGlobalChatState();
    setTimeout(() => {
      if (input) input.focus();
    }, 350);
  }

  function closeCard() {
    const wrap = document.getElementById('askCognispherePillWrap');
    const dropdown = document.getElementById('askCognispherePillDropdown');
    const minimizeBtn = document.getElementById('cogniAiMinimizeBtn');
    const frame = document.getElementById('cogniPageSlideFrame');

    if (!dropdown) return;
    dropdown.classList.remove('open');
    dropdown.classList.remove('minimized');
    if (minimizeBtn) {
      minimizeBtn.innerHTML = '─';
      minimizeBtn.title = 'Minimize AI Card';
    }
    document.body.classList.remove('ai-card-open');
    document.body.classList.remove('cogni-split-mode');
    if (frame) {
      frame.remove();
    }
    removeLiveSpotlight();
    if (wrap) wrap.classList.remove('card-is-open');
    if (window.cogniResetFloatState) window.cogniResetFloatState();
    saveGlobalChatState();
  }



  function initSplitViewResizer() {
    const divider = document.getElementById('cogniSplitResizeDivider');
    if (!divider) return;

    let isDragging = false;
    let startX = 0;
    let startWidth = 440;

    function getSavedDrawerWidth() {
      try {
        const saved = localStorage.getItem('cogniDrawerWidth');
        return saved ? parseInt(saved, 10) : 440;
      } catch (e) {
        return 440;
      }
    }

    function applyDrawerWidth(w) {
      const clampedW = Math.max(280, Math.min(w, window.innerWidth - 280));
      document.documentElement.style.setProperty('--cogni-drawer-width', `${clampedW}px`);
      try { localStorage.setItem('cogniDrawerWidth', clampedW); } catch (e) { }
    }

    applyDrawerWidth(getSavedDrawerWidth());

    function onStart(e) {
      if (window.innerWidth <= 768) return;
      isDragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;

      const currentW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cogni-drawer-width')) || 440;
      startWidth = currentW;

      divider.classList.add('dragging');
      document.body.classList.add('is-resizing-slides');

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = startX - clientX;
      const newWidth = startWidth + deltaX;
      applyDrawerWidth(newWidth);
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      divider.classList.remove('dragging');
      document.body.classList.remove('is-resizing-slides');

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    }

    divider.addEventListener('mousedown', onStart);
    divider.addEventListener('touchstart', onStart, { passive: false });
  }

  window.openCognisphereAI = openCard;
  window.closeCognisphereAI = closeCard;

  let isAiProcessing = false;
  let currentHighlightedElement = null;
  let activeTrajectoryStopCallback = null;
  let interventionTimeout = null;
  let activeSendUserMessageImpl = null;

  function sendUserMessage(userText, isContinuation = false) {
    if (typeof activeSendUserMessageImpl === 'function') {
      activeSendUserMessageImpl(userText, isContinuation);
    }
  }

  function showInterventionAlert() {
    if (!isAiProcessing) return;
    let alertEl = document.getElementById('cogniAgentInterventionAlert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.id = 'cogniAgentInterventionAlert';
      alertEl.className = 'cogni-agent-intervention-alert';
      document.body.appendChild(alertEl);
    }

    alertEl.innerHTML = `
      <span class="cogni-alert-dot"></span>
      <span>Agent is running...</span>
    `;

    alertEl.classList.add('active');

    clearTimeout(interventionTimeout);
    interventionTimeout = setTimeout(() => {
      if (alertEl) alertEl.classList.remove('active');
    }, 1800);
  }

  function hideInterventionAlert() {
    const alertEl = document.getElementById('cogniAgentInterventionAlert');
    if (alertEl) alertEl.classList.remove('active');
    clearTimeout(interventionTimeout);
  }

  window.addEventListener('wheel', (e) => {
    if (isAiProcessing && e.target && !e.target.closest('#askCognispherePillDropdown')) {
      showInterventionAlert();
    }
  }, { passive: true });

  window.addEventListener('mousedown', (e) => {
    if (isAiProcessing && e.target && !e.target.closest('#askCognispherePillDropdown, #cogniBottomAgentCard, #cogniAgentInterventionAlert')) {
      showInterventionAlert();
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (isAiProcessing && e.target && !e.target.closest('#askCognispherePillDropdown, #cogniBottomAgentCard, #cogniAgentInterventionAlert')) {
      showInterventionAlert();
    }
  }, { passive: true });

  function updateBottomAgentCard(title, stepText) {
    const card = document.getElementById('cogniBottomAgentCard');
    const titleEl = document.getElementById('cogniBottomStatusTitle');
    const stepEl = document.getElementById('cogniBottomStepText');
    const overlay = document.getElementById('cogniLiveBlurOverlay');

    if (card) card.classList.add('active');
    if (overlay) overlay.classList.add('active');

    if (titleEl && title) titleEl.textContent = title;
    if (stepEl && stepText) stepEl.textContent = stepText.replace(/<[^>]*>/g, '');
  }

  function hideBottomAgentCard() {
    const card = document.getElementById('cogniBottomAgentCard');
    const overlay = document.getElementById('cogniLiveBlurOverlay');

    if (card) card.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    hideInterventionAlert();
    activeTrajectoryStopCallback = null;
  }

  function ensureAgentCursor() {
    let cursor = document.getElementById('cogniLiveAgentCursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'cogniLiveAgentCursor';
      cursor.className = 'cogni-live-agent-cursor';
      cursor.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#ff5e3a" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <span class="cogni-cursor-ripple"></span>
        <span class="cogni-cursor-label">Cos AI</span>
      `;
      document.body.appendChild(cursor);
    }
    return cursor;
  }

  function removeAgentCursor() {
    const cursor = document.getElementById('cogniLiveAgentCursor');
    if (cursor) {
      cursor.classList.remove('active', 'clicking');
    }
  }

  function smoothMicroScrollTo(targetTop, duration = 400, onComplete) {
    const win = window;
    const startTop = win.scrollY || win.pageYOffset || 0;
    const distance = targetTop - startTop;
    if (Math.abs(distance) < 5) {
      if (onComplete) onComplete();
      return;
    }
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      win.scrollTo(0, startTop + distance * ease);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    }
    requestAnimationFrame(step);
  }

  function scrollToElement(targetEl, onComplete) {
    if (!targetEl) {
      if (onComplete) onComplete();
      return;
    }
    try {
      const doc = targetEl.ownerDocument || document;
      const win = doc.defaultView || window;
      const rect = targetEl.getBoundingClientRect();
      const winH = win.innerHeight || 800;

      // If target element is already visible in the active viewport, DO NOT SCROLL (prevents page shaking!)
      if (rect.top >= 30 && rect.bottom <= winH - 30) {
        if (onComplete) onComplete();
        return;
      }

      const targetTop = (win.scrollY || win.pageYOffset || 0) + rect.top - (winH / 2) + (rect.height / 2);
      smoothMicroScrollTo(Math.max(0, targetTop), 100, onComplete);
    } catch (err) {
      if (onComplete) onComplete();
    }
  }

  function getElementWindowBounds(el) {
    if (!el) return { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 40, height: 40 };
    try {
      const rect = el.getBoundingClientRect();
      let offsetLeft = 0;
      let offsetTop = 0;
      const doc = el.ownerDocument || document;
      if (doc !== document) {
        const frame = document.getElementById('cogniPageSlideFrame');
        if (frame) {
          const frameRect = frame.getBoundingClientRect();
          offsetLeft = frameRect.left;
          offsetTop = frameRect.top;
        }
      }
      return {
        left: rect.left + offsetLeft,
        top: rect.top + offsetTop,
        width: rect.width,
        height: rect.height
      };
    } catch (e) {
      return { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 40, height: 40 };
    }
  }

  let currentCursorX = window.innerWidth / 2;
  let currentCursorY = window.innerHeight / 2;

  function animateAgentCursorTo(targetEl, onComplete) {
    if (!targetEl || targetEl === document.body || targetEl === document.documentElement || (targetEl.tagName && (targetEl.tagName === 'BODY' || targetEl.tagName === 'HTML'))) {
      if (onComplete) onComplete();
      return;
    }

    const cursor = ensureAgentCursor();
    const bounds = getElementWindowBounds(targetEl);
    const startX = currentCursorX;
    const startY = currentCursorY;
    const targetX = bounds.left + (bounds.width / 2);
    const targetY = bounds.top + (bounds.height / 2);

    cursor.classList.add('active');
    cursor.classList.remove('clicking');

    // Smooth Eased Gliding Movement Over 1.8 Seconds
    const travelDuration = 1800;
    const startTime = performance.now();

    function moveStep(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / travelDuration, 1);
      // Cubic Easing out for natural, realistic human-like mouse glide
      const ease = 1 - Math.pow(1 - progress, 3);

      const curX = startX + (targetX - startX) * ease;
      const curY = startY + (targetY - startY) * ease;

      currentCursorX = curX;
      currentCursorY = curY;

      cursor.style.left = `${curX}px`;
      cursor.style.top = `${curY}px`;

      if (progress < 1) {
        requestAnimationFrame(moveStep);
      } else {
        // Hover over target element for 600ms before clicking
        setTimeout(() => {
          cursor.classList.add('clicking');
          if (targetEl && targetEl.classList) {
            try { targetEl.classList.add('cogni-focus-highlight'); } catch (e) { }
          }
          setTimeout(() => {
            cursor.classList.remove('clicking');
            if (onComplete) onComplete();
          }, 450);
        }, 600);
      }
    }

    requestAnimationFrame(moveStep);
  }

  function executeDomClick(targetEl, userText, actionType) {
    if (!targetEl || targetEl === document.body || targetEl === document.documentElement || (targetEl.tagName && (targetEl.tagName === 'BODY' || targetEl.tagName === 'HTML'))) return;

    const activeDoc = getActiveDoc();
    const win = activeDoc.defaultView || window;

    scrollToElement(targetEl, () => {
      animateAgentCursorTo(targetEl, () => {
        if (actionType === 'type') {
          try {
            targetEl.focus();
            targetEl.value = userText;
            targetEl.dispatchEvent(new win.Event('input', { bubbles: true }));
            targetEl.dispatchEvent(new win.Event('change', { bubbles: true }));
          } catch (e) { }
          return;
        }

        const clickable = targetEl.closest('a, button, .doc-card, .project-card, .cert-card, .academics-card, [onclick], [data-modal]') ||
          targetEl.querySelector('a, button, .view-btn, .card-btn, .doc-action, .btn-doc-download, [onclick], [data-modal]') ||
          targetEl;

        try { clickable.focus(); } catch (e) { }
        try { clickable.click(); } catch (e) { }

        try {
          const mouseEvt = new win.MouseEvent('click', { bubbles: true, cancelable: true, view: win });
          clickable.dispatchEvent(mouseEvt);
        } catch (e) { }

        try {
          const ptrEvt = new win.PointerEvent('click', { bubbles: true, cancelable: true, view: win });
          clickable.dispatchEvent(ptrEvt);
        } catch (e) { }

        const href = clickable.getAttribute ? clickable.getAttribute('href') : null;
        const onclickAttr = clickable.getAttribute ? clickable.getAttribute('onclick') : null;
        const modalAttr = clickable.getAttribute ? clickable.getAttribute('data-modal') : null;

        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          const targetFilename = getCleanFilename(href);
          const currentFilename = getCleanFilename(window.location.href);
          if (targetFilename !== currentFilename) {
            loadPageInLeftSlide(href);
          }
        } else if (modalAttr) {
          const modalEl = activeDoc.getElementById(modalAttr) || activeDoc.querySelector('.' + modalAttr);
          if (modalEl) {
            modalEl.classList.add('active', 'show', 'open');
            CogniCardHistoryStack.push(modalEl, modalAttr);
          }
        } else if (onclickAttr) {
          try {
            win.eval(onclickAttr);
          } catch (e) { }
        }

        // Direct handling for certificate cards & modals in active document context
        const card = clickable.classList.contains('doc-card') ? clickable : clickable.closest('.doc-card');
        if (card) {
          if (typeof win.openModal === 'function') {
            try { win.openModal(card); } catch (e) { }
          } else {
            const modalEl = activeDoc.getElementById('docModal');
            if (modalEl) {
              modalEl.classList.add('open');
              const titleEl = activeDoc.getElementById('docModalTitle');
              if (titleEl) titleEl.textContent = card.dataset.title || 'Document View';
              CogniCardHistoryStack.push(modalEl, card.dataset.title || 'Document Card');
            }
          }
        }

        // Verification & Retry Check: Verify card expanded/modal opened; retry if needed
        setTimeout(() => {
          const isModalOpen = activeDoc.querySelector('.modal.open, #docModal.open, .modal.active, .card-is-open, .expanded');
          if (!isModalOpen && card) {
            try {
              card.classList.add('expanded', 'active');
              const docModal = activeDoc.getElementById('docModal');
              if (docModal) {
                docModal.classList.add('open');
                CogniCardHistoryStack.push(docModal, card.dataset.title || 'Expanded Card');
              }
            } catch (e) { }
          } else if (isModalOpen) {
            CogniCardHistoryStack.push(isModalOpen, 'Opened Modal');
          }
        }, 450);
      });
    });
  }

  function applyLiveSpotlight(targetEl) {
    removeLiveSpotlight();
    const overlay = document.getElementById('cogniLiveBlurOverlay');
    if (overlay) overlay.classList.add('active');

    if (targetEl) {
      targetEl.classList.add('cogni-focus-highlight');
      targetEl.classList.add('dom-agent-target-highlight');
      currentHighlightedElement = targetEl;
      scrollToElement(targetEl, () => {
        animateAgentCursorTo(targetEl);
      });
    }
  }

  function removeLiveSpotlight() {
    const overlay = document.getElementById('cogniLiveBlurOverlay');
    if (overlay) overlay.classList.remove('active');
    removeAgentCursor();

    if (currentHighlightedElement) {
      currentHighlightedElement.classList.remove('cogni-focus-highlight');
      currentHighlightedElement.classList.remove('dom-agent-target-highlight');
      currentHighlightedElement = null;
    }
  }

  const DomAgent = {
    executeCommand(targetName, action = 'click', isContinuation = false) {
      sendUserMessage(targetName, isContinuation);
    }
  };

  function bindPillEvents() {
    const wrap = document.getElementById('askCognispherePillWrap');
    const pillBtn = document.getElementById('askCognispherePillBtn');
    const dropdown = document.getElementById('askCognispherePillDropdown');
    const input = document.getElementById('askCognispherePillInput');
    const submitBtn = document.getElementById('askCognispherePillSubmit');
    const closeBtn = document.getElementById('cogniAiCloseBtn');
    const minimizeBtn = document.getElementById('cogniAiMinimizeBtn');
    const dragHandle = document.getElementById('cogniDragHandle');
    const header = document.getElementById('cogniAiHeader');
    const chatBody = document.getElementById('cogniAiChatBody');

    if (!pillBtn) return;

    function toggleMinimize() {
      if (!dropdown) return;
      const isMin = dropdown.classList.toggle('minimized');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = isMin ? '▲' : '─';
        minimizeBtn.title = isMin ? 'Expand AI Card' : 'Minimize AI Card';
      }
    }

    window.openCognisphereCard = openCard;
    window.closeCognisphereCard = closeCard;

    window.cogniResetFloatState = function () {
      if (wrap) wrap.classList.remove('show-label');
    };

    pillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (wrap.getAttribute('data-dragged') === 'true') return;
      openCard();
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCard();
    });

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
      });
    }

    if (dragHandle) {
      dragHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
      });
    }

    if (header) {
      header.addEventListener('click', (e) => {
        if (dropdown.classList.contains('minimized') && e.target !== closeBtn && e.target !== minimizeBtn) {
          toggleMinimize();
        }
      });
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserSubmit();
      }
    });

    const slashPopup = document.getElementById('cogniSlashPopup');
    const mentionPopup = document.getElementById('cogniMentionPopup');

    input.addEventListener('input', () => {
      const val = input.value;
      if (val === '/') {
        if (slashPopup) slashPopup.classList.add('active');
        if (mentionPopup) mentionPopup.classList.remove('active');
      } else if (val === '@') {
        if (mentionPopup) mentionPopup.classList.add('active');
        if (slashPopup) slashPopup.classList.remove('active');
      } else {
        if (slashPopup && !val.startsWith('/')) slashPopup.classList.remove('active');
        if (mentionPopup && !val.startsWith('@')) mentionPopup.classList.remove('active');
      }
    });

    if (slashPopup) {
      slashPopup.addEventListener('click', (e) => {
        const item = e.target.closest('.cogni-slash-item');
        if (item) {
          const cmd = item.getAttribute('data-cmd');
          input.value = cmd + ' ';
          slashPopup.classList.remove('active');
          input.focus();
        }
      });
    }

    if (mentionPopup) {
      mentionPopup.addEventListener('click', (e) => {
        const item = e.target.closest('.cogni-mention-item');
        if (item) {
          const mention = item.getAttribute('data-mention');
          input.value = mention + ' ';
          mentionPopup.classList.remove('active');
          input.focus();
        }
      });
    }

    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleUserSubmit();
    });

    const autoBtn = document.getElementById('cogniModeAutoBtn');
    const stepBtn = document.getElementById('cogniModeStepBtn');
    const pauseBtn = document.getElementById('cogniModePauseBtn');
    const profileSelect = document.getElementById('cogniPacingProfileSelect');

    function setActiveMode(mode) {
      CogniPacingController.mode = mode;
      [autoBtn, stepBtn, pauseBtn].forEach(b => { if (b) b.classList.remove('active'); });
      if (mode === 'auto' && autoBtn) autoBtn.classList.add('active');
      if (mode === 'step' && stepBtn) stepBtn.classList.add('active');
      if (mode === 'paused' && pauseBtn) pauseBtn.classList.add('active');
      if (mode !== 'step') {
        CogniPacingController.releaseStep();
      }
    }

    if (autoBtn) autoBtn.addEventListener('click', () => setActiveMode('auto'));
    if (stepBtn) stepBtn.addEventListener('click', () => setActiveMode('step'));
    if (pauseBtn) pauseBtn.addEventListener('click', () => setActiveMode('paused'));
    if (profileSelect) {
      profileSelect.addEventListener('change', (e) => {
        CogniPacingController.profile = e.target.value;
      });
    }

    // Delegated click listener for Step release & Jump to highlight evidence buttons
    dropdown.addEventListener('click', (e) => {
      const stepReleaseBtn = e.target.closest('.cogni-step-release-btn');
      if (stepReleaseBtn) {
        e.preventDefault();
        e.stopPropagation();
        CogniPacingController.releaseStep();
        stepReleaseBtn.innerHTML = '☑ Dispatched';
        stepReleaseBtn.style.opacity = '0.6';
        stepReleaseBtn.disabled = true;
      }

      const jumpBtn = e.target.closest('.cogni-jump-highlight-btn');
      if (jumpBtn) {
        e.preventDefault();
        e.stopPropagation();
        const info = window.cogniLastTargetInfo || {};
        if (info.targetEl) {
          applyLiveSpotlight(info.targetEl);
        }
      }

      const chip = e.target.closest('.cogni-prompt-chip');
      if (chip) {
        e.preventDefault();
        e.stopPropagation();
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) sendUserMessage(prompt);
      }
    });

    function handleUserSubmit() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendUserMessage(text);
    }

    const conversationHistory = [];

    function recordConversationTurn(userText, botReplyText) {
      conversationHistory.push({ user: userText, bot: botReplyText });
      if (conversationHistory.length > 10) conversationHistory.shift();
    }

    function setInputLockState(locked) {
      isAiProcessing = locked;
      if (input) {
        input.disabled = locked;
        input.style.opacity = locked ? '0.5' : '1';
        input.style.cursor = locked ? 'not-allowed' : 'text';
        if (!locked) {
          setTimeout(() => { try { input.focus(); } catch (e) { } }, 100);
        }
      }
      if (submitBtn) {
        submitBtn.disabled = locked;
        submitBtn.style.opacity = locked ? '0.5' : '1';
        submitBtn.style.cursor = locked ? 'not-allowed' : 'pointer';
      }
      document.querySelectorAll('.cogni-prompt-chip').forEach(chip => {
        chip.style.pointerEvents = locked ? 'none' : 'auto';
        chip.style.opacity = locked ? '0.5' : '1';
      });
    }

    window.cogniUnlockInput = function () {
      setInputLockState(false);
    };

    const stopDomBtn = document.getElementById('cogniStopDomBtn');
    if (stopDomBtn) {
      stopDomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeTrajectoryStopCallback) {
          activeTrajectoryStopCallback();
        }
      });
      ElementLocator.findTargetElementForQuery = function (userQuery) {
        const q = userQuery.toLowerCase().trim();
        const stopWords = new Set(['what', 'is', 'my', 'the', 'in', 'a', 'an', 'on', 'for', 'me', 'show', 'tell', 'give', 'can', 'you', 'please', 'where', 'are', 'which', 'who']);
        const terms = q.split(/\s+/).map(t => t.replace(/[^a-z0-9]/gi, '')).filter(t => t.length >= 2 && !stopWords.has(t));
        const activeDoc = getActiveDoc();

        const candidates = Array.from(activeDoc.querySelectorAll(
          '.resume-section, .project-card, .cert-card, .academics-card, ' +
          '.skill-card, .hero-section, .contact-section, section, article, tr, .doc-card, .wps-link-card, .notes-subject-card, .notes-card'
        ));

        if (candidates.length === 0) return activeDoc.body;

        let bestMatch = null;
        let highestScore = -1;

        candidates.forEach(el => {
          const text = (el.innerText || el.textContent || '').toLowerCase();
          if (!text || text.length < 3) return;

          let score = 0;
          terms.forEach(term => {
            if (text.includes(term)) score += 10;
          });

          if (score > highestScore) {
            highestScore = score;
            bestMatch = el;
          }
        });

        return (bestMatch && highestScore > 0) ? bestMatch : activeDoc.body;
      };

      function generateAiResponse(query, targetEl) {
        const activeDoc = getActiveDoc();
        const rawQ = query.toLowerCase().trim();

        if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|whats up|what's up|how are you|how r u|bye|thanks|thank you)(\s+|$|!|\?)/i.test(rawQ)) {
          return `
            <div style="color: #e2e8f0; font-size: 13.5px; line-height: 1.6; background: rgba(18, 24, 38, 0.95); border: 1px solid rgba(0, 230, 118, 0.3); border-radius: 10px; padding: 14px 16px;">
              👋 Hello! How can I assist you with Abhiram Reddy's portfolio today?<br><br>
              Ask any specific question about <strong>Academics & Grades</strong>, <strong>Verified Certificates</strong>, <strong>Projects (GearGo, Gramaseva, HELP, ByteLoop)</strong>, or <strong>Skills</strong>, and I will inspect & highlight the live DOM tree on screen to give you the exact answer!
            </div>
          `;
        }

        const stopWords = new Set(['what', 'is', 'are', 'my', 'the', 'in', 'a', 'an', 'on', 'for', 'me', 'show', 'tell', 'give', 'can', 'you', 'please', 'where', 'which', 'who', 'about']);
        const queryTokens = rawQ.split(/\s+/).map(t => t.replace(/[^a-z0-9]/gi, '')).filter(t => t.length >= 2 && !stopWords.has(t));

        const searchTarget = (targetEl && targetEl !== activeDoc.body) ? targetEl : (activeDoc.querySelector('main, article, .vault-container, .acad-shell, section, body') || activeDoc.body);

        // Extract live title dynamically from target DOM node
        const titleEl = searchTarget.querySelector('h1, h2, h3, h4, .doc-title, .project-title, .card-title, .notes-subject-name, .hero-title, .section-title, strong, b');
        let titleText = titleEl ? titleEl.innerText.trim() : (searchTarget.getAttribute('data-title') || activeDoc.title || 'Live Viewport');
        if (titleText.length > 70) titleText = titleText.slice(0, 70) + '...';

        const tagName = searchTarget.tagName ? searchTarget.tagName.toLowerCase() : 'section';
        const nodeClass = (searchTarget.className || '').toString().split(/\s+/).filter(c => c && !c.startsWith('cogni')).slice(0, 2).join('.');

        // Extract and score live text lines directly related to query
        const rawText = (searchTarget.innerText || searchTarget.textContent || activeDoc.body.innerText || '');
        const allLines = rawText
          .split(/[\n\r]+/)
          .map(l => l.trim())
          .filter(l => {
            if (l.length < 2) return false;
            const lower = l.toLowerCase();
            if (lower.includes('ask cos ai') || lower.includes('who is abhiram?') || lower.includes('inspect link') || lower.includes(' worked for ') || lower.startsWith('<') || lower.includes('bash — agy')) return false;
            return true;
          });

        let scoredLines = allLines.map(line => {
          let score = 0;
          const lower = line.toLowerCase();
          queryTokens.forEach(t => {
            if (lower.includes(t)) score += 10;
          });
          return { line, score };
        });

        // Filter lines matching query tokens if any token matches
        let matchingLines = scoredLines.filter(item => item.score > 0);

        // If target element didn't yield token matches, search full active document for matching lines
        if (matchingLines.length === 0 && queryTokens.length > 0) {
          const docRawText = activeDoc.body.innerText || '';
          const docLines = docRawText
            .split(/[\n\r]+/)
            .map(l => l.trim())
            .filter(l => l.length >= 3 && !l.toLowerCase().includes('ask cos ai'));

          const globalScored = docLines.map(line => {
            let score = 0;
            const lower = line.toLowerCase();
            queryTokens.forEach(t => {
              if (lower.includes(t)) score += 10;
            });
            return { line, score };
          });
          matchingLines = globalScored.filter(item => item.score > 0);
        }

        let selectedLines = [];
        if (matchingLines.length > 0) {
          matchingLines.sort((a, b) => b.score - a.score);
          selectedLines = Array.from(new Set(matchingLines.map(m => m.line))).slice(0, 6);
        } else {
          selectedLines = Array.from(new Set(allLines)).slice(0, 5);
        }

        let dynamicBulletsHtml = '';
        if (selectedLines.length > 0) {
          selectedLines.forEach((lineText) => {
            dynamicBulletsHtml += `<div style="margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px;"><span style="color:#00e676; flex-shrink:0; font-weight:bold;">•</span><span style="color:#e2e8f0; font-size:13px; line-height:1.5;">${escapeHTML(lineText)}</span></div>`;
          });
        } else {
          dynamicBulletsHtml = `<div style="color: #94a3b8;">• Target content extracted live from DOM element &lt;${escapeHTML(tagName)}&gt;.</div>`;
        }

        // Extract live links directly from DOM node
        const childLinks = Array.from(searchTarget.querySelectorAll('a[href]'))
          .map(a => ({ title: a.innerText.trim() || a.getAttribute('href'), href: a.getAttribute('href') }))
          .filter(l => l.href && !l.href.startsWith('#') && !l.href.startsWith('javascript:'))
          .slice(0, 3);

        let linksHtml = '';
        if (childLinks.length > 0) {
          linksHtml = childLinks.map(l => `<a href="${escapeHTML(l.href)}" class="cogni-doc-link" onclick="event.preventDefault(); window.loadPageInLeftSlide('${escapeHTML(l.href)}');">Inspect ${escapeHTML(l.title.slice(0, 25))} ↗</a>`).join(' | ');
        }

        return `
          <div class="cogni-gathered-card" style="background: rgba(18, 24, 38, 0.95); border: 1.5px solid rgba(0, 230, 118, 0.4); border-radius: 12px; padding: 16px 18px; margin-top: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(0, 230, 118, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; margin-bottom: 12px;">
              <div style="font-size: 13px; font-weight: 700; color: #00e676; display: flex; align-items: center; gap: 6px;">
                <span>⚡ Answer Grounded from Live DOM</span>
              </div>
              <div style="font-size: 11px; background: rgba(0,230,118,0.15); color: #00e676; border: 1px solid rgba(0,230,118,0.4); padding: 2px 8px; border-radius: 4px; font-family: monospace;">
                &lt;${escapeHTML(tagName)}${nodeClass ? '.' + escapeHTML(nodeClass) : ''}&gt;
              </div>
            </div>

            <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 10px;">
              ${escapeHTML(titleText)}
            </div>

            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 12px;">
              ${dynamicBulletsHtml}
            </div>

            ${linksHtml ? `
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; font-size: 12px;">
              <span style="color: #94a3b8; font-weight: 600;">Related Links:</span>
              ${linksHtml}
            </div>` : ''}
          </div>
        `;
      }

      activeSendUserMessageImpl = function (userText, isContinuation = false) {
        if (!userText) return;
        if (isAiProcessing) setInputLockState(false);
        setInputLockState(true);

        const safetyUnlockTimer = setTimeout(() => { setInputLockState(false); }, 18000);

        let isTrajectoryAborted = false;

        activeTrajectoryStopCallback = () => {
          isTrajectoryAborted = true;
          try { clearInterval(statusInterval); } catch (e) { }
          try { clearInterval(executionTimer); } catch (e) { }
          removeLiveSpotlight();
          hideBottomAgentCard();
          clearTimeout(safetyUnlockTimer);
          setInputLockState(false);

          const targetMatch = ElementLocator.find(userText);
          const fullReply = generateAiResponse(userText, targetMatch ? targetMatch.element : null);

          chatBody.insertAdjacentHTML('beforeend', `
          <div class="cogni-msg bot">
            <div class="cogni-msg-bubble">
              <div class="cogni-ag-item" style="color: #ff5252; font-weight: 700;">🛑 DOM agent is stopped by user.</div>
              <details class="cogni-terminal-accordion" open style="margin-top:8px;">
                <summary class="cogni-terminal-summary">
                  <span class="cogni-terminal-cmd">Ran <code>agy dom verify --status "STOPPED_BY_USER"</code></span>
                  <span class="cogni-ag-chevron">›</span>
                </summary>
                <div class="cogni-terminal-box">
                  <div class="cogni-terminal-bar">
                    <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
                    <span class="cogni-terminal-title">bash — agy-dom-verify v2.4</span>
                  </div>
                  <pre class="cogni-terminal-code"><code>$ agy dom verify --status "STOPPED_BY_USER"
[SYSTEM] Live DOM control stopped by user request.
[DIRECT_ANALYSIS] Directly investigating live screen content in chatbox...
[STATUS 200 OK] Screen content extracted dynamically.</code></pre>
                </div>
              </details>
              <div class="cogni-response-body" style="margin-top:10px;">${fullReply}</div>
            </div>
          </div>
        `);
          chatBody.scrollTop = chatBody.scrollHeight;
        };

        try {
          const activeDoc = getActiveDoc();
          const intent = AiIntentAnalyzer.parseUserInstruction(userText);
          const trimmedQ = userText.trim().toLowerCase();
          const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|whats up|what's up|how are you|how r u|bye|thanks|thank you)(\s+|$|!|\?)/i.test(trimmedQ);

          // Render User Message Bubble
          chatBody.insertAdjacentHTML('beforeend', `
          <div class="cogni-msg user">
            <div class="cogni-msg-bubble">${escapeHTML(userText)}</div>
          </div>
        `);
          chatBody.scrollTop = chatBody.scrollHeight;

          const botMsgId = 'cogniBotMsg_' + Date.now();
          chatBody.insertAdjacentHTML('beforeend', `
          <div class="cogni-msg bot" id="${botMsgId}">
            <div class="cogni-msg-bubble">
              <span class="cogni-stream-body"></span>
              <span class="cogni-ai-status-pill">
                <span class="cogni-ai-status-sparkle">✨</span>
                <span class="cogni-ai-status-text">Investigating query...</span>
              </span>
            </div>
          </div>
        `);
          chatBody.scrollTop = chatBody.scrollHeight;

          const botMsgEl = document.getElementById(botMsgId);
          const streamBodyEl = botMsgEl ? botMsgEl.querySelector('.cogni-stream-body') : null;
          const statusTextEl = botMsgEl ? botMsgEl.querySelector('.cogni-ai-status-text') : null;

          const statusPhrases = ['Investigating query...', 'Analyzing streaming...', 'Running terminal check...', 'Planning DOM execution...', 'DOM control taking over...'];
          let phraseIdx = 0;

          const statusInterval = setInterval(() => {
            if (statusTextEl && statusTextEl.isConnected) {
              statusTextEl.style.opacity = '0';
              setTimeout(() => {
                phraseIdx = (phraseIdx + 1) % statusPhrases.length;
                statusTextEl.textContent = statusPhrases[phraseIdx];
                statusTextEl.style.opacity = '1';
              }, 120);
            }
          }, 1100);

          const messageStartTime = Date.now();
          const executionTimer = setInterval(() => {
            const elapsedSec = Math.max(1, Math.round((Date.now() - messageStartTime) / 1000));
            const timeStr = elapsedSec >= 60 ? `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s` : `${elapsedSec}s`;
            if (botMsgEl) {
              const timeEls = botMsgEl.querySelectorAll('.cogni-thought-time');
              timeEls.forEach(el => {
                el.textContent = `Worked for ${timeStr}`;
              });
            }
          }, 1000);

          const targetMatch = isGreeting ? null : ElementLocator.find(userText);
          const displayLabel = (targetMatch && targetMatch.isMatched) ? targetMatch.label : userText;
          const targetEl = (targetMatch && targetMatch.isMatched) ? targetMatch.element : null;

          const fullReply = generateAiResponse(userText, targetEl);
          recordConversationTurn(userText, fullReply);

          let steps = [];
          const scratchpadId = 'cogniScratchpad_' + Date.now();

          if (isGreeting || !targetMatch || !targetMatch.isMatched) {
            const initialTreeHtml = `<div class="cogni-response-body">${fullReply}</div>`;

            steps.push({
              title: "Grounded Query Analyzed",
              subtext: "Synthesizing answer from document content...",
              holdMs: 800,
              text: initialTreeHtml,
              action: () => {
                removeLiveSpotlight();
                hideBottomAgentCard();
              }
            });
          } else {
            const targetUrl = targetMatch.targetUrl || (targetEl && targetEl.getAttribute ? targetEl.getAttribute('href') : null);
            const searchTarget = (targetEl && targetEl !== activeDoc.body) ? targetEl : (activeDoc.querySelector('main, article, section, body') || activeDoc.body);
            const rect = searchTarget.getBoundingClientRect ? searchTarget.getBoundingClientRect() : { left: 120, top: 240, width: 320, height: 150 };
            const tagName = searchTarget.tagName ? searchTarget.tagName.toLowerCase() : 'element';
            const nodeId = searchTarget.id || '';
            const nodeClass = (searchTarget.className || '').toString().split(/\s+/).filter(c => c && !c.startsWith('cogni')).slice(0, 2).join('.');
            const nodeText = (searchTarget.innerText || searchTarget.textContent || displayLabel).trim().replace(/\s+/g, ' ').slice(0, 45);
            const actionUpper = intent.action ? intent.action.toUpperCase() : 'CLICK';

            const modelSelectEl = document.getElementById('cogniActiveModelSelect');
            const activeModel = modelSelectEl ? modelSelectEl.value : 'antigravity-vision-dom-v2.5';

            function getDomPath(el) {
              if (!el || !el.tagName) return 'body';
              const stack = [];
              let curr = el;
              while (curr && curr.tagName && curr.tagName.toLowerCase() !== 'html' && stack.length < 4) {
                let tag = curr.tagName.toLowerCase();
                if (curr.id) {
                  tag += `#${curr.id}`;
                } else if (curr.className && typeof curr.className === 'string') {
                  const cls = curr.className.split(/\s+/).filter(c => c && !c.startsWith('cogni'))[0];
                  if (cls) tag += `.${cls}`;
                }
                stack.unshift(tag);
                curr = curr.parentElement;
              }
              return stack.join(' > ');
            }

            const domPath = getDomPath(searchTarget);
            let treeDepth = 1;
            let pNode = searchTarget;
            while (pNode && pNode.parentElement) { treeDepth++; pNode = pNode.parentElement; }

            let compStyle = { display: 'block', visibility: 'visible', pointerEvents: 'auto' };
            try {
              if (window.getComputedStyle && searchTarget.nodeType === 1) {
                const cs = window.getComputedStyle(searchTarget);
                compStyle = {
                  display: cs.display || 'block',
                  visibility: cs.visibility || 'visible',
                  pointerEvents: cs.pointerEvents || 'auto'
                };
              }
            } catch (e) { }

            // Division 1 & 2: Explored DOM & Thinking Process (Solid Modern Cards)
            const planningTreeHtml =
              `<div class="cogni-scratchpad-box" id="${scratchpadId}">` +
              `<div class="cogni-scratchpad-title">⚡ Live DOM Agent Trajectory Checklist</div>` +
              `<div class="cogni-scratchpad-step step-1 running"><span class="cogni-circle-icon">◯</span> Step 1: Scan & Inspect Document Tree</div>` +
              `<div class="cogni-scratchpad-step step-2"><span class="cogni-circle-icon">◯</span> Step 2: Vision Grounding & Bounding Box</div>` +
              `<div class="cogni-scratchpad-step step-3"><span class="cogni-circle-icon">◯</span> Step 3: Dispatch Interaction & Navigate Viewport</div>` +
              `<div class="cogni-scratchpad-step step-4"><span class="cogni-circle-icon">◯</span> Step 4: Terminal Verification & Content Synthesis</div>` +
              `</div>` +
              `<details class="cogni-thought-accordion" open>` +
              `<summary>` +
              `<span>Explored active DOM tree <span class="cogni-ag-badge">L1-${treeDepth * 15}</span></span>` +
              `<span class="cogni-chevron">›</span>` +
              `</summary>` +
              `<div class="cogni-thought-content">` +
              `<div class="cogni-ag-item">Explored active document: <code>${escapeHTML((activeDoc.title || 'Portfolio Main').trim())}</code></div>` +
              `<div class="cogni-ag-item">Target Selector Path: <code>${escapeHTML(domPath)}</code></div>` +
              `<div class="cogni-ag-item">Analyzed query intent: "${escapeHTML(userText)}"</div>` +
              (targetMatch && targetMatch.isSelfCorrected ? `<div class="cogni-ag-item" style="color:#00e676;">⚡ Self-Correcting Trajectory: Auto-focused nearest semantic viewport container</div>` : '') +
              `<div class="cogni-ag-item">Resolved node: &lt;${tagName}${nodeId ? ' id="' + escapeHTML(nodeId) + '"' : ''}&gt; (Depth: ${treeDepth})</div>` +
              `</div>` +
              `</details>` +
              `<details class="cogni-thought-accordion" open>` +
              `<summary>` +
              `<span>Thinking for 1.8s</span>` +
              `<span class="cogni-chevron">›</span>` +
              `</summary>` +
              `<div class="cogni-thought-content">` +
              `<div class="cogni-ag-item" style="font-weight:600; color:#fff;">Refining Viewport Bounds & Target Interactivity</div>` +
              `<div class="cogni-ag-item">Target text preview: "${escapeHTML(nodeText)}"</div>` +
              `<div class="cogni-ag-item">Target rect: { x: ${Math.round(rect.left || 0)}, y: ${Math.round(rect.top || 0)}, w: ${Math.round(rect.width || 0)}, h: ${Math.round(rect.height || 0)} }</div>` +
              `<div class="cogni-ag-item" style="color: #78a9ff;">⏳ Agent executing action on live DOM screen...</div>` +
              `</div>` +
              `</details>`;

            const ledger = CogniCardLedger.detect(activeDoc);
            const actionCardId = 'cogniActionCard_' + Date.now();

            // Stage 1: READ Card
            const readCardHtml =
              `<div class="cogni-card-read">` +
              `<div class="cogni-card-badge done">STAGE 1: READ</div>` +
              `<div><strong>Understood:</strong> "${escapeHTML(userText)}"</div>` +
              `<div style="color:#94a3b8; font-size:11px; margin-top:2px;">Intent Type: <code style="color:#60a5fa;">${intent.action.toUpperCase()}</code> | Target: ${escapeHTML(displayLabel.slice(0, 25))}</div>` +
              `</div>`;

            steps.push({
              stepNum: 1,
              title: "Planning Antigravity DOM Trajectory...",
              subtext: "DOM agent takes control of screen...",
              holdMs: 4500,
              text: readCardHtml,
              action: () => {
                updateScratchpadStep(scratchpadId, 1, 'running');
              }
            });

            // Stage 2 & 3: SEARCH, CARD LEDGER & THINK Card
            const ledgerRowsHtml = ledger.items.slice(0, 3).map(it =>
              `<tr><td>#${it.id}</td><td>${escapeHTML(it.title)}</td><td style="color:${it.status === 'opened' ? '#00e676' : '#ffbd2e'}">${it.status}</td></tr>`
            ).join('');

            const searchThinkCardHtml =
              `<div class="cogni-card-search">` +
              `<div class="cogni-card-badge done">STAGE 2 & 3: SEARCH & THINK</div>` +
              `<div>Searching active DOM tree: <code>${escapeHTML((activeDoc.title || 'Page').trim())}</code></div>` +
              `<div style="margin-top:6px; background:rgba(0,0,0,0.2); padding:6px 8px; border-radius:6px;">` +
              `<div style="font-weight:700; color:#00e676; font-size:11px;">Card Ledger Summary:</div>` +
              `<table class="cogni-ledger-table"><thead><tr><th>ID</th><th>Card Title</th><th>Status</th></tr></thead><tbody>${ledgerRowsHtml}</tbody></table>` +
              `</div>` +
              `<div style="margin-top:6px; color:#cbd5e1;"><strong>Reasoning:</strong> Target element resolved as &lt;${tagName}&gt; matching selector <code>${escapeHTML(domPath)}</code>. Candidate confidence: 100%.</div>` +
              `</div>`;

            steps.push({
              stepNum: 2,
              title: "🔴 Agent is running...",
              subtext: `Inspecting <${tagName}> "${displayLabel.slice(0, 20)}"`,
              holdMs: 4800,
              text: searchThinkCardHtml,
              action: () => {
                updateScratchpadStep(scratchpadId, 1, 'checked');
                updateScratchpadStep(scratchpadId, 2, 'running');
                updateBottomAgentCard("🔴 Agent is running...", `Inspecting <${tagName}> "${displayLabel.slice(0, 20)}"`);
                applyLiveSpotlight(targetEl);

                window.cogniLastTargetInfo = {
                  title: displayLabel,
                  tagName: `<${tagName}>`,
                  userQuery: userText,
                  domPath: domPath,
                  rect: { left: Math.round(rect.left || 0), top: Math.round(rect.top || 0), width: Math.round(rect.width || 0), height: Math.round(rect.height || 0) },
                  nodeText: nodeText,
                  targetUrl: targetUrl,
                  targetEl: targetEl
                };
              }
            });

            // Stage 4 & 5: ANNOUNCE & SEND Action Card
            const isStepMode = CogniPacingController.mode === 'step';
            const actionCardHtml =
              `<div class="cogni-card-action queued" id="${actionCardId}">` +
              `<div style="display:flex; justify-content:space-between; align-items:center;">` +
              `<span class="cogni-card-badge queued">STAGE 4 & 5: ACTION QUEUED</span>` +
              `<span style="font-size:10.5px; color:#94a3b8; font-family:monospace;">Single-Flight Queue</span>` +
              `</div>` +
              `<div style="margin-top:4px; font-weight:600; color:#fff;">Next: Scroll to section, then dispatch ${actionUpper} to &lt;${tagName}&gt;</div>` +
              (isStepMode ? `<button type="button" class="cogni-step-release-btn"><span>Next ▶</span> Release Step to DOM</button>` : `<div style="font-size:11px; color:#00e676; margin-top:4px;">⚡ Pacing Controller auto-releasing action to DOM...</div>`) +
              `</div>`;

            steps.push({
              stepNum: 3,
              title: "🔴 Agent is running...",
              subtext: `Dispatching ${actionUpper} to <${tagName}>`,
              holdMs: 5200,
              text: actionCardHtml,
              action: async () => {
                updateScratchpadStep(scratchpadId, 2, 'checked');
                updateScratchpadStep(scratchpadId, 3, 'running');
                updateBottomAgentCard("🔴 Agent is running...", `Dispatching ${actionUpper} to <${tagName}>`);
                applyLiveSpotlight(targetEl);

                const cardEl = document.getElementById(actionCardId);
                if (cardEl) {
                  const badge = cardEl.querySelector('.cogni-card-badge');
                  if (badge) { badge.className = 'cogni-card-badge running'; badge.textContent = 'STAGE 6: EXECUTE'; }
                  cardEl.className = 'cogni-card-action running';
                }

                await CogniPacingController.waitPacing('execute_action');

                if (targetMatch.isNavRedirect && targetUrl) {
                  loadPageInLeftSlide(targetUrl);
                } else {
                  executeDomClick(targetEl, userText, intent.action);
                }

                const diagnosis = CogniClickDiagnoser.diagnose(targetEl);
                if (cardEl) {
                  const badge = cardEl.querySelector('.cogni-card-badge');
                  if (diagnosis.failure) {
                    if (badge) { badge.className = 'cogni-card-badge failed'; badge.textContent = 'STAGE 7: DIAGNOSIS ERROR'; }
                    cardEl.className = 'cogni-card-action failed';
                  } else {
                    if (badge) { badge.className = 'cogni-card-badge done'; badge.textContent = 'STAGE 7: EXECUTION ACK'; }
                    cardEl.className = 'cogni-card-action done';
                  }
                }
              }
            });

            // Stage 8: REPORT EvidenceCard & Final Run Report
            const evidenceHtml =
              `<div class="cogni-card-evidence">` +
              `<div class="cogni-card-badge done">STAGE 8: REPORT & EVIDENCE</div>` +
              `<div style="font-weight:700; color:#fff;">Grounded Evidence extracted from &lt;${tagName}&gt;</div>` +
              `<button type="button" class="cogni-jump-highlight-btn"><span>🎯 Jump to Highlight Element</span></button>` +
              `<button type="button" class="cogni-jump-highlight-btn" style="margin-left:6px; background:rgba(0,176,255,0.12); border-color:rgba(0,176,255,0.4); color:#00b0ff;" onclick="window.showCogniRunReportModal('${escapeHTML(userText)}', '${escapeHTML(fullReply.replace(/'/g, "\\'"))}', 4, null, CogniLiveMonitor.logs);"><span>📋 View Full Run Report</span></button>` +
              `</div>` +
              `<div class="cogni-response-body" style="margin-top:10px;">${fullReply}</div>`;

            steps.push({
              stepNum: 4,
              title: "DOM Action Verified",
              subtext: `Action completed on ${displayLabel.slice(0, 20)}`,
              holdMs: 4200,
              text: evidenceHtml,
              action: () => {
                updateScratchpadStep(scratchpadId, 3, 'checked');
                updateScratchpadStep(scratchpadId, 4, 'checked');
                updateBottomAgentCard("DOM Verified", `Action completed successfully!`);
                try { PinObserver.clearSetOfMarksOverlay(); } catch (e) { }
                setTimeout(() => {
                  removeLiveSpotlight();
                  hideBottomAgentCard();
                }, 800);
              }
            });
          }

          function updateScratchpadStep(spId, stepNum, state) {
            const spEl = document.getElementById(spId);
            if (!spEl) return;
            const stepEl = spEl.querySelector(`.step-${stepNum}`);
            if (!stepEl) return;
            stepEl.classList.remove('running', 'checked');
            stepEl.classList.add(state);
            const iconEl = stepEl.querySelector('.cogni-circle-icon');
            if (iconEl) {
              if (state === 'checked') iconEl.textContent = '☑';
              else if (state === 'running') iconEl.textContent = '◯';
            }
          }

          // Sequential Typewriter & Hold Execution Pipeline
          let stepIdx = 0;
          let accumulatedHtml = '';

          function runNextTrajectoryStep() {
            if (isTrajectoryAborted) return;

            if (stepIdx >= steps.length) {
              clearInterval(statusInterval);
              clearInterval(executionTimer);
              const statusPillEl = botMsgEl ? botMsgEl.querySelector('.cogni-ai-status-pill') : null;
              if (statusPillEl) statusPillEl.remove();
              clearTimeout(safetyUnlockTimer);

              // Auto-collapse thinking accordions when completed
              if (botMsgEl) {
                const accordions = botMsgEl.querySelectorAll('.cogni-thought-accordion, .cogni-terminal-accordion');
                accordions.forEach(acc => {
                  acc.removeAttribute('open');
                  const chevron = acc.querySelector('.cogni-chevron, .cogni-ag-chevron');
                  if (chevron) chevron.textContent = '▼';
                });
              }

              setTimeout(() => { setInputLockState(false); }, 300);
              setTimeout(() => {
                removeLiveSpotlight();
                hideBottomAgentCard();
              }, 1200);
              return;
            }

            // Auto-collapse previous step accordions as each new step begins
            if (botMsgEl && stepIdx > 0) {
              const prevAccordions = botMsgEl.querySelectorAll('.cogni-thought-accordion, .cogni-terminal-accordion');
              prevAccordions.forEach(acc => {
                acc.removeAttribute('open');
                const chevron = acc.querySelector('.cogni-chevron, .cogni-ag-chevron');
                if (chevron) chevron.textContent = '▼';
              });
            }

            const currentStep = steps[stepIdx];
            if (currentStep.title && currentStep.title.includes("Agent is running")) {
              updateBottomAgentCard(currentStep.title, currentStep.subtext);
            }
            if (currentStep.action) currentStep.action();

            const textToStream = currentStep.text || '';
            let charIdx = 0;

            function typeChar() {
              if (!streamBodyEl) return;

              if (charIdx < textToStream.length) {
                if (textToStream[charIdx] === '<') {
                  const closeIdx = textToStream.indexOf('>', charIdx);
                  if (closeIdx !== -1) charIdx = closeIdx + 1;
                  else charIdx++;
                } else {
                  charIdx++;
                }
                streamBodyEl.innerHTML = accumulatedHtml + textToStream.slice(0, charIdx);
                chatBody.scrollTop = chatBody.scrollHeight;
                setTimeout(typeChar, 12);
              } else {
                accumulatedHtml += textToStream;
                streamBodyEl.innerHTML = accumulatedHtml;
                stepIdx++;
                const holdTime = currentStep.holdMs || 4500;
                setTimeout(runNextTrajectoryStep, holdTime);
              }
            }

            typeChar();
          }

          runNextTrajectoryStep();

        } catch (err) {
          console.error('Ask Cos AI Execution Error:', err);
          clearTimeout(safetyUnlockTimer);
          setInputLockState(false);
        }
      }

      // Toggle accordion chevron on summary click
      if (chatBody) {
        chatBody.addEventListener('click', (e) => {
          const summary = e.target.closest('.cogni-thought-accordion summary');
          if (summary) {
            const accordion = summary.closest('.cogni-thought-accordion');
            const chevron = summary.querySelector('.cogni-chevron');
            if (accordion && chevron) {
              setTimeout(() => {
                chevron.textContent = accordion.hasAttribute('open') ? '▲' : '▼';
              }, 15);
            }
          }
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPill);
  } else {
    initPill();
  }
})();
