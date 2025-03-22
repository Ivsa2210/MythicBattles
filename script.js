
// Mythic Battles TCG JavaScript
const cardPool = [
  { id: 1, name: "Inferno Dragon", atk: 8, def: 6, sp: "Burn", rarity: "Rare", color: "#ff4500", img: "cards/Inferno Dragon.png", lore: "A legendary beast born from molten lava, said to melt mountains." },
  { id: 2, name: "Aqua Serpent", atk: 6, def: 8, sp: "Flood", rarity: "Uncommon", color: "#1e90ff", img: "cards/Aqua Serpent.png", lore: "Dweller of deep oceans, it commands the tides with a hiss." },
  { id: 3, name: "Terra Golem", atk: 7, def: 9, sp: "Shield", rarity: "Rare", color: "#8b4513", img: "cards/Terra Golem.png", lore: "A colossus forged from ancient stone and earth magic." },
  { id: 4, name: "Wind Falcon", atk: 9, def: 5, sp: "Gale", rarity: "Common", color: "#4682b4", img: "cards/Wind Falcon.png", lore: "Swift and silent, it commands the skies with a cry." },
  { id: 5, name: "Shadow Lynx", atk: 10, def: 4, sp: "Ambush", rarity: "Ultra Rare", color: "#2f4f4f", img: "cards/Shadow Lynx.png", lore: "Stalking the night, it strikes from darkness with precision." },
  { id: 6, name: "Solar Phoenix", atk: 12, def: 7, sp: "Rebirth", rarity: "Legendary", color: "#cc3300", img: "cards/Solar Phoenix.png", lore: "Reborn from ash, this celestial bird radiates eternal fire." },
  { id: 7, name: "Storm Elemental", atk: 11, def: 8, sp: "Discharge", rarity: "Ultra Rare", color: "#008080", img: "cards/Storm Elemental.png", lore: "Electric rage given form." },
  { id: 8, name: "Wispling", atk: 4, def: 3, sp: "Illuminate", rarity: "Common", color: "#555555", img: "cards/Wispling.png", lore: "Glows bright enough to blind its foes." }
];

const pullRates = {
  "Starter Pack": { Common: 0.5, Uncommon: 0.3, Rare: 0.15, "Ultra Rare": 0.04, Legendary: 0.01 },
  "Legendary Pack": { Common: 0.3, Uncommon: 0.3, Rare: 0.2, "Ultra Rare": 0.15, Legendary: 0.05 },
  "Mythic Vault": { Common: 0.1, Uncommon: 0.2, Rare: 0.3, "Ultra Rare": 0.25, Legendary: 0.15 }
};

let selectedPack = "Starter Pack";
let cardCollection = {};

function getRandomCard(packName) {
  const rates = pullRates[packName];
  const roll = Math.random();
  let cumulative = 0;
  let chosenRarity = "Common";
  for (const rarity in rates) {
    cumulative += rates[rarity];
    if (roll < cumulative) {
      chosenRarity = rarity;
      break;
    }
  }
  const pool = cardPool.filter(c => c.rarity === chosenRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderCard(card, elementId) {
  const el = document.getElementById(elementId);
  el.innerHTML = `<strong>${card.name}</strong><br>ATK: ${card.atk} DEF: ${card.def}<br>SP: ${card.sp}`;
  el.style.backgroundColor = card.color;
  el.style.cursor = 'pointer';
  el.onclick = () => openCardDetail(card);
}

function createCardElement(card) {
  const div = document.createElement("div");
  div.className = "card";
  div.style.backgroundColor = card.color;
  div.style.cursor = 'pointer';
  div.innerHTML = `#${card.id}<br><strong>${card.name}</strong><br>ATK: ${card.atk} DEF: ${card.def}<br>SP: ${card.sp}<br><em>${card.rarity}</em>`;
  div.onclick = () => openCardDetail(card);
  return div;
}

function openCardDetail(card) {
  const html = `<!DOCTYPE html><html><head><title>${card.name}</title></head><body style="font-family:sans-serif;background:#111;color:#eee;text-align:center;padding:2rem;">
    <h1>${card.name}</h1>
    <img src="${card.img}" style="width:300px;height:auto;border:4px solid ${card.color}"/><br><br>
    <p><strong>ATK:</strong> ${card.atk} <strong>DEF:</strong> ${card.def} <strong>SP:</strong> ${card.sp}</p>
    <p><strong>Rarity:</strong> ${card.rarity}</p>
    <p style="max-width:600px;margin:auto">${card.lore}</p>
    </body></html>`;
  const win = window.open("", "_blank", "width=400,height=600");
  win.document.write(html);
  win.document.close();
}

function openPack() {
  const gallery = document.querySelector(".card-gallery");
  const stats = document.getElementById("pack-stats");
  gallery.innerHTML = "";
  let localStats = { Common: 0, Uncommon: 0, Rare: 0, "Ultra Rare": 0, Legendary: 0 };

  for (let i = 0; i < 3; i++) {
    const card = getRandomCard(selectedPack);
    if (!cardCollection[card.id]) {
      cardCollection[card.id] = { ...card, count: 1 };
    } else {
      cardCollection[card.id].count++;
    }
    localStats[card.rarity]++;
    const div = createCardElement(card);
    gallery.appendChild(div);
  }

  stats.innerText = `This ${selectedPack}: Common (${localStats.Common}), Uncommon (${localStats.Uncommon}), Rare (${localStats.Rare}), Ultra Rare (${localStats["Ultra Rare"]}), Legendary (${localStats.Legendary})`;
  updateCollection();
}

function updateCollection() {
  const container = document.querySelector(".collection-gallery");
  container.innerHTML = "";
  const sorted = Object.values(cardCollection).sort((a, b) => a.id - b.id);
  sorted.forEach(card => {
    const div = createCardElement(card);
    div.className = "collection-card";
    div.innerHTML += `<br>x${card.count}`;
    container.appendChild(div);
  });
}

function selectPack(name) {
  selectedPack = name;
  document.querySelectorAll('.pack').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pack').forEach(pack => {
    if (pack.innerText === name) pack.classList.add('active');
  });
  const info = document.getElementById("pack-info");
  const rate = pullRates[name];
  info.innerText = `Pull Rates for ${name} — Common: ${rate.Common * 100}%, Uncommon: ${rate.Uncommon * 100}%, Rare: ${rate.Rare * 100}%, Ultra Rare: ${rate["Ultra Rare"] * 100}%, Legendary: ${rate.Legendary * 100}%`;
}

function startBattle() {
  const playerCard = getRandomCard(selectedPack);
  const enemyCard = getRandomCard(selectedPack);
  renderCard(playerCard, "player-card");
  renderCard(enemyCard, "enemy-card");

  let result = "";
  if (playerCard.atk > enemyCard.def) {
    result = "You Win!";
  } else if (enemyCard.atk > playerCard.def) {
    result = "You Lose!";
  } else {
    result = "It's a Draw!";
  }
  document.getElementById("battle-result").innerText = result;
}
