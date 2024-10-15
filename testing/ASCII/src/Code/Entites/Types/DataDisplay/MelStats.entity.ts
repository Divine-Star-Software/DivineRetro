import { ConsoleColors, StyleObject } from "@divineretro/ascii/Renderer/ASCIIMapping";
import type { DivineStar } from "../../../DivineStar";
import { SceneTypes } from "../../../meta/Scene/Scene.types";
import { EntityInterface } from "../../Entity.interface";
declare const DS: DivineStar;

//Harmless passive creatures
export class MelStatsEntity implements EntityInterface {
  nameStyle = StyleObject.New({
    dim: true,
    fg: ConsoleColors.Purple,
  });
  labelStyle = StyleObject.New({
    dim: true,
    fg: ConsoleColors.Purple,
  });
  valueStyle = StyleObject.New({
    bright: true,
    fg: ConsoleColors.Cyan,
  });

  name = "Melchizedek";
  levelLabel = "Level:";
  healthLabel = "Health:";
  manaLabel = "Mana:";
  attackLabel = "ATK:";
  deffneseLabel = "DEF:";
  speedLabel = "SPD:";
  intellegenceLabel = "INT:";
  wisdomLabel = "WSD:";
  luckLabel = "LCK:";
  draw = true;

  drawn = false;

  constructor(
    public data: any,
    public id: string,
    public type: string,
    public x: number,
    public y: number,
    public sceneType: SceneTypes
  ) {
    this._stylize();
    if (sceneType == "bottom-menu" || sceneType == "bottom-right-menu") {
      this.y = this.y + SCREENHEIGHT + 1;
    }
    if (sceneType == "right-menu" || sceneType == "bottom-right-menu") {
      this.x = this.x + SCREENWIDTH + 1;
    }
  }

  _stylize() {
    this.name = DS.renderer.stylize(this.name, this.nameStyle);
  }

  _getHealth() {
    const health = DS.playerData.getData().currentHealth;
    const maxHealth = DS.playerData.getData().maxHealth;
    return `${health}/${maxHealth}`;
  }
  _getMana() {
    const mana = DS.playerData.getData().currentMana;
    const maxMana = DS.playerData.getData().maxMana;
    return `${mana}/${maxMana}`;
  }
  _getLevel() {
    const level = DS.playerData.getData().level;
    return level;
  }
  _getAttack() {
    const attack = DS.playerData.getData().attack;
    return attack;
  }
  _getDeffense() {
    const deffense = DS.playerData.getData().deffense;
    return deffense;
  }
  _getSpeed() {
    const speed = DS.playerData.getData().speed;
    return speed;
  }
  _getIntellegence() {
    const speed = DS.playerData.getData().speed;
    return speed;
  }
  _getWisdom() {
    const speed = DS.playerData.getData().speed;
    return speed;
  }
  _getLuck() {
    const speed = DS.playerData.getData().speed;
    return speed;
  }

  $draw() {
    if (!this.draw) return;
    let xOffset = 0;
    let dataStart = 7;
    let statStart1 = 3;
    let statStart2 = 8;

    DS.renderer
      .showAt(
        DS.renderer.stylize("Melchizedek", this.nameStyle),
        this.y,
        this.x + 2
      )
      .showAt(
        DS.renderer.stylize(this.levelLabel, this.labelStyle),
        this.y + 1,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getLevel()), this.valueStyle),
        this.y + 1,
        dataStart + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.healthLabel, this.labelStyle),
        this.y + 2,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getHealth()), this.valueStyle),
        this.y + 2,
        dataStart + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.manaLabel, this.labelStyle),
        this.y + 3,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getMana()), this.valueStyle),
        this.y + 3,
        dataStart + this.x + xOffset + 1
      )
      // Show Stats
      .showAt(
        DS.renderer.stylize(this.attackLabel, this.labelStyle),
        this.y + 4,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getAttack()), this.valueStyle),
        this.y + 4,
        statStart1 + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.deffneseLabel, this.labelStyle),
        this.y + 5,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getDeffense()), this.valueStyle),
        this.y + 5,
        statStart1 + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.speedLabel, this.labelStyle),
        this.y + 6,
        this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getSpeed()), this.valueStyle),
        this.y + 6,
        statStart1 + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.intellegenceLabel, this.labelStyle),
        this.y + 4,
        statStart2 + this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getIntellegence()), this.valueStyle),
        this.y + 4,
        statStart2 + statStart1 + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.wisdomLabel, this.labelStyle),
        this.y + 5,
        statStart2 + this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getWisdom()), this.valueStyle),
        this.y + 5,
        statStart2 + statStart1 + this.x + xOffset + 1
      )
      .showAt(
        DS.renderer.stylize(this.luckLabel, this.labelStyle),
        this.y + 6,
        statStart2 + this.x + xOffset
      )
      .showAt(
        DS.renderer.stylize(String(this._getLuck()), this.valueStyle),
        this.y + 6,
        statStart2 + statStart1 + this.x + xOffset + 1
      );

    this.drawn = true;
  }

  $run() {}

  $destroy() {}
}
