import {
  Image,
  StyleSheet,
  View,
} from "react-native";
import { useAssets } from "expo-asset";

export default function HeaderLogo({darkLogo = false}: {darkLogo: boolean}) {
  const [assets] = useAssets([
    require("@assets/images/logo/logo_primary_with_stroke_dark.png"),
    require("@assets/images/logo/logo_primary_with_stroke.png"),
  ]);

  if (!assets) {
    return null; // or <ActivityIndicator />
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={(darkLogo ? assets[0] : assets[1]) as any}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    position: "absolute",
    zIndex: 1,
    margin: 20,
  },
  logoContainer: {
    flex: 1,
    maxWidth: 120,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logo: {
    width: 100,
  },
});
