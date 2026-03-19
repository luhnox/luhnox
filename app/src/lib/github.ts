export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME ?? 'luhnox';

const normalizeRepoSlug = (value: string | undefined, username: string) => {
  const fallback = `${username}/luhnox`;
  if (!value) return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  // Accept full GitHub URL and convert it to owner/repo slug.
  const fromUrl = trimmed.match(/github\.com\/(.+?\/.+?)(?:\.git)?(?:\/|$)/i)?.[1];
  if (fromUrl) return fromUrl;

  // If only repo name is provided, assume it belongs to configured username.
  if (!trimmed.includes('/')) {
    return `${username}/${trimmed}`;
  }

  return trimmed.replace(/^\/+|\/+$/g, '');
};

export const GITHUB_REPO = normalizeRepoSlug(import.meta.env.VITE_GITHUB_REPO, GITHUB_USERNAME);

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN?.trim();

export interface GitHubPortfolioStats {
  startYear: number;
  yearsExperience: number;
  totalProjects: number;
  publicProjects: number;
  privateProjects: number;
}

interface GitHubRepository {
  full_name: string;
  private: boolean;
  created_at: string;
}

interface GitHubProfile {
  created_at?: string;
}

export const getGitHubHeaders = () => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
};

export const hasGitHubToken = () => Boolean(GITHUB_TOKEN);

const computeYearsExperience = (isoDate: string | null | undefined) => {
  if (!isoDate) return 1;

  const startYear = new Date(isoDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const years = currentYear - startYear + 1;

  return Math.max(1, years);
};

const computeStartYear = (isoDate: string | null | undefined) => {
  const currentYear = new Date().getFullYear();
  if (!isoDate) return currentYear;

  const year = new Date(isoDate).getFullYear();
  return Number.isNaN(year) ? currentYear : year;
};

const fetchGitHubProfile = async (
  username: string,
  signal?: AbortSignal
): Promise<GitHubProfile> => {
  const endpoint = hasGitHubToken()
    ? 'https://api.github.com/user'
    : `https://api.github.com/users/${username}`;

  const response = await fetch(endpoint, {
    headers: getGitHubHeaders(),
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub profile.');
  }

  return response.json() as Promise<GitHubProfile>;
};

const fetchOwnedRepositories = async (
  username: string,
  signal?: AbortSignal
): Promise<GitHubRepository[]> => {
  const repos: GitHubRepository[] = [];
  let page = 1;

  while (true) {
    const endpoint = hasGitHubToken()
      ? `https://api.github.com/user/repos?visibility=all&affiliation=owner&per_page=100&page=${page}&sort=created&direction=asc`
      : `https://api.github.com/users/${username}/repos?type=owner&per_page=100&page=${page}&sort=created&direction=asc`;

    const response = await fetch(endpoint, {
      headers: getGitHubHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repository list.');
    }

    const pageRepos = (await response.json()) as GitHubRepository[];
    repos.push(...pageRepos);

    if (pageRepos.length < 100) {
      break;
    }

    page += 1;
  }

  return repos;
};

export const fetchGitHubPortfolioStats = async (
  username = GITHUB_USERNAME,
  signal?: AbortSignal
): Promise<GitHubPortfolioStats> => {
  const [profile, repos] = await Promise.all([
    fetchGitHubProfile(username, signal),
    fetchOwnedRepositories(username, signal),
  ]);

  const publicProjects = repos.filter((repo) => !repo.private).length;
  const privateProjects = repos.filter((repo) => repo.private).length;
  const totalProjects = repos.length;

  return {
    startYear: computeStartYear(profile.created_at),
    yearsExperience: computeYearsExperience(profile.created_at),
    totalProjects,
    publicProjects,
    privateProjects,
  };
};

export const fetchPrivateRepoCommitCountByYear = async (
  username: string,
  year: number,
  signal?: AbortSignal
): Promise<number> => {
  if (!hasGitHubToken()) return 0;

  const repos = await fetchOwnedRepositories(username, signal);
  const privateRepos = repos.filter((repo) => repo.private);

  if (privateRepos.length === 0) return 0;

  const from = `${year}-01-01`;
  const to = `${year}-12-31`;

  const counts = await Promise.all(
    privateRepos.map(async (repo) => {
      const query = `repo:${repo.full_name} author:${username} committer-date:${from}..${to}`;
      const url = `https://api.github.com/search/commits?q=${encodeURIComponent(query)}&per_page=1`;

      const response = await fetch(url, {
        headers: getGitHubHeaders(),
        signal,
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return Number(data?.total_count ?? 0);
    })
  );

  return counts.reduce((sum, count) => sum + count, 0);
};
