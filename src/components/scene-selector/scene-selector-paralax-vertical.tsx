import { StyleSheet, View, Platform, LayoutChangeEvent } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { BlurView as _BlurView } from "expo-blur";
import { parallaxLayoutVertical } from "@utils/blur-parallax/parallax-vertical";
import { SceneSelectorProp } from "../../../types/scene";
import { useCallback, useEffect, useMemo, useState } from "react";
import SceneSelectorItem from "./scene-selector-item";

const BlurView = Animated.createAnimatedComponent(_BlurView);

type Props = {
  scenes: SceneSelectorProp[];
  position?: "LEFT" | "RIGHT" | "CENTER";
  orientation?: "LEFT" | "RIGHT" | "CENTER";
  size?: "SMALL" | "MEDIUM" | "LARGE";
  frame: string;
};

// 411,4285583496094

const getConfig = (VIEW_WIDTH: number, VIEW_HEIGHT: number) => {
  const isLandscape = VIEW_WIDTH > VIEW_HEIGHT;
  
  return {
    SMALL: {
      parallaxOffset: (orientation: Props["orientation"]) => {
        const pOffset =
          orientation === "CENTER"
            ? VIEW_HEIGHT * 0.024305556328208
            : VIEW_HEIGHT * 0.052916668984625;
        return pOffset + -VIEW_HEIGHT * 0.018611112656417;
      },
      scale: 4.5,
      // Horizontal mapping: [orientation][position]
      offsets: {
        RIGHT: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.5 : VIEW_WIDTH * 0.4,
          LEFT: isLandscape ? VIEW_WIDTH * -0.2 : VIEW_WIDTH * -0.15,
          CENTER: isLandscape ? VIEW_WIDTH * 0.15 : VIEW_WIDTH * 0.1,
        },
        LEFT: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.7 : VIEW_WIDTH * 0.56,
          LEFT: isLandscape ? VIEW_WIDTH * 0.01 : VIEW_WIDTH * 0.02,
          CENTER: isLandscape ? VIEW_WIDTH * 0.35 : VIEW_WIDTH * 0.3,
        },
        CENTER: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.62 : VIEW_WIDTH * 0.51,
          LEFT: isLandscape ? VIEW_WIDTH * -0.12 : VIEW_WIDTH * -0.1,
          CENTER: isLandscape ? VIEW_WIDTH * 0.25 : VIEW_WIDTH * 0.2,
        },
      },
    },
    MEDIUM: {
      parallaxOffset: (orientation: Props["orientation"]) => {
        const pOffset =
          orientation === "CENTER"
            ? VIEW_HEIGHT * 0.024305556328208
            : VIEW_HEIGHT * 0.052916668984625;
        return pOffset + -VIEW_HEIGHT * 0.018611112656417;
        // return Platform.OS === "android" ? VIEW_HEIGHT * 0.048611112656417 : VIEW_HEIGHT * 0.048611112656417;
      },
      scale: 3,
      offsets: {
        RIGHT: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.4 : VIEW_WIDTH * 0.3,
          LEFT: isLandscape ? VIEW_WIDTH * -0.15 : VIEW_WIDTH * -0.13,
          CENTER: isLandscape ? VIEW_WIDTH * 0.12 : VIEW_WIDTH * 0.1,
        },
        LEFT: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.65 : VIEW_WIDTH * 0.52,
          LEFT: isLandscape ? VIEW_WIDTH * 0.1 : VIEW_WIDTH * 0.12,
          CENTER: isLandscape ? VIEW_WIDTH * 0.38 : VIEW_WIDTH * 0.3,
        },
        CENTER: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.58 : VIEW_WIDTH * 0.45,
          LEFT: isLandscape ? VIEW_WIDTH * -0.08 : VIEW_WIDTH * -0.05,
          CENTER: isLandscape ? VIEW_WIDTH * 0.25 : VIEW_WIDTH * 0.2,
        },
      },
    },
    LARGE: {
      // This handles your 'default' or a specific Large case
      parallaxOffset: (orientation: Props["orientation"]) => {
        const pOffset =
          orientation === "CENTER"
            ? VIEW_HEIGHT * 0.024305556328208
            : VIEW_HEIGHT * 0.052916668984625;
        return pOffset + -VIEW_HEIGHT * 0.018611112656417;
      },
      scale: 2,
      offsets: {
        RIGHT: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.35 : VIEW_WIDTH * 0.2,
          LEFT: isLandscape ? VIEW_WIDTH * -0.1 : VIEW_WIDTH * -0.15,
          CENTER: isLandscape ? VIEW_WIDTH * 0.12 : VIEW_WIDTH * 0.05,
        },
        LEFT: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.6 : VIEW_WIDTH * 0.55,
          LEFT: isLandscape ? VIEW_WIDTH * 0.15 : VIEW_WIDTH * 0.18,
          CENTER: isLandscape ? VIEW_WIDTH * 0.37 : VIEW_WIDTH * 0.4,
        },
        CENTER: {
          RIGHT: isLandscape ? VIEW_WIDTH * 0.5 : VIEW_WIDTH * 0.35,
          LEFT: isLandscape ? VIEW_WIDTH * 0.01 : VIEW_WIDTH * 0.05,
          CENTER: isLandscape ? VIEW_WIDTH * 0.25 : VIEW_WIDTH * 0.2,
        },
      },
    },
  };
};

export default function SceneSelectorParalaxVertical(props: Props) {
  const [viewSize, setViewSize] = useState<{
    height: number;
    width: number;
  } | null>(null);

  const config = useMemo(() => {
    if (!viewSize) return null;
    return getConfig(viewSize.width, viewSize.height);
  }, [viewSize]);

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
      style={[
        styles.container,
        { paddingBottom: viewSize ? viewSize.height * 0.05 : undefined },
      ]}
      onLayout={onLayout}
    >
      {config !== null && viewSize !== null ? (
        <SceneSelectorParalaxVerticalContainer
          {...props}
          CONFIG={config}
          viewHeight={viewSize.height}
          viewWidth={viewSize.width}
          frame={props.frame}
        />
      ) : null}
    </View>
  );
}

function SceneSelectorParalaxVerticalContainer({
  size = "MEDIUM",
  orientation = "LEFT",
  position = "LEFT",
  scenes,
  CONFIG,
  viewWidth,
  viewHeight,
  frame,
}: Props & {
  CONFIG: ReturnType<typeof getConfig>;
  viewWidth: number;
  viewHeight: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const config = CONFIG[size] || CONFIG.LARGE;
  const parallaxScrollingOffset = config.parallaxOffset(orientation);
  const offset = config.offsets[orientation][position];

  const scaleFactor = config.scale;
  const CARAOSEL_WIDTH = viewWidth / 2;
  const CARAOSEL_HEIGHT = viewHeight / scaleFactor;
  const [ch, setCh] = useState(CARAOSEL_HEIGHT);
  const isLandscape = viewWidth > viewHeight;
  const cb = (index: number) => {
    if (currentIndex === index) {
      console.log("pressed");
    }
  };

  useEffect(() => {
    if (CARAOSEL_HEIGHT !== undefined && CARAOSEL_HEIGHT > 0) {
      setCh(CARAOSEL_HEIGHT);
    }
  }, [CARAOSEL_HEIGHT]);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        style={{
          left: offset,
          width: CARAOSEL_WIDTH,
          height: CARAOSEL_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
        }}
        // @ts-ignore
        contentContainerStyle={{
          width: CARAOSEL_WIDTH,
          overflow: "hidden",
        }}
        data={scenes}
        onSnapToItem={(index) => setCurrentIndex(index)}
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
        customAnimation={parallaxLayoutVertical(
          {
            size: CARAOSEL_HEIGHT,
            vertical: true,
          },
          {
            parallaxScrollingScale: orientation === "CENTER" ? 1 : 0.8,
            parallaxAdjacentItemScale:
              orientation === "CENTER" ? 0.7 : size === "SMALL" ? 0.7 : 0.8,
            parallaxScrollingOffset: parallaxScrollingOffset,
            parallaxScrollingCurve:
              (size === "SMALL"
                ? viewWidth * 0.14583333796925
                : viewWidth * 0.194444450625667) *
              (orientation === "LEFT" ? -1 : 1),
            center: orientation === "CENTER",
          },
        )}
        vertical
        height={ch}
        scrollAnimationDuration={1200}
      />
    </View>
  );
}

type ItemProps = {
  animationValue: SharedValue<number>;
  height: number;
  isLandscape: boolean;
  frame: string;
};
const CustomItem: React.FC<ItemProps> = ({
  animationValue,
  height,
  isLandscape,
  frame,
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
  container: { flex: 1, justifyContent: "center" },
});
