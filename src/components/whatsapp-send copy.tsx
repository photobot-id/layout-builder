import { LayoutChangeEvent, Pressable, View } from "react-native";
import { useCallback, useState } from "react";
import { Button, Card, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper";

export default function WhatsappSend() {
  const [viewSize, setViewSize] = useState<{
    height: number;
    width: number;
  } | null>(null);
  const theme = useTheme();
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
        mode="flat"
        showSoftInputOnFocus={false}
        theme={{ roundness: 0 }}
        style={{ fontSize: 50, padding: 20 }}
      />
      {viewSize && (
        <View
          style={{
            width: "80%",
            height: viewSize.height * 0.6,
            justifyContent: "space-between",
            borderRadius: theme.roundness,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            gap: 20,
            padding: 20,
            backgroundColor: theme.colors.surface
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", gap: 20}}>
            <TouchableRipple style={{flex: 1, borderRadius: theme.roundness * 3}} onPress={() => console.log("press")}>
              <Card style={{flex: 1, borderRadius: theme.roundness * 3}} elevation={3}>
                <Card.Content style={{justifyContent: "center", alignItems: "center"}}>
                  <Text variant="displayMedium" selectable={false}>1</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
            <TouchableRipple style={{flex: 1, borderRadius: theme.roundness * 3}} onPress={() => console.log("press")}>
              <Card style={{flex: 1, borderRadius: theme.roundness * 3}} elevation={3}>
                <Card.Content style={{justifyContent: "center", alignItems: "center"}}>
                  <Text variant="displayMedium" selectable={false}>1</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
            <TouchableRipple style={{flex: 1, borderRadius: theme.roundness * 3}} onPress={() => console.log("press")}>
              <Card style={{flex: 1, borderRadius: theme.roundness * 3}} elevation={3}>
                <Card.Content style={{justifyContent: "center", alignItems: "center"}}>
                  <Text variant="displayMedium" selectable={false}>1</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{flex: 1, padding: 10}}></View>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{flex: 1, padding: 10}}></View>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{flex: 1, padding: 10}}></View>
          </View>
        </View>
      )}
      <Button mode="contained" labelStyle={{ fontSize: 30, padding: 20 }}>
        Send
      </Button>
    </View>
  );
}
