import React, { useState } from "react";
import { FaFilter } from "react-icons/fa6";


type WeaponInfo = {
  name: SimpleWeapons | AdvancedWeapons
  displayName: string,
  cost: number,
  tree: SimpleWeapons,
  damage: string,
  properties: string[],
  types: string[],
  mods: (WeaponMod | undefined)[]
}

enum SimpleWeapons {
  crystal = "CRYSTAL",
  staff = "STAFF",
  bow = "BOW",
  axe = "AXE",
  club = "CLUB",
  dagger = "DAGGER",
  hammer = "HAMMER",
  longsword = "LONGSWORD",
  shortSword = "SHORT_SWORD",
  spear = "SPEAR"
};

enum AdvancedWeapons {
  labrys = "LABRYS",
  tabarzin = "TABARZIN",
  greatclub = "GREATCLUB",
  dolabra = "DOLABRA",
  pugio = "PUGIO",
  khanjar = "KHANJAR",
  maul = "MAUL",
  thrownHammer = "THROWN_HAMMER",
  warhammer = "WARHAMMER",
  shotel = "SHOTEL",
  spatha = "SPATHA",
  javelin = "JAVELIN",
  doru = "DORU",
  gladus = "GLADUS",
  kopesh = "KOPESH",
  quarterstaff = "QUARTERSTAFF",
  shortbow = "SHORTBOW",
  longbow = "LONGBOW"
}
enum WeaponModsEnum {
  bone = "BONE",
  brutal = "BRUTAL",
  cheap = "CHEAP",
  concealable = "CONCEALABLE",
  crossGuard = "CROSS_GUARD",
  dense = "DENSE",
  dualHead = "DUAL_HEAD",
  empowering = "EMPOWERING",
  fast = "FAST",
  keen = "KEEN",
  metal = "METAL",
  penetrating = "PENETRATING",
  pummeling = "PUMMELING",
  rejuvenating = "REJUVENATING",
  recurve = "RECURVE",
  sauroter = "SAUROTER",
  sundering = "SUNDERING",
  unrelenting = "UNRELENTING",
  volatile = "VOLATILE",
  weightedHaft = "WEIGHTED_HAFT",
  wood = "WOOD",
}
type WeaponMod = {
  name: WeaponModsEnum,
  description: string,
}

const weaponModStringList: string[] = [
  "BONE",
  "BRUTAL",
  "CHEAP",
  "CONCEALABLE",
  "CROSS_GUARD",
  "DENSE",
  "DUAL_HEAD",
  "EMPOWERING",
  "FAST",
  "KEEN",
  "METAL",
  "PENETRATING",
  "PUMMELING",
  "REJUVENATING",
  "RECURVE",
  "SAUROTER",
  "SUNDERING",
  "UNRELENTING",
  "VOLATILE",
  "WEIGHTED_HAFT",
  "WOOD",
]

const weaponMods: Map<WeaponModsEnum, WeaponMod> = new Map([
  [WeaponModsEnum.bone, {
    name: WeaponModsEnum.bone,
    description: "When you score a critical hit you may deal additional damage equal to your proficiency bonus and gain an equal amount of temporary hit points."
  }],
  [WeaponModsEnum.brutal, {
    name: WeaponModsEnum.brutal,
    description: "When rolling damage for a critical hit, if any damage dice roll their highest number you may roll an additional weapon damage die and add the result to your damage."
  }],
  [WeaponModsEnum.cheap, {
    name: WeaponModsEnum.cheap,
    description: "This weapon may be upgraded to advanced or have modifications added for 1/10th of the price."
  }],
  [WeaponModsEnum.concealable, {
    name: WeaponModsEnum.concealable,
    description: "You have advantage on Dexterity (Sleight of Hand) checks made to conceal this weapon."
  }],
  [WeaponModsEnum.crossGuard, {
    name: WeaponModsEnum.crossGuard,
    description: "+1 AC When not using a shield. Does not stack with another Crossguard."
  }],
  [WeaponModsEnum.dense, {
    name: WeaponModsEnum.dense,
    description: "When you score a critical hit, you may add your strength bonus to your damage an additional time."
  }],
  [WeaponModsEnum.dualHead, {
    name: WeaponModsEnum.dualHead,
    description: "When you would deal bludgeoning, slashing or piercing damage you may instead deal a different type of damage. This can only be used on weapons."
  }],
  [WeaponModsEnum.empowering, {
    name: WeaponModsEnum.empowering,
    description: "When you cast a spell using a higher spell slot, if the spell heals hit points or deals damage, increase that amount by the slot you used to cast the spell. This property can only be used on casting foci."
  }],
  [WeaponModsEnum.fast, {
    name: WeaponModsEnum.fast,
    description: "Drawing or stowing this weapon does not require an interaction with an object."
  }],
  [WeaponModsEnum.keen, {
    name: WeaponModsEnum.keen,
    description: "When you score a critical hit you can add your dexterity modifier (minimum 0) to the damage you deal. This can only be used on weapons."
  }],
  [WeaponModsEnum.metal, {
    name: WeaponModsEnum.metal,
    description: "When you deal damage with a spell you may add your proficiency bonus to that damage. Once you do you must complete a short rest before doing it again."
  }],
  [WeaponModsEnum.penetrating, {
    name: WeaponModsEnum.penetrating,
    description: "When you score a critical hit, you may add your proficiency bonus to the damage you deal."
  }],
  [WeaponModsEnum.pummeling, {
    name: WeaponModsEnum.pummeling,
    description: "When you score a critical hit, you may push the target 5 feet away."
  }],
  [WeaponModsEnum.rejuvenating, {
    name: WeaponModsEnum.rejuvenating,
    description: "When you heal another creature, you gain temporary hit points equal to the spell's level."
  }],
  [WeaponModsEnum.recurve, {
    name: WeaponModsEnum.recurve,
    description: "Increase this weapon's range by 50/100."
  }],
  [WeaponModsEnum.sauroter, {
    name: WeaponModsEnum.sauroter,
    description: "If you hit with an opportunity attack, creature's speed becomes 0 until your turn."
  }],
  [WeaponModsEnum.sundering, {
    name: WeaponModsEnum.sundering,
    description: "You have advantage on Strength checks made to break objects with this weapon. This weapon deals maxium damage to objects."
  }],
  [WeaponModsEnum.unrelenting, {
    name: WeaponModsEnum.unrelenting,
    description: "When rolling damage for a critical hit, if any of your damage dice are a 1, you may roll one additional weapon damage die and add the result to your damage."
  }],
  [WeaponModsEnum.volatile, {
    name: WeaponModsEnum.volatile,
    description: "If a spell you cast would deal Acid, Cold, Fire, Lightning, or Thunder damage, you may re-roll one of the damage dice taking the new result."
  }],
  [WeaponModsEnum.weightedHaft, {
    name: WeaponModsEnum.weightedHaft,
    description: "No penalty for ranged attacks beyond the first range increment."
  }],
  [WeaponModsEnum.wood, {
    name: WeaponModsEnum.wood,
    description: "When you heal hit points with a spell, you may add your proficiency bonus to that healing. Once you do so you must complete a short rest before doing it again."
  }],
])

function weaponEnumToString(weapon: SimpleWeapons | AdvancedWeapons | WeaponModsEnum | string): string {
  return (weapon.charAt(0) + weapon.toLocaleLowerCase().substring(1)).replace(/_/g, " ");
}
const simpleWeapons: Array<WeaponInfo> = [
  {
    name: SimpleWeapons.crystal,
    displayName: "Crystal",
    cost: 25,
    damage: "-",
    tree: SimpleWeapons.crystal,
    properties: ["VOLATILE"],
    types: ["SIMPLE", "FOCUS"],
    mods: [
      weaponMods.get(WeaponModsEnum.bone),
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.metal)
    ]
  },
  {
    name: SimpleWeapons.staff,
    displayName: "Staff",
    tree: SimpleWeapons.staff,
    cost: 25,
    damage: "1d6 b",
    properties: ["EMPOWERING"],
    types: ["SIMPLE", "FOCUS"],
    mods: [
      weaponMods.get(WeaponModsEnum.bone),
      weaponMods.get(WeaponModsEnum.wood),
      weaponMods.get(WeaponModsEnum.concealable)
    ]
  },
  {
    name: SimpleWeapons.bow,
    displayName: "Bow",
    tree: SimpleWeapons.bow,
    cost: 25,
    damage: "1d6 p",
    properties: ["AMMUNITION (range 80/320)", "TWO_HANDED"],
    types: ["SIMPLE", "RANGED"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: SimpleWeapons.axe,
    displayName: "Axe",
    tree: SimpleWeapons.axe,
    cost: 10,
    damage: "1d8 s",
    properties: ["VERSATILE (1d10)"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: SimpleWeapons.club,
    displayName: "Club",
    tree: SimpleWeapons.club,
    cost: 0.1,
    damage: "1d4 b",
    properties: ["Cheap (See Cost)"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.bone),
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.wood)
    ]
  },
  {
    name: SimpleWeapons.dagger,
    displayName: "Dagger",
    tree: SimpleWeapons.dagger,
    cost: 2,
    damage: "1d4 p",
    properties: ["FINESSE", "LIGHT", "THROWN (range 20/60)"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: SimpleWeapons.hammer,
    displayName: "Hammer",
    tree: SimpleWeapons.hammer,
    cost: 15,
    damage: "1d8 b",
    properties: ["VERSATILE (1d10)"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sundering)
    ]
  },
  {
    name: SimpleWeapons.longsword,
    displayName: "Longsword",
    tree: SimpleWeapons.longsword,
    cost: 15,
    damage: "1d8 s",
    properties: ["VERSATILE (1d10)"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: SimpleWeapons.shortSword,
    displayName: "Short Sword",
    tree: SimpleWeapons.shortSword,
    cost: 10,
    damage: "1d6 s",
    properties: ["FINESSE", "LIGHT"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: SimpleWeapons.spear,
    displayName: "Spear",
    tree: SimpleWeapons.spear,
    cost: 1,
    damage: "1d6 p",
    properties: ["THROWN (range 20/60)", "VERSATILE (1d8)"],
    types: ["SIMPLE", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating),
      weaponMods.get(WeaponModsEnum.weightedHaft)
    ]
  }
]

const advancedWeapons: Array<WeaponInfo> = [
  {
    name: AdvancedWeapons.labrys,
    displayName: "Labrys",
    tree: SimpleWeapons.axe,
    cost: 60,
    damage: "1d12 s",
    properties: ["HEAVY", "TWO_HANDED"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: AdvancedWeapons.tabarzin,
    displayName: "Tabarzin",
    tree: SimpleWeapons.axe,
    cost: 60,
    damage: "1d8 s",
    properties: ["BRUTAL", "VERSATILE (1d10)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: AdvancedWeapons.greatclub,
    displayName: "Greatclub",
    tree: SimpleWeapons.club,
    cost: 5,
    damage: "1d6 b",
    properties: ["VERSATILE (1d8)", "Cheap (See Cost)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.bone),
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.wood)
    ]
  },
  {
    name: AdvancedWeapons.dolabra,
    displayName: "Dolabra",
    tree: SimpleWeapons.axe,
    cost: 60,
    damage: "1d6 s",
    properties: ["LIGHT", "THROWN (30/90)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: AdvancedWeapons.pugio,
    displayName: "Pugio",
    tree: SimpleWeapons.dagger,
    cost: 52,
    damage: "1d4 p",
    properties: ["FINESSE", "LIGHT", "VERSATILE (1d6)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: AdvancedWeapons.khanjar,
    displayName: "Khanjar",
    tree: SimpleWeapons.dagger,
    cost: 52,
    damage: "1d4 p",
    properties: ["FAST", "FINESSE", "BRUTAL", "LIGHT", "THROWN (range 20/60)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating),
    ]
  },
  {
    name: AdvancedWeapons.maul,
    displayName: "Maul",
    tree: SimpleWeapons.hammer,
    cost: 65,
    damage: "2d6 b",
    properties: ["HEAVY", "TWO_HANDED"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sundering)
    ]
  },
  {
    name: AdvancedWeapons.thrownHammer,
    displayName: "THROWN Hammer",
    tree: SimpleWeapons.hammer,
    cost: 65,
    damage: "1d6 b",
    properties: ["LIGHT", "THROWN (range 20/60)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sundering)
    ]
  },
  {
    name: AdvancedWeapons.warhammer,
    displayName: "Warhammer",
    tree: SimpleWeapons.hammer,
    cost: 65,
    damage: "1d8 b",
    properties: ["VERSATILE (1d10)", "UNRELENTING"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sundering)
    ]
  },
  {
    name: AdvancedWeapons.shotel,
    displayName: "Shotel",
    tree: SimpleWeapons.longsword,
    cost: 65,
    damage: "2d6 s",
    properties: ["TWO_HANDED", "HEAVY"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.penetrating),
    ]
  },
  {
    name: AdvancedWeapons.spatha,
    displayName: "Spatha",
    tree: SimpleWeapons.longsword,
    cost: 65,
    damage: "2d4 s",
    properties: ["VERSATILE (1d6 + 1d4)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: AdvancedWeapons.javelin,
    displayName: "Javelin",
    tree: SimpleWeapons.spear,
    cost: 51,
    damage: "1d6 p",
    properties: ["REACH", "VERSATILE (1d8)", "THROWN (range 40/120)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating),
      weaponMods.get(WeaponModsEnum.weightedHaft)
    ]
  },
  {
    name: AdvancedWeapons.doru,
    displayName: "Doru",
    tree: SimpleWeapons.spear,
    cost: 51,
    damage: "1d8 p",
    properties: ["REACH", "THROWN (20/60)", "VERSATILE (Heavy, 1d10)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating),
      weaponMods.get(WeaponModsEnum.weightedHaft)
    ]
  },
  {
    name: AdvancedWeapons.gladus,
    displayName: "Gladus",
    tree: SimpleWeapons.shortSword,
    cost: 60,
    damage: "1d6 s",
    properties: ["FINESSE", "VERSATILE (1d8)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: AdvancedWeapons.kopesh,
    displayName: "Kopesh",
    tree: SimpleWeapons.shortSword,
    cost: 60,
    damage: "1d6 s",
    properties: ["FAST", "FINESSE", "LIGHT"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.crossGuard),
      weaponMods.get(WeaponModsEnum.concealable),
      weaponMods.get(WeaponModsEnum.keen),
      weaponMods.get(WeaponModsEnum.penetrating)
    ]
  },
  {
    name: AdvancedWeapons.quarterstaff,
    displayName: "Quarterstaff",
    tree: SimpleWeapons.club,
    cost: 5,
    damage: "1d8 b",
    properties: ["HEAVY", "VERSATILE (1d10)", "Cheap (See Cost)"],
    types: ["ADVANCED", "MELEE"],
    mods: [
      weaponMods.get(WeaponModsEnum.bone),
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.wood)
    ]
  },
  {
    name: AdvancedWeapons.shortbow,
    displayName: "Shortbow",
    tree: SimpleWeapons.bow,
    cost: 75,
    damage: "1d6 p",
    properties: ["AMMUNITION (range 80/320)", "TWO_HANDED", "FAST"],
    types: ["ADVANCED", "RANGED"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: AdvancedWeapons.longbow,
    displayName: "Longbow",
    tree: SimpleWeapons.bow,
    cost: 75,
    damage: "1d8 p",
    properties: ["AMMUNITION (range 150/600)", "TWO_HANDED"],
    types: ["ADVANCED", "RANGED"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  }
]

const weapons: Array<WeaponInfo> = simpleWeapons.concat(advancedWeapons);

const weaponPropertiesStringList: string[] = weapons.flatMap((weapon) => weapon.properties)
  .reduce((unique: string[], item: string) =>
    unique.includes(item) ? unique : [...unique, item], []);

const weaponTypesStringList: string[] = weapons.flatMap((weapon) => weapon.types)
  .reduce((unique: string[], item: string) =>
    unique.includes(item) ? unique : [...unique, item], []);

type WeaponsBuilderFilter = {
  weaponName: string,
  weaponCost: number,
  weaponTree: SimpleWeapons | AdvancedWeapons | undefined,
  weaponDamage: string,
  weaponProperties: string[],
  weaponTypes: string[],
  weaponMods: string[]
}

function weaponMatchesFilter(weapon: WeaponInfo, filter: WeaponsBuilderFilter): boolean {
  return (
    (filter.weaponName ? weapon.displayName.toLocaleLowerCase().includes(filter.weaponName) : true) &&
    (filter.weaponCost ? weapon.cost === filter.weaponCost : true) &&
    (filter.weaponTree ? weapon.tree === filter.weaponTree : true) &&
    (filter.weaponDamage ? weapon.damage === filter.weaponDamage : true) &&
    (filter.weaponProperties
      && filter.weaponProperties.length > 0
      ? filter.weaponProperties.every((property) => weapon.properties.includes(property))
      : true) &&
    (filter.weaponTypes
      && filter.weaponTypes.length > 0
      ? filter.weaponTypes.every((type) => weapon.types.includes(type))
      : true) &&
    (filter.weaponMods
      && filter.weaponMods.length > 0
      ? weapon.mods.map((mod) => mod?.name).some((mod) => filter.weaponMods.includes(mod || ""))
      : true)
  )
}

function weaponModsFilterToButtons(filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>>): JSX.Element {
  if (filter.weaponMods === undefined || filter.weaponMods.length == 0) {
    return <div>Mods</div>
  }
  return (
    <div className="flex">{
      filter.weaponMods.map((mod) => {
        return <button className="btn rounded-box" onClick={(e) => {
          setFilter({
            ...filter,
            weaponMods: filter.weaponMods?.filter((m) => m != mod)
          })
        }}>{weaponEnumToString(mod)}</button>
      })
    }</div>
  )
}

function weaponPropertiesFilterToButtons(filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>>): JSX.Element {
  if (filter.weaponProperties === undefined || filter.weaponProperties.length == 0) {
    return <div>Properties</div>
  }
  return (
    <div className="flex">{
      filter.weaponProperties.map((property) => {
        return <button className="btn rounded-box" onClick={(e) => {
          setFilter({
            ...filter,
            weaponProperties: filter.weaponProperties?.filter((p) => p != property)
          })
        }}>{property}</button>
      })
    }</div>
  )
}

function weaponTypesFilterToButtons(filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>>): JSX.Element {
  if (filter.weaponTypes === undefined || filter.weaponTypes.length == 0) {
    return <div>Types</div>
  }
  return (
    <div className="flex">{
      filter.weaponTypes.map((type) => {
        return <button className="btn rounded-box" onClick={(e) => {
          setFilter({
            ...filter,
            weaponTypes: filter.weaponTypes?.filter((t) => t != type)
          })
        }}>{type}</button>
      })
    }</div>
  )
}

function modToHover(mod: WeaponMod | undefined): JSX.Element {
  if (!mod) {
    return <div key={"empty"}></div>
  }
  return (
    <div key={mod.name.toLowerCase()} className="dropdown dropdown-hover dropdown-left dropdown-top">
      <div tabIndex={0} role="button" className="badge badge-outline m-1">{weaponEnumToString(mod.name)}</div>
      <div tabIndex={0} className="dropdown-content menu bg-base-100 z-[1] w-52 p-2 shadow">
        <div>{mod.description}</div>
      </div>
    </div>
  )
}

function NameFilter({ filter, setFilter }: { filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>> }) {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-40 h-[48px] px-4 py-0"
        value={filter.weaponName || ''}
        onChange={(e) => setFilter({
          ...filter,
          weaponName: e.target.value.toLowerCase()
        })}
      />
    </div>
  );
}

function TreeFilter({ filter, setFilter }: { filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>> }) {
  return (
    <div className="dropdown dropdown-hover">
      <label tabIndex={0} className="btn btn-outline w-34">
        {filter.weaponTree ? weaponEnumToString(filter.weaponTree) : "Tree"}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </label>
      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-lg w-52">
        <div className="h-48 py-2 overflow-y-auto">
          {Object.values(SimpleWeapons).map((tree) => (
            <li key={tree}>
              <a onClick={() => setFilter({ ...filter, weaponTree: tree as SimpleWeapons })}>{weaponEnumToString(tree)}</a>
            </li>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600">
          <li><a onClick={() => setFilter({ ...filter, weaponTree: undefined })}>Clear</a></li>
        </div>
      </ul>
    </div>
  );
}

function PropertiesFilter({ filter, setFilter }: { filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>> }) {
  return (
    <div className="dropdown dropdown-hover">
      <label tabIndex={0} className="btn btn-outline w-34">
        Properties
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </label>
      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-lg w-52">
        <div className="h-48 py-2 overflow-y-auto">
          {weaponPropertiesStringList.map((property) => (
            <li key={property}>
              <a onClick={() => setFilter({
                ...filter,
                weaponProperties: (filter.weaponProperties ? [...filter.weaponProperties, property] : [property])
              })}>{weaponEnumToString(property)}</a>
            </li>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600">
          <li><a onClick={() => setFilter({ ...filter, weaponProperties: [] })}>Clear</a></li>
        </div>
      </ul>
    </div>
  );
}

function TypesFilter({ filter, setFilter }: { filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>> }) {
  return (
    <div className="dropdown dropdown-hover ">
      <label tabIndex={0} className="btn btn-outline w-34">
        Types
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </label>
      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-lg w-52">
        <div className="h-48 py-2 overflow-y-auto">
          {weaponTypesStringList.map((type) => (
            <li key={type}>
              <a onClick={() => setFilter({
                ...filter,
                weaponTypes: (filter.weaponTypes ? [...filter.weaponTypes, type] : [type])
              })}>{weaponEnumToString(type)}</a>
            </li>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600">
          <li><a onClick={() => setFilter({ ...filter, weaponTypes: [] })}>Clear</a></li>
        </div>
      </ul>
    </div>
  );
}

function ModsFilter({ filter, setFilter }: { filter: WeaponsBuilderFilter, setFilter: React.Dispatch<React.SetStateAction<WeaponsBuilderFilter>> }) {
  return (
    <div className="dropdown dropdown-hover ">
      <label tabIndex={0} className="btn btn-outline w-34">
        Mods
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </label>
      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-lg w-52">
        <div className="h-48 py-2 overflow-y-auto">
          {weaponModStringList.map((name) => (
            <li key={name}>
              <a onClick={() => setFilter({
                ...filter,
                weaponMods: (filter.weaponMods ? [...filter.weaponMods, name] : [name])
              })}>{weaponEnumToString(name)}</a>
            </li>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600">
          <li><a onClick={() => setFilter({ ...filter, weaponMods: [] })}>Clear</a></li>
        </div>
      </ul>
    </div>
  );
}

function WeaponCard({ weapon }: { weapon: WeaponInfo }) {
  return (
    <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
      <div className="collapse-title text-xl font-medium flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>{weapon.displayName}</span>
          <span className="text-sm text-gray-500">({weaponEnumToString(weapon.tree)})</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="badge badge-outline">{weapon.types.join(", ")}</span>
          <span>{weapon.damage}</span>
          <span>{weapon.cost} gp</span>
        </div>
      </div>
      <div className="collapse-content">
        <div className="mt-2">
          <p><b>Properties:</b> {weapon.properties.map(p => weaponEnumToString(p)).join(", ")}</p>
        </div>
        <div className="mt-2">
          <p><b>Available Mods:</b> {weapon.mods?.map(mod => modToHover(mod))}</p>
        </div>
      </div>
    </div>
  );
}

function WeaponsBuilder() {
  const [filter, setFilter] = React.useState<WeaponsBuilderFilter>({} as WeaponsBuilderFilter);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredWeapons = weapons.filter((weapon) => weaponMatchesFilter(weapon, filter));

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-base-100 shadow-md">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Weapons</h1>
          <button
            className="btn btn-circle btn-outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter />
          </button>
        </div>
        {isFilterOpen && (
          <div className="p-4 bg-base-200 border-t border-b">
            <div className="flex flex-wrap gap-2 items-center">
              <span><NameFilter filter={filter} setFilter={setFilter} /></span>
              <span><TreeFilter filter={filter} setFilter={setFilter} /></span>
              <span><PropertiesFilter filter={filter} setFilter={setFilter} /></span>
              <span><TypesFilter filter={filter} setFilter={setFilter} /></span>
              <span><ModsFilter filter={filter} setFilter={setFilter} /></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {filteredWeapons.sort((a, b) => a.name.localeCompare(b.name)).map((weapon) => (
            <WeaponCard key={weapon.name} weapon={weapon} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeaponsBuilder;
