import { ConsoleColors } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type  { DivineStar } from "../../../DivineStar";

declare const DS : DivineStar;

export async function RegisterOverWorldBattleScenes() {

    DS.battleSceneManager.registerSceneMeta("over-world-1")
    .addSceneToMeta("over-world-1", {
        id: "1",
        animations: {
        },
        screenStateAnimationKeys: {},
        screenStates: {},
        rawText: {
          "1": {
            styleMap: "1",
map: `**************************************************
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
**************************************************`,
          }

        },
        styleMap: {
          "1": {
            fg : ConsoleColors.Red,

          },
        },
      activeAnimationScreenState: "",
      activeEntityMap: "",
      entityMap: {},
      entityMapRaw: {},
      })
}