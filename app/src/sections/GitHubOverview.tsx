import { useEffect, useMemo, useState } from 'react';
import { Activity, GitCommitHorizontal, Github, ExternalLink, Clock3 } from 'lucide-react';

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
}

const GITHUB_USERNAME = 'luhnox';
const GITHUB_REPO = 'luhnox/luhnox';

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

const GitHubOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [commit, setCommit] = useState<LatestCommit | null>(null);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [showExactTime, setShowExactTime] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadGitHubData = async () => {
      try {
        const [commitsResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`, {
            signal: controller.signal,
          }),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=5`, {
            signal: controller.signal,
          }),
        ]);

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

        if (eventsResponse.ok) {
          const eventData = await eventsResponse.json();
          if (Array.isArray(eventData)) {
            setEvents(eventData.slice(0, 4));
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

  const contributionChart = useMemo(
    () => `https://ghchart.rshah.org/7e6ee3/${GITHUB_USERNAME}`,
    []
  );

  return (
    <section id="overview" className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_10%,rgba(126,110,227,0.16),transparent_40%)]" />

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
            <a
              href="https://github.com/luhnox?tab=overview&from=2026-03-01&to=2026-03-18"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple hover:text-purple-light transition-colors"
            >
              View GitHub Overview <ExternalLink size={14} />
            </a>
          </div>

          <div className="rounded-2xl bg-black/30 border border-white/10 p-3 md:p-4 overflow-x-auto">
            <img
              src={contributionChart}
              alt="GitHub contribution chart"
              className="min-w-[700px] w-full"
              loading="lazy"
            />
          </div>

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
                <h4 className="font-semibold text-white">Recent Public Activity</h4>
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
