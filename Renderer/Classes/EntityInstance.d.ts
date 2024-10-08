import { MatrixArray, MatrixProperty } from "./MatrixArray";
import { EntityTool } from "./EntityTool";
export declare class EntityInstance {
    index: number;
    _matrix: MatrixArray;
    _tool: EntityTool;
    constructor(index: number, _matrix: MatrixArray, _tool: EntityTool);
    piviotPoint: {
        x: number;
        y: number;
        z: number;
    };
    _scale: {
        x: number;
        y: number;
        z: number;
    };
    scale: MatrixProperty;
    _rotation: {
        x: number;
        y: number;
        z: number;
    };
    rotation: MatrixProperty;
    _position: {
        x: number;
        y: number;
        z: number;
    };
    position: MatrixProperty;
    _updateMatrix(): void;
    destroy(): void;
}
