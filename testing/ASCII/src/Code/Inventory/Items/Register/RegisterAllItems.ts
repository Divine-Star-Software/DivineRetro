import { RegisterArmorItems } from "./Armor/RegisterArmorItems";
import { RegisterOtherItems } from "./Other/RegisterOtherItems";
import { RegisterPotionItems } from "./Potion/RegisterRingItems";
import { RegisterRingItems } from "./Rings/RegisterRingItems";
import { RegisterStoryItems } from "./Story/RegisterStoryItems";
import { RegisterWeaponItems } from "./Weapons/RegisterWeaponItems";

export async function RegisterAllItems() {
    RegisterArmorItems();
    RegisterRingItems();
    RegisterWeaponItems();
    RegisterPotionItems();
    RegisterOtherItems();
    RegisterStoryItems();
}