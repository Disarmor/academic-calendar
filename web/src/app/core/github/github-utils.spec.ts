import { decodeBase64Utf8, encodeBase64Utf8, githubErrorMessage } from './github-utils';

describe('base64 UTF-8', () => {
  it('кодирует кириллицу и раскодирует ответ GitHub с переносами строк', () => {
    const text = '{"title":"Собрание — в 2/410"}\n';
    const encoded = encodeBase64Utf8(text);
    expect(decodeBase64Utf8(encoded)).toBe(text);
    expect(decodeBase64Utf8(`${encoded.slice(0, 10)}\n${encoded.slice(10)}`)).toBe(text);
  });
});

describe('githubErrorMessage', () => {
  it('объясняет типичные ошибки', () => {
    expect(githubErrorMessage(401)).toContain('Токен не подошёл');
    expect(githubErrorMessage(409)).toContain('Загрузите объявления заново');
    expect(githubErrorMessage(500)).toContain('500');
  });
});
