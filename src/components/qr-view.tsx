import { LayoutChangeEvent, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useCallback, useState } from "react";
import { Button, Card, Text, useTheme } from "react-native-paper";

export type QRProps = {
  qrcodeLogo: string;
  displayLogoOnQrcode: boolean;
};

export default function QrView(props: QRProps) {
  const theme = useTheme();
  const [viewSize, setViewSize] = useState<{
    height: number;
    width: number;
  } | null>(null);
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
      <Text variant="displaySmall">Scan the QR Code to download the Result</Text>
      {viewSize?.width && (
        <QRCode
          size={viewSize.width * 0.45}
          logo={{ uri: props.qrcodeLogo }}
          logoSize={viewSize.width * 0.45 * 0.3}
          logoBackgroundColor="white"
          logoBorderRadius={8}
          logoMargin={5}
          value="http://awesome.link.qr"
        />
      )}
      <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text variant="displayMedium">00:00:00</Text>
        </View>
      <Button
        mode="contained"
        labelStyle={{ fontSize: 30, padding: 20}}
      >
        Return
      </Button>
    </View>
  );
}
