import {
  StyleSheet,
  View,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { BlurView as _BlurView } from "expo-blur";
import { parallaxLayout } from "@utils/blur-parallax/parallax";
import { SceneSelectorProp } from "../../../types/scene";
import { useCallback, useEffect, useState } from "react";
import SceneSelectorItem from "./scene-selector-item";

const BlurView = Animated.createAnimatedComponent(_BlurView);

type Props = {
  scenes: SceneSelectorProp[];
  position?: "BOTTOM" | "CENTER";
  size?: "LARGE" | "SMALL";
  frame: string;
};

export default function SceneSelectorParalax(props: Props) {
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
    <View style={[styles.container, { paddingBottom: viewSize ? viewSize.height * 0.05 : undefined }]} onLayout={onLayout}>
      {viewSize !== null ? (
        <SceneSelectorParalaxContainer {...props} viewSize={viewSize} />
      ) : null}
    </View>
  );
}

function SceneSelectorParalaxContainer({
  position = "CENTER",
  size = "LARGE",
  scenes,
  frame,
  viewSize,
}: Props & {
  viewSize: {
    height: number;
    width: number;
  };
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLandscape = viewSize.width > viewSize.height;
  const CARAOSEL_WIDTH = viewSize.width / 2;
  const CARAOSEL_HEIGHT = viewSize.height / (size === "LARGE" ? 2 : 3);
  const [cw, setCw] = useState(CARAOSEL_WIDTH);
  
  const cb = (index: number) => {
    if (currentIndex === index) {
      console.log("pressed");
    }
  };

  useEffect(() => {
      if (CARAOSEL_WIDTH !== undefined && CARAOSEL_WIDTH > 0) {
        setCw(CARAOSEL_WIDTH);
      }
    }, [CARAOSEL_WIDTH]);
  
  return (
    <View
      style={[
        styles.container,
        { justifyContent: position === "CENTER" ? "center" : "flex-end" },
      ]}
    >
      <Carousel
        loop
        style={{
          left: CARAOSEL_WIDTH / 2,
          width: CARAOSEL_WIDTH,
          height: CARAOSEL_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
        }}
        onSnapToItem={(index) => setCurrentIndex(index)}
        // @ts-ignore
        contentContainerStyle={{
          width: CARAOSEL_WIDTH,
          overflow: "visible",
        }}
        data={scenes}
        renderItem={({ index, animationValue, item }) => {
          return (
            <CustomItem
              frame={frame}
              animationValue={animationValue}
              height={CARAOSEL_HEIGHT}
              isLandscape={isLandscape}
            />
          );
        }}
        customAnimation={parallaxLayout(
          {
            size: CARAOSEL_WIDTH,
            vertical: false,
          },
          {
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.6,
            parallaxScrollingOffset: isLandscape
              ? size === "LARGE"
                ? viewSize.width / 8.7
                : viewSize.width / 4.2
              : size === "LARGE"
                ? -1 * (viewSize.width * 0.024305556328208)
                : viewSize.width * 0.14583333796925,
          },
        )}
        width={cw}
        scrollAnimationDuration={1200}
      />
    </View>
  );
}
// 411,4285583496094

type ItemProps = {
  animationValue: SharedValue<number>;
  height: number;
  frame: string;
  isLandscape: boolean;
};
const CustomItem: React.FC<ItemProps> = ({
  animationValue,
  height,
  frame,
  isLandscape,
}) => {
  const maskStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [1, 0, 1]);
    return {
      opacity,
    };
  }, [animationValue]);
  return (
    <SceneSelectorItem
      height={height}
      frame={frame}
      isLandscape={isLandscape}
    >
      <BlurView
        intensity={80}
        tint="dark"
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, maskStyle]}
      />
    </SceneSelectorItem>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
