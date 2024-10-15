import { DivineStar } from "../../DivineStar";
import { EquipSlots, ItemInterface, ItemTypes } from "../../meta/Inventory/Inventory.type";
import { PlayerDataStructure } from "../../meta/Player/PlayerData.stucture";


/**# Player Data
 * ---
 * Handles the reading and writing of the player's data.
 * 
 */
export class PlayerData {


    currentEquirpedItems : Record<EquipSlots,string[]> = {

        armor : [],
        ring : [],
        weapon : []

    }


    currentData : PlayerDataStructure = {
        currentHealth : 50,
        maxHealth : 50,
        maxMana : 30,
        currentMana : 30,
        level : 1,
        totalMana : 30,
        attack : 3,
        deffense : 1,
        speed : 3,
        intellegence : 5, 
        wisdom : 4,
        luck : 1,
        currentInventory : {
            potion:  [],
            ring:   [],
            weapon: [],
            armor:  [],
            other:  [],
            story:  []
        }
    }


    constructor(public DS : DivineStar) {

    }


    getData() : PlayerDataStructure {
        return this.currentData;
    }

    equipItem(slot : EquipSlots, itemId : string) {
        this.currentEquirpedItems[slot].push(itemId);
    }
    unEquipItem(slot : EquipSlots, itemId : string) {
        const index = this.currentEquirpedItems[slot].indexOf(itemId);
        if(index==-1)return;
        this.currentEquirpedItems[slot].slice(index,1);
    }
    getEquipedItem(slot : EquipSlots) {
        return this.currentEquirpedItems[slot];
    }
    


    addItem(itemType : ItemTypes, itemData : ItemInterface,amount : number = 1) {

        let itemFound = false;
     for(const items of this.currentData.currentInventory[itemType]){
        if(items.id == itemData.id) {
            items.amount += amount;
            itemFound = true;
            break;
        }
     }
     if(!itemFound) {
        this.currentData.currentInventory[itemType].push({
            id : itemData.id,
            amount : amount
        })
     }

    }
    
}