import { DivineStar } from "../../../../DivineStar";
declare const DS: DivineStar;
export function RegisterArmorItems() {
  DS.itemManager.registerNewArmor({
    id: "1",
    name: "Armor 1",
    description: "Test Armor",
    levelRequirment: 1,
    deffense: 1,
  });
}
