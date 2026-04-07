import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';

function calculatePrime(limit = 100) {
  let count = 0;

  for (let i = 2; i < limit; i++) {
    let isPrime = true;

    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) count++;
  }

  return count;
}

function sortArray(size = 1000) {
  const arr = Array.from({ length: size }, () =>
    Math.floor(Math.random() * size),
  );

  const sorted = arr.sort((a, b) => a - b);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

describe('Worker Service Tests', () => {
  it('should calculate prime numbers', () => {
    const result = calculatePrime(100);

    expect(result).toBeGreaterThan(0);
  });

  it('should hash password using bcrypt', async () => {
    const password = 'test-password';

    const hash = await bcrypt.hash(password, 5);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const match = await bcrypt.compare(password, hash);

    expect(match).toBe(true);
  });

  it('should fail for wrong password', async () => {
    const hash = await bcrypt.hash('correct', 5);

    const match = await bcrypt.compare('wrong', hash);

    expect(match).toBe(false);
  });

  it('should sort array correctly', () => {
    const result = sortArray(100);

    expect(result.min).toBeLessThanOrEqual(result.max);
  });
});
