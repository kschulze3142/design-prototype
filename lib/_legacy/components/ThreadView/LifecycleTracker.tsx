'use client';

// =============================================================================
// LifecycleTracker — vertical stepper of template.lifecycleStages with the
// current workItem.status highlighted. When the workItem's status is not in
// lifecycleStages (e.g. declined, action_required), all dots render as
// future/grey and an "Off-pipeline ({Status})" Pill caption shows the
// status tone from template.statusTones.
// =============================================================================

import { Pill } from '@/components/app/primitives';
import type { DepartmentTemplate, PillTone } from '@/lib/mockSystem/types';
import { titleCaseStatus } from '../formatters';

const TEAL = '#0d9488';
const VIOLET = '#7c3aed';
const VIOLET_SUBTLE = '#ede9fe';

type Props = {
  template: DepartmentTemplate;
  status: string;
};

export function LifecycleTracker({ template, status }: Props) {
  const stages = template.lifecycleStages;
  const currentIdx = stages.indexOf(status);
  const offPipeline = currentIdx === -1;
  const offTone: PillTone = (template.statusTones[status] ?? 'slate') as PillTone;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {stages.map((stage, idx) => {
        const isDone = !offPipeline && idx < currentIdx;
        const isCurrent = !offPipeline && idx === currentIdx;
        const isLast = idx === stages.length - 1;

        const dotBg = isDone ? TEAL : 'white';
        const dotBorder = isDone
          ? TEAL
          : isCurrent
            ? VIOLET
            : 'var(--color-border-strong)';
        const dotShadow = isCurrent ? `0 0 0 4px ${VIOLET_SUBTLE}` : 'none';

        const labelColor = isDone
          ? 'var(--color-text-primary)'
          : isCurrent
            ? VIOLET
            : 'var(--color-text-tertiary)';
        const labelWeight = isCurrent ? 600 : 500;

        const connectorColor = isDone ? TEAL : 'var(--color-border)';

        return (
          <div key={stage} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: dotBg,
                border: `2px solid ${dotBorder}`,
                boxShadow: dotShadow,
                marginTop: 2,
              }} />
              {!isLast && (
                <div style={{
                  width: 2,
                  height: 28,
                  background: connectorColor,
                  marginTop: 2,
                  marginBottom: 2,
                }} />
              )}
            </div>
            <div style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 13,
              fontWeight: labelWeight,
              color: labelColor,
              paddingBottom: isLast ? 0 : 14,
            }}>
              {titleCaseStatus(stage)}
            </div>
          </div>
        );
      })}

      {offPipeline && (
        <div style={{ marginTop: 8 }}>
          <Pill tone={offTone}>
            Off-pipeline ({titleCaseStatus(status)})
          </Pill>
        </div>
      )}
    </div>
  );
}
