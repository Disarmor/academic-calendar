import { DaysUntilPipe } from './days-until-pipe';

describe('DaysUntilPipe', () => {
  const pipe = new DaysUntilPipe();

  it('склоняет «день» по-русски', () => {
    expect(pipe.transform(0)).toBe('сегодня');
    expect(pipe.transform(1)).toBe('завтра');
    expect(pipe.transform(2)).toBe('через 2 дня');
    expect(pipe.transform(5)).toBe('через 5 дней');
    expect(pipe.transform(11)).toBe('через 11 дней');
    expect(pipe.transform(21)).toBe('через 21 день');
    expect(pipe.transform(24)).toBe('через 24 дня');
    expect(pipe.transform(112)).toBe('через 112 дней');
  });
});
