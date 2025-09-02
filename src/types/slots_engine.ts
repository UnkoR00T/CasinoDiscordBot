export type SymbolId = string;

export interface PaytableEntry {
  [count: number]: number;
}

export interface Paytable {
  [symbol: SymbolId]: PaytableEntry;
}

export interface Payline {
  positions: [number, number, number, number, number];
  id: number;
}

export interface SpinOptions {
  betPerLine: number;
  lines: number;
}

export interface SpinResult {
  window: SymbolId[][];
  totalWin: number;
  lineWins: Array<{
    lineId: number;
    count: number;
    symbol: SymbolId;
    payout: number;
    positions: Array<{ x: number; y: number }>;
  }>;
  scatterWin?: {
    symbol: SymbolId;
    count: number;
    payout: number;
    positions: Array<{ x: number; y: number }>;
  };
}

export interface SlotEngineConfig {
  reels: SymbolId[][];
  paylines: Payline[];
  paytable: Paytable;
  wild?: SymbolId;
  scatter?: SymbolId;
  scatterPays?: PaytableEntry;
  rng?: () => number;
}

export const DEFAULT_PAYLINES: Payline[] = [
  { id: 1, positions: [1, 1, 1, 1, 1] },
  { id: 2, positions: [0, 0, 0, 0, 0] },
  { id: 3, positions: [2, 2, 2, 2, 2] },
  { id: 4, positions: [0, 1, 2, 1, 0] },
  { id: 5, positions: [2, 1, 0, 1, 2] },
];

export const S = {
  CHERRY: "🍒" as SymbolId,
  LEMON: "🍋" as SymbolId,
  ORANGE: "🍊" as SymbolId,
  PLUM: "🍇" as SymbolId,
  SEVEN: "7️⃣" as SymbolId,
  STAR: "⭐" as SymbolId,
  WILD: "🃏" as SymbolId,
};

export const DEFAULT_PAYTABLE: Paytable = {
  [S.CHERRY]: { 3: 2, 4: 5, 5: 10 },
  [S.LEMON]: { 3: 2, 4: 5, 5: 10 },
  [S.ORANGE]: { 3: 3, 4: 7, 5: 15 },
  [S.PLUM]: { 3: 4, 4: 10, 5: 20 },
  [S.SEVEN]: { 3: 5, 4: 15, 5: 30 },
  [S.WILD]: { 3: 5, 4: 15, 5: 30 },
};

export const DEFAULT_SCATTER_PAYS: PaytableEntry = { 3: 1, 4: 1, 5: 1 };

export const DEFAULT_REELS: SymbolId[][] = [
  [
    S.CHERRY,
    S.LEMON,
    S.WILD,
    S.ORANGE,
    S.PLUM,
    S.SEVEN,
    S.CHERRY,
    S.LEMON,
    S.STAR,
    S.ORANGE,
    S.PLUM,
    S.CHERRY,
  ],
  [
    S.LEMON,
    S.ORANGE,
    S.PLUM,
    S.SEVEN,
    S.WILD,
    S.CHERRY,
    S.STAR,
    S.ORANGE,
    S.PLUM,
    S.LEMON,
    S.CHERRY,
    S.PLUM,
  ],
  [
    S.ORANGE,
    S.PLUM,
    S.CHERRY,
    S.WILD,
    S.LEMON,
    S.SEVEN,
    S.ORANGE,
    S.STAR,
    S.PLUM,
    S.CHERRY,
    S.LEMON,
    S.ORANGE,
  ],
  [
    S.PLUM,
    S.CHERRY,
    S.LEMON,
    S.ORANGE,
    S.WILD,
    S.SEVEN,
    S.PLUM,
    S.LEMON,
    S.STAR,
    S.CHERRY,
    S.ORANGE,
    S.PLUM,
  ],
  [
    S.SEVEN,
    S.LEMON,
    S.ORANGE,
    S.PLUM,
    S.CHERRY,
    S.WILD,
    S.ORANGE,
    S.PLUM,
    S.LEMON,
    S.STAR,
    S.CHERRY,
    S.ORANGE,
  ],
];

function defaultRng(): number {
  return Math.random();
}

export class FiveByThreeSlot {
  private reels: SymbolId[][];
  private paylines: Payline[];
  private paytable: Paytable;
  private wild?: SymbolId;
  private scatter?: SymbolId;
  private scatterPays?: PaytableEntry;
  private rng: () => number;

  constructor(cfg: SlotEngineConfig) {
    this.reels = cfg.reels;
    this.paylines = cfg.paylines;
    this.paytable = cfg.paytable;
    this.wild = cfg.wild;
    this.scatter = cfg.scatter;
    this.scatterPays = cfg.scatterPays;
    this.rng = cfg.rng ?? defaultRng;
  }

  spin(opts: SpinOptions): SpinResult {
    const window = this.rollWindow();
    const lineWins = this.evaluateLineWins(window, opts);
    const scatterWin = this.evaluateScatter(window, opts);
    let totalWin = lineWins.reduce((a, w) => a + w.payout, 0);
    if (scatterWin) totalWin += scatterWin.payout;
    //@ts-ignore
    return { window, totalWin, lineWins, scatterWin };
  }

  renderWindow(win: SymbolId[][]): string {
    return Array.from({ length: 3 }, (_, y) =>
      win.map((r) => r[y]).join(" "),
    ).join("\n");
  }

  private rollWindow(): SymbolId[][] {
    // @ts-ignore
    return this.reels.map((reel) => {
      const start = Math.floor(this.rng() * reel.length);
      return Array.from(
        { length: 3 },
        (_, y) => reel[(start + y) % reel.length],
      );
    });
  }

  private evaluateLineWins(window: SymbolId[][], opts: SpinOptions) {
    return this.paylines
      .slice(0, opts.lines)
      .map((line) => {
        // @ts-ignore
        const first = window[0][line.positions[0]];
        let count = 1;
        for (let x = 1; x < 5; x++) {
          // @ts-ignore
          const sym = window[x][line.positions[x]];
          // @ts-ignore
          if (this.matches(first, sym)) count++;
          else break;
        }
        // @ts-ignore
        const payout = (this.paytable[first]?.[count] ?? 0) * opts.betPerLine;
        return {
          lineId: line.id,
          count,
          symbol: first,
          payout,
          positions: Array.from({ length: count }, (_, i) => ({
            x: i,
            y: line.positions[i],
          })),
        };
      })
      .filter((w) => w.payout > 0);
  }

  private matches(base: SymbolId, sym: SymbolId) {
    if (this.wild && (base === this.wild || sym === this.wild)) return true;
    if (this.scatter && (base === this.scatter || sym === this.scatter))
      return base === sym;
    return base === sym;
  }

  private evaluateScatter(window: SymbolId[][], opts: SpinOptions) {
    if (!this.scatter || !this.scatterPays) return undefined;
    const positions: { x: number; y: number }[] = [];
    let count = 0;
    for (let x = 0; x < 5; x++)
      for (let y = 0; y < 3; y++)
        // @ts-ignore
        if (window[x][y] === this.scatter) {
          positions.push({ x, y });
          count++;
        }
    const payout = (this.scatterPays[count] ?? 0) * opts.betPerLine;
    return payout > 0
      ? { symbol: this.scatter, count, payout, positions }
      : undefined;
  }
}
export const DEFAULT_SLOT_ENGINE = new FiveByThreeSlot({
  reels: DEFAULT_REELS,
  paylines: DEFAULT_PAYLINES,
  paytable: DEFAULT_PAYTABLE,
  wild: S.WILD,
  scatter: S.STAR,
  scatterPays: DEFAULT_SCATTER_PAYS,
});
