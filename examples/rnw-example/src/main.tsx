import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "@/lib/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider value={NAV_THEME["dark"]}>
      <GestureHandlerRootView>
        <App />
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  </StrictMode>
);
