import { calcDaysAway } from '../src/client/js/app';

describe('calcDaysAway', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-12T12:00:00Z')); // fixed "today"
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('calculates days away correctly', () => {
    expect(calcDaysAway('2026-02-15')).toBe(3);
  });
});
