import type { DivineStar } from "../DivineStar";
import { Observable } from "@amodx/core/Observers";

export type INPUTKeys = "up" | "left" | "down" | "right" | "enter";
export type INPUTChars = "m" | "h" | "x" | "z";

export class ControlManager {
  observers = new Map<string, Observable>();

  constructor(public DS: DivineStar) {
    this._setUpHooks();
  }

  onInput(key: string, func: () => void) {
    let observers = this.observers.get(key);
    if (!observers) {
      observers = new Observable();
      this.observers.set(key, observers);
    }
    observers.subscribe(func);
  }

  _setUpHooks() {
    window.addEventListener("keydown", ({ key }) => {
      let observers = this.observers.get(key);
      if (!observers) return;
      observers.notify();
    });

    //  this.DS.renderer.startUserInputCaptcher();
  }
}
