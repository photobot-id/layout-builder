import { FlatList, Platform, StyleSheet, View } from "react-native";
import { SceneSelectorProp } from "../../../types/scene";
import { useCallback, useState } from "react";
import SceneSelectorItem from "./scene-selector-item";

type Props = {
  scenes: SceneSelectorProp[];
  frame: string;
};

export default function SceneSelectorColumn(props: Props) {
  const [viewSize, setViewSize] = useState<{
    height: number;
    width: number;
  }>();
  const renderItem = useCallback(
    ({ item }: { item: SceneSelectorProp }) => {
      if (viewSize) {
        const isLandscape = viewSize.width > viewSize.height;
        let scaleFactor = Math.round(props.scenes.length / 2) + 1;

        if (props.scenes.length > 6) {
          scaleFactor = 4;
        }
        if (isLandscape && Platform.OS === "web") {
          scaleFactor = scaleFactor - 0.3;
        }

        let itemHeight = viewSize.height / scaleFactor;
        return (
          <View
            style={{
              margin: viewSize.height * 0.02,
              height: itemHeight,
              width: isLandscape ? (itemHeight * 3) / 2 : (itemHeight * 2) / 3,
            }}
          >
            <SceneSelectorItem
              frame={props.frame}
              isLandscape={isLandscape}
              height={itemHeight}
            />
          </View>
        );
      }
      return null;
    },
    [viewSize],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: viewSize ? viewSize.height * 0.05 : undefined },
      ]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setViewSize((prev) => {
          if (!prev || prev.width !== width || prev.height !== height) {
            return { width, height };
          }
          return prev;
        });
      }}
    >
      <FlatList
        data={props.scenes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // This sets the grid to 2 items per row
        columnWrapperStyle={styles.row} // Spaces the items out
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%", // Explicitly ensure it takes full width in Electron
    padding: 20,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 20, // Give it some breathing room at the bottom
  },
  row: {
    // In Electron/Web, space-around works best for grids
    justifyContent: "center",
  },
  itemWrapper: {
    margin: 10,
    // Ensure the wrapper doesn't shrink to 0 width on Web
    flex: 0.5,
    maxWidth: "50%",
  },
});
