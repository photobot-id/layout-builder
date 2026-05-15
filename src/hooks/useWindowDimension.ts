import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type ScreenDimensionsHook = {
  screen: ScaledSize;
  isLandscape: boolean;
}
export const useScreenDimensions = ():ScreenDimensionsHook => {
  const [screenData, setScreenData] = useState<ScaledSize>(Dimensions.get('window'));
  const isLandscape = screenData.width > screenData.height;
  useEffect(() => {
    const onChange = ({ screen }: { window: ScaledSize; screen: ScaledSize }) => {
      setScreenData(screen);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);
  return {
    screen: screenData,
    isLandscape
  };
};