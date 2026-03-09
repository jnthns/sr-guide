import { useState } from 'react';
import type { Platform } from '../data/types';
import { validationContent } from '../data/content';
import { track } from '../analytics';

interface StepValidationProps {
  platform: Platform | null;
}

export function StepValidation({ platform }: StepValidationProps) {
  const isWeb = platform === 'web';
  const content = isWeb ? validationContent.web : validationContent.mobile;
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      const nowChecked = !next.has(index);
      if (nowChecked) next.add(index);
      else next.delete(index);

      track('validation_check_toggled', {
        label: content.steps[index].label,
        checked: nowChecked,
        platform,
      });

      if (nowChecked && next.size === content.steps.length) {
        track('validation_completed', { platform });
      }

      return next;
    });
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Use this checklist to verify your Session Replay implementation is working correctly.
      </p>
      <h3 className="text-sm font-semibold text-amp-blue mb-3">{content.heading}</h3>
      <div className="space-y-3">
        {content.steps.map((step, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
              checked.has(i)
                ? 'border-green-300 bg-green-50'
                : 'border-amp-border bg-white hover:border-amp-indigo/30'
            }`}
          >
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amp-indigo accent-amp-indigo"
            />
            <div className="min-w-0">
              <span className="text-sm font-medium text-amp-blue">{step.label}</span>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                {step.detail}
                {step.link && (
                  <>
                    {' '}
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 font-medium text-amp-indigo hover:underline"
                    >
                      {step.link.label}
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </>
                )}
              </p>
            </div>
          </label>
        ))}
      </div>
      {checked.size === content.steps.length && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800 font-medium text-center">
          All validation checks complete!
        </div>
      )}
    </div>
  );
}
