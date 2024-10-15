import "./Init/SetUpConstants";
import { DivineStar } from "./DivineStar";
import { RegisterAllEntites } from "./Entites/RegisterAllEntites";
import { ImportAllLevels as RegisterAllLevels } from "./Scenes/Levels/Register/ImportAllLevel";
import { RegisterAllBattleScenes } from "./Scenes/BattleScenes/Register/RegisterAllBattleScenes";
import { RegisterAllMenuScenes } from "./Scenes/Menus/Scenes/RegisterAllMenuScenes";
import { RegisterAllFearForms } from "./Forms/Register/RegisterAllFearForms";
import { RegisterAllMenuEntities } from "./Scenes/Menus/Menus/RegisterAllMenuEntites";
import { RegisterAllItems } from "./Inventory/Items/Register/RegisterAllItems";
import { ASCIIRender } from "@divineretro/ascii/Renderer/ASCIIRenderer";
export async function StartGame(renderer: ASCIIRender) {
  const DS = new DivineStar(renderer);
  (window as any).DS = DS;
  for (let r = 0; r < renderer.rows; r++) {
    for (let c = 0; c < renderer.cols; c++) {
    //  renderer.setCharAt(renderer.bufferIndex.getIndexXY(c, r) % 256, r, c);
      // renderer.setStringAt("█", r, c);
    }
  }
  renderer.entityTool.update();

  if (SOUNDENABLED) {
    //  await DS.audioManager.audioCom.$init();
    //  await DS.audioManager.audioCom.$awaitConnection();
  }

  await Promise.all([
    RegisterAllLevels(),
    RegisterAllItems(),
    RegisterAllFearForms(),
    RegisterAllEntites(),
    RegisterAllBattleScenes(),
    RegisterAllMenuScenes(),
    RegisterAllMenuEntities(),
  ]);

  await DS.gameInit();

  //onInput
  DS.controlManager.onInput("m",()=>{
    if (
      !DS.menuSceneManager.rightMenuDrawer.active &&
      !DS.menuSceneManager.rightMenuDrawer.animating
    ) {
      DS.menuSceneManager.rightMenuDrawer.popOut();
    } else if (!DS.menuSceneManager.rightMenuDrawer.animating) {
      DS.menuSceneManager.rightMenuDrawer.popIn();
    }
  })


}
