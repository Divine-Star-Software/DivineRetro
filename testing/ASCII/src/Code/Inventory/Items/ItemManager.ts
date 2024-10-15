import { DivineStar } from "../../DivineStar";
import {
  ArmorItemInterface,
  ItemInterface,
  PotionItemInterface,
  RingItemInterface,
  StoryItemInterface,
  WeaponItemInterface,
} from "../../meta/Inventory/Inventory.type";

export class ItemManager {
  constructor(public DS: DivineStar) {}

  items: {
    potion: Record<string, PotionItemInterface>;
    ring: Record<string, RingItemInterface>;
    weapon: Record<string, WeaponItemInterface>;
    armor: Record<string, ArmorItemInterface>;
    other: Record<string, ItemInterface>;
    story: Record<string, StoryItemInterface>;
  } = {
    potion:{},
    ring: {},
    weapon: {},
    armor: {},
    other: {},
    story: {},
  };

  registerNewWeapon(data: WeaponItemInterface) {
    this.items.weapon[data.id] = data;
  }
  registerNewPotion(data: PotionItemInterface) {
    this.items.potion[data.id] = data;
  }
  registerNewRing(data: RingItemInterface) {
    this.items.ring[data.id] = data;
  }
  registerNewArmor(data: ArmorItemInterface) {
    this.items.armor[data.id] = data;
  }
  registerNewStoryItem(data: StoryItemInterface) {
    this.items.story[data.id] = data;
  }
  registerNewOtherItem(data: ItemInterface) {
    this.items.other[data.id] = data;
  }


}
