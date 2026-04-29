import { Link } from 'react-router-dom';
import { privacyContent } from '../data/content';
import type { ContentItem } from '../data/types';

const complianceGroup = privacyContent.groups.find((g) => g.id === 'compliance');
const deletionSection = complianceGroup?.sections.find(
  (s) => s.heading === 'Storage and Retention',
);

export function DeletionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Data Deletion & Compliance</h2>
        <p className="mt-1 text-sm text-gray-500">
          How to delete Session Replay data and stay compliant with privacy regulations.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-callout-critical-border bg-callout-critical-bg px-5 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="flex items-center gap-2 text-sm font-medium text-red-800">
            <span aria-hidden="true">&#9888;</span>
            Replay deletion erases user event history, not just replay videos. Make sure masking is configured first.
          </p>
          <Link
            to="/"
            className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-800 hover:bg-red-200 transition-colors"
          >
            Read Before You Begin
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {deletionSection && 'items' in deletionSection && deletionSection.items && (
        <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-amp-blue mb-3">{deletionSection.heading}</h3>
          <ul className="space-y-3">
            {(deletionSection.items as ContentItem[]).map((item, i) => {
              const text = typeof item === 'string' ? item : item.text;
              const link = typeof item !== 'string' ? item.link : undefined;
              const hasBold = text.includes(':');
              return (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>
                    {hasBold ? (
                      <>
                        <strong className="text-amp-blue">{text.split(':')[0]}:</strong>
                        {text.substring(text.indexOf(':') + 1)}
                      </>
                    ) : (
                      text
                    )}
                    {link && (
                      <>
                        {' '}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 font-medium text-amp-indigo hover:underline"
                        >
                          {link.label}
                          <span aria-hidden="true">&rarr;</span>
                        </a>
                      </>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-amp-blue mb-3">Deletion Methods</h3>
        <p className="text-sm text-gray-600 mb-4">
          Each method below deletes the <strong className="text-amp-blue">events</strong> that contain replay data. There is no standalone replay-only deletion — removing a replay always removes its linked events and analytics history.
        </p>
        <div className="space-y-4">
          <DeletionMethod
            title="User Privacy API"
            description="Deletes all events for selected users, which includes any session replays linked to those events. Use this for individual deletion requests (e.g., GDPR right to erasure). This erases the user's full event history in Amplitude."
            url="https://amplitude.com/docs/apis/analytics/user-privacy"
            linkLabel="User Privacy API docs"
          />
          <DeletionMethod
            title="DSAR API"
            description="Deletes event and property history by time range for a user. Any session replays tied to events in that window are also removed. Use this for Data Subject Access Requests that require deletion within a specific period."
            url="https://amplitude.com/docs/apis/analytics/ccpa-dsar"
            linkLabel="DSAR API docs"
          />
          <DeletionMethod
            title="Project Deletion"
            description="Deleting an Amplitude project removes all events, session replays, and associated data. This is irreversible."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-amp-blue mb-3">Data Retention</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
            <span>Default replay data retention is <strong className="text-amp-blue">30–90 days</strong>, configurable by plan (max 12 months).</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
            <span>Session Replay does not use cookies — data is stored in IndexedDB and aggressively cleaned up on the client side.</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
            <span>Masking happens at capture time — masked data is <strong className="text-amp-blue">never sent</strong> to Amplitude and cannot be recovered.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function DeletionMethod({
  title,
  description,
  url,
  linkLabel,
}: {
  title: string;
  description: string;
  url?: string;
  linkLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-amp-border p-4 bg-amp-light">
      <h4 className="text-sm font-semibold text-amp-blue">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      {url && linkLabel && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-0.5 text-sm font-medium text-amp-indigo hover:underline"
        >
          {linkLabel}
          <span aria-hidden="true">&rarr;</span>
        </a>
      )}
    </div>
  );
}
