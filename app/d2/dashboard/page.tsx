// DR-006 — D2 Mercury · Dashboard. Last D2 screen: the in-app home, using the
// constrained DirectionShell (NOT MarketingShell), consistent with the inbox.
import { DirectionShell } from '@/components/directions/DirectionShell';
import { Dashboard } from '@/components/directions/d2/Dashboard';

export default function Page() {
  return (
    <DirectionShell direction="d2">
      <Dashboard />
    </DirectionShell>
  );
}
