import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GestureHandlerRootView } from "react-native-gesture-handler";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GestureHandlerRootView>
      <App />
    </GestureHandlerRootView>
  </StrictMode>
);
