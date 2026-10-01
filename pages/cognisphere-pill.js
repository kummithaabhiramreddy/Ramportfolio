/* ==========================================================================
   CIRCULAR FLOATING COGNISPHERE AI ASSISTANT PLATFORM
   Large Gemini-Style AI Card with Hiding Logo, Smooth Expand & Freehand Drag
   ========================================================================== */

(function () {
  'use strict';

  // AI Base & Dynamic Page Knowledge Base
  const AI_KNOWLEDGE = {
    abhiram: "<strong>Kummitha Abhiram Reddy</strong> is an Information Technology student at <strong>SRKR Engineering College, Bhimavaram</strong>. He comes from <em>Thimmareddypalem village</em> in Nellore district, AP, and builds practical engineering products for people outside the metro bubble.",
    projects: "Abhiram has built several real-world platforms:<br>• <strong>ByteLoop Studio</strong>: Unused mobile data converted to credits.<br>• <strong>Gramaseva Connect</strong>: Discoverability platform for skilled rural & urban workers.<br>• <strong>GearGo Rental</strong>: Peer-to-peer equipment sharing.<br>• <strong>Academics Hub</strong>: CGPA, course records & countdowns.",
    skills: "Abhiram's core technical stack includes <strong>Python, JavaScript, HTML5/CSS3, Web App Architecture, AI/ML Integrations, System Telemetry, and Product Design</strong>.",
    contact: "You can reach Abhiram directly via email at <a href='mailto:kummitaabhiramreddy@gmail.com' style='color:#60a5fa;'>kummitaabhiramreddy@gmail.com</a>, or on <a href='https://www.linkedin.com/in/abhiramreddy-kummitha-379b49397/' target='_blank' style='color:#60a5fa;'>LinkedIn</a> & <a href='https://github.com/kummithaabhiramreddy' target='_blank' style='color:#60a5fa;'>GitHub</a>!"
  };

  const PAGE_KNOWLEDGE = {
    academics: {
      intro: "🎓 You are viewing <strong>Academics Hub</strong>! Abhiram holds a 9.0+ CGPA in B.Tech Information Technology at SRKR Engineering College, Bhimavaram. You can view SGPA/CGPA semester records, official hall tickets, course materials, and subject notes right on this page.",
      details: "<strong>Academics Highlights:</strong><br>• Institution: SRKR Engineering College, Bhimavaram<br>• Degree: B.Tech in Information Technology<br>• CGPA: 9.0+ (Distinction)<br>• Modules: CGPA Calculator, Semester Hall Tickets, Unit Notes & Exam Schedules.",
    },
    certificates: {
      intro: "📜 You are viewing <strong>Verified Certificates</strong>! Abhiram has earned credentials in Python Programming, Data Structures, Web App Architecture, and AI Integrations.",
      details: "<strong>Verified Credentials:</strong><br>• Python & Data Structures Certification<br>• Full-Stack Web Development (HTML/CSS/JS/REST APIs)<br>• AI Platform Integration & System Telemetry<br>• Click any certificate card to inspect details.",
    },
    admins: {
      intro: "🛡️ You are viewing <strong>Admin Management Portal</strong>! Manages system telemetry, role-based access control (RBAC), and CogniCoder lab environments.",
      details: "<strong>Admin Features:</strong><br>• Role-Based Access Control (RBAC)<br>• System Telemetry & Live Diagnostics<br>• Lab Environment & User Management.",
    },
    resume: {
      intro: "📄 You are viewing <strong>Interactive Resume</strong>! Review Abhiram's full experience, education timeline, technical skills, and print/download the PDF resume.",
      details: "<strong>Resume Summary:</strong><br>• Education: B.Tech IT (SRKR Engineering College)<br>• Core Stack: Python, JS, HTML5/CSS3, Web App Architecture, AI/ML, REST APIs, Git<br>• Major Projects: ByteLoop, Gramaseva, GearGo<br>• Click 'Back to Home' or print/download your copy.",
    },
    aifuture: {
      intro: "💻 You are viewing <strong>CogniCoder AI Platform</strong>! Interactive live code learning & lab management platform for DBMS, DSA, C, and Python lab evaluations.",
      details: "<strong>CogniCoder Features:</strong><br>• DBMS Lab (CC-DBMS-201)<br>• Data Structures & Algorithms Lab (CC-DSA-202)<br>• C & Python Programming Labs<br>• Automated Socratic hints, SQL schema checks & syntax feedback.",
    },
    index: {
      intro: "👋 Welcome to <strong>Abhiram Reddy's Portfolio</strong>! Explore real-world engineering products like ByteLoop, Gramaseva Connect, GearGo Rental, and tech stack.",
      details: "Abhiram is an IT student at SRKR Engineering College, AP. He builds human-centered platforms outside the metro bubble."
    }
  };

  function getCurrentPageKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('academics')) return 'academics';
    if (path.includes('certificates')) return 'certificates';
    if (path.includes('admins')) return 'admins';
    if (path.includes('resume')) return 'resume';
    if (path.includes('ai-future')) return 'aifuture';
    return 'index';
  }

  function initPill() {
    if (document.getElementById('askCognispherePillWrap')) return;

    if (!document.getElementById('cogniLiveBlurOverlay')) {
      document.body.insertAdjacentHTML('beforeend', `<div class="cogni-live-blur-overlay" id="cogniLiveBlurOverlay"></div>`);
    }

    const pageKey = getCurrentPageKey();
    const pageKnowledge = PAGE_KNOWLEDGE[pageKey] || PAGE_KNOWLEDGE.certificates;
    const initialIntroText = pageKnowledge ? `👋 Hello! I am <strong>Ask Cos AI</strong> — Kummitha Abhiram Reddy's personal AI platform.<br><br>${pageKnowledge.intro}<br><br>${pageKnowledge.details}` : `👋 Hello! I am <strong>Ask Cos AI</strong> — Kummitha Abhiram Reddy's personal AI platform. Ask me anything about Abhiram's projects, technical skills, or background!`;

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

          <div class="cogni-ai-chat-body" id="cogniAiChatBody">
            <div class="cogni-msg bot">
              <div class="cogni-msg-bubble">
                ${initialIntroText}
              </div>
            </div>
          </div>

          <div class="cogni-ai-prompts" id="cogniAiPrompts">
            <button class="cogni-prompt-chip" data-prompt="Who is Abhiram?">🚀 Who is Abhiram?</button>
            <button class="cogni-prompt-chip" data-prompt="What projects has he built?">⚡ Projects showcase</button>
            <button class="cogni-prompt-chip" data-prompt="What are his technical skills?">🛠️ Tech stack</button>
            <button class="cogni-prompt-chip" data-prompt="How can I contact him?">✉️ Contact info</button>
          </div>

          <div class="ask-cognisphere-input-row">
            <input type="text" class="ask-cognisphere-input" id="askCognispherePillInput" placeholder="Ask Cos AI anything..." autocomplete="off" />
            <button class="ask-cognisphere-search-btn" id="askCognispherePillSubmit">➔</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', pillHTML);
    bindPillEvents();
    initAutoFloatingAndDragging();
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

    // Pause movement and slowly reveal ChatGPT query-style Ask Cos AI label when user touches or hovers over the logo button
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
    btn.addEventListener('touchcancel', () => {
      isTouchOrHoverActive = false;
      wrap.classList.remove('show-label');
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

    // Ensure button keeps moving continuously when page/window is minimized, hidden, restored, or resized
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
        // Scale motion by delta time for frame-rate independence and background tab continuity
        const deltaFactor = Math.min(dt * 60, 3.0);
        posX += velX * deltaFactor;
        posY += velY * deltaFactor;

        const curBounds = getBounds();

        // Smoothly bounce off viewport boundaries
        if (posX <= curBounds.minX) { posX = curBounds.minX; velX = Math.abs(velX); }
        if (posX >= curBounds.maxX) { posX = curBounds.maxX; velX = -Math.abs(velX); }
        if (posY <= curBounds.minY) { posY = curBounds.minY; velY = Math.abs(velY); }
        if (posY >= curBounds.maxY) { posY = curBounds.maxY; velY = -Math.abs(velY); }

        // Ensure velocity never drops to 0
        if (Math.abs(velX) < 0.4) velX = velX < 0 ? -1.2 : 1.2;
        if (Math.abs(velY) < 0.4) velY = velY < 0 ? -1.2 : 1.2;

        // Subtle random vector adjustment for organic wander
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

    // Backup background timer so position updates continuously even when browser tab is minimized/hidden
    setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTime) / 1000;
      if (elapsed > 0.04) {
        updateFloatPosition(Math.min(elapsed, 0.2));
        lastTime = now;
      }
    }, 60);

    // Freehand dragging overrides
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

    window.cogniResetFloatState = function() {
      isTouchOrHoverActive = false;
      isUserDragging = false;
      if (wrap) wrap.classList.remove('show-label');
      ensureContinuousMotion();
    };

    function openCard() {
      if (!dropdown || dropdown.classList.contains('open')) return;
      dropdown.classList.remove('minimized');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '─';
        minimizeBtn.title = 'Minimize AI Card';
      }
      dropdown.classList.add('open');
      document.body.classList.add('ai-card-open');
      if (wrap) wrap.classList.add('card-is-open');
      setTimeout(() => {
        if (input) input.focus();
      }, 350);
    }

    function closeCard() {
      if (!dropdown) return;
      dropdown.classList.remove('open');
      dropdown.classList.remove('minimized');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '─';
        minimizeBtn.title = 'Minimize AI Card';
      }
      document.body.classList.remove('ai-card-open');
      removeLiveSpotlight();
      if (wrap) wrap.classList.remove('card-is-open');
      if (window.cogniResetFloatState) window.cogniResetFloatState();
    }

    function findTargetElementForQuery(userQuery) {
      const q = userQuery.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(t => t.length > 2);

      const candidates = Array.from(document.querySelectorAll(
        '.resume-section, .resume-side-block, .project-card, .cert-card, .academics-card, ' +
        '.skill-card, .level-card, .course-card, .lab-card, .step-page.active, ' +
        '.hero-section, .contact-section, .resume-header, .resume-summary, ' +
        'section, article, .card, tr, .code-field-input, #codeEditor, textarea:not(#askCognispherePillInput)'
      ));

      if (candidates.length === 0) {
        return document.querySelector('.resume-sheet, .resume-inner, .page-wrap, main, article') || document.body;
      }

      let bestMatch = null;
      let highestScore = -1;

      candidates.forEach(el => {
        const text = (el.innerText || el.textContent || '').toLowerCase();
        if (!text || text.length < 5) return;

        let score = 0;

        if (/achiev|certif|credential|award|verified|udbhav|hackathon/i.test(q) && /achiev|certif|credential|award|verified|udbhav|hackathon/i.test(text)) score += 12;
        if (/project|byteloop|gramaseva|geargo|help|built|work/i.test(q) && /project|byteloop|gramaseva|geargo|help|built|work/i.test(text)) score += 12;
        if (/skill|tech|stack|language|python|javascript/i.test(q) && /skill|tech|stack|language|python|javascript/i.test(text)) score += 12;
        if (/study|studying|cgpa|academic|grade|exam|mark|hall ticket|edu|college|b\.tech|school|srkr|bhimavaram/i.test(q) && /study|studying|cgpa|academic|grade|exam|mark|hall ticket|edu|college|b\.tech|school|srkr|bhimavaram/i.test(text)) score += 12;
        if (/hometown|native|village|nellore|thimmareddypalem|location|from/i.test(q) && /hometown|native|village|nellore|thimmareddypalem|location|from/i.test(text)) score += 12;
        if (/contact|email|phone|reach|linkedin|github|gmail/i.test(q) && /contact|email|phone|reach|linkedin|github|gmail/i.test(text)) score += 12;
        if (/who|abhiram|bio|candidate|profile|about|summary/i.test(q) && /who|abhiram|bio|candidate|profile|about|summary/i.test(text)) score += 12;
        if (/code|error|syntax|debug|compiler|editor/i.test(q) && (el.tagName === 'TEXTAREA' || el.classList.contains('code-field-input') || el.id === 'codeEditor')) score += 15;

        terms.forEach(term => {
          if (text.includes(term)) score += 2;
        });

        if (score > highestScore) {
          highestScore = score;
          bestMatch = el;
        }
      });

      if (bestMatch && highestScore > 0) {
        return bestMatch;
      }

      return document.querySelector('.resume-section, .project-card, .cert-card, .academics-card, section, article') || document.body;
    }

    let currentHighlightedElement = null;

    function applyLiveSpotlight(targetEl) {
      removeLiveSpotlight();

      if (!targetEl) return;

      const overlay = document.getElementById('cogniLiveBlurOverlay');
      if (overlay) overlay.classList.add('active');

      targetEl.classList.add('cogni-focus-highlight');
      currentHighlightedElement = targetEl;

      try {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) { }
    }

    function removeLiveSpotlight() {
      const overlay = document.getElementById('cogniLiveBlurOverlay');
      if (overlay) overlay.classList.remove('active');

      if (currentHighlightedElement) {
        currentHighlightedElement.classList.remove('cogni-focus-highlight');
        currentHighlightedElement = null;
      }
    }

    // Open Card & Hide Floating Logo Button
    pillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (wrap.getAttribute('data-dragged') === 'true') return;
      openCard();
    });

    // Close Card & Show Floating Logo Button again smoothly
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
      if (e.key === 'Enter') handleUserSubmit();
    });

    submitBtn.addEventListener('click', () => {
      handleUserSubmit();
    });

    document.querySelectorAll('.cogni-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        sendUserMessage(prompt);
      });
    });

    function handleUserSubmit() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendUserMessage(text);
    }

    // Chat Conversation Context Memory for Multi-turn Follow-up Chats
    const conversationHistory = [];

    function recordConversationTurn(userText, botReplyText) {
      conversationHistory.push({ user: userText, bot: botReplyText });
      if (conversationHistory.length > 10) conversationHistory.shift();
    }

    function getPreviousUserTopic() {
      if (conversationHistory.length === 0) return '';
      const last = conversationHistory[conversationHistory.length - 1];
      return last ? (last.user + ' ' + last.bot).toLowerCase() : '';
    }

    // AI Active Processing State Lock Engine
    let isAiProcessing = false;

    function setInputLockState(locked) {
      isAiProcessing = locked;
      if (input) {
        input.disabled = locked;
        input.style.opacity = locked ? '0.5' : '1';
        input.style.cursor = locked ? 'not-allowed' : 'text';
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

    function updateAgentHudStep(stepText) {
      const bar = document.getElementById('cogniBottomAgentBar');
      const textEl = document.getElementById('cogniAgentStepText');
      if (textEl) textEl.textContent = stepText;
      if (bar) bar.classList.add('active');
    }

    function hideAgentHud() {
      const bar = document.getElementById('cogniBottomAgentBar');
      if (bar) bar.classList.remove('active');
    }

    function generateDynamicExecutionSteps(userQuery, targetEl) {
      const q = userQuery.toLowerCase().trim();

      const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const scanningOptions = [
        'Scanning active page DOM context...',
        'Inspecting live document tree...',
        'Reading active viewport DOM nodes...',
        'Locating targeted DOM section...'
      ];

      const verificationPool = [
        'Cross-referencing live page context...',
        'Re-verifying telemetry accuracy...',
        'Double-checking ground-truth records...',
        'Parsing section data attributes...'
      ];

      const synthesisOptions = [
        'Synthesizing response...',
        'Formatting answer breakdown...',
        'Preparing structured response...',
        'Finalizing telemetry output...'
      ];

      let steps = [];

      // Code & Syntax Debugging
      if (q.includes('code') || q.includes('error') || q.includes('syntax') || q.includes('debug') || (targetEl && (targetEl.tagName === 'TEXTAREA' || targetEl.classList.contains('code-field-input') || targetEl.id === 'codeEditor'))) {
        steps = [
          pickRandom(['Inspecting live code editor DOM...', 'Parsing active editor textarea...']),
          pickRandom(['Parsing syntax structure & unclosed brackets...', 'Evaluating code syntax balance...']),
          pickRandom(['Evaluating Socratic diagnostics...', 'Running live compiler check...']),
          pickRandom(synthesisOptions)
        ];
      }
      // Projects & Engineering Showcase
      else if (q.includes('project') || q.includes('byteloop') || q.includes('gramaseva') || q.includes('geargo') || q.includes('help') || q.includes('built')) {
        const projName = q.includes('byteloop') ? 'ByteLoop Studio' :
                         q.includes('gramaseva') ? 'Gramaseva Connect' :
                         q.includes('geargo') ? 'GearGo Rental' :
                         q.includes('help') ? 'HELP Crisis Platform' : 'Engineering Projects';
        steps = [
          pickRandom([`Scanning ${projName} element on page...`, `Inspecting ${projName} card on screen...`]),
          pickRandom(['Extracting platform telemetry & feature highlights...', 'Parsing project architecture & features...']),
          pickRandom(synthesisOptions)
        ];
      }
      // Academics & Records
      else if (q.includes('study') || q.includes('college') || q.includes('cgpa') || q.includes('academic') || q.includes('srkr') || q.includes('hall ticket') || q.includes('btech')) {
        steps = [
          pickRandom(['Locating Academics Hub records...', 'Scanning SGPA/CGPA record tables...']),
          pickRandom(['Extracting semester SGPA/CGPA & course notes...', 'Reading academic distinction records...']),
          pickRandom(synthesisOptions)
        ];
      }
      // Hometown & Background
      else if (q.includes('hometown') || q.includes('native') || q.includes('village') || q.includes('nellore') || q.includes('thimmareddypalem') || q.includes('from')) {
        steps = [
          pickRandom(['Locating hometown profile details...', 'Scanning candidate origin section...']),
          pickRandom(['Analyzing Nellore district & village background...', 'Reading Thimmareddypalem background info...']),
          pickRandom(synthesisOptions)
        ];
      }
      // Technical Stack & Achievements
      else if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('python') || q.includes('javascript') || q.includes('language') || q.includes('certif') || q.includes('achiev')) {
        steps = [
          pickRandom(['Scanning technical skills & achievements matrix...', 'Reading verified credentials & tech stack...']),
          pickRandom(['Categorizing core stack & system telemetry...', 'Evaluating Python, JS & Web architecture stack...']),
          pickRandom(synthesisOptions)
        ];
      }
      // Contact & Profile Credentials
      else if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('linkedin') || q.includes('github')) {
        steps = [
          pickRandom(['Locating contact profile elements...', 'Reading verified contact section...']),
          pickRandom(['Extracting verified email & network handles...', 'Retrieving email, LinkedIn & GitHub profiles...']),
          pickRandom(synthesisOptions)
        ];
      }
      // Target DOM element dynamic fallback
      else if (targetEl && targetEl !== document.body) {
        const elClass = (targetEl.className || targetEl.tagName || 'section').toString().split(' ')[0];
        steps = [
          `Inspecting <${elClass}> element on screen...`,
          pickRandom(['Analyzing section content & page context...', 'Extracting targeted DOM attributes...']),
          pickRandom(synthesisOptions)
        ];
      }
      // General & Search Fallback
      else {
        steps = [
          pickRandom(scanningOptions),
          pickRandom(['Querying AI Knowledge Engine...', 'Executing live context analysis...']),
          pickRandom(synthesisOptions)
        ];
      }

      // 50% random chance to dynamically inject an extra verification step into the sequence
      if (Math.random() > 0.45 && steps.length >= 3) {
        const randomExtraStep = pickRandom(verificationPool);
        steps.splice(1, 0, randomExtraStep);
      }

      return steps;
    }

    function sendUserMessage(userText) {
      if (isAiProcessing) return;
      setInputLockState(true);

      chatBody.insertAdjacentHTML('beforeend', `
        <div class="cogni-msg user">
          <div class="cogni-msg-bubble">${escapeHTML(userText)}</div>
        </div>
      `);
      chatBody.scrollTop = chatBody.scrollHeight;

      const trimmedQ = userText.trim().toLowerCase();
      const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|whats up|what's up|how are you|how r u|bye|thanks|thank you)(\s+|$|!|\?)/i.test(trimmedQ);

      let targetEl = null;
      if (!isGreeting) {
        targetEl = findTargetElementForQuery(userText);
        applyLiveSpotlight(targetEl);
      } else {
        removeLiveSpotlight();
      }

      const fullReply = generateAiResponse(userText, targetEl);
      recordConversationTurn(userText, fullReply);

      const dynamicSteps = generateDynamicExecutionSteps(userText, targetEl);

      const botMsgId = 'cogniBotMsg_' + Date.now();
      chatBody.insertAdjacentHTML('beforeend', `
        <div class="cogni-msg bot" id="${botMsgId}">
          <div class="cogni-msg-bubble">
            <div class="cogni-agent-step-status" style="font-size:12.5px;color:#ffffff;font-weight:500;margin-bottom:4px;display:flex;flex-direction:column;gap:6px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="cogni-agent-pulse-dot" style="width:7px;height:7px;"></span>
                <span class="cogni-step-status-text">${escapeHTML(dynamicSteps[0])}</span>
              </div>
              <div class="cogni-agent-progress-line"></div>
            </div>
            <span class="cogni-stream-body"></span>
          </div>
        </div>
      `);
      chatBody.scrollTop = chatBody.scrollHeight;

      const botMsgEl = document.getElementById(botMsgId);
      const streamBodyEl = botMsgEl ? botMsgEl.querySelector('.cogni-stream-body') : null;
      const stepStatusEl = botMsgEl ? botMsgEl.querySelector('.cogni-step-status-text') : null;
      const stepStatusWrap = botMsgEl ? botMsgEl.querySelector('.cogni-agent-step-status') : null;

      // Execute dynamic steps sequence smoothly
      let currentStepIdx = 0;
      updateAgentHudStep(dynamicSteps[0]);

      const stepDuration = 950; // ~0.95s per step

      function runNextDynamicStep() {
        currentStepIdx++;
        if (currentStepIdx < dynamicSteps.length) {
          const nextText = dynamicSteps[currentStepIdx];
          updateAgentHudStep(nextText);
          if (stepStatusEl) stepStatusEl.textContent = nextText;
          setTimeout(runNextDynamicStep, stepDuration);
        } else {
          // Dynamic steps complete -> fade step header and start character streaming
          if (stepStatusWrap) stepStatusWrap.remove();
          startStreaming();
        }
      }

      setTimeout(runNextDynamicStep, stepDuration);

      let charIndex = 0;
      let cursorEl = null;
      const streamSpeed = 12;

      function startStreaming() {
        const bubbleEl = botMsgEl ? botMsgEl.querySelector('.cogni-msg-bubble') : null;
        if (bubbleEl && !bubbleEl.querySelector('.cogni-typing-cursor')) {
          bubbleEl.insertAdjacentHTML('beforeend', `<span class="cogni-typing-cursor"></span>`);
          cursorEl = bubbleEl.querySelector('.cogni-typing-cursor');
        }
        typeNextChar();
      }

      function typeNextChar() {
        if (!streamBodyEl) {
          finishQueryExecution();
          return;
        }

        if (charIndex < fullReply.length) {
          if (fullReply[charIndex] === '<') {
            const closingAngleIdx = fullReply.indexOf('>', charIndex);
            if (closingAngleIdx !== -1) {
              charIndex = closingAngleIdx + 1;
            } else {
              charIndex++;
            }
          } else {
            charIndex++;
          }

          streamBodyEl.innerHTML = fullReply.slice(0, charIndex);
          chatBody.scrollTop = chatBody.scrollHeight;
          setTimeout(typeNextChar, streamSpeed);
        } else {
          finishQueryExecution();
        }
      }

      function finishQueryExecution() {
        if (cursorEl) cursorEl.remove();
        hideAgentHud();
        setTimeout(() => {
          removeLiveSpotlight();
          setInputLockState(false);
        }, 500);
      }
    }

    function getCurrentPageKey() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('academics')) return 'academics';
      if (path.includes('certificates')) return 'certificates';
      if (path.includes('admins')) return 'admins';
      if (path.includes('resume')) return 'resume';
      if (path.includes('ai-future')) return 'aifuture';
      return 'index';
    }

    // ==========================================================================
    // FRIENDLY PERSONAL AI ASSISTANT & CONCISE LIVE SCREEN ENGINE
    // ==========================================================================
    function getLivePageContext() {
      const pageKey = getCurrentPageKey();
      const pageTitle = document.title || 'Ramportfolio Page';
      const selectionText = window.getSelection ? window.getSelection().toString().trim() : '';

      const codeInputs = [];
      document.querySelectorAll('.code-field-input, #codeEditor, textarea:not(#askCognispherePillInput)').forEach(el => {
        const val = (el.value || el.innerText || '').trim();
        if (val) {
          codeInputs.push({
            id: el.id || el.className || 'code-input',
            content: val
          });
        }
      });

      const headings = [];
      document.querySelectorAll('h1, h2, h3, .step-heading, .lab-title-main, .brand-name, .resume-h, .resume-side-h').forEach(el => {
        const text = (el.innerText || el.textContent || '').trim();
        if (text && !headings.includes(text) && text.length < 80) {
          headings.push(text);
        }
      });

      return {
        pageKey,
        pageTitle,
        selectionText,
        codeInputs,
        headings
      };
    }

    function extractExactLiveText(el) {
      if (!el || el === document.body) {
        el = document.querySelector('.resume-sheet, .resume-inner, .page-wrap, .main-content-flow, main, article, section') || document.body;
      }
      if (!el) return '';

      if (el.tagName === 'TEXTAREA' || el.classList.contains('code-field-input') || el.id === 'codeEditor') {
        return (el.value || el.innerText || '').trim();
      }

      const textareaInside = el.querySelector('textarea:not(#askCognispherePillInput), .code-field-input, #codeEditor');
      if (textareaInside && (textareaInside.value || '').trim()) {
        return (textareaInside.value || '').trim();
      }

      if (el.tagName === 'TABLE' || el.querySelector('table')) {
        const table = el.tagName === 'TABLE' ? el : el.querySelector('table');
        const rows = table.querySelectorAll('tr');
        let tableOutput = [];
        rows.forEach((row) => {
          const cells = Array.from(row.querySelectorAll('th, td')).map(c => c.innerText.trim()).filter(Boolean);
          if (cells.length > 0) {
            tableOutput.push(cells.join(' — '));
          }
        });
        if (tableOutput.length > 0) return tableOutput.join('\n');
      }

      const clone = el.cloneNode(true);
      clone.querySelectorAll('script, style, nav, .ask-cognisphere-pill-wrap, .cogni-live-blur-overlay').forEach(n => n.remove());

      let text = (clone.innerText || clone.textContent || '').replace(/\r\n/g, '\n').replace(/\n\s*\n+/g, '\n').trim();
      return text;
    }

    function analyzeLiveCode(codeVal) {
      const issues = [];
      if (!codeVal || codeVal.trim().length === 0) {
        return { issues: ["No code found in the active editor."] };
      }

      let openParen = 0, openBrace = 0, openBracket = 0;
      for (let i = 0; i < codeVal.length; i++) {
        const ch = codeVal[i];
        if (ch === '(') openParen++;
        else if (ch === ')') openParen--;
        else if (ch === '{') openBrace++;
        else if (ch === '}') openBrace--;
        else if (ch === '[') openBracket++;
        else if (ch === ']') openBracket--;
        if (openParen < 0) { issues.push("Extra closing parenthesis ')' found."); openParen = 0; }
        if (openBrace < 0) { issues.push("Extra closing brace '}' found."); openBrace = 0; }
        if (openBracket < 0) { issues.push("Extra closing bracket ']' found."); openBracket = 0; }
      }
      if (openParen > 0) issues.push(`Missing ${openParen} closing parenthesis ')'`);
      if (openBrace > 0) issues.push(`Missing ${openBrace} closing brace '}'`);
      if (openBracket > 0) issues.push(`Missing ${openBracket} closing bracket ']'`);

      const singleQuotes = (codeVal.match(/'/g) || []).length;
      const doubleQuotes = (codeVal.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0) issues.push("Unclosed single quote (') detected.");
      if (doubleQuotes % 2 !== 0) issues.push("Unclosed double quote (\") detected.");

      return { issues };
    }

    function generateAiResponse(query, targetEl) {
      const q = query.toLowerCase().trim();
      const liveCtx = getLivePageContext();
      const prevTopic = getPreviousUserTopic();
      const rawLiveText = extractExactLiveText(targetEl);

      // 1. Casual Greetings & Friendly Chitchat (Platform & Out of Platform)
      if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|whats up|what's up|how are you|how r u)(\s+|$|!|\?)/i.test(q)) {
        return `Hey there! 😊 Great to chat with you! I'm Ask Cos AI — Abhiram's personal AI friend.<br><br>Feel free to ask me anything about Abhiram's studies, projects, technical skills, academic records, or any topic on or off this platform! What's on your mind?`;
      }

      if (/^(thanks|thank you|thx|cool|awesome|great|nice|bye|goodbye)(\s+|$|!|\?)/i.test(q)) {
        return `You're super welcome! 😊 Glad I could help! Let me know anytime if you want to chat or explore more. Have an awesome day!`;
      }

      // 2. Highlighted Text Read
      if (liveCtx.selectionText && liveCtx.selectionText.length > 2) {
        return `Hey! 😊 Here is the text snippet you highlighted live on screen:<br><br>` +
          `<blockquote style="border-left:3px solid #60a5fa;padding-left:10px;margin:6px 0;color:#e2e8f0;font-style:italic;">"${escapeHTML(liveCtx.selectionText)}"</blockquote><br>` +
          `How can I assist you with this specific detail?`;
      }

      // 3. Live Code & Syntax Diagnostics
      if (q.includes('code') || q.includes('error') || q.includes('debug') || q.includes('syntax') || (targetEl && (targetEl.tagName === 'TEXTAREA' || targetEl.querySelector('textarea, .code-field-input, #codeEditor')))) {
        const codeVal = (targetEl ? (targetEl.value || targetEl.querySelector('textarea, .code-field-input, #codeEditor')?.value) : '') || rawLiveText;
        if (codeVal) {
          const analysis = analyzeLiveCode(codeVal);
          let codeReply = `💻 Live Code Check:<br><br>`;
          if (analysis.issues.length > 0) {
            codeReply += `Syntax issues found:<br>`;
            analysis.issues.forEach(iss => { codeReply += `• <strong>${escapeHTML(iss)}</strong><br>`; });
          } else {
            codeReply += `Your syntax is completely clean! No unclosed brackets, missing quotes, or syntax mismatches detected.`;
          }
          return codeReply;
        }
      }

      // 4. Exact Ground-Truth Fact Answers (Education, Hometown, Bio, Specific Details)

      // --- Where does he study? (Education / College / Degree) ---
      if (q.includes('study') || q.includes('studying') || q.includes('college') || q.includes('university') || q.includes('school') || q.includes('edu') || q.includes('btech') || q.includes('branch') || q.includes('srkr') || q.includes('cgpa') || q.includes('academic')) {
        return `Abhiram is studying <strong>B.Tech in Information Technology</strong> at <strong>SRKR Engineering College, Bhimavaram</strong> (West Godavari District, Andhra Pradesh)! 🎓<br><br>` +
          `• <strong>Institution:</strong> SRKR Engineering College, Bhimavaram<br>` +
          `• <strong>Degree & Branch:</strong> B.Tech in Information Technology<br>` +
          `• <strong>Academic Record:</strong> 9.0+ CGPA (Distinction)<br>` +
          `• <strong>Hometown:</strong> Thimmareddypalem village, Lingasamudram Mandal, Nellore District, AP.`;
      }

      // --- Hometown / Origin / Location ---
      if (q.includes('hometown') || q.includes('native') || q.includes('village') || q.includes('from') || q.includes('location') || q.includes('nellore') || q.includes('thimmareddypalem') || q.includes('where is he')) {
        return `Abhiram comes from <strong>Thimmareddypalem village</strong> in <em>Lingasamudram Mandal, Nellore District, Andhra Pradesh</em>! 📍<br><br>` +
          `He is currently pursuing his B.Tech in Information Technology at <strong>SRKR Engineering College, Bhimavaram</strong>.`;
      }

      // --- Achievements & Awards ---
      if (q.includes('achiev') || q.includes('certif') || q.includes('credential') || q.includes('award') || q.includes('verified') || q.includes('udbhav') || q.includes('hackathon')) {
        return `Abhiram's verified achievements and credentials: 🏆<br><br>` +
          `1. <strong>UDBHAV 2K26</strong> — National Level Hackathon Participant & Award Winner.<br>` +
          `2. <strong>Python & Data Structures Certification</strong> — Problem solving & algorithm design.<br>` +
          `3. <strong>Full-Stack Web Development</strong> — HTML5, CSS3, JS & REST APIs.<br>` +
          `4. <strong>AI Platform Integration & Telemetry</strong> — Building live AI tools like Ask Cos AI and CogniCoder.`;
      }

      // --- Projects Breakdown ---
      if (q.includes('project') || q.includes('built') || q.includes('work') || q.includes('byteloop') || q.includes('gramaseva') || q.includes('geargo') || q.includes('help')) {
        if (q.includes('byteloop')) {
          return `<strong>ByteLoop Studio</strong> is one of Abhiram's key engineering platforms! 🚀<br><br>` +
            `It tracks leftover mobile internet data on your phone and converts it to redeemable credits before it expires.`;
        }
        if (q.includes('gramaseva')) {
          return `<strong>Gramaseva Connect</strong> is a discoverability platform Abhiram created for skilled rural and urban workers. 🛠️<br><br>` +
            `It directly connects local plumbers, electricians, masons, and farmers with clients outside metro hubs.`;
        }
        if (q.includes('geargo')) {
          return `<strong>GearGo Rental</strong> is a peer-to-peer equipment sharing platform designed by Abhiram for students. 📦<br><br>` +
            `It lets students rent tools, lab instruments, and study gear from each other affordably on campus.`;
        }
        if (q.includes('help')) {
          return `<strong>HELP (Human Emergency Life Provider)</strong> is a rapid-response platform Abhiram designed to connect people in crisis with nearby emergency helpers in real time. 🆘`;
        }

        return `Abhiram's key engineering projects: ⚡<br><br>` +
          `1. <strong>HELP</strong>: Human Emergency Life Provider.<br>` +
          `2. <strong>ByteLoop Studio</strong>: Unused mobile data converted to credits.<br>` +
          `3. <strong>Gramaseva Connect</strong>: Discoverability platform for skilled workers.<br>` +
          `4. <strong>GearGo Rental</strong>: Peer-to-peer equipment sharing.<br>` +
          `5. <strong>Academics Hub</strong>: CGPA, course records & exam schedules.`;
      }

      // --- Technical Skills ---
      if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
        return `Abhiram's core technical stack: 🛠️<br><br>` +
          `• <strong>Languages:</strong> Python, JavaScript, HTML5, CSS3, SQL<br>` +
          `• <strong>Architecture:</strong> Web App Design, System Telemetry, REST APIs<br>` +
          `• <strong>AI/ML:</strong> AI Integrations & Automated Diagnostic Systems`;
      }

      // --- Who is Abhiram / Candidate Bio ---
      if (q.includes('who') || q.includes('abhiram') || q.includes('bio') || q.includes('candidate') || q.includes('profile')) {
        return `<strong>Kummitha Abhiram Reddy</strong> is an IT student at SRKR Engineering College, Bhimavaram, hailing from <em>Thimmareddypalem village</em> in Nellore district, AP.<br><br>` +
          `He builds practical, human-centered engineering products (like HELP, ByteLoop, Gramaseva, and GearGo) for everyday people outside the metro bubble. 😊`;
      }

      // --- Contact Info ---
      if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('linkedin') || q.includes('github') || q.includes('phone')) {
        return `Direct contact info for Abhiram: ✉️<br><br>` +
          `• <strong>Email:</strong> <a href='mailto:kummitaabhiramreddy@gmail.com' style='color:#60a5fa;'>kummitaabhiramreddy@gmail.com</a><br>` +
          `• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/abhiramreddy-kummitha-379b49397/' target='_blank' style='color:#60a5fa;'>LinkedIn Profile</a><br>` +
          `• <strong>GitHub:</strong> <a href='https://github.com/kummithaabhiramreddy' target='_blank' style='color:#60a5fa;'>GitHub Profile</a>`;
      }

      // 5. Intelligent Concept Explanations & Google/AI Knowledge (Inside & Outside Platform)
      if (q.includes('bhimavaram')) {
        return `<strong>Bhimavaram</strong> is a prominent commercial and educational city in West Godavari District, Andhra Pradesh, India. 🏙️<br><br>` +
          `It is known as an educational center (home to <strong>SRKR Engineering College</strong>, where Abhiram studies IT) and is celebrated as the aquaculture hub of AP!`;
      }
      if (q.includes('nellore')) {
        return `<strong>Nellore</strong> is a coastal city in Andhra Pradesh, India, known for its rich agriculture, aquaculture, and cultural heritage. Abhiram's native village <em>Thimmareddypalem</em> is located in Lingasamudram Mandal of Nellore District. 📍`;
      }
      if (q.includes('python')) {
        return `<strong>Python</strong> is a versatile, high-level programming language widely used for Web Development, AI/ML, Data Science, and Automation. On this portfolio, Abhiram uses Python for core algorithms, data structures, and AI diagnostic platforms! 🐍`;
      }
      if (q.includes('javascript') || q.includes('js')) {
        return `<strong>JavaScript</strong> is the primary programming language of the web, powering dynamic user interfaces, interactive web apps, and real-time client engines. ⚡`;
      }
      if (q.includes('rest api') || q.includes('api')) {
        return `A <strong>REST API</strong> allows web applications to exchange data securely over HTTP. Abhiram uses REST APIs for full-stack data transfer and system telemetry. 🌐`;
      }

      // Mood / Emotional & Personal Feeling Expressions
      if (q.includes('mood') || q.includes('sad') || q.includes('tired') || q.includes('upset') || q.includes('bored') || q.includes('stress') || q.includes('depress') || q.includes('angry')) {
        return `I hear you! 💙 Take a deep breath and take a little break if you need to. I'm right here as your AI buddy if you want to chat, explore some cool engineering projects Abhiram built, or talk about anything on your mind! 😊`;
      }

      // Natural Conversational AI Fallback (No Static Robotic Debug Templates)
      return `I hear you! 😊 I am <strong>Ask Cos AI</strong> — Abhiram Reddy's personal AI assistant.<br><br>` +
        `I can help you explore Abhiram's engineering projects (ByteLoop, Gramaseva, GearGo, HELP), academic records (SRKR IT B.Tech), technical skills, or answer questions about programming and AI.<br><br>` +
        `Feel free to ask me anything specific!`;
    }

    function escapeHTML(str) {
      if (!str) return '';
      return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPill);
  } else {
    initPill();
  }
})();

