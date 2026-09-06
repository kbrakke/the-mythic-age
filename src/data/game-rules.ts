/**
 * Shared vocabulary for rules that need to appear in more than one place.
 *
 * Prose is authoritative. Only supported, typed mechanics are executable;
 * unusual rules can remain prose without pretending to be calculated.
 */
export type RuleMechanic =
  | { type: "increase-range"; normal: number; long: number }
  | { type: "cost-multiplier"; appliesTo: "mundane-upgrades"; value: number };

export type GameRule = {
  id: string;
  name: string;
  category: "weapon-property" | "modification" | "feature" | "condition" | "custom";
  summary: string;
  rules: string;
  tags?: string[];
  source?: { page: string; section?: string };
  mechanics?: RuleMechanic[];
  labelTemplate?: string;
};

export type RuleRef = {
  ruleId: string;
  label?: string;
  values?: Record<string, string | number>;
};

const weaponSource = { page: "/weapons/mundane-weapons/" };

export const gameRules = {
  ammunition: {
    id: "ammunition", name: "Ammunition", category: "weapon-property",
    summary: "Uses ammunition at the listed normal and long ranges.",
    rules: "You can make a ranged attack with this weapon only when you have ammunition to fire. Its normal range is {{normal}} feet and its long range is {{long}} feet. Attacks beyond normal range have disadvantage, and targets beyond long range cannot be attacked.",
    source: weaponSource,
    labelTemplate: "Ammunition (range {{normal}}/{{long}})",
  },
  brutal: {
    id: "brutal", name: "Brutal", category: "weapon-property",
    summary: "Maximum critical-hit dice can create another damage die.",
    rules: "When rolling damage for a critical hit, if any damage die rolls its highest number, roll one additional weapon damage die and add it to the damage.", source: weaponSource,
  },
  cheap: {
    id: "cheap", name: "Cheap", category: "weapon-property",
    summary: "Upgrades and modifications cost one tenth their normal price.",
    rules: "This weapon may be upgraded to advanced or have modifications added for one tenth of the normal price.", source: weaponSource,
    mechanics: [{ type: "cost-multiplier", appliesTo: "mundane-upgrades", value: 0.1 }],
  },
  empowering: {
    id: "empowering", name: "Empowering", category: "weapon-property",
    summary: "Upcast healing or damage gains a bonus equal to the slot level.",
    rules: "When you cast a spell using a higher spell slot, if it heals hit points or deals damage, increase that amount by the level of the slot used. This property can only be used on casting foci.", source: weaponSource,
  },
  fast: {
    id: "fast", name: "Fast", category: "weapon-property",
    summary: "Drawing or stowing the weapon requires no interaction.",
    rules: "Drawing or stowing this weapon does not require an interaction with an object.", source: weaponSource,
  },
  finesse: {
    id: "finesse", name: "Finesse", category: "weapon-property",
    summary: "Use Strength or Dexterity for attacks and damage.",
    rules: "When making an attack with this weapon, use your choice of Strength or Dexterity for the attack and damage rolls. You must use the same modifier for both rolls.", source: weaponSource,
  },
  heavy: {
    id: "heavy", name: "Heavy", category: "weapon-property",
    summary: "A large weapon that is difficult for small wielders to use.",
    rules: "Creatures ill-suited to the weapon's size have disadvantage on attack rolls made with it, subject to the campaign's size and proficiency rules.", source: weaponSource,
  },
  light: {
    id: "light", name: "Light", category: "weapon-property",
    summary: "Light enough to use for two-weapon fighting.",
    rules: "A Light weapon is small and easy to handle, making it suitable for fighting with a weapon in each hand.", source: weaponSource,
  },
  penetrating: {
    id: "penetrating", name: "Penetrating", category: "weapon-property",
    summary: "Critical hits add your proficiency bonus to damage.",
    rules: "When you score a critical hit, add your proficiency bonus to the damage dealt.", source: weaponSource,
  },
  pummeling: {
    id: "pummeling", name: "Pummeling", category: "weapon-property",
    summary: "Critical hits may push the target 5 feet.",
    rules: "When you score a critical hit, you may push the target 5 feet away.", source: weaponSource,
  },
  reach: {
    id: "reach", name: "Reach", category: "weapon-property",
    summary: "Adds 5 feet to the weapon's melee reach.",
    rules: "This weapon adds 5 feet to your reach when you attack with it and when determining your reach for opportunity attacks made with it.", source: weaponSource,
  },
  rejuvenating: {
    id: "rejuvenating", name: "Rejuvenating", category: "weapon-property",
    summary: "Healing another creature grants temporary hit points.",
    rules: "When you heal another creature, gain temporary hit points equal to the spell's level.", source: weaponSource,
  },
  thrown: {
    id: "thrown", name: "Thrown", category: "weapon-property",
    summary: "May be thrown at the listed normal and long ranges.",
    rules: "This weapon can make a ranged attack by being thrown. Its normal range is {{normal}} feet and its long range is {{long}} feet. Use the same ability modifier for this attack that you use for a melee attack with the weapon.",
    source: weaponSource, labelTemplate: "Thrown (range {{normal}}/{{long}})",
  },
  "two-handed": {
    id: "two-handed", name: "Two-Handed", category: "weapon-property",
    summary: "Requires two hands when attacking.",
    rules: "This weapon requires two hands when you attack with it.", source: weaponSource,
  },
  unrelenting: {
    id: "unrelenting", name: "Unrelenting", category: "weapon-property",
    summary: "Critical-hit damage dice showing 1 create another die.",
    rules: "When rolling damage for a critical hit, if any damage die rolls a 1, roll one additional weapon damage die and add it to the damage.", source: weaponSource,
  },
  unwieldy: {
    id: "unwieldy", name: "Unwieldy", category: "weapon-property",
    summary: "Later attacks in the same turn have disadvantage.",
    rules: "Attacks made with this weapon beyond the first attack in the same turn have disadvantage.", source: { page: "/weapons/roc-weapons/" },
  },
  versatile: {
    id: "versatile", name: "Versatile", category: "weapon-property",
    summary: "Deals different damage when wielded with two hands.",
    rules: "This weapon can be used with one or two hands. When wielded with two hands, use {{damage}} for its damage.", source: weaponSource,
    labelTemplate: "Versatile ({{damage}})",
  },
  volatile: {
    id: "volatile", name: "Volatile", category: "weapon-property",
    summary: "Reroll one elemental spell-damage die.",
    rules: "When a spell cast through this focus deals acid, cold, fire, lightning, or thunder damage, reroll one damage die and use the new result.", source: weaponSource,
  },
  bone: {
    id: "bone", name: "Bone", category: "modification",
    summary: "Critical hits deal extra damage and grant temporary hit points.",
    rules: "When you score a critical hit, you may deal additional damage equal to your proficiency bonus and gain the same amount of temporary hit points. This can only be used on clubs, crystals, and staves.", source: weaponSource,
  },
  concealable: {
    id: "concealable", name: "Concealable", category: "modification",
    summary: "Advantage on checks made to conceal the weapon.",
    rules: "You have advantage on Dexterity (Sleight of Hand) checks made to conceal this weapon. This can only be used on light weapons or casting foci.", source: weaponSource,
  },
  "cross-guard": {
    id: "cross-guard", name: "Cross Guard", category: "modification",
    summary: "+1 AC while not using a shield.",
    rules: "You gain +1 AC while not using a shield. This does not stack with another Cross Guard.", source: weaponSource,
  },
  dense: {
    id: "dense", name: "Dense", category: "modification",
    summary: "Critical hits add your Strength modifier again.",
    rules: "When you score a critical hit, add your Strength modifier to the damage one additional time.", source: weaponSource,
  },
  "dual-head": {
    id: "dual-head", name: "Dual Head", category: "modification",
    summary: "Change between physical damage types.",
    rules: "When the weapon would deal bludgeoning, piercing, or slashing damage, it may deal one of the other two types instead.", source: weaponSource,
  },
  keen: {
    id: "keen", name: "Keen", category: "modification",
    summary: "Critical hits add your Dexterity modifier.",
    rules: "When you score a critical hit, add your Dexterity modifier (minimum 0) to the damage dealt.", source: weaponSource,
  },
  metal: {
    id: "metal", name: "Metal", category: "modification",
    summary: "Once per rest, add proficiency to spell damage.",
    rules: "When you deal damage with a spell, add your proficiency bonus to that damage. Once used, this property cannot be used again until you complete a short rest.", source: weaponSource,
  },
  recurve: {
    id: "recurve", name: "Recurve", category: "modification",
    summary: "Increases normal range by 50 feet and long range by 100 feet.",
    rules: "Increase this weapon's normal range by 50 feet and its long range by 100 feet.", source: weaponSource,
    mechanics: [{ type: "increase-range", normal: 50, long: 100 }],
  },
  sauroter: {
    id: "sauroter", name: "Sauroter", category: "modification",
    summary: "Opportunity attacks reduce speed to 0.",
    rules: "When you hit with an opportunity attack, the creature's speed becomes 0 until your turn.", source: weaponSource,
  },
  sundering: {
    id: "sundering", name: "Sundering", category: "weapon-property",
    summary: "Break objects more easily and deal maximum damage to them.",
    rules: "You have advantage on Strength checks made to break objects with this weapon. This weapon deals maximum damage to objects.", source: weaponSource,
  },
  "weighted-haft": {
    id: "weighted-haft", name: "Weighted Haft", category: "modification",
    summary: "No penalty beyond the first range increment.",
    rules: "You suffer no penalty for ranged attacks beyond the first range increment.", source: weaponSource,
  },
  wood: {
    id: "wood", name: "Wood", category: "modification",
    summary: "Once per rest, add proficiency to spell healing.",
    rules: "When you restore hit points with a spell, add your proficiency bonus to that healing. Once used, this property cannot be used again until you complete a short rest.", source: weaponSource,
  },
} satisfies Record<string, GameRule>;

export type GameRuleId = keyof typeof gameRules;

export function ruleRef(ruleId: GameRuleId, values?: RuleRef["values"], label?: string): RuleRef {
  return { ruleId, values, label };
}

export function resolveRule(ref: RuleRef): GameRule {
  const rule = gameRules[ref.ruleId as GameRuleId];
  if (!rule) throw new Error(`Unknown rule reference: ${ref.ruleId}`);
  return rule;
}

function interpolate(template: string, values: RuleRef["values"] = {}) {
  return template.replace(/{{(\w+)}}/g, (_, key) => String(values[key] ?? "—"));
}

export function ruleName(ref: RuleRef) {
  const rule = resolveRule(ref);
  if (ref.label) return ref.label;
  if (rule.labelTemplate && ref.values) return interpolate(rule.labelTemplate, ref.values);
  return rule.name;
}

export function ruleText(ref: RuleRef) {
  return interpolate(resolveRule(ref).rules, ref.values);
}
