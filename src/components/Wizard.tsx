import { useState, useCallback } from 'react';
import type { Platform, AnalyticsSource, ImplementationMethod, StepId } from '../data/types';
import { resolveMethod, platforms, getSourcesForPlatform, methods } from '../data/flowchart';
import { getCalloutsForStep } from '../data/callouts';
import { pushGtmEvent } from '../gtm';
import { StepHeader } from './StepHeader';
import { CalloutList } from './CalloutList';
import { StepPlatform } from './StepPlatform';
import { StepSource } from './StepSource';
import { StepMethod } from './StepMethod';
import { StepSetup } from './StepSetup';
import { StepSampling } from './StepSampling';
import { StepPrivacy } from './StepPrivacy';
import { StepValidation } from './StepValidation';
import { StepDebugging } from './StepDebugging';

interface Step {
  id: StepId;
  number: number;
  title: string;
}

const STEPS: Step[] = [
  { id: 'platform', number: 1, title: 'Select Your Platform' },
  { id: 'source', number: 2, title: 'Select Your Analytics Source' },
  { id: 'method', number: 3, title: 'Recommended Implementation Method' },
  { id: 'setup', number: 4, title: 'Setup Guide' },
  { id: 'sampling', number: 5, title: 'Sampling Configuration' },
  { id: 'privacy', number: 6, title: 'Privacy Controls' },
  { id: 'validation', number: 7, title: 'Validation Checklist' },
  { id: 'debugging', number: 8, title: 'Gotchas & Debugging' },
];

export function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [source, setSource] = useState<AnalyticsSource | null>(null);
  const [method, setMethod] = useState<ImplementationMethod | null>(null);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    setTimeout(() => {
      document.getElementById(`step-${step}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handlePlatformSelect = useCallback(
    (p: Platform) => {
      setPlatform(p);
      setSource(null);
      setMethod(null);
      pushGtmEvent('guide_platform_selected', { platform: p });
      goToStep(1);
    },
    [goToStep],
  );

  const handleSourceSelect = useCallback(
    (s: AnalyticsSource) => {
      setSource(s);
      const resolved = resolveMethod(platform!, s);
      setMethod(resolved);
      pushGtmEvent('guide_source_selected', { platform, source: s });
      pushGtmEvent('guide_method_resolved', { platform, source: s, method: resolved });
      goToStep(2);
    },
    [platform, goToStep],
  );

  const handleContinue = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      const step = STEPS[currentStep];
      pushGtmEvent('guide_step_continued', {
        step_id: step.id,
        step_number: step.number,
        platform,
        source,
        method,
      });
      if (currentStep === STEPS.length - 2) {
        pushGtmEvent('guide_completed', { platform, source, method });
      }
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep, platform, source, method]);

  const handleEditStep = useCallback(
    (stepIndex: number) => {
      const step = STEPS[stepIndex];
      pushGtmEvent('guide_step_edited', { step_id: step.id, step_number: step.number });
      if (stepIndex === 0) {
        setPlatform(null);
        setSource(null);
        setMethod(null);
      } else if (stepIndex === 1) {
        setSource(null);
        setMethod(null);
      }
      goToStep(stepIndex);
    },
    [goToStep],
  );

  const getStepStatus = (index: number): 'active' | 'completed' | 'upcoming' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'upcoming';
  };

  const getSummary = (index: number): string | undefined => {
    if (index === 0 && platform) return platforms.find((p) => p.id === platform)?.label;
    if (index === 1 && source) {
      return getSourcesForPlatform(platform!).find((s) => s.id === source)?.label;
    }
    if (index === 2 && method) return methods[method]?.label;
    return undefined;
  };

  const renderStepContent = (step: Step, index: number) => {
    const status = getStepStatus(index);
    if (status === 'upcoming') return null;
    if (status === 'completed') return null;

    const stepCallouts = getCalloutsForStep(step.id, platform, source);

    switch (step.id) {
      case 'platform':
        return (
          <>
            <StepPlatform selected={platform} onSelect={handlePlatformSelect} />
            <CalloutList callouts={stepCallouts} />
          </>
        );
      case 'source':
        return platform ? (
          <>
            <StepSource platform={platform} selected={source} onSelect={handleSourceSelect} />
            <CalloutList callouts={stepCallouts} />
          </>
        ) : null;
      case 'method':
        return method ? (
          <>
            <StepMethod method={method} />
            <CalloutList callouts={stepCallouts} />
            <ContinueButton onClick={handleContinue} />
          </>
        ) : null;
      case 'setup':
        return method ? (
          <>
            <StepSetup method={method} />
            <CalloutList callouts={stepCallouts} />
            <ContinueButton onClick={handleContinue} />
          </>
        ) : null;
      case 'sampling':
        return (
          <>
            <StepSampling />
            <CalloutList callouts={stepCallouts} />
            <ContinueButton onClick={handleContinue} />
          </>
        );
      case 'privacy':
        return (
          <>
            <StepPrivacy />
            <CalloutList callouts={stepCallouts} />
            <ContinueButton onClick={handleContinue} />
          </>
        );
      case 'validation':
        return (
          <>
            <StepValidation platform={platform} />
            <CalloutList callouts={stepCallouts} />
            <ContinueButton onClick={handleContinue} />
          </>
        );
      case 'debugging':
        return (
          <>
            <StepDebugging />
            <CalloutList callouts={stepCallouts} />
            <div className="mt-8 rounded-xl bg-gradient-to-r from-amp-indigo to-amp-purple p-6 text-white text-center">
              <p className="text-lg font-semibold">You're all set!</p>
              <p className="mt-1 text-sm text-indigo-100">
                Review the steps above, and reach out to your Amplitude team if you need help.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {STEPS.map((step, index) => {
        const status = getStepStatus(index);
        return (
          <div
            key={step.id}
            id={`step-${index}`}
            className={`
              rounded-2xl border bg-white p-6 transition-all duration-300
              ${status === 'active' ? 'border-amp-indigo/30 shadow-lg' : ''}
              ${status === 'completed' ? 'border-amp-border' : ''}
              ${status === 'upcoming' ? 'border-amp-border opacity-50' : ''}
            `}
          >
            <StepHeader
              number={step.number}
              title={step.title}
              status={status}
              summary={getSummary(index)}
              onEdit={status === 'completed' && index < 2 ? () => handleEditStep(index) : undefined}
            />
            {renderStepContent(step, index)}
          </div>
        );
      })}
    </div>
  );
}

function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={onClick}
        className="rounded-lg bg-amp-indigo px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amp-purple transition-colors cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}
