import { useEffect, useMemo, useState } from 'react';
import { Activity, GitCommitHorizontal, Github, ExternalLink, Clock3 } from 'lucide-react';
import {
  fetchGitHubPortfolioStats,
  GITHUB_REPO,
  GITHUB_USERNAME,
  getGitHubHeaders,
  hasGitHubToken,
  type GitHubPortfolioStats,
} from '@/lib/github';

interface LatestCommit {
  sha: string;
  date: string;
  url: string;
  message: string;
}

interface PublicEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload?: {
    commits?: Array<{
      sha?: string;
      message?: string;
    }>;
  };
}

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

const formatRelativeTime = (isoDate: string) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.max(1, Math.floor(diffMs / 1000));

  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const formatAbsoluteTime = (isoDate: string) => {
  const value = new Date(isoDate);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value);
};

const mapEventType = (eventType: string) => {
  const labels: Record<string, string> = {
    PushEvent: 'Pushed commits',
    PullRequestEvent: 'Opened pull request',
    IssuesEvent: 'Updated issue',
    CreateEvent: 'Created branch/repo',
    WatchEvent: 'Starred repository',
    ForkEvent: 'Forked repository',
  };

  return labels[eventType] ?? eventType.replace('Event', '');
};

const formatOrdinal = (value: number) => {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
};

const formatContributionDayLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const day = formatOrdinal(date.getDate());
  return `${month} ${day}`;
};

const GitHubOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [commit, setCommit] = useState<LatestCommit | null>(null);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [stats, setStats] = useState<GitHubPortfolioStats | null>(null);
  const [showExactTime, setShowExactTime] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [contributionWeeks, setContributionWeeks] = useState<ContributionWeek[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [activeContributionMessage, setActiveContributionMessage] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();

    const loadGitHubData = async () => {
      const fetchWithTokenFallback = async (url: string) => {
        const primaryResponse = await fetch(url, {
          signal: controller.signal,
          headers: getGitHubHeaders(),
        });

        // If token exists but is invalid/expired on deployment, retry as public.
        if (hasGitHubToken() && (primaryResponse.status === 401 || primaryResponse.status === 403)) {
          return fetch(url, {
            signal: controller.signal,
            headers: {
              Accept: 'application/vnd.github+json',
            },
          });
        }

        return primaryResponse;
      };

      try {
        const eventsEndpoint = hasGitHubToken()
          ? `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=5`
          : `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=5`;

        const [commitsResponse, eventsResponse] = await Promise.all([
          fetchWithTokenFallback(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`),
          fetchWithTokenFallback(eventsEndpoint),
        ]);

        const profileStats = await fetchGitHubPortfolioStats(GITHUB_USERNAME, controller.signal);
        setStats(profileStats);

        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          const latest = commits?.[0];

          if (latest?.sha && latest?.commit?.author?.date) {
            setCommit({
              sha: latest.sha,
              date: latest.commit.author.date,
              url: latest.html_url,
              message: latest.commit.message,
            });
          }
        }

        let resolvedEvents: PublicEvent[] = [];

        if (eventsResponse.ok) {
          const eventData = await eventsResponse.json();
          if (Array.isArray(eventData)) {
            resolvedEvents = eventData as PublicEvent[];
            setEvents(resolvedEvents.slice(0, 4));
          }
        } else {
          const fallbackPublicEvents = await fetchWithTokenFallback(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=5`,
          );

          if (fallbackPublicEvents.ok) {
            const fallbackEventData = await fallbackPublicEvents.json();
            if (Array.isArray(fallbackEventData)) {
              resolvedEvents = fallbackEventData as PublicEvent[];
              setEvents(resolvedEvents.slice(0, 4));
            }
          }
        }

        // Commit fallback for environments where commit endpoint is unavailable.
        if (!commitsResponse.ok && resolvedEvents.length === 0) {
          const publicEventsResponse = await fetchWithTokenFallback(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=5`
          );

          if (publicEventsResponse.ok) {
            const publicEventsData = await publicEventsResponse.json();
            if (Array.isArray(publicEventsData)) {
              resolvedEvents = publicEventsData as PublicEvent[];
              setEvents(resolvedEvents.slice(0, 4));
            }
          }
        }

        if (!commitsResponse.ok && resolvedEvents.length > 0) {
          const latestPushEvent = resolvedEvents.find((event) => event.type === 'PushEvent');
          const latestPushedCommit = latestPushEvent?.payload?.commits?.[0];

          if (latestPushEvent?.repo?.name && latestPushedCommit?.sha) {
            setCommit({
              sha: latestPushedCommit.sha,
              date: latestPushEvent.created_at,
              url: `https://github.com/${latestPushEvent.repo.name}/commit/${latestPushedCommit.sha}`,
              message: latestPushedCommit.message ?? 'Latest commit message is unavailable.',
            });
          }
        }
      } catch {
        // If GitHub API fails, the section still renders static overview links.
      } finally {
        setIsLoading(false);
      }
    };

    loadGitHubData();

    return () => controller.abort();
  }, []);

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = stats?.startYear ?? currentYear;

    const safeStartYear = Math.min(startYear, currentYear);
    const years: number[] = [];

    for (let year = currentYear; year >= safeStartYear; year -= 1) {
      years.push(year);
    }

    return years;
  }, [stats?.startYear]);

  useEffect(() => {
    if (availableYears.length === 0) return;

    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    setActiveContributionMessage('');
  }, [selectedYear]);

  const overviewHref = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const from = `${selectedYear}-01-01`;

    const to =
      selectedYear === currentYear
        ? now.toISOString().slice(0, 10)
        : `${selectedYear}-12-31`;

    return `https://github.com/${GITHUB_USERNAME}?tab=overview&from=${from}&to=${to}`;
  }, [selectedYear]);

  useEffect(() => {
    if (!hasGitHubToken()) {
      setContributionWeeks([]);
      setTotalContributions(0);
      return;
    }

    const controller = new AbortController();

    const loadContributionCalendar = async () => {
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const from = `${selectedYear}-01-01T00:00:00Z`;
        const to =
          selectedYear === currentYear
            ? now.toISOString()
            : `${selectedYear}-12-31T23:59:59Z`;

        const query = `
          query($login: String!, $from: DateTime!, $to: DateTime!) {
            viewer {
              login
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      color
                    }
                  }
                }
                commitContributionsByRepository(maxRepositories: 100) {
                  contributions {
                    totalCount
                  }
                  repository {
                    isPrivate
                  }
                }
              }
            }
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      color
                    }
                  }
                }
                commitContributionsByRepository(maxRepositories: 100) {
                  contributions {
                    totalCount
                  }
                  repository {
                    isPrivate
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            ...getGitHubHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: {
              login: GITHUB_USERNAME,
              from,
              to,
            },
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contribution calendar.');
        }

        const payload = await response.json();
        const viewerCalendar = payload?.data?.viewer?.contributionsCollection?.contributionCalendar;
        const userCalendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;
        const viewerLogin = payload?.data?.viewer?.login?.toLowerCase();

        const calendar =
          viewerLogin === GITHUB_USERNAME.toLowerCase() && viewerCalendar
            ? viewerCalendar
            : userCalendar;

        setContributionWeeks(calendar?.weeks ?? []);
        setTotalContributions(Number(calendar?.totalContributions ?? 0));
      } catch {
        setContributionWeeks([]);
        setTotalContributions(0);
      }
    };

    loadContributionCalendar();

    return () => controller.abort();
  }, [selectedYear]);

  const contributionChart = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const from = `${selectedYear}-01-01`;
    const to =
      selectedYear === currentYear
        ? now.toISOString().slice(0, 10)
        : `${selectedYear}-12-31`;

    return `https://ghchart.rshah.org/7e6ee3/${GITHUB_USERNAME}?from=${from}&to=${to}`;
  }, [selectedYear]);

  const monthLabels = useMemo(() => {
    let previousMonth = -1;

    return contributionWeeks.map((week) => {
      const firstDay = week.contributionDays[0]?.date;
      if (!firstDay) return '';

      const month = new Date(firstDay).getMonth();
      if (month === previousMonth) return '';

      previousMonth = month;
      return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(firstDay));
    });
  }, [contributionWeeks]);

  const monthDateFormatter = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    []
  );

  return (
    <section id="overview" className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-4">
            <Activity size={15} /> GitHub Overview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Open Source <span className="gradient-text">Activity</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Snapshot of my coding activity, contribution streaks, and latest commit updates.
          </p>
        </div>

        <div className="glass rounded-3xl p-4 md:p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-white">Contribution Activity</h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple/50"
                aria-label="Select overview year"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <a
                href={overviewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple hover:text-purple-light transition-colors"
              >
                View GitHub Overview <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-black/30 border border-white/10 p-3 md:p-4 overflow-x-auto">
            {contributionWeeks.length > 0 ? (
              <>
                <div className="min-w-[760px] inline-flex gap-1 mb-2">
                  {monthLabels.map((label, index) => (
                    <div key={`${label}-${index}`} className="w-3 relative h-4">
                      {label && (
                        <span className="absolute left-0 top-0 text-[10px] leading-none text-gray-500">
                          {label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="min-w-[760px] inline-flex gap-1 items-start">
                  {contributionWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.contributionDays.map((day) => (
                        <div
                          key={day.date}
                          className="w-3 h-3 rounded-[2px]"
                          data-cursor-hover="true"
                          style={{ backgroundColor: day.color }}
                          title={`${day.contributionCount} contribution${
                            day.contributionCount === 1 ? '' : 's'
                          } on ${monthDateFormatter.format(new Date(day.date))}`}
                          onMouseEnter={() => {
                            const label = formatContributionDayLabel(day.date);
                            if (day.contributionCount === 0) {
                              setActiveContributionMessage(`No contribution on ${label}`);
                              return;
                            }

                            setActiveContributionMessage(
                              `${day.contributionCount} contribution${
                                day.contributionCount === 1 ? '' : 's'
                              } on ${label}`
                            );
                          }}
                          onClick={() => {
                            const label = formatContributionDayLabel(day.date);
                            if (day.contributionCount === 0) {
                              setActiveContributionMessage(`No contribution on ${label}`);
                              return;
                            }

                            setActiveContributionMessage(
                              `${day.contributionCount} contribution${
                                day.contributionCount === 1 ? '' : 's'
                              } on ${label}`
                            );
                          }}
                          aria-label={`${day.contributionCount} contribution${
                            day.contributionCount === 1 ? '' : 's'
                          } on ${monthDateFormatter.format(new Date(day.date))}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {totalContributions} contribution{totalContributions === 1 ? '' : 's'} in {selectedYear}
                </p>
                <p className="text-xs text-purple/90 mt-1 min-h-[18px]">
                  {activeContributionMessage || 'Hover or tap a square to see daily contributions'}
                </p>
              </>
            ) : (
              <img
                src={contributionChart}
                alt="GitHub contribution chart"
                className="min-w-[700px] w-full"
                loading="lazy"
              />
            )}
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-xl bg-black/25 border border-white/10 px-3 py-3">
                <div className="text-xs text-gray-500">Years Experience</div>
                <div className="text-lg font-semibold text-white">{stats.yearsExperience}+</div>
              </div>
              <div className="rounded-xl bg-black/25 border border-white/10 px-3 py-3">
                <div className="text-xs text-gray-500">Projects (Total)</div>
                <div className="text-lg font-semibold text-white">{stats.totalProjects}+</div>
              </div>
              <div className="rounded-xl bg-black/25 border border-white/10 px-3 py-3">
                <div className="text-xs text-gray-500">Public Projects</div>
                <div className="text-lg font-semibold text-white">{stats.publicProjects}</div>
              </div>
              <div className="rounded-xl bg-black/25 border border-white/10 px-3 py-3">
                <div className="text-xs text-gray-500">Private Projects</div>
                <div className="text-lg font-semibold text-white">
                  {hasGitHubToken() ? stats.privateProjects : 'Token required'}
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div className="rounded-2xl bg-black/25 border border-white/10 p-4 md:p-5">
              <div className="flex items-center gap-2 text-purple mb-2">
                <GitCommitHorizontal size={18} />
                <h4 className="font-semibold text-white">Last Commit</h4>
              </div>

              {isLoading && <p className="text-sm text-gray-400">Loading latest commit...</p>}

              {!isLoading && commit && (
                <>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 break-all"
                  >
                    <Github size={15} /> {commit.sha.slice(0, 7)}
                  </a>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{commit.message}</p>

                  <div className="mt-3">
                    <button
                      onClick={() => setShowExactTime((prev) => !prev)}
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      title={formatAbsoluteTime(commit.date)}
                    >
                      <Clock3 size={14} /> {formatRelativeTime(commit.date)}
                    </button>
                    {showExactTime && (
                      <p className="text-xs text-gray-500 mt-2">{formatAbsoluteTime(commit.date)}</p>
                    )}
                  </div>
                </>
              )}

              {!isLoading && !commit && (
                <p className="text-sm text-gray-400">Latest commit is temporarily unavailable.</p>
              )}
            </div>

            <div className="rounded-2xl bg-black/25 border border-white/10 p-4 md:p-5">
              <div className="flex items-center gap-2 text-purple mb-2">
                <Activity size={18} />
                <h4 className="font-semibold text-white">
                  {hasGitHubToken() ? 'Recent Activity' : 'Recent Activity'}
                </h4>
              </div>

              {isLoading && <p className="text-sm text-gray-400">Loading activity feed...</p>}

              {!isLoading && events.length === 0 && (
                <p className="text-sm text-gray-400">No public activities available right now.</p>
              )}

              {!isLoading && events.length > 0 && (
                <ul className="space-y-2">
                  {events.map((event) => (
                    <li key={event.id} className="text-sm text-gray-300">
                      <span className="text-white">{mapEventType(event.type)}</span>{' '}
                      on <span className="text-purple">{event.repo.name}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{formatRelativeTime(event.created_at)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubOverview;
