import { DirectionShell } from '@/components/directions/DirectionShell';
import { PlaceholderScreen } from '@/components/directions/PlaceholderScreen';

export default function Page() {
  return (
    <DirectionShell direction="d1">
      <PlaceholderScreen direction="d1" screen="dashboard" />
    </DirectionShell>
  );
}
