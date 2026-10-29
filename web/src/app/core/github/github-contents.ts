import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { contentsApiUrl, decodeBase64Utf8, encodeBase64Utf8, GITHUB_REPOSITORY, githubErrorMessage } from './github-utils';

/** Файл из репозитория вместе с его `sha`, без которого GitHub не примет изменение. */
export interface RepositoryFile {
  readonly text: string;
  readonly sha: string;
}

interface ContentsResponse {
  readonly content: string;
  readonly sha: string;
}

interface UpdateResponse {
  readonly content: { readonly sha: string };
}

/** Ошибка GitHub API с сообщением для пользователя. */
export class GithubError extends Error {
  constructor(readonly status: number) {
    super(githubErrorMessage(status));
  }
}

/**
 * Чтение и запись файла в репозитории через GitHub Contents API.
 * Токен передаётся в каждый вызов и нигде не сохраняется.
 */
@Service()
export class GithubContents {
  private readonly http = inject(HttpClient);

  async read(path: string, token: string): Promise<RepositoryFile> {
    const response = await this.request(
      this.http.get<ContentsResponse>(contentsApiUrl(path), {
        headers: this.headers(token),
        params: { ref: GITHUB_REPOSITORY.branch },
        // Иначе после публикации браузер может вернуть старый ответ с устаревшим sha.
        cache: 'no-store',
      }),
    );
    return { text: decodeBase64Utf8(response.content), sha: response.sha };
  }

  /** Коммитит новое содержимое файла в ветку сайта и возвращает новый `sha`. */
  async write(path: string, token: string, update: { text: string; sha: string; message: string }): Promise<string> {
    const response = await this.request(
      this.http.put<UpdateResponse>(
        contentsApiUrl(path),
        {
          message: update.message,
          content: encodeBase64Utf8(update.text),
          sha: update.sha,
          branch: GITHUB_REPOSITORY.branch,
        },
        { headers: this.headers(token) },
      ),
    );
    return response.content.sha;
  }

  private headers(token: string): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    });
  }

  private async request<T>(source: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(source);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new GithubError(error.status);
      }
      throw error;
    }
  }
}
