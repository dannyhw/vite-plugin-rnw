import Toaster from "react-native-toast-message";
import { Button } from "react-native";

export default function Toast() {
  const showToast = () => {
    Toaster.show({
      type: "success",
      text1: "Hello",
      text2: "This is some something 👋",
    });
  };

  return <Button title="Show toast" onPress={showToast} />;
}
