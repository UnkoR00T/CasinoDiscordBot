import { db } from "../db";
import { BALANCE_DELTA } from "../types/balance_delta";
import type { transferInfo } from "../types/transfer";
import type { DBUser } from "../types/user";

const getBalance = (id: string): number => {
  let row = db
    .query<DBUser, [string]>("SELECT balance FROM users WHERE id = ?")
    .get(id);
  if (row) {
    return row.balance;
  } else {
    createUser(id);
    return 1000;
  }
};
const createUser = (id: string) => {
  db.run("INSERT INTO users (id, balance) VALUES (?, ?)", [id, 1000]);
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
