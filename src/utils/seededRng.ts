// Simple Linear Congruential Generator for reproducible pseudo-random numbers
export class SeededRNG {
  private seed: number;

  constructor(seed: number = 20260926) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  nextFloatDec1(min: number, max: number): number {
    const val = this.nextRange(min, max);
    return Math.round(val * 10) / 10;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }

  choice<T>(arr: T[]): T {
    const idx = this.nextInt(0, arr.length - 1);
    return arr[idx];
  }
}
