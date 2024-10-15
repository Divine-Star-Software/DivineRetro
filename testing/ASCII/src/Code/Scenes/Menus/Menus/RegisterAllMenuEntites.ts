import type { DivineStar } from "../../../DivineStar";
import { RightBattleMenu } from "./RightBattleMenu";

declare const DS : DivineStar;

export function RegisterAllMenuEntities() {


    DS.entityManager.registerEntity("RightBattleMenu",RightBattleMenu);


}