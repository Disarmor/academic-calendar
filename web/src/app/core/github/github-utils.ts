/** Репозиторий сайта: страница старосты коммитит в него через GitHub API. */
export const GITHUB_REPOSITORY = {
  owner: 'Disarmor',
  repo: 'academic-calendar',
  branch: 'main',
} as const;

export const ANNOUNCEMENTS_FILE_PATH = 'web/public/data/announcements.json';

/** Страница создания fine-grained токена на GitHub. */
export const GITHUB_NEW_TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new';

export function contentsApiUrl(path: string): string {
  const { owner, repo } = GITHUB_REPOSITORY;
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
}

/** Текст → base64 через UTF-8 (`btoa` сам по себе не умеет кириллицу). */
export function encodeBase64Utf8(text: string): string {
  let binary = '';
  for (const byte of new TextEncoder().encode(text)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/** base64 из GitHub API (с переносами строк) → текст в UTF-8. */
export function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

/** Понятное сообщение по HTTP-статусу ответа GitHub API. */
export function githubErrorMessage(status: number): string {
  switch (status) {
    case 0:
      return 'Нет соединения с GitHub. Проверьте интернет и попробуйте ещё раз.';
    case 401:
      return 'Токен не подошёл: он неверный, отозван или истёк.';
    case 403:
      return 'У токена нет прав на запись. Нужен доступ Contents: Read and write к репозиторию academic-calendar.';
    case 404:
      return 'Токен не видит репозиторий academic-calendar. Проверьте, что он выдан на этот репозиторий.';
    case 409:
    case 422:
      return 'Файл объявлений изменился на GitHub после загрузки. Загрузите объявления заново и повторите правки.';
    default:
      return `GitHub ответил ошибкой ${status}. Попробуйте позже.`;
  }
}
