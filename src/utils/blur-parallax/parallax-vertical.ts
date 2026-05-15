import { Extrapolation, interpolate } from "react-native-reanimated";

interface TBaseConfig {
  size: number;
  vertical: boolean;
}

export interface ILayoutConfig {
  parallaxScrollingOffset?: number;
  parallaxScrollingScale?: number;
  parallaxAdjacentItemScale?: number;
  /**
   * Control the horizontal "bend" of the curve.
   * Higher values = deeper curve.
   * @default 40
   */
  parallaxScrollingCurve?: number;
  parallaxScrollingCurveScale?: number;
  center?: boolean;
}

export function parallaxLayoutVertical(baseConfig: TBaseConfig, modeConfig: ILayoutConfig = {}) {
  const { size } = baseConfig;
  const {
    parallaxScrollingOffset = 100,
    parallaxScrollingScale = 1.1,
    parallaxAdjacentItemScale = 0.8,
    parallaxScrollingCurve = 100,
    parallaxScrollingCurveScale = 0.3,
    center = false
  } = modeConfig;

  return (value: number) => {
    "worklet";
    
    // 1. Vertical Positioning
    const translateY = interpolate(
      value,
      [-1, 0, 1],
      [-size + parallaxScrollingOffset, 0, size - parallaxScrollingOffset]
    );

    // 2. The Horizontal Curve (The "Pop")
    // We use a wider range [-2, -1, 0, 1, 2] to ensure 
    // smooth entry/exit for the items above and below.
    const translateX = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [
        0,                            // Far above: centered
        parallaxScrollingCurve * parallaxScrollingCurveScale, // Item above: partially out
        parallaxScrollingCurve,       // Focused item: fully out
        parallaxScrollingCurve * parallaxScrollingCurveScale, // Item below: partially out
        0                             // Far below: centered
      ],
      Extrapolation.CLAMP
    );

    // 3. Scaling
    const scale = interpolate(
      value,
      [-1, 0, 1],
      [parallaxAdjacentItemScale, parallaxScrollingScale, parallaxAdjacentItemScale],
      Extrapolation.CLAMP
    );

    // 5. Z-Index
    const zIndex = interpolate(
      value,
      [-1, 0, 1],
      [0, 100, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { translateX: center ? 0 : translateX },
        { scale },
      ],
      zIndex,
    };
  };
}