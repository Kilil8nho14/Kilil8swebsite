// Global Dictionary
window.GameData = {
  joinhas: 0n,
  click_power: 1n,
  upgrade_1_cost: 10n,
  joinhas_per_second: 0n,
  upgrade_2_cost: 25n
};

// ===== Constantes =====
const upgradesMenuButton = document.getElementById('UpgradesMenuButton');
const upgradesMenu = document.getElementById('UpgradesMenu');
const upgradesMenuCloseButton = document.getElementById('CloseUpgradesButton');
const upgrade_1_button = document.getElementById('Upgrade_1_Button');
const upgrade_2_button = document.getElementById('Upgrade_2_Button');

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
		GameData.click_power += 1n;
		GameData.upgrade_1_cost = (GameData.upgrade_1_cost * 16n) / 10n;
		update_screen();
	}
});
// Upgrade 2:

upgrade_2_button.addEventListener("click", function() {
	if (GameData.joinhas >= GameData.upgrade_2_cost) {
		GameData.joinhas -= GameData.upgrade_2_cost;
		GameData.joinhas_per_second += 1n;
		GameData.upgrade_2_cost = (GameData.upgrade_2_cost * 15n) / 10n;
		update_screen();
	}
});

// Update Screen
function update_screen() {
  document.getElementById("JoinhaLabel").innerText = "Joinhas: " + shortedBigInt(GameData.joinhas);
  document.getElementById("Upgrade_1_Label").innerText = "Clicks give +1 Joinhas (Cost: " + shortedBigInt(GameData.upgrade_1_cost) + " Joinhas)"
  document.getElementById("Upgrade_2_Label").innerText = "+1 Joinhas per second (Cost: " + shortedBigInt(GameData.upgrade_2_cost) + " Joinhas)"
  document.getElementById("joinhas_per_second_label").innerText = "Joinhas per second: " + shortedBigInt(GameData.joinhas_per_second)
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
    GameData = JSON.parse(data);

    // Converte de volta os que são BigInt
    GameData.joinhas = BigInt(GameData.joinhas ?? 0n);
    GameData.click_power = BigInt(GameData.click_power ?? 1n);
    GameData.upgrade_1_cost = BigInt(GameData.upgrade_1_cost ?? 10n);
    GameData.joinhas_per_second = BigInt(GameData.joinhas_per_second ?? 0n);
    GameData.upgrade_2_cost = BigInt(GameData.upgrade_2_cost ?? 25n);
  }
  update_screen();
}

// Timer (salva a cada 1 segundo)
function onesecondtimer() {
  setInterval(save_game, 1000);
  setInterval(update_screen, 1000);
}

// Setup inicial
window.onload = function () {
  document.getElementById("JoinhaButton").addEventListener("click", joinhaclick);
  load_game();
  onesecondtimer();
};