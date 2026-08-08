// =================================================================
// 🎂 HAPPY BIRTHDAY WEBSITE INTERACTIVE SCRIPT
// Handles impossible NO button game, confetti engine, cake mic blowing,
// Web Audio synthesizer, wishes slider, gift modals, and customizer.
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  // State Variables
  let currentConfig = JSON.parse(JSON.stringify(CONFIG));
  let noAttempts = 0;
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicInterval = null;
  let currentWishIndex = 0;
  let activeCandles = 4;
  let micAnalyser = null;
  let micStream = null;
  let isMicActive = false;

  // Check localStorage for saved custom config
  const savedConfig = localStorage.getItem('hbd_custom_config');
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig);
      currentConfig = { ...currentConfig, ...parsed };
    } catch (e) {
      console.warn("Could not parse saved config", e);
    }
  }

  // Initial UI Render
  initUI();
  initAmbientBackground();
  initConfettiCanvas();

  // =================================================================
  // 1. UI INITIALIZATION & RENDER
  // =================================================================
  function initUI() {
    document.title = currentConfig.titleTag || `Happy Birthday ${currentConfig.name}! 🎉`;
    document.getElementById('hero-person-name').textContent = currentConfig.name;
    document.getElementById('footer-person-name').textContent = currentConfig.name;
    document.getElementById('game-question-text').textContent = currentConfig.game.question;
    document.getElementById('btn-yes-text').textContent = currentConfig.game.yesButtonText;
    document.getElementById('btn-no-text').textContent = currentConfig.game.noButtonText;

    // Fill Customizer Form values
    document.getElementById('input-name').value = currentConfig.name;
    document.getElementById('input-question').value = currentConfig.game.question;
    document.getElementById('input-wish-message').value = currentConfig.secretCakeWish;

    renderCandles();
    renderWishesSlider();
    renderGiftBoxes();
    renderPolaroidGallery();
  }

  // =================================================================
  // 2. STAGE 1: THE IMPOSSIBLE "NO" BUTTON GAME
  // =================================================================
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const btnNoText = document.getElementById('btn-no-text');
  const gameButtonsArea = document.getElementById('game-buttons-area');

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    noAttempts++;

    // Random evasion coordinates
    const areaRect = gameButtonsArea.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Ensure button stays within visible bounds
    const maxX = Math.min(window.innerWidth - btnRect.width - 20, areaRect.width + 150);
    const maxY = Math.min(window.innerHeight - btnRect.height - 20, 200);

    const randomX = (Math.random() - 0.5) * maxX;
    const randomY = (Math.random() - 0.5) * maxY;

    btnNo.style.position = 'relative';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;

    // Change evasive button message
    const msgList = currentConfig.game.noButtonMessages;
    const nextMsg = msgList[noAttempts % msgList.length];
    btnNoText.textContent = nextMsg;

    // Shrink NO button & Grow YES button
    const noScale = Math.max(0.4, 1 - noAttempts * 0.08);
    const yesScale = Math.min(2.0, 1 + noAttempts * 0.12);

    btnNo.style.transform = `scale(${noScale})`;
    btnYes.style.transform = `scale(${yesScale})`;
  }

  // Desktop hover, mobile touch & click events
  btnNo.addEventListener('mouseenter', dodgeNoButton);
  btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
  btnNo.addEventListener('click', dodgeNoButton);

  // YES Button Click -> Explode Confetti & Move to Stage 2
  btnYes.addEventListener('click', () => {
    fireConfettiBurst();
    playSuccessSound();

    // Smooth stage transition
    const stageGame = document.getElementById('stage-game');
    const stageHub = document.getElementById('stage-hub');

    stageGame.classList.remove('active');
    setTimeout(() => {
      stageGame.style.display = 'none';
      stageHub.style.display = 'block';
      setTimeout(() => {
        stageHub.classList.add('active');
        // Start ambient confetti celebrate
        startCelebrationConfetti();
        if (!isMusicPlaying) toggleMusic();
      }, 50);
    }, 500);
  });

  // =================================================================
  // 3. INTERACTIVE CAKE & CANDLE BLOWING
  // =================================================================
  const candlesRow = document.getElementById('candles-row');
  const blowMicBtn = document.getElementById('blow-mic-btn');
  const resetCandlesBtn = document.getElementById('reset-candles-btn');
  const micStatus = document.getElementById('mic-status');
  const wishBanner = document.getElementById('cake-wish-banner');

  function renderCandles() {
    candlesRow.innerHTML = '';
    activeCandles = 4;
    wishBanner.classList.add('hidden');

    for (let i = 0; i < 4; i++) {
      const candle = document.createElement('div');
      candle.className = 'candle';
      candle.innerHTML = `
        <div class="candle-wick"></div>
        <div class="flame"></div>
      `;
      candle.addEventListener('click', () => blowOutCandle(candle));
      candlesRow.appendChild(candle);
    }
  }

  function blowOutCandle(candle) {
    if (!candle.classList.contains('blown-out')) {
      candle.classList.add('blown-out');
      activeCandles--;
      playPuffSound();

      if (activeCandles === 0) {
        onAllCandlesBlown();
      }
    }
  }

  function onAllCandlesBlown() {
    fireConfettiBurst();
    playSuccessSound();
    document.getElementById('cake-wish-text').textContent = currentConfig.secretCakeWish;
    wishBanner.classList.remove('hidden');
  }

  resetCandlesBtn.addEventListener('click', () => {
    renderCandles();
  });

  // Microphone Blowing Detection
  blowMicBtn.addEventListener('click', async () => {
    if (isMicActive) return;

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      micAnalyser = audioCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      isMicActive = true;
      blowMicBtn.disabled = true;
      blowMicBtn.textContent = "🎤 Listening for blow...";
      micStatus.textContent = "💨 Blow closely into your microphone now!";

      detectBlowLoop();
    } catch (err) {
      console.warn("Mic access denied or unavailable", err);
      micStatus.textContent = "⚠️ Mic access denied. You can tap candles to blow them out!";
    }
  });

  function detectBlowLoop() {
    if (!isMicActive || activeCandles === 0) return;

    const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
    micAnalyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // Threshold for detecting wind/blowing sound
    if (average > 45) {
      const candles = document.querySelectorAll('.candle:not(.blown-out)');
      candles.forEach(c => blowOutCandle(c));
      micStatus.textContent = "✨ Great blow! All candles extinguished!";
    } else {
      requestAnimationFrame(detectBlowLoop);
    }
  }

  // =================================================================
  // 4. WISHES SLIDER
  // =================================================================
  const sliderTrack = document.getElementById('slider-track');
  const sliderDots = document.getElementById('slider-dots');
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');

  function renderWishesSlider() {
    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';

    currentConfig.wishes.forEach((wish, index) => {
      // Wish Card
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-icon">${wish.icon}</div>
        <h3 class="wish-title">${wish.title}</h3>
        <p class="wish-text">${wish.text}</p>
      `;
      sliderTrack.appendChild(card);

      // Dot Indicator
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      sliderDots.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentWishIndex = index;
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;
    
    document.querySelectorAll('.slider-dots .dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  sliderPrev.addEventListener('click', () => {
    const newIdx = (currentWishIndex - 1 + currentConfig.wishes.length) % currentConfig.wishes.length;
    goToSlide(newIdx);
  });

  sliderNext.addEventListener('click', () => {
    const newIdx = (currentWishIndex + 1) % currentConfig.wishes.length;
    goToSlide(newIdx);
  });

  // Auto slide every 6 seconds
  setInterval(() => {
    if (document.getElementById('stage-hub').classList.contains('active')) {
      const newIdx = (currentWishIndex + 1) % currentConfig.wishes.length;
      goToSlide(newIdx);
    }
  }, 6000);

  // =================================================================
  // 5. INTERACTIVE SURPRISE GIFT BOXES
  // =================================================================
  const giftsGrid = document.getElementById('gifts-grid');
  const giftModal = document.getElementById('gift-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  function renderGiftBoxes() {
    giftsGrid.innerHTML = '';

    currentConfig.gifts.forEach(gift => {
      const box = document.createElement('div');
      box.className = 'gift-box-card';
      box.innerHTML = `
        <span class="gift-emoji">🎁</span>
        <div class="gift-label">${gift.boxLabel}</div>
      `;
      box.addEventListener('click', () => openGiftModal(gift));
      giftsGrid.appendChild(box);
    });
  }

  function openGiftModal(gift) {
    fireConfettiBurst();
    playSuccessSound();

    modalTitle.textContent = gift.title;
    modalBody.textContent = gift.content;
    giftModal.classList.remove('hidden');
  }

  modalClose.addEventListener('click', () => giftModal.classList.add('hidden'));
  modalOkBtn.addEventListener('click', () => giftModal.classList.add('hidden'));
  giftModal.addEventListener('click', (e) => {
    if (e.target === giftModal) giftModal.classList.add('hidden');
  });

  // =================================================================
  // 6. POLAROID MEMORY GALLERY
  // =================================================================
  function renderPolaroidGallery() {
    const polaroidGrid = document.getElementById('polaroid-grid');
    polaroidGrid.innerHTML = '';

    currentConfig.photos.forEach((photo, idx) => {
      const rotation = (idx % 2 === 0 ? 1 : -1) * (3 + Math.random() * 3);
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.style.setProperty('--rotation', rotation.toFixed(1));
      card.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption}" class="polaroid-img" loading="lazy">
        <div class="polaroid-caption">${photo.caption}</div>
      `;
      polaroidGrid.appendChild(card);
    });
  }

  // =================================================================
  // 7. WEB AUDIO SYNTHESIZER (HAPPY BIRTHDAY MELODY)
  // =================================================================
  const musicBtn = document.getElementById('music-btn');

  musicBtn.addEventListener('click', toggleMusic);

  function toggleMusic() {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  function startMusic() {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isMusicPlaying = true;
    musicBtn.querySelector('.btn-icon').textContent = '🎶';
    musicBtn.querySelector('.btn-text').textContent = 'Music On';

    playTuneSequence();
  }

  function stopMusic() {
    isMusicPlaying = false;
    if (musicInterval) clearInterval(musicInterval);
    musicBtn.querySelector('.btn-icon').textContent = '🎵';
    musicBtn.querySelector('.btn-text').textContent = 'Music Off';
  }

  // Happy Birthday Chords Notes (Freq in Hz)
  const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25
  };

  const MELODY = [
    { note: NOTES.C4, duration: 300 }, { note: NOTES.C4, duration: 300 },
    { note: NOTES.D4, duration: 600 }, { note: NOTES.C4, duration: 600 },
    { note: NOTES.F4, duration: 600 }, { note: NOTES.E4, duration: 1200 },
    
    { note: NOTES.C4, duration: 300 }, { note: NOTES.C4, duration: 300 },
    { note: NOTES.D4, duration: 600 }, { note: NOTES.C4, duration: 600 },
    { note: NOTES.G4, duration: 600 }, { note: NOTES.F4, duration: 1200 },

    { note: NOTES.C4, duration: 300 }, { note: NOTES.C4, duration: 300 },
    { note: NOTES.C5, duration: 600 }, { note: NOTES.A4, duration: 600 },
    { note: NOTES.F4, duration: 600 }, { note: NOTES.E4, duration: 600 },
    { note: NOTES.D4, duration: 1200 }
  ];

  function playTuneSequence() {
    let noteIdx = 0;

    function nextNote() {
      if (!isMusicPlaying) return;

      const item = MELODY[noteIdx];
      playTone(item.note, item.duration / 1000);

      noteIdx = (noteIdx + 1) % MELODY.length;
      musicInterval = setTimeout(nextNote, item.duration + 100);
    }

    nextNote();
  }

  function playTone(freq, duration) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback issue", e);
    }
  }

  function playSuccessSound() {
    playTone(523.25, 0.3);
    setTimeout(() => playTone(659.25, 0.4), 150);
  }

  function playPuffSound() {
    playTone(180, 0.15);
  }

  // =================================================================
  // 8. CANVAS CONFETTI CANNON ENGINE
  // =================================================================
  let canvas, ctx;
  let confettiParticles = [];

  function initConfettiCanvas() {
    canvas = document.getElementById('confetti-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(renderConfetti);
  }

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  function fireConfettiBurst() {
    const colors = ['#ff758c', '#ff7eb3', '#6c5ce7', '#a29bfe', '#ffeaa7', '#55efc4'];
    for (let i = 0; i < 90; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 20,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }
  }

  function startCelebrationConfetti() {
    fireConfettiBurst();
    setTimeout(fireConfettiBurst, 800);
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // Gravity
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.opacity <= 0 || p.y > canvas.height) {
        confettiParticles.splice(index, 1);
      }
    });

    requestAnimationFrame(renderConfetti);
  }

  // =================================================================
  // 9. AMBIENT FLOATING ELEMENTS (HEARTS & STARS)
  // =================================================================
  function initAmbientBackground() {
    const ambientBg = document.getElementById('ambient-bg');
    const symbols = ['💖', '✨', '🎈', '⭐', '🌸', '🎁'];

    for (let i = 0; i < 20; i++) {
      const item = document.createElement('div');
      item.className = 'floating-item';
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = `${Math.random() * 100}%`;
      item.style.animationDelay = `${Math.random() * 10}s`;
      item.style.animationDuration = `${8 + Math.random() * 8}s`;
      ambientBg.appendChild(item);
    }
  }

  // =================================================================
  // 10. CUSTOMIZER & SHARE FUNCTIONALITY
  // =================================================================
  const customizeBtn = document.getElementById('customize-btn');
  const customizeModal = document.getElementById('customize-modal');
  const customizerClose = document.getElementById('customizer-close');
  const customizerForm = document.getElementById('customizer-form');
  const btnResetDefault = document.getElementById('btn-reset-default');
  const shareBtn = document.getElementById('share-btn');

  customizeBtn.addEventListener('click', () => {
    customizeModal.classList.remove('hidden');
  });

  customizerClose.addEventListener('click', () => {
    customizeModal.classList.add('hidden');
  });

  customizerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('input-name').value.trim();
    const newQuestion = document.getElementById('input-question').value.trim();
    const newWishMsg = document.getElementById('input-wish-message').value.trim();

    if (newName) currentConfig.name = newName;
    if (newQuestion) currentConfig.game.question = newQuestion;
    if (newWishMsg) currentConfig.secretCakeWish = newWishMsg;

    localStorage.setItem('hbd_custom_config', JSON.stringify(currentConfig));
    initUI();
    customizeModal.classList.add('hidden');
    fireConfettiBurst();
  });

  btnResetDefault.addEventListener('click', () => {
    localStorage.removeItem('hbd_custom_config');
    currentConfig = JSON.parse(JSON.stringify(CONFIG));
    initUI();
    customizeModal.classList.add('hidden');
  });

  shareBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      shareBtn.textContent = '✅ Link Copied to Clipboard!';
      setTimeout(() => {
        shareBtn.textContent = '🔗 Copy Shareable Link';
      }, 3000);
    });
  });
});
