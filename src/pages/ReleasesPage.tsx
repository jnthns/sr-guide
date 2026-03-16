import { useMemo } from 'react';
import { releases } from '../data/releases';

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ReleasesPage() {
  const sorted = useMemo(
    () => [...releases].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof sorted>();
    for (const r of sorted) {
      const existing = map.get(r.date);
      if (existing) {
        existing.push(r);
      } else {
        map.set(r.date, [r]);
      }
    }
    return map;
  }, [sorted]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Feature Releases</h2>
      </div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-amp-border" aria-hidden="true" />

        <div className="space-y-8">
          {[...grouped.entries()].map(([date, items]) => (
            <div key={date} className="relative pl-8">
              <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-amp-indigo bg-white" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {formatDate(date)}
              </p>

              <div className="space-y-3">
                {items.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-amp-border bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-sm font-semibold text-amp-blue">{r.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{r.body}</p>

                    {r.tags && r.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded-full bg-amp-light px-2.5 py-0.5 text-[11px] font-medium text-amp-indigo"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {r.link && (
                      <a
                        href={r.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
                      >
                        {r.link.label}
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
