import { ASCIIRender } from "@divineretro/ascii/Renderer/ASCIIRenderer";
import type { DivineStar } from "../DivineStar";
import { UUID } from "../Helper/Helper";
import { SceneTypes } from "../meta/Scene/Scene.types";
import { EntityInterface } from "./Entity.interface";
type EntityInterfaceType = new (
  data: any,
  id: string,
  type: string,
  x: number,
  y: number,
  sceneTypes: SceneTypes
) => EntityInterface;

export class EntityManager {
  entites: Record<string, EntityInterfaceType> = {};
  createdEntites: Record<
    SceneTypes,
    Record<string, { ids: string[]; entities: EntityInterface[] }>
  > = {
    battle: {},
    "bottom-menu": {},
    "bottom-right-menu": {},
    level: {},
    menu: {},
    "right-menu": {},
  };

  deleting = false;

  activeEntities: EntityInterface[] = [];
  drawEntities: EntityInterface[] = [];

  constructor(public renderer: ASCIIRender, public DS: DivineStar) {}

  registerEntity(name: string, entityClass: any) {
    this.entites[name] = entityClass;
  }


  /**# Create New Entity 
   * ---
   * Creates an entity. Adds it the render loop.
   * And returns it for later use. 
   * 
   * @param sceneType - The scene where it is being added 
   * @param data 
   * @param name 
   * @param type 
   * @param x 
   * @param y 
   * @returns 
   */
  createNewEntity(
    sceneType: SceneTypes,
    data: any,
    name: string,
    type: string,
    x: number,
    y: number
  ) {
    this.createdEntites[sceneType][name]
      ? true
      : (this.createdEntites[sceneType][name] = { entities: [], ids: [] });
    const id = UUID();
    const entity = new this.entites[name](data, `${id}`, type, x, y, sceneType);
    if (entity.draw) {
      this.drawEntities.push(entity);
    }
    this.activeEntities.push(entity);
    this.createdEntites[sceneType][name].entities.push(entity);
    this.createdEntites[sceneType][name].ids.push(`${id}`);
    return entity;
  }

  async $draw() {
    if (this.deleting) return;
    for (const entity of this.drawEntities) {
      entity.$draw();
    }
  }

  async $run() {
    if (this.deleting) return;
    for (const entity of this.activeEntities) {
      entity.$run();
    }
  }

  deleteAllEntitiesOnScene(sceneType: SceneTypes) {
    this.deleting = true;
    const entities = this.createdEntites[<SceneTypes>sceneType];
    for (const ent of Object.keys(entities)) {
      const e = entities[ent];

      e.entities = [];
      for (const id of e.ids) {
        let i = 0;
        while (i < this.activeEntities.length) {
          if (this.activeEntities[i].id === id) {
            this.activeEntities.splice(i, 1);
          } else {
            ++i;
          }
        }

        i = 0;
        while (i < this.drawEntities.length) {
          if (this.drawEntities[i].id === id) {
            this.drawEntities.splice(i, 1);
          } else {
            ++i;
          }
        }
      }
      e.ids = [];
    }
    this.deleting = false;
  }

  deleteAllEntites() {
    this.activeEntities = [];
    this.drawEntities = [];
    // this.createdEntites = {};
    for (const sceneType of Object.keys(this.createdEntites)) {
      const entities = this.createdEntites[<SceneTypes>sceneType];
      for (const ent of Object.keys(entities)) {
        const e = entities[ent];

        e.entities = [];
        e.ids = [];
      }
    }
  }
}
