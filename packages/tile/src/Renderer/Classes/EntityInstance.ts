import { MatrixArray } from "./MatrixArray";
import { EntityTool } from "./EntityTool";

export class EntityInstance {
  constructor(
    public index: number,
    public matrix: MatrixArray,
    public _tool: EntityTool
  ) {}

  destroy() {
    this._tool.returnInstance(this);
  }
}
