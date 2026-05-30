import { DirectionShell } from '@/components/directions/DirectionShell';
import { PlaceholderScreen } from '@/components/directions/PlaceholderScreen';

export default function Page() {
  return (
    <DirectionShell direction="d4">
      <PlaceholderScreen direction="d4" screen="dashboard" />
    </DirectionShell>
  );
}
