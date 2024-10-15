import { RegisterOverWorldBattleScenes } from "./RegisterOverWorldBattleScenes";
import { RegisterBattleTransitionFrames } from "./Scenes/RegisterBattleTransitionFrames";


export async function RegisterAllBattleScenes() {

    RegisterBattleTransitionFrames();
    RegisterOverWorldBattleScenes();

}