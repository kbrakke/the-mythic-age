import { monsterWeapons } from "./monster-weapon-data";

export type TreeBuildPreset = { monsterId: string; treeName: string; tier: number };

export const treeSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function resolveTreeBuild(search: string): TreeBuildPreset | undefined {
  const params = new URLSearchParams(search);
  const monster = monsterWeapons.find((item) => item.id === params.get("monster"));
  const tree = monster?.trees.find((item) => treeSlug(item.name) === params.get("tree"));
  if (!monster || !tree || !tree.tiers.length) return undefined;
  const requestedTier = Number(params.get("tier") ?? 1);
  const tier = tree.tiers.find((item) => item.rank === requestedTier)?.rank ?? tree.tiers[0].rank;
  return { monsterId: monster.id, treeName: tree.name, tier };
}
