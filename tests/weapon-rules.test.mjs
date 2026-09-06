import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createServer } from "vite";

const server = await createServer({ cacheDir: "node_modules/.vite-rules-tests", server: { middlewareMode: true, hmr: false }, appType: "custom" });
after(() => server.close());
const data = await server.ssrLoadModule("/src/components/weapon-data.ts");
const rules = await server.ssrLoadModule("/src/data/game-rules.ts");
const monsters = await server.ssrLoadModule("/src/components/monster-weapon-data.ts");
const links = await server.ssrLoadModule("/src/components/weapon-build-links.ts");
const exporter = await server.ssrLoadModule("/src/components/weapon-export.ts");
const beyond = await server.ssrLoadModule("/src/components/dndbeyond-export.ts");
const weapon = (id) => data.weapons.find((item) => item.id === id);

test("Beyond descriptions escape HTML, retain ability headings and distinguish text from sheet settings", () => {
  const html = beyond.beyondDescription({
    name: "Test", subtitle: "Magic weapon", damage: "1d6 piercing", bonus: 1,
    cost: "4,175 gp", crafting: "Includes infusion plus monster parts.",
    sections: [{ heading: "Greater Reach & more", text: 'Reach 120 feet.\n<script>alert("x")</script>' }],
  });
  assert.match(html, /<h3>Greater Reach &amp; more<\/h3>/);
  assert.match(html, /Reach 120 feet\.<br \/>/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Magic bonus: \+1/);
  assert.match(html, /4,175 gp/);
  assert.match(html, /separate modifiers.*must also be configured/);
});

test("all catalog references resolve and parameterized properties have values", () => {
  for (const item of data.weapons) {
    for (const ref of item.properties) {
      assert.ok(rules.resolveRule(ref));
      assert.doesNotMatch(rules.ruleText(ref), /undefined|{{|—/);
    }
    for (const id of item.mods) assert.ok(data.mods.find((mod) => mod.id === id));
  }
  assert.throws(() => rules.resolveRule({ ruleId: "missing-rule" }), /Unknown rule/);
});
test("Recurve is data-driven and never mutates the source weapon", () => {
  const bow = weapon("longbow");
  const original = JSON.stringify(bow);
  const result = data.applyMod(bow, "recurve");
  assert.deepEqual(result.properties[0].values, { normal: 200, long: 700 });
  assert.equal(JSON.stringify(bow), original);
  assert.throws(() => data.applyMod(bow, "bone"), /not available/);
});
test("infusions cost 2k, 4k, 8k; Cheap affects mundane modifications only", () => {
  assert.deepEqual([0, 1, 2, 3].map(data.monsterInfusionCost), [0, 2000, 4000, 8000]);
  assert.throws(() => data.monsterInfusionCost(4), /Invalid/);
  assert.equal(data.modificationCost(weapon("greatclub")), 10);
  assert.equal(weapon("longbow").cost + data.modificationCost(weapon("longbow")) + data.monsterInfusionCost(2), 4175);
});
test("Roc uses versatile dice and separates physical and elemental damage", () => {
  const result = data.applyMonsterStats(weapon("spatha"), undefined, "roc", "Fire", 1);
  assert.equal(result.damage, "1d6 + 1d4 slashing + 1d6 + 1d4 fire");
  assert.ok(!data.hasProperty(result.properties, "versatile"));
  assert.ok(data.hasProperty(data.applyMonsterStats(weapon("labrys"), undefined, "roc", "Ice", 1).properties, "unwieldy"));
});
test("Hydra reduces die size once, including versatile dice and small-die exceptions", () => {
  assert.equal(data.applyMonsterStats(weapon("longbow"), "recurve", "hydra", "Northern Swarm", 2).damage, "1d6 piercing");
  const result = data.applyMonsterStats(weapon("doru"), undefined, "hydra", "Northern Swarm", 1);
  assert.equal(result.properties.find((ref) => ref.ruleId === "versatile").values.damage, "Heavy, 1d8");
  assert.equal(data.applyMonsterStats({ ...weapon("longbow"), damage: "1d4 piercing" }, undefined, "hydra", "Northern Swarm", 1).damage, "1d3 piercing");
});
test("Medusa Snake adds poison and only eligible major variants gain Brutal", () => {
  assert.equal(data.applyMonsterStats(weapon("longbow"), undefined, "medusa", "Snake", 2).damage, "1d8 piercing + 1d6 poison");
  assert.ok(data.hasProperty(data.applyMonsterStats(weapon("shortbow"), undefined, "medusa", "Snake", 2).properties, "brutal"));
});
test("monster parser preserves general features and historical weapon aliases", () => {
  const chimera = monsters.monsterWeapons.find((item) => item.id === "chimera");
  assert.match(chimera.trees[0].tiers[0].rules, /Aspects/);
  const hydra = monsters.monsterWeapons.find((item) => item.id === "hydra");
  assert.ok(monsters.rulesForWeapon(hydra.trees[1].tiers[1], "shortbow", "Shortbow").length);
});
test("Apex always requires a unique kill, with explicit missing-name handling", () => {
  const roc = monsters.monsterWeapons.find((item) => item.id === "roc");
  assert.match(monsters.apexRequirement(roc, roc.trees[0]), /Slay Simurgh, the unique/);
  const hydra = monsters.monsterWeapons.find((item) => item.id === "hydra");
  assert.match(monsters.apexRequirement(hydra, hydra.trees[0]), /unique named.*not yet documented/);
});
test("every canonical monster tree has a valid forge link, without duplicate MDX routes", () => {
  for (const monster of monsters.monsterWeapons) {
    const path = `src/content/docs/weapons/${monster.sourcePath}`;
    assert.equal(existsSync(`${path}.mdx`), false);
    const source = readFileSync(`${path}.md`, "utf8");
    const matches = [...source.matchAll(/\[Build with this tree\]\(\/weapons\/builder\/(\?[^)]+)\)/g)];
    assert.equal(matches.length, monster.trees.length);
    for (const [index, match] of matches.entries()) {
      assert.deepEqual(links.resolveTreeBuild(match[1]), { monsterId: monster.id, treeName: monster.trees[index].name, tier: 1 });
      assert.doesNotMatch(monster.trees[index].description, /Build with this tree/);
    }
    assert.ok(data.advancedWeapons.some((item) => data.monsterCompatibility[monster.id]?.includes(item.family)));
  }
});
test("deep links validate tree identity and available tiers", () => {
  assert.deepEqual(links.resolveTreeBuild("?monster=hydra&tree=southern-regrowth&tier=3"), { monsterId: "hydra", treeName: "Southern Regrowth", tier: 3 });
  assert.equal(links.resolveTreeBuild("?monster=hydra&tree=fire"), undefined);
  assert.equal(links.resolveTreeBuild("?monster=missing&tree=fire"), undefined);
  assert.equal(links.resolveTreeBuild("?monster=siren&tree=stupor&tier=3").tier, 1);
});
test("export includes all unlocked rules, resolved properties and only the selected weapon variants", () => {
  const monster = monsters.monsterWeapons.find((item) => item.id === "hydra");
  const tree = monster.trees[0];
  const bow = weapon("longbow");
  const card = exporter.makeWeaponCard({ weapon: bow, modName: "Recurve", ...data.applyMonsterStats(bow, "recurve", "hydra", tree.name, 2), totalGold: 4175, modCost: 100, infusionCost: 4000, monster, tree, tier: 2 });
  assert.equal(card.name, "101 Heads");
  assert.equal(card.cost, "4,175 gp");
  const text = JSON.stringify(card.sections);
  assert.match(text, /200 feet/);
  assert.match(text, /Major Greater Reach/);
  assert.ok(card.sections.some((section) => section.heading === "Greater Reach"));
  assert.ok(card.sections.some((section) => section.heading === "Major Greater Reach"));
  assert.doesNotMatch(text, /Longbow & Javelin/);
  assert.match(text, /Lashing Heads/);
  assert.doesNotMatch(text, /Apex Greater Reach|Lurking Bite/);
  const apex = exporter.makeWeaponCard({ weapon: bow, ...data.applyMonsterStats(bow, undefined, "hydra", tree.name, 3), totalGold: 8075, modCost: 0, infusionCost: 8000, monster, tree, tier: 3 });
  assert.match(apex.crafting, /Slay the unique named apex Hydra/);
  assert.match(JSON.stringify(apex.sections), /Apex Greater Reach/);
});
