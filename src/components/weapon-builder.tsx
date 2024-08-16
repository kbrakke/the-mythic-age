import React from "react";
import { FaCaretDown } from "react-icons/fa6";


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
    properties: ["volatile"],
    types: ["Simple", "Focus"],
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
    properties: ["empowering"],
    types: ["Simple", "Focus"],
    mods: [
      weaponMods.get(WeaponModsEnum.bone),
      weaponMods.get(WeaponModsEnum.wood),
      weaponMods.get(WeaponModsEnum.wood)
    ]
  },
  {
    name: SimpleWeapons.bow,
    displayName: "Bow",
    tree: SimpleWeapons.bow,
    cost: 25,
    damage: "1d6 p",
    properties: ["Ammunition (range 80/320)", "Two-Handed"],
    types: ["Simple", "Ranged"],
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
    properties: ["Versatile (1d10)"],
    types: ["Simple", "Melee"],
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
    types: ["Simple", "Melee"],
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
    properties: ["Finesse", "Light", "Thrown (range 20/60)"],
    types: ["Simple", "Melee"],
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
    properties: ["Versatile (1d10)"],
    types: ["Simple", "Melee"],
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
    properties: ["Versatile (1d10)"],
    types: ["Simple", "Melee"],
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
    properties: ["Finesse", "Light"],
    types: ["Simple", "Melee"],
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
    properties: ["Thrown (range 20/60)", "Versatile (1d8)"],
    types: ["Simple", "Melee"],
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
    properties: ["Heavy", "Two Handed"],
    types: ["Advanced", "Melee"],
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
    properties: ["Brutal", "Versatile (1d10)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Versatile (1d8)", "Cheap (See Cost)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Light", "Thrown (30/90)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Finesse", "Light", "Versatile (1d6)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Fast", "Finesse", "Brutal", "Light", "Thrown (range 20/60)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Heavy", "Two Handed"],
    types: ["Advanced", "Melee"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sundering)
    ]
  },
  {
    name: AdvancedWeapons.thrownHammer,
    displayName: "Thrown Hammer",
    tree: SimpleWeapons.hammer,
    cost: 65,
    damage: "1d6 b",
    properties: ["Light", "Thrown (range 20/60)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Versatile (1d10)", "Unrelenting"],
    types: ["Advanced", "Melee"],
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
    properties: ["Two Handed", "Heavy"],
    types: ["Advanced", "Melee"],
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
    properties: ["Versatile (1d6 + 1d4)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Reach", "Versatile (1d8)", "Thrown (range 40/120)"],
    types: ["Advanced", "Melee"],
    mods: [
      weaponMods.get(WeaponModsEnum.dualHead),
      weaponMods.get(WeaponModsEnum.sauroter),
      weaponMods.get(WeaponModsEnum.penetrating),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  },
  {
    name: AdvancedWeapons.doru,
    displayName: "Doru",
    tree: SimpleWeapons.spear,
    cost: 51,
    damage: "1d8 p",
    properties: ["Reach", "Thrown (20/60)", "Versatile (Heavy, 1d10)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Finesse", "Versatile (1d8)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Fast", "Finesse", "Light"],
    types: ["Advanced", "Melee"],
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
    properties: ["Heavy", "Versatile (1d10)", "Cheap (See Cost)"],
    types: ["Advanced", "Melee"],
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
    properties: ["Ammunition (range 80/320)", "Two-Handed", "Fast"],
    types: ["Advanced", "Ranged"],
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
    properties: ["Ammunition (range 150/600)", "Two-Handed"],
    types: ["Advanced", "Ranged"],
    mods: [
      weaponMods.get(WeaponModsEnum.dense),
      weaponMods.get(WeaponModsEnum.recurve),
      weaponMods.get(WeaponModsEnum.weightedHaft),
    ]
  }
]

const weapons: Array<WeaponInfo> = simpleWeapons.concat(advancedWeapons);

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
    (filter.weaponProperties ? weapon.properties.every((property) => filter.weaponProperties.includes(property)) : true) &&
    (filter.weaponTypes ? weapon.types.every((type) => filter.weaponTypes.includes(type)) : true) &&
    (filter.weaponMods ? weapon.mods.every((mod) => filter.weaponMods.includes(mod?.name || "")) : true)
  )
}

function modToHover(mod: WeaponMod | undefined): JSX.Element {
  if (!mod) {
    return <div></div>
  }
  return (
    <div className="dropdown dropdown-hover dropdown-right">
      <div tabIndex={0} role="button" className="btn btn-ghost">{weaponEnumToString(mod.name)}</div>
      <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li className="menu-title">{mod.description}</li>
      </div>
    </div>
  )
}

function WeaponsBuilder() {
  const [weaponName, setWeaponName] = React.useState<String>();
  const [filter, setFilter] = React.useState<WeaponsBuilderFilter>({} as WeaponsBuilderFilter);
  return (
    <div>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>
            <label className="input input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Weapon Name" onChange={(e) => setFilter({
                ...filter,
                weaponName: e.target.value.toLocaleLowerCase()
              })}/>
            </label>
            </th>
            <th>Cost</th>
            <th>
              <div className="dropdown dropdown-hover dropdown-right">
                <div tabIndex={0} role="button" className="btn btn-ghost">Tree<FaCaretDown /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  {simpleWeapons.map((weapon) => {
                    return (
                      <li key={weapon.name} className="menu-title"><button className="btn btn-ghost" onClick={(e) => setFilter({
                        ...filter,
                        weaponTree: weapon.tree
                      })}>{weaponEnumToString(weapon.tree)}</button></li>
                    )
                  })}
                  {<li className="menu-title"><button className="btn btn-ghost" onClick={(e) => setFilter({
                    ...filter,
                    weaponTree: undefined
                  })}>Clear</button></li>}
                </ul>
              </div>
            </th>
            <th>Damage</th>
            <th>Properties</th>
            <th>Types</th>
            <th>Mods</th>
          </tr>
        </thead>
        <tbody>
          {weapons.filter((weapon) => weaponMatchesFilter(weapon, filter)).map((weapon) => {
            return (
              <tr key={weapon.name}>
                <td>{weaponEnumToString(weapon.name)}</td>
                <td>{weapon.cost}</td>
                <td>{weaponEnumToString(weapon.tree)}</td>
                <td>{weapon.damage}</td>
                <td>{weapon.properties.join(", ")}</td>
                <td>{weapon.types.join(", ")}</td>
                <td>{weapon.mods?.map(mod => modToHover(mod))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WeaponsBuilder;