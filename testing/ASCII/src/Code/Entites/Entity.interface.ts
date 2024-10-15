import { SceneTypes } from "../meta/Scene/Scene.types";



export interface EntityInterface {

    x : number;
    y : number;
    type : string;
    id : string;
    draw : boolean;
    sceneType : SceneTypes;

    $draw() : void;

    $run() : void;

    $destroy() : void;
}