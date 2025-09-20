// Global Dictionary
window.GameData = {
  joinhas: 0n,
  click_power: 1n
};

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

// Update Screen
function update_screen() {
  document.getElementById("JoinhaLabel").innerText =
    "Joinhas: " + shortedBigInt(GameData.joinhas);
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
    GameData.joinhas = BigInt(GameData.joinhas);
    GameData.click_power = BigInt(GameData.click_power);
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