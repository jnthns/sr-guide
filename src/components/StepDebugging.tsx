import { useState } from 'react';
import { debuggingContent } from '../data/content';
import { pushGtmEvent } from '../gtm';

export function StepDebugging() {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      const expanding = !next.has(index);
      if (expanding) next.add(index);
      else next.delete(index);

      pushGtmEvent('debugging_section_toggled', {
        section: debuggingContent.sections[index].heading,
        expanded: expanding,
      });

      return next;
    });
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Common issues and how to resolve them. Click a section to expand.
      </p>
      <div className="space-y-2">
        {debuggingContent.sections.map((section, i) => (
          <div
            key={i}
            className="rounded-lg border border-amp-border overflow-hidden"
          >
            <button
              onClick={() => toggleSection(i)}
              className="flex items-center justify-between w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className="text-sm font-semibold text-amp-blue">{section.heading}</span>
              <span
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.has(i) ? 'rotate-180' : ''
                }`}
              >
                &#9662;
              </span>
            </button>
            {expandedSections.has(i) && (
              <div className="px-4 pb-4 bg-white">
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                      <span>
                        {item.text}
                        {item.link && (
                          <>
                            {' '}
                            <a
                              href={item.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 font-medium text-amp-indigo hover:underline"
                            >
                              {item.link.label}
                              <span aria-hidden="true">&rarr;</span>
                            </a>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
