import { DivineStar } from "../../../../DivineStar";
declare const DS: DivineStar;
export function RegisterRingItems() {
  DS.itemManager.registerNewRing({
    id: "1",
    name: "Ring 1",
    description: "Ring Armor",
    levelRequirment: 1,
    statsEffect: {
      deffense: 1,
      agaility: 0,
      speed: 0,
      intellegence: 0,
      wisdom: 0,
    },
  });
}
