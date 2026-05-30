import { DirectionShell } from '@/components/directions/DirectionShell';
import { PlaceholderScreen } from '@/components/directions/PlaceholderScreen';

export default function Page() {
  return (
    <DirectionShell direction="d3">
      <PlaceholderScreen direction="d3" screen="inbox" />
    </DirectionShell>
  );
}
