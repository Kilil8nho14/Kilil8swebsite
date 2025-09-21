// Global Dictionary
window.GameData = {
  joinhas: 0n,
  golden_joinhas: 0n,
  click_power: 1n,
  upgrade_1_cost: 10n,
  joinhas_per_second: 0n,
  upgrade_2_cost: 25n,
  upgrade_3_cost: 10n,
  upgrade_4_cap: 0,
  golden_joinha_earn: 0n,
  golden_joinha_price: 1000n,
  golden_upgrade_1_cost: 100n,
  golden_upgrade_1_power: 1n,
  golden_upgrade_2_cost: 100n,
  golden_upgrade_2_power: 1n
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

// Shorting to: K, M, B, T...
function shortedBigInt(num) {
    if (num < 1000n) return num.toString();

    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    let suffixIndex = 0;
    let n = num;

    while (n >= 1000n && suffixIndex < suffixes.length - 1) {
        n /= 1000n;
        suffixIndex++;
    }

    // Mostra 2 casas decimais sem converter pra Number
    const divisor = 1000n ** BigInt(suffixIndex);
    const whole = num / divisor;
    const remainder = (num % divisor) * 100n / divisor; // 2 casas

    return whole.toString() + "." + remainder.toString().padStart(2, "0") + suffixes[suffixIndex];
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
    cancelBtn.textContent = "Cancelar";
    cancelBtn.onclick = () => { document.body.removeChild(popup); callback(false); };
    box.appendChild(okBtn);
    box.appendChild(cancelBtn);
    popup.appendChild(box);
    document.body.appendChild(popup);
}

// Click Function
function joinhaclick() {
  GameData.joinhas += GameData.click_power;
  update_screen();
}

// Opens and closes the upgrades menu
function openupgradesmenu() {
	upgradesMenu.style.display = 'block';
}
function closeupgradesmenu() {
	upgradesMenu.style.display = 'none';
}
upgradesMenuCloseButton.addEventListener('click', closeupgradesmenu);
upgradesMenuButton.addEventListener('click', openupgradesmenu);

// Upgrades:
// Upgrade 1:
upgrade_1_button.addEventListener("click", function() {
	if (GameData.joinhas >= GameData.upgrade_1_cost) {
		GameData.joinhas -= GameData.upgrade_1_cost;
		GameData.click_power += 1n * (GameData.golden_joinhas / 100n + 1n) * GameData.golden_upgrade_2_power;
		GameData.upgrade_1_cost = (GameData.upgrade_1_cost * 16n) / 10n;
		update_screen();
	}
});
// Upgrade 2:

upgrade_2_button.addEventListener("click", function() {
	if (GameData.joinhas >= GameData.upgrade_2_cost) {
		GameData.joinhas -= GameData.upgrade_2_cost;
		GameData.joinhas_per_second += 1n * (GameData.golden_joinhas / 100n + 1n) * GameData.golden_upgrade_2_power;
		GameData.upgrade_2_cost = (GameData.upgrade_2_cost * 15n) / 10n;
		update_screen();
	}
});

// Upgrade 3:

upgrade_3_button.addEventListener("click", function() {
	if (GameData.joinhas >= GameData.upgrade_3_cost) {
		GameData.joinhas -= GameData.upgrade_3_cost;
		GameData.upgrade_1_cost /= 4n; GameData.upgrade_2_cost /= 4n
		GameData.upgrade_3_cost *= 25n
		update_screen();
	}
	if (GameData.upgrade_1_cost <= 1n) {
		GameData.upgrade_1_cost = 2n;
		update_screen();
	}
	if (GameData.upgrade_2_cost <= 1n) {
		GameData.upgrade_2_cost = 2n;
		update_screen();
	}
});

// Upgrade 4:

upgrade_4_button.addEventListener("click", function() {
	if (GameData.joinhas >= 10480000n && GameData.upgrade_4_cap == 0) {
		GameData.joinhas -= 10480000n;
		GameData.upgrade_4_cap = 1;
		GameData.click_power *= 25n * (GameData.golden_joinhas / 100n + 1n) * GameData.golden_upgrade_2_power;
		document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: Completed)"
		update_screen();
	}
});

// Opens Prestige Menu
prestigemenubutton.addEventListener("click", function() {
	prestigemenu.style.display = "block";
});

// Golden Upgrade 1
goldenupgrade1button.addEventListener("click", function() {
	if (GameData.golden_joinhas >= GameData.golden_upgrade_1_cost) {
		GameData.golden_joinhas -= GameData.golden_upgrade_1_cost;
		GameData.golden_upgrade_1_cost *= 10n;
		GameData.golden_upgrade_1_power *= 2n;
		GameData.golden_joinha_earn = 2n;
		update_screen();
	}
});
// Golden Upgrade 2
goldenupgrade2button.addEventListener("click", function() {
	if (GameData.golden_joinhas >= GameData.golden_upgrade_2_cost) {
		GameData.golden_joinhas -= GameData.golden_upgrade_2_cost;
		GameData.golden_upgrade_2_cost *= 10n;
		GameData.golden_upgrade_2_power *= 2n;
		update_screen();
	}
});

// Closes Prestige Menu
closeprestigemenubutton.addEventListener("click", function() {
	prestigemenu.style.display = "none";
});
//Does the popup
prestigebutton.addEventListener("click", function() {
    showConfirm(
        `Do you want to prestige? This will give: ${GameData.golden_joinha_earn} Golden Joinhas.`,
        function(result) {
            if (result) {
                // Só prestigia se tiver pelo menos 1
                if (GameData.golden_joinha_earn >= 1n) {
                    // Dá os Golden Joinhas
                    GameData.golden_joinhas += GameData.golden_joinha_earn;

                    // Atualiza o preço real (com base na quantidade que podia comprar)
                    for (let i = 0n; i < GameData.golden_joinha_earn; i++) {
                        GameData.golden_joinha_price = (GameData.golden_joinha_price * 1006n) / 1000n + 1000n;
                    }

                    // Reset de Joinhas e upgrades
                    GameData.joinhas = 0n;
                    GameData.click_power = 1n * (BigInt(GameData.golden_joinhas / 100n)) + 1n;
                    GameData.joinhas_per_second = 0n;
                    GameData.upgrade_1_cost = 10n;
                    GameData.upgrade_2_cost = 25n;
                    GameData.upgrade_3_cost = 10n;
                    GameData.upgrade_4_cap = 0;
                    GameData.golden_joinha_price = 1000n;

                    // Zera o "quanto ganharia"
                    GameData.golden_joinha_earn = 0n;

                    update_screen();
                }
            }
            // se clicou Cancel, não faz nada
        }
    );
});

// Opening Settings Menu
settingsmenubutton.addEventListener("click", function() {
	settingsmenu.style.display = "block";
});
// Closes The settings Menu
closesettingsmenubutton.addEventListener("click", function() {
	settingsmenu.style.display = "none";
});
// Hard Reset Button
hardresetbutton.addEventListener("click", function() {
	showConfirm(`DO YOU WANT TO HARD RESET FOREVER?`, function(result) {
		if (result) {
			localStorage.removeItem("game_save")
			location.reload()
		}
	})
});
	

// Atualiza o quanto o jogador ganharia se prestigiar
function update_golden_joinha_earn() {
    let temp_joinhas = GameData.joinhas;
    let temp_price = GameData.golden_joinha_price;
    let earn = 0n;

    while (temp_joinhas >= temp_price) {
        temp_joinhas -= temp_price;
        earn += 1n * GameData.golden_upgrade_1_power;
        temp_price = (temp_price * 1006n) / 1000n; // Aumento de 0.6%
    }

    GameData.golden_joinha_earn = earn;
}

// Update Screen
function update_screen() {
  document.getElementById("JoinhaLabel").innerText = "Joinhas: " + shortedBigInt(GameData.joinhas);
  document.getElementById("Upgrade_1_Label").innerText = "Clicks give +1 Joinhas (Cost: " + shortedBigInt(GameData.upgrade_1_cost) + " Joinhas)"
  document.getElementById("Upgrade_2_Label").innerText = "+1 Joinhas per second (Cost: " + shortedBigInt(GameData.upgrade_2_cost) + " Joinhas)"
  document.getElementById("joinhas_per_second_label").innerText = "Joinhas per second: " + shortedBigInt(GameData.joinhas_per_second)
  document.getElementById("Upgrade_3_Label").innerText = "Upgrades 1 and 2 at 1/4 of their prices (Cost: " + shortedBigInt(GameData.upgrade_3_cost) + " Joinhas)"
  document.getElementById("GoldenJoinhaLabel").innerText = "Golden Joinhas: " + shortedBigInt(GameData.golden_joinhas)
  document.getElementById("GoldenUpgrade1Label").innerText = "x2 Golden Joinhas\n(Cost: " + shortedBigInt(GameData.golden_upgrade_1_cost) + " Golden Joinhas)"
  document.getElementById("GoldenUpgrade2Label").innerText = "x2 Joinhas\n(Cost: " + shortedBigInt(GameData.golden_upgrade_2_cost) + " Golden Joinhas)"
  GameData.joinhas += GameData.joinhas_per_second;
}

// Save Game
function save_game() {
  localStorage.setItem(
    "game_save",
    JSON.stringify(GameData, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}
// Load Game
function load_game() {
  let data = localStorage.getItem("game_save");
  if (data) {
    const saved = JSON.parse(data);

    // Converte de volta os que são BigInt
    GameData.joinhas = BigInt(saved.joinhas ?? 0n);
    GameData.golden_joinhas = BigInt(saved.golden_joinhas ?? 0n);
    GameData.click_power = BigInt(saved.click_power ?? 1n);
    GameData.upgrade_1_cost = BigInt(saved.upgrade_1_cost ?? 10n);
    GameData.joinhas_per_second = BigInt(saved.joinhas_per_second ?? 0n);
    GameData.upgrade_2_cost = BigInt(saved.upgrade_2_cost ?? 25n);
    GameData.upgrade_3_cost = BigInt(saved.upgrade_3_cost ?? 10n);
    GameData.upgrade_4_cap = parseInt(saved.upgrade_4_cap ?? 0);
    GameData.golden_joinha_price = BigInt(saved.golden_joinha_price ?? 1000n);
    GameData.golden_joinha_earn = BigInt(saved.golden_joinha_earn ?? 0n);
    GameData.golden_upgrade_1_cost = BigInt(saved.golden_upgrade_1_cost ?? 100n);
    GameData.golden_upgrade_1_power = BigInt(saved.golden_upgrade_1_power ?? 1n);
    GameData.golden_upgrade_2_cost = BigInt(saved.golden_upgrade_2_cost ?? 100n);
    GameData.golden_upgrade_2_power = BigInt(saved.golden_upgrade_2_power ?? 1n);
    
    update_golden_joinha_earn();
  }
  update_screen();
}

// Timer (salva a cada 1 segundo)
function onesecondtimer() {
  setInterval(save_game, 1000);
  setInterval(update_screen, 1000);
  setInterval(update_golden_joinha_earn, 1000)
}

// Setup inicial
window.onload = function () {
    document.getElementById("JoinhaButton").addEventListener("click", joinhaclick);
    if (GameData.upgrade_4_cap == 0) {
        document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: 10.48M)"
} else {
  	document.getElementById("Upgrade_4_Label").innerText = "Clicks are 25x more powerful (Cost: Completed)"
}
    load_game();
    onesecondtimer();
    update_screen();
};