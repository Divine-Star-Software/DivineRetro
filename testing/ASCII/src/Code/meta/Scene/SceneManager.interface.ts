import { SceneInterface, SceneKeyMap, SceneMetaMap } from "./Scene.types";


export interface SceneManagerInterface  {
 
        screenStateKeyCount : number;
        screenStateKeyTotal : number;
        screenStateAnimationInterval : number;
        screenStateAnimationIntervalCount : number;

        scenes : SceneMetaMap;
        activeScene : SceneInterface;
        activeMeta : SceneKeyMap;

        setActiveSceneMeta(metaName : string) : this;
        setActiveScene(metaName : string, sceneId : string) : this;

        registerSceneMeta(metaName : string) : this;

        addSceneToMeta(metaName : string, scene : SceneInterface) : this;

        getScene(sceneId : string) : SceneInterface;


        $doSceneAnimations() : void;

        $doSceneWorldAnimations() : void;
}