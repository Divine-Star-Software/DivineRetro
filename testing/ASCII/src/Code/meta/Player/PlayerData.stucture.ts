import { InventoryStructure } from "../Inventory/Inventory.type";



export type PlayerDataStructure = {
        currentHealth : number;
        maxHealth : number;
        maxMana : number;
        currentMana : number;
        level : number;
        totalMana : number,
        //total attack damage 
        attack : number,
        //total deffense against attacks
        deffense : number,
        //adds to evade, abaility to flee and adds potential bonus for more attacks
        speed : number,
        //abaility to evade attacks, anticpate player moves, and use weakness against them 
        intellegence : number, 
        //bonus for spells 
        wisdom : number,
        luck : number,
        currentInventory : InventoryStructure;
}