import { cn } from "@/lib/utils";
import { Root, Text } from "@rn-primitives/label/dist/label";

import type { TextProps, TextRef } from "@rn-primitives/label";
import { Platform } from "react-native";
import { remapProps } from "nativewind";

// note: need to figure out why this is needed
remapProps(Text, {
  className: "style",
});

remapProps(Root, {
  className: "style",
});

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: TextProps & React.RefAttributes<TextRef>) {
  return (
    <Root
      className={cn(
        "flex select-none flex-row items-center gap-2",
        Platform.select({
          web: "cursor-default leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        }),
        disabled && "opacity-50"
      )}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Text
        className={cn(
          "text-foreground text-sm font-medium",
          Platform.select({ web: "leading-none" }),
          className
        )}
        {...props}
      />
    </Root>
  );
}

export { Label };
