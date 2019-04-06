const fs = require("fs");

const url = "srd_5e_monsters.json";

const src = fs.readFileSync(url);

const creatureUrls = JSON.parse(src).map(c => c.img_url);

const fullData = JSON.parse(fs.readFileSync("public/converted-monsters.json")).creatures;

const newCreatures = [];
for (let i = 0; i < creatureUrls.length; i++) {
  newCreatures.push({ ...fullData[i], imageUrl: creatureUrls[i] });
}

const newSrc = JSON.stringify({
  name: "SRD",
  creatures: newCreatures
});

fs.writeFileSync("converted-monsters-2.json", newSrc, "utf8");