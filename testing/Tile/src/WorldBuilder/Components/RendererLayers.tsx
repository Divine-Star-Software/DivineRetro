import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import { useEffect, useState } from "react";

export function RendererLayers(props: { renderer: TileRenderer }) {
  const [layer, setLayer] = useState(props.renderer.layers[0]);
  const [enabled, setEnabled] = useState(layer.enabled);
  const [zOffset, setZOffset] = useState(layer.zOffset);
  const [worldLayer, setWorldLayer] = useState(layer.worldLayer);
  const [worldDataClamp, setWorldDataClamp] = useState(layer.worldDataClamp);
  const [renderGroup, setRenderGroup] = useState(layer.renderingGroupId);

  useEffect(() => {
    setEnabled(layer.enabled);
    setZOffset(layer.zOffset);
    setWorldLayer(layer.worldLayer);
    setWorldDataClamp(layer.worldDataClamp);
    setRenderGroup(layer.renderingGroupId);
  }, [layer]);
  return (
    <>
      <div className="control-group">
        <div className="tile-type-select">
          <label htmlFor="tile-type-select">Select World Layer:</label>
          <select
            id="tile-type-select"
            onChange={(event) => {
              setLayer(
                props.renderer.layers.find(
                  (_) => _.data.id == Number(event.target.value)
                )!
              );
            }}
            value={layer.data.id}
            className="select-dropdown"
          >
            <option value="" disabled>
              -- Select a Layer --
            </option>
            {props.renderer.layers.map((layer) => (
              <option key={layer.data.id} value={layer.data.id}>
                {layer.data.id}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <label htmlFor="tile-type-select">Enabled:</label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            layer.enabled = Boolean(event.target.checked);
            setEnabled(layer.enabled);
          }}
        />
      </div>
      <div className="state-select">
        <label htmlFor="number-input">Set Z Offset:</label>
        <input
          type="number"
          value={zOffset}
          onChange={(event) => {
            layer.zOffset = Number(event.target.value);
            setZOffset(layer.zOffset);
          }}
          className="number-input"
        />
      </div>
      <div className="state-select">
        <label htmlFor="number-input">Set World Layer:</label>
        <input
          type="number"
          value={worldLayer}
          onChange={(event) => {
            layer.worldLayer = Number(event.target.value);
            setWorldLayer(layer.worldLayer);
          }}
          className="number-input"
        />
      </div>
      <div className="state-select">
        <label htmlFor="number-input">Set World Data Clamp:</label>
        <input
          type="number"
          value={worldDataClamp}
          onChange={(event) => {
            layer.worldDataClamp = Number(event.target.value);
            setWorldDataClamp(layer.worldDataClamp);
          }}
          className="number-input"
        />
      </div>
      <div className="state-select">
        <label htmlFor="number-input">Rendering Group Id:</label>
        <input
          type="number"
          value={renderGroup}
          onChange={(event) => {
            layer.renderingGroupId = Number(event.target.value);
            setRenderGroup(layer.renderingGroupId);
          }}
          className="number-input"
        />
      </div>
    </>
  );
}
