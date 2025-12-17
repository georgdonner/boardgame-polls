/* eslint-disable */
// Switch to the boardgameplanner database
db = db.getSiblingDB("boardgameplanner");

// Check if boardgames collection already has data
const existingCount = db.boardgames.countDocuments();

if (existingCount === 0) {
  // Only insert if collection is empty
  try {
    const result = db.boardgames.insertMany([
      { _id: "as8f79df", emoji: "🐭", name: "Root" },
      { _id: "vn9ufhg9", emoji: "🐦", name: "Flügelschlag" },
      { _id: "as98hdfd", emoji: "🧙‍♀️", name: "Quacksalber von Quedlinburg" },
      { _id: "ags7d8fd", emoji: "🐉", name: "Klong!" },
      { _id: "adhjg98d", emoji: "🔱", name: "7 Wonders" },
      { _id: "as9udhfl", emoji: "👩‍🚀", name: "Terraforming Mars" },
      { _id: "a9hdsfuf", emoji: "🏝️", name: "Spirit Island" },
      { _id: "8a7sdfsd", emoji: "🐿️", name: "Everdell" },
      { _id: "afs0djhf", emoji: "🐘", name: "Arche Nova" },
      { _id: "fasnd98f", emoji: "💡", name: "Anno 1800" },
      { _id: "sfh98sud", emoji: "🌌", name: "Roll for the Galaxy" },
      { _id: "sd0fgjif", emoji: "🪐", name: "Dune Imperium" },
      { _id: "liasdhfd", emoji: "🔷", name: "Azul" },
      { _id: "h78asdgf", emoji: "🇵🇷", name: "Puerto Rico", neverPlayed: true },
      { _id: "fas89dfi", emoji: "🏰", name: "Castles of Burgundy" },
      { _id: "as8fjkdf", name: "Imperial Settlers: Empires of the North", emoji: "❄️", neverPlayed: true },
      { _id: "bd7a9hds", name: "Terra Mystica", emoji: "⛰️", neverPlayed: true },
      { _id: "fha9s7df", name: "Viticulture", emoji: "🍇", neverPlayed: true },
      { _id: "lkjasdhf", name: "Concordia", emoji: "⚖️" },
      { _id: "cbziue87", name: "Great Western Trail", emoji: "🤠", neverPlayed: true },
      { _id: "yf67afdu", name: "Carpe Diem", emoji: "🏛️" },
      { _id: "a956ffuy", name: "Tavernen im Tiefen Thal", emoji: "🍻" },
      { _id: "fahs9dfh", name: "Scythe", emoji: "🌾", neverPlayed: true },
      { _id: "fhdiu7zt", name: "Scout", emoji: "🎪", short: true },
      { _id: "j9a8hfd9", name: "Spicy", emoji: "🌶️", short: true },
      { _id: "cas43kil", name: "Cascadia", emoji: "🦌" },
      { _id: "78gflkij", name: "Die Crew", emoji: "🚀", short: true },
      { _id: "hfasd78s", name: "Fantastische Reiche", emoji: "👑", short: true },
      { _id: "aus7zghd", name: "Ausgerechnet Uppsala", emoji: "📍", short: true },
      { _id: "dec78zfa8", name: "Decrypto", emoji: "🔢" },
      { _id: "h878fhds", name: "Chamäleon", emoji: "🦎", short: true },
      { _id: "ggh76877", name: "Kurwa", emoji: "🃏", short: true },
      { _id: "kar8ug89s", name: "Kartograph", emoji: "🗺️" },
      { _id: "magbu765", name: "Magic Maze", emoji: "⏳" },
      { _id: "colfa78ds", name: "Colt Express", emoji: "🔫" },
      { _id: "209fmpol", name: "Coup", emoji: "🗡️", short: true },
      { _id: "bafsdf65", name: "Poesie für Neandertaler", emoji: "🪨", short: true },
      { _id: "whe7fa8f", name: "When I Dream", emoji: "😴", short: true },
      { _id: "aeo7fga8", name: "Aeon's End", emoji: "🪄", neverPlayed: true },
      { _id: "cha7fd67", name: "Chapeau", emoji: "🎩", short: true }
    ], { ordered: false });
    print(`Successfully inserted ${result.insertedCount} boardgames`);
  } catch (e) {
    print(`Error inserting boardgames: ${e}`);
    // Continue even if some documents fail (e.g., duplicates)
  }
} else {
  print(`Boardgames collection already has ${existingCount} documents. Skipping seed.`);
}