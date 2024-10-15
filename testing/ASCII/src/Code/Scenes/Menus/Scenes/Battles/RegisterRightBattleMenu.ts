import { ConsoleColors } from "@divineretro/ascii/Renderer/ASCIIMapping";
import { DivineStar } from "../../../../DivineStar";

declare const DS: DivineStar;

export function RegisterRightBattleMenu() {
  DS.menuSceneManager
    .registerSceneMeta("right-battle-menu")
    .addSceneToMeta("right-battle-menu", {
      id: "bump",
      animations: {},
      screenStateAnimationKeys: {},
      screenStates: {},
      rawText: {
        "1": {
          styleMap: "1",
map: 
`******************************
|             ┌┐             |
|            ┌┘└┐            |
|           ┌┘  └┐           |
|          ┌┘    └┐          |
|         ┌┘  ┌┐  └┐         |
|        ┌┘  ┌┘└┐  └┐        |
|       ┌┘  ┌┘00└┐  └┐       |
|      ┌┘  ┌┘ 00 └┐  └┐      |
|      │   │  00  │   │      |
|      └┐  └┐ 00 ┌┘  ┌┘      |
|       └┐  └┐00┌┘  ┌┘       |
|        └┐  └┐┌┘  ┌┘        |
|         └┐  └┘  ┌┘         |
|          └┐    ┌┘          |
|           └┐  ┌┘           |
|            └┐┌┘            |
|             └┘             |
******************************`,
        },
      },
      styleMap: {
        "1": {
          fg: ConsoleColors.Purple,
          dim: true,
        },
      },
      activeAnimationScreenState: "",
      activeEntityMap: "1",
      entityMap: { 
        "1"  : {
          entityName : "MelEyesEntity",
          type : "",
          data : {}
        }

      },
      entityMapRaw: {
"1": 
`******************************
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|            1               |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
******************************`,  
      },
    })
    .addSceneToMeta("right-battle-menu", {
      id: "1",
      animations: {},
      screenStateAnimationKeys: {},
      screenStates: {},
      rawText: {
        "1": {
          styleMap: "1",
map: 
`******************************
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
******************************`,
        },
      },
      styleMap: {
        "1": {
          fg: ConsoleColors.Cyan,
          dim: true,
        },
      },
      activeAnimationScreenState: "",
      activeEntityMap: "1",
      entityMap: {
        "1"  : {
          entityName : "RightBattleMenu",
          type : "",
          data : {}
        }


      },
      entityMapRaw: {
"1": 
`******************************
|1                           |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
******************************`,
      },
    });
}
