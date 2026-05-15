import { LayoutChangeEvent, StyleSheet, View } from "react-native";

import { BlurView as _BlurView } from "expo-blur";
import { useCallback, useMemo, useState } from "react";
import { SceneSelectorProp } from "../../../types/scene";
import SceneSelectorItem from "./scene-selector-item";

type Props = {
  scenes: SceneSelectorProp[];
  frame: string;
};

export default function ScenerSelectorStack(props: Props) {
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
      {viewSize ? (
        <SceneWallSelector
          data={props.scenes}
          renderItem={(scene, index, rowCount, incrementer) => {
            const height = viewSize.height / (rowCount + incrementer);
            const isLandscape = viewSize.width > viewSize.height;
            const itemWidth = isLandscape ? (height * 3) / 2 : (height * 2) / 3;
            return (
              <View
                style={{
                  width: itemWidth,
                  height: height,
                  marginHorizontal: viewSize.height * 0.005,
                  marginVertical: viewSize.height * 0.02,
                }}
              >
                <SceneSelectorItem
                  height={height}
                  frame={props.frame}
                  isLandscape={isLandscape}
                />
              </View>
            );
          }}
        />
      ) : null}
    </View>
  );
}

function buildSceneRows<T>(data: T[]): T[][] {
  const len = data.length;

  if (len <= 3) return [data];

  if (len <= 7) {
    return [data.slice(0, 3), data.slice(3)];
  }

  if (len <= 11) {
    return [data.slice(0, 3), data.slice(3, 7), data.slice(7)];
  }

  // 12+
  return [
    data.slice(0, 3),
    data.slice(3, 7),
    data.slice(7, 11),
    data.slice(11),
  ];
}

type SceneWallSelectorProps<T> = {
  data: T[];
  gap?: number;
  renderItem: (
    item: T,
    index: number,
    rowCount: number,
    incrementer: number,
  ) => React.ReactElement;
};

export function SceneWallSelector<T>({
  data,
  gap = 12,
  renderItem,
}: SceneWallSelectorProps<T>) {
  const rows = useMemo(() => buildSceneRows(data), [data]);
  let globalIndex = 0;
  const rowCount = rows.length;
  let incrementer = 2;
  if (data.length <= 7) {
    incrementer = incrementer + 0.5;
  }

  return (
    <View style={styles.selectorContainer}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.row,
            {
              justifyContent: "center",
            },
          ]}
        >
          {row.map((item) => {
            const element = renderItem(
              item,
              globalIndex,
              rowCount,
              incrementer,
            );
            globalIndex++;
            return (
              <View
                key={globalIndex}
                style={{
                  marginHorizontal: gap / 2,
                }}
              >
                {element}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorContainer: {
    width: "100%",
    alignItems: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
});
