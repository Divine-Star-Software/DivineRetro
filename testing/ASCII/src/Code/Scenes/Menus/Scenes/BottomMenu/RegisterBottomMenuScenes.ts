import { ConsoleColors } from "@divineretro/ascii/Renderer/ASCIIMapping";
import { DivineStar } from "../../../../DivineStar";

declare const DS: DivineStar;

export function RegisterBottomMenuScenes() {
  DS.menuSceneManager
    .registerSceneMeta("bottom-menu")
    .addSceneToMeta("bottom-menu", {
      id: "1",
      animations: {},
      screenStateAnimationKeys: {},
      screenStates: {},
      rawText: {
        "1": {
          styleMap: "1",
          map: `│                                                │
│   /─\\                                          │
│  ┌┘0└┐                                         │
│ / /0\\ \\                                        │
││  │0│  │                                       │
│ \\ \\0/ /                                        │
│  └┐0┌┘                                         │
│   \\─/                                          │
└────────────────────────────────────────────────┘`,
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
        "1": {
          entityName: "MelEyesEntity",
          type: "bottom-bar",
          data: {},
        },
        "2": {
          entityName: "MelStatsEntity",
          type: "bottom-bar",
          data: {},
        },
        "3": {
          entityName: "WorldDataDisplayEntity",
          type: "bottom-bar",
          data: {},
        },
      },
      entityMapRaw: {
        "1": `│                                              │
  │       2                  3                     │
  │  1                                             │
  │                                                │
  │                                                │
  │                                                │
  │                                                │
  │                                                │
  └────────────────────────────────────────────────┘`,
      },
    })
    .addSceneToMeta("bottom-menu", {
      id: "2",
      animations: {},
      screenStateAnimationKeys: {
        "1": [
          {
            stateName: "1",
            inteerval: 85,
          },
          {
            stateName: "2",
            inteerval: 3,
          },
          {
            stateName: "3",
            inteerval: 3,
          },
          {
            stateName: "4",
            inteerval: 3,
          },
          {
            stateName: "5",
            inteerval: 3,
          },
          {
            stateName: "5",
            inteerval: 300,
          },
        ],
      },
      screenStates: {},
      rawText: {
        "1": {
          styleMap: "1",
          map: `│                                                │
│ /█▔▔▔█▔▔▔█▔▔▔█▔▔▔▔█▔▔▔██▔▔▔█▔▔▔▔█▔▔▔█▔▔▔█▔▔▔█\\ │
││ █   █   █   █   /▔▔▔▔▔▔▔▔▔▔\\   █   █   █   █ ││
││/▔\\ /▔\\ /▔\\ /▔\\ / /▔▔▔▔▔▔▔▔\\ \\ /▔\\ /▔\\ /▔\\ /▔\\││
││000│000│000│000│<000000000000>│000│000│000│000││
││\\▁/ \\▁/ \\▁/ \\▁/ \\ \\▁▁▁▁▁▁▁▁/ / \\▁/ \\▁/ \\▁/ \\▁/││
││ █   █   █   █   \\▁▁▁▁▁▁▁▁▁▁/   █   █   █   █ ││
│ \\█▁▁▁█▁▁▁█▁▁▁█▁▁▁▁█▁▁▁██▁▁▁█▁▁▁▁█▁▁▁█▁▁▁█▁▁▁█/ │
└────────────────────────────────────────────────┘`,
        },
        "2": {
          styleMap: "1",
          map: `│                                                │
│ /█▔▔▔█▔▔▔█▔▔▔█▔▔▔▔█▔▔▔██▔▔▔█▔▔▔▔█▔▔▔█▔▔▔█▔▔▔█\\ │
││ █   █   █   █   /▔▔▔▔▔▔▔▔▔▔\\   █   █   █   █ ││
││/▔\\ /▔\\ /▔\\ /▔\\ / /▔▔▔▔▔▔▔▔\\ \\ /▔\\ /▔\\ /▔\\ /▔\\││
│                                                │
││\\▁/ \\▁/ \\▁/ \\▁/ \\ \\▁▁▁▁▁▁▁▁/ / \\▁/ \\▁/ \\▁/ \\▁/││
││ █   █   █   █   \\▁▁▁▁▁▁▁▁▁▁/   █   █   █   █ ││
│ \\█▁▁▁█▁▁▁█▁▁▁█▁▁▁▁█▁▁▁██▁▁▁█▁▁▁▁█▁▁▁█▁▁▁█▁▁▁█/ │
└────────────────────────────────────────────────┘`,
        },
        "3": {
          styleMap: "1",
          map: `│                                                │
││ █   █   █   █   /▔▔▔▔▔▔▔▔▔▔\\   █   █   █   █ ││
││/▔\\ /▔\\ /▔\\ /▔\\ / /▔▔▔▔▔▔▔▔\\ \\ /▔\\ /▔\\ /▔\\ /▔\\││
│                                                │
│                                                │
│                                                │
││\\▁/ \\▁/ \\▁/ \\▁/ \\ \\▁▁▁▁▁▁▁▁/ / \\▁/ \\▁/ \\▁/ \\▁/││
││ █   █   █   █   \\▁▁▁▁▁▁▁▁▁▁/   █   █   █   █ ││
└────────────────────────────────────────────────┘`,
        },
        "4": {
          styleMap: "1",
          map: `│                                                │
││/▔\\ /▔\\ /▔\\ /▔\\ / /▔▔▔▔▔▔▔▔\\ \\ /▔\\ /▔\\ /▔\\ /▔\\││
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
││\\▁/ \\▁/ \\▁/ \\▁/ \\ \\▁▁▁▁▁▁▁▁/ / \\▁/ \\▁/ \\▁/ \\▁/││
└────────────────────────────────────────────────┘`,
        },
        "5": {
          styleMap: "1",
          map: `│                                              │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
└────────────────────────────────────────────────┘`,
        },
      },
      styleMap: {
        "1": {
          fg: ConsoleColors.Purple,
          dim: true,
        },
      },
      activeAnimationScreenState: "1",
      activeEntityMap: "1",
      entityMap: {
        "1": {
          entityName: "MelEyesEntity",
          type: "",
          data: {},
        },
      },
      entityMapRaw: {
        "1": `│                                              │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
└────────────────────────────────────────────────┘`,
      },
    });
}
