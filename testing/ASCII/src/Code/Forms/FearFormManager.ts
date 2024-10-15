import { DivineStar } from "../DivineStar";
import { FearForm } from "../meta/FearmForms/FearForm.types";

type FearFormMap = Record<string,FearForm>;

export class FearFormManager{


    fearForms : Record<string,FearFormMap>= {};

    constructor (public DS : DivineStar){

    }

    getFearForm(category : string, fearFormId : string) : FearForm{
            return this.fearForms[category][fearFormId];
    }

    registerNewFearFormCategory(category : string) {
        this.fearForms[category] ? true : this.fearForms[category] = {};
        return this;
    }

    registerNewFearForm(category : string, id : string, fearFormData : FearForm) {   
        this.fearForms[category][id] = fearFormData;
        return this;
    }
 

}