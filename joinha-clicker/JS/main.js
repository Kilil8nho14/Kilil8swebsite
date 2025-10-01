// main_refactored_full.js
// Versão refatorada que mantém todas as mecânicas do arquivo original,
// mas com menos repetição e organização melhor.
// Error catcher
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Error Detected!");
    console.error("Message:", message);
    console.error("File:", source);
    console.error("Line:", lineno);
    console.error("Collum:", colno);
    if (error && error.stack) console.error("Stack trace:", error.stack);
};

//////////////////////
// ===== GameData ===
//////////////////////
window.GameData = {
    joinhas: new Decimal(0),
    golden_joinhas: new Decimal(0),
    boostpergoldenjoinha: new Decimal(0.01),
    magnets: new Decimal(0),
    magnetschance: new Decimal(0.005),
    click_power: new Decimal(1),
    upgrade_1_cost: new Decimal(10),
    joinhas_per_second: new Decimal(0),
    upgrade_2_cost: new Decimal(25),
    upgrade_3_cost: new Decimal(10),
    upgrade_4_cap: 0,
    upgrade_4_power: new Decimal(1),
    upgrade_5_cost: new Decimal(1000),
    upgrade_5_power: new Decimal(0),
    upgrade_5_limit: new Decimal(0),
    golden_joinha_earn: new Decimal(0),
    golden_joinha_price: new Decimal(1000),
    golden_upgrade_1_cost: new Decimal(100),
    golden_upgrade_1_power: new Decimal(1),
    golden_upgrade_2_cost: new Decimal(100),
    golden_upgrade_2_power: new Decimal(1),
    golden_upgrade_3_cost: new Decimal(1000000),
    golden_upgrade_3_power: new Decimal(0),
    great_reset_cost: new Decimal(100000),
    great_reset_power: new Decimal(1),
    magnet_upgrade_1_cost: new Decimal(10),
    magnet_upgrade_1_power: new Decimal(1),
    magnet_upgrade_2_cost: new Decimal(15),
    magnet_upgrade_2_power: new Decimal(1),
    magnet_upgrade_3_cost: new Decimal(25),
    magnet_upgrade_3_limit: new Decimal(0),
    magnet_upgrade_4_cost: new Decimal(10),
    magnet_upgrade_4_power: new Decimal(1),
    magnet_upgrade_5_cost: new Decimal(15),
    magnet_upgrade_5_power: new Decimal(1),
    earth_upgrade_cost: new Decimal(1000),
    ironbars: new Decimal(0),
    ironbardelay: new Decimal(60000),
    ironbarlist: [],
    ironbarupgrade1cost: new Decimal(10),
    ironbarupgrade1power: new Decimal(1),
    ironbarupgrade2cost: new Decimal(15),
    ironbarupgrade2power: new Decimal(1),
    ironbarupgrade3cost: new Decimal(10),
    ironbarupgrade3power: new Decimal(1),
    ironbarupgrade4cost: new Decimal(5),
    bricks: new Decimal(0),
    bricks_per_second: new Decimal(1),
    bricks_per_second_timer: new Decimal(60000),
    brick_upgrade_1_cost: new Decimal(100),
    brick_upgrade_1_power: new Decimal(1),
    brick_upgrade_2_cost: new Decimal(200),
    brick_upgrade_2_power: new Decimal(1),
    brick_upgrade_3_cost: new Decimal(400),
    brick_upgrade_3_power: new Decimal(1),
    brick_upgrade_4_cost: new Decimal(1000),
    brick_upgrade_4_power: new Decimal(1),
    brick_upgrade_5_cost: new Decimal(2000),
    space_unlocked: false,
    music_on: false
};

//////////////////////
// ===== Helpers =====
//////////////////////
const $ = id => document.getElementById(id);
const toggleMenu = (menu, show) => { if (!menu) return; menu.style.display = show ? "block" : "none"; };

function shortDecimal(num) {
  num = new Decimal(num);
  if (num.lt(1000)) return num.toFixed(2);
  const exponent = num.log10().floor();
  const mantissa = num.div(Decimal.pow(10, exponent));
  return mantissa.toFixed(2) + "e" + exponent.toString();
}

let ironBarInterval = null;
function setIronBarSpawner() {
    if (ironBarInterval) {
      clearInterval(ironBarInterval);
  }
  ironBarInterval = setInterval(spawnIronBar, Number(GameData.ironbardelay));
}
let brickdoubletimer = null;
function setBrickDoubleTimer() {
    if (brickdoubletimer) {
	clearInterval(brickdoubletimer);
    }
    brickdoubletimer = setInterval(doubleBrickProduction, Number(GameData.bricks_per_second_timer));
}


function showConfirm(message, callback) {
  const popup = document.createElement("div");
  popup.style = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.5); display:flex;
    justify-content:center; align-items:center; z-index:9999;
  `;
  const box = document.createElement("div");
  box.style = "background:#fff; padding:20px; border-radius:10px; text-align:center;";
  box.innerHTML = `<p>${message}</p>`;
  const okBtn = document.createElement("button");
  okBtn.textContent = "OK";
  okBtn.onclick = () => { document.body.removeChild(popup); callback(true); };
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => { document.body.removeChild(popup); callback(false); };
  box.appendChild(okBtn);
  box.appendChild(cancelBtn);
  popup.appendChild(box);
  document.body.appendChild(popup);
}

//////////////////////
// ===== Click ======
//////////////////////
function joinhaclick() {
  GameData.joinhas = GameData.joinhas.plus(GameData.click_power);
  const MC = new Decimal(Math.random());
  if (MC.lte(GameData.magnetschance.plus(GameData.upgrade_5_power))) {
    // Mantive a lógica original (pode parecer que reseta, mas era assim no JS original)
    GameData.magnets = (GameData.magnets
	  .plus(GameData.golden_upgrade_3_power.plus(1)))
	  .times(GameData.ironbarupgrade2power)
      .times(GameData.brick_upgrade_2_power);
  }
  update_golden_joinha_earn();
  update_screen();
}

//////////////////////////////
// ===== Generic purchases ==
//////////////////////////////
function purchase(resourceKey, costKey, effectFn) {
  if (GameData[resourceKey].gte(GameData[costKey])) {
    GameData[resourceKey] = GameData[resourceKey].minus(GameData[costKey]);
    effectFn && effectFn();
    update_golden_joinha_earn();
    update_screen();
  }
}

///////////////////////////////
// ===== Passive Golden Joinhas ==
///////////////////////////////
function passiveGoldenJoinhas() {
	GameData.golden_joinhas = GameData.golden_joinhas.plus((GameData.magnet_upgrade_5_power.minus(1)));
    GameData.magnets = GameData.magnets.plus(GameData.brick_upgrade_4_power.minus(1));
}

//////////////////////////////
// ===== Update golden earn ==
//////////////////////////////
function update_golden_joinha_earn() {
  const joinhas = new Decimal(GameData.joinhas);
  const price = new Decimal(GameData.golden_joinha_price);
  const r = new Decimal(1.006);

  if (joinhas.lt(price)) {
    GameData.golden_joinha_earn = new Decimal(0);
    return;
  }

  const arg = joinhas.div(price).times(r.minus(1)).plus(1);
  // n = floor( ln(arg) / ln(r) )
  const n = Decimal.floor(Decimal.ln(arg).div(Decimal.ln(r)));

  const earn = n
    .times(GameData.golden_upgrade_1_power || new Decimal(1))
    .times(GameData.great_reset_power || new Decimal(1))
    .times(GameData.magnet_upgrade_2_power || new Decimal(1));

  GameData.golden_joinha_earn = earn;
}

//////////////////////
// ===== UI labels ==
//////////////////////
const labelFns = {
  JoinhaLabel: () => "Joinhas: " + shortDecimal(GameData.joinhas),

  Upgrade_1_Label: () => "Clicks give +1 Joinhas (Cost: " + shortDecimal(GameData.upgrade_1_cost) + " Joinhas)",

  Upgrade_2_Label: () => "+1 Joinhas per second (Cost: " + shortDecimal(GameData.upgrade_2_cost) + " Joinhas)",

  joinhas_per_second_label: () => "Joinhas per second: " + shortDecimal(GameData.joinhas_per_second),

  Upgrade_3_Label: () => "Upgrades 1 and 2 at 1/4 of their prices (Cost: " + shortDecimal(GameData.upgrade_3_cost) + " Joinhas)",

  Upgrade_4_Label: () => GameData.upgrade_4_cap == 0 ? "Clicks are 25x more powerful (Cost: 1.04e7)" : "Clicks are 25x more powerful (Cost: Completed)",

  Upgrade_5_Label: () => {
    if (GameData.upgrade_5_limit.lt(20))
      return "+0.1% Chance of a Magnet per click\n(Cost: " + shortDecimal(GameData.upgrade_5_cost) + " Joinhas) (" + GameData.upgrade_5_limit + " / 20)";
    return "+0.1% Chance of a Magnet per click\n(Cost: Completed) (" + GameData.upgrade_5_limit + " / 20)";
  },

  GoldenJoinhaLabel: () => "Golden Joinhas: " + shortDecimal(GameData.golden_joinhas) + "\nBoost per Golden Joinha: " + shortDecimal(GameData.boostpergoldenjoinha.times(100)) + "%",

  GoldenUpgrade1Label: () => "x2 Golden Joinhas\n(Cost: " + shortDecimal(GameData.golden_upgrade_1_cost) + " Golden Joinhas)",

  GoldenUpgrade2Label: () => "x2 Joinhas\n(Cost: " + shortDecimal(GameData.golden_upgrade_2_cost) + " Golden Joinhas)",

  GreatResetLabel: () => GameData.great_reset_cost.lt(1e35) ? "Resets everything but Golden Joinhas are 15x\neasier (Cost: " + shortDecimal(GameData.great_reset_cost) + " Golden Joinhas)" : "Resets everything but Golden Joinhas are 15x\neasier (Cost: Complete)",

  GoldenUpgrade3Label: () => "Get +1 Magnet per Magnet\n(Cost: " + shortDecimal(GameData.golden_upgrade_3_cost) + " Golden Joinhas)",

  UnlockSpaceLabel: () => GameData.space_unlocked === false ? "Unlocks Space\n(Cost: 1e35)" : "Unlocks Space\n(Cost: Unlocked)",

  MagnetsLabel: () => "Magnets: " + shortDecimal(GameData.magnets),

  MagnetUpgrade1Label: () => "Get 1.5x more Joinhas\n(Cost: "  + shortDecimal(GameData.magnet_upgrade_1_cost) + " Magnets)",

  MagnetUpgrade2Label: () => "Get 1.5x more Golden Joinhas\n(Cost: " + shortDecimal(GameData.magnet_upgrade_2_cost) + " Magnets)",

  MagnetUpgrade3Label: () => GameData.magnet_upgrade_3_limit.lt(4) ? "Get Magnets 2x easier\n(Cost: " + shortDecimal(GameData.magnet_upgrade_3_cost) + " Magnets)\n(" + GameData.magnet_upgrade_3_limit + " / 4)" : "Get Magnets 2x easier\n(Cost: Completed)\n(" + GameData.magnet_upgrade_3_limit + " / 4)",

  MagnetUpgrade4Label: () => "Get more Joinhas per second\n(Cost: " + shortDecimal(GameData.magnet_upgrade_4_cost) + " Magnets)",

  MagnetUpgrade5Label: () => "Earn passive Golden Joinhas:\n+" + shortDecimal(GameData.magnet_upgrade_5_power.minus(1)) + " → +" + shortDecimal((GameData.magnet_upgrade_5_power.times(1.5)).minus(1)) + "\n(Cost: " + shortDecimal(GameData.magnet_upgrade_5_cost) + " Magnets)",

  EarthLabel: () => "Get more boost per Golden Joinhas:\n" + shortDecimal(GameData.boostpergoldenjoinha.times(100)) + "% → " + shortDecimal((GameData.boostpergoldenjoinha.plus(0.01)).times(100)) + "%\n(Cost: " + shortDecimal(GameData.earth_upgrade_cost) + " Magnets)",

  IronBarLabel: () => "Iron Bars: " + shortDecimal(GameData.ironbars),

  IronBarTimeLabel: () => "An Iron Bar spawns every: " + shortDecimal(GameData.ironbardelay.div(1000)) + " Seconds",

  IronBarUpgrade1Label: () => "Get more Joinhas:\n" + shortDecimal(GameData.ironbarupgrade1power) + "x → " + shortDecimal(GameData.ironbarupgrade1power.times(new Decimal(1.15))) + "x\n(Cost: " + shortDecimal(GameData.ironbarupgrade1cost) + " Iron Bars)",

  IronBarUpgrade2Label: () => "Get more Magnets:\n" + shortDecimal(GameData.ironbarupgrade2power) + "x → " + shortDecimal(GameData.ironbarupgrade2power.times(new Decimal(1.15))) + "x\n(Cost: " + shortDecimal(GameData.ironbarupgrade2cost) + " Iron Bars)",

  IronBarUpgrade3Label: () => "Get more Iron Bars:\n+" + shortDecimal(GameData.ironbarupgrade3power) + " → +" + shortDecimal(GameData.ironbarupgrade3power.plus(new Decimal(1))) + "\n(Cost: " + shortDecimal(GameData.ironbarupgrade3cost) + " Iron Bars)",

    IronBarUpgrade4Label: () => "Iron Bars spawn more often:\n" + shortDecimal(GameData.ironbardelay.div(1000)) + "s → " + shortDecimal((GameData.ironbardelay.div(1000)).minus(1)) + "\n(Cost: " + shortDecimal(GameData.ironbarupgrade4cost) + " Iron Bars)",

    BrickLabel: () => "Bricks: " + shortDecimal(GameData.bricks),

    BricksPerSecondLabel: () => "Bricks Per Second: " + shortDecimal(GameData.bricks_per_second) + "/s | x2 → " + shortDecimal(GameData.bricks_per_second.times(2)) + "/s",

    BrickUpgrade1Label: () => "Get More Joinhas:\n" + shortDecimal(GameData.brick_upgrade_1_power.minus(1)) + "x → " + shortDecimal(GameData.brick_upgrade_1_power.times(1.05)) + "x\n(Cost: " + shortDecimal(GameData.brick_upgrade_1_cost) + " Bricks)",

    BrickUpgrade2Label: () => "Get More Magnets:\n" + shortDecimal(GameData.brick_upgrade_2_power) + "x → " + shortDecimal(GameData.brick_upgrade_2_power.times(1.05)) + "x\n(Cost: " + shortDecimal(GameData.brick_upgrade_2_cost) + " Bricks)",

    BrickUpgrade3Label: () => "Get More Bricks:\n" + shortDecimal(GameData.brick_upgrade_3_power) + "x → " + shortDecimal(GameData.brick_upgrade_3_power.times(4).minus(1)) + "x\n(Cost: " + shortDecimal(GameData.brick_upgrade_3_cost) + " Bricks)",

    BrickUpgrade4Label: () => "Get Magnets per second:\n" + shortDecimal(GameData.brick_upgrade_4_power.minus(1)) + "/s → " + shortDecimal(GameData.brick_upgrade_4_power.times(1.5).minus(1)) + "/s\n(Cost: " + shortDecimal(GameData.brick_upgrade_4_cost) + " Bricks)",

    BrickUpgrade5Label: () => "Bricks Double more often:\n" + shortDecimal(GameData.bricks_per_second_timer.div(1000)) + "s → " + shortDecimal((GameData.bricks_per_second_timer.minus(250)).div(1000)) + "s\n(Cost: " + shortDecimal(GameData.brick_upgrade_5_cost) + " Bricks)",

  MusicLabel: () => GameData.music_on ? "🎵 Music ON" : "🎵 Music OFF"
};

function update_screen() {
  for (const id in labelFns) {
    const el = $(id);
    if (!el) continue;
    el.innerText = labelFns[id]();
  }
    GameData.bricks = GameData.bricks.plus(GameData.bricks_per_second);
  // increment joinhas passively
  GameData.joinhas = GameData.joinhas.plus(GameData.joinhas_per_second);
  // Show/hide space button if necessary
  const spaceBtn = $("SpaceButton");
  if (spaceBtn) spaceBtn.style.display = GameData.space_unlocked ? "block" : "none";
}

/////////////////////////
// ===== Save / Load ===
/////////////////////////
function save_game() {
  localStorage.setItem("game_save", JSON.stringify(GameData, (_, v) => (v instanceof Decimal ? v.toString() : v)));
}

function load_game() {
  const data = localStorage.getItem("game_save");
  if (!data) { update_screen(); return; }
  try {
    const saved = JSON.parse(data);
    for (const key in GameData) {
      if (saved[key] !== undefined) {
        if (key === "upgrade_4_cap") {
          GameData[key] = Number(saved[key]);
        } else if (key === "music_on" || key === "space_unlocked") {
          GameData[key] = !!saved[key];
        } else if (key === "ironbarlist") {
          GameData[key] = [];
        } else {
          // Try to convert to Decimal safely
          GameData[key] = new Decimal(saved[key]);
        }
      }
    }
    update_golden_joinha_earn();
  } catch (e) {
    console.error("Failed to load save:", e);
  }
  update_screen();
}

//////////////////////
// ===== Timers =====
//////////////////////
function onesecondtimer() {
    setInterval(save_game, 5000);
    setInterval(update_screen, 1000);
    setInterval(passiveGoldenJoinhas, 1000);
    setInterval(update_golden_joinha_earn, 1000);
}

//////////////////////
// ===== Music ======
//////////////////////
const bgm = new Audio('assets/Voltaic.mp3');
bgm.loop = true;
bgm.volume = 1;

//////////////////////
// ===== Iron bars ==
//////////////////////
function spawnIronBar() {
  const bar = document.createElement("img");
  bar.src = "assets/ironbar.png";
  bar.classList.add("iron-bar");
  const screenWidth = window.innerWidth;
  const randomX = Math.floor(Math.random() * Math.max(1, screenWidth - 40));
  bar.style.left = randomX + "px";
  bar.style.bottom = "-60px";

  bar.addEventListener("click", () => {
    if (bar.parentNode) bar.remove();
    GameData.ironbars = GameData.ironbars.plus(GameData.ironbarupgrade3power).plus(1);
    update_screen();
  });

  document.body.appendChild(bar);
  GameData.ironbarlist.push(bar);

  let pos = -60;
  const screenHeight = window.innerHeight;

  function animate() {
    pos += 2;
    bar.style.bottom = pos + "px";
    if (pos < screenHeight + 100) {
      requestAnimationFrame(animate);
    } else {

    }
  }
  animate();
}

function doubleBrickProduction() {
    GameData.bricks_per_second = GameData.bricks_per_second.times(2);
}
//////////////////////////////
// ===== DOM bindings =======
//////////////////////////////
const DOM = {
    // Menus & Buttons
    upgradesMenuButton: $("UpgradesMenuButton"),
    upgradesMenu: $("UpgradesMenu"),
    upgradesMenuCloseButton: $("CloseUpgradesButton"),
    spacebutton: $("SpaceButton"),
    spacemenu: $("SpaceMenu"),
    earthbutton: $("EarthButton"),
    ironbarmenubutton: $("IronBarMenuButton"),
    ironbarmenu: $("IronBarMenu"),
    ironbarupgrade1button: $("IronBarUpgrade1Button"),
    ironbarupgrade2button: $("IronBarUpgrade2Button"),
    ironbarupgrade3button: $("IronBarUpgrade3Button"),
    ironbarupgrade4button: $("IronBarUpgrade4Button"),
    closeironbarmenu: $("CloseIronBarMenu"),
    brickmenubutton: $("BrickMenuButton"),
    brickmenu: $("BrickMenu"),
    brickupgrade1button: $("BrickUpgrade1Button"),
    brickupgrade2button: $("BrickUpgrade2Button"),
    brickupgrade3button: $("BrickUpgrade3Button"),
    brickupgrade4button: $("BrickUpgrade4Button"),
    brickupgrade5button: $("BrickUpgrade5Button"),
    closebrickmenu: $("CloseBrickMenu"),
    spacebackbutton: $("SpaceBackButton"),
    maxupgradesbutton: $("MaxButtonUpgrades"),
    upgrade_1_button: $("Upgrade_1_Button"),
    upgrade_2_button: $("Upgrade_2_Button"),
    upgrade_3_button: $("Upgrade_3_Button"),
    upgrade_4_button: $("Upgrade_4_Button"),
    upgrade_5_button: $("Upgrade_5_Button"),
    prestigemenubutton: $("PrestigeMenuButton"),
    prestigemenu: $("PrestigeMenu"),
    closeprestigemenubutton: $("ClosePrestigeMenu"),
    prestigebutton: $("PrestigeButton"),
    goldenupgrade1button: $("GoldenUpgrade1Button"),
    goldenupgrade2button: $("GoldenUpgrade2Button"),
    nextpageprestigemenu1: $("NextPagePrestigeMenu1"),
    nextpageprestige1button: $("NextPagePrestige1Button"),
    goldenupgrade3button: $("GoldenUpgrade3Button"),
    unlockspacebutton: $("UnlockSpaceButton"),
    prestigepreviouspage1button: $("PrestigePreviousPage1Button"),
    settingsmenubutton: $("SettingsMenuButton"),
    settingsmenu: $("SettingsMenu"),
    closesettingsmenubutton: $("CloseSettingsMenu"),
    hardresetbutton: $("HardResetButton"),
    greatresetbutton: $("GreatResetButton"),
    musicToggle: $("musicToggle"),
    magnetsupgradesmenu: $("MagnetsUpgradesMenu"),
    magnetsupgradesbutton: $("MagnetsUpgradesButton"),
    closemagnetsmenu: $("CloseMagnetsMenu"),
    magnetupgrade1button: $("MagnetUpgrade1Button"),
    magnetupgrade2button: $("MagnetUpgrade2Button"),
    magnetupgrade3button: $("MagnetUpgrade3Button"),
    magnetupgrade4button: $("MagnetUpgrade4Button"),
    magnetupgrade5button: $("MagnetUpgrade5Button"),
    JoinhaButton: $("JoinhaButton")
};

//////////////////////////////
// ===== Event listeners ====
//////////////////////////////

// Botão único Max para Upgrades 1–5
if (DOM.maxupgradesbutton) {
  DOM.maxupgradesbutton.addEventListener("click", () => {
    // Upgrade 1
    while (GameData.joinhas.gte(GameData.upgrade_1_cost)) {
      GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_1_cost);
      GameData.click_power = GameData.click_power.plus(
        (new Decimal(1))
          .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
          .times(GameData.golden_upgrade_2_power)
          .times(GameData.upgrade_4_power)
          .times(GameData.magnet_upgrade_1_power)
          .times(GameData.ironbarupgrade1power)
          .times(GameData.brick_upgrade_1_power)
      );
      GameData.upgrade_1_cost = GameData.upgrade_1_cost.times(1.6);
    }

    // Upgrade 2
    while (GameData.joinhas.gte(GameData.upgrade_2_cost)) {
      GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_2_cost);
      GameData.joinhas_per_second = GameData.joinhas_per_second.plus(
        (new Decimal(1))
          .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
          .times(GameData.golden_upgrade_2_power)
          .times(GameData.magnet_upgrade_1_power)
          .times(GameData.magnet_upgrade_4_power)
          .times(GameData.ironbarupgrade1power)
          .times(GameData.brick_upgrade_1_power)
      );
      GameData.upgrade_2_cost = GameData.upgrade_2_cost.times(1.5);
    }

    // Upgrade 3 (ilimitado)
    while (GameData.joinhas.gte(GameData.upgrade_3_cost)) {
      GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_3_cost);
      GameData.upgrade_1_cost = GameData.upgrade_1_cost.div(4);
      GameData.upgrade_2_cost = GameData.upgrade_2_cost.div(4);
      GameData.upgrade_3_cost = GameData.upgrade_3_cost.times(25);
    }

    // Upgrade 4 (só 1 vez, preço fixo)
    if (GameData.joinhas.gte(new Decimal(10480000)) && GameData.upgrade_4_cap === 0) {
      GameData.joinhas = GameData.joinhas.minus(new Decimal(10480000));
      GameData.upgrade_4_cap = 1;
      GameData.upgrade_4_power = GameData.upgrade_4_power.times(25);
      GameData.click_power = GameData.click_power.times(GameData.upgrade_4_power)
      .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
              .times(GameData.golden_upgrade_2_power)
              .times(GameData.magnet_upgrade_1_power)
              .times(GameData.ironbarupgrade1power)
	      .times(GameData.brick_upgrade_1_power);
    }

    // Upgrade 5 (até limite 20)
    while (GameData.joinhas.gte(GameData.upgrade_5_cost) && GameData.upgrade_5_limit.lt(20)) {
      GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_5_cost);
      GameData.upgrade_5_power = GameData.upgrade_5_power.plus(0.001);
      GameData.upgrade_5_limit = GameData.upgrade_5_limit.plus(1);
      GameData.upgrade_5_cost = GameData.upgrade_5_cost.times(10);
    }

    update_golden_joinha_earn();
    update_screen();
  });
}

// Menus
if (DOM.upgradesMenuButton && DOM.upgradesMenuCloseButton) {
  DOM.upgradesMenuButton.addEventListener('click', () => toggleMenu(DOM.upgradesMenu, true));
  DOM.upgradesMenuCloseButton.addEventListener('click', () => toggleMenu(DOM.upgradesMenu, false));
}

// Space menu
if (DOM.spacebutton && DOM.spacemenu) {
  DOM.spacebutton.addEventListener('click', () => toggleMenu(DOM.spacemenu, true));
  if (DOM.spacebackbutton) DOM.spacebackbutton.addEventListener('click', () => toggleMenu(DOM.spacemenu, false));
}

// Settings
if (DOM.settingsmenubutton && DOM.closesettingsmenubutton) {
  DOM.settingsmenubutton.addEventListener('click', () => toggleMenu(DOM.settingsmenu, true));
  DOM.closesettingsmenubutton.addEventListener('click', () => toggleMenu(DOM.settingsmenu, false));
}

// Magnets menu
if (DOM.magnetsupgradesbutton && DOM.closemagnetsmenu) {
  DOM.magnetsupgradesbutton.addEventListener('click', () => toggleMenu(DOM.magnetsupgradesmenu, true));
  DOM.closemagnetsmenu.addEventListener('click', () => toggleMenu(DOM.magnetsupgradesmenu, false));
}

// Iron Bar menu
if (DOM.ironbarmenubutton && DOM.closeironbarmenu) {
  DOM.ironbarmenubutton.addEventListener('click', () => toggleMenu(DOM.ironbarmenu, true));
  DOM.closeironbarmenu.addEventListener('click', () => toggleMenu(DOM.ironbarmenu, false));
}

// Brick Menu
if (DOM.brickmenubutton && DOM.closebrickmenu) {
    DOM.brickmenubutton.addEventListener('click', () => toggleMenu(DOM.brickmenu, true));
    DOM.closebrickmenu.addEventListener('click', () => toggleMenu(DOM.brickmenu, false));
}

// Joinha click
if (DOM.JoinhaButton) DOM.JoinhaButton.addEventListener("click", joinhaclick);

// Upgrade 1
if (DOM.upgrade_1_button) {
  DOM.upgrade_1_button.addEventListener("click", () =>
    purchase("joinhas", "upgrade_1_cost", () => {
      GameData.click_power = GameData.click_power.plus(
        (new Decimal(1))
          .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
              .times(GameData.golden_upgrade_2_power)
              .times(GameData.upgrade_4_power)
              .times(GameData.magnet_upgrade_1_power)
              .times(GameData.ironbarupgrade1power)
	      .times(GameData.brick_upgrade_1_power)
      );
      GameData.upgrade_1_cost = GameData.upgrade_1_cost.times(1.6);
    })
  );
}

// Upgrade 2
if (DOM.upgrade_2_button) {
  DOM.upgrade_2_button.addEventListener("click", () =>
    purchase("joinhas", "upgrade_2_cost", () => {
      GameData.joinhas_per_second = GameData.joinhas_per_second.plus(
        (new Decimal(1))
          .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
              .times(GameData.golden_upgrade_2_power)
              .times(GameData.magnet_upgrade_1_power)
              .times(GameData.magnet_upgrade_4_power)
              .times(GameData.ironbarupgrade1power)
	      .times(GameData.brick_upgrade_1_power)
      );
      GameData.upgrade_2_cost = GameData.upgrade_2_cost.times(1.5);
    })
  );
}

// Upgrade 3
if (DOM.upgrade_3_button) {
  DOM.upgrade_3_button.addEventListener("click", () =>
    purchase("joinhas", "upgrade_3_cost", () => {
      GameData.upgrade_1_cost = GameData.upgrade_1_cost.div(4);
      GameData.upgrade_2_cost = GameData.upgrade_2_cost.div(4);
      GameData.upgrade_3_cost = GameData.upgrade_3_cost.times(25);
    })
  );
}

// Upgrade 4 (one time)
if (DOM.upgrade_4_button) {
  DOM.upgrade_4_button.addEventListener("click", () => {
    if (GameData.joinhas.gte(new Decimal(10480000)) && GameData.upgrade_4_cap === 0) {
      GameData.joinhas = GameData.joinhas.minus(new Decimal(10480000));
      GameData.upgrade_4_cap = 1;
      GameData.upgrade_4_power = GameData.upgrade_4_power.times(25);
      // Apply immediate click_power multiplier
      GameData.click_power = GameData.click_power.times(
        GameData.upgrade_4_power
          .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
              .times(GameData.golden_upgrade_2_power)
              .times(GameData.magnet_upgrade_1_power)
              .times(GameData.ironbarupgrade1power)
	      .times(GameData.brick_upgrade_1_power)
      );
      update_screen();
    }
  });
}

// Upgrade 5 (stackable up to 20)
if (DOM.upgrade_5_button) {
  DOM.upgrade_5_button.addEventListener("click", () =>
    purchase("joinhas", "upgrade_5_cost", () => {
      if (GameData.upgrade_5_limit.lt(20)) {
        GameData.upgrade_5_power = GameData.upgrade_5_power.plus(0.001);
        GameData.upgrade_5_limit = GameData.upgrade_5_limit.plus(1);         GameData.upgrade_5_cost = GameData.upgrade_5_cost.times(10);
      }
    })
  );
}

// Prestige menu toggle
if (DOM.prestigemenubutton) DOM.prestigemenubutton.addEventListener("click", () => toggleMenu(DOM.prestigemenu, true));
if (DOM.closeprestigemenubutton) DOM.closeprestigemenubutton.addEventListener("click", () => toggleMenu(DOM.prestigemenu, false));

// Golden Upgrade 1
if (DOM.goldenupgrade1button) {
  DOM.goldenupgrade1button.addEventListener("click", () =>
    purchase("golden_joinhas", "golden_upgrade_1_cost", () => {
      GameData.golden_upgrade_1_cost = GameData.golden_upgrade_1_cost.times(10);
      GameData.golden_upgrade_1_power = GameData.golden_upgrade_1_power.times(2);
    })
  );
}

// Golden Upgrade 2
if (DOM.goldenupgrade2button) {
  DOM.goldenupgrade2button.addEventListener("click", () =>
    purchase("golden_joinhas", "golden_upgrade_2_cost", () => {
      GameData.golden_upgrade_2_cost = GameData.golden_upgrade_2_cost.times(10);
      GameData.golden_upgrade_2_power = GameData.golden_upgrade_2_power.times(2);
    })
  );
}

// Great Reset
if (DOM.greatresetbutton) {
  DOM.greatresetbutton.addEventListener("click", () => {
    showConfirm(`DO YOU WANT TO GREAT RESET?`, function (result) {
      if (!result) return;
      if (GameData.golden_joinhas.gte(GameData.great_reset_cost) && GameData.great_reset_cost.lt(new Decimal("1e35"))) {
        // Reset many things, keep golden_joinhas? original resets golden_joinhas to 0 for great reset
        GameData.joinhas = new Decimal(0);
        GameData.golden_joinhas = new Decimal(0);
        GameData.click_power = new Decimal(1)
              .times(GameData.magnet_upgrade_1_power)
              .times(GameData.ironbarupgrade1power)
	      .times(GameData.brick_upgrade_1_power)
        GameData.upgrade_1_cost = new Decimal(10);
        GameData.joinhas_per_second = new Decimal(0);
        GameData.upgrade_2_cost = new Decimal(25);
        GameData.upgrade_3_cost = new Decimal(10);
        GameData.upgrade_4_cap = 0;
        GameData.upgrade_4_power = new Decimal(1);
        GameData.upgrade_5_cost = new Decimal(1000);
        GameData.upgrade_5_limit = new Decimal(0);
        GameData.upgrade_5_power = new Decimal(0);
        GameData.golden_joinhas = new Decimal(0);
        GameData.golden_joinha_earn = new Decimal(0);
        GameData.golden_joinha_price = new Decimal(1000);
        GameData.golden_upgrade_1_cost = new Decimal(100);
        GameData.golden_upgrade_1_power = new Decimal(1);
        GameData.golden_upgrade_2_cost = new Decimal(100);
        GameData.golden_upgrade_2_power = new Decimal(1);
        GameData.great_reset_power = GameData.great_reset_power.times(15);
        GameData.great_reset_cost = GameData.great_reset_cost.times(101);
        update_screen();
      }
    });
  });
}

// Next Page Prestige toggle
if (DOM.nextpageprestige1button && DOM.nextpageprestigemenu1) {
  DOM.nextpageprestige1button.addEventListener("click", () => toggleMenu(DOM.nextpageprestigemenu1, true));
  if (DOM.prestigepreviouspage1button) DOM.prestigepreviouspage1button.addEventListener("click", () => toggleMenu(DOM.nextpageprestigemenu1, false));
}

// Golden Upgrade 3
if (DOM.goldenupgrade3button) {
  DOM.goldenupgrade3button.addEventListener("click", () =>
    purchase("golden_joinhas", "golden_upgrade_3_cost", () => {
      GameData.golden_upgrade_3_cost = GameData.golden_upgrade_3_cost.times(10);
      GameData.golden_upgrade_3_power = GameData.golden_upgrade_3_power.plus(1);
    })
  );
}

// Unlock Space
if (DOM.unlockspacebutton) {
  DOM.unlockspacebutton.addEventListener("click", () => {
    if (GameData.golden_joinhas.gte(new Decimal("1e35"))) {
      GameData.golden_joinhas = GameData.golden_joinhas.minus(new Decimal("1e35"));
      GameData.space_unlocked = true;
      // start spawns
      setInterval(() => spawnIronBar(), Number(GameData.ironbardelay));
      update_screen();
    }
  });
}

// Prestige (do reset but give golden)
if (DOM.prestigebutton) {
  DOM.prestigebutton.addEventListener("click", function () {
    showConfirm(`Do you want to prestige? This will give: ${shortDecimal(GameData.golden_joinha_earn)} Golden Joinhas.`, function (result) {
      if (result && GameData.golden_joinha_earn.gte(new Decimal(1))) {
        const n = GameData.golden_joinha_earn;
        GameData.golden_joinhas = GameData.golden_joinhas.plus(n);

        // basic reset
        GameData.joinhas = new Decimal(0);
        GameData.click_power = new Decimal(1)
          .times(GameData.golden_joinhas.times(GameData.boostpergoldenjoinha).plus(1))
              .times(GameData.golden_upgrade_2_power)
              .times(GameData.magnet_upgrade_1_power)
              .times(GameData.ironbarupgrade1power)
	      .times(GameData.brick_upgrade_1_power);
        GameData.joinhas_per_second = new Decimal(0);
        GameData.upgrade_1_cost = new Decimal(10);
        GameData.upgrade_2_cost = new Decimal(25);
        GameData.upgrade_3_cost = new Decimal(10);
        GameData.upgrade_4_cap = 0;
        GameData.upgrade_4_power = new Decimal(1);
        GameData.upgrade_5_cost = new Decimal(1000);
        GameData.upgrade_5_limit = new Decimal(0);
        GameData.upgrade_5_power = new Decimal(0);
        GameData.golden_joinha_earn = new Decimal(0);

        update_screen();
      }
    });
  });
}

// Magnets Upgrades
if (DOM.magnetupgrade1button) {
  DOM.magnetupgrade1button.addEventListener("click", () =>
    purchase("magnets", "magnet_upgrade_1_cost", () => {
      GameData.magnet_upgrade_1_power = GameData.magnet_upgrade_1_power.times(1.5);
      GameData.magnet_upgrade_1_cost = GameData.magnet_upgrade_1_cost.times(1.35);
    })
  );
}
if (DOM.magnetupgrade2button) {
  DOM.magnetupgrade2button.addEventListener("click", () =>
    purchase("magnets", "magnet_upgrade_2_cost", () => {
      GameData.magnet_upgrade_2_power = GameData.magnet_upgrade_2_power.times(1.5);
      GameData.magnet_upgrade_2_cost = GameData.magnet_upgrade_2_cost.times(1.25);
    })
  );
}
if (DOM.magnetupgrade3button) {
  DOM.magnetupgrade3button.addEventListener("click", () =>
    purchase("magnets", "magnet_upgrade_3_cost", () => {
      if (GameData.magnet_upgrade_3_limit.lt(4)) {
        GameData.magnetschance = GameData.magnetschance.times(2);
        GameData.magnet_upgrade_3_cost = GameData.magnet_upgrade_3_cost.times(20);
        GameData.magnet_upgrade_3_limit = GameData.magnet_upgrade_3_limit.plus(1);
      }
    })
  );
}
if (DOM.magnetupgrade4button) {
  DOM.magnetupgrade4button.addEventListener("click", () =>
    purchase("magnets", "magnet_upgrade_4_cost", () => {
      GameData.magnet_upgrade_4_cost = GameData.magnet_upgrade_4_cost.times(1.5);
      GameData.magnet_upgrade_4_power = GameData.magnet_upgrade_4_power.times(2);
      GameData.joinhas_per_second = GameData.joinhas_per_second.times(2);
    })
  );
}
if (DOM.magnetupgrade5button) {
	DOM.magnetupgrade5button.addEventListener("click", () =>
		purchase("magnets", "magnet_upgrade_5_cost", () => {
			GameData.magnet_upgrade_5_cost = GameData.magnet_upgrade_5_cost.times(1.5);
			GameData.magnet_upgrade_5_power = GameData.magnet_upgrade_5_power.times(1.5);
		})
	);
}

// Hard Reset
if (DOM.hardresetbutton) {
  DOM.hardresetbutton.addEventListener("click", () => {
    showConfirm(`DO YOU WANT TO HARD RESET FOREVER?`, function (result) {
      if (result) {
        localStorage.removeItem("game_save");
        location.reload();
      }
    });
  });
}

// Earth upgrade
if (DOM.earthbutton) {
  DOM.earthbutton.addEventListener("click", () =>
    purchase("magnets", "earth_upgrade_cost", () => {
      GameData.boostpergoldenjoinha = GameData.boostpergoldenjoinha.plus(0.01);
      GameData.earth_upgrade_cost = GameData.earth_upgrade_cost.times(2);
    })
  );
}

// Ironbar upgrades
if (DOM.ironbarupgrade1button) {
  DOM.ironbarupgrade1button.addEventListener("click", () =>
    purchase("ironbars", "ironbarupgrade1cost", () => {
      GameData.ironbarupgrade1cost = GameData.ironbarupgrade1cost.times(1.15);
      GameData.ironbarupgrade1power = GameData.ironbarupgrade1power.times(1.05);
      GameData.click_power = GameData.click_power.times(1.05);
    })
  );
}
if (DOM.ironbarupgrade2button) {
  DOM.ironbarupgrade2button.addEventListener("click", () =>
    purchase("ironbars", "ironbarupgrade2cost", () => {
      GameData.ironbarupgrade2cost = GameData.ironbarupgrade2cost.times(1.15);
      GameData.ironbarupgrade2power = GameData.ironbarupgrade2power.times(1.05);
    })
  );
}
if (DOM.ironbarupgrade3button) {
  DOM.ironbarupgrade3button.addEventListener("click", () =>
    purchase("ironbars", "ironbarupgrade3cost", () => {
      GameData.ironbarupgrade3cost = GameData.ironbarupgrade3cost.times(1.5);
      GameData.ironbarupgrade3power = GameData.ironbarupgrade3power.plus(1);
    })
  );
}
if (DOM.ironbarupgrade4button) {
  DOM.ironbarupgrade4button.addEventListener("click", () => {
    if (GameData.ironbardelay.gt(new Decimal(11000))) {
      purchase("ironbars", "ironbarupgrade4cost", () => {
        GameData.ironbarupgrade4cost = GameData.ironbarupgrade4cost.times(2);
        GameData.ironbardelay = GameData.ironbardelay.minus(1000);
        setIronBarSpawner();
      });
    }
  });
}

// Brick Upgrades
if (DOM.brickupgrade1button) {
    DOM.brickupgrade1button.addEventListener("click", () => {
	purchase("bricks", "brick_upgrade_1_cost", () => {
	    GameData.brick_upgrade_1_cost = GameData.brick_upgrade_1_cost.times(3.14);
	    GameData.brick_upgrade_1_power = GameData.brick_upgrade_1_power.times(1.5);
	    GameData.click_power = GameData.click_power.times(1.5);
	});
    });
};
if (DOM.brickupgrade2button) {
    DOM.brickupgrade2button.addEventListener("click", () => {
	purchase("bricks", "brick_upgrade_2_cost", () => {
	    GameData.brick_upgrade_2_cost = GameData.brick_upgrade_2_cost.times(4.14);
	    GameData.brick_upgrade_2_power = GameData.brick_upgrade_2_power.times(1.05);
	});
    });
};
if (DOM.brickupgrade3button) {
    DOM.brickupgrade3button.addEventListener("click", () => {
	purchase("bricks", "brick_upgrade_3_cost", () => {
	    GameData.brick_upgrade_3_cost = GameData.brick_upgrade_3_cost.times(40);
	    GameData.brick_upgrade_3_power = GameData.brick_upgrade_3_power.times(4);
	    GameData.bricks_per_second = GameData.bricks_per_second.times(4);
	});
    });
};
if (DOM.brickupgrade4button) {
    DOM.brickupgrade4button.addEventListener("click", () => {
        purchase("bricks", "brick_upgrade_4_cost", () => {
            GameData.brick_upgrade_4_cost = GameData.brick_upgrade_4_cost.times(3.14);
            GameData.brick_upgrade_4_power = GameData.brick_upgrade_4_power.times(1.5);
        });
    });
};
if (DOM.brickupgrade5button) {
    DOM.brickupgrade5button.addEventListener("click", () => {
        purchase("bricks", "brick_upgrade_5_cost", () => {
            if (GameData.bricks_per_second_timer.gt(5)) {
            GameData.brick_upgrade_5_cost = GameData.brick_upgrade_5_cost.times(25);
            GameData.bricks_per_second_timer = GameData.bricks_per_second_timer.minus(250);
            setBrickDoubleTimer();
            };
        });
    });
};

// Music toggle
if (DOM.musicToggle) {
  DOM.musicToggle.addEventListener("click", function() {
    if (!GameData.music_on) {
      bgm.play().catch(err => console.log(err));
      GameData.music_on = true;
    } else {
      bgm.pause();
      GameData.music_on = false;
    }
    update_screen();
    save_game();
  });
}

/////////////////////////
// ===== onload ========
/////////////////////////
window.onload = function () {
	clearInterval(ironBarInterval)
  // Attach Joinha click if not yet attached (safety)
  if (!DOM.JoinhaButton) {
    const jb = $("JoinhaButton");
    if (jb) jb.addEventListener("click", joinhaclick);
  }

  // initialize label 4 text consistency
  if ($( 'Upgrade_4_Label' )) {
    if (GameData.upgrade_4_cap == 0) $( 'Upgrade_4_Label' ).innerText = "Clicks are 25x more powerful (Cost: 1.04e7)";
    else $( 'Upgrade_4_Label' ).innerText = "Clicks are 25x more powerful (Cost: Completed)";
  }

    load_game();
    onesecondtimer();
    update_screen();
    setBrickDoubleTimer();

  // start ironbar spawns if unlocked
    if (GameData.space_unlocked === true) {
	if (ironBarInterval) {
	    clearInterval(ironBarInterval);
	    setIronBarSpawner();
	}
	setIronBarSpawner();
    }
};
