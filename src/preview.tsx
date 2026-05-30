import { Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { useState } from "react";
import { useAssets } from "expo-asset";
import QrView from "@components/qr-view";
import WhatsappSend from "@components/whatsapp-send";

export type PreviewProps = {
  orientation: "PORTRAIT" | "LANDSCAPE";
  // output frame
  useFrameInPhotoAndVideo: boolean;
  photoFrame: string;
  videoFrame: string;

  // QR CODE
  qrcodeLogo: string;
  displayLogoOnQrcode: boolean;

  // whatsapp delivery
  useWhatsappDelivery: boolean;
  // camera
  cameraOrientation: "PORTRAIT" | "LANDSCAPE";
  photoAspectRatio: "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "1:1";
};

enum AspectRatio {
  "2:3" = 2 / 3,
  "3:2" = 3 / 2,
  "3:4" = 3 / 4,
  "4:3" = 4 / 3,
  "9:16" = 9 / 16,
  "16:9" = 16 / 9,
  "1:1" = 1,
}

export default function Preview(props: PreviewProps) {
  const [currentTab, setCurrentTab] = useState<"QR_CODE" | "WHATSAPP">(
    "QR_CODE",
  );
  const theme = useTheme();
  return (
    <View style={{ flex: 1, padding: 40, paddingTop: 150, gap: 20, flexDirection: props.orientation === "LANDSCAPE" ? "row" : "column" }}>
      <View
        style={{
          flex: props.orientation === "LANDSCAPE" ? 0.7 : 0.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: props.cameraOrientation === "PORTRAIT" ? "100%" : props.photoAspectRatio === "1:1" ? "100%" : undefined,
            width: props.cameraOrientation === "LANDSCAPE" ? (props.photoAspectRatio === "1:1" ? undefined : "100%") : undefined,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            aspectRatio: AspectRatio[props.photoAspectRatio],
          }}
        >
          <Image
            source={
              props.cameraOrientation === "PORTRAIT"
                ? {uri: "https://static.wixstatic.com/media/a95a81_b3f4a1644f324f798fe6544f9cc16c09~mv2.png"}
                : {uri: "https://static.wixstatic.com/media/a95a81_cdcf745ad47641fead9bb6231c14572d~mv2.png"}
            }
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: AspectRatio[props.photoAspectRatio],
            }}
          />
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{uri: props.photoFrame}}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: AspectRatio[props.photoAspectRatio],
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ flex: props.orientation === "LANDSCAPE" ? 0.3 : 0.5, padding: 20, paddingHorizontal: 40, gap: 20}}>
        {props.useWhatsappDelivery && (
          <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Button
            mode="outlined"
            style={{borderWidth: 5, backgroundColor: `${theme.colors.background}80`}}
            labelStyle={{ fontSize: 30, padding: 20}}
            onPress={() => setCurrentTab("QR_CODE")}
          >
            QR Code
          </Button>
          <Button
              mode="outlined"
              style={{borderWidth: 5, backgroundColor: `${theme.colors.background}80`}}
              labelStyle={{ fontSize: 30, padding: 20}}
              onPress={() => setCurrentTab("WHATSAPP")}
            >
              Send Via Whatsapp
            </Button>
        </View>
        )}
        
        {currentTab === "QR_CODE" ? (
          <QrView {...props} />
        ) : (
          <WhatsappSend />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
