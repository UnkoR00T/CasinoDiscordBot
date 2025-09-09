type Inventory = Array<InventoryItem>;
type InventoryItem = { item: Item; quantity: number };
type Item = {
  name: string;
  displayname: string;
  description: string;
  price: number;
  min: number;
  max: number;
};
export const ITEMS = {
  SMALL_SHOP: {
    name: "small_shop",
    displayname: "Small Local Store",
    description:
      "Small local store. Gives u passive income in range from 50k to 250k an hour.",
    price: 1_000_000,
    min: 50_000,
    max: 250_000,
  },
  BIG_SHOP: {
    name: "big_shop",
    displayname: "Big supermarket",
    description:
      "Big supermarket few time bigger then one shop. Gives more money too. From 200k to 550k an hour.",
    price: 2_500_000,
    min: 200_000,
    max: 250_000,
  },
  STRIPCLUB: {
    name: "stripclub",
    displayname: "Stripclub",
    description:
      "A stripclub with some nice goths. Gives a lot of money. From 225k to 750k an hour.",
    price: 3_000_000,
    min: 225_000,
    max: 750_000,
  },
} satisfies Record<string, Item>;
type ItemKey = keyof typeof ITEMS;
type ItemDef = (typeof ITEMS)[ItemKey];
export function getItemByName(name: string): ItemDef | undefined {
  return Object.values(ITEMS).find((job) => job.name === name);
}
export type { ItemKey, ItemDef, Item, InventoryItem, Inventory };
