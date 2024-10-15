import { ConsoleColors, StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../../../DivineStar";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { EntityInterface } from "../../Entity.interface";
declare const DS: DivineStar;

//Harmless passive creatures
export class WorldDataDisplayEntity implements EntityInterface {
  labelStyle = StyleObject.New({
    dim: true,
    fg: ConsoleColors.Purple,
  });
  valueStyle = StyleObject.New({
    bright: true,
    fg: ConsoleColors.Cyan,
  });
  label = "World";
  dimensionLabel = "Current Dimension:";
  locationLabel = "Current Location:";

  draw = true;

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    if (sceneType == "bottom-menu" || sceneType == "bottom-right-menu") {
      this.y = this.y + SCREENHEIGHT + 1;
    }
    if (sceneType == "right-menu" || sceneType == "bottom-right-menu") {
      this.x = this.x + SCREENWIDTH + 1;
    }
  }

  getDimension() {
    const dimension = DS.worldData.currentDimension;
    return dimension;
  }
  _getLocation() {
    const location = DS.worldData.currentLocation;
    return location;
  }

  $draw() {
    if (!this.draw) return;
    let xOffset = 1;
    DS.renderer
      .showAt(DS.renderer.stylize(this.label, this.labelStyle), this.y, this.x)
      .showAt(
        DS.renderer.stylize(this.dimensionLabel, this.labelStyle),
        this.y + 1,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this.getDimension()), this.valueStyle),
        this.y + 2,
        this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.locationLabel, this.labelStyle),
        this.y + 4,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getLocation()), this.valueStyle),
        this.y + 5,
        this.x + xOffset + 1
      );
  }

  $run() {}

  $destroy() {}
}
