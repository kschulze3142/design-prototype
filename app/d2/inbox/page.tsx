import { DirectionShell } from '@/components/directions/DirectionShell';
import { PlaceholderScreen } from '@/components/directions/PlaceholderScreen';

export default function Page() {
  return (
    <DirectionShell direction="d2">
      <PlaceholderScreen direction="d2" screen="inbox" />
    </DirectionShell>
  );
}
