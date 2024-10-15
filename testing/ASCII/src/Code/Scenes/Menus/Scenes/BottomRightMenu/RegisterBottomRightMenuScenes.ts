import { ConsoleColors } from "@divineretro/ascii/Renderer/ASCIIMapping";
import { DivineStar } from "../../../../DivineStar"


declare const DS : DivineStar;

export function RegisterBottomRightMenuScenes () {

    DS.menuSceneManager.registerSceneMeta("bottom-right-menu")
    .addSceneToMeta("bottom-right-menu", {
        id: "1",
        animations: {},
        screenStateAnimationKeys: {},
        screenStates: {},
        rawText: {
          "1": {
            styleMap: "1",
map:`│                            │                         
│                            │                                                  
│                            │ 
│                            │                                              
│                            │                                                   
│                            │                                              
│                            │                                                 
│                            │                                                
└────────────────────────────┘`    
          },
        },
        styleMap: {
          "1": {
         
          },
        },
        activeAnimationScreenState: "",
        activeEntityMap: "1",
        entityMap: {
          "1"  : {
            entityName : "MelEyesEntity",
            type : "bottom-right-bar",
            data : {}
          }
  
  
        },
        entityMapRaw: {
  "1": 
`│                            │                         
│                            │                                                   
│                            │   
│                            │                                                 
│                            │                                                   
│                            │                                                 
│                            │                                                   
│                            │                                                 
└────────────────────────────┘`
        },
      })
      .addSceneToMeta("bottom-right-menu", {
        id: "2",
        animations: {},
        screenStateAnimationKeys: {},
        screenStates: {},
        rawText: {
          "1": {
            styleMap: "1",
map: `│                            │ 
│   /─\\                      │
│  ┌┘0└┐                     │
│ / /0\\ \\                    │
││  │0│  │                   │
│ \\ \\0/ /                    │
│  └┐0┌┘                     │
│   \\─/                      │
└────────────────────────────┘ `
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
            type : "bottom-right-bar",
            data : {}
          },
          "2"  : {
            entityName : "MelStatsEntity",
            type : "bottom-bar",
            data : {}
          }
  
  
        },
        entityMapRaw: {
  "1": 
`│                            │                         
│          2                 │                                                   
│   1                        │   
│                            │                                                 
│                            │                                                   
│                            │                                                 
│                            │                                                   
│                            │                                                 
└────────────────────────────┘`                                              

        },
      })



}