import { db } from "../db";
import { BALANCE_DELTA } from "../types/balance_delta";
import type { Inventory } from "../types/inventory";
import type { transferInfo } from "../types/transfer";
import type { DBUser } from "../types/user";

const getBalance = (id: string): number => {
  let row = db
    .query<DBUser, [string]>("SELECT * FROM users WHERE id = ?")
    .get(id);
  if (row) {
    return row.balance;
  } else {
    createUser(id);
    return 1000;
  }
};
const createUser = (id: string) => {
  let inv: Inventory = [];
  db.run("INSERT INTO users (id, balance, inventory) VALUES (?, ?, ?)", [
    id,
    1000,
    JSON.stringify(inv),
  ]);
};
const setBalance = (id: string, new_balance: number) => {
  try {
    db.run("UPDATE users SET balance = ? WHERE id = ?", [new_balance, id]);
  } catch (err) {
    console.error(err);
  }
};
const changeAmount = (
  id: string,
  balance_delta: BALANCE_DELTA,
  amount: number,
): null | transferInfo => {
  if (balance_delta === BALANCE_DELTA.ADD) {
    let balance = getBalance(id);
    setBalance(id, balance + amount);
    return { before: balance, after: balance + amount };
  } else if (balance_delta === BALANCE_DELTA.REMOVE) {
    let balance = getBalance(id);
    if (balance >= amount) {
      setBalance(id, balance - amount);
      return { before: balance, after: balance - amount };
    } else {
      return null;
    }
  }
  return null;
};
export const UsersController = {
  getBalance,
  createUser,
  setBalance,
  changeAmount,
};
/* INVENTORY */
const getInventory = (id: string): Inventory => {
  let row = db
    .query<DBUser, [string]>("SELECT * FROM users WHERE id = ?")
    .get(id);
  if (row) {
    let inv: Inventory = JSON.parse(row.inventory);
    return inv;
  } else {
    createUser(id);
    return [];
  }
};
const setInventory = (id: string, inv: Inventory) => {
  try {
    db.run("UPDATE users SET inventory = ? WHERE id = ?", [
      JSON.stringify(inv),
      id,
    ]);
  } catch (error) {
    console.error(error);
  }
};
const getInventoryes = (): { id: string; inv: Inventory }[] => {
  let rows = db.prepare("SELECT * FROM users").all();
  let invs: { id: string; inv: Inventory }[] = [];
  // @ts-ignore
  rows.forEach((x: { id: string; inventory: string }) => {
    let parsed: Inventory = [];
    try {
      parsed = JSON.parse(x.inventory);
    } catch (e) {
      console.error(`Failed to parse inventory for user ${x.id}`, e);
    }
    invs.push({
      id: x.id,
      inv: parsed,
    });
  });
  return invs;
};
export const InventoryController = {
  getInventory,
  setInventory,
  getInventoryes,
};
