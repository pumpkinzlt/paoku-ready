(() => {
  'use strict';

  const LEGACY_STORAGE_KEY = 'neonRunRivalsSave_v1';
  const GUEST_STORAGE_KEY = 'neonRunRivalsGuestSave_v1';
  const STORAGE_PREFIX = 'neonRunRivalsSave_v2_';
  const ACCOUNTS_KEY = 'neonRunRivalsAccounts_v1';
  const SESSION_KEY = 'neonRunRivalsSession_v1';
  const TODAY = new Date().toISOString().slice(0, 10);

  const COIN_PACKS = [
    { id: 'starter', name: 'Starter Pack', price: '$0.99', coins: 100 },
    { id: 'mini', name: 'Mini Pack', price: '$2.99', coins: 350 },
    { id: 'popular', name: 'Popular Pack', price: '$4.99', coins: 650 },
    { id: 'best', name: 'Best Value Pack', price: '$9.99', coins: 1400 },
    { id: 'pro', name: 'Pro Pack', price: '$19.99', coins: 3000 },
    { id: 'mega', name: 'Mega Pack', price: '$49.99', coins: 8000 }
  ];

  const BUNDLES = [
    {
      id: 'starterDash',
      name: 'Dash Starter Bundle',
      badge: 'Best Starter Deal',
      price: '$0.99',
      coins: 300,
      items: { shield: 2, speedBoost: 2, revive: 1 },
      skin: 'sunset',
      desc: 'A beginner-friendly pack built for longer runs and first ship unlock.'
    },
    {
      id: 'rivalRush',
      name: 'Rival Rush Bundle',
      badge: 'Popular',
      price: '$4.99',
      coins: 900,
      items: { magnet: 3, doubleCoins: 3, speedBoost: 3, revive: 2 },
      skin: 'mint',
      desc: 'More coins, more boosts, and stronger comeback power for Arena runs.'
    },
    {
      id: 'championVault',
      name: 'Champion Vault',
      badge: 'Best Value',
      price: '$9.99',
      coins: 2200,
      items: { shield: 5, magnet: 5, doubleCoins: 5, bomb: 3, speedBoost: 5, revive: 4 },
      skin: 'royal',
      desc: 'Premium unlock path for players chasing levels, rivals, and high scores.'
    }
  ];

  const ITEMS = {
    shield: {
      name: 'Shield', icon: '🛡️', cost: 140, duration: 9, cooldown: 11,
      desc: 'Blocks one crash during the active window.'
    },
    magnet: {
      name: 'Magnet', icon: '🧲', cost: 120, duration: 10, cooldown: 12,
      desc: 'Pulls nearby coins toward your runner.'
    },
    doubleCoins: {
      name: 'Double Coins', icon: '✨', cost: 170, duration: 12, cooldown: 16,
      desc: 'Doubles all coins collected for a short time.'
    },
    bomb: {
      name: 'Bomb', icon: '💣', cost: 190, duration: 0.2, cooldown: 13,
      desc: 'Clears visible obstacles and grants safety space.'
    },
    speedBoost: {
      name: 'Speed Boost', icon: '⚡', cost: 130, duration: 4.5, cooldown: 10,
      desc: 'Dash faster and earn score more quickly.'
    },
    revive: {
      name: 'Revive', icon: '💚', cost: 260, duration: 0, cooldown: 0,
      desc: 'Automatically revives you once after a crash.'
    }
  };

  const ITEM_HOTKEYS = {
    Digit1: 'shield',
    Digit2: 'magnet',
    Digit3: 'doubleCoins',
    Digit4: 'bomb',
    Digit5: 'speedBoost',
    Digit6: 'revive'
  };

  const UPGRADES = {
    engine: {
      name: 'Engine Core', icon: '🚀', max: 5, baseCost: 180,
      desc: 'Extends boost duration and makes acceleration feel stronger.'
    },
    magnetRange: {
      name: 'Magnet Field', icon: '🧲', max: 5, baseCost: 160,
      desc: 'Pulls coins from a wider range while Magnet is active.'
    },
    shieldDuration: {
      name: 'Shield Matrix', icon: '🛡️', max: 5, baseCost: 170,
      desc: 'Extends shield time and makes defensive runs easier.'
    },
    coinBonus: {
      name: 'Coin Reactor', icon: '💠', max: 5, baseCost: 220,
      desc: 'Adds a permanent coin bonus to every coin collected.'
    },
    reviveDiscount: {
      name: 'Second-Wind Chip', icon: '💚', max: 3, baseCost: 260,
      desc: 'Reduces coin cost when continuing after Game Over.'
    }
  };

  const SKINS = [
    { id: 'default', name: 'Rookie Shuttle', rarity: 'Free', cost: 0, model: 'shuttle', colors: ['#38e8ff', '#866bff', '#ffffff'], desc: 'Balanced starter shuttle with clean neon lights.' },
    { id: 'sunset', name: 'Neon Falcon', rarity: 'Rare', cost: 450, model: 'falcon', colors: ['#ffb347', '#ff4f81', '#fff1ad'], desc: 'Sharp wing fighter with brighter boost trails.' },
    { id: 'mint', name: 'Galaxy Ray', rarity: 'Rare', cost: 650, model: 'ray', colors: ['#5cffaa', '#2dd7ff', '#effff7'], desc: 'Wide glider silhouette with smooth alien curves.' },
    { id: 'royal', name: 'Cyber Dragon', rarity: 'Epic', cost: 950, model: 'dragon', colors: ['#b38cff', '#4e2cff', '#ffe177'], desc: 'Aggressive combat ship built for high-score chasers.' },
    { id: 'shadow', name: 'Dark UFO', rarity: 'Epic', cost: 1300, model: 'ufo', colors: ['#202a3f', '#ff4fd8', '#38e8ff'], desc: 'Circular stealth craft with a glowing alien core.' },
    { id: 'gold', name: 'Golden Comet', rarity: 'Legendary', cost: 1900, model: 'comet', colors: ['#ffd166', '#ff8d3b', '#fff9dd'], desc: 'Legendary trophy ship with premium gold glow.' }
  ];

  const LEVELS = [
    { level: 1, goal: 800, coins: 12, stars: [800, 1200, 1700] },
    { level: 2, goal: 1200, coins: 16, stars: [1200, 1700, 2300] },
    { level: 3, goal: 1700, coins: 20, stars: [1700, 2300, 3100] },
    { level: 4, goal: 2300, coins: 24, stars: [2300, 3100, 4200] },
    { level: 5, goal: 3100, coins: 30, stars: [3100, 4200, 5600] },
    { level: 6, goal: 4200, coins: 36, stars: [4200, 5600, 7200] }
  ];

  const AI_NAMES = ['Nova', 'DashFox', 'Milo', 'Kira', 'Bolt', 'PixelBee', 'Jett', 'Luna'];

  const MODE_RULES = {
    classic: {
      title: 'Classic Mode',
      hud: 'Classic · Endless high-score run',
      scoreMul: 1.00,
      speedMul: 1.00,
      spawnMul: 1.00,
      coinMul: 1.05,
      brief: 'Endless Orion highway. Stable rhythm, fair lanes, and pure best-score chasing.'
    },
    arena: {
      title: 'Arena Mode',
      hud: 'Arena · Rival race',
      scoreMul: 1.10,
      speedMul: 1.08,
      spawnMul: 1.24,
      coinMul: 0.88,
      brief: 'Live rival race. Overtake pilots, dodge aggressive hazards, and climb the rank board.'
    },
    level: {
      title: 'Level Mode',
      hud: 'Level Mission',
      scoreMul: 0.92,
      speedMul: 0.94,
      spawnMul: 0.86,
      coinMul: 1.35,
      brief: 'Mission sector. Complete the score goal and collect target coins to clear the level.'
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const dom = {
    screens: $$('.screen'),
    authScreen: $('#authScreen'),
    authTabs: $$('.auth-tab'),
    loginForm: $('#loginForm'),
    registerForm: $('#registerForm'),
    loginUsername: $('#loginUsername'),
    loginPassword: $('#loginPassword'),
    registerUsername: $('#registerUsername'),
    registerPassword: $('#registerPassword'),
    registerConfirmPassword: $('#registerConfirmPassword'),
    authMessage: $('#authMessage'),
    guestPlayBtn: $('#guestPlayBtn'),
    accountPrefix: $('#accountPrefix'),
    currentAccountName: $('#currentAccountName'),
    logoutBtn: $('#logoutBtn'),
    logoutSettingsBtn: $('#logoutSettingsBtn'),
    startScreen: $('#startScreen'),
    modeScreen: $('#modeScreen'),
    gameScreen: $('#gameScreen'),
    shopScreen: $('#shopScreen'),
    leaderboardScreen: $('#leaderboardScreen'),
    settingsScreen: $('#settingsScreen'),
    playerNameInput: $('#playerNameInput'),
    startBtn: $('#startBtn'),
    modeBtn: $('#modeBtn'),
    shopBtn: $('#shopBtn'),
    leaderboardBtn: $('#leaderboardBtn'),
    settingsBtn: $('#settingsBtn'),
    startSelectedModeBtn: $('#startSelectedModeBtn'),
    levelSelect: $('#levelSelect'),
    dailyRewardCard: $('#dailyRewardCard'),
    dailyRewardText: $('#dailyRewardText'),
    claimDailyBtn: $('#claimDailyBtn'),
    guestModeNote: $('#guestModeNote'),
    canvas: $('#gameCanvas'),
    scoreHud: $('#scoreHud'),
    bestHud: $('#bestHud'),
    coinsHud: $('#coinsHud'),
    modeHud: $('#modeHud'),
    sectorHud: $('#sectorHud'),
    pauseBtn: $('#pauseBtn'),
    gameHomeBtn: $('#gameHomeBtn'),
    pauseOverlay: $('#pauseOverlay'),
    resumeBtn: $('#resumeBtn'),
    restartPauseBtn: $('#restartPauseBtn'),
    homePauseBtn: $('#homePauseBtn'),
    gameOverOverlay: $('#gameOverOverlay'),
    overScore: $('#overScore'),
    overBest: $('#overBest'),
    overCoins: $('#overCoins'),
    overStars: $('#overStars'),
    overGoalCard: $('#overGoalCard'),
    overGoalLabel: $('#overGoalLabel'),
    overGoalGap: $('#overGoalGap'),
    overGoalFill: $('#overGoalFill'),
    overGoalReward: $('#overGoalReward'),
    continueCard: $('#continueCard'),
    continueRunBtn: $('#continueRunBtn'),
    continueTitle: $('#continueTitle'),
    continueDesc: $('#continueDesc'),
    overTip: $('#overTip'),
    nextGoalText: $('#nextGoalText'),
    nextGoalReward: $('#nextGoalReward'),
    restartBtn: $('#restartBtn'),
    homeBtn: $('#homeBtn'),
    itemDock: $('#itemDock'),
    mobileItemsToggle: $('#mobileItemsToggle'),
    miniLeaderboard: $('#miniLeaderboard'),
    mobileSkillBtn: $('#mobileSkillBtn'),
    onboardingToast: $('#onboardingToast'),
    onboardingIcon: $('#onboardingIcon'),
    onboardingTitle: $('#onboardingTitle'),
    onboardingText: $('#onboardingText'),
    onboardingClose: $('#onboardingClose'),
    shopCoins: $('#shopCoins'),
    shopContent: $('#shopContent'),
    paymentCheckoutOverlay: $('#paymentCheckoutOverlay'),
    checkoutProductName: $('#checkoutProductName'),
    checkoutProductDesc: $('#checkoutProductDesc'),
    checkoutAmount: $('#checkoutAmount'),
    checkoutEmail: $('#checkoutEmail'),
    checkoutStatus: $('#checkoutStatus'),
    checkoutCancelBtn: $('#checkoutCancelBtn'),
    leaderboardList: $('#leaderboardList'),
    musicToggle: $('#musicToggle'),
    flightSoundToggle: $('#flightSoundToggle'),
    sfxToggle: $('#sfxToggle'),
    resetDataBtn: $('#resetDataBtn')
  };

  const ctx = dom.canvas.getContext('2d');
  let W = 1;
  let H = 1;
  let dpr = 1;
  let currentScreen = 'startScreen';
  let activeShopTab = 'bundles';
  let selectedMode = 'classic';
  let selectedLevel = 1;
  let animationId = 0;
  let saveTimer = 0;
  let ambientTick = 0;
  let mobileSkillTouchAt = 0;
  let mobileItemsTouchAt = 0;
  let mobileItemsCloseTimer = 0;
  let onboardingTimer = 0;
  let modeStartTouchAt = 0;
  let modeStartAt = 0;
  let directStartTouchAt = 0;
  let directStartAt = 0;
  let selectedCheckout = null;
  let paymentScriptsReady = false;
  let paymentScriptPromise = null;
  let checkoutPayTouchAt = 0;
  let checkoutPayLastAt = 0;
  let checkoutPayLastType = '';
  let checkoutPayBusyUntil = 0;
  let lastStartClickAt = 0;
  let lastRestartClickAt = 0;
  let lastModeStartClickAt = 0;
  let loopRunning = false;
  let lastLoopAt = 0;
  let lastProgressAt = 0;
  let firstStartWatchdog = 0;
  let loopErrorCount = 0;
  let itemDockSignature = '';
  let itemDockLastRenderAt = 0;
  let itemTouchAt = 0;
  let itemTouchKey = '';
  let itemUseLastAt = 0;
  let itemUseLastKey = '';
  let mobileDragStart = null;

  const GALAXY_SECTORS = [
    {
      id: 'orion',
      name: 'Orion Rift',
      tagline: 'Blue nebula highway',
      mission: 'Stabilize the route and collect Star Coins before the rift collapses.',
      colors: ['#38e8ff', '#866bff', '#091226']
    },
    {
      id: 'andromeda',
      name: 'Andromeda Drift',
      tagline: 'Purple dust corridor',
      mission: 'Ride the drifting starlight and avoid abandoned relay debris.',
      colors: ['#b38cff', '#ff4fd8', '#12091f']
    },
    {
      id: 'nova',
      name: 'Nova Forge',
      tagline: 'Golden asteroid field',
      mission: 'Dash through broken comet mines and recover unstable energy cores.',
      colors: ['#ffd166', '#ff8d3b', '#1c1008']
    },
    {
      id: 'eclipse',
      name: 'Eclipse Gate',
      tagline: 'Dark matter gateway',
      mission: 'Push through the final gate while rival ships scramble the signal.',
      colors: ['#5cffaa', '#38e8ff', '#03140f']
    }
  ];

  function currentSector() {
    const index = Math.floor((game.distance || 0) / 2600) % GALAXY_SECTORS.length;
    return GALAXY_SECTORS[index];
  }

  function modeStoryLabel() {
    if (isGuestMode()) return 'Rookie · Orion Training Lane';
    if (game.mode === 'level') return `Level ${game.level} · ${currentSector().name}`;
    if (game.mode === 'arena') return `Arena · ${currentSector().name}`;
    return `Classic · ${currentSector().name}`;
  }

  function modeRules(mode = game.mode) {
    return MODE_RULES[mode] || MODE_RULES.classic;
  }

  function modeBrief(mode = game.mode) {
    return modeRules(mode).brief;
  }



  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultData() {
    const levelProgress = {};
    LEVELS.forEach((lvl) => {
      levelProgress[lvl.level] = { unlocked: lvl.level === 1, stars: 0, bestScore: 0 };
    });
    return {
      playerName: 'Rookie Runner',
      bestScore: 0,
      coins: 250,
      ownedSkins: ['default'],
      equippedSkin: 'default',
      ownedItems: { shield: 1, magnet: 1, doubleCoins: 0, bomb: 0, speedBoost: 1, revive: 0 },
      upgrades: { engine: 0, magnetRange: 0, shieldDuration: 0, coinBonus: 0, reviveDiscount: 0 },
      levelProgress,
      leaderboard: [
        { name: 'Nova', score: 4850, player: false, date: 'seed' },
        { name: 'Kira', score: 3920, player: false, date: 'seed' },
        { name: 'Jett', score: 2650, player: false, date: 'seed' },
        { name: 'Milo', score: 1480, player: false, date: 'seed' }
      ],
      settings: { music: true, flightSound: false, sfx: true },
      dailyReward: { streak: 0, claimedDates: [] },
      lastLoginDate: '',
      claimedMilestones: [],
      purchasedBundles: [],
      onboarding: { runsStarted: 0, hintsDismissed: false },
      currentMode: 'classic',
      selectedLevel: 1
    };
  }

  function readJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Storage write skipped:', key, error);
      return false;
    }
  }

  function normalizeAccountEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function isValidEmail(value) {
    const email = normalizeAccountEmail(value);
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  }

  function defaultPilotNameFromEmail(email) {
    const local = normalizeAccountEmail(email).split('@')[0] || 'Star Pilot';
    return normalizeName(local.replace(/[._-]+/g, ' ')).slice(0, 18) || 'Star Pilot';
  }

  function normalizeAccountName(value) {
    // Account identity is now email-based. Function name kept for compatibility with older code paths.
    return normalizeAccountEmail(value);
  }

  function accountIdFromName(value) {
    // Use normalized email as the local account id so login and registration match exactly.
    return normalizeAccountEmail(value);
  }

  function hashPassword(username, password) {
    const input = `${accountIdFromName(username)}|${String(password || '')}|NeonRunRivalsLocalSalt`;
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function loadAccounts() {
    const accounts = readJSON(ACCOUNTS_KEY, {});
    return accounts && typeof accounts === 'object' && !Array.isArray(accounts) ? accounts : {};
  }

  function saveAccounts() {
    writeJSON(ACCOUNTS_KEY, accounts);
  }

  let accounts = loadAccounts();
  let currentUserId = '';
  try {
    currentUserId = localStorage.getItem(SESSION_KEY) || '';
  } catch (error) {
    currentUserId = '';
  }

  function hasActiveAccount() {
    return Boolean(currentUserId && accounts[currentUserId]);
  }

  function isGuestMode() {
    return !hasActiveAccount();
  }

  function saveKeyFor(userId) {
    return `${STORAGE_PREFIX}${userId}`;
  }

  function currentSaveKey() {
    return hasActiveAccount() ? saveKeyFor(currentUserId) : GUEST_STORAGE_KEY;
  }

  function hydrateData(loaded) {
    const data = Object.assign(defaultData(), loaded || {});
    const defaults = defaultData();
    data.ownedItems = Object.assign(defaults.ownedItems, data.ownedItems || {});
    data.upgrades = Object.assign(defaults.upgrades, data.upgrades || {});
    data.settings = Object.assign(defaults.settings, data.settings || {});
    data.dailyReward = Object.assign(defaults.dailyReward, data.dailyReward || {});
    data.levelProgress = Object.assign(defaults.levelProgress, data.levelProgress || {});
    LEVELS.forEach((lvl) => {
      data.levelProgress[lvl.level] = Object.assign(
        { unlocked: lvl.level === 1, stars: 0, bestScore: 0 },
        data.levelProgress[lvl.level] || {}
      );
    });
    data.claimedMilestones = Array.isArray(data.claimedMilestones) ? data.claimedMilestones : [];
    data.purchasedBundles = Array.isArray(data.purchasedBundles) ? data.purchasedBundles : [];
    data.onboarding = Object.assign(defaults.onboarding, data.onboarding || {});
    data.ownedSkins = Array.isArray(data.ownedSkins) && data.ownedSkins.length ? data.ownedSkins : ['default'];
    if (!data.ownedSkins.includes(data.equippedSkin)) data.equippedSkin = 'default';
    data.leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : defaults.leaderboard;
    data.playerName = String(data.playerName || 'Rookie Runner').slice(0, 18);
    return data;
  }

  function loadData() {
    const stored = readJSON(currentSaveKey(), null);
    if (!hasActiveAccount() && !stored) {
      return hydrateData(readJSON(LEGACY_STORAGE_KEY, null));
    }
    return hydrateData(stored);
  }

  let data = loadData();

  function saveData() {
    try {
      if (hasActiveAccount()) {
        accounts[currentUserId].lastSaveAt = new Date().toISOString();
        saveAccounts();
      }
      writeJSON(currentSaveKey(), data);
      return true;
    } catch (error) {
      console.warn('Save skipped:', error);
      return false;
    }
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mixColor(a, b, t = 0.5) {
    const pa = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
    const pb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(b);
    if (!pa || !pb) return a;
    const ca = [parseInt(pa[1], 16), parseInt(pa[2], 16), parseInt(pa[3], 16)];
    const cb = [parseInt(pb[1], 16), parseInt(pb[2], 16), parseInt(pb[3], 16)];
    const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }



  function hexToRgba(hex, alpha = 1) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return `rgba(56,232,255,${alpha})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${alpha})`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function formatNumber(n) {
    return Math.floor(n).toLocaleString('en-US');
  }


  const MILESTONES = [
    { id: 'score1500', score: 1500, rewardCoins: 120, rewardItems: { speedBoost: 1 }, label: 'Score 1,500', reward: '120 Coins + 1 Boost' },
    { id: 'score3500', score: 3500, rewardCoins: 250, rewardItems: { revive: 1 }, label: 'Score 3,500', reward: '250 Coins + 1 Revive' },
    { id: 'score6500', score: 6500, rewardCoins: 500, rewardItems: { shield: 2, doubleCoins: 1 }, label: 'Score 6,500', reward: '500 Coins + 2 Shields' }
  ];

  function addItemsToWallet(items = {}) {
    Object.entries(items).forEach(([key, count]) => {
      data.ownedItems[key] = (data.ownedItems[key] || 0) + count;
    });
  }

  function nextMilestone() {
    return MILESTONES.find((m) => !data.claimedMilestones.includes(m.id)) || MILESTONES[MILESTONES.length - 1];
  }

  function updateGoalCard() {
    if (!dom.nextGoalText || !dom.nextGoalReward) return;
    const m = nextMilestone();
    const done = data.claimedMilestones.includes(m.id);
    dom.nextGoalText.textContent = done ? 'Champion Goal Cleared' : m.label;
    dom.nextGoalReward.textContent = done ? 'Keep pushing your best score' : `Reward: ${m.reward}`;
  }

  function checkMilestoneRewards(finalScore) {
    if (isGuestMode()) return [];
    const claimed = [];
    MILESTONES.forEach((m) => {
      if (finalScore >= m.score && !data.claimedMilestones.includes(m.id)) {
        data.claimedMilestones.push(m.id);
        data.coins += m.rewardCoins;
        addItemsToWallet(m.rewardItems);
        claimed.push(m);
      }
    });
    return claimed;
  }


  function upgradeLevel(key) {
    return clamp(Number(data.upgrades?.[key] || 0), 0, UPGRADES[key]?.max || 0);
  }

  function upgradeCost(key) {
    const upgrade = UPGRADES[key];
    const level = upgradeLevel(key);
    return Math.round(upgrade.baseCost * Math.pow(1.55, level));
  }

  function reviveCoinCost() {
    return Math.max(25, 60 - upgradeLevel('reviveDiscount') * 12);
  }

  function boostDuration(base) {
    return base + upgradeLevel('engine') * 0.55;
  }

  function boostPower() {
    return 1.12 + upgradeLevel('engine') * 0.025;
  }

  function magnetRange() {
    return 210 + upgradeLevel('magnetRange') * 42;
  }

  function shieldDuration(base) {
    return base + upgradeLevel('shieldDuration') * 0.8;
  }

  function coinBonusMultiplier() {
    return 1 + upgradeLevel('coinBonus') * 0.08;
  }

  function todayClaimed() {
    return data.dailyReward.claimedDates.includes(TODAY) || data.lastLoginDate === TODAY;
  }

  function updateDailyCard() {
    const guest = isGuestMode();
    const ready = !guest && !todayClaimed();
    dom.dailyRewardText.textContent = guest ? 'Login Required' : ready ? '+75 Coins Ready' : 'Claimed Today';
    dom.claimDailyBtn.disabled = !guest && !ready;
    dom.claimDailyBtn.textContent = guest ? 'Login' : ready ? 'Claim' : 'Done';
    dom.dailyRewardCard.classList.toggle('locked', guest);
    if (dom.guestModeNote) dom.guestModeNote.classList.toggle('hidden', !guest);
  }

  function normalizeName(value) {
    const clean = String(value || '').trim().replace(/\s+/g, ' ').slice(0, 18);
    return clean || 'Rookie Runner';
  }

  function setPlayerName(value) {
    const oldName = data.playerName;
    data.playerName = normalizeName(value);
    data.leaderboard.forEach((entry) => {
      if (entry.player || entry.name === oldName) entry.name = data.playerName;
    });
    saveData();
    renderLeaderboard();
    updateMiniLeaderboard();
  }

  function setAuthMessage(message = '', isError = false) {
    if (!dom.authMessage) return;
    dom.authMessage.textContent = message;
    dom.authMessage.classList.toggle('error', Boolean(isError));
  }

  function switchAuthTab(tab = 'login') {
    dom.authTabs.forEach((button) => {
      button.classList.toggle('active', button.dataset.authTab === tab);
    });
    dom.loginForm.classList.toggle('hidden', tab !== 'login');
    dom.registerForm.classList.toggle('hidden', tab !== 'register');
    setAuthMessage('');
  }

  function refreshAccountLabel() {
    if (!dom.currentAccountName) return;
    const account = accounts[currentUserId];
    if (account) {
      if (dom.accountPrefix) dom.accountPrefix.textContent = 'Signed in as';
      dom.currentAccountName.textContent = account.displayName;
      dom.logoutBtn.textContent = 'Sign Out';
      dom.startBtn.textContent = 'Start Game';
      dom.modeBtn.textContent = 'Mode Select';
      dom.shopBtn.textContent = 'Shop';
      dom.leaderboardBtn.textContent = 'Leaderboard';
    } else {
      if (dom.accountPrefix) dom.accountPrefix.textContent = 'Guest Mode';
      dom.currentAccountName.textContent = 'Rookie Runner';
      dom.logoutBtn.textContent = 'Login / Register';
      dom.startBtn.textContent = 'Play Rookie Mode';
      dom.modeBtn.textContent = 'Full Modes';
      dom.shopBtn.textContent = 'Shop Locked';
      dom.leaderboardBtn.textContent = 'Rankings Locked';
    }
  }

  function syncLoadedDataToUI() {
    dom.playerNameInput.value = data.playerName;
    selectedMode = data.currentMode || 'classic';
    selectedLevel = data.selectedLevel || 1;
    refreshAccountLabel();
    updateSettingsUI();
    updateDailyCard();
    renderModes();
    renderShop();
    renderLeaderboard();
    updateHUD();
    if (game.player) game.resetRuntime();
  }

  function activateAccount(userId) {
    if (!accounts[userId]) return;
    currentUserId = userId;
    try { localStorage.setItem(SESSION_KEY, currentUserId); } catch (error) {}
    accounts[currentUserId].lastLoginAt = new Date().toISOString();
    saveAccounts();
    data = loadData();
    if (!data.playerName || data.playerName === 'Rookie Runner') {
      data.playerName = defaultPilotNameFromEmail(accounts[currentUserId].email || accounts[currentUserId].displayName);
      saveData();
    }
    syncLoadedDataToUI();
    showScreen('startScreen');
  }

  function handleRegister(event) {
    event.preventDefault();
    const email = normalizeAccountEmail(dom.registerUsername.value);
    const userId = accountIdFromName(email);
    const password = String(dom.registerPassword.value || '');
    const confirm = String(dom.registerConfirmPassword.value || '');

    if (!isValidEmail(email)) {
      setAuthMessage('Please enter a valid email address.', true);
      return;
    }
    if (password.length < 6) {
      setAuthMessage('Password must be at least 6 characters.', true);
      return;
    }
    if (password !== confirm) {
      setAuthMessage('Passwords do not match.', true);
      return;
    }
    if (accounts[userId]) {
      setAuthMessage('This email is already registered on this device.', true);
      return;
    }

    const firstAccount = Object.keys(accounts).length === 0;
    accounts[userId] = {
      id: userId,
      email,
      displayName: email,
      passwordHash: hashPassword(email, password),
      createdAt: new Date().toISOString(),
      lastLoginAt: '',
      lastSaveAt: ''
    };
    saveAccounts();

    const guestSave = readJSON(GUEST_STORAGE_KEY, null);
    const legacy = readJSON(LEGACY_STORAGE_KEY, null);
    const importSource = guestSave || (firstAccount ? legacy : null);
    if (importSource) {
      const imported = hydrateData(importSource);
      if (!imported.playerName || imported.playerName === 'Rookie Runner') {
        imported.playerName = defaultPilotNameFromEmail(email);
      }
      writeJSON(saveKeyFor(userId), imported);
    }

    dom.registerForm.reset();
    activateAccount(userId);
  }

  function handleLogin(event) {
    event.preventDefault();
    const email = normalizeAccountEmail(dom.loginUsername.value);
    const userId = accountIdFromName(email);
    const account = accounts[userId];
    if (!isValidEmail(email)) {
      setAuthMessage('Please enter a valid email address.', true);
      return;
    }
    if (!account || account.passwordHash !== hashPassword(email, dom.loginPassword.value)) {
      setAuthMessage('Incorrect email or password.', true);
      return;
    }
    dom.loginForm.reset();
    activateAccount(userId);
  }

  function stopRunForMenu() {
    game.running = false;
    game.paused = false;
    game.over = false;
    dom.pauseOverlay.classList.add('hidden');
    dom.gameOverOverlay.classList.add('hidden');
  }

  function openAuth(message = 'Login or register to unlock the full game.', tab = 'login') {
    stopRunForMenu();
    switchAuthTab(tab);
    setAuthMessage(message, false);
    showScreen('authScreen');
  }

  function enterGuestMode(startNow = true) {
    currentUserId = '';
    try { localStorage.removeItem(SESSION_KEY); } catch (error) {}
    data = hydrateData(loadData());
    data.playerName = data.playerName && data.playerName !== 'Rookie Runner' ? data.playerName : 'Guest Rookie';
    selectedMode = 'classic';
    selectedLevel = 1;
    data.currentMode = 'classic';
    data.selectedLevel = 1;
    saveData();
    syncLoadedDataToUI();
    setAuthMessage('');
    if (startNow) startGame('classic', 1);
    else showScreen('startScreen');
  }
  function requireLogin(feature = 'This feature') {
    if (!isGuestMode()) return true;
    const go = window.confirm(`${feature} requires a free local account. Login or register now?`);
    if (go) openAuth(`${feature} is available after login or registration.`, 'login');
    return false;
  }

  function logout() {
    const wasLoggedIn = hasActiveAccount();
    saveData();
    currentUserId = '';
    try { localStorage.removeItem(SESSION_KEY); } catch (error) {}
    data = loadData();
    stopRunForMenu();
    openAuth(wasLoggedIn ? 'Signed out. You can login, register, or play Rookie Mode as a guest.' : 'Login or register to unlock the full game.', 'login');
  }

  const audio = {
    ctx: null,
    music: null,
    engine: null,
    gain: null,
    sfxGain: null,
    started: false,
    engineLevel: 0,
    lastBoostWhooshAt: 0,

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.038;
      this.gain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.48;
      this.sfxGain.connect(this.ctx.destination);
    },

    unlock() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.started && data.settings.music) this.startMusic();
      if (data.settings.flightSound && currentScreen === 'gameScreen' && game.running) this.setEngine(true, false);
      this.started = true;
    },

    now() {
      return this.ctx ? this.ctx.currentTime : 0;
    },

    tone(freq, duration = 0.08, type = 'sine', volume = 0.05, destination = null) {
      if (!data.settings.sfx) return;
      this.init();
      if (!this.ctx) return;
      const t = this.now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(destination || this.sfxGain || this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration + 0.03);
    },

    sweep(from, to, duration = 0.22, type = 'sawtooth', volume = 0.034) {
      if (!data.settings.sfx) return;
      this.init();
      if (!this.ctx) return;
      const t = this.now();
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(from, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + duration);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(740, t);
      filter.frequency.exponentialRampToValueAtTime(2100, t + duration * 0.75);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), t + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration + 0.04);
    },

    noiseBurst(duration = 0.16, volume = 0.024, filterFreq = 1200, type = 'bandpass') {
      if (!data.settings.sfx) return;
      this.init();
      if (!this.ctx) return;
      const sampleRate = this.ctx.sampleRate || 44100;
      const length = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = this.ctx.createBuffer(1, length, sampleRate);
      const dataArr = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        dataArr[i] = (Math.random() * 2 - 1) * (1 - i / length);
      }

      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      const t = this.now();

      source.buffer = buffer;
      filter.type = type;
      filter.frequency.setValueAtTime(filterFreq, t);
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);
      source.start(t);
      source.stop(t + duration + 0.02);
    },

    click() {
      this.tone(720, 0.040, 'triangle', 0.020);
    },

    coin() {
      this.tone(1240, 0.050, 'sine', 0.030);
      setTimeout(() => this.tone(1760, 0.040, 'triangle', 0.022), 38);
    },

    score() {
      this.tone(660, 0.045, 'triangle', 0.018);
      setTimeout(() => this.tone(990, 0.045, 'sine', 0.015), 55);
    },

    skill() {
      this.sweep(180, 820, 0.18, 'sawtooth', 0.026);
      setTimeout(() => this.tone(1180, 0.070, 'triangle', 0.018), 88);
    },

    boost() {
      const now = performance.now();
      if (now - this.lastBoostWhooshAt < 520) return;
      this.lastBoostWhooshAt = now;
      this.sweep(95, 320, 0.24, 'sawtooth', 0.034);
      this.noiseBurst(0.17, 0.018, 780, 'lowpass');
    },

    hit() {
      this.tone(74, 0.14, 'sawtooth', 0.036);
      setTimeout(() => this.tone(188, 0.08, 'square', 0.020), 34);
      this.noiseBurst(0.12, 0.024, 1350, 'bandpass');
    },

    over() {
      this.sweep(220, 58, 0.30, 'triangle', 0.034);
      setTimeout(() => this.noiseBurst(0.18, 0.018, 520, 'lowpass'), 80);
      this.setEngine(false);
    },

    startMusic() {
      this.init();
      if (!this.ctx || this.music) return;
      const t = this.now();

      const padA = this.ctx.createOscillator();
      const padB = this.ctx.createOscillator();
      const shimmer = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const padGain = this.ctx.createGain();

      padA.type = 'sine';
      padB.type = 'triangle';
      shimmer.type = 'sine';
      padA.frequency.setValueAtTime(64, t);
      padB.frequency.setValueAtTime(96, t);
      shimmer.frequency.setValueAtTime(192, t);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.045, t);
      lfoGain.gain.setValueAtTime(5.5, t);
      lfo.connect(lfoGain);
      lfoGain.connect(padA.frequency);
      lfoGain.connect(padB.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, t);
      filter.Q.value = 0.42;

      padGain.gain.setValueAtTime(0.0001, t);
      padGain.gain.exponentialRampToValueAtTime(0.24, t + 0.9);

      padA.connect(filter);
      padB.connect(filter);
      shimmer.connect(filter);
      filter.connect(padGain);
      padGain.connect(this.gain);

      padA.start(t);
      padB.start(t);
      shimmer.start(t);
      lfo.start(t);

      this.music = { padA, padB, shimmer, lfo, filter, padGain };
    },

    startEngine() {
      if (!this.ctx || this.engine) return;
      const t = this.now();
      const low = this.ctx.createOscillator();
      const mid = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      low.type = 'sawtooth';
      mid.type = 'triangle';
      low.frequency.setValueAtTime(46, t);
      mid.frequency.setValueAtTime(92, t);
      lfo.frequency.setValueAtTime(3.2, t);
      lfoGain.gain.setValueAtTime(1.1, t);
      lfo.connect(lfoGain);
      lfoGain.connect(low.frequency);
      lfoGain.connect(mid.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, t);
      filter.Q.value = 0.55;
      gain.gain.setValueAtTime(0.0001, t);

      low.connect(filter);
      mid.connect(filter);
      filter.connect(gain);
      gain.connect(this.gain);

      low.start(t);
      mid.start(t);
      lfo.start(t);
      this.engine = { low, mid, lfo, lfoGain, filter, gain };
    },

    stopEngine() {
      if (!this.engine) return;
      try {
        const t = this.now();
        this.engine.gain.gain.cancelScheduledValues(t);
        this.engine.gain.gain.setTargetAtTime(0.0001, t, 0.08);
      } catch (error) {}
      setTimeout(() => {
        if (!this.engine) return;
        try {
          this.engine.low.stop();
          this.engine.mid.stop();
          this.engine.lfo.stop();
        } catch (error) {}
        this.engine = null;
        this.engineLevel = 0;
      }, 220);
    },

    setEngine(active, boost = false) {
      this.init();
      if (!this.ctx) return;
      if (!data.settings.flightSound) {
        this.stopEngine();
        return;
      }
      if (active && !this.engine) this.startEngine();
      if (!this.engine) return;

      const t = this.now();
      const target = active ? (boost ? 0.095 : 0.035) : 0.0001;
      const freq = active ? (boost ? 360 : 210) : 150;
      this.engine.gain.gain.cancelScheduledValues(t);
      this.engine.filter.frequency.cancelScheduledValues(t);
      this.engine.gain.gain.setTargetAtTime(target, t, 0.16);
      this.engine.filter.frequency.setTargetAtTime(freq, t, 0.20);
      this.engineLevel = target;
      if (!active) this.stopEngine();
    },

    updateEngine(boost = false) {
      if (!data.settings.flightSound) {
        this.stopEngine();
        return;
      }
      const active = currentScreen === 'gameScreen' && game.running && !game.paused && !game.over;
      this.setEngine(active, active && boost);
    },

    stopMusic() {
      if (!this.music) return;
      try {
        this.music.padA.stop();
        this.music.padB.stop();
        this.music.shimmer.stop();
        this.music.lfo.stop();
      } catch (error) {}
      this.music = null;
    },

    syncMusic() {
      if (data.settings.music) this.startMusic();
      else this.stopMusic();
    },

    syncEngine() {
      if (data.settings.flightSound) this.updateEngine(game.active && game.active.speedBoost > 0);
      else this.stopEngine();
    }
  };

  function showScreen(id) {
    if (!dom.screens.some((screen) => screen.id === id)) id = 'startScreen';
    currentScreen = id;
    if (id !== 'gameScreen') {
      audio.setEngine(false);
      setMobileItemsOpen(false);
      hideOnboardingToast(false);
      if (id !== 'shopScreen') closeCheckout();
    } else {
      audio.updateEngine(game.active && game.active.speedBoost > 0);
    }
    dom.screens.forEach((screen) => screen.classList.toggle('active', screen.id === id));
    if (id === 'shopScreen') {
      renderShop();
      primePaymentScripts('shop');
    }
    if (id === 'leaderboardScreen') renderLeaderboard();
    if (id === 'settingsScreen') updateSettingsUI();
    if (id === 'modeScreen') {
      game.launchLockUntil = 0;
      renderModes();
    }
  }
  function updateViewportFlags() {
    const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const mobile = coarse || window.innerWidth <= 820 || window.innerHeight <= 560;
    document.body.classList.toggle('is-mobile', mobile);
    document.body.classList.toggle('is-landscape', window.innerWidth > window.innerHeight);
    document.body.classList.toggle('is-portrait', window.innerHeight >= window.innerWidth);
  }

  function resizeCanvas() {
    updateViewportFlags();
    const viewport = window.visualViewport || null;
    dpr = Math.max(1, Math.min(2.2, window.devicePixelRatio || 1));
    W = Math.max(320, Math.floor((viewport && viewport.width) || window.innerWidth));
    H = Math.max(320, Math.floor((viewport && viewport.height) || window.innerHeight));
    dom.canvas.width = Math.floor(W * dpr);
    dom.canvas.height = Math.floor(H * dpr);
    dom.canvas.style.width = `${W}px`;
    dom.canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (game.player) {
      game.player.x = clamp(game.player.x, roadLeft() + 38, roadRight() - 38);
      game.player.y = clamp(game.player.y, H * 0.34, H - 88);
      game.targetX = clamp(game.targetX || game.player.x, roadLeft() + 38, roadRight() - 38);
      game.targetY = clamp(game.targetY || game.player.y, H * 0.34, H - 88);
    }
  }

  function roadWidth() {
    return Math.min(W * 0.88, Math.max(330, H * 0.58));
  }

  function roadLeft() {
    return W / 2 - roadWidth() / 2;
  }

  function roadRight() {
    return W / 2 + roadWidth() / 2;
  }

  function getLaneX(index) {
    const left = roadLeft() + roadWidth() * 0.17;
    const right = roadRight() - roadWidth() * 0.17;
    return lerp(left, right, index / 2);
  }

  function screenPoint(event) {
    const rect = dom.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  const game = {
    mode: 'classic',
    level: 1,
    running: false,
    paused: false,
    over: false,
    score: 0,
    runCoins: 0,
    collectedLevelCoins: 0,
    speed: 330,
    baseSpeed: 330,
    spawnTimer: 0,
    coinTimer: 0,
    scorePulse: 0,
    speedFx: 1,
    boostPulse: 0,
    brakePulse: 0,
    boostActiveLast: false,
    player: null,
    obstacles: [],
    coins: [],
    pickups: [],
    particles: [],
    floatTexts: [],
    coinFlights: [],
    waves: [],
    rivals: [],
    keys: {},
    pointerActive: false,
    targetX: 0,
    targetY: 0,
    active: {},
    cooldowns: {},
    shieldHits: 0,
    reviveArmed: false,
    revivedThisRun: false,
    invincibleTimer: 0,
    shake: 0,
    lastTime: 0,
    distance: 0,
    levelComplete: false,
    nextScoreSfx: 500,
    launchLockUntil: 0,
    runId: 0,
    lastRestartAt: 0,
    lastRestartTouchAt: 0,
    arenaRank: 6,
    lastArenaRank: 6,
    arenaRankFlash: 0,
    levelClearTimer: 0,
    modeBonusTimer: 0,
    resetRuntime() {
      const startSkin = SKINS.find((skin) => skin.id === data.equippedSkin) || SKINS[0];
      this.score = 0;
      this.runCoins = 0;
      this.collectedLevelCoins = 0;
      this.speed = this.baseSpeed;
      // First-run pacing: spawn early so the first screen never looks frozen.
      this.spawnTimer = 0.16;
      this.coinTimer = 0.10;
      this.scorePulse = 0;
      this.speedFx = 1;
      this.boostPulse = 0;
      this.brakePulse = 0;
      this.boostActiveLast = false;
      this.obstacles = [];
      this.coins = [];
      this.pickups = [];
      this.particles = [];
      this.floatTexts = [];
      this.coinFlights = [];
      this.waves = [];
      this.keys = {};
      this.pointerActive = false;
      this.active = { shield: 0, magnet: 0, doubleCoins: 0, speedBoost: 0, bomb: 0 };
      this.cooldowns = { shield: 0, magnet: 0, doubleCoins: 0, bomb: 0, speedBoost: 0, sprint: 0 };
      this.shieldHits = 0;
      this.reviveArmed = false;
      this.revivedThisRun = false;
      this.invincibleTimer = 1.2;
      this.shake = 0;
      this.distance = 0;
      this.levelComplete = false;
      this.levelClearTimer = 0;
      this.modeBonusTimer = 0;
      this.arenaRank = 6;
      this.lastArenaRank = 6;
      this.arenaRankFlash = 0;
      this.nextScoreSfx = 500;
      const startY = mobileShipStartY();
      this.player = {
        x: W / 2,
        y: startY,
        r: clamp(Math.min(W, H) * 0.035, 18, 31),
        targetX: W / 2,
        targetY: startY,
        skin: startSkin,
        tilt: 0,
        turn: 0,
        vx: 0,
        vy: 0,
        runCycle: 0,
        brake: 0,
        trail: []
      };
      this.targetX = this.player.x;
      this.targetY = this.player.y;
      this.rivals = createRivals();
    }
  };

  function createRivals() {
    const rivalColors = ['#ff4fd8', '#ffd166', '#5cffaa', '#866bff', '#38e8ff'];
    return AI_NAMES.slice(0, 5).map((name, index) => ({
      name,
      score: Math.max(0, 180 - index * 34),
      pace: rand(0.86, 1.20),
      boostAt: rand(520, 1850),
      burst: 0,
      lane: index % 3,
      targetLane: index % 3,
      x: getLaneX(index % 3),
      y: H * (0.26 + index * 0.08),
      color: rivalColors[index % rivalColors.length],
      moveTimer: rand(0.8, 1.8),
      justOvertook: false
    }));
  }

  function clearTransientRunState() {
    game.running = false;
    game.paused = false;
    game.over = false;
    game.keys = {};
    game.pointerActive = false;
    mobileDragStart = null;
    game.targetX = 0;
    game.targetY = 0;
    game.boostPulse = 0;
    game.brakePulse = 0;
    game.speedFx = 1;
    game.boostActiveLast = false;
    game.shake = 0;
    game.invincibleTimer = 0;
    game.levelComplete = false;
    game.levelClearTimer = 0;
    game.modeBonusTimer = 0;
    game.arenaRank = 6;
    game.lastArenaRank = 6;
    game.arenaRankFlash = 0;
    game.reviveArmed = false;
    game.revivedThisRun = false;
    game.continueUsed = false;
    game.active = { shield: 0, magnet: 0, doubleCoins: 0, speedBoost: 0, bomb: 0 };
    game.cooldowns = { shield: 0, magnet: 0, doubleCoins: 0, bomb: 0, speedBoost: 0, sprint: 0 };
    itemDockSignature = '';
    if (dom.pauseOverlay) dom.pauseOverlay.classList.add('hidden');
    if (dom.gameOverOverlay) dom.gameOverOverlay.classList.add('hidden');
    if (dom.continueCard) dom.continueCard.classList.add('hidden');
  }

  function canLaunchNow() {
    const now = performance.now();
    if (game.launchLockUntil && now < game.launchLockUntil) return false;
    game.launchLockUntil = now + 420;
    return true;
  }

  function releaseLaunchLockSoon() {
    setTimeout(() => { game.launchLockUntil = 0; }, 120);
  }

  function shouldIgnoreFollowUpClick(event, touchKey, clickKey, gap = 750) {
    const now = performance.now();
    if (event && event.type === 'touchend') {
      game[touchKey] = now;
      return false;
    }
    if (event && event.type === 'click' && game[touchKey] && now - game[touchKey] < gap) {
      return true;
    }
    return false;
  }

  function shouldIgnoreRapidAction(key, gap = 260) {
    const now = performance.now();
    if (game[key] && now - game[key] < gap) return true;
    game[key] = now;
    return false;
  }

  function hardResetLaunchState() {
    game.launchLockUntil = 0;
    game.lastRestartTouchAt = 0;
    game.lastRestartAt = 0;
    directStartTouchAt = 0;
    modeStartTouchAt = 0;
    if (typeof closeCheckout === 'function') closeCheckout();
    if (dom.paymentCheckoutOverlay) dom.paymentCheckoutOverlay.classList.add('hidden');
    if (dom.gameOverOverlay) dom.gameOverOverlay.classList.add('hidden');
    if (dom.pauseOverlay) dom.pauseOverlay.classList.add('hidden');
    if (dom.continueCard) dom.continueCard.classList.add('hidden');
    hideOnboardingToast(false);
  }

  function hideOnboardingToast(persist = false) {
    if (onboardingTimer) {
      clearTimeout(onboardingTimer);
      onboardingTimer = 0;
    }
    if (dom.onboardingToast) dom.onboardingToast.classList.add('hidden');
    if (persist && data.onboarding) {
      data.onboarding.hintsDismissed = true;
      saveData();
    }
  }

  function showOnboardingToast(force = false) {
    if (!dom.onboardingToast) return;
    const mobile = isMobileLayout();
    const runs = Number(data.onboarding?.runsStarted || 0);
    const dismissed = Boolean(data.onboarding?.hintsDismissed);
    if (!force && dismissed && runs > 2) return;

    if (mobile) {
      dom.onboardingIcon.textContent = '☝️';
      dom.onboardingTitle.textContent = 'Drag to steer';
      dom.onboardingText.textContent = 'Drag left or right to steer. Your ship stays above your finger so you can see it clearly.';
    } else {
      dom.onboardingIcon.textContent = '⌨️';
      dom.onboardingTitle.textContent = 'Dodge and boost';
      dom.onboardingText.textContent = 'Use WASD / Arrow Keys to move. Press Space to Boost. Clean Dodge gives bonus score.';
    }

    dom.onboardingToast.classList.remove('hidden');
    if (onboardingTimer) clearTimeout(onboardingTimer);
    onboardingTimer = setTimeout(() => hideOnboardingToast(false), mobile ? 1600 : 2400);
  }

  function updateGameOverGoalCard(finalScore) {
    if (!dom.overGoalCard || !dom.overGoalFill) return;
    const next = nextMilestone();
    const loggedIn = !isGuestMode();
    const target = Math.max(1, next.score || 1500);
    const progress = clamp(finalScore / target, 0, 1);
    const gap = Math.max(0, target - finalScore);

    dom.overGoalLabel.textContent = loggedIn ? 'Next Reward' : 'Account Reward';
    dom.overGoalGap.textContent = loggedIn
      ? gap > 0 ? `${formatNumber(gap)} pts away` : 'Reward unlocked'
      : 'Register to save rewards';
    dom.overGoalReward.textContent = loggedIn
      ? gap > 0 ? `${next.label}: ${next.reward}` : `Unlocked: ${next.reward}`
      : 'Create an account to unlock daily rewards, bundles, and rankings.';
    dom.overGoalFill.style.width = `${Math.round(progress * 100)}%`;
    dom.overGoalCard.classList.toggle('completed', loggedIn && gap === 0);
  }



  function isValidMode(mode) {
    return ['classic', 'arena', 'level'].includes(mode);
  }

  function firstUnlockedLevel() {
    const found = LEVELS.find((lvl) => {
      const progress = data.levelProgress && data.levelProgress[lvl.level];
      return lvl.level === 1 || (progress && progress.unlocked);
    });
    return found ? found.level : 1;
  }

  function isLevelUnlocked(level) {
    const lvl = LEVELS.find((item) => item.level === Number(level));
    if (!lvl) return false;
    const progress = data.levelProgress && data.levelProgress[lvl.level];
    return lvl.level === 1 || Boolean(progress && progress.unlocked);
  }

  function sanitizeModeSelection(mode = selectedMode, level = selectedLevel) {
    let safeMode = isValidMode(mode) ? mode : 'classic';
    let safeLevel = Number(level || 1);

    if (safeMode === 'level') {
      if (!isLevelUnlocked(safeLevel)) safeLevel = firstUnlockedLevel();
      if (!isLevelUnlocked(safeLevel)) safeLevel = 1;
    } else {
      safeLevel = 1;
    }

    selectedMode = safeMode;
    selectedLevel = safeLevel;
    data.currentMode = safeMode;
    data.selectedLevel = safeLevel;
    saveData();
    return { mode: safeMode, level: safeLevel };
  }

  function launchSelectedMode(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (shouldIgnoreFollowUpClick(event, 'lastModeStartTouchAt', 'lastModeStartClickAt')) return;
    if (shouldIgnoreRapidAction('lastModeStartClickAt', 260)) return;

    try { audio.click(); } catch (error) {}
    if (!requireLogin('Full game modes')) return;

    const safe = sanitizeModeSelection(selectedMode, selectedLevel);
    renderModes();

    try {
      hardResetLaunchState();
      doLaunchRun(safe.mode, safe.level, { skipLock: true });
    } catch (error) {
      emergencyLaunchRun(error);
    } finally {
      releaseLaunchLockSoon();
    }
  }

  function prepareRunData(mode, level) {
    if (!data || typeof data !== 'object') data = hydrateData(null);
    if (isGuestMode()) {
      mode = 'classic';
      level = 1;
      if (!data.playerName || data.playerName === 'Rookie Runner') data.playerName = 'Guest Rookie';
    } else {
      const safe = sanitizeModeSelection(mode, level);
      mode = safe.mode;
      level = safe.level;
    }
    const nextName = normalizeName((dom.playerNameInput && dom.playerNameInput.value) || data.playerName || 'Guest Rookie');
    const oldName = data.playerName;
    data.playerName = nextName;
    if (Array.isArray(data.leaderboard)) {
      data.leaderboard.forEach((entry) => {
        if (entry.player || entry.name === oldName) entry.name = nextName;
      });
    }
    selectedMode = mode || 'classic';
    selectedLevel = Number(level || 1);
    data.currentMode = selectedMode;
    data.selectedLevel = selectedLevel;
    if (dom.playerNameInput) dom.playerNameInput.value = data.playerName;
    saveData();
    return { mode: selectedMode, level: selectedLevel };
  }


  function seedOpeningRunContent() {
    // Give the first second visible life even before normal timers kick in.
    if (!game.player) return;
    try {
      if (!game.coins.length) {
        const lane = clamp(Math.round((game.player.x - roadLeft()) / Math.max(1, roadWidth() / 2)), 0, 2);
        for (let i = 0; i < 5; i += 1) {
          game.coins.push({
            x: getLaneX(lane) + Math.sin(i * 0.8) * 12,
            y: -80 - i * 42,
            r: 10,
            value: i === 4 ? 5 : 1,
            spin: rand(0, Math.PI * 2),
            magneted: false,
            missionCoin: game.mode === 'level'
          });
        }
      }
      if (!game.obstacles.length) {
        const safeLane = clamp(Math.round((game.player.x - roadLeft()) / Math.max(1, roadWidth() / 2)), 0, 2);
        const lanes = [0, 1, 2].filter((lane) => lane !== safeLane);
        const obstacleLane = pick(lanes.length ? lanes : [0, 2]);
        game.obstacles.push(createSpaceObstacle('asteroid', obstacleLane, -360, 1));
      }
      game.spawnTimer = Math.min(game.spawnTimer, 0.18);
      game.coinTimer = Math.min(game.coinTimer, 0.08);
    } catch (error) {
      console.warn('Opening run seed skipped:', error);
    }
  }

  function ensureGameLoopRunning(reason = 'unknown') {
    const now = performance.now();
    if (!loopRunning || !animationId || now - lastLoopAt > 700) {
      try {
        if (animationId) cancelAnimationFrame(animationId);
      } catch (error) {}
      loopRunning = true;
      game.lastTime = now;
      lastLoopAt = now;
      ensureGameLoopRunning('init');
      console.log(`[Galaxy Run Rivals] Game loop ensured: ${reason}`);
    }
  }

  function scheduleFirstStartWatchdog(runId) {
    if (firstStartWatchdog) clearTimeout(firstStartWatchdog);
    lastProgressAt = performance.now();
    firstStartWatchdog = setTimeout(() => {
      if (!game.running || game.paused || game.over || game.runId !== runId) return;
      const stuck = game.score < 2 && game.distance < 8;
      if (stuck) {
        console.warn('[Galaxy Run Rivals] First-start watchdog nudged the run loop.');
        game.lastTime = performance.now() - 16;
        game.spawnTimer = 0.02;
        game.coinTimer = 0.02;
        seedOpeningRunContent();
        // Perform one safe deterministic tick so the screen visibly advances even if RAF was delayed.
        try {
          updateGame(1 / 60);
          updateHUD();
        } catch (error) {
          console.warn('First-start watchdog tick failed:', error);
        }
      }
      ensureGameLoopRunning('first-start-watchdog');
    }, 650);
  }

  function doLaunchRun(mode = selectedMode, level = selectedLevel, options = {}) {
    if (!options.skipLock && !canLaunchNow()) return false;
    try {
      try { audio.unlock(); audio.setEngine(true, false); } catch (error) {}
      const prepared = prepareRunData(mode, level);

      hardResetLaunchState();
      clearTransientRunState();
      game.runId = (game.runId || 0) + 1;
      game.mode = isGuestMode() ? 'classic' : prepared.mode;
      game.level = isGuestMode() ? 1 : prepared.level;
      const rules = modeRules(game.mode);
      game.baseSpeed = isGuestMode() ? 285 : Math.round(315 * rules.speedMul);

      game.resetRuntime();
      game.running = true;
      game.paused = false;
      game.over = false;
      game.continueUsed = false;
      game.revivedThisRun = false;
      game.reviveArmed = false;
      game.lastTime = performance.now() - 16;
      lastProgressAt = performance.now();
      seedOpeningRunContent();

      if (dom.pauseOverlay) dom.pauseOverlay.classList.add('hidden');
      if (dom.gameOverOverlay) dom.gameOverOverlay.classList.add('hidden');
      if (dom.continueCard) dom.continueCard.classList.add('hidden');

      data.onboarding.runsStarted = Number(data.onboarding.runsStarted || 0) + 1;
      saveData();

      showScreen('gameScreen');
      ensureGameLoopRunning('launch');
      scheduleFirstStartWatchdog(game.runId);
      renderItemDock();
      updateHUD();
      updateMiniLeaderboard();
      addFloatingText(W / 2, H * 0.28, isGuestMode() ? 'Rookie Mode: dodge and collect!' : game.mode === 'arena' ? 'Arena: overtake rival pilots!' : game.mode === 'level' ? `Mission: ${formatNumber(levelInfo().goal)} pts + ${levelInfo().coins} coins` : 'Classic: chase your best score!', '#38e8ff');
      showOnboardingToast();
      return true;
    } finally {
      releaseLaunchLockSoon();
    }
  }

  function emergencyLaunchRun(error) {
    console.warn('Emergency Rookie launch used:', error);
    try {
      currentUserId = '';
      try { localStorage.removeItem(SESSION_KEY); } catch (storageError) {}
      data = hydrateData(data || null);
      data.playerName = data.playerName && data.playerName !== 'Rookie Runner' ? data.playerName : 'Guest Rookie';
      selectedMode = 'classic';
      selectedLevel = 1;

      clearTransientRunState();
      game.runId = (game.runId || 0) + 1;
      game.mode = 'classic';
      game.level = 1;
      game.baseSpeed = 285;
      game.resetRuntime();
      game.running = true;
      game.paused = false;
      game.over = false;
      game.continueUsed = false;
      game.lastTime = performance.now() - 16;
      seedOpeningRunContent();

      if (dom.playerNameInput) dom.playerNameInput.value = data.playerName;
      showScreen('gameScreen');
      ensureGameLoopRunning('emergency-launch');
      scheduleFirstStartWatchdog(game.runId);
      try { renderItemDock(); updateHUD(); updateMiniLeaderboard(); } catch (uiError) {}
      try { addFloatingText(W / 2, H * 0.28, 'Rookie Mode: dodge and collect!', '#38e8ff'); showOnboardingToast(true); } catch (fxError) {}
      releaseLaunchLockSoon();
    } catch (fatal) {
      console.error('Emergency launch failed:', fatal);
      setAuthMessage('Start failed. Please refresh the page or clear site data.', true);
      showScreen('startScreen');
    }
  }

  function startGame(mode = selectedMode, level = selectedLevel, options = {}) {
    try {
      const safeMode = isValidMode(mode) ? mode : 'classic';
      const safeLevel = Number(level || 1);

      // Start is a player command. Never let a stale launch lock silently block it.
      if (options.force !== false) hardResetLaunchState();
      const started = doLaunchRun(safeMode, safeLevel, { skipLock: true });
      if (!started) {
        hardResetLaunchState();
        doLaunchRun('classic', 1, { skipLock: true });
      }
    } catch (error) {
      emergencyLaunchRun(error);
    }
  }

  function launchRookieMode(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (shouldIgnoreFollowUpClick(event, 'lastStartTouchAt', 'lastStartClickAt')) return;
    if (shouldIgnoreRapidAction('lastStartClickAt', 220)) return;

    try { audio.click(); } catch (error) {}
    startGame('classic', 1, { force: true });
  }

  function restartGame(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (shouldIgnoreFollowUpClick(event, 'lastRestartTouchAt', 'lastRestartClickAt')) return;
    if (shouldIgnoreRapidAction('lastRestartClickAt', 260)) return;

    const mode = isGuestMode() ? 'classic' : (game.mode || selectedMode || 'classic');
    const level = isGuestMode() ? 1 : (game.level || selectedLevel || 1);

    try {
      hardResetLaunchState();
      clearTransientRunState();
      doLaunchRun(mode, level, { skipLock: true });
    } catch (error) {
      emergencyLaunchRun(error);
    } finally {
      releaseLaunchLockSoon();
    }
  }

  function togglePause(force) {
    if (!game.running || game.over) return;
    audio.click();
    game.paused = typeof force === 'boolean' ? force : !game.paused;
    dom.pauseOverlay.classList.toggle('hidden', !game.paused);
    audio.setEngine(!game.paused, game.active && game.active.speedBoost > 0);
    if (!game.paused) game.lastTime = performance.now();
  }

  function levelInfo() {
    return LEVELS.find((lvl) => lvl.level === game.level) || LEVELS[0];
  }

  function getLevelStars(score) {
    if (game.mode !== 'level') return '—';
    const lvl = levelInfo();
    let stars = 0;
    lvl.stars.forEach((target) => { if (score >= target) stars += 1; });
    if (game.collectedLevelCoins >= lvl.coins && stars < 3 && score >= lvl.goal) stars += 1;
    return clamp(stars, 0, 3);
  }

  function endGame(reason = 'crash') {
    if (game.over) return;
    audio.over();
    game.running = false;
    game.over = true;
    game.paused = false;
    game.keys = {};
    game.pointerActive = false;
    if (dom.pauseOverlay) dom.pauseOverlay.classList.add('hidden');
    game.shake = Math.max(game.shake, 6);
    const finalScore = Math.floor(game.score);
    const clearedLevel = reason === 'levelClear';
    const title = dom.gameOverOverlay ? dom.gameOverOverlay.querySelector('h2') : null;
    const eyebrow = dom.gameOverOverlay ? dom.gameOverOverlay.querySelector('.eyebrow') : null;
    if (title) title.textContent = clearedLevel ? 'Sector Clear!' : game.mode === 'arena' ? 'Race Finished' : 'Ship Down';
    if (eyebrow) eyebrow.textContent = clearedLevel ? 'Mission Complete' : game.mode === 'arena' ? `Final Rank #${getArenaRank()}` : 'Signal Lost';
    if (finalScore > data.bestScore) data.bestScore = finalScore;
    let rewardText = '';
    if (!isGuestMode()) {
      updateLevelProgress(finalScore);
      const rewards = checkMilestoneRewards(finalScore);
      if (rewards.length) {
        rewardText = `Milestone reward unlocked: ${rewards.map((r) => r.reward).join(' + ')}`;
      }
      pushLeaderboard(finalScore);
    }
    saveData();
    updateHUD();
    renderLeaderboard();
    dom.overScore.textContent = formatNumber(finalScore);
    dom.overBest.textContent = formatNumber(data.bestScore);
    dom.overCoins.textContent = formatNumber(game.runCoins);
    const stars = getLevelStars(finalScore);
    dom.overStars.textContent = stars === '—' ? '—' : '★'.repeat(stars) + '☆'.repeat(3 - stars);
    updateGameOverGoalCard(finalScore);
    updateContinueCard(finalScore, rewardText);
    hideOnboardingToast(false);
    dom.gameOverOverlay.classList.remove('hidden');
  }


  function updateContinueCard(finalScore, rewardText = '') {
    if (!dom.continueCard) return;
    const loggedIn = !isGuestMode();
    const levelCleared = game.mode === 'level' && game.levelComplete;
    const canContinue = loggedIn && !levelCleared && !game.continueUsed && !game.revivedThisRun;
    const hasRevive = (data.ownedItems.revive || 0) > 0;
    const hasCoins = (data.coins || 0) >= reviveCoinCost();
    dom.continueCard.classList.toggle('hidden', !canContinue);
    if (canContinue) {
      dom.continueTitle.textContent = hasRevive ? 'Second Wind Available' : hasCoins ? 'Continue with Coins' : 'Need a Revive?';
      dom.continueDesc.textContent = hasRevive
        ? 'Use 1 Revive and keep this run alive.'
        : hasCoins
          ? `Use ${reviveCoinCost()} Coins for one comeback attempt.`
          : 'Starter Bundle includes Revive + Shield for longer runs.';
      dom.continueRunBtn.textContent = hasRevive ? 'Use Revive' : hasCoins ? `Use ${reviveCoinCost()} Coins` : 'Get Bundle';
    }
    const next = nextMilestone();
    const gap = loggedIn ? Math.max(0, next.score - finalScore) : 0;
    dom.overTip.textContent = rewardText || (loggedIn
      ? gap > 0
        ? `Only ${formatNumber(gap)} points from ${next.label}. Reboot your ship and chase ${next.reward}.`
        : `Sector reward ready: ${next.reward}`
      : 'Create an account to save progress, unlock bundles, and enter official rankings.');
  }

  function continueRun() {
    if (isGuestMode()) {
      window.alert('Create an account to use Revive and continue runs.');
      return;
    }
    if (game.continueUsed || game.revivedThisRun) return;
    const hasRevive = (data.ownedItems.revive || 0) > 0;
    if (hasRevive) {
      data.ownedItems.revive -= 1;
    } else if ((data.coins || 0) >= reviveCoinCost()) {
      data.coins -= reviveCoinCost();
    } else {
      activeShopTab = 'bundles';
      renderShop();
      showScreen('shopScreen');
      return;
    }
    game.continueUsed = true;
    game.revivedThisRun = true;
    game.running = true;
    game.over = false;
    game.paused = false;
    game.keys = {};
    game.pointerActive = false;
    game.invincibleTimer = 2.4;
    game.active.shield = Math.max(game.active.shield, 2.4);
    game.shieldHits = 1;
    game.shake = 0;
    game.obstacles = game.obstacles.filter((o) => o.y < -40 || o.y > game.player.y + game.player.r + 120);
    game.lastTime = performance.now();
    dom.gameOverOverlay.classList.add('hidden');
    if (dom.continueCard) dom.continueCard.classList.add('hidden');
    if (dom.pauseOverlay) dom.pauseOverlay.classList.add('hidden');
    saveData();
    updateHUD();
    renderItemDock();
    addFloatingText(game.player.x, game.player.y - 46, 'Second Wind!', '#5cffaa');
    addParticles(game.player.x, game.player.y, 42, '#5cffaa', 240);
    addWave(game.player.x, game.player.y, '#5cffaa');
    audio.skill();
  }

  function updateLevelProgress(finalScore) {
    if (game.mode !== 'level') return;
    const lvl = levelInfo();
    const stars = getLevelStars(finalScore);
    const progress = data.levelProgress[game.level] || { unlocked: true, stars: 0, bestScore: 0 };
    progress.stars = Math.max(progress.stars || 0, stars);
    progress.bestScore = Math.max(progress.bestScore || 0, finalScore);
    progress.unlocked = true;
    data.levelProgress[game.level] = progress;
    if (finalScore >= lvl.goal && LEVELS[game.level]) {
      const next = game.level + 1;
      data.levelProgress[next] = Object.assign({ unlocked: true, stars: 0, bestScore: 0 }, data.levelProgress[next] || {});
      data.levelProgress[next].unlocked = true;
    }
  }

  function pushLeaderboard(score) {
    if (isGuestMode() || score <= 0) return;
    data.leaderboard.push({
      name: data.playerName,
      score,
      player: true,
      date: new Date().toISOString()
    });
    data.leaderboard.sort((a, b) => b.score - a.score);
    data.leaderboard = data.leaderboard.slice(0, 20);
  }

  function addParticles(x, y, count, color, speed = 130) {
    for (let i = 0; i < count; i += 1) {
      const a = rand(0, Math.PI * 2);
      const v = rand(speed * 0.25, speed);
      game.particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        r: rand(2, 5),
        life: rand(0.35, 0.8),
        max: 0.8,
        color
      });
    }
  }

  function addFloatingText(x, y, text, color = '#ffd166') {
    game.floatTexts.push({ x, y, text, color, life: 1, max: 1 });
  }

  function addWave(x, y, color = '#38e8ff') {
    game.waves.push({ x, y, r: 12, life: 0.45, max: 0.45, color });
  }

  function addCoinFlight(x, y) {
    const target = { x: 52, y: 38 };
    game.coinFlights.push({ x, y, sx: x, sy: y, tx: target.x, ty: target.y, life: 0.7, max: 0.7 });
  }

  function spawnObstacle() {
    const baseDifficulty = clamp(1 + game.score / 4600, 1, 3.25);
    const difficulty = game.mode === 'arena' ? baseDifficulty * 1.16 : game.mode === 'level' ? baseDifficulty * 0.88 + game.level * 0.08 : baseDifficulty;
    const lanes = [0, 1, 2];
    let lane = pick(lanes);

    // Arena pressure: hazards more often appear in the current player/rival race lane.
    if (game.mode === 'arena' && Math.random() < 0.42 && game.player) {
      lane = clamp(Math.round((game.player.x - roadLeft()) / Math.max(1, roadWidth() / 2)), 0, 2);
      if (Math.random() < 0.45) lane = pick(lanes.filter((n) => n !== lane));
    }

    // Level mode patterns are more readable and mission-like.
    if (game.mode === 'level' && Math.random() < 0.34) lane = (game.level + Math.floor(game.score / 450)) % 3;

    const type = pickObstacleType(difficulty);
    game.obstacles.push(createSpaceObstacle(type, lane, -92, difficulty));

    // Add readable patterns while always leaving an escape route.
    const patternChance = game.mode === 'arena'
      ? clamp(0.17 + difficulty * 0.06, 0.20, 0.42)
      : game.mode === 'level'
        ? clamp(0.10 + game.level * 0.018, 0.12, 0.24)
        : game.score < 850 ? 0.06 : clamp(0.08 + difficulty * 0.045, 0.12, 0.30);
    if (Math.random() < patternChance) {
      const otherLane = pick(lanes.filter((n) => n !== lane));
      const secondType = pickObstacleType(difficulty * 0.82, true);
      game.obstacles.push(createSpaceObstacle(secondType, otherLane, -185 - rand(0, 70), difficulty * 0.92));
    }
  }

  function pickObstacleType(difficulty, secondary = false) {
    const pool = ['asteroid', 'crystal', 'debris'];
    if (game.mode === 'arena') pool.push('mine', 'drone');
    if (game.mode === 'level') pool.push(game.level >= 2 ? 'satellite' : 'debris');
    if (game.score > 650) pool.push('mine');
    if (game.score > 1100) pool.push('satellite');
    if (game.score > 1800 && !secondary) pool.push('drone');
    if (game.score > 2600 && !secondary) pool.push('plasmaGate');
    if (difficulty > 2.25 && !secondary) pool.push('drone', 'mine');
    return pick(pool);
  }

  function createSpaceObstacle(type, lane, y, difficulty) {
    const laneX = getLaneX(lane);
    const palette = {
      asteroid: { color: '#ff9a3d', warn: '#ffd166' },
      crystal: { color: '#38e8ff', warn: '#38e8ff' },
      debris: { color: '#b8c6e6', warn: '#866bff' },
      satellite: { color: '#866bff', warn: '#b38cff' },
      drone: { color: '#ff4fd8', warn: '#ff4fd8' },
      mine: { color: '#ff5364', warn: '#ff5364' },
      plasmaGate: { color: '#5cffaa', warn: '#5cffaa' }
    }[type] || { color: '#ff9a3d', warn: '#ffd166' };

    const size = {
      asteroid: [rand(48, 62), rand(48, 62)],
      crystal: [rand(42, 52), rand(58, 76)],
      debris: [rand(58, 76), rand(30, 42)],
      satellite: [rand(70, 86), rand(34, 46)],
      drone: [58, 42],
      mine: [46, 46],
      plasmaGate: [rand(76, 92), rand(32, 40)]
    }[type] || [56, 56];

    const driftAllowed = type === 'drone' || type === 'satellite';
    const driftAmp = driftAllowed ? clamp(12 + difficulty * 7 + rand(-4, 8), 10, 34) : 0;
    const speedMul = {
      asteroid: rand(0.88, 1.04),
      crystal: rand(0.92, 1.08),
      debris: rand(0.86, 1.02),
      satellite: rand(0.82, 0.98),
      drone: rand(0.96, 1.13),
      mine: rand(0.90, 1.06),
      plasmaGate: rand(0.84, 0.98)
    }[type] || rand(0.88, 1.08);

    return {
      type,
      x: laneX + rand(-10, 10),
      baseX: laneX + rand(-8, 8),
      y,
      w: size[0],
      h: size[1],
      lane,
      rot: rand(-0.18, 0.18),
      rotSpeed: type === 'mine' ? rand(1.4, 2.2) : type === 'asteroid' ? rand(-0.7, 0.7) : rand(-0.45, 0.45),
      passed: false,
      grazed: false,
      speedMul: speedMul * clamp(0.96 + difficulty * 0.03, 0.98, 1.09),
      driftAmp,
      driftSpeed: rand(1.3, 2.2),
      driftPhase: rand(0, Math.PI * 2),
      age: 0,
      color: palette.color,
      warnColor: palette.warn,
      hitScaleX: type === 'plasmaGate' ? 0.34 : type === 'debris' ? 0.34 : type === 'satellite' ? 0.36 : 0.38,
      hitScaleY: type === 'plasmaGate' ? 0.32 : type === 'crystal' ? 0.36 : 0.38
    };
  }
  function spawnCoins() {
    const lane = Math.floor(rand(0, 3));
    const count = game.mode === 'level' ? Math.floor(rand(5, 9)) : game.mode === 'arena' ? Math.floor(rand(2, 5)) : Math.floor(rand(3, 7));
    const pattern = game.mode === 'level' ? 'missionLine' : game.mode === 'arena' ? 'split' : 'wave';
    for (let i = 0; i < count; i += 1) {
      const laneOffset = pattern === 'missionLine' ? 0 : pattern === 'split' ? (i % 2 === 0 ? -18 : 18) : Math.sin(i * 0.8) * 14;
      const coinLane = pattern === 'split' && i > 2 && Math.random() < 0.35 ? (lane + 1) % 3 : lane;
      game.coins.push({
        x: getLaneX(coinLane) + laneOffset,
        y: -60 - i * (game.mode === 'level' ? 32 : 38),
        r: game.mode === 'level' ? 11 : 10,
        value: game.mode === 'arena' ? (Math.random() < 0.06 ? 5 : 1) : Math.random() < 0.10 ? 5 : 1,
        spin: rand(0, Math.PI * 2),
        magneted: false,
        missionCoin: game.mode === 'level'
      });
    }
  }

  function updateGame(dt) {
    if (!game.running || game.paused || game.over) return;
    if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
    dt = clamp(dt, 1 / 240, 0.033);
    saveTimer += dt;
    ambientTick += dt;
    updateMotionState(dt);

    const rules = modeRules();
    const baseDiff = clamp(1 + game.score / 4200, 1, 3.4);
    const diff = game.mode === 'arena' ? clamp(baseDiff * 1.12, 1.05, 3.8) : game.mode === 'level' ? clamp(baseDiff * 0.86 + game.level * 0.08, 1, 3.2) : baseDiff;
    const boostMul = game.speedFx || 1;
    game.speed = (game.baseSpeed + game.score * (game.mode === 'arena' ? 0.055 : game.mode === 'level' ? 0.034 : 0.045)) * boostMul;
    game.distance += game.speed * dt;

    const scoreGain = (70 + diff * 18) * dt * boostMul * rules.scoreMul;
    game.score += scoreGain;
    if (scoreGain > 0 || game.speed > 0) lastProgressAt = performance.now();
    if (game.mode === 'arena') {
      const rank = getArenaRank();
      // Higher rank earns a small live-race score bonus.
      game.score += Math.max(0, 7 - rank) * 3.8 * dt;
    }

    if (game.mode === 'level') {
      const lvl = levelInfo();
      const scoreDone = game.score >= lvl.goal;
      const coinsDone = game.collectedLevelCoins >= lvl.coins;
      if (scoreDone && coinsDone && !game.levelComplete) {
        game.levelComplete = true;
        addFloatingText(W / 2, H * 0.3, 'Mission Complete!', '#5cffaa');
        addParticles(W / 2, H * 0.34, 48, '#5cffaa', 230);
        endGame('levelClear');
        return;
      }
    }

    if (game.score >= game.nextScoreSfx) {
      audio.score();
      game.nextScoreSfx += 500;
    }

    Object.keys(game.active).forEach((key) => {
      if (game.active[key] > 0) game.active[key] = Math.max(0, game.active[key] - dt);
    });
    Object.keys(game.cooldowns).forEach((key) => {
      if (game.cooldowns[key] > 0) game.cooldowns[key] = Math.max(0, game.cooldowns[key] - dt);
    });
    if (game.active.shield <= 0) game.shieldHits = 0;
    game.invincibleTimer = Math.max(0, game.invincibleTimer - dt);
    game.shake = Math.max(0, game.shake - dt * 18);
    game.arenaRankFlash = Math.max(0, (game.arenaRankFlash || 0) - dt);
    game.modeBonusTimer = Math.max(0, (game.modeBonusTimer || 0) - dt);

    updatePlayer(dt);

    game.spawnTimer -= dt;
    const spawnRate = clamp((0.94 - diff * 0.105) / rules.spawnMul, game.mode === 'arena' ? 0.34 : 0.42, game.mode === 'level' ? 0.96 : 0.82);
    if (game.spawnTimer <= 0) {
      spawnObstacle();
      game.spawnTimer = spawnRate + rand(-0.10, game.mode === 'arena' ? 0.10 : 0.18);
    }

    game.coinTimer -= dt;
    if (game.coinTimer <= 0) {
      spawnCoins();
      const coinBase = game.mode === 'level' ? rand(0.86, 1.28) : game.mode === 'arena' ? rand(1.35, 2.05) : rand(1.15, 1.95);
      game.coinTimer = coinBase / clamp(diff * 0.72 * rules.coinMul, 0.86, 2.1);
    }

    updateObstacles(dt);
    updateCoins(dt);
    updateVisuals(dt);
    updateRivals(dt);
    updateHUD();
    renderItemDock(false);
    updateMiniLeaderboard();

    if (saveTimer > 2.5) {
      saveTimer = 0;
      saveData();
    }
  }

  function updateMotionState(dt) {
    const boostActive = game.active.speedBoost > 0;
    if (boostActive && !game.boostActiveLast) {
      game.boostPulse = 1;
      game.shake = Math.max(game.shake, 3.5);
      audio.boost();
    }
    if (!boostActive && game.boostActiveLast) {
      game.brakePulse = 1;
      game.shake = Math.max(game.shake, 4.5);
      if (game.player) addParticles(game.player.x, game.player.y + game.player.r * 0.85, 18, '#38e8ff', 150);
    }
    game.boostActiveLast = boostActive;
    const targetFx = boostActive ? 1.34 : 1;
    const response = boostActive ? 7.5 : 3.6;
    game.speedFx = lerp(game.speedFx || 1, targetFx, clamp(dt * response, 0, 1));
    game.boostPulse = Math.max(0, game.boostPulse - dt * 2.7);
    game.brakePulse = Math.max(0, game.brakePulse - dt * 1.9);
    audio.updateEngine(boostActive);
  }


  function updatePlayer(dt) {
    const p = game.player;
    if (!p) return;

    const beforeX = p.x;
    const beforeY = p.y;

    const boostActive = game.active.speedBoost > 0;
    const maxSpeedX = 650 * (boostActive ? 1.08 : 1);
    const maxSpeedY = 440 * (boostActive ? 1.04 : 1);
    const accel = boostActive ? 12.8 : 11.4;
    const release = 8.4;

    let ax = 0;
    let ay = 0;
    if (game.keys.ArrowLeft || game.keys.KeyA) ax -= 1;
    if (game.keys.ArrowRight || game.keys.KeyD) ax += 1;
    if (game.keys.ArrowUp || game.keys.KeyW) ay -= 1;
    if (game.keys.ArrowDown || game.keys.KeyS) ay += 1;

    let targetVx = 0;
    let targetVy = 0;
    let pointerDX = 0;
    let pointerDY = 0;

    if (game.pointerActive) {
      pointerDX = game.targetX - p.x;
      pointerDY = game.targetY - p.y;

      // Mobile controls should feel like dragging the ship, not chasing a distant tap point.
      const mobile = isMobileLayout();
      const dead = mobile ? 2 : Math.max(6, p.r * 0.22);
      const dx = Math.abs(pointerDX) < dead ? 0 : pointerDX;
      const dy = Math.abs(pointerDY) < dead ? 0 : pointerDY;
      targetVx = clamp(dx * (mobile ? 10.8 : 5.9), -maxSpeedX * (mobile ? 1.22 : 1), maxSpeedX * (mobile ? 1.22 : 1));
      targetVy = clamp(dy * (mobile ? 7.2 : 4.7), -maxSpeedY * (mobile ? 0.88 : 1), maxSpeedY * (mobile ? 0.88 : 1));
    } else if (ax || ay) {
      const len = Math.hypot(ax, ay) || 1;
      targetVx = (ax / len) * maxSpeedX;
      targetVy = (ay / len) * maxSpeedY;
    } else {
      // Softly return to a visible cruising position that is not hidden behind mobile UI.
      const cruiseY = mobileShipStartY();
      targetVx = 0;
      targetVy = clamp((cruiseY - p.y) * (isMobileLayout() ? 3.0 : 2.2), -maxSpeedY * 0.42, maxSpeedY * 0.42);
    }

    const mobileResponse = isMobileLayout() && game.pointerActive;
    p.controlVx = lerp(p.controlVx || 0, targetVx, clamp(dt * (mobileResponse ? 18.5 : (targetVx ? accel : release)), 0, 1));
    p.controlVy = lerp(p.controlVy || 0, targetVy, clamp(dt * (mobileResponse ? 13.5 : (targetVy ? accel : release)), 0, 1));

    p.x += p.controlVx * dt;
    p.y += p.controlVy * dt;

    const margin = p.r + 12;
    p.x = clamp(p.x, roadLeft() + margin, roadRight() - margin);
    const bounds = mobileControlBounds();
    p.y = clamp(p.y, bounds.top, bounds.bottom);

    // Prevent sticky edge jitter.
    if (p.x <= roadLeft() + margin + 1 && p.controlVx < 0) p.controlVx *= 0.25;
    if (p.x >= roadRight() - margin - 1 && p.controlVx > 0) p.controlVx *= 0.25;

    const vxNow = (p.x - beforeX) / Math.max(dt, 0.001);
    const vyNow = (p.y - beforeY) / Math.max(dt, 0.001);
    p.vx = lerp(p.vx || 0, vxNow, clamp(dt * 15, 0, 1));
    p.vy = lerp(p.vy || 0, vyNow, clamp(dt * 15, 0, 1));

    const pointerTurn = game.pointerActive ? clamp(pointerDX / Math.max(roadWidth() * 0.28, 1), -1, 1) : 0;
    const inputTurn = game.pointerActive ? pointerTurn * 0.30 : ax * 0.23;
    const velocityTurn = clamp(p.vx / Math.max(maxSpeedX, 1), -1, 1) * 0.45;
    const targetTurn = clamp(inputTurn + velocityTurn, -0.42, 0.42);

    p.turn = lerp(p.turn || 0, targetTurn, clamp(dt * 10.5, 0, 1));
    p.turnPose = lerp(p.turnPose || 0, p.turn, clamp(dt * (Math.abs(targetTurn) > Math.abs(p.turnPose || 0) ? 9.8 : 7.2), 0, 1));
    p.tilt = lerp(p.tilt || 0, p.turnPose * 0.15, clamp(dt * 8.2, 0, 1));
    p.torsoTurn = lerp(p.torsoTurn || 0, p.turnPose * 0.55 + velocityTurn * 0.06, clamp(dt * 7.8, 0, 1));
    p.headTurn = lerp(p.headTurn || 0, p.turnPose * 0.62, clamp(dt * 8.5, 0, 1));
    p.hipShift = lerp(p.hipShift || 0, -p.turnPose * 0.08, clamp(dt * 8, 0, 1));
    p.sideStep = lerp(p.sideStep || 0, p.turnPose * 0.08, clamp(dt * 10, 0, 1));

    const moveEnergy = clamp(Math.hypot(p.vx, p.vy) / 460, 0, 1.4);
    const turnEnergy = Math.abs(p.turnPose || 0);
    const runRate = 6.2 + (game.speedFx || 1) * 2.2 + moveEnergy * 1.35 + turnEnergy * 0.25;
    p.runCycle = (p.runCycle || 0) + dt * runRate * (boostActive ? 1.18 : 1);
    p.strideIntensity = lerp(p.strideIntensity || 1, clamp(0.98 + moveEnergy * 0.22 + (boostActive ? 0.10 : 0), 0.96, 1.24), clamp(dt * 6, 0, 1));

    const braking = game.active.speedBoost <= 0 && (game.speedFx || 1) > 1.035;
    p.brake = lerp(p.brake || 0, braking ? 1 : 0, clamp(dt * 7, 0, 1));

    // Light thruster particles on direction changes, not noisy footstep particles.
    if (Math.abs(p.turnPose || 0) > 0.18 && Math.random() < dt * 10) {
      addParticles(
        p.x - Math.sign(p.turnPose || 1) * p.r * 0.65,
        p.y + p.r * 0.78,
        1,
        Math.abs(p.turnPose) > 0.42 ? '#ffd166' : '#38e8ff',
        78 + turnEnergy * 34
      );
    }

    const trailLife = boostActive ? 0.56 : 0.40;
    const turnGlow = clamp(turnEnergy * 1.15 + p.brake * 0.65 + (boostActive ? 0.35 : 0), 0, 1.35);
    p.trail.unshift({
      x: p.x - (p.turnPose || 0) * p.r * 0.24,
      y: p.y + p.r * 0.55,
      life: trailLife,
      max: trailLife,
      r: p.r * (boostActive ? 0.72 : 0.52),
      turn: p.turnPose || 0,
      glow: turnGlow
    });
    p.trail = p.trail.filter((t) => (t.life -= dt) > 0).slice(0, boostActive ? 20 : 12);
  }

  function updateObstacles(dt) {
    const speed = game.speed;
    for (const obstacle of game.obstacles) {
      obstacle.age = (obstacle.age || 0) + dt;
      obstacle.y += speed * obstacle.speedMul * dt;
      obstacle.rot += (obstacle.rotSpeed || 0.45) * dt;

      if (obstacle.driftAmp) {
        const drift = Math.sin(obstacle.age * obstacle.driftSpeed + obstacle.driftPhase) * obstacle.driftAmp;
        obstacle.x = clamp(obstacle.baseX + drift, roadLeft() + obstacle.w * 0.62, roadRight() - obstacle.w * 0.62);
      }

      if (!obstacle.passed && obstacle.y > game.player.y + game.player.r) {
        obstacle.passed = true;
        game.score += obstacle.type === 'plasmaGate' || obstacle.type === 'drone' ? 24 : 18;
      }

      if (nearMiss(obstacle, game.player)) {
        obstacle.grazed = true;
        game.score += 14;
        game.boostPulse = Math.max(game.boostPulse, 0.20);
        addFloatingText(game.player.x, game.player.y - 34, 'Clean Dodge +14', '#ffd166');
        addParticles(game.player.x, game.player.y + game.player.r * 0.35, 10, obstacle.warnColor || '#ffd166', 120);
      }

      if (rectCircleHit(obstacle, game.player) && game.invincibleTimer <= 0) {
        handleCrash(obstacle);
      }
    }
    game.obstacles = game.obstacles.filter((obstacle) => obstacle.y < H + 140 && !obstacle.dead);
  }
  function updateCoins(dt) {
    const magnet = game.active.magnet > 0;
    for (const coin of game.coins) {
      coin.y += game.speed * 0.92 * dt;
      coin.spin += dt * 6;
      if (magnet) {
        const dx = game.player.x - coin.x;
        const dy = game.player.y - coin.y;
        const distance = Math.hypot(dx, dy);
        const range = magnetRange();
        if (distance < range) {
          coin.magneted = true;
          const pull = clamp((range - distance) / range, 0.10, 0.95);
          coin.x += dx * pull * dt * (7.5 + upgradeLevel('magnetRange') * 0.65);
          coin.y += dy * pull * dt * (7.5 + upgradeLevel('magnetRange') * 0.65);
          if (Math.random() < dt * 14) addParticles(coin.x, coin.y, 1, '#ffd166', 70);
        }
      }
      const hitDistance = game.player.r + coin.r + (coin.magneted ? 16 : 0);
      if (Math.hypot(game.player.x - coin.x, game.player.y - coin.y) < hitDistance) {
        collectCoin(coin);
      }
    }
    game.coins = game.coins.filter((coin) => coin.y < H + 80 && !coin.dead);
  }

  function updateVisuals(dt) {
    game.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 140 * dt;
      p.life -= dt;
    });
    game.particles = game.particles.filter((p) => p.life > 0);

    game.floatTexts.forEach((f) => {
      f.y -= 42 * dt;
      f.life -= dt;
    });
    game.floatTexts = game.floatTexts.filter((f) => f.life > 0);

    game.coinFlights.forEach((c) => {
      c.life -= dt;
      const t = 1 - c.life / c.max;
      const ease = 1 - Math.pow(1 - t, 3);
      c.x = lerp(c.sx, c.tx, ease);
      c.y = lerp(c.sy, c.ty, ease) - Math.sin(t * Math.PI) * 40;
    });
    game.coinFlights = game.coinFlights.filter((c) => c.life > 0);

    game.waves.forEach((w) => {
      w.life -= dt;
      w.r += 240 * dt;
    });
    game.waves = game.waves.filter((w) => w.life > 0);
  }

  function updateRivals(dt) {
    if (game.mode !== 'arena') return;
    const prevRank = game.arenaRank || getArenaRank();
    game.rivals.forEach((rival, index) => {
      if (game.score > rival.boostAt && rival.burst <= 0) {
        rival.burst = rand(1.1, 2.2);
        rival.boostAt += rand(900, 2100);
        rival.targetLane = Math.floor(rand(0, 3));
      }
      rival.moveTimer -= dt;
      if (rival.moveTimer <= 0) {
        rival.moveTimer = rand(0.8, 2.2);
        rival.targetLane = Math.floor(rand(0, 3));
      }
      rival.lane = lerp(rival.lane, rival.targetLane, clamp(dt * 1.9, 0, 1));
      rival.x = lerp(rival.x || getLaneX(rival.lane), getLaneX(rival.lane), clamp(dt * 4.2, 0, 1));
      rival.y = H * (0.24 + index * 0.075) + Math.sin((game.distance * 0.006) + index) * 10;
      const burstMul = rival.burst > 0 ? 1.55 : 1;
      rival.score += (58 + game.score / 130) * rival.pace * burstMul * dt;
      rival.burst = Math.max(0, rival.burst - dt);
    });
    const nextRank = getArenaRank();
    game.arenaRank = nextRank;
    if (nextRank < prevRank) {
      game.arenaRankFlash = 1;
      game.score += 75;
      addFloatingText(game.player.x, game.player.y - 46, `Overtake! Rank #${nextRank}`, '#5cffaa');
      addParticles(game.player.x, game.player.y, 20, '#5cffaa', 180);
    }
  }

  function rectCircleHit(rect, circle) {
    // Forgiving danger core: the visual object is larger than the real crash zone.
    const halfW = rect.w * (rect.hitScaleX || 0.38);
    const halfH = rect.h * (rect.hitScaleY || 0.38);
    const nearestX = clamp(circle.x, rect.x - halfW, rect.x + halfW);
    const nearestY = clamp(circle.y, rect.y - halfH, rect.y + halfH);
    const dx = circle.x - nearestX;
    const dy = circle.y - nearestY;
    const hitR = circle.r * 0.64;
    return dx * dx + dy * dy < hitR * hitR;
  }

  function nearMiss(rect, circle) {
    if (rect.grazed || rect.passed) return false;
    const dy = Math.abs(rect.y - circle.y);
    const dx = Math.abs(rect.x - circle.x);
    const sideWindow = rect.w * 0.56 + circle.r * 1.35;
    return dy < rect.h * 0.62 && dx < sideWindow && !rectCircleHit(rect, circle);
  }
  function handleCrash(obstacle) {
    if (obstacle.dead) return;
    if (game.shieldHits > 0 && game.active.shield > 0) {
      game.shieldHits -= 1;
      obstacle.dead = true;
      game.invincibleTimer = 0.55;
      game.shake = 8;
      audio.hit();
      addFloatingText(game.player.x, game.player.y - 30, 'Shield block!', '#38e8ff');
      addParticles(obstacle.x, obstacle.y, 24, '#38e8ff', 210);
      if (game.shieldHits <= 0) game.active.shield = 0;
      return;
    }

    if ((game.reviveArmed || data.ownedItems.revive > 0) && !game.revivedThisRun) {
      if (!game.reviveArmed) data.ownedItems.revive = Math.max(0, data.ownedItems.revive - 1);
      game.revivedThisRun = true;
      game.reviveArmed = false;
      obstacle.dead = true;
      game.obstacles.forEach((o) => { o.dead = true; });
      game.invincibleTimer = 2.2;
      game.active.shield = 2.2;
      game.shieldHits = 1;
      game.shake = 10;
      audio.skill();
      saveData();
      addFloatingText(game.player.x, game.player.y - 42, 'Revived!', '#5cffaa');
      addParticles(game.player.x, game.player.y, 46, '#5cffaa', 280);
      addWave(game.player.x, game.player.y, '#5cffaa');
      return;
    }

    audio.hit();
    obstacle.dead = true;
    addParticles(game.player.x, game.player.y, 42, '#ff5364', 280);
    endGame('crash');
  }

  function collectCoin(coin) {
    coin.dead = true;
    const mult = game.active.doubleCoins > 0 ? 2 : 1;
    const bonus = coinBonusMultiplier();
    const earned = Math.max(1, Math.round(coin.value * mult * bonus));
    game.runCoins += earned;
    game.collectedLevelCoins += earned;
    data.coins += earned;
    game.score += coin.value * 10;
    audio.coin();
    addParticles(coin.x, coin.y, 10, '#ffd166', 150);
    addFloatingText(coin.x, coin.y - 8, `+${earned}`, '#ffd166');
    addCoinFlight(coin.x, coin.y);
    if (game.active.doubleCoins > 0) addWave(coin.x, coin.y, '#ffd166');
  }


  function itemStatusMessage(message, color = '#ffd166') {
    if (!message) return;
    try {
      const p = game.player || { x: W / 2, y: H * 0.72 };
      addFloatingText(p.x, p.y - 46, message, color);
    } catch (error) {
      console.warn('Item status skipped:', message);
    }
  }

  function canUseFreeSprint() {
    return game.running && !game.paused && !game.over && game.cooldowns.sprint <= 0 && game.active.speedBoost <= 0;
  }

  function itemCanUse(key) {
    if (!ITEMS[key]) return { ok: false, reason: 'Unknown item' };
    if (!game.running || game.paused || game.over) return { ok: false, reason: 'Not in run' };
    if (key === 'speedBoost' && (data.ownedItems.speedBoost || 0) <= 0) {
      if (canUseFreeSprint()) return { ok: true, freeSprint: true };
      if (game.active.speedBoost > 0) return { ok: false, reason: 'Boost active' };
      if (game.cooldowns.sprint > 0) return { ok: false, reason: 'Sprint cooling' };
    }
    if (key !== 'revive' && game.cooldowns[key] > 0) return { ok: false, reason: 'Cooling down' };
    if (key !== 'bomb' && key !== 'revive' && game.active[key] > 0) return { ok: false, reason: 'Already active' };
    if ((data.ownedItems[key] || 0) <= 0) return { ok: false, reason: 'No item stock' };
    if (key === 'revive' && (game.reviveArmed || game.revivedThisRun)) return { ok: false, reason: 'Revive already set' };
    return { ok: true };
  }

  function refreshItemDockSoon(force = false) {
    renderItemDock(force);
  }

  function useItem(key, options = {}) {
    const item = ITEMS[key];
    if (!item) return false;

    const status = itemCanUse(key);
    if (!status.ok) {
      if (key === 'speedBoost' && options.allowFreeSprint) {
        const sprinted = useFreeSprint();
        if (!sprinted && status.reason) itemStatusMessage(status.reason, '#ff5364');
        return sprinted;
      }
      itemStatusMessage(status.reason, status.reason === 'No item stock' ? '#ff5364' : '#ffd166');
      refreshItemDockSoon(true);
      return false;
    }

    if (status.freeSprint || (key === 'speedBoost' && options.allowFreeSprint && (data.ownedItems.speedBoost || 0) <= 0)) {
      return useFreeSprint();
    }

    if (key === 'revive') {
      data.ownedItems.revive = Math.max(0, (data.ownedItems.revive || 0) - 1);
      game.reviveArmed = true;
      itemStatusMessage('Revive ready', '#5cffaa');
      audio.skill();
      saveData();
      refreshItemDockSoon(true);
      return true;
    }

    data.ownedItems[key] = Math.max(0, (data.ownedItems[key] || 0) - 1);

    if (key === 'shield') {
      game.active.shield = shieldDuration(item.duration);
      game.shieldHits = 1;
    } else if (key === 'magnet') {
      game.active.magnet = item.duration + upgradeLevel('magnetRange') * 0.35;
    } else if (key === 'doubleCoins') {
      game.active.doubleCoins = item.duration;
    } else if (key === 'speedBoost') {
      game.active.speedBoost = boostDuration(item.duration);
      game.boostPulse = 1;
      audio.boost();
      game.speedFx = Math.max(game.speedFx || 1, boostPower());
    } else if (key === 'bomb') {
      game.active.bomb = 0.2;
      const visible = game.obstacles.filter((o) => !o.dead && o.y > -120 && o.y < H + 90);
      const cleared = visible.length || game.obstacles.filter((o) => !o.dead).length;
      game.obstacles.forEach((o) => {
        if (o.y > -220 && o.y < H + 160) {
          o.dead = true;
          addParticles(o.x, o.y, 14, '#ff4fd8', 230);
        }
      });
      game.score += cleared * 36;
      game.shake = 10;
      game.invincibleTimer = Math.max(game.invincibleTimer, 0.55);
    }

    game.cooldowns[key] = item.cooldown || 0;
    addWave(game.player.x, game.player.y, key === 'shield' ? '#38e8ff' : key === 'bomb' ? '#ff4fd8' : '#ffd166');
    itemStatusMessage(item.name, '#ffffff');
    audio.skill();
    saveData();
    updateHUD();
    refreshItemDockSoon(true);
    return true;
  }


  function useFreeSprint() {
    if (!game.running || game.paused || game.over) return false;
    if (game.active.speedBoost > 0) {
      itemStatusMessage('Boost active', '#ffd166');
      refreshItemDockSoon(true);
      return false;
    }
    if (game.cooldowns.sprint > 0) {
      itemStatusMessage('Sprint cooling', '#ffd166');
      refreshItemDockSoon(true);
      return false;
    }
    game.active.speedBoost = boostDuration(2.1);
    game.cooldowns.sprint = 9;
    game.boostPulse = 1;
    audio.boost();
    game.speedFx = Math.max(game.speedFx || 1, boostPower());
    addWave(game.player.x, game.player.y, '#ffd166');
    itemStatusMessage('Sprint!', '#ffd166');
    audio.skill();
    refreshItemDockSoon(true);
    return true;
  }

  function updateHUD() {
    dom.scoreHud.textContent = formatNumber(game.score || 0);
    dom.bestHud.textContent = formatNumber(data.bestScore || 0);
    dom.coinsHud.textContent = formatNumber(data.coins || 0);
    const sector = currentSector();
    dom.modeHud.textContent = modeStoryLabel();
    if (dom.sectorHud) {
      dom.sectorHud.innerHTML = `<span>${modeRules().title}</span><strong>${sector.name}</strong><small>${modeBrief()}</small>`;
    }
    dom.shopCoins.textContent = formatNumber(data.coins || 0);
    updateGoalCard();
  }

  function itemDockKeyState(key) {
    const item = ITEMS[key];
    const count = data.ownedItems[key] || 0;
    const cool = game.cooldowns[key] || 0;
    const active = game.active[key] || 0;
    const sprintCool = game.cooldowns.sprint || 0;
    const canSprint = key === 'speedBoost' && count <= 0 && sprintCool <= 0 && active <= 0 && game.running && !game.paused && !game.over;
    const disabled = key === 'speedBoost'
      ? (!canSprint && count <= 0) || cool > 0 || active > 0 || sprintCool > 0
      : count <= 0 || cool > 0 || active > 0 || (key === 'revive' && (game.reviveArmed || game.revivedThisRun));
    const cooldownBase = key === 'speedBoost' && count <= 0 ? 9 : (item.cooldown || 1);
    const displayCool = key === 'speedBoost' && count <= 0 ? sprintCool : cool;
    const pct = displayCool > 0 ? clamp(displayCool / cooldownBase, 0, 1) * 100 : 0;
    return { item, count, cool, active, sprintCool, canSprint, disabled, pct };
  }

  function buildItemDockSignature() {
    const keys = ['shield', 'magnet', 'doubleCoins', 'bomb', 'speedBoost', 'revive'];
    return keys.map((key) => {
      const s = itemDockKeyState(key);
      return [
        key,
        s.count,
        Math.ceil((s.cool || 0) * 10) / 10,
        Math.ceil((s.active || 0) * 10) / 10,
        Math.ceil((s.sprintCool || 0) * 10) / 10,
        s.disabled ? 1 : 0,
        game.reviveArmed ? 1 : 0,
        game.revivedThisRun ? 1 : 0,
        game.running ? 1 : 0,
        game.paused ? 1 : 0,
        game.over ? 1 : 0
      ].join(':');
    }).join('|');
  }

  function renderItemDock(force = true) {
    if (!dom.itemDock) return;
    if (!force && currentScreen !== 'gameScreen') return;

    const now = performance.now();
    const signature = buildItemDockSignature();
    if (!force && signature === itemDockSignature && now - itemDockLastRenderAt < 180) return;
    itemDockSignature = signature;
    itemDockLastRenderAt = now;

    const keys = ['shield', 'magnet', 'doubleCoins', 'bomb', 'speedBoost', 'revive'];
    dom.itemDock.innerHTML = keys.map((key) => {
      const s = itemDockKeyState(key);
      const item = s.item;
      const countText = key === 'speedBoost' && s.count <= 0 ? 'FREE' : s.count;
      const label = key === 'doubleCoins' ? '2X' : key === 'speedBoost' ? 'SPD' : item.name.split(' ')[0].slice(0, 3).toUpperCase();
      const activeClass = s.active > 0 || (key === 'revive' && game.reviveArmed) ? 'active' : '';
      const freeClass = s.canSprint ? 'free-sprint' : '';
      return `<button class="item-btn item-${key} ${s.disabled ? 'disabled' : ''} ${activeClass} ${freeClass}" data-use-item="${key}" title="${item.name}" aria-label="${item.name}">
        <b>${item.icon}</b><small>${label}</small><span class="count">${countText}</span><span class="cooldown-mask" style="height:${s.pct}%"></span>
      </button>`;
    }).join('');
  }


  function isMobileLayout() {
    return document.body.classList.contains('is-mobile') || window.innerWidth <= 820 || window.innerHeight <= 560;
  }

  function mobileShipStartY() {
    // Keep the ship above the bottom item dock / boost button on mobile.
    if (!isMobileLayout()) return H * 0.75;
    const landscape = window.innerWidth > window.innerHeight;
    return clamp(H * (landscape ? 0.62 : 0.60), H * 0.46, H - 180);
  }

  function mobileTouchShipOffset() {
    // Finger is below the ship, so the player can see the ship while dragging.
    if (!isMobileLayout()) return 0;
    return clamp(H * 0.15, 72, 132);
  }

  function mobileControlBounds() {
    const marginX = (game.player?.r || 24) + 16;
    const top = isMobileLayout() ? H * 0.35 : H * 0.35;
    const bottomSafe = isMobileLayout()
      ? Math.min(H - 132, H - ((game.player?.r || 24) + 104))
      : H - ((game.player?.r || 24) + 24);
    return {
      left: roadLeft() + marginX,
      right: roadRight() - marginX,
      top,
      bottom: Math.max(top + 40, bottomSafe)
    };
  }

  function setPlayerTarget(x, y) {
    const bounds = mobileControlBounds();
    game.targetX = clamp(x, bounds.left, bounds.right);
    game.targetY = clamp(y, bounds.top, bounds.bottom);
    if (game.player) {
      game.player.targetX = game.targetX;
      game.player.targetY = game.targetY;
    }
  }

  function setMobileItemsOpen(open) {
    document.body.classList.toggle('mobile-items-open', !!open);
    if (mobileItemsCloseTimer) {
      clearTimeout(mobileItemsCloseTimer);
      mobileItemsCloseTimer = 0;
    }
    if (open) {
      mobileItemsCloseTimer = setTimeout(() => {
        document.body.classList.remove('mobile-items-open');
        mobileItemsCloseTimer = 0;
      }, 3600);
    }
  }

  function toggleMobileItems(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    const now = performance.now();
    if (event && event.type === 'touchend') mobileItemsTouchAt = now;
    if (event && event.type === 'click' && mobileItemsTouchAt && now - mobileItemsTouchAt < 700) return;
    setMobileItemsOpen(!document.body.classList.contains('mobile-items-open'));
  }


  function updateMiniLeaderboard() {
    if (!dom.miniLeaderboard || currentScreen !== 'gameScreen') return;
    let rows;
    if (isGuestMode()) {
      rows = AI_NAMES.slice(0, 4).map((name, i) => ({ name, score: Math.max(0, Math.floor(game.score * (0.72 - i * 0.08) + 260 - i * 40)), me: false }));
      rows.push({ name: data.playerName || 'Guest Rookie', score: Math.floor(game.score), me: true });
    } else if (game.mode === 'arena') {
      rows = game.rivals.map((r) => ({ name: r.name, score: Math.floor(r.score), me: false }));
      rows.push({ name: data.playerName, score: Math.floor(game.score), me: true });
    } else {
      rows = data.leaderboard.slice(0, 4).map((entry) => ({ name: entry.name, score: entry.score, me: entry.player && entry.name === data.playerName }));
      rows.push({ name: data.playerName, score: Math.floor(game.score), me: true });
    }
    rows.sort((a, b) => b.score - a.score);
    rows = rows.slice(0, 5);
    dom.miniLeaderboard.innerHTML = '<h4>Live Rank</h4>' + rows.map((row, i) =>
      `<div class="mini-row ${row.me ? 'me' : ''}"><span>#${i + 1} ${escapeHtml(row.name)}</span><strong>${formatNumber(row.score)}</strong></div>`
    ).join('');
  }

  function renderLeaderboard() {
    if (isGuestMode()) {
      dom.leaderboardList.innerHTML = '<p class="subtitle">Login or register to save official local leaderboard records. Guest Rookie runs are for practice only.</p>';
      return;
    }
    const rows = data.leaderboard.slice().sort((a, b) => b.score - a.score).slice(0, 10);
    if (!rows.length) {
      dom.leaderboardList.innerHTML = '<p class="subtitle">No local scores yet. Start a run and claim the board.</p>';
      return;
    }
    dom.leaderboardList.innerHTML = rows.map((entry, index) => `
      <div class="leader-row ${entry.player && entry.name === data.playerName ? 'me' : ''}">
        <div class="rank-badge">#${index + 1}</div>
        <div><strong>${escapeHtml(entry.name)}</strong><br><small>${entry.player ? 'Your local run' : 'AI seed score'}</small></div>
        <div class="leader-score">${formatNumber(entry.score)}</div>
      </div>
    `).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function renderModes() {
    sanitizeModeSelection(selectedMode, selectedLevel);
    $$('.mode-card').forEach((card) => {
      card.classList.toggle('selected', card.dataset.mode === selectedMode);
    });
    dom.levelSelect.classList.toggle('hidden', selectedMode !== 'level');
    if (selectedMode === 'level') renderLevelSelect();
  }

  function renderLevelSelect() {
    if (!isLevelUnlocked(selectedLevel)) selectedLevel = firstUnlockedLevel();
    dom.levelSelect.innerHTML = LEVELS.map((lvl) => {
      const progress = data.levelProgress[lvl.level] || {};
      const locked = lvl.level !== 1 && !progress.unlocked;
      const stars = progress.stars || 0;
      return `<button class="level-btn ${locked ? 'locked' : ''} ${selectedLevel === lvl.level ? 'selected' : ''}" data-level="${lvl.level}" ${locked ? 'disabled' : ''}>
        Sector ${lvl.level}<small>${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${GALAXY_SECTORS[(lvl.level - 1) % GALAXY_SECTORS.length].name}</small>
      </button>`;
    }).join('');
  }

  function renderShop() {
    updateHUD();
    $$('.tab-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === activeShopTab));

    if (activeShopTab === 'bundles') {
      dom.shopContent.innerHTML = `<div class="card-grid">${BUNDLES.map((bundle) => {
        const owned = data.purchasedBundles.includes(bundle.id);
        const skin = SKINS.find((s) => s.id === bundle.skin);
        const itemLine = Object.entries(bundle.items).map(([key, count]) => `${ITEMS[key].icon} ${count}`).join(' · ');
        return `<div class="shop-card bundle-card ${bundle.badge === 'Best Value' ? 'featured' : ''}">
          <div class="deal-badge">${bundle.badge}</div>
          <h3>${bundle.name}</h3>
          <p>${bundle.desc}<br><span class="price">${bundle.price}</span><br>${formatNumber(bundle.coins)} Coins · ${itemLine}<br><small>${skin ? `Includes ${skin.name} ship` : 'Bonus ship included'} · Recharge checkout available.</small></p>
          <button class="buy-btn" data-buy-bundle="${bundle.id}">${owned ? 'Buy Again' : 'Buy Bundle'}</button>
        </div>`;
      }).join('')}</div>`;
    }

    if (activeShopTab === 'coins') {
      dom.shopContent.innerHTML = `<div class="card-grid">${COIN_PACKS.map((pack) => `
        <div class="shop-card">
          <h3>${pack.name}</h3>
          <p><span class="price">${pack.price}</span><br>${formatNumber(pack.coins)} Coins<br><small>Recharge with Credit Card, Apple Pay, or Google Pay.</small></p>
          <button class="buy-btn" data-buy-pack="${pack.id}">Recharge</button>
        </div>`).join('')}</div>`;
    }

    if (activeShopTab === 'items') {
      dom.shopContent.innerHTML = `<div class="card-grid">${Object.entries(ITEMS).map(([key, item]) => `
        <div class="shop-card">
          <h3>${item.icon} ${item.name}</h3>
          <p>${item.desc}<br><span class="price">${item.cost} Coins</span><br>Owned: <strong>${data.ownedItems[key] || 0}</strong></p>
          <button class="buy-btn" data-buy-item="${key}">Buy</button>
        </div>`).join('')}</div>`;
    }

    if (activeShopTab === 'upgrades') {
      dom.shopContent.innerHTML = `<div class="card-grid">${Object.entries(UPGRADES).map(([key, up]) => {
        const level = upgradeLevel(key);
        const maxed = level >= up.max;
        const cost = maxed ? 'MAX' : `${upgradeCost(key)} Coins`;
        const bars = Array.from({ length: up.max }, (_, i) => `<span class="${i < level ? 'filled' : ''}"></span>`).join('');
        return `<div class="shop-card upgrade-card">
          <h3>${up.icon} ${up.name}</h3>
          <p>${up.desc}<br><span class="price">${cost}</span></p>
          <div class="upgrade-bars">${bars}</div>
          <button class="buy-btn" data-buy-upgrade="${key}" ${maxed ? 'disabled' : ''}>${maxed ? 'Maxed' : 'Upgrade'}</button>
        </div>`;
      }).join('')}</div>`;
    }

    if (activeShopTab === 'skins') {
      dom.shopContent.innerHTML = `<div class="card-grid">${SKINS.map((skin) => {
        const owned = data.ownedSkins.includes(skin.id);
        const equipped = data.equippedSkin === skin.id;
        const [c1, c2, c3] = skin.colors;
        return `<div class="shop-card skin-card ship-skin-card">
          <div class="skin-rarity">${skin.rarity || 'Ship'}</div>
          <div class="ship-preview ${skin.model || 'shuttle'}" style="--skin-a:${c1};--skin-b:${c2};--skin-c:${c3};">
            <span class="ship-wing left"></span><span class="ship-wing right"></span>
            <span class="ship-body"></span><span class="ship-glass"></span>
            <span class="ship-engine left"></span><span class="ship-engine right"></span>
          </div>
          <h3>${skin.name}</h3>
          <p>${skin.desc}<br><span class="price">${skin.cost === 0 ? 'Free' : `${skin.cost} Coins`}</span></p>
          <button class="${owned ? 'equip-btn' : 'buy-btn'}" data-skin-action="${skin.id}">${equipped ? 'Equipped' : owned ? 'Equip' : 'Unlock'}</button>
        </div>`;
      }).join('')}</div>`;
    }
  }

  function updateSettingsUI() {
    if (dom.logoutSettingsBtn) dom.logoutSettingsBtn.textContent = isGuestMode() ? 'Login / Register' : 'Sign Out';
    dom.musicToggle.textContent = data.settings.music ? 'On' : 'Off';
    dom.musicToggle.classList.toggle('off', !data.settings.music);
    if (dom.flightSoundToggle) {
      dom.flightSoundToggle.textContent = data.settings.flightSound ? 'On' : 'Off';
      dom.flightSoundToggle.classList.toggle('off', !data.settings.flightSound);
    }
    dom.sfxToggle.textContent = data.settings.sfx ? 'On' : 'Off';
    dom.sfxToggle.classList.toggle('off', !data.settings.sfx);
  }

  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    const shakePower = clamp(game.shake || 0, 0, 4.5);
    const shakeX = shakePower > 0 ? rand(-shakePower, shakePower) : 0;
    const shakeY = shakePower > 0 ? rand(-shakePower, shakePower) : 0;
    ctx.translate(shakeX, shakeY);
    drawBackground();
    drawRoad();
    drawMotionLines();
    drawCoins();
    drawObstacles();
    drawRivals();
    drawPlayer();
    drawEffects();
    drawModeInfo();
    ctx.restore();
  }

  function drawBackground() {
    const sector = currentSector();
    const [primary, secondary, deep] = sector.colors;
    const horizonY = H * 0.34;
    const t = game.distance || 0;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, deep);
    grad.addColorStop(0.38, '#071226');
    grad.addColorStop(0.70, '#040813');
    grad.addColorStop(1, '#01040a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Galactic core glow.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const coreX = W * (0.48 + Math.sin(t * 0.00025) * 0.06);
    const coreY = horizonY * (0.58 + Math.cos(t * 0.0002) * 0.08);
    const core = ctx.createRadialGradient(coreX, coreY, 12, coreX, coreY, W * 0.62);
    core.addColorStop(0, 'rgba(255,255,255,0.26)');
    core.addColorStop(0.16, hexToRgba(primary, 0.25));
    core.addColorStop(0.44, hexToRgba(secondary, 0.16));
    core.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, horizonY + 170);
    ctx.restore();

    // Milky-way diagonal dust band.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.translate(W * 0.5, horizonY * 0.55);
    ctx.rotate(-0.28 + Math.sin(t * 0.00018) * 0.04);
    const bandGrad = ctx.createLinearGradient(-W * 0.75, 0, W * 0.75, 0);
    bandGrad.addColorStop(0, 'rgba(255,255,255,0)');
    bandGrad.addColorStop(0.22, hexToRgba(secondary, 0.09));
    bandGrad.addColorStop(0.50, 'rgba(255,255,255,0.18)');
    bandGrad.addColorStop(0.76, hexToRgba(primary, 0.12));
    bandGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = bandGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, W * 0.86, H * 0.075, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Nebula ribbons.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let band = 0; band < 4; band += 1) {
      ctx.beginPath();
      for (let x = -50; x <= W + 50; x += 26) {
        const wave = Math.sin((x * 0.008) + t * 0.0012 + band * 1.55) * (22 + band * 8);
        const lift = Math.cos((x * 0.011) - t * 0.0008 + band) * 10;
        const y = horizonY * (0.25 + band * 0.09) + wave + lift;
        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 18 - band * 3;
      ctx.strokeStyle = band % 2 === 0 ? hexToRgba(primary, 0.07) : hexToRgba(secondary, 0.06);
      ctx.shadowBlur = 30;
      ctx.shadowColor = band % 2 === 0 ? primary : secondary;
      ctx.stroke();
    }
    ctx.restore();

    // Stars, deep space particles, and occasional bright suns.
    ctx.save();
    for (let i = 0; i < 150; i += 1) {
      const layer = i % 5;
      const speed = 0.008 + layer * 0.006;
      const x = (i * 137 + Math.sin((t * 0.0008 + i) * 1.7) * 34 + W * 3) % W;
      const y = (i * 53 + t * speed) % (horizonY + 150);
      const twinkle = 0.45 + Math.sin(t * 0.006 + i * 1.9) * 0.35;
      const r = i % 23 === 0 ? 2.6 : i % 9 === 0 ? 1.7 : 0.8;
      ctx.globalAlpha = clamp(0.18 + twinkle * 0.36, 0.12, 0.72);
      ctx.fillStyle = i % 7 === 0 ? secondary : i % 5 === 0 ? '#ffd166' : primary;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      if (i % 37 === 0) {
        ctx.globalAlpha = 0.20 + twinkle * 0.24;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - r * 3, y);
        ctx.lineTo(x + r * 3, y);
        ctx.moveTo(x, y - r * 3);
        ctx.lineTo(x, y + r * 3);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Distant planets / moons.
    drawPlanet(W * 0.18, horizonY * 0.44, 34 + Math.sin(t * 0.0004) * 2, secondary, primary, 0.34);
    drawPlanet(W * 0.82, horizonY * 0.28, 22, primary, '#ffffff', 0.24);

    // Star gate on the horizon.
    ctx.save();
    ctx.translate(W * 0.5, horizonY + 12);
    ctx.globalCompositeOperation = 'screen';
    const gatePulse = 0.78 + Math.sin(t * 0.018) * 0.12;
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.globalAlpha = (0.22 - ring * 0.045) * gatePulse;
      ctx.strokeStyle = ring % 2 === 0 ? primary : secondary;
      ctx.lineWidth = 4 - ring * 0.8;
      ctx.shadowBlur = 22;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.beginPath();
      ctx.ellipse(0, 0, W * (0.09 + ring * 0.026), H * (0.035 + ring * 0.010), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, W * 0.055, H * 0.018, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Asteroid silhouettes beside the route.
    ctx.save();
    for (let i = 0; i < 18; i += 1) {
      const y = (i * 91 + t * 0.11) % (H * 0.82);
      const side = i % 2 === 0 ? -1 : 1;
      const x = side < 0 ? W * (0.05 + (i % 4) * 0.035) : W * (0.95 - (i % 4) * 0.035);
      const s = 8 + (i % 5) * 5 + y / H * 8;
      ctx.globalAlpha = 0.20 + y / H * 0.18;
      ctx.fillStyle = i % 3 === 0 ? hexToRgba(primary, 0.38) : 'rgba(95,108,140,0.32)';
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
        const rr = s * (0.72 + Math.sin(i + a * 3) * 0.18);
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr * 0.75;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Horizon haze.
    ctx.save();
    const haze = ctx.createLinearGradient(0, horizonY - 40, 0, H * 0.64);
    haze.addColorStop(0, 'rgba(255,255,255,0.00)');
    haze.addColorStop(0.32, hexToRgba(primary, 0.10));
    haze.addColorStop(0.62, hexToRgba(secondary, 0.06));
    haze.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizonY - 45, W, H * 0.36);
    ctx.restore();
  }

  function drawPlanet(x, y, r, colorA, colorB, alpha = 0.32) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.42, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.22, colorA);
    g.addColorStop(1, colorB);
    ctx.fillStyle = g;
    ctx.shadowBlur = 18;
    ctx.shadowColor = colorA;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha * 0.75;
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.06, r * 1.45, r * 0.24, -0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }


  function drawRoad() {
    const left = roadLeft();
    const right = roadRight();
    const topW = roadWidth() * 0.48;
    const topLeft = W / 2 - topW / 2;
    const topRight = W / 2 + topW / 2;
    const roadGrad = ctx.createLinearGradient(0, 0, 0, H);
    roadGrad.addColorStop(0, 'rgba(20, 37, 72, 0.58)');
    roadGrad.addColorStop(0.4, 'rgba(12, 22, 40, 0.84)');
    roadGrad.addColorStop(1, 'rgba(6, 12, 24, 0.98)');
    ctx.beginPath();
    ctx.moveTo(topLeft, 0);
    ctx.lineTo(topRight, 0);
    ctx.lineTo(right, H + 40);
    ctx.lineTo(left, H + 40);
    ctx.closePath();
    ctx.fillStyle = roadGrad;
    ctx.fill();

    // Side rails.
    ctx.save();
    ctx.lineWidth = 4;
    ctx.shadowBlur = 18;
    [['#38e8ff', topLeft, left], ['#ff4fd8', topRight, right]].forEach(([color, sx, ex]) => {
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(ex, H);
      ctx.stroke();
    });
    ctx.restore();

    // Guard rail posts.
    ctx.save();
    const postCount = 14;
    for (let i = 0; i < postCount; i += 1) {
      const t = i / (postCount - 1);
      const y = lerp(H * 0.08, H * 0.98, Math.pow(t, 1.35));
      const railInset = 6 + t * 22;
      const lx = lerp(topLeft, left, y / H) + railInset;
      const rx = lerp(topRight, right, y / H) - railInset;
      const ph = 8 + t * 26;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(56,232,255,0.54)' : 'rgba(255,79,216,0.42)';
      ctx.lineWidth = 2 + t * 1.2;
      ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx, y - ph); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx, y); ctx.lineTo(rx, y - ph); ctx.stroke();
    }
    ctx.restore();

    const offset = (game.distance * 0.9) % 90;
    for (let lane = 1; lane <= 2; lane += 1) {
      const xBottom = lerp(left, right, lane / 3);
      const xTop = lerp(topLeft, topRight, lane / 3);
      ctx.save();
      ctx.strokeStyle = lane === 1 ? 'rgba(255,255,255,0.16)' : 'rgba(56,232,255,0.14)';
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 22]);
      ctx.lineDashOffset = -offset;
      ctx.beginPath();
      ctx.moveTo(xTop, 0);
      ctx.lineTo(xBottom, H);
      ctx.stroke();
      ctx.restore();
    }

    // Center neon stream.
    ctx.save();
    ctx.globalAlpha = 0.22 + clamp(((game.speedFx || 1) - 1) * 0.2, 0, 0.18);
    const stream = ctx.createLinearGradient(W * 0.5, 0, W * 0.5, H);
    stream.addColorStop(0, 'rgba(56,232,255,0.02)');
    stream.addColorStop(0.4, 'rgba(56,232,255,0.18)');
    stream.addColorStop(1, 'rgba(255,79,216,0.05)');
    ctx.fillStyle = stream;
    const streamTopL = lerp(topLeft, topRight, 0.485);
    const streamTopR = lerp(topLeft, topRight, 0.515);
    ctx.beginPath();
    ctx.moveTo(streamTopL, 0);
    ctx.lineTo(streamTopR, 0);
    ctx.lineTo(W * 0.53, H);
    ctx.lineTo(W * 0.47, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#866bff';
    ctx.lineWidth = 1;
    const gap = 64;
    for (let y = -gap; y < H + gap; y += gap) {
      const yy = y + ((game.distance * 0.55) % gap);
      const t = yy / H;
      const l = lerp(topLeft, left, t);
      const r = lerp(topRight, right, t);
      ctx.beginPath();
      ctx.moveTo(l, yy);
      ctx.lineTo(r, yy);
      ctx.stroke();
    }
    ctx.restore();

    // Road edge glow.
    ctx.save();
    const edgeGradL = ctx.createLinearGradient(left - 20, 0, left + 60, 0);
    edgeGradL.addColorStop(0, 'rgba(56,232,255,0)');
    edgeGradL.addColorStop(1, 'rgba(56,232,255,0.12)');
    ctx.fillStyle = edgeGradL;
    ctx.beginPath();
    ctx.moveTo(topLeft - 10, 0);
    ctx.lineTo(topLeft + 26, 0);
    ctx.lineTo(left + 42, H);
    ctx.lineTo(left - 14, H);
    ctx.closePath();
    ctx.fill();
    const edgeGradR = ctx.createLinearGradient(right - 60, 0, right + 20, 0);
    edgeGradR.addColorStop(0, 'rgba(255,79,216,0.12)');
    edgeGradR.addColorStop(1, 'rgba(255,79,216,0)');
    ctx.fillStyle = edgeGradR;
    ctx.beginPath();
    ctx.moveTo(topRight - 26, 0);
    ctx.lineTo(topRight + 10, 0);
    ctx.lineTo(right + 14, H);
    ctx.lineTo(right - 42, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawMotionLines() {
    const intensity = clamp(((game.speedFx || 1) - 1) * 2.0 + game.boostPulse * 0.62 + game.brakePulse * 0.34, 0, 1.0);
    if (intensity <= 0.03) return;
    const left = roadLeft();
    const right = roadRight();
    const lineCount = Math.floor(8 + intensity * 12);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < lineCount; i += 1) {
      const seed = i * 97.73;
      const laneT = ((Math.sin(seed) + 1) / 2);
      const x = lerp(left + 22, right - 22, laneT);
      const y = (seed * 13 + game.distance * (0.82 + intensity * 0.42)) % (H + 150) - 75;
      const len = 24 + intensity * 52 + (i % 3) * 8;
      ctx.globalAlpha = 0.045 + intensity * 0.11;
      ctx.lineWidth = 1 + intensity * 1.25;
      ctx.strokeStyle = i % 2 ? '#38e8ff' : '#ffd166';
      ctx.shadowBlur = 12;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.beginPath();
      ctx.moveTo(x + Math.sin(seed) * 8, y);
      ctx.lineTo(x - (game.player?.turn || 0) * 16, y + len);
      ctx.stroke();
    }

    if (game.brakePulse > 0.02 && game.player) {
      const p = game.player;
      ctx.globalAlpha = game.brakePulse * 0.24;
      ctx.strokeStyle = '#ff4fd8';
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ff4fd8';
      for (let i = 0; i < 2; i += 1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y + p.r * 0.6, p.r * (1.1 + i * 0.36 + (1 - game.brakePulse) * 0.6), Math.PI * 0.12, Math.PI * 0.88);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawCoins() {
    for (const coin of game.coins) {
      const pulse = 0.88 + Math.sin(coin.spin * 2.1) * 0.12;
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.26;
      const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, coin.r * 2.8);
      halo.addColorStop(0, 'rgba(255,255,255,0.55)');
      halo.addColorStop(0.45, 'rgba(255,209,102,0.34)');
      halo.addColorStop(1, 'rgba(255,209,102,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, coin.r * 2.6 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.spin);
      ctx.scale(Math.abs(Math.cos(coin.spin)) * 0.45 + 0.55, 1);
      const body = ctx.createLinearGradient(0, -coin.r, 0, coin.r);
      body.addColorStop(0, '#fff5bf');
      body.addColorStop(0.28, '#ffd166');
      body.addColorStop(1, '#ffae2b');
      ctx.fillStyle = body;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(0, 0, coin.r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.58)';
      ctx.beginPath();
      ctx.ellipse(-coin.r * 0.18, -coin.r * 0.22, coin.r * 0.2, coin.r * 0.12, -0.3, 0, Math.PI * 2);
      ctx.fill();
      if (coin.value > 1) {
        ctx.fillStyle = '#6a4300';
        ctx.font = '900 10px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('5', 0, 0);
      }
      ctx.restore();

      // Sparkle cross.
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.spin * 0.35);
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = '#fff4cf';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-coin.r * 1.35, 0); ctx.lineTo(coin.r * 1.35, 0);
      ctx.moveTo(0, -coin.r * 1.35); ctx.lineTo(0, coin.r * 1.35);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawObstacles() {
    const time = performance.now();

    for (const obstacle of game.obstacles) {
      drawObstacleTelegraph(obstacle, time);

      ctx.save();
      ctx.translate(obstacle.x, obstacle.y);
      ctx.rotate(obstacle.rot || 0);

      if (obstacle.type === 'asteroid') drawAsteroid(obstacle, time);
      else if (obstacle.type === 'crystal') drawCrystal(obstacle, time);
      else if (obstacle.type === 'debris') drawDebris(obstacle, time);
      else if (obstacle.type === 'satellite') drawSatellite(obstacle, time);
      else if (obstacle.type === 'drone') drawSentryDrone(obstacle, time);
      else if (obstacle.type === 'mine') drawSpaceMine(obstacle, time);
      else if (obstacle.type === 'plasmaGate') drawPlasmaGate(obstacle, time);
      else drawAsteroid(obstacle, time);

      ctx.restore();
    }

    function drawObstacleTelegraph(o, time) {
      const distToPlayer = o.y - game.player.y;
      const approaching = o.y < H * 0.72 && o.y > -140;
      if (!approaching) return;

      const laneX = getLaneX(o.lane);
      const intensity = clamp(1 - Math.abs(distToPlayer) / (H * 0.78), 0.08, 0.62);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = intensity * 0.36;
      ctx.strokeStyle = o.warnColor || '#ffd166';
      ctx.lineWidth = o.type === 'plasmaGate' ? 4 : 2.5;
      ctx.setLineDash(o.type === 'drone' ? [10, 10] : [18, 14]);
      ctx.lineDashOffset = -time / 38;
      ctx.shadowBlur = 18;
      ctx.shadowColor = o.warnColor || '#ffd166';

      const top = Math.max(0, o.y - H * 0.38);
      const bottom = Math.min(H, o.y + H * 0.42);
      ctx.beginPath();
      ctx.moveTo(laneX, top);
      ctx.lineTo(o.x, bottom);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.globalAlpha = intensity * 0.24;
      ctx.fillStyle = o.warnColor || '#ffd166';
      ctx.beginPath();
      ctx.ellipse(o.x, o.y + o.h * 0.34, o.w * 0.54, o.h * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawAsteroid(o) {
      const grad = ctx.createRadialGradient(-o.w * 0.22, -o.h * 0.22, 3, 0, 0, Math.max(o.w, o.h) * 0.58);
      grad.addColorStop(0, '#ffe0a6');
      grad.addColorStop(0.28, '#ff9a3d');
      grad.addColorStop(1, '#6c3a26');
      ctx.fillStyle = grad;
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ff9a3d';
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const a = (i / 10) * Math.PI * 2;
        const rr = (0.42 + Math.sin(i * 2.1 + o.age * 0.8) * 0.06) * Math.min(o.w, o.h);
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr * 0.92;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      [[-0.16, -0.08, 0.11], [0.16, 0.08, 0.08], [0.02, -0.22, 0.065]].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x * o.w, y * o.h, r * o.w, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawCrystal(o, time) {
      const grad = ctx.createLinearGradient(0, -o.h / 2, 0, o.h / 2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.22, '#aef6ff');
      grad.addColorStop(0.60, o.color || '#38e8ff');
      grad.addColorStop(1, '#2a5bff');
      ctx.fillStyle = grad;
      ctx.shadowBlur = 18;
      ctx.shadowColor = o.color || '#38e8ff';
      ctx.beginPath();
      ctx.moveTo(0, -o.h / 2);
      ctx.lineTo(o.w * 0.44, -o.h * 0.10);
      ctx.lineTo(o.w * 0.30, o.h * 0.48);
      ctx.lineTo(0, o.h / 2);
      ctx.lineTo(-o.w * 0.30, o.h * 0.48);
      ctx.lineTo(-o.w * 0.44, -o.h * 0.10);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.globalAlpha = 0.42 + Math.sin(time / 150) * 0.12;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -o.h * 0.42);
      ctx.lineTo(o.w * 0.12, -o.h * 0.04);
      ctx.lineTo(0, o.h * 0.30);
      ctx.lineTo(-o.w * 0.08, -o.h * 0.03);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawDebris(o) {
      const grad = ctx.createLinearGradient(0, -o.h / 2, 0, o.h / 2);
      grad.addColorStop(0, '#edf5ff');
      grad.addColorStop(0.38, '#8fa0c6');
      grad.addColorStop(1, '#303b58');
      ctx.fillStyle = grad;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#866bff';
      roundRect(-o.w / 2, -o.h / 2, o.w, o.h, 8, true, false);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.26)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-o.w * 0.35, -o.h * 0.18);
      ctx.lineTo(o.w * 0.32, o.h * 0.20);
      ctx.moveTo(-o.w * 0.1, o.h * 0.30);
      ctx.lineTo(o.w * 0.24, -o.h * 0.25);
      ctx.stroke();
    }

    function drawSatellite(o, time) {
      ctx.shadowBlur = 14;
      ctx.shadowColor = o.color || '#866bff';
      ctx.fillStyle = '#dce8ff';
      roundRect(-o.w * 0.24, -o.h * 0.36, o.w * 0.48, o.h * 0.72, 8, true, false);
      ctx.shadowBlur = 0;

      const panelGrad = ctx.createLinearGradient(-o.w / 2, 0, o.w / 2, 0);
      panelGrad.addColorStop(0, '#38e8ff');
      panelGrad.addColorStop(1, '#866bff');
      ctx.fillStyle = panelGrad;
      roundRect(-o.w * 0.58, -o.h * 0.20, o.w * 0.26, o.h * 0.40, 5, true, false);
      roundRect(o.w * 0.32, -o.h * 0.20, o.w * 0.26, o.h * 0.40, 5, true, false);

      ctx.strokeStyle = 'rgba(255,255,255,0.50)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-o.w * 0.32, 0);
      ctx.lineTo(-o.w * 0.22, 0);
      ctx.moveTo(o.w * 0.22, 0);
      ctx.lineTo(o.w * 0.32, 0);
      ctx.stroke();

      ctx.fillStyle = '#101827';
      ctx.beginPath();
      ctx.arc(0, -o.h * 0.04, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = o.warnColor || '#b38cff';
      ctx.globalAlpha = 0.65 + Math.sin(time / 160) * 0.18;
      ctx.beginPath();
      ctx.arc(0, -o.h * 0.04, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawSentryDrone(o, time) {
      const grad = ctx.createLinearGradient(0, -o.h / 2, 0, o.h / 2);
      grad.addColorStop(0, '#ffd9fb');
      grad.addColorStop(0.34, o.color || '#ff4fd8');
      grad.addColorStop(1, '#531b7f');
      ctx.fillStyle = grad;
      ctx.shadowBlur = 20;
      ctx.shadowColor = o.color || '#ff4fd8';
      roundRect(-o.w / 2, -o.h / 2, o.w, o.h, 16, true, false);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#06101f';
      roundRect(-o.w * 0.30, -o.h * 0.18, o.w * 0.60, o.h * 0.28, 8, true, false);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#fff';
      ctx.beginPath();
      ctx.arc(-o.w * 0.16, -o.h * 0.05, 3.2, 0, Math.PI * 2);
      ctx.arc(o.w * 0.16, -o.h * 0.05, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      const spin = time * 0.028;
      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.translate(side * (o.w * 0.58), -o.h * 0.10);
        ctx.rotate(spin * side);
        ctx.strokeStyle = 'rgba(56,232,255,0.62)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.moveTo(0, -12);
        ctx.lineTo(0, 12);
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawSpaceMine(o, time) {
      ctx.fillStyle = '#20131b';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff5364';
      ctx.beginPath();
      ctx.arc(0, 0, o.w * 0.36, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#ff5364';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * Math.PI * 2 + time * 0.0012;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * o.w * 0.30, Math.sin(a) * o.h * 0.30);
        ctx.lineTo(Math.cos(a) * o.w * 0.52, Math.sin(a) * o.h * 0.52);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.80 + Math.sin(time / 95) * 0.18;
      ctx.beginPath();
      ctx.arc(0, 0, o.w * 0.10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawPlasmaGate(o, time) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.34 + Math.sin(time / 110) * 0.08;
      ctx.strokeStyle = o.warnColor || '#5cffaa';
      ctx.lineWidth = 5;
      ctx.shadowBlur = 22;
      ctx.shadowColor = o.warnColor || '#5cffaa';
      ctx.beginPath();
      ctx.ellipse(0, 0, o.w * 0.50, o.h * 0.54, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.42;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(-o.w * 0.38, i * o.h * 0.18);
        ctx.quadraticCurveTo(0, i * o.h * 0.18 + Math.sin(time / 120 + i) * 5, o.w * 0.38, i * o.h * 0.18);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  function drawRivals() {
    if (game.mode !== 'arena' || currentScreen !== 'gameScreen') return;
    ctx.save();
    game.rivals.forEach((rival, index) => {
      const scale = clamp(0.42 + index * 0.035, 0.40, 0.62);
      const x = rival.x || getLaneX(index % 3);
      const y = rival.y || H * 0.3;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = 0.54;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rival.color || '#ff4fd8';
      ctx.shadowBlur = 14;
      ctx.shadowColor = rival.color || '#ff4fd8';
      ctx.beginPath();
      ctx.moveTo(0, -28 * scale);
      ctx.lineTo(20 * scale, 18 * scale);
      ctx.lineTo(0, 8 * scale);
      ctx.lineTo(-20 * scale, 18 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.64;
      ctx.beginPath();
      ctx.ellipse(0, -8 * scale, 7 * scale, 10 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      if (rival.burst > 0) {
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(-7 * scale, 18 * scale);
        ctx.lineTo(0, 42 * scale);
        ctx.lineTo(7 * scale, 18 * scale);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });
    ctx.restore();
  }

  function drawPlayer() {
    if (!game.player) return;
    const p = game.player;
    const colors = p.skin.colors;
    const model = p.skin.model || 'shuttle';
    const shipShape = {
      shuttle: { bodyW: 1.00, bodyL: 1.00, wing: 1.00, cockpit: 1.00, fin: 1.00, pod: 1.00 },
      falcon: { bodyW: 0.92, bodyL: 1.08, wing: 1.26, cockpit: 0.88, fin: 1.18, pod: 1.08 },
      ray: { bodyW: 1.16, bodyL: 0.92, wing: 1.48, cockpit: 1.10, fin: 0.78, pod: 0.92 },
      dragon: { bodyW: 0.95, bodyL: 1.18, wing: 1.18, cockpit: 0.86, fin: 1.35, pod: 1.12 },
      ufo: { bodyW: 1.28, bodyL: 0.74, wing: 1.55, cockpit: 1.30, fin: 0.55, pod: 0.88 },
      comet: { bodyW: 1.04, bodyL: 1.12, wing: 1.12, cockpit: 1.00, fin: 1.10, pod: 1.08 }
    }[model] || { bodyW: 1, bodyL: 1, wing: 1, cockpit: 1, fin: 1, pod: 1 };
    const now = performance.now();
    const run = p.runCycle || now / 126;
    const turn = clamp((p.turnPose ?? p.turn) || 0, -0.64, 0.64);
    const stridePower = clamp(p.strideIntensity || 1, 0.92, 1.28);
    const stride = Math.sin(run) * stridePower;
    const hover = Math.sin(run * 1.4) * p.r * 0.045;
    const boost = clamp(((game.speedFx || 1) - 1) * 2.5 + game.boostPulse * 0.68, 0, 1.18);
    const brake = clamp((game.brakePulse || 0) + (p.brake || 0) * 0.5, 0, 1.0);
    const bob = Math.abs(Math.sin(run)) * p.r * 0.03 - p.r * 0.015 + brake * p.r * 0.02;
    const laneShift = turn * p.r * 0.035;
    const bank = turn * 0.20;
    const headYaw = turn * 0.28;
    const nosePitch = -Math.abs(stride) * 0.02 + boost * 0.02;

    const hullDark = '#162033';
    const hullMid = '#30476d';
    const hullLight = '#d9ecff';
    const hullAccent = mixColor(hullMid, colors[2], 0.35);
    const glassDark = '#081423';
    const engineGlow = colors[0];
    const trimGlow = colors[1];
    const gold = '#ffd166';

    const drawHullPath = (ctxRef, scaleX = 1, scaleY = 1, offsetY = 0) => {
      ctxRef.beginPath();
      ctxRef.moveTo(0, -p.r * 1.06 * shipShape.bodyL * scaleY + offsetY);
      ctxRef.bezierCurveTo(p.r * 0.34 * shipShape.bodyW * scaleX, -p.r * 0.90 * shipShape.bodyL * scaleY + offsetY, p.r * 0.58 * shipShape.bodyW * scaleX, -p.r * 0.46 * scaleY + offsetY, p.r * 0.56 * shipShape.bodyW * scaleX, -p.r * 0.04 * scaleY + offsetY);
      ctxRef.bezierCurveTo(p.r * 0.52 * shipShape.bodyW * scaleX, p.r * 0.34 * scaleY + offsetY, p.r * 0.34 * shipShape.bodyW * scaleX, p.r * 0.68 * scaleY + offsetY, 0, p.r * 0.82 * scaleY + offsetY);
      ctxRef.bezierCurveTo(-p.r * 0.34 * shipShape.bodyW * scaleX, p.r * 0.68 * scaleY + offsetY, -p.r * 0.52 * shipShape.bodyW * scaleX, p.r * 0.34 * scaleY + offsetY, -p.r * 0.56 * shipShape.bodyW * scaleX, -p.r * 0.04 * scaleY + offsetY);
      ctxRef.bezierCurveTo(-p.r * 0.58 * shipShape.bodyW * scaleX, -p.r * 0.46 * scaleY + offsetY, -p.r * 0.34 * shipShape.bodyW * scaleX, -p.r * 0.90 * shipShape.bodyL * scaleY + offsetY, 0, -p.r * 1.06 * shipShape.bodyL * scaleY + offsetY);
      ctxRef.closePath();
    };

    for (const t of p.trail) {
      const alpha = clamp(t.life / (t.max || 0.42), 0, 1) * (0.15 + boost * 0.14);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      ctx.translate(t.x, t.y + p.r * 0.18);
      ctx.rotate((t.turn || 0) * 0.05);
      ctx.scale(1.3 + boost * 0.38, 0.46);
      const g = ctx.createRadialGradient(0, 0, 1, 0, 0, t.r * 1.24);
      g.addColorStop(0, colors[2]);
      g.addColorStop(0.25, engineGlow);
      g.addColorStop(0.55, trimGlow);
      g.addColorStop(1, 'rgba(56,232,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, t.r * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(p.x + laneShift, p.y + bob + hover);
    ctx.rotate(bank + nosePitch);
    if (game.invincibleTimer > 0 && Math.floor(now / 90) % 2 === 0) ctx.globalAlpha = 0.62;

    ctx.save();
    ctx.globalAlpha = 0.22 + brake * 0.06;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, p.r * 1.18, p.r * (1.15 + boost * 0.24), p.r * 0.22, turn * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (game.active.shield > 0 || game.reviveArmed) {
      const c = game.reviveArmed ? '#5cffaa' : engineGlow;
      ctx.save();
      ctx.globalAlpha = 0.36 + Math.sin(now / 105) * 0.08;
      ctx.strokeStyle = c;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = c;
      ctx.beginPath();
      ctx.arc(0, -p.r * 0.1, p.r + 14 + boost * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (game.active.magnet > 0) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = '#ff4fd8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = -now / 42;
      ctx.beginPath();
      ctx.arc(0, -p.r * 0.06, p.r + 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (game.active.doubleCoins > 0) {
      ctx.save();
      ctx.globalAlpha = 0.84;
      ctx.fillStyle = gold;
      ctx.shadowBlur = 10;
      ctx.shadowColor = gold;
      for (let i = 0; i < 2; i += 1) {
        const a = now / 360 + i * Math.PI;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (p.r + 16), Math.sin(a) * (p.r + 16) - p.r * 0.18, 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (boost > 0.03 || !game.paused) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.38 + boost * 0.26;
      ctx.shadowBlur = 20;
      ctx.shadowColor = engineGlow;
      const thrusters = [-0.34, 0.34];
      thrusters.forEach((x) => {
        const flame = ctx.createLinearGradient(0, p.r * 0.12, 0, p.r * (1.18 + boost * 0.32));
        flame.addColorStop(0, '#ffffff');
        flame.addColorStop(0.18, engineGlow);
        flame.addColorStop(0.5, trimGlow);
        flame.addColorStop(1, 'rgba(255,79,216,0)');
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.moveTo(x * p.r - p.r * 0.09, p.r * 0.10);
        ctx.quadraticCurveTo(x * p.r, p.r * 0.46, x * p.r, p.r * (1.02 + boost * 0.28));
        ctx.quadraticCurveTo(x * p.r + p.r * 0.16, p.r * 0.48, x * p.r + p.r * 0.09, p.r * 0.10);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = mixColor(hullMid, hullDark, 0.30);
    ctx.beginPath();
    ctx.moveTo(-p.r * 0.40, p.r * 0.08);
    ctx.lineTo(-p.r * 0.92 * shipShape.fin, p.r * 0.46);
    ctx.lineTo(-p.r * 0.48, -p.r * 0.06);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.r * 0.40, p.r * 0.08);
    ctx.lineTo(p.r * 0.92 * shipShape.fin, p.r * 0.46);
    ctx.lineTo(p.r * 0.48, -p.r * 0.06);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#0b1020';
    ctx.beginPath();
    ctx.moveTo(-p.r * 0.30, -p.r * 0.02);
    ctx.lineTo(-p.r * 1.08 * shipShape.wing, p.r * 0.14 + turn * p.r * 0.06);
    ctx.lineTo(-p.r * 0.44, p.r * 0.30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.r * 0.30, -p.r * 0.02);
    ctx.lineTo(p.r * 1.08 * shipShape.wing, p.r * 0.14 - turn * p.r * 0.06);
    ctx.lineTo(p.r * 0.44, p.r * 0.30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const wingGrad = ctx.createLinearGradient(-p.r * 1.1, 0, p.r * 1.1, 0);
    wingGrad.addColorStop(0, mixColor(colors[2], hullLight, 0.4));
    wingGrad.addColorStop(0.48, hullAccent);
    wingGrad.addColorStop(1, mixColor(hullDark, engineGlow, 0.2));
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.moveTo(-p.r * 0.30, -p.r * 0.20);
    ctx.lineTo(-p.r * 1.08 * shipShape.wing, p.r * 0.06 + turn * p.r * 0.05);
    ctx.lineTo(-p.r * 0.42, p.r * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.r * 0.30, -p.r * 0.20);
    ctx.lineTo(p.r * 1.08 * shipShape.wing, p.r * 0.06 - turn * p.r * 0.05);
    ctx.lineTo(p.r * 0.42, p.r * 0.24);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.32)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-p.r * 0.26, -p.r * 0.12);
    ctx.lineTo(-p.r * 0.90 * shipShape.wing, p.r * 0.08 + turn * p.r * 0.04);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.r * 0.26, -p.r * 0.12);
    ctx.lineTo(p.r * 0.90 * shipShape.wing, p.r * 0.08 - turn * p.r * 0.04);
    ctx.stroke();

    const podGrad = ctx.createLinearGradient(0, -p.r * 0.20, 0, p.r * 0.34);
    podGrad.addColorStop(0, mixColor(hullLight, colors[2], 0.35));
    podGrad.addColorStop(0.32, hullMid);
    podGrad.addColorStop(1, hullDark);
    ctx.fillStyle = podGrad;
    [-0.34, 0.34].forEach((x) => {
      ctx.save();
      ctx.translate(x * p.r, p.r * 0.16);
      ctx.rotate(x * -0.08 + turn * 0.06);
      roundRect(-p.r * 0.12 * shipShape.pod, -p.r * 0.02, p.r * 0.24 * shipShape.pod, p.r * 0.42, p.r * 0.08, true, false);
      ctx.restore();
    });

    ctx.save();
    ctx.fillStyle = mixColor(hullDark, '#081018', 0.45);
    ctx.shadowBlur = 20;
    ctx.shadowColor = engineGlow;
    drawHullPath(ctx, 1.02, 1.03, p.r * 0.02);
    ctx.fill();
    ctx.restore();

    ctx.save();
    const hullGrad = ctx.createLinearGradient(0, -p.r * 1.0, 0, p.r * 0.76);
    hullGrad.addColorStop(0, '#ffffff');
    hullGrad.addColorStop(0.20, mixColor(hullLight, colors[2], 0.35));
    hullGrad.addColorStop(0.45, hullAccent);
    hullGrad.addColorStop(0.72, hullMid);
    hullGrad.addColorStop(1, hullDark);
    ctx.fillStyle = hullGrad;
    ctx.shadowBlur = 14;
    ctx.shadowColor = engineGlow;
    drawHullPath(ctx);
    ctx.fill();
    ctx.restore();

    ctx.save();
    const topShell = ctx.createLinearGradient(-p.r * 0.18, -p.r * 0.94, p.r * 0.18, p.r * 0.54);
    topShell.addColorStop(0, 'rgba(255,255,255,0.92)');
    topShell.addColorStop(0.34, mixColor(colors[2], '#eaf7ff', 0.55));
    topShell.addColorStop(0.62, mixColor(engineGlow, hullLight, 0.25));
    topShell.addColorStop(1, 'rgba(16,28,52,0.15)');
    ctx.fillStyle = topShell;
    drawHullPath(ctx, 0.70, 0.84, -p.r * 0.08);
    ctx.fill();
    const splitGrad = ctx.createLinearGradient(-p.r * 0.5, 0, p.r * 0.5, 0);
    splitGrad.addColorStop(0, 'rgba(6,12,24,0.34)');
    splitGrad.addColorStop(0.5, 'rgba(255,255,255,0.04)');
    splitGrad.addColorStop(1, 'rgba(6,12,24,0.34)');
    ctx.fillStyle = splitGrad;
    roundRect(-p.r * 0.18, -p.r * 0.58, p.r * 0.36, p.r * 1.14, p.r * 0.12, true, false);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(7,18,35,0.45)';
    ctx.beginPath();
    ctx.moveTo(-p.r * 0.40, -p.r * 0.64);
    ctx.quadraticCurveTo(-p.r * 0.54, -p.r * 0.18, -p.r * 0.34, p.r * 0.54);
    ctx.lineTo(-p.r * 0.12, p.r * 0.46);
    ctx.quadraticCurveTo(-p.r * 0.28, -p.r * 0.06, -p.r * 0.22, -p.r * 0.70);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.r * 0.40, -p.r * 0.64);
    ctx.quadraticCurveTo(p.r * 0.54, -p.r * 0.18, p.r * 0.34, p.r * 0.54);
    ctx.lineTo(p.r * 0.12, p.r * 0.46);
    ctx.quadraticCurveTo(p.r * 0.28, -p.r * 0.06, p.r * 0.22, -p.r * 0.70);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    const canopy = ctx.createLinearGradient(0, -p.r * 0.92, 0, -p.r * 0.02);
    canopy.addColorStop(0, 'rgba(220,246,255,0.98)');
    canopy.addColorStop(0.22, 'rgba(86,190,255,0.94)');
    canopy.addColorStop(0.62, trimGlow);
    canopy.addColorStop(1, glassDark);
    ctx.fillStyle = canopy;
    ctx.shadowBlur = 14;
    ctx.shadowColor = engineGlow;
    ctx.beginPath();
    ctx.moveTo(0, -p.r * 0.86);
    ctx.bezierCurveTo(p.r * 0.22 * shipShape.cockpit, -p.r * 0.72, p.r * 0.24 * shipShape.cockpit, -p.r * 0.26, p.r * 0.13, 0);
    ctx.bezierCurveTo(p.r * 0.06, p.r * 0.10, -p.r * 0.06, p.r * 0.10, -p.r * 0.13, 0);
    ctx.bezierCurveTo(-p.r * 0.24 * shipShape.cockpit, -p.r * 0.26, -p.r * 0.22 * shipShape.cockpit, -p.r * 0.72, 0, -p.r * 0.86);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.26)';
    ctx.beginPath();
    ctx.moveTo(-p.r * 0.08, -p.r * 0.80);
    ctx.quadraticCurveTo(p.r * 0.02, -p.r * 0.72, p.r * 0.10, -p.r * 0.40);
    ctx.lineTo(0, -p.r * 0.50);
    ctx.quadraticCurveTo(-p.r * 0.06, -p.r * 0.68, -p.r * 0.08, -p.r * 0.80);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const stripe = ctx.createLinearGradient(0, -p.r * 0.94, 0, p.r * 0.62);
    stripe.addColorStop(0, '#ffffff');
    stripe.addColorStop(0.22, engineGlow);
    stripe.addColorStop(0.74, trimGlow);
    stripe.addColorStop(1, 'rgba(255,255,255,0.04)');
    ctx.fillStyle = stripe;
    roundRect(-p.r * 0.055, -p.r * 0.68, p.r * 0.11, p.r * 1.20, p.r * 0.05, true, false);

    ctx.globalAlpha = 0.72;
    ctx.fillStyle = engineGlow;
    roundRect(-p.r * 0.34, -p.r * 0.20, p.r * 0.10, p.r * 0.38, p.r * 0.05, true, false);
    roundRect(p.r * 0.24, -p.r * 0.20, p.r * 0.10, p.r * 0.38, p.r * 0.05, true, false);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-p.r * 0.15 + headYaw * p.r * 0.05, -p.r * 0.50, p.r * 0.06, p.r * 0.08, 0, 0, Math.PI * 2);
    ctx.ellipse(p.r * 0.15 + headYaw * p.r * 0.05, -p.r * 0.50, p.r * 0.06, p.r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = gold;
    ctx.shadowBlur = 8;
    ctx.shadowColor = gold;
    ctx.beginPath();
    ctx.moveTo(0, -p.r * 0.16);
    ctx.lineTo(p.r * 0.08, -p.r * 0.06);
    ctx.lineTo(0, p.r * 0.06);
    ctx.lineTo(-p.r * 0.08, -p.r * 0.06);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    [-0.34, 0.34].forEach((x) => {
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.ellipse(x * p.r, p.r * 0.18, p.r * 0.10, p.r * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = engineGlow;
      ctx.shadowBlur = 12;
      ctx.shadowColor = engineGlow;
      ctx.beginPath();
      ctx.ellipse(x * p.r, p.r * 0.52, p.r * 0.06, p.r * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = trimGlow;
    ctx.shadowBlur = 10;
    ctx.shadowColor = trimGlow;
    ctx.beginPath();
    ctx.arc(-p.r * 1.00 * shipShape.wing, p.r * 0.08 + turn * p.r * 0.05, p.r * 0.05, 0, Math.PI * 2);
    ctx.arc(p.r * 1.00 * shipShape.wing, p.r * 0.08 - turn * p.r * 0.05, p.r * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
  function drawEffects() {
    for (const p of game.particles) {
      ctx.save();
      ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const f of game.floatTexts) {
      ctx.save();
      ctx.globalAlpha = clamp(f.life / f.max, 0, 1);
      ctx.fillStyle = f.color;
      ctx.font = '900 18px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 14;
      ctx.shadowColor = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    }

    for (const c of game.coinFlights) {
      ctx.save();
      ctx.globalAlpha = clamp(c.life / c.max, 0, 1);
      ctx.fillStyle = '#ffd166';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffd166';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const w of game.waves) {
      ctx.save();
      ctx.globalAlpha = clamp(w.life / w.max, 0, 1) * 0.7;
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = w.color;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Boost aura around the runner.
    if (game.player && ((game.speedFx || 1) > 1.02 || game.active.speedBoost > 0)) {
      const p = game.player;
      const boost = clamp(((game.speedFx || 1) - 1) * 2.6 + game.boostPulse * 0.8, 0, 1.2);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.12 + boost * 0.12;
      const aura = ctx.createRadialGradient(p.x, p.y, p.r * 0.5, p.x, p.y, p.r * (2.4 + boost * 0.8));
      aura.addColorStop(0, 'rgba(255,255,255,0.45)');
      aura.addColorStop(0.36, 'rgba(56,232,255,0.28)');
      aura.addColorStop(0.72, 'rgba(255,79,216,0.12)');
      aura.addColorStop(1, 'rgba(255,79,216,0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (2.2 + boost * 0.6), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Edge vignette and speed color wash.
    ctx.save();
    const vignette = ctx.createRadialGradient(W / 2, H * 0.46, Math.min(W, H) * 0.22, W / 2, H * 0.46, Math.max(W, H) * 0.78);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.7, 'rgba(0,0,0,0.03)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    const speedTint = clamp(((game.speedFx || 1) - 1) * 0.24 + game.boostPulse * 0.05, 0, 0.18);
    if (speedTint > 0.01) {
      ctx.fillStyle = `rgba(56,232,255,${speedTint})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function drawModeInfo() {
    if (currentScreen !== 'gameScreen' || !game.running) return;
    ctx.save();
    ctx.font = '800 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(246,251,255,0.78)';
    let text = '';
    if (game.mode === 'classic') text = 'Classic · Endless run · Best-score focus';
    if (game.mode === 'arena') {
      const rank = getArenaRank();
      text = `Arena · Live Rank #${rank} · Overtake rivals for bonus score`;
    }
    if (game.mode === 'level') {
      const lvl = levelInfo();
      const scorePct = clamp(game.score / lvl.goal, 0, 1);
      const coinPct = clamp(game.collectedLevelCoins / lvl.coins, 0, 1);
      text = `Level ${lvl.level} · Score ${formatNumber(Math.min(game.score, lvl.goal))}/${formatNumber(lvl.goal)} · Coins ${game.collectedLevelCoins}/${lvl.coins}`;
      const barW = Math.min(310, W * 0.58);
      const barX = W / 2 - barW / 2;
      const barY = Math.max(98, H * 0.15);
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      roundRect(barX, barY, barW, 7, 4, true, false);
      ctx.fillStyle = '#38e8ff';
      roundRect(barX, barY, barW * scorePct, 7, 4, true, false);
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      roundRect(barX, barY + 11, barW, 7, 4, true, false);
      ctx.fillStyle = '#ffd166';
      roundRect(barX, barY + 11, barW * coinPct, 7, 4, true, false);
      ctx.restore();
    }
    const y = Math.max(82, H * 0.12);
    ctx.fillText(text, W / 2, y);
    if (game.mode === 'arena' && game.arenaRankFlash > 0) {
      ctx.globalAlpha = game.arenaRankFlash;
      ctx.fillStyle = '#5cffaa';
      ctx.font = '900 18px system-ui, sans-serif';
      ctx.fillText(`RANK UP #${getArenaRank()}`, W / 2, y + 26);
    }
    ctx.restore();
  }

  function getArenaRank() {
    return 1 + game.rivals.filter((r) => r.score > game.score).length;
  }

  function roundRect(x, y, w, h, r, fill, stroke) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function updateGameOverVisuals(dt) {
    if (!game.over) return;
    dt = Math.min(dt, 0.033);
    game.shake = Math.max(0, game.shake - dt * 32);
    if (game.shake < 0.05) game.shake = 0;
    game.boostPulse = Math.max(0, game.boostPulse - dt * 2.7);
    game.brakePulse = Math.max(0, game.brakePulse - dt * 1.9);
    updateVisuals(dt);
  }

  function loop(now) {
    loopRunning = true;
    lastLoopAt = performance.now();
    try {
      if (!Number.isFinite(now)) now = performance.now();
      let dt = (now - (game.lastTime || now - 16)) / 1000;
      if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
      dt = clamp(dt, 1 / 240, 0.05);
      game.lastTime = now;
      if (game.over) updateGameOverVisuals(dt);
      else updateGame(dt);
      draw();
    } catch (error) {
      loopErrorCount += 1;
      console.error('[Galaxy Run Rivals] Game loop recovered:', error);
      try { draw(); } catch (drawError) {}
    } finally {
      animationId = requestAnimationFrame(loop);
    }
  }

  const PAYMENT_PAY_TYPES = {
    card: 8004,
    apple: 8003,
    google: 8012
  };

  const PAYMENT_SCRIPT_URLS = [
    'https://www.roomilo.com/js/core/crypto-js.min.js',
    'https://www.roomilo.com/js/core/PayApi-v2.js'
  ];

  function parseUsdPrice(price) {
    const value = Number(String(price || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
  }

  function isValidCheckoutEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(value || '').trim());
  }

  function getDefaultCheckoutEmail() {
    if (hasActiveAccount() && accounts[currentUserId]) {
      const email = accounts[currentUserId].email || accounts[currentUserId].displayName || '';
      if (isValidCheckoutEmail(email)) return email.trim();
    }
    const stored = String(data.checkoutEmail || '').trim();
    return isValidCheckoutEmail(stored) ? stored : '';
  }

  function splitCustomerName() {
    const raw = normalizeName(data.playerName || 'Galaxy Pilot');
    const parts = raw.split(/\s+/).filter(Boolean);
    return {
      firstName: (parts[0] || 'Galaxy').slice(0, 32),
      lastName: (parts.slice(1).join(' ') || 'Pilot').slice(0, 32)
    };
  }

  function paymentReturnUrl(status, orderId) {
    const href = (window.location && window.location.href ? window.location.href : '').split('#')[0].split('?')[0];
    const base = /^https?:\/\//i.test(href) ? href : 'https://www.roomilo.com/';
    const params = new URLSearchParams();
    params.set('payment', status);
    if (orderId) params.set('orderId', orderId);
    return `${base}?${params.toString()}`;
  }

  function getPendingPayments() {
    return readJSON('galaxyRunPendingPayments', {});
  }

  function savePendingPayment(orderId, payload) {
    const pending = getPendingPayments();
    pending[orderId] = Object.assign({}, payload, { createdAt: new Date().toISOString() });
    writeJSON('galaxyRunPendingPayments', pending);
  }

  function removePendingPayment(orderId) {
    const pending = getPendingPayments();
    delete pending[orderId];
    writeJSON('galaxyRunPendingPayments', pending);
  }

  function loadPaymentScript(url) {
    return new Promise((resolve, reject) => {
      if (typeof window.DoRequest === 'function' || typeof DoRequest === 'function') {
        resolve();
        return;
      }

      const existing = Array.from(document.scripts || []).find((script) => script.src === url);
      if (existing && existing.dataset.loaded === 'true') {
        resolve();
        return;
      }

      const script = existing || document.createElement('script');
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        script.dataset.loaded = 'true';
        resolve();
      };
      const fail = () => {
        if (settled) return;
        settled = true;
        reject(new Error(`Failed to load ${url}`));
      };

      script.addEventListener('load', done, { once: true });
      script.addEventListener('error', fail, { once: true });

      if (!existing) {
        script.src = url;
        script.async = false;
        document.head.appendChild(script);
      }

      // Never let a payment CDN hang forever. Checkout can show a clear error instead.
      setTimeout(() => {
        if (!settled) fail();
      }, 6000);
    });
  }

  function isPaymentApiReady() {
    return paymentScriptsReady || typeof window.DoRequest === 'function' || typeof DoRequest === 'function';
  }

  function primePaymentScripts(reason = 'background') {
    if (isPaymentApiReady()) {
      paymentScriptsReady = true;
      return Promise.resolve(true);
    }

    if (paymentScriptPromise) return paymentScriptPromise;

    console.log(`[Galaxy Run Rivals] Loading payment scripts (${reason})...`);
    paymentScriptPromise = (async () => {
      for (const url of PAYMENT_SCRIPT_URLS) {
        try {
          await loadPaymentScript(url);
        } catch (error) {
          console.warn('[Galaxy Run Rivals] Payment script load warning:', error);
        }
      }

      paymentScriptsReady = typeof window.DoRequest === 'function' || typeof DoRequest === 'function';
      if (paymentScriptsReady) {
        console.log('[Galaxy Run Rivals] Payment scripts ready.');
      } else {
        console.warn('[Galaxy Run Rivals] Payment scripts loaded but DoRequest is still unavailable.');
      }
      return paymentScriptsReady;
    })().finally(() => {
      paymentScriptPromise = null;
    });

    return paymentScriptPromise;
  }

  function productForCheckout(kind, id) {
    if (kind === 'bundle') {
      const bundle = BUNDLES.find((item) => item.id === id);
      if (!bundle) return null;
      const itemLine = Object.entries(bundle.items).map(([key, count]) => `${ITEMS[key].name} x${count}`).join(', ');
      return {
        kind: 'bundle',
        id: bundle.id,
        product: bundle,
        name: bundle.name,
        desc: `${formatNumber(bundle.coins)} Coins + ${itemLine}`,
        amount: parseUsdPrice(bundle.price)
      };
    }

    const pack = COIN_PACKS.find((item) => item.id === id);
    if (!pack) return null;
    return {
      kind: 'coinPack',
      id: pack.id,
      product: pack,
      name: pack.name,
      desc: `${formatNumber(pack.coins)} Coins`,
      amount: parseUsdPrice(pack.price)
    };
  }

  function setCheckoutPayButtonsEnabled(enabled) {
    document.querySelectorAll('[data-checkout-pay]').forEach((button) => {
      button.disabled = !enabled;
      button.classList.toggle('disabled', !enabled);
      button.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    });
  }

  function warmPaymentScriptsFromGesture(reason = 'gesture') {
    // Mobile browsers are stricter about popup/redirect gestures.
    // Start loading on the first real user gesture, but never block the game.
    try {
      primePaymentScripts(reason);
    } catch (error) {
      console.warn('[Galaxy Run Rivals] Payment warmup skipped:', error);
    }
  }

  function handleCheckoutPayButton(payButton, event) {
    if (!payButton) return false;

    // Important for mobile: touchend should not call DoRequest and should not prevent the follow-up click.
    // Some payment SDKs work more reliably when called from the native click event.
    if (event && event.type === 'touchend') {
      checkoutPayTouchAt = performance.now();
      warmPaymentScriptsFromGesture('checkout-touch-only');
      return false;
    }

    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (payButton.disabled || payButton.classList.contains('disabled')) {
      dom.checkoutStatus.textContent = isPaymentApiReady()
        ? 'Payment component ready. Tap your payment method again.'
        : 'Payment component is loading. Please wait, then tap your payment method again.';
      warmPaymentScriptsFromGesture('disabled-pay-button');
      return false;
    }

    const now = performance.now();
    if (now < checkoutPayBusyUntil) return false;
    if (checkoutPayLastType === String(payButton.dataset.checkoutPay) && checkoutPayLastAt && now - checkoutPayLastAt < 900) return false;

    checkoutPayLastType = String(payButton.dataset.checkoutPay || '');
    checkoutPayLastAt = now;
    checkoutPayBusyUntil = now + 1300;

    // Direct SDK call inside the real click gesture. No bridge window and no dependency on SDK return URL.
    const result = confirmCheckout(Number(payButton.dataset.checkoutPay));
    setTimeout(() => { checkoutPayBusyUntil = 0; }, 1500);
    return result;
  }

  function bindCheckoutPayButtonsDirectly() {
    document.querySelectorAll('[data-checkout-pay]').forEach((button) => {
      if (button.dataset.boundCheckoutPay === '1') return;
      button.dataset.boundCheckoutPay = '1';

      // Touch only warms and records the gesture. Do not preventDefault here,
      // because some mobile browsers/payment SDKs rely on the follow-up click.
      button.addEventListener('touchend', (event) => {
        checkoutPayTouchAt = performance.now();
        warmPaymentScriptsFromGesture('checkout-button-touch');
        if (button.disabled || button.classList.contains('disabled')) {
          dom.checkoutStatus.textContent = isPaymentApiReady()
            ? 'Payment component ready. Tap your payment method again.'
            : 'Payment component is loading. Please wait, then tap your payment method again.';
        }
      }, { passive: true });

      button.addEventListener('click', (event) => {
        handleCheckoutPayButton(button, event);
      });
    });
  }

  function openCheckout(kind, id) {
    const summary = productForCheckout(kind, id);
    if (!summary) return;
    audio.click();

    selectedCheckout = summary;
    dom.checkoutProductName.textContent = summary.name;
    dom.checkoutProductDesc.textContent = summary.desc;
    dom.checkoutAmount.textContent = `$${summary.amount.toFixed(2)}`;
    dom.checkoutEmail.value = getDefaultCheckoutEmail();
    const readyNow = isPaymentApiReady();
    setCheckoutPayButtonsEnabled(readyNow);
    dom.checkoutStatus.textContent = readyNow
      ? 'Payment component ready. Choose a payment method.'
      : 'Loading payment component...';
    dom.paymentCheckoutOverlay.classList.remove('hidden');
    bindCheckoutPayButtonsDirectly();

    primePaymentScripts('checkout').then((ready) => {
      if (!selectedCheckout || selectedCheckout.id !== summary.id || !dom.paymentCheckoutOverlay || dom.paymentCheckoutOverlay.classList.contains('hidden')) return;
      setCheckoutPayButtonsEnabled(ready);
      dom.checkoutStatus.textContent = ready
        ? 'Payment component ready. Choose a payment method.'
        : 'Payment component failed to load. Refresh and try again.';
    });

    setTimeout(() => dom.checkoutEmail.focus(), 50);
  }

  function closeCheckout() {
    selectedCheckout = null;
    setCheckoutPayButtonsEnabled(false);
    if (dom.paymentCheckoutOverlay) dom.paymentCheckoutOverlay.classList.add('hidden');
  }

  function grantPaidProduct(payload) {
    if (!payload) return false;

    if (payload.kind === 'coinPack') {
      const pack = COIN_PACKS.find((item) => item.id === payload.id);
      if (!pack) return false;
      data.coins += pack.coins;
      saveData();
      renderShop();
      updateHUD();
      window.alert(`${pack.name} payment successful. ${formatNumber(pack.coins)} Coins added.`);
      return true;
    }

    if (payload.kind === 'bundle') {
      const bundle = BUNDLES.find((item) => item.id === payload.id);
      if (!bundle) return false;
      data.coins += bundle.coins;
      addItemsToWallet(bundle.items);
      if (bundle.skin && !data.ownedSkins.includes(bundle.skin)) data.ownedSkins.push(bundle.skin);
      if (bundle.skin) data.equippedSkin = bundle.skin;
      if (!data.purchasedBundles.includes(bundle.id)) data.purchasedBundles.push(bundle.id);
      saveData();
      renderShop();
      updateHUD();
      window.alert(`${bundle.name} payment successful. Bundle rewards added to your wallet.`);
      return true;
    }

    return false;
  }

  function handlePaymentReturn() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const status = params.get('payment');
      const orderId = params.get('orderId');
      if (!status || !orderId) return;

      const pending = getPendingPayments();
      const payload = pending[orderId];

      if (status === 'success' && payload) {
        grantPaidProduct(payload);
        removePendingPayment(orderId);
      } else if (status === 'failed') {
        window.alert('Payment was not completed. Your coins were not changed.');
        if (payload) removePendingPayment(orderId);
      }

      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.warn('Payment return handling skipped:', error);
    }
  }

  function buildPaymentOptions(summary, payType, email) {
    const orderId = `A${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const customer = splitCustomerName();

    return {
      orderId: orderId,
      amount: Number(summary.amount.toFixed(2)),
      currency: 'USD',
      payTypes: Number(payType) || PAYMENT_PAY_TYPES.card,
      name: summary.name,
      email: email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: '135',
      successUrl: paymentReturnUrl('success', orderId),
      backUrl: paymentReturnUrl('failed', orderId),
      _localPayload: {
        orderId: orderId,
        kind: summary.kind,
        id: summary.id,
        amount: Number(summary.amount.toFixed(2)),
        currency: 'USD',
        name: summary.name,
        payType: Number(payType) || PAYMENT_PAY_TYPES.card
      }
    };
  }

  function resolvePaymentRedirect(result) {
    if (!result) return '';
    if (typeof result === 'string' && /^https?:\/\//i.test(result)) return result;
    if (typeof result === 'object') {
      const direct = result.url || result.payUrl || result.paymentUrl || result.redirectUrl || result.checkoutUrl || result.href || '';
      if (direct) return direct;
      const data = result.data || result.result || result.response || {};
      if (data && typeof data === 'object') {
        return data.url || data.payUrl || data.paymentUrl || data.redirectUrl || data.checkoutUrl || data.href || '';
      }
    }
    return '';
  }

  function isDoPayPromiseWrapperError(error) {
    const message = readablePaymentError(error);
    return /DoPay\(data\).*not a function/i.test(message)
      || /DoPay\(data\).*Promise/i.test(message)
      || /instance of Promise/i.test(message);
  }

  function getDoPayFunction() {
    if (typeof DoPay === 'function') return DoPay;
    if (typeof window.DoPay === 'function') return window.DoPay;
    return null;
  }

  function handlePaymentSdkResult(result, options, source = 'unknown') {
    window.__lastGalaxyPayReturn = result || null;
    window.__lastGalaxyPaySdkSource = source;

    const redirectUrl = resolvePaymentRedirect(result);
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return result;
    }

    if (result && typeof result.then === 'function') {
      result.then((resolved) => {
        window.__lastGalaxyPayReturn = resolved || null;
        window.__lastGalaxyPaySdkSource = `${source}:promise-resolved`;
        const asyncUrl = resolvePaymentRedirect(resolved);
        if (asyncUrl) {
          window.location.href = asyncUrl;
          dom.checkoutStatus.textContent = 'Opening secure payment...';
        } else {
          dom.checkoutStatus.textContent = 'Payment request sent. Follow the payment page if it opened.';
        }
      }).catch((error) => {
        window.__lastGalaxyPayError = {
          message: readablePaymentError(error),
          error,
          options,
          source,
          time: new Date().toISOString()
        };
        dom.checkoutStatus.textContent = `Payment SDK error: ${readablePaymentError(error)}`;
      });
    }

    return result;
  }

  function callDoPayFallback(options, originalError = null) {
    const doPay = getDoPayFunction();
    if (!doPay) {
      if (originalError) throw originalError;
      throw new Error('DoPay is not available');
    }

    console.warn('[Galaxy Run Rivals] DoRequest failed; using DoPay(options) fallback.', originalError);
    window.__lastGalaxyPayFallback = {
      reason: originalError ? readablePaymentError(originalError) : 'manual',
      time: new Date().toISOString()
    };

    const result = doPay(options);
    return handlePaymentSdkResult(result, options, 'DoPay-fallback');
  }

  function callPaymentApi(options) {
    window.__lastGalaxyPayOptions = options;
    window.__lastGalaxyPayError = null;
    window.__lastGalaxyPayFallback = null;
    console.log('[Galaxy Run Rivals] Calling DoRequest(options):', options);

    // Primary path: follow the provided integration method.
    // Fallback path: PayApi-v2 may implement DoRequest as `(DoPay(data))()`,
    // but the current DoPay returns a Promise, not a function. In that case,
    // call DoPay(options) directly without the extra ().
    try {
      const request = typeof DoRequest === 'function' ? DoRequest : window.DoRequest;
      if (typeof request !== 'function') return callDoPayFallback(options);
      const result = request(options);
      return handlePaymentSdkResult(result, options, 'DoRequest');
    } catch (error) {
      if (isDoPayPromiseWrapperError(error)) {
        return callDoPayFallback(options, error);
      }
      throw error;
    }
  }

  function readablePaymentError(error) {
    if (!error) return 'Unknown payment error';
    if (typeof error === 'string') return error;
    return error.message || error.reason || error.toString() || 'Unknown payment error';
  }

  function confirmCheckout(payType = PAYMENT_PAY_TYPES.card) {
    if (!selectedCheckout) {
      dom.checkoutStatus.textContent = 'Please select a product first.';
      return false;
    }

    const email = String(dom.checkoutEmail.value || '').trim();
    if (!isValidCheckoutEmail(email)) {
      dom.checkoutStatus.textContent = 'Please enter a valid checkout email.';
      dom.checkoutEmail.focus();
      return false;
    }

    data.checkoutEmail = email;
    saveData();

    if (!isPaymentApiReady()) {
      setCheckoutPayButtonsEnabled(false);
      dom.checkoutStatus.textContent = 'Payment component is loading. Please wait, then tap your payment method again.';
      primePaymentScripts('pay-button').then((ready) => {
        if (!selectedCheckout || !dom.paymentCheckoutOverlay || dom.paymentCheckoutOverlay.classList.contains('hidden')) return;
        setCheckoutPayButtonsEnabled(ready);
        dom.checkoutStatus.textContent = ready
          ? 'Payment component ready. Tap your payment method again.'
          : 'Payment component failed to load. Refresh and try again.';
      });
      return false;
    }

    const options = buildPaymentOptions(selectedCheckout, payType, email);
    const localPayload = options._localPayload;
    savePendingPayment(options.orderId, localPayload);
    delete options._localPayload;

    dom.checkoutStatus.textContent = 'Opening secure payment...';
    window.__lastGalaxyPayError = null;
    window.__lastGalaxyPayStatus = {
      state: 'calling',
      options,
      time: new Date().toISOString()
    };

    try {
      callPaymentApi(options);
      window.__lastGalaxyPayStatus = {
        state: 'called',
        options,
        time: new Date().toISOString()
      };
      dom.checkoutStatus.textContent = 'Payment opened. Complete checkout to receive your rewards.';
      // Do not show any browser alert after calling DoRequest successfully.
      return true;
    } catch (error) {
      const message = readablePaymentError(error);
      window.__lastGalaxyPayError = {
        message,
        error,
        options,
        time: new Date().toISOString()
      };
      window.__lastGalaxyPayStatus = {
        state: 'error-after-call',
        message,
        options,
        time: new Date().toISOString()
      };
      console.error('[Galaxy Run Rivals] DoRequest failed:', error);
      // Do not show a browser popup here. Some payment SDKs may open/redirect and still throw a noisy sync error.
      // Keep the message inside the checkout modal so a successful payment jump is not interrupted.
      dom.checkoutStatus.textContent = `Payment did not open here. If a checkout page opened, please complete it there. Otherwise try again. (${message})`;
      return false;
    }
  }

  function buyBundle(id) {
    openCheckout('bundle', id);
  }

  function buyCoinPack(id) {
    openCheckout('coinPack', id);
  }

  function buyUpgrade(key) {
    if (!requireLogin('Ship upgrades')) return;
    const upgrade = UPGRADES[key];
    if (!upgrade) return;
    const level = upgradeLevel(key);
    if (level >= upgrade.max) return;
    const cost = upgradeCost(key);
    audio.click();
    if (data.coins < cost) {
      window.alert('Not enough coins. Upgrade ships through runs, milestones, bundles, or coin packs.');
      return;
    }
    data.coins -= cost;
    data.upgrades[key] = level + 1;
    saveData();
    renderShop();
    updateHUD();
  }

  function buyItem(key) {
    if (!requireLogin('Item purchases')) return;
    const item = ITEMS[key];
    if (!item) return;
    audio.click();
    if (data.coins < item.cost) {
      window.alert('Not enough coins. Play more runs or use a coin pack placeholder.');
      return;
    }
    data.coins -= item.cost;
    data.ownedItems[key] = (data.ownedItems[key] || 0) + 1;
    saveData();
    renderShop();
  }

  function skinAction(id) {
    if (!requireLogin('Skin unlocks')) return;
    const skin = SKINS.find((s) => s.id === id);
    if (!skin) return;
    audio.click();
    const owned = data.ownedSkins.includes(id);
    if (!owned) {
      if (data.coins < skin.cost) {
        window.alert('Not enough coins to unlock this skin.');
        return;
      }
      data.coins -= skin.cost;
      data.ownedSkins.push(id);
    }
    data.equippedSkin = id;
    saveData();
    renderShop();
  }

  function resetData() {
    const ok = window.confirm(isGuestMode() ? 'Reset guest Rookie Mode progress on this device?' : 'Reset progress for the current account only? Coins, skins, items, levels, leaderboard, and settings will be cleared.');
    if (!ok) return;
    localStorage.removeItem(currentSaveKey());
    data = loadData();
    if (hasActiveAccount()) data.playerName = accounts[currentUserId].displayName.slice(0, 18) || data.playerName;
    else data.playerName = 'Guest Rookie';
    saveData();
    dom.playerNameInput.value = data.playerName;
    selectedMode = data.currentMode;
    selectedLevel = data.selectedLevel;
    updateSettingsUI();
    updateDailyCard();
    renderModes();
    renderShop();
    renderLeaderboard();
    updateHUD();
  }

  function claimDailyReward() {
    if (!requireLogin('Daily rewards')) return;
    if (todayClaimed()) return;
    audio.click();
    data.coins += 75;
    data.lastLoginDate = TODAY;
    data.dailyReward.streak = (data.dailyReward.streak || 0) + 1;
    data.dailyReward.claimedDates = (data.dailyReward.claimedDates || []).concat(TODAY).slice(-30);
    saveData();
    updateDailyCard();
    updateHUD();
  }

  function setupEvents() {
    function handleItemUseButton(useBtn, event) {
      if (!useBtn) return false;
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();

      const now = performance.now();
      const key = useBtn.dataset.useItem;
      if (event && event.type === 'touchend') {
        itemTouchAt = now;
        itemTouchKey = key;
      }
      if (event && event.type === 'click' && itemTouchAt && itemTouchKey === key && now - itemTouchAt < 700) return false;
      if (itemUseLastKey === key && itemUseLastAt && now - itemUseLastAt < 180) return false;
      itemUseLastKey = key;
      itemUseLastAt = now;

      const used = useItem(key, key === 'speedBoost' ? { allowFreeSprint: true } : {});
      if (used && isMobileLayout()) setMobileItemsOpen(false);
      return used;
    }



    document.addEventListener('click', (event) => {
      if (event.target.closest('button')) audio.unlock();
    }, { passive: true });

    function addButtonFeedback(button, event) {
      if (!button || button.disabled || button.classList.contains('disabled')) return;
      button.classList.add('tap-active');
      setTimeout(() => button.classList.remove('tap-active'), 180);

      const rect = button.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ripple = document.createElement('span');
      ripple.className = 'tap-ripple';
      const size = Math.max(rect.width, rect.height) * 1.25;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${(event.clientX || rect.left + rect.width / 2) - rect.left - size / 2}px`;
      ripple.style.top = `${(event.clientY || rect.top + rect.height / 2) - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 520);
    }

    document.addEventListener('pointerdown', (event) => {
      warmPaymentScriptsFromGesture('pointerdown');
      const button = event.target.closest('button');
      if (!button) return;
      addButtonFeedback(button, event);
    }, { passive: true });

    document.addEventListener('touchstart', () => {
      warmPaymentScriptsFromGesture('touchstart');
    }, { passive: true });

    document.addEventListener('pointerup', (event) => {
      const button = event.target.closest('button');
      if (button) button.classList.remove('tap-active');
    }, { passive: true });

    document.addEventListener('pointercancel', () => {
      $$('button.tap-active').forEach((button) => button.classList.remove('tap-active'));
    }, { passive: true });

    dom.authTabs.forEach((button) => {
      button.addEventListener('click', () => {
        audio.click();
        switchAuthTab(button.dataset.authTab);
      });
    });
    dom.loginForm.addEventListener('submit', handleLogin);
    dom.registerForm.addEventListener('submit', handleRegister);
    dom.guestPlayBtn.addEventListener('click', launchRookieMode);
    dom.guestPlayBtn.addEventListener('touchend', launchRookieMode, { passive: false });
    dom.logoutBtn.addEventListener('click', () => { audio.click(); logout(); });
    dom.logoutSettingsBtn.addEventListener('click', () => { audio.click(); logout(); });

    dom.playerNameInput.value = data.playerName;
    dom.playerNameInput.addEventListener('change', () => setPlayerName(dom.playerNameInput.value));
    dom.playerNameInput.addEventListener('blur', () => {
      setPlayerName(dom.playerNameInput.value);
      dom.playerNameInput.value = data.playerName;
    });

    dom.startBtn.addEventListener('click', launchRookieMode);
    dom.startBtn.addEventListener('touchend', launchRookieMode, { passive: false });
    dom.modeBtn.addEventListener('click', () => { audio.click(); if (!requireLogin('Arena and Level modes')) return; showScreen('modeScreen'); renderModes(); });
    dom.shopBtn.addEventListener('click', () => { audio.click(); if (!requireLogin('Shop')) return; showScreen('shopScreen'); });
    dom.leaderboardBtn.addEventListener('click', () => { audio.click(); if (!requireLogin('Leaderboard')) return; showScreen('leaderboardScreen'); });
    dom.settingsBtn.addEventListener('click', () => { audio.click(); showScreen('settingsScreen'); updateSettingsUI(); });
    $$('.backHomeBtn').forEach((btn) => btn.addEventListener('click', () => { audio.click(); if (typeof clearTransientRunState === 'function') clearTransientRunState(); showScreen('startScreen'); }));
    dom.startSelectedModeBtn.addEventListener('click', launchSelectedMode);
    dom.startSelectedModeBtn.addEventListener('touchend', launchSelectedMode, { passive: false });
    dom.claimDailyBtn.addEventListener('click', claimDailyReward);

    document.addEventListener('click', (event) => {
      const modeCard = event.target.closest('.mode-card');
      if (modeCard) {
        audio.click();
        if (!requireLogin('Full game modes')) return;
        selectedMode = isValidMode(modeCard.dataset.mode) ? modeCard.dataset.mode : 'classic';
        if (selectedMode === 'level' && !isLevelUnlocked(selectedLevel)) selectedLevel = firstUnlockedLevel();
        if (selectedMode !== 'level') selectedLevel = 1;
        data.currentMode = selectedMode;
        data.selectedLevel = selectedLevel;
        saveData();
        renderModes();
      }
      const levelBtn = event.target.closest('.level-btn');
      if (levelBtn && !levelBtn.disabled) {
        audio.click();
        if (!requireLogin('Level Mode')) return;
        const picked = Number(levelBtn.dataset.level || 1);
        selectedLevel = isLevelUnlocked(picked) ? picked : firstUnlockedLevel();
        data.selectedLevel = selectedLevel;
        saveData();
        renderLevelSelect();
      }
      const bundleBtn = event.target.closest('[data-buy-bundle]');
      if (bundleBtn) buyBundle(bundleBtn.dataset.buyBundle);
      const packBtn = event.target.closest('[data-buy-pack]');
      if (packBtn) buyCoinPack(packBtn.dataset.buyPack);
      const checkoutPayBtn = event.target.closest('[data-checkout-pay]');
      if (checkoutPayBtn) handleCheckoutPayButton(checkoutPayBtn, event);
      const itemBtn = event.target.closest('[data-buy-item]');
      if (itemBtn) buyItem(itemBtn.dataset.buyItem);
      const upgradeBtn = event.target.closest('[data-buy-upgrade]');
      if (upgradeBtn) buyUpgrade(upgradeBtn.dataset.buyUpgrade);
      const skinBtn = event.target.closest('[data-skin-action]');
      if (skinBtn) skinAction(skinBtn.dataset.skinAction);
      const tabBtn = event.target.closest('.tab-btn');
      if (tabBtn) {
        audio.click();
        activeShopTab = tabBtn.dataset.tab;
        renderShop();
      }
      const useBtn = event.target.closest('[data-use-item]');
      if (useBtn) handleItemUseButton(useBtn, event);
    });

    document.addEventListener('touchend', (event) => {
      const checkoutPayBtn = event.target.closest('[data-checkout-pay]');
      if (checkoutPayBtn) {
        // Do not prevent default here; mobile payment is opened from the follow-up click.
        checkoutPayTouchAt = performance.now();
        warmPaymentScriptsFromGesture('document-pay-touch');
        return;
      }
      const useBtn = event.target.closest('[data-use-item]');
      if (useBtn) handleItemUseButton(useBtn, event);
    }, { passive: false });

    dom.pauseBtn.addEventListener('click', () => togglePause());
    dom.gameHomeBtn.addEventListener('click', () => { audio.click(); hardResetLaunchState(); clearTransientRunState(); showScreen('startScreen'); });
    dom.resumeBtn.addEventListener('click', () => togglePause(false));
    dom.restartPauseBtn.addEventListener('click', restartGame);
    dom.restartPauseBtn.addEventListener('touchend', restartGame, { passive: false });
    dom.homePauseBtn.addEventListener('click', () => { audio.click(); hardResetLaunchState(); clearTransientRunState(); showScreen('startScreen'); });
    dom.continueRunBtn.addEventListener('click', continueRun);
    dom.restartBtn.addEventListener('click', restartGame);
    dom.restartBtn.addEventListener('touchend', restartGame, { passive: false });
    dom.homeBtn.addEventListener('click', () => { audio.click(); hardResetLaunchState(); clearTransientRunState(); showScreen('startScreen'); });
    if (dom.mobileItemsToggle) {
      dom.mobileItemsToggle.addEventListener('click', toggleMobileItems);
      dom.mobileItemsToggle.addEventListener('touchend', toggleMobileItems, { passive: false });
    }
    if (dom.onboardingClose) {
      dom.onboardingClose.addEventListener('click', () => hideOnboardingToast(true));
      dom.onboardingClose.addEventListener('touchend', (event) => {
        event.preventDefault();
        hideOnboardingToast(true);
      }, { passive: false });
    }
    function triggerMobileBoost(event) {
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();
      const now = performance.now();
      if (event && event.type === 'touchend') mobileSkillTouchAt = now;
      if (event && event.type === 'click' && mobileSkillTouchAt && now - mobileSkillTouchAt < 700) return;
      useItem('speedBoost', { allowFreeSprint: true });
    }
    dom.mobileSkillBtn.addEventListener('click', triggerMobileBoost);
    dom.mobileSkillBtn.addEventListener('touchend', triggerMobileBoost, { passive: false });

    dom.musicToggle.addEventListener('click', () => {
      audio.click();
      data.settings.music = !data.settings.music;
      saveData();
      updateSettingsUI();
      audio.syncMusic();
    });
    if (dom.flightSoundToggle) {
      dom.flightSoundToggle.addEventListener('click', () => {
        audio.click();
        data.settings.flightSound = !data.settings.flightSound;
        saveData();
        updateSettingsUI();
        audio.syncEngine();
      });
    }
    dom.sfxToggle.addEventListener('click', () => {
      data.settings.sfx = !data.settings.sfx;
      saveData();
      updateSettingsUI();
      audio.click();
    });
    dom.resetDataBtn.addEventListener('click', resetData);
    if (dom.checkoutCancelBtn) dom.checkoutCancelBtn.addEventListener('click', closeCheckout);
    if (dom.paymentCheckoutOverlay) {
      dom.paymentCheckoutOverlay.addEventListener('click', (event) => {
        if (event.target === dom.paymentCheckoutOverlay) closeCheckout();
      });
    }

    window.addEventListener('resize', resizeCanvas);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 160));
    document.addEventListener('touchmove', (event) => {
      if (currentScreen !== 'gameScreen') return;
      if (event.target.closest('.menu-screen, .panel, .brand-card, .shop-scroll, .leaderboard-list, .level-select, .shop-tabs')) return;
      event.preventDefault();
    }, { passive: false });

    document.addEventListener('keydown', (event) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) event.preventDefault();
      game.keys[event.code] = true;
      if (currentScreen === 'gameScreen') {
        if (event.code === 'Space') useItem('speedBoost', { allowFreeSprint: true });
        if (ITEM_HOTKEYS[event.code]) useItem(ITEM_HOTKEYS[event.code], ITEM_HOTKEYS[event.code] === 'speedBoost' ? { allowFreeSprint: true } : {});
        if (event.code === 'KeyP') togglePause();
        if (event.code === 'KeyR') restartGame();
      }
    });
    document.addEventListener('keyup', (event) => {
      game.keys[event.code] = false;
    });

    dom.canvas.addEventListener('pointerdown', (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (!game.running || game.paused || game.over || !game.player) return;
      game.pointerActive = true;
      const p = screenPoint(event);
      const mobile = isMobileLayout() || event.pointerType === 'touch';
      if (mobile) {
        mobileDragStart = {
          pointerX: p.x,
          pointerY: p.y,
          shipX: game.player.x,
          shipY: game.player.y
        };
        setPlayerTarget(game.player.x, game.player.y);
      } else {
        setPlayerTarget(p.x, p.y);
      }
      dom.canvas.setPointerCapture?.(event.pointerId);
    });
    dom.canvas.addEventListener('pointermove', (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (!game.pointerActive || !game.running || game.paused || game.over || !game.player) return;
      const p = screenPoint(event);
      const mobile = isMobileLayout() || event.pointerType === 'touch';
      if (mobile && mobileDragStart) {
        const dx = p.x - mobileDragStart.pointerX;
        const dy = p.y - mobileDragStart.pointerY;
        setPlayerTarget(
          mobileDragStart.shipX + dx * 1.12,
          mobileDragStart.shipY + dy * 0.62
        );
      } else if (mobile) {
        setPlayerTarget(p.x, p.y - mobileTouchShipOffset());
      } else {
        setPlayerTarget(p.x, p.y);
      }
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => {
      dom.canvas.addEventListener(type, (event) => {
        if (event && event.preventDefault) event.preventDefault();
        game.pointerActive = false;
        mobileDragStart = null;
      });
    });
  }

  function init() {
    try {
      if (dom.canvas) dom.canvas.style.touchAction = 'none';
      resizeCanvas();
      setupEvents();
      if (!hasActiveAccount()) {
        currentUserId = '';
        try { localStorage.removeItem(SESSION_KEY); } catch (error) {}
      } else {
        data = loadData();
      }
      data = hydrateData(data);
      syncLoadedDataToUI();
      handlePaymentReturn();
      game.resetRuntime();
      setAuthMessage('', false);
      showScreen('startScreen');
      animationId = requestAnimationFrame(loop);
    } catch (error) {
      console.error('Init recovered:', error);
      try {
        data = hydrateData(null);
        currentUserId = '';
        if (dom.canvas) dom.canvas.style.touchAction = 'none';
        resizeCanvas();
        setupEvents();
        syncLoadedDataToUI();
        handlePaymentReturn();
        game.resetRuntime();
        showScreen('startScreen');
        ensureGameLoopRunning('init-recover');
      } catch (fatal) {
        console.error('Init failed:', fatal);
      }
    }
  }

  window.__GRRForceStart = function () {
    try {
      directStartAt = performance.now();
      game.launchLockUntil = 0;
      startGame('classic', 1, { force: true });
      return true;
    } catch (error) {
      emergencyLaunchRun(error);
      return false;
    }
  };

  window.__GRRForceModeStart = function (mode, level) {
    try {
      modeStartAt = performance.now();
      const safe = sanitizeModeSelection(mode || selectedMode, level || selectedLevel);
      game.launchLockUntil = 0;
      doLaunchRun(safe.mode, safe.level, { skipLock: true });
      return true;
    } catch (error) {
      emergencyLaunchRun(error);
      return false;
    }
  };


  window.__GalaxyAudioHealth = function () {
    return {
      hasAudioContext: !!(window.AudioContext || window.webkitAudioContext),
      initialized: !!audio.ctx,
      musicOn: !!data.settings.music,
      flightSoundOn: !!data.settings.flightSound,
      sfxOn: !!data.settings.sfx,
      musicActive: !!audio.music,
      engineActive: !!audio.engine,
      engineLevel: audio.engineLevel || 0,
      screen: currentScreen,
      running: !!game.running,
      paused: !!game.paused,
      boostActive: !!(game.active && game.active.speedBoost > 0)
    };
  };

  window.__GalaxyMobileControlHealth = function () {
    return {
      isMobile: isMobileLayout(),
      screen: currentScreen,
      player: game.player ? {
        x: Math.round(game.player.x),
        y: Math.round(game.player.y),
        targetX: Math.round(game.targetX || game.player.targetX || 0),
        targetY: Math.round(game.targetY || game.player.targetY || 0)
      } : null,
      bounds: mobileControlBounds(),
      pointerActive: !!game.pointerActive,
      mobileDragStart,
      itemDockVisible: !!dom.itemDock,
      onboardingHidden: dom.onboardingToast ? dom.onboardingToast.classList.contains('hidden') : null
    };
  };

  window.__GalaxyItemHealth = function () {
    return {
      currentScreen,
      running: !!game.running,
      paused: !!game.paused,
      over: !!game.over,
      ownedItems: Object.assign({}, data.ownedItems || {}),
      active: Object.assign({}, game.active || {}),
      cooldowns: Object.assign({}, game.cooldowns || {}),
      reviveArmed: !!game.reviveArmed,
      revivedThisRun: !!game.revivedThisRun,
      itemDockSignature,
      itemTouchKey,
      itemDockHtmlLength: dom.itemDock ? dom.itemDock.innerHTML.length : 0
    };
  };

  window.__GalaxyPaymentHealth = function () {
    return {
      loaded: window.__GalaxyRunLoaded === true,
      paymentScriptsReady,
      doRequestType: typeof window.DoRequest === 'function' ? 'window.DoRequest' : (typeof DoRequest === 'function' ? 'DoRequest' : typeof window.DoRequest),
      lastOptions: window.__lastGalaxyPayOptions || null,
      lastReturn: window.__lastGalaxyPayReturn || null,
      lastSdkSource: window.__lastGalaxyPaySdkSource || null,
      lastFallback: window.__lastGalaxyPayFallback || null,
      lastStatus: window.__lastGalaxyPayStatus || null,
      lastError: window.__lastGalaxyPayError || null,
      touchState: { checkoutPayTouchAt, checkoutPayLastAt, checkoutPayLastType, checkoutPayBusyUntil },
      paymentMode: 'click-first-direct-do-request',
      staticPayScripts: {
        cryptoReady: window.__GalaxyCryptoReady,
        payApiLoaded: window.__GalaxyPayApiLoaded
      },
      currentScreen,
      selectedCheckout
    };
  };

  window.__GalaxyRunLoaded = true;
  window.__GalaxyStartHealth = function () {
    return {
      loaded: !!window.__GalaxyRunLoaded,
      activeScreen: document.querySelector('.screen.active')?.id || null,
      currentScreen,
      running: !!game.running,
      over: !!game.over,
      paused: !!game.paused,
      runId: game.runId,
      launchLockUntil: game.launchLockUntil || 0,
      hasStartButton: !!document.querySelector('#startBtn'),
      hasGameCanvas: !!document.querySelector('#gameCanvas'),
      gameOverHidden: dom.gameOverOverlay ? dom.gameOverOverlay.classList.contains('hidden') : null,
      pauseHidden: dom.pauseOverlay ? dom.pauseOverlay.classList.contains('hidden') : null,
      checkoutHidden: dom.paymentCheckoutOverlay ? dom.paymentCheckoutOverlay.classList.contains('hidden') : null,
      hasDoRequest: typeof window.DoRequest === 'function' || typeof DoRequest === 'function',
      score: Math.floor(game.score || 0),
      distance: Math.floor(game.distance || 0),
      speed: Math.floor(game.speed || 0),
      loopRunning,
      lastLoopAgoMs: Math.floor(performance.now() - (lastLoopAt || 0)),
      lastProgressAgoMs: Math.floor(performance.now() - (lastProgressAt || 0)),
      loopErrorCount,
      obstacles: game.obstacles ? game.obstacles.length : 0,
      coins: game.coins ? game.coins.length : 0
    };
  };
  init();
  setTimeout(() => primePaymentScripts('idle-fast'), 280);
})();
