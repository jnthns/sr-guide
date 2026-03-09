import { useState } from 'react';
import type { Platform } from '../data/types';
import { StepValidation } from '../components/StepValidation';
import { CalloutList } from '../components/CalloutList';
import { getCalloutsForStep } from '../data/callouts';
import { track } from '../analytics';

const platformOptions: { id: Platform | 'all'; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'react-native', label: 'React Native' },
];

export function ValidationPage() {
  const [platform, setPlatform] = useState<Platform>('web');
  const callouts = getCalloutsForStep('validation', platform, null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Validation Checklist</h2>
        <p className="mt-1 text-sm text-gray-500">
          Step-by-step instructions to verify your Session Replay implementation is working.
        </p>
      </div>

      <div className="flex gap-2">
        {platformOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setPlatform(opt.id as Platform);
              track('platform_filter_changed', { platform: opt.id, page: 'validation' });
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              platform === opt.id
                ? 'bg-amp-indigo text-white shadow-sm'
                : 'bg-white text-amp-blue border border-amp-border hover:border-amp-indigo/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <StepValidation platform={platform} />
      </div>

      {callouts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amp-blue mb-3">Important Notes</h3>
          <CalloutList callouts={callouts} />
        </div>
      )}
    </div>
  );
}
