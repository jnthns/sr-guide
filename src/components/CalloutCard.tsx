import { Link } from 'react-router-dom';
import type { CalloutType } from '../data/types';
import { pushGtmEvent } from '../gtm';

interface CalloutCardProps {
  type: CalloutType;
  title: string;
  body: string;
  link?: { label: string; url: string };
  internalLink?: { label: string; to: string };
}

const styles: Record<CalloutType, { bg: string; border: string; icon: string; iconColor: string }> = {
  tip: {
    bg: 'bg-callout-tip-bg',
    border: 'border-callout-tip-border',
    icon: '\u{1F4A1}',
    iconColor: 'text-blue-600',
  },
  warning: {
    bg: 'bg-callout-warning-bg',
    border: 'border-callout-warning-border',
    icon: '\u26A0\uFE0F',
    iconColor: 'text-amber-600',
  },
  critical: {
    bg: 'bg-callout-critical-bg',
    border: 'border-callout-critical-border',
    icon: '\u{1F6A8}',
    iconColor: 'text-red-600',
  },
};

export function CalloutCard({ type, title, body, link, internalLink }: CalloutCardProps) {
  const s = styles[type];
  return (
    <div className={`${s.bg} border-l-4 ${s.border} rounded-r-lg p-4`}>
      <div className="flex items-start gap-2">
        <span className="text-base leading-none mt-0.5" role="img">{s.icon}</span>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${s.iconColor}`}>{title}</p>
          <p className="mt-1 text-sm text-gray-700 leading-relaxed">{body}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {link && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
                onClick={() => pushGtmEvent('callout_link_clicked', {
                  callout_title: title,
                  link_label: link.label,
                  url: link.url,
                  link_type: 'external',
                })}
              >
                {link.label}
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
            {internalLink && (
              <Link
                to={internalLink.to}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
                onClick={() => {
                  pushGtmEvent('callout_link_clicked', {
                    callout_title: title,
                    link_label: internalLink.label,
                    destination: internalLink.to,
                    link_type: 'internal',
                  });
                }}
              >
                {internalLink.label}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
