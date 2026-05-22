// FE-047 — Setup confirmation screen shown between signup and the app shell.
// Lives outside /app/* so the sidebar doesn't appear; the user hasn't "entered"
// the workspace yet, and the screen exists to sell the "we did the work for
// you" framing before the dashboard loads.
'use client';

import { useRouter } from 'next/navigation';
import { useMockSystem, type PracticeType } from '@/lib/mockSystem';
import { I } from '@/components/app/icons';

const practiceTypeNames: Record<PracticeType, string> = {
  home_health: 'Home Health Agency',
  cardiology: 'Cardiology Practice',
};

export default function WelcomePage() {
  const router = useRouter();
  const { workspace, currentUser, departments, automations } = useMockSystem();

  const firstName = currentUser.name.split(' ')[0];
  const practiceTypeName = practiceTypeNames[workspace.practiceType];
  const enabledDepartmentCount = departments.filter((d) => d.enabled).length;
  const automationCount = automations.length;

  // Items 3-5 are theatrical — they describe Blue Lark capabilities not present
  // in the prototype data model. Intentional for demo polish; do not wire to
  // real data.
  const checklist = [
    `Created ${enabledDepartmentCount} departments with smart routing rules`,
    `Pre-loaded ${automationCount} automation rules`,
    'Provisioned 3 fax numbers for inbound routing',
    'Set up SLA tracking for time-sensitive items',
    'Configured analytics dashboards',
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="w-full flex flex-col"
        style={{ maxWidth: 600, gap: 32 }}
      >
        <div className="flex flex-col gap-2">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1.2,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Your workspace is ready, {firstName}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            We&apos;ve set up {practiceTypeName} with {enabledDepartmentCount}{' '}
            departments tailored to your workflow.
          </p>
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {checklist.map((item) => (
            <div
              key={item}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span
                style={{
                  color: 'var(--color-delivered)',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <I.Check size={20} strokeWidth={2.2} />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--color-text-primary)',
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <button
            type="button"
            style={{
              height: 42,
              padding: '0 20px',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Take a tour
          </button>
          <button
            type="button"
            onClick={() => router.push('/app/dashboard')}
            style={{
              height: 42,
              padding: '0 20px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
