// Starting stats for each race at level 1
const startingStats = {
  human: { str: 30, dex: 30, int: 30, hits: 50, stam: 50, mana: 50 },
  elf: { str: 30, dex: 40, int: 35, hits: 40, stam: 60, mana: 55 },
  dwarf: { str: 40, dex: 25, int: 25, hits: 60, stam: 45, mana: 40 },
  orc: { str: 40, dex: 25, int: 20, hits: 60, stam: 50, mana: 40 },
};

// Stat offsets per level for each race
const raceOffsets = {
  human: { str: 1, dex: 1, int: 1, hits: 3, stam: 2, mana: 2 },
  elf: { str: 1, dex: 3, int: 3, hits: 3, stam: 2, mana: 3 },
  dwarf: { str: 3, dex: 1, int: 2, hits: 4, stam: 2, mana: 2 },
  orc: { str: 3, dex: 1, int: 1, hits: 3, stam: 2, mana: 1 },
};

// Stat offsets per level for each class
const classOffsets = {
  fighter: { str: 8, dex: 7, int: 3, hits: 9, stam: 7, mana: 3 },
  cleric: { str: 6, dex: 6, int: 7, hits: 7, stam: 6, mana: 8 },
  druid: { str: 8, dex: 7, int: 5, hits: 8, stam: 6, mana: 7 },
  mage: { str: 4, dex: 4, int: 10, hits: 6, stam: 5, mana: 10 },
  rogue: { str: 7, dex: 9, int: 4, hits: 8, stam: 6, mana: 6 },
  ranger: { str: 7, dex: 9, int: 5, hits: 7, stam: 6, mana: 6 },
  kensai: { str: 7, dex: 8, int: 5, hits: 7, stam: 7, mana: 6 },
  knight: { str: 7, dex: 7, int: 4, hits: 8, stam: 6, mana: 5 },
};

// Store up to 4 combinations for comparison
const compareResults = [];

function calculateStats() {
  const race = document.getElementById("race").value;
  const cls = document.getElementById("class").value;
  const level = parseInt(document.getElementById("level").value);

  // Get starting stats for the selected race at level 1
  const stats = { ...startingStats[race] };

  // Calculate stat offsets per level for levels 2-20
  const raceOffset = raceOffsets[race];
  const classOffset = classOffsets[cls];

  for (let i = 2; i <= Math.min(level, 20); i++) {
    stats.str += raceOffset.str + classOffset.str;
    stats.dex += raceOffset.dex + classOffset.dex;
    stats.int += raceOffset.int + classOffset.int;
    stats.hits += raceOffset.hits + classOffset.hits;
    stats.stam += raceOffset.stam + classOffset.stam;
    stats.mana += raceOffset.mana + classOffset.mana;
  }

  // Humans get 2 extra stats per level (up to level 20)
  if (race === "human") {
    const strBonus = parseInt(document.getElementById("humanStr").value || 0);
    const dexBonus = parseInt(document.getElementById("humanDex").value || 0);
    const intBonus = parseInt(document.getElementById("humanInt").value || 0);

    // Ensure total bonus does not exceed 2 points per level or 40 points total
    const totalBonus = strBonus + dexBonus + intBonus;
    const maxBonusPerLevel = (level - 1) * 2 + 2; // Max bonus up to current level
    const maxBonusTotal = 40; // Max bonus by level 20

    if (totalBonus > maxBonusPerLevel || totalBonus > maxBonusTotal) {
      alert(`You can only allocate up to ${Math.min(maxBonusPerLevel, maxBonusTotal)} points by level ${level}!`);
      return;
    }

    // Add the bonus points verbatim
    stats.str += strBonus;
    stats.dex += dexBonus;
    stats.int += intBonus;
  }

  // Levels 21-25: Add a flat +5 to each stat per level
  if (level > 20) {
    const flatBonus = (level - 20) * 5;
    stats.str += flatBonus;
    stats.dex += flatBonus;
    stats.int += flatBonus;
    stats.hits += flatBonus;
    stats.stam += flatBonus;
    stats.mana += flatBonus;
  }

  // Apply +40 str and hits bonus for humans (if checkbox is checked)
  if (race === "human" && document.getElementById("humanBonusCheckbox").checked) {
    stats.str += 40;
    stats.hits += 40;
  }

  // Display the results
  document.getElementById("str").textContent = stats.str;
  document.getElementById("dex").textContent = stats.dex;
  document.getElementById("int").textContent = stats.int;
  document.getElementById("hits").textContent = stats.hits;
  document.getElementById("stam").textContent = stats.stam;
  document.getElementById("mana").textContent = stats.mana;

  // Add the current combination to the compare results
  addToCompareResults(stats, race, cls, level);
}

function addToCompareResults(stats, race, cls, level) {
  if (compareResults.length >= 4) {
    compareResults.shift(); // Remove the oldest combination
  }
  compareResults.push({ stats, race, cls, level });

  // Display the compare results
  const compareResultsDiv = document.getElementById("compareResults");
  compareResultsDiv.innerHTML = "";

  compareResults.forEach((result) => {
    const combinationDiv = document.createElement("div");
    combinationDiv.className = "compare-item";
    combinationDiv.innerHTML = `
      <h3>${result.race} ${result.cls} (Level ${result.level})</h3>
      <p><strong>Strength:</strong> ${result.stats.str}</p>
      <p><strong>Dexterity:</strong> ${result.stats.dex}</p>
      <p><strong>Intelligence:</strong> ${result.stats.int}</p>
      <p><strong>Hits:</strong> ${result.stats.hits}</p>
      <p><strong>Stamina:</strong> ${result.stats.stam}</p>
      <p><strong>Mana:</strong> ${result.stats.mana}</p>
    `;
    compareResultsDiv.appendChild(combinationDiv);
  });
}

function resetForm() {
  document.getElementById("statForm").reset();
  document.getElementById("results").innerHTML = `
    <p><strong>Strength:</strong> <span id="str">0</span></p>
    <p><strong>Dexterity:</strong> <span id="dex">0</span></p>
    <p><strong>Intelligence:</strong> <span id="int">0</span></p>
    <p><strong>Hits:</strong> <span id="hits">0</span></p>
    <p><strong>Stamina:</strong> <span id="stam">0</span></p>
    <p><strong>Mana:</strong> <span id="mana">0</span></p>
  `;
  compareResults.length = 0; // Clear compare results
  document.getElementById("compareResults").innerHTML = "";
}