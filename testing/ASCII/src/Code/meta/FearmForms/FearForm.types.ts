import { StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import { SizeMartix } from "../Util.types";

export type FearFormAnimationKey =  {
    animText: string,
    style: Partial<StyleObject>,
    interval: number,
  }


  export type FearFormBattleSet = Record<string, {
      id : string, num : number
  }[]>;

  //Set of fear form categories and sets of possible spawn types 
export type FearFormSpawnMap = Record<string,{

    probability : number,
    fearFormMap : {
        id : string,
        probability : number,
        min : number,
        max : number
    }[]


}[]>;

type FearFormWeakness = "light" | "love" | "strength" | "magic" ;

type FearmFormSpellName = "darkness" | "stone" | "rage";
type FearmFormSpell = {
    name : string,
    
}

//Basic type of enemy in the game
export type FearForm = {
    id : string,
    name : string,
    alive : boolean,
    boundingBox : SizeMartix
    level : number,
    totalHealth : number,
    totalMana : number,
    //total deffense against attacks
    deffense : number,
    //the abaility to evade attacks
    agaility : number,
    //adds to evade, abaility to flee and adds potential bonus for more attacks
    speed : number,
    //abaility to evade attacks, anticpate player moves, and use weakness against them 
    intellegence : number, 
    //bonus for spell casters 
    wisdom : number,
    //wether or not if it can cast any spells 
    spellCaster : boolean,
    spells : 
        {
           name : FearmFormSpellName,
           //the chance it will be casted 
           probability : number,
           power : number
        }[],

    //any weaknesses it may have 
    weakness : FearFormWeakness[],
    loot : {
        itemId : string,
        probalility : number
    }[],
    activeAnimation : string,
    animations : Record<string,FearFormAnimationKey[]>,



}