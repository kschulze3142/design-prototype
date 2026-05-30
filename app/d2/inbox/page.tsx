// DR-005 — D2 Mercury · Inbox. The first real APP screen: uses the constrained
// DirectionShell (NOT MarketingShell). The contained <main> reads well for this
// data table — exactly the calm, bounded Mercury view we want.
import { DirectionShell } from '@/components/directions/DirectionShell';
import { FaxInbox } from '@/components/directions/d2/FaxInbox';

export default function Page() {
  return (
    <DirectionShell direction="d2">
      <FaxInbox />
    </DirectionShell>
  );
}
