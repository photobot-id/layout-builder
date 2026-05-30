import SceneSelectorColumn from "@components/scene-selector/scene-selector-column";
import SceneSelectorParalax from "@components/scene-selector/scene-selector-paralax";
import SceneSelectorParalaxVertical from "@components/scene-selector/scene-selector-paralax-vertical";
import ScenerSelectorStack from "@components/scene-selector/scene-selector-stacked";
import {
  View,
} from "react-native";
import { SceneSelectorProp } from "types/scene";


export type SelectorProps = {
  selectorType: "COLUMN" | "VERTICAL" | "HORIZONTAL" | "WALL";
  selectorPosition?: "LEFT" | "RIGHT" | "CENTER" | "BOTTOM";
  selectorSize?: "LARGE" | "SMALL" | "MEDIUM";
  selectorMode?: "LEFT" | "RIGHT" | "CENTER";
  frame: string;
};

const scenes: SceneSelectorProp[] = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
  { id: "4", title: "Item 4" },
];

export default function SceneSelector(props: SelectorProps) {
  switch (props.selectorType) {
    case "COLUMN":
      return <SceneSelectorColumn scenes={scenes} frame={props.frame}/>
    case "HORIZONTAL":
      return <SceneSelectorParalax scenes={scenes} frame={props.frame} size={props.selectorSize as "LARGE" | "SMALL"} position={props.selectorPosition as "BOTTOM" | "CENTER"}/>
    case "VERTICAL":
      return <SceneSelectorParalaxVertical scenes={scenes} frame={props.frame} size={props.selectorSize as "SMALL" | "MEDIUM" | "LARGE"} position={props.selectorPosition as "LEFT" | "RIGHT" | "CENTER"} mode={props.selectorMode}/>
    case "WALL":
      return <ScenerSelectorStack scenes={scenes} frame={props.frame}/>
    default:
      return <View/>;
  }
}