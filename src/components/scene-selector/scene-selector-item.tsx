import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { PropsWithChildren } from "react";

type Props = {
  height?: number;
  isLandscape?: boolean;
  frame: string;
};

const SceneSelectorItem: React.FC<PropsWithChildren<Props>> = ({
  height = 200,
  isLandscape = false,
  ...props
}) => {  
  return (
    <Pressable
      style={[styles.container, { height: height, borderRadius: 0.1 * height }]}
    >
      {/* LAYER 1: The Background Thumbnail */}
      <View style={[styles.overlayContainer]}>
        <View
          style={[
            styles.showcaseWrapper,
            {
              aspectRatio: isLandscape ? 3 / 2 : 2 / 3,
              borderRadius: 0.1 * height,
            },
          ]}
        >
          <Image
            source={(isLandscape ? {uri: "https://static.wixstatic.com/media/a95a81_cdcf745ad47641fead9bb6231c14572d~mv2.png"} : {uri: "https://static.wixstatic.com/media/a95a81_b3f4a1644f324f798fe6544f9cc16c09~mv2.png"})}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>
      </View>
      {/* LAYER 2: The Overlay (Frame and Blur) */}
      <View style={styles.overlayContainer}>
        <View
          style={[
            styles.showcaseWrapper,
            {
              aspectRatio: isLandscape ? 3 / 2 : 2 / 3,
              borderRadius: 0.1 * height,
            },
          ]}
        >
          <Image
            source={{uri: props.frame}}
            style={[
              styles.showcaseFrame,
              {
                aspectRatio: isLandscape ? 3 / 2 : 2 / 3,
                borderRadius: 0.1 * height,
              },
            ]}
            resizeMode="cover"
          />
          <View style={StyleSheet.absoluteFill}>{props.children}</View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  thumbnail: {
    height: "100%",
    width: "100%",
    aspectRatio: 2 / 3,
    resizeMode: "cover",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  showcaseWrapper: {
    height: "100%", // Matches the height of the parent Pressable
    overflow: "hidden",
  },
  showcaseFrame: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
});

export default SceneSelectorItem;
