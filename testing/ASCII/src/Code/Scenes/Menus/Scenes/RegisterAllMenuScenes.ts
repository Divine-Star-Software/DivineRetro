import { RegisterRightBattleMenu } from "./Battles/RegisterRightBattleMenu";
import { RegisterBottomMenuScenes } from "./BottomMenu/RegisterBottomMenuScenes";
import { RegisterBottomRightMenuScenes } from "./BottomRightMenu/RegisterBottomRightMenuScenes";

export async function RegisterAllMenuScenes() {
    RegisterRightBattleMenu();
    RegisterBottomMenuScenes();
    RegisterBottomRightMenuScenes();
}