import { isSafeUrl } from './safe-url';

describe('isSafeUrl', () => {
  it('пропускает только https', () => {
    expect(isSafeUrl('https://meet.google.com/abc-defg-hij')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(false);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('не ссылка')).toBe(false);
  });
});
