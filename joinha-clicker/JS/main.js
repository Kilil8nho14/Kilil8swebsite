// Global Dictionary
window.GameData = {
  joinhas: new Decimal(0),
  golden_joinhas: new Decimal(0),
  magnets: new Decimal(0),
  magnetschance: new Decimal(0.005),
  click_power: new Decimal(1),
  upgrade_1_cost: new Decimal(10),
  joinhas_per_second: new Decimal(0),
  upgrade_2_cost: new Decimal(25),
  upgrade_3_cost: new Decimal(10),
  upgrade_4_cap: 0,
  upgrade_4_power: new Decimal(1),
  golden_joinha_earn: new Decimal(0),
  golden_joinha_price: new Decimal(1000),
  golden_upgrade_1_cost: new Decimal(100),
  golden_upgrade_1_power: new Decimal(1),
  golden_upgrade_2_cost: new Decimal(100),
  golden_upgrade_2_power: new Decimal(1),
  great_reset_cost: new Decimal(100000),
  great_reset_power: new Decimal(1),
  magnet_upgrade_1_cost: new Decimal(10),
  magnet_upgrade_1_power: new Decimal(1),
  magnet_upgrade_2_cost: new Decimal(15),
  magnet_upgrade_2_power: new Decimal(1),
  magnet_upgrade_3_cost: new Decimal(25),
  magnet_upgrade_3_limit: new Decimal(0),
  music_on: false // salva se a música está ON ou OFF
};

// ===== Constantes =====
const upgradesMenuButton = document.getElementById('UpgradesMenuButton');
const upgradesMenu = document.getElementById('UpgradesMenu');
const upgradesMenuCloseButton = document.getElementById('CloseUpgradesButton');
const upgrade_1_button = document.getElementById('Upgrade_1_Button');
const upgrade_2_button = document.getElementById('Upgrade_2_Button');
const upgrade_3_button = document.getElementById("Upgrade_3_Button");
const upgrade_4_button = document.getElementById("Upgrade_4_Button");
const prestigemenubutton = document.getElementById("PrestigeMenuButton");
const prestigemenu = document.getElementById("PrestigeMenu");
const closeprestigemenubutton = document.getElementById("ClosePrestigeMenu");
const prestigebutton = document.getElementById("PrestigeButton");
const goldenupgrade1button = document.getElementById("GoldenUpgrade1Button");
const goldenupgrade2button = document.getElementById("GoldenUpgrade2Button");
const settingsmenubutton = document.getElementById("SettingsMenuButton");
const settingsmenu = document.getElementById("SettingsMenu");
const closesettingsmenubutton = document.getElementById("CloseSettingsMenu");
const hardresetbutton = document.getElementById("HardResetButton");
const greatresetbutton = document.getElementById("GreatResetButton");
const musicToggle = document.getElementById("musicToggle");
const magnetsupgradesmenu = document.getElementById("MagnetsUpgradesMenu");
const magnetsupgradesbutton = document.getElementById("MagnetsUpgradesButton");
const closemagnetsmenu = document.getElementById("CloseMagnetsMenu");
const magnetupgrade1button = document.getElementById("MagnetUpgrade1Button");
const magnetupgrade2button = document.getElementById("MagnetUpgrade2Button");
const magnetupgrade3button = document.getElementById("MagnetUpgrade3Button");

// Shorting numbers (científica a partir de 1000)
function shortDecimal(num) {
  if (num.lt(1000)) {
    return num.toFixed(2); // mostra normalmente até 999.99
  } else {
    // converte para notação científica: a.bcde...eX
    const e = num.logarithm ? num.logarithm() : Math.log10(num.toNumber()); // Decimal.js tem log10
    const exponent = Decimal.floor(e);
    const mantissa = num.div(Decimal.pow(10, exponent));
    return mantissa.toFixed(2) + "e" + exponent.toString();
  }
}

// Confirm Popup Function
function showConfirm(message, callback) {
  const popup = document.createElement("div");
  popup.style = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.5); display:flex;
        justify-content:center; align-items:center; z-index:9999;
    `;
  const box = document.createElement("div");
  box.style = `
        background:#fff; padding:20px; border-radius:10px; text-align:center;
    `;
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

// Click Function
function joinhaclick() {
  GameData.joinhas = GameData.joinhas.plus(GameData.click_power);
  MC = new Decimal(Math.random());
  if (MC.lte(GameData.magnetschance)) {
  	GameData.magnets = GameData.magnets.plus(1);
  }
  update_screen();
}

// Opens and closes the upgrades menu
function openupgradesmenu() { upgradesMenu.style.display = 'block'; }
function closeupgradesmenu() { upgradesMenu.style.display = 'none'; }
upgradesMenuCloseButton.addEventListener('click', closeupgradesmenu);
upgradesMenuButton.addEventListener('click', openupgradesmenu);

// ===== Upgrades =====
// Upgrade 1
upgrade_1_button.addEventListener("click", function () {
  if (GameData.joinhas.gte(GameData.upgrade_1_cost)) {
    GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_1_cost);
    GameData.click_power = GameData.click_power.plus(
      new Decimal(1)
        .times(GameData.golden_joinhas.div(100).plus(1))
        .times(GameData.golden_upgrade_2_power)
        .times(GameData.upgrade_4_power)
        .times(GameData.magnet_upgrade_1_power)
    );
    GameData.upgrade_1_cost = GameData.upgrade_1_cost.times(1.6);
    update_screen();
  }
});

// Upgrade 2
upgrade_2_button.addEventListener("click", function () {
  if (GameData.joinhas.gte(GameData.upgrade_2_cost)) {
    GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_2_cost);
    GameData.joinhas_per_second = GameData.joinhas_per_second.plus((
      new Decimal(1)
     .times(GameData.golden_joinhas.div(100)
     .plus(1)).times(GameData.golden_upgrade_2_power))
     .times(GameData.magnet_upgrade_1_power)
    );
    GameData.upgrade_2_cost = GameData.upgrade_2_cost.times(1.5);
    update_screen();
  }
});

// Upgrade 3
upgrade_3_button.addEventListener("click", function () {
  if (GameData.joinhas.gte(GameData.upgrade_3_cost)) {
    GameData.joinhas = GameData.joinhas.minus(GameData.upgrade_3_cost);
    GameData.upgrade_1_cost = GameData.upgrade_1_cost.div(4);
    GameData.upgrade_2_cost = GameData.upgrade_2_cost.div(4);
    GameData.upgrade_3_cost = GameData.upgrade_3_cost.times(25);
    update_screen();
  }
});

// Upgrade 4
upgrade_4_button.addEventListener("click", function () {
  if (GameData.joinhas.gte(10480000) && GameData.upgrade_4_cap === 0) {
    GameData.joinhas = GameData.joinhas.minus(10480000);
    GameData.upgrade_4_cap = 1;
    GameData.upgrade_4_power = GameData.upgrade_4_power.times(25);
    GameData.click_power = GameData.click_power.times((
    GameData.upgrade_4_power
    .times(GameData.golden_joinhas.div(100).plus(1))
    .times(GameData.golden_upgrade_2_power))
    .times(GameData.magnet_upgrade_1_power)
    );
    document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: Completed)";
    update_screen();
  }
});

// Prestige Menu
prestigemenubutton.addEventListener("click", function () {
  prestigemenu.style.display = "block";
});

// Golden Upgrade 1
goldenupgrade1button.addEventListener("click", function () {
  if (GameData.golden_joinhas.gte(GameData.golden_upgrade_1_cost)) {
    GameData.golden_joinhas = GameData.golden_joinhas.minus(GameData.golden_upgrade_1_cost);
    GameData.golden_upgrade_1_cost = GameData.golden_upgrade_1_cost.times(10);
    GameData.golden_upgrade_1_power = GameData.golden_upgrade_1_power.times(2);
    GameData.golden_joinha_earn = new Decimal(2);
    update_screen();
  }
});

// Golden Upgrade 2
goldenupgrade2button.addEventListener("click", function () {
  if (GameData.golden_joinhas.gte(GameData.golden_upgrade_2_cost)) {
    GameData.golden_joinhas = GameData.golden_joinhas.minus(GameData.golden_upgrade_2_cost);
    GameData.golden_upgrade_2_cost = GameData.golden_upgrade_2_cost.times(10);
    GameData.golden_upgrade_2_power = GameData.golden_upgrade_2_power.times(2);
    update_screen();
  }
});

// Great Reset
greatresetbutton.addEventListener("click", function() {
	if (GameData.golden_joinhas.gte(GameData.great_reset_cost)) {
		GameData.joinhas = new Decimal(0);
  	  GameData.golden_joinhas = new Decimal(0);
  	  GameData.click_power = new Decimal(1).times(GameData.magnet_upgrade_1_power);
  	  GameData.upgrade_1_cost = new Decimal(10);
  	  GameData.joinhas_per_second = new Decimal(0);
  	  GameData.upgrade_2_cost = new Decimal(25);
  	  GameData.upgrade_3_cost = new Decimal(10);
  	  GameData.upgrade_4_cap = 0;
  	  GameData.upgrade_4_power = new Decimal(1);
  	  GameData.golden_joinha_earn = new Decimal(0);
  	  GameData.golden_joinha_price = new Decimal(1000);
  	  GameData.golden_upgrade_1_cost = new Decimal(100);
  	  GameData.golden_upgrade_1_power = new Decimal(1);
  	  GameData.golden_upgrade_2_cost = new Decimal(100);
  	  GameData.golden_upgrade_2_power = new Decimal(1);
        GameData.great_reset_power = GameData.great_reset_power.times(15);
        GameData.great_reset_cost = GameData.great_reset_cost.times(22.5);
        update_screen();
    }
});

// Close Prestige Menu
closeprestigemenubutton.addEventListener("click", function () {
  prestigemenu.style.display = "none";
});

// Prestige Button
prestigebutton.addEventListener("click", function () {
  showConfirm(
    `Do you want to prestige? This will give: ${shortDecimal(GameData.golden_joinha_earn)} Golden Joinhas.`,
    function (result) {
      if (result && GameData.golden_joinha_earn.gte(1)) {
        const n = GameData.golden_joinha_earn; // quantos Golden Joinhas ganhos

        // soma Golden Joinhas
        GameData.golden_joinhas = GameData.golden_joinhas.plus(n);

        // reset básico
        GameData.joinhas = new Decimal(0);
        GameData.click_power = new Decimal(1)
          .times(GameData.golden_joinhas.div(100).plus(1))
          .times(GameData.golden_upgrade_2_power)
          .times(GameData.magnet_upgrade_1_power);
        GameData.joinhas_per_second = new Decimal(0);
        GameData.upgrade_1_cost = new Decimal(10);
        GameData.upgrade_2_cost = new Decimal(25);
        GameData.upgrade_3_cost = new Decimal(10);
        GameData.upgrade_4_cap = 0;
        GameData.upgrade_4_power = new Decimal(1);
        GameData.golden_joinha_earn = new Decimal(0);

        update_screen();
      }
    }
  );
});

// Settings Menu
settingsmenubutton.addEventListener("click", function () {
  settingsmenu.style.display = "block";
});
closesettingsmenubutton.addEventListener("click", function () {
  settingsmenu.style.display = "none";
});

// Magnets Upgrades Menu
magnetsupgradesbutton.addEventListener("click", function () {
	magnetsupgradesmenu.style.display = "block";
});
closemagnetsmenu.addEventListener("click", function () {
	magnetsupgradesmenu.style.display = "none";
});
// Magnet Upgrade 1
magnetupgrade1button.addEventListener("click", function () {
	if (GameData.magnets.gte(GameData.magnet_upgrade_1_cost)) {
		GameData.magnets = GameData.magnets.minus(GameData.magnet_upgrade_1_cost);
		GameData.magnet_upgrade_1_power = GameData.magnet_upgrade_1_power.times(1.5);
		GameData.magnet_upgrade_1_cost = GameData.magnet_upgrade_1_cost.times(1.35);
		update_screen();
	}
});
// Magnet Upgrade 2
magnetupgrade2button.addEventListener("click", function () {
	if (GameData.magnets.gte(GameData.magnet_upgrade_2_cost)) {
		GameData.magnets = GameData.magnets.minus(GameData.magnet_upgrade_2_cost);
		GameData.magnet_upgrade_2_power = GameData.magnet_upgrade_2_power.times(1.5);
		GameData.magnet_upgrade_2_cost = GameData.magnet_upgrade_2_cost.times(1.25);
		update_screen();
	}
});
// Magnet Upgrade 3
magnetupgrade3button.addEventListener("click", function () {
	if (GameData.magnets.gte(GameData.magnet_upgrade_3_cost) && GameData.magnet_upgrade_3_limit.lt(4)) {
		GameData.magnets = GameData.magnets.minus(GameData.magnet_upgrade_3_cost);
		GameData.magnetschance = GameData.magnetschance.times(2);
		GameData.magnet_upgrade_3_cost = GameData.magnet_upgrade_3_cost.times(20);
		GameData.magnet_upgrade_3_limit = GameData.magnet_upgrade_3_limit.plus(1);
		update_screen();
	}
});

// Hard Reset
hardresetbutton.addEventListener("click", function () {
  showConfirm(`DO YOU WANT TO HARD RESET FOREVER?`, function (result) {
    if (result) {
      localStorage.removeItem("game_save");
      location.reload();
    }
  });
});

// Atualiza Golden Joinhas Earn
function update_golden_joinha_earn() {
  const joinhas = new Decimal(GameData.joinhas);
  const price = new Decimal(GameData.golden_joinha_price);
  const r = new Decimal(1.006);

  if (joinhas.lt(price)) {
    GameData.golden_joinha_earn = new Decimal(0);
    return;
  }

  const arg = joinhas.div(price).times(r.minus(1)).plus(1);

  const n = Decimal.floor(Decimal.ln(arg).div(Decimal.ln(r)));

  const earn = n
    .times(GameData.golden_upgrade_1_power || new Decimal(1))
    .times(GameData.great_reset_power || new Decimal(1))
    .times(GameData.magnet_upgrade_2_power || new Decimal(1));

  GameData.golden_joinha_earn = earn;
}

// Update Screen
function update_screen() {
  document.getElementById("JoinhaLabel").innerText = "Joinhas: " + shortDecimal(GameData.joinhas);
  document.getElementById("Upgrade_1_Label").innerText = "Clicks give +1 Joinhas (Cost: " + shortDecimal(GameData.upgrade_1_cost) + " Joinhas)";
  document.getElementById("Upgrade_2_Label").innerText = "+1 Joinhas per second (Cost: " + shortDecimal(GameData.upgrade_2_cost) + " Joinhas)";
  document.getElementById("joinhas_per_second_label").innerText = "Joinhas per second: " + shortDecimal(GameData.joinhas_per_second);
  document.getElementById("Upgrade_3_Label").innerText = "Upgrades 1 and 2 at 1/4 of their prices (Cost: " + shortDecimal(GameData.upgrade_3_cost) + " Joinhas)";
  if (GameData.upgrade_4_cap == 0) {
    document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: 1.04e7)";
  } else {
    document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: Completed)";
  }
  document.getElementById("GoldenJoinhaLabel").innerText = "Golden Joinhas: " + shortDecimal(GameData.golden_joinhas);
  document.getElementById("GoldenUpgrade1Label").innerText = "x2 Golden Joinhas\n(Cost: " + shortDecimal(GameData.golden_upgrade_1_cost) + " Golden Joinhas)";
  document.getElementById("GoldenUpgrade2Label").innerText = "x2 Joinhas\n(Cost: " + shortDecimal(GameData.golden_upgrade_2_cost) + " Golden Joinhas)";
  document.getElementById("GreatResetLabel").innerText = "Resets everything but Golden Joinhas are 15x\neasier (Cost: " + shortDecimal(GameData.great_reset_cost) + " Golden Joinhas)"
  document.getElementById("MagnetsLabel").innerText = "Magnets: " + shortDecimal(GameData.magnets);
  document.getElementById("MagnetUpgrade1Label").innerText = "Get 1.5x more Joinhas\n(Cost: "  + shortDecimal(GameData.magnet_upgrade_1_cost) + " Magnets)";
  document.getElementById("MagnetUpgrade2Label").innerText = "Get 1.5x more Golden Joinhas\n(Cost: " + shortDecimal(GameData.magnet_upgrade_2_cost) + " Magnets)";
  document.getElementById("MagnetUpgrade3Label").innerText = "Get Magnets 2x easier\n(Cost: " + shortDecimal(GameData.magnet_upgrade_3_cost) + " Magnets)\n(" + GameData.magnet_upgrade_3_limit + " / 4)";
  GameData.joinhas = GameData.joinhas.plus(GameData.joinhas_per_second);

  // Atualiza label da música automaticamente
  document.getElementById("MusicLabel").innerText = GameData.music_on ? "🎵 Music ON" : "🎵 Music OFF";
}

// Save Game
function save_game() {
  localStorage.setItem(
    "game_save",
    JSON.stringify(GameData, (_, v) => (v instanceof Decimal ? v.toString() : v))
  );
}

// Load Game
function load_game() {
  let data = localStorage.getItem("game_save");
  if (data) {
    const saved = JSON.parse(data);
    for (let key in GameData) {
      if (saved[key] !== undefined) {
        if (key === "upgrade_4_cap" || key === "music_on") {
          GameData[key] = saved[key];
        } else {
          GameData[key] = new Decimal(saved[key]);
        }
      }
    }
    update_golden_joinha_earn();
  }
  update_screen();

  // Tocar música se estava ON
  if (GameData.music_on) {
    bgm.play().catch(err => console.log(err));
  }
}

// Timer
function onesecondtimer() {
  setInterval(save_game, 5000);
  setInterval(update_screen, 1000);
  setInterval(update_golden_joinha_earn, 1000);
}

// Music!
// Cria o áudio
const bgm = new Audio('assets/Voltaic.mp3'); // seu arquivo de música
bgm.loop = true;
bgm.volume = 0.5;

// Botão toggle
musicToggle.addEventListener("click", function() {
  if (!GameData.music_on) {
    bgm.play().catch(err => console.log(err));
    GameData.music_on = true;
  } else {
    bgm.pause();
    GameData.music_on = false;
  }
  update_screen();
  save_game(); // salva imediatamente quando troca
});

// Setup inicial
window.onload = function () {
  document.getElementById("JoinhaButton").addEventListener("click", joinhaclick);
  if (GameData.upgrade_4_cap == 0) {
    document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: 1.04e7)";
  } else {
    document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: Completed)";
  }
  load_game();
  onesecondtimer();
  update_screen();
};