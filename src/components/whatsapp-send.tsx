import {
  LayoutChangeEvent,
  TextInput as RNInput,
  View,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import {
  Button,
  TextInput,
  useTheme,
} from "react-native-paper";
import NumericKeyboard from "./numeric-keyboard";

export default function WhatsappSend() {
  const [viewSize, setViewSize] = useState<{
    height: number;
    width: number;
  } | null>(null);
  const theme = useTheme();
  const inputRef = useRef<RNInput>(null);

  const [phone, setPhone] = useState("");
  const [cursorPosition, setCursorPosition] = useState<{
    start: number;
    end: number;
  }>({
    start:0, end:0
  });
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      setViewSize((prev) => {
        if (!prev || prev.width !== width || prev.height !== height) {
          return { width, height };
        }
        return prev;
      });
    },
    [viewSize],
  );

  return (
    <View
      onLayout={onLayout}
      style={{
        gap: 40,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        ref={inputRef}
        mode="outlined"
        value={phone}
        selection={cursorPosition}
        showSoftInputOnFocus={false}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) {
            setPhone(text);
          }
        }}
        inputMode="numeric"
        theme={{ roundness: 20, colors: {background: `${theme.colors.background}80`} }}
        outlineStyle={{borderWidth: 5}}
        style={{ fontSize: 50, padding: 20}}
        onSelectionChange={({ nativeEvent }) => {
          setCursorPosition(nativeEvent.selection);
        }}
      />
      <NumericKeyboard
        onChange={(e) => {
          setPhone(e);
        }}
        value={phone}
        cursor={cursorPosition}
        setCursorPosition={e => setCursorPosition(e)}
      />
      <Button mode="contained" labelStyle={{ fontSize: 40, padding: 30 }}>
        Send
      </Button>
    </View>
  );
}
