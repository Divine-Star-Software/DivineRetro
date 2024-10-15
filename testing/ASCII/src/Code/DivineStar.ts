import { ScreenTransitions } from "./Animations/ScreenTransitions";
import { EntityManager } from "./Entites/EntityManager";
import { LevelManager } from "./Scenes/Levels/LevelManager";
import { Player } from "./Player/Player";
import { BattleSceneManager } from "./Scenes/BattleScenes/BattleSceneManager";
import { Engine } from "./Engine/Engine";
import { SceneProcessor } from "./Scenes/SceneProcessor";
import { BattleManager } from "./Battles/BattleManager";
import { FearFormManager } from "./Forms/FearFormManager";
import { BattleDrawer } from "./Battles/BattleDrawer";
import { AnimationHelper } from "./Animations/AnimationHelper";
import { AudioManager } from "./Audio/AudioManager";
import { MenuSceneManager } from "./Scenes/Menus/MenuSceneManager";
import { ControlManager } from "./Controls/ControlManager";
import { InventoryManager } from "./Inventory/InventoryManager";
import { ItemManager } from "./Inventory/Items/ItemManager";
import { PlayerData } from "./Data/PlayerData/PlayerData";
import { WorldData } from "./Data/WorldData/WolrdData";
import { ASCIIRender } from "@divineretro/ascii/Renderer/ASCIIRenderer";

export class DivineStar {
  engine: Engine;
  battleDrawer: BattleDrawer = new BattleDrawer(this);
  battleManager: BattleManager = new BattleManager(this);
  sceneProcessor: SceneProcessor = new SceneProcessor(this);
  fearFormManager: FearFormManager = new FearFormManager(this);
  player: Player;
  playerData: PlayerData = new PlayerData(this);
  menuSceneManager: MenuSceneManager;
  levelManager: LevelManager = new LevelManager(this);
  battleSceneManager: BattleSceneManager = new BattleSceneManager(this);
  entityManager: EntityManager;
  audioManager: AudioManager = new AudioManager(this);
  controlManager: ControlManager = new ControlManager(this);
  screenTranistions: ScreenTransitions = new ScreenTransitions(this);
  animationHelper: AnimationHelper = new AnimationHelper(this);
  inventoryManager: InventoryManager = new InventoryManager(this);
  itemManager: ItemManager = new ItemManager(this);
  worldData: WorldData = new WorldData(this);
  drawInterval: any;
  logicInterval: any;
  title = "";
  screenBorder = ``;

  constructor(public renderer: ASCIIRender) {
    this.engine = new Engine(renderer, this);
    this.player = new Player(renderer, this);
    this.menuSceneManager = new MenuSceneManager(this);
    this.entityManager = new EntityManager(renderer, this);
  }

  gameInit() {
    this.levelManager.setActiveSceneMeta("overworld");
    this.levelManager.setActiveScene("overworld", "1");
    this.menuSceneManager.bottomMenuDrawer.setActiveMenuScene(
      "bottom-menu",
      "1"
    );
    this.menuSceneManager.bottomRightMenuDrawer.setActiveMenuScene(
      "bottom-right-menu",
      "1"
    );
    this.engine.runGameLoop();
    if (SOUNDENABLED) {
      this.audioManager.playSong("overworld", true);
    }
  }
}
