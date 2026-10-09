import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { FontGate } from './src/components/FontGate';

function AppContent() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <FontGate>
      <AppContent />
    </FontGate>
  );
}
