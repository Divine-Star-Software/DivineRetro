import { DivineStar } from "../../../../DivineStar";
declare const DS: DivineStar;
export function RegisterStoryItems() {
  DS.itemManager.registerNewStoryItem({
    id: "1",
    name: "Story 1",
    description: "Story 1",
    levelRequirment: 1,
    onUse : ()=>{}
  });
}
