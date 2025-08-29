export const DICE_TYPES = {
  HALF: {
    name: "half",
    displayname: "50% - x1.5 return.",
    chance: 50,
    mult: 1.5,
  },
  FORTY: {
    name: "forty",
    displayname: "40% - x1.75 return.",
    chance: 40,
    mult: 1.75,
  },
  THIRTY: {
    name: "thirty",
    displayname: "30% - x2 return.",
    chance: 30,
    mult: 2,
  },
  TWENTY: {
    name: "twenty",
    displayname: "20% - x4 return.",
    chance: 20,
    mult: 4,
  },
} satisfies Record<
  string,
  { name: string; displayname: string; chance: number; mult: number }
>;

export type DiceKey = keyof typeof DICE_TYPES;
export type DiceDef = (typeof DICE_TYPES)[DiceKey];
export function getDiceByName(name: string): DiceDef | undefined {
  return Object.values(DICE_TYPES).find((dice) => dice.name === name);
}
