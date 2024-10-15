
export type ItemTypes 
= "potion" | "ring" | "weapon" | "armor" | "other" | "story";
export type EquipSlots = "armor" | "ring" | "weapon";

export type ItemInInventoryInterface = {
    id : string,
    amount : number,
}


type StatsEffect = {
    deffense : number,
    agaility : number,
    speed : number,
    intellegence : number, 
    wisdom : number,
}

export type ItemInterface = {
    id : string,
    name : string,
    description : string,
    levelRequirment : number
}

export type StoryItemInterface = ItemInterface & {
    onUse ?: Function,
};


export type PotionItemInterface = ItemInterface & {
    onUse : Function,
};

export type ArmorItemInterface = ItemInterface & {
    deffense : number,
    onUse ?: Function,
    statsEffect ?: StatsEffect
};

export type WeaponItemInterface = ItemInterface & {
        attack : number,
        onUse ?: Function,
        statsEffect ?: StatsEffect
};

export type RingItemInterface = ItemInterface & {
    onUse ?: Function,
    statsEffect : StatsEffect
};


export type ItemInterfaceMap = Record<ItemTypes,ItemInterface>;



//export type InventoryStructure = Record<ItemTypes,ItemInInventoryInterface[]>;

export type InventoryStructure = 
{
    potion:  ItemInInventoryInterface[];
    ring:   ItemInInventoryInterface[];
    weapon: ItemInInventoryInterface[];
    armor:  ItemInInventoryInterface[];
    other:  ItemInInventoryInterface[];
    story:  ItemInInventoryInterface[];

}