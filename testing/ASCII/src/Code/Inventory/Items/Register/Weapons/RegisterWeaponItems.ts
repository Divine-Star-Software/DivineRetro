import { DivineStar } from "../../../../DivineStar";
declare const DS: DivineStar;
export function RegisterWeaponItems() {
  DS.itemManager.registerNewWeapon({
    id: "1",
    name: "Weapon 1",
    description: "Test Weapon",
    levelRequirment: 1,
    attack: 1,
  });
}
