import { DivineStar } from "../../../../DivineStar";
declare const DS: DivineStar;
export function RegisterPotionItems() {
  DS.itemManager.registerNewPotion({
    id: "1",
    name: "Ring 1",
    description: "Ring Armor",
    levelRequirment: 1,
    onUse : ()=>{}
  });
}
