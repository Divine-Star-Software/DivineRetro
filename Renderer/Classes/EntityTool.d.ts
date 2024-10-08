import { Mesh } from "@babylonjs/core";
import { MatrixArray } from "./MatrixArray";
import { EntityInstance } from "./EntityInstance";
import "@babylonjs/core/Meshes/thinInstanceMesh";
export declare class EntityTool {
    mesh: Mesh;
    _instanceAmount: number;
    _matrixArray: MatrixArray;
    _instances: EntityInstance[];
    _usedInstances: Set<EntityInstance>;
    _bufferIds: string[];
    constructor(mesh: Mesh);
    addBuffer(id: string, buffer: Float32Array, stride?: number): void;
    setInstanceAmount(amount: number): void;
    getInstance(): false | EntityInstance;
    returnInstance(instance: EntityInstance): void;
    returnAll(): void;
    update(): void;
}
