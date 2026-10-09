import { useEffect, type ReactNode } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAppFonts } from "../theme/fonts";

// Keep the native launch screen up until the fonts are ready, so the app goes
// launch screen -> first screen with no blank flash in between. (Called at
// import time, before the first render, which is when it has to be called.
// It can reject in Expo Go, where there is no native launch screen to hold.)
SplashScreen.preventAutoHideAsync().catch(() => {});

// Renders nothing until the fonts are loaded, so no screen ever paints in a
// fallback font and then jumps. If loading fails, the app still renders (in
// the system font) rather than staying blank.
export function FontGate({ children }: { children: ReactNode }) {
  const [loaded, error] = useAppFonts();
  const ready = loaded || !!error;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}
