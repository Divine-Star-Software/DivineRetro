import { KeyboardEvent, useEffect } from "react";

import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import {
  HemisphericLight,
  PointerEventTypes,
  PointerInfo,
  StandardMaterial,
  Vector2,
  Vector3,
  VertexBuffer,
} from "@babylonjs/core";
import { BrushTool } from "@divineretro/tile/Data/BrushTool";
import { WorldSpaces } from "@divineretro/tile/Data/WorldSpace";
import { WorldBuilderManager } from "WorldBuilder/WorldBuilderManager";
import { BuildTileGeometry } from "@divineretro/tile/Renderer/Functions/BuildTileGeometry";
import { Flat2DIndex, Vec2Array } from "@amodx/math";
import { DataTool } from "@divineretro/tile/Data/DataTool";
import { RawTileData } from "@divineretro/tile/Tiles/Tiles.types";

enum Modes {
  Signle,
  Multi,
}

type SelectionData = {
  start: Vector2;
  scale: Vector2;
};
export function TileControls(props: { renderer: TileRenderer }) {
  useEffect(() => {
    const brushTool = new BrushTool();
    const dataTool = new DataTool();

    const scene = props.renderer.scene;

    const light = new HemisphericLight("", new Vector3(0, -1, 0));

    const quadSelector = BuildTileGeometry(scene);
    quadSelector.setVerticesData(
      VertexBuffer.UVKind,
      [
        // v1
        1, 0,
        // v2
        0, 0,
        // v3
        0, 1,
        // v4
        1, 1,
      ]
    );
    quadSelector.alwaysSelectAsActiveMesh = true;
    quadSelector.position.x = 1;
    quadSelector.position.y = 1;
    quadSelector.position.z = 0;
    quadSelector.setEnabled(false);

    quadSelector.renderingGroupId = 3;
    const quadSelectorAddMaterial = new StandardMaterial("", scene);
    quadSelectorAddMaterial.diffuseColor.set(0, 1, 0);
    quadSelectorAddMaterial.specularColor.set(0, 0, 0);
    const quadSelectorRemoveMaterial = new StandardMaterial("", scene);
    quadSelectorRemoveMaterial.diffuseColor.set(1, 0, 0);
    quadSelectorRemoveMaterial.specularColor.set(0, 0, 0);
    const quadSelectorStoreMaterial = new StandardMaterial("", scene);
    quadSelectorStoreMaterial.diffuseColor.set(0, 0, 1);
    quadSelectorStoreMaterial.specularColor.set(0, 0, 0);
    quadSelector.material = quadSelectorAddMaterial;
    quadSelectorStoreMaterial.alpha = 0.4;
    quadSelectorRemoveMaterial.alpha = 0.4;
    quadSelectorAddMaterial.alpha = 0.4;

    let mode = Modes.Signle;

    let storedSelection = false;
    const storeIndex = Flat2DIndex.GetXYOrder();
    const stored: RawTileData[] = [];

    const keyDown = ({ key }: KeyboardEvent) => {
      if (key == "Shift") {
        mode = Modes.Multi;
        window.addEventListener("keyup", keyUp as any);
      }
    };
    const keyUp = ({ key }: KeyboardEvent) => {
      if (key == "Shift") {
        mode = Modes.Signle;
        storedSelection = false;
        stored.length = 0;
        quadSelector.setEnabled(false);
        window.removeEventListener("keyup", keyUp as any);
        //  quadSelector.setEnabled(false);
      }
    };

    window.addEventListener("keydown", keyDown as any);

    const canvas = scene.getEngine().getRenderingCanvas()!;
    canvas.addEventListener("mouseenter", () => quadSelector.setEnabled(true));
    canvas.addEventListener("mouseleave", () => quadSelector.setEnabled(false));

    let mosueDown = false;
    let mouseButton: number | null = null;
    const handleSinglePointerAction = (
      point: Vector3 | undefined,
      button: number | null
    ) => {
      if (!point) return;
      const tilePosition = WorldSpaces.getTilePosition(point.x, point.y);

      const tileData = WorldBuilderManager.tileData;

      if (button === 0) {
        // Left button: Paint
        if (WorldBuilderManager.selectedTiles.length <= 1) {
          brushTool
            .setTextureId(tileData.texture, tileData.tileX, tileData.tileY)
            .setPosition(tilePosition.x, tilePosition.y)
            .setColorData(...tileData.color!)
            .setRotation(tileData.rotation)
            .setFlipX(tileData.flipX)
            .setFlipY(tileData.flipY)
            .setLayer(WorldBuilderManager.worldLayer)
            .paint();
        } else {
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let maxY = -Infinity;

          for (const data of WorldBuilderManager.selectedTiles) {
            if (data.col < minX) {
              minX = data.col;
            }
            if (data.row < minY) {
              minY = data.row;
            }
            if (data.col > maxX) {
              maxX = data.col;
            }
            if (data.row > maxY) {
              maxY = data.row;
            }
          }

          const { x, y } = tilePosition;

          for (const data of WorldBuilderManager.selectedTiles) {
            const rx = Math.abs(
              !tileData.flipX ? data.col - minX : maxX - data.col
            );
            const ry = Math.abs(
              !tileData.flipY ? maxY - data.row : data.row - minY
            );
            brushTool
              .setTextureId(tileData.texture, data.col, data.row)
              .setPosition(x + rx, y + ry)
              .setColorData(...tileData.color!)
              .setRotation(tileData.rotation)
              .setFlipX(tileData.flipX)
              .setFlipY(tileData.flipY)
              .setLayer(WorldBuilderManager.worldLayer)
              .paint();
          }
        }
      } else if (button === 2) {
        // Right button: Erase
        brushTool
          .setTextureId("blank", 0, 0)
          .setPosition(tilePosition.x, tilePosition.y)
          .setColorData(255, 255, 255, 255)
          .setLayer(WorldBuilderManager.worldLayer)
          .setRotation(0)
          .paint();
      }
    };
    const handleSinglePointerMove = (
      point: Vector3 | undefined,
      button: number | null
    ) => {
      if (!point) return;
      const tilePosition = WorldSpaces.getTilePosition(point.x, point.y);

      const tileData = WorldBuilderManager.tileData;
      quadSelector.setEnabled(true);
      quadSelector.material = quadSelectorAddMaterial;
      // Left button: Paint
      if (WorldBuilderManager.selectedTiles.length <= 1) {
        updateTile(tilePosition.x, tilePosition.y, 1, 1);
      } else {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        for (const data of WorldBuilderManager.selectedTiles) {
          if (data.col < minX) {
            minX = data.col;
          }
          if (data.row < minY) {
            minY = data.row;
          }
          if (data.col > maxX) {
            maxX = data.col;
          }
          if (data.row > maxY) {
            maxY = data.row;
          }
        }

        console.log(
          tilePosition.x,
          tilePosition.y,
          maxX - minX + 1,
          maxY - minY + 1,
          [minX, minY],
          [maxX, maxY]
        );
        updateTile(
          tilePosition.x,
          tilePosition.y,
          maxX - minX + 1,
          maxY - minY + 1
        );
      }
    };

    const multiSelectStart = new Vector2(0, 0);
    const multiSelectEnd = new Vector2(0, 0);
    const oneTile = new Vector2(1, 1);

    const updateTile = (
      tileStartX: number,
      tileStartY: number,
      tilesWidth: number,
      tilesHeight: number
    ) => {
      const worldPositon = WorldSpaces.getWorldPosition(tileStartX, tileStartY);
      quadSelector.position.x = worldPositon.x;
      quadSelector.position.y = worldPositon.y;
      quadSelector.scaling.x = tilesWidth;
      quadSelector.scaling.y = tilesHeight;
    };

    const startTileSelection = (pointX: number, pointY: number) => {
      const tilePosition = WorldSpaces.getTilePosition(pointX, pointY);

      multiSelectStart.copyFrom(tilePosition);
      multiSelectEnd.copyFrom(multiSelectStart);
      multiSelectEnd.add(oneTile);
      updateTile(
        multiSelectStart.x,
        multiSelectStart.y,
        multiSelectEnd.x - multiSelectStart.x,
        multiSelectEnd.y - multiSelectStart.y
      );
    };
    const updateTileSelection = (pointX: number, pointY: number) => {
      const tilePosition = WorldSpaces.getTilePosition(pointX, pointY);
      multiSelectEnd.copyFrom(tilePosition);
      multiSelectEnd.add(oneTile);
      let minX = Math.min(multiSelectStart.x, multiSelectEnd.x);
      let minY = Math.min(multiSelectStart.y, multiSelectEnd.y);
      let maxX = Math.max(multiSelectStart.x, multiSelectEnd.x);
      let maxY = Math.max(multiSelectStart.y, multiSelectEnd.y);
      updateTile(minX, minY, maxX - minX, maxY - minY);
    };
    const getTileSelection = (): SelectionData => {
      let minX = Math.min(multiSelectStart.x, multiSelectEnd.x);
      let minY = Math.min(multiSelectStart.y, multiSelectEnd.y);
      let maxX = Math.max(multiSelectStart.x, multiSelectEnd.x);
      let maxY = Math.max(multiSelectStart.y, multiSelectEnd.y);
      return {
        start: new Vector2(minX, minY),
        scale: new Vector2(maxX - minX, maxY - minY),
      };
    };

    const handleMultiPointerActionStart = (
      point: Vector3 | undefined,
      button: number | null
    ) => {
      if (!point) return;
      quadSelector.setEnabled(true);
      if (button == 0) {
        quadSelector.material = quadSelectorAddMaterial;
      }
      if (button == 1) {
        quadSelector.material = quadSelectorStoreMaterial;
      }
      if (button == 2) {
        quadSelector.material = quadSelectorRemoveMaterial;
      }
      startTileSelection(point.x, point.y);
    };

    const handleMultiPointerActionMove = (
      point: Vector3 | undefined,
      button: number | null
    ) => {
      if (!point) return;
      updateTileSelection(point.x, point.y);
    };

    const loopSelection = (
      data: SelectionData,
      run: (tileX: number, tileY: number) => void,
      [strideX, strideY]: Vec2Array = [1, 1]
    ) => {
      const { x: sx, y: sy } = data.start;
      const ex = sx + data.scale.x;
      const ey = sy + data.scale.y;
      for (let x = sx; x < ex; x += strideX) {
        for (let y = sy; y < ey; y += strideY) {
          run(x, y);
        }
      }
    };

    const fillTile = (data: SelectionData) => {
      if (!storedSelection) {
        if (WorldBuilderManager.selectedTiles.length <= 1) {
          loopSelection(data, (x, y) => {
            const tileData = WorldBuilderManager.tileData;
            // Left button: Paint
            brushTool
              .setTextureId(tileData.texture, tileData.tileX, tileData.tileY)
              .setPosition(x, y)
              .setColorData(...tileData.color!)
              .setRotation(tileData.rotation)
              .setFlipX(tileData.flipX)
              .setFlipY(tileData.flipY)
              .setLayer(WorldBuilderManager.worldLayer)
              .paint();
          });
        } else {
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let maxY = -Infinity;

          for (const data of WorldBuilderManager.selectedTiles) {
            if (data.col < minX) {
              minX = data.col;
            }
            if (data.row < minY) {
              minY = data.row;
            }
            if (data.col > maxX) {
              maxX = data.col;
            }
            if (data.row > maxY) {
              maxY = data.row;
            }
          }

          const scaleX = Math.abs(maxX - minX);
          const scaleY = Math.abs(maxY - minY);

          loopSelection(
            data,
            (x, y) => {
              const tileData = WorldBuilderManager.tileData;
              // Left button: Paint
              for (const data of WorldBuilderManager.selectedTiles) {
                const rx = Math.abs(
                  !tileData.flipX ? data.col - minX : maxX - data.col
                );
                const ry = Math.abs(
                  !tileData.flipY ? maxY - data.row : data.row - minY
                );
                brushTool
                  .setTextureId(tileData.texture, data.col, data.row)
                  .setPosition(x + rx, y + ry)
                  .setColorData(...tileData.color!)
                  .setRotation(tileData.rotation)
                  .setFlipX(tileData.flipX)
                  .setFlipY(tileData.flipY)
                  .setLayer(WorldBuilderManager.worldLayer)
                  .paint();
              }
            },
            [scaleX + 1, scaleY + 1]
          );
        }
      }
      if (storedSelection) {
        const [bx, by] = storeIndex.getBounds();
        loopSelection(
          data,
          (sx, sy) => {
            const ex = sx + bx;
            const ey = sy + by;
            let rx = 0;
            for (let x = sx; x < ex; x += 1) {
              let ry = 0;

              for (let y = sy; y < ey; y += 1) {
                const data = stored[storeIndex.getIndexXY(rx, ry)];
                if (!data) continue;
                brushTool.setPosition(x, y).paintRaw(data);

                ry++;
              }
              rx++;
            }
          },
          storeIndex.getBounds()
        );
      }
    };
    const removeTile = (data: SelectionData) => {
      loopSelection(data, (x, y) => {
        brushTool
          .setTextureId("blank", 0, 0)
          .setPosition(x, y)
          .setColorData(255, 255, 255, 255)
          .setLayer(WorldBuilderManager.worldLayer)
          .setRotation(0)
          .paint();
      });
    };
    const storeTile = (data: SelectionData) => {
      storeIndex.setBounds(data.scale.x, data.scale.y);
      storedSelection = true;
      stored.length = 0;
      loopSelection(data, (x, y) => {
        const rx = Math.abs(x - data.start.x);
        const ry = Math.abs(y - data.start.y);
        const index = storeIndex.getIndexXY(rx, ry);

        if (
          !dataTool
            .setWorld(WorldBuilderManager.worldId)
            .setPosition(x, y)
            .setLayer(WorldBuilderManager.worldLayer)
            .loadIn()
        )
          return;
        stored[index] = dataTool.getRawTileData();
      });
    };
    const handleMultiPointerActionUp = (
      point: Vector3 | undefined,
      button: number | null
    ) => {
      quadSelector.setEnabled(false);

      const selection = getTileSelection();

      if (button == 0) {
        fillTile(selection);
      }
      if (button == 1) {
        storeTile(selection);
      }
      if (button == 2) {
        removeTile(selection);
      }
    };
    const run = (evnt: PointerInfo) => {
      const pointerEvent = evnt.event as PointerEvent;

      switch (evnt.type) {
        case PointerEventTypes.POINTERDOWN:
          mosueDown = true;
          mouseButton = pointerEvent.button;
          if (mode == Modes.Signle) {
            handleSinglePointerAction(
              evnt.pickInfo?.pickedPoint!,
              pointerEvent.button
            );
          }
          if (mode == Modes.Multi) {
            handleMultiPointerActionStart(
              evnt.pickInfo?.pickedPoint!,
              pointerEvent.button
            );
          }
          break;

        case PointerEventTypes.POINTERUP:
          mosueDown = false;
          mouseButton = null;

          if (mode == Modes.Multi) {
            handleMultiPointerActionUp(
              evnt.pickInfo?.pickedPoint!,
              pointerEvent.button
            );
          }

          break;

        case PointerEventTypes.POINTERMOVE:
          if (mosueDown && pointerEvent.buttons > 0) {
            if (mode == Modes.Signle) {
              handleSinglePointerAction(
                evnt.pickInfo?.pickedPoint!,
                mouseButton
              );
            }
            if (mode == Modes.Multi) {
              handleMultiPointerActionMove(
                evnt.pickInfo?.pickedPoint!,
                pointerEvent.button
              );
            }
          }
          if (!mosueDown) {
            if (mode == Modes.Signle) {
              handleSinglePointerMove(
                evnt.pickInfo?.pickedPoint!,
                pointerEvent.button
              );
            }
          }
          break;

        default:
          break;
      }
    };

    const added = props.renderer.scene.onPointerObservable.add(run);

    return () => {
      props.renderer.scene.onPointerObservable.remove(added);
      window.removeEventListener("keyup", keyUp as any);
      window.removeEventListener("keydown", keyDown as any);
    };
  }, [props.renderer.scene]);

  return null;
}
