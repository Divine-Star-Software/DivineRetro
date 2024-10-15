import { DivineStar } from "../../../../DivineStar";
declare const DS: DivineStar;
export function RegisterOtherItems() {
  DS.itemManager.registerNewOtherItem({
    id: "1",
    name: "Other 1",
    description: "Other Test 1",
    levelRequirment: 1,
  });
}
