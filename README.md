# Neon Run Rivals

A complete HTML5 Canvas runner mini game built with vanilla HTML, CSS, and JavaScript.

This project is ready for GitHub and GitHub Pages. No backend, build step, framework, package manager, CDN, or external assets are required.

## Project structure

```text
neon-run-rivals/
├── index.html
├── style.css
├── game.js
├── README.md
├── .gitignore
├── .nojekyll
└── .github/
    └── workflows/
        └── pages.yml
```

## Run locally

Open `index.html` directly in a browser.

Recommended browsers:

- Chrome
- Edge
- Safari
- Firefox
- Mobile Chrome / Mobile Safari

## Publish to GitHub Pages

### Option 1: Deploy from branch

1. Create a new GitHub repository.
2. Upload all files in this project to the repository root.
3. Make sure `index.html` is in the root directory, not inside another nested folder.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, select:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save and wait for GitHub Pages to generate the site URL.

### Option 2: Deploy with GitHub Actions

This package also includes `.github/workflows/pages.yml`.

1. Upload all files to the repository root.
2. Go to **Settings → Pages**.
3. Set Source to **GitHub Actions**.
4. Push to the `main` branch.
5. The workflow will publish the static site automatically.

## Game modes

- **Classic Mode**: Endless runner focused on high score.
- **Arena Mode**: Live AI rival scores and ranking pressure.
- **Level Mode**: Goal-based levels with 3-star progress saved locally.

## Controls

### PC

- `WASD` / `Arrow Keys`: move runner
- `Space`: speed skill / boost
- `P`: pause / resume
- `R`: restart

### Mobile

- Drag on the game screen to move the runner.
- Tap the large bottom-right BOOST button to use the speed skill.
- Layout is fixed full-screen and disables page scrolling.

## Account login, Guest Rookie Mode, and local data saved

This build includes a front-end Register / Login flow plus Guest Rookie Mode. It does not require a backend. Accounts are saved in this browser with `localStorage`, and each account has its own progress save.

Guest flow:

- Players can click **Play Rookie Mode as Guest** without registering.
- Guest mode starts a beginner Classic-style run immediately.
- Guest mode uses slower starting speed for easier onboarding.
- Shop, coin packs, daily rewards, Arena Mode, Level Mode, and official local leaderboard records prompt the player to login/register.
- Guest progress is stored separately and can be imported into a newly registered account on this device.

Storage keys:

- `neonRunRivalsAccounts_v1`: local account list
- `neonRunRivalsSession_v1`: current logged-in account
- `neonRunRivalsSave_v2_<username>`: account-specific game progress
- `neonRunRivalsGuestSave_v1`: guest Rookie Mode progress on this device
- `neonRunRivalsSave_v1`: legacy save key, imported into the first registered account when available

Each account save includes:

- `playerName`
- `bestScore`
- `coins`
- `ownedSkins`
- `equippedSkin`
- `ownedItems`
- `levelProgress`
- `leaderboard`
- `settings`
- `dailyReward`
- `lastLoginDate`

## Shop systems

- Coin packs are front-end mock payment placeholders.
- Items are purchased with coins and stored in localStorage.
- Skins are unlocked and equipped with persistent storage.

## Items

- Shield: blocks one crash during the active window.
- Magnet: pulls nearby coins.
- Double Coins: doubles collected coins temporarily.
- Bomb: clears visible obstacles.
- Speed Boost: temporary acceleration.
- Revive: automatically revives once after a crash.

## Motion upgrade notes

This build includes enhanced runner animation and movement feedback:

- Stronger running cycle with animated arms, legs, shoes, body bobbing, and helmet movement.
- Left/right turning changes body lean, visor direction, scarf/cape flow, and skid streaks.
- Speed Boost uses smoother acceleration, stronger flame trails, road speed lines, and mild screen feedback.
- Boost ending adds a deceleration/braking effect with energy rings and ground streaks.

## QA checklist

- PC start flow works.
- Mobile layout uses fixed full screen with no scrollbars.
- Keyboard movement and restart/pause keys are implemented.
- Touch drag movement is implemented.
- Skill / boost button is implemented.
- Pause, resume, restart, and home flows are implemented.
- Game over modal is responsive.
- Coin pack purchase writes to localStorage.
- Item purchase, item use, cooldown, and duration logic are implemented.
- Leaderboard is saved locally and updates player name.
- Skin unlock/equip is saved locally.
- Level progress and stars are saved locally.
- Register and login forms work locally.
- Guest Rookie Mode works without login.
- Guest-only locked features prompt login/register.
- Logout returns to the login screen with the guest play option.
- Each account keeps separate coins, skins, items, levels, and leaderboard data.
- ZIP can be opened directly through `index.html`.


## V2 Commercial Experience

This version adds a stronger commercial game loop while staying fully static and GitHub Pages friendly:

- Starter / Rival / Champion bundle cards in Shop
- Game Over second-wind continue flow using Revive or Coins
- Milestone rewards to encourage replay
- Skin rarity labels and stronger skin sales copy
- Home screen commercial cards for starter bundle and next goal
- Login/account gated monetization features while Guest Rookie Mode remains playable

All purchases are front-end placeholders only. No real payment backend is included.


## Spaceship Commercial Upgrade

This version focuses on monetization and replay motivation for the spaceship runner direction:

- Distinct spaceship skins with different silhouettes: shuttle, falcon, ray, dragon, UFO, and comet.
- Upgrade system in Shop: Engine Core, Magnet Field, Shield Matrix, Coin Reactor, and Second-Wind Chip.
- Upgrades affect gameplay, including boost duration/power, magnet range, shield duration, coin yield, and continue cost.
- Game Over now highlights how close the player is to the next milestone reward.
- Boost and Magnet feel stronger through extended effects and better coin pull feedback.

Purchases and payment flows are still front-end placeholders only.


## Galaxy Story Immersion Upgrade

This version adds a stronger galaxy-space fantasy around the spaceship runner direction:

- The game is now framed as a deep-space mission across unstable galaxy routes.
- Background visuals include nebula ribbons, a Milky Way dust band, distant planets, asteroids, star particles, and a pulsing star gate.
- Sectors rotate as the player travels: Orion Rift, Andromeda Drift, Nova Forge, and Eclipse Gate.
- HUD now shows the current galaxy sector and mission description.
- Mode Select, Game Over, and home screen copy now support the spaceship/galaxy story.
- The gameplay remains static-site friendly and does not require any backend.


## Control Feel Upgrade

This version improves the spaceship runner feel:

- Movement now uses responsive thruster-style acceleration instead of direct snapping.
- Touch/drag control follows the finger smoothly with spring-like motion.
- Keyboard control is smoother and more predictable.
- Turning/banking is more stable and less twitchy.
- Collision detection is more forgiving by using a smaller danger core than the visual ship.
- Near-miss feedback rewards skilled dodges.
- Early difficulty ramp is smoother, with less sudden obstacle pressure.
- Boost speed-up and slow-down feel more gradual.


## Space Obstacle Upgrade

This version improves obstacle variety and readability for the galaxy spaceship runner:

- Obstacles are now themed for space lanes: asteroids, energy crystals, debris plates, satellites, sentry drones, space mines, and plasma gates.
- Each obstacle has clearer colors and visual identity.
- Approaching hazards show lane warning/telegraph effects.
- Some obstacles such as drones and satellites drift slightly for more dynamic gameplay.
- Collision boxes remain forgiving so the game feels fair.
- Near-miss feedback was adjusted to Clean Dodge rewards.
- Patterns leave readable escape routes instead of blocking every lane.


## Rollback Polish Stable Fix

This version rolls back to the richer galaxy/space-obstacle build instead of the simplified stable rebuild.

Goal:
- Keep the better original visual atmosphere, galaxy background, ship runner feel, obstacle system, shop, upgrades, ships, and overall game presentation.
- Apply only a minimal stability fix for Start Game and Restart.

Fixes:
- Guest users now open directly on the Start Screen instead of being forced into Auth first.
- Start Game works directly for Rookie Mode.
- Restart clears temporary overlays and run state before launching again.
- Home buttons clear run state before returning to the Start Screen.
- Added mobile touchend fallback for Start and Restart.

Validated:
- Open home screen.
- Guest Start Game.
- Keyboard movement.
- Space Boost.
- Pause / Resume.
- Simulated Game Over overlay.
- Restart after Game Over.
- Home then Start again.
- Register account.
- Shop / Upgrades / Ships render.
- Registered account start.


## Ship 3D Visual Upgrade

This update improves the hero spaceship visuals without changing the core game flow. The in-game ship now uses richer layered shading, wing bevels, cockpit highlights, engine pod depth, brighter emissive thrusters, and stronger silhouette lighting to feel more three-dimensional. Shop skin previews were also upgraded with perspective styling so each ship reads more clearly and looks more premium.


## Galaxy Run Rivals V4.1 - Hero Ship & Control Feel Upgrade

This version keeps the existing game logic and focuses only on hero ship visuals and control feel.

- Hero ship remains Canvas-drawn but is tuned for clearer structure: nose, cockpit, wings, rear fins, twin engines, and stronger thruster flames.
- Turn banking is reduced and smoothed so the ship feels responsive without causing dizziness.
- Boost is more readable through tail flames and speed lines, while screen shake and motion-line density are reduced.
- Keyboard and touch movement are tuned to keep light thruster inertia without feeling floaty.
- Collision fairness and Clean Dodge rewards are preserved.
- Ships shop cards receive a stronger premium skin presentation without changing Shop logic.


## Start Game Final Reliability Fix

This version fixes the Start Game reliability issue without changing the core game visuals or gameplay.

What changed:
- Start Game now launches the run first and saves data in the background.
- localStorage failures no longer block Start Game.
- Guest Start and Start Game now use one safe launch path.
- Restart uses the same safe launch path.
- Init has recovery logic if old localStorage data or browser storage restrictions cause issues.
- An emergency Rookie launch fallback was added so the game can still enter gameplay if the normal launch path fails.

Validation performed:
- Start Game from home.
- Guest Start.
- Keyboard movement.
- Space Boost.
- Pause / Resume.
- Simulated Game Over then Restart.
- Home then Start again.
- Register account.
- Shop / Upgrades / Ships render.
- Logged-in Start Game.
- Simulated blocked localStorage environment still starts the game.


## Game Over Restart Final Fix

This version specifically fixes restart problems after Game Over.

What changed:
- Restart now uses a dedicated restart flow instead of behaving like a normal Start click.
- Game Over state, Pause state, Continue card, pressed keys, pointer/touch state, active items, cooldowns, shake, revive state, and boost state are cleared before rebuilding the run.
- A launch lock prevents duplicate Restart execution.
- Mobile touchend/click duplicate firing is deduplicated, so tapping Restart cannot restart twice.
- End Game now clears held inputs and hides Pause overlay before showing the Game Over overlay.
- Continue Run also clears overlay/input state properly.

Validation performed:
- Start Game.
- Trigger actual endGame().
- Click Restart and confirm the game returns to gameScreen.
- Confirm Game Over overlay, Pause overlay, and Continue card are hidden after restart.
- Confirm running=true and over=false after restart.
- Simulate mobile touchend + click and confirm Restart executes only once.
- Restart, then Home, then Start again.


## Email Registration Update

- Login and registration now use an email address instead of a username.
- Registration requires a valid email format.
- Passwords must be at least 6 characters.
- Existing game logic, Start, Restart, Login, Shop, Upgrades, Ships, and localStorage save behavior remain unchanged.


## Mobile Experience Optimization

This version adds a dedicated mobile polish pass without changing the core game logic.

- Uses dynamic viewport height and safe-area spacing for iPhone/Android browsers.
- Adds mobile body state classes for portrait/landscape layout tuning.
- Prevents page scroll and browser pull/overscroll during gameplay.
- Improves touch drag handling on the Canvas.
- Enlarges and repositions mobile Boost button.
- Makes HUD, item dock, Game Over modal, Shop tabs, and panels more comfortable on small screens.
- Adds touchend support to the Boost button with duplicate click suppression.


## Mobile Item Drawer Optimization

- Mobile items no longer stay open on the left side of the gameplay view.
- Added a compact ITEMS button on the lower-left corner.
- Item dock is collapsed by default and opens as a temporary drawer only when needed.
- The item drawer auto-closes after a short delay or after using an item.
- Boost remains on the lower-right corner for fast access.


## Mobile Quick Items Bar

- Mobile item access was adjusted after feedback that a fully collapsed drawer made items inconvenient.
- The mobile view now keeps common items available in a compact quick bar.
- The MORE button expands the full item list only when needed.
- Boost remains on the lower-right corner.


## V4.2 Mobile Onboarding & Reward Upgrade

- Added a lightweight in-game onboarding toast for mobile drag controls, Boost, and quick items.
- Added desktop control hints for first runs.
- Added a Game Over reward-progress card showing the next milestone and how close the player was.
- Improved Game Over conversion messaging for Continue / rewards / account creation.
- Enhanced bundle card sales cues without changing payment/backend logic.
- Kept Start, Restart, Login, Shop, mobile controls, and core gameplay logic intact.


## V4.3 Mode Gameplay Differentiation

- Classic Mode is now positioned as the stable endless best-score mode with standard coin rhythm and fair hazards.
- Arena Mode now uses faster pace, rival ships, live rank, overtake bonuses, more aggressive hazards, and visible rival pilots on the lane.
- Level Mode now uses mission goals: score target + coin target. When both are completed, the sector ends with a Sector Clear result.
- Mode HUD and mission brief now explain the current mode goal more clearly.
- Game Over title changes by mode: Ship Down / Race Finished / Sector Clear.
- Core Start, Restart, Login, Shop, mobile controls, and localStorage logic remain unchanged.


## Mode Select Start Stability Fix

- Added a dedicated safe launch path for Start Selected Mode.
- Mode Select now validates selected mode and selected level before launch.
- Locked or missing level selections automatically fall back to the first unlocked level.
- Start Selected Mode bypasses stale launch locks from prior card taps and prevents touchend/click double triggering.
- Mode card selection now keeps selectedMode and selectedLevel synchronized with saved data.
- Opening Mode Select clears stale launch lock state.


## Unified Start Game Reliability Fix

- Start Screen is now the default active screen in HTML, so the page opens directly to the playable home screen even before JS recovery finishes.
- Start Game now clears stale launch locks and uses a forced safe launch path.
- Start Game has touchend/click de-duplication for mobile browsers.
- startGame() no longer silently fails when a stale launch lock exists.
- Added global fallback launch functions for Start Game and Mode Start.
- Added inline fallback handlers for Start Game, Continue as Guest, and Start Selected Mode.


## Interaction Feedback and Menu Scroll Fix

- Menu screens now support vertical scrolling on mobile and small desktop heights.
- The game canvas still blocks page gestures during gameplay, but Start / Shop / Settings / Leaderboard pages can scroll normally.
- Added visible tap/click feedback to buttons, including pressed state, glow, and ripple effect.
- Improved touch behavior so mobile taps feel responsive without breaking Start / Restart / Shop logic.


## Non-blocking Payment Recharge Integration

- Based on the stable interaction-scroll-fixed version.
- `game.js` remains the first script so Start Game is not blocked by payment scripts.
- Payment scripts are preloaded after `game.js` with `defer` and dynamically loaded again when checkout starts.
- Dynamic load order: `crypto-js.min.js` first, then `PayApi-v2.js`.
- Shop flow: choose pack/bundle → Secure Checkout modal → email → Credit Card / Apple Pay / Google Pay.
- Calls `DoRequest(options)` with `orderId`, `amount`, `currency`, `payTypes`, `name`, `email`, `firstName`, `lastName`, `phone`, `successUrl`, and `backUrl`.
- Debug: `window.__GalaxyRunLoaded` confirms game boot; `window.__lastGalaxyPayOptions` stores the last payment request.


## Dynamic-only Payment Scripts

- Removed static Roomilo payment script tags from `index.html` so Start Game cannot be affected by payment CDN loading.
- `game.js` is the only script loaded at page boot.
- Payment scripts are loaded only when checkout is confirmed, in this order:
  1. `crypto-js.min.js`
  2. `PayApi-v2.js`
- Added `window.__GalaxyStartHealth()` for browser console diagnostics.

## Tested build note

This package was tested after the payment scripts were moved to dynamic loading only. The page keeps only `game.js` in `index.html` at startup, so payment scripts do not block Start Game.

Verified flows:
- Start Game opens the Game Screen.
- Mobile touchend + click Start path enters the Game Screen.
- Restart path stays in the Game Screen.
- Registered user can enter Mode Select and start Arena.
- Shop coin recharge opens Secure Checkout.
- Credit Card checkout builds the expected `DoRequest(options)` payload with `payTypes: 8004` and amount `0.99` for Starter Pack.


## Payment Popup Gesture Fix

- Payment scripts are preloaded in the background after game boot, on Shop open, and when the checkout modal opens.
- The payment button no longer waits for script loading and then calls `DoRequest`; if scripts are not ready, it asks the player to tap again after the component is ready. This avoids browser popup blocking caused by lost user gesture.
- `DoRequest(options)` is called synchronously when the payment API is ready.
- Real `DoRequest` errors are shown in the checkout modal and stored at `window.__lastGalaxyPayError`.
- `window.__GalaxyPaymentHealth()` returns payment loading status, last options, and last error for debugging.
- Order IDs are shorter and alphanumeric-only, for example `AMIK3Z9AB12CD`.


## Critical Start and Restart Stability Fix

- Start / Restart / Mode Start now use deterministic launch paths and no longer get silently blocked by stale launch locks.
- Removed the risky `canLaunchNow()` gate from Restart.
- Added strict touchend → click de-duplication without blocking legitimate quick restarts.
- Start and Restart now clear Game Over, Pause, Continue, Checkout, and onboarding overlays before launching.
- Home buttons now fully clear transient game state before returning to Start Screen.
- `window.__GalaxyStartHealth()` now shows active screen, run state, overlay state, runId, and launch lock status for debugging.


## First Start Runtime Watchdog Fix

- Fixed the first-run freeze where the game could enter Game Screen but the road/score did not advance.
- Added a guarded game loop so a one-frame runtime error cannot permanently kill `requestAnimationFrame`.
- Start and Restart now explicitly ensure the game loop is running.
- Added a first-start watchdog that nudges the first run if score/distance do not advance shortly after launch.
- First run now seeds a safe opening coin line and distant obstacle so the screen immediately feels alive.
- Runtime dt is clamped and repaired if the first frame receives a zero/invalid timestamp.
- `window.__GalaxyStartHealth()` now reports loop status, score, distance, speed, loop errors, obstacle count, and coin count.


## Payment Alert Flow Polish

- After `DoRequest(options)` is called successfully, the game no longer shows any failure alert.
- If `DoRequest` throws a synchronous SDK error, the game no longer interrupts the player with `window.alert`.
- Payment errors are shown inline in the checkout modal and stored in `window.__lastGalaxyPayError`.
- The last payment call state is stored in `window.__lastGalaxyPayStatus`.
- This prevents a confusing case where the payment page opens but the game still shows a browser failure prompt.


## Item Use Reliability Fix

- Fixed in-game item reliability by stopping the item dock from rebuilding DOM every animation frame.
- Item dock now re-renders only when item stock, active timer, cooldown timer, run state, or revive state changes.
- Added direct `touchend` handling for item buttons on mobile, with touch/click de-duplication.
- Speed Boost button now supports free Sprint when no Speed Boost stock is available.
- Item failure feedback is now explicit: no stock, cooling down, already active, revive already set, or not in run.
- Using items now immediately refreshes HUD and item dock state.
- Bomb now clears visible obstacles and grants a brief safety window.


Item hotkeys:
- 1 = Shield
- 2 = Magnet
- 3 = Double Coins
- 4 = Bomb
- 5 = Speed Boost / free Sprint
- 6 = Revive
- Space = Speed Boost / free Sprint
- Debug: `window.__GalaxyItemHealth()` shows item stock, active timers, cooldowns, and dock state.


## Mobile Visibility and Drag Control Fix

- Moved the starting ship position upward on mobile so it is not hidden by the item dock, boost button, or onboarding prompt.
- Reworked mobile touch control from absolute tap-chase to relative drag.
- Ship now follows the finger movement with a small visibility offset, so the finger does not cover the ship.
- Mobile vertical movement is lighter and clamped to a safer visible area.
- Mobile onboarding prompt is shorter, placed at the top, and no longer blocks the ship.
- Debug: `window.__GalaxyMobileControlHealth()` shows player position, target, mobile bounds, and touch state.


## Spaceship Audio Upgrade

- Replaced car-like sound direction with spaceship audio:
  - Low-frequency plasma engine hum while flying.
  - Boost adds a short thruster whoosh and raises engine intensity.
  - Coin pickup uses bright sci-fi energy chimes.
  - Item activation uses an electronic power-up sweep.
  - Collision uses shield/hull impact instead of a car crash style hit.
  - Game over uses a ship power-down sound.
- Background music is now a soft space drone/pad instead of a simple engine-like loop.
- Audio is still generated with Web Audio API, no external audio files required.
- Debug: `window.__GalaxyAudioHealth()` shows audio/music/engine status.


## Mobile Payment Jump Fix

- Payment buttons now support direct `touchend` handling on mobile, not only `click`.
- Touch/click de-duplication prevents duplicate payment calls.
- Payment scripts start warming on first touch/pointer gesture, plus Shop and Checkout open.
- Checkout payment buttons are disabled until `DoRequest` is ready, so the first tap does not fail silently.
- `DoRequest(options)` is called directly inside the touch/click handler to preserve the mobile browser navigation gesture.
- If the payment SDK returns a URL-like result, the game follows it with `window.location.href`.
- Debug: `window.__GalaxyPaymentHealth()` now includes last SDK return and mobile payment touch state.


## Audio Separation and Payment Speed Refinement

Audio:
- Background Music and Flight Sound are now separate settings.
- New Settings option: Flight Sound.
- Flight engine is off by default and much quieter when enabled.
- Background music no longer starts or controls the engine hum.
- Boost still has a short thruster accent, while normal flight stays soft.

Payment:
- Added preload hints for PayApi and crypto-js to improve PC payment jump speed without blocking game start.
- Mobile payment now opens a lightweight secure-payment bridge window directly inside the touch gesture.
- If the payment SDK returns a URL or a Promise resolving to a URL, the bridge window is redirected there.
- The regular `DoRequest(options)` call is still preserved.


## Full regression check after audio/payment refinement

- Re-ran Start / Restart / mobile control / payment / item / audio / login-shop regression checks.
- Fixed one item-touch edge case found during testing: a touch event on one item could temporarily suppress a quick click on another item because the de-duplication state was global instead of item-specific.
- Item touch de-duplication is now keyed by item type, so fast sequential item use is more reliable.
