import { StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { EntityData } from "../EntityData.structure";

export type SceneTypes = "level" | "menu" | "right-menu" | "bottom-right-menu" | "bottom-menu" | "battle";

export type SceneMap = Record<string, SceneInterface>;

export type SceneKeyMap = {
  id: string;
  scene: SceneMap;
};

export type SceneMetaMap = Record<string, SceneKeyMap>;

export type StateAnimationKey = {
  inteerval: number;
  styleMap?: string;
  stateName: string;
}[];

export type AnimationKey = {
  animText: string[];
  animDirection?: "up" | "down";
  style: Partial< StyleObject>;
  interval: number;
  row: number;
  col: number;
};

type SceneRawText = { styleMap: string; map: string };

export type SceneInterface = {
  id: string;
  activeAnimationScreenState: string;
  activeEntityMap: string;
  entityLocations?: Record<
    string,
    { x: number; y: number; data: EntityData }[]
  >;
  entityMap: Record<string, EntityData>;
  entityMapRaw: Record<string, string>;
  animations: Record<string, AnimationKey[]>;
  screenStateAnimationKeys: Record<string,StateAnimationKey>;
  styleMap: Record<string, Partial<StyleObject>>;
  rawText: Record<string, SceneRawText>;
  screenStates: Record<string, string[]>;
};

export type LevelScene = SceneInterface & {
  collisionMapsRaw: Record<string, string>;
  collisionMaps: Record<string, string[]>;
  bottomScrene: false | string;
  topScrene: false | string;
  rightScrene: false | string;
  leftScrene: false | string;
  rawText: Record<string, SceneRawText & { collisionMap: string }>;
};


export type BattleScene = SceneInterface & {
  collisionMapsRaw: Record<string, string>;
  collisionMaps: Record<string, string[]>;
};
