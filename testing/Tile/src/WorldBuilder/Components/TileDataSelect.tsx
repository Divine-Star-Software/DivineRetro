import { TextureManager } from "@divineretro/tile/Textures/TextureManager";
import { TileManager } from "@divineretro/tile/Tiles/TileManager";
import { EngineSettings } from "@divineretro/tile/Settings/EngineSettings";
import { useEffect, useRef, useState } from "react";
import { TileData } from "@divineretro/tile/Tiles/Tiles.types";
import { Vec4Array } from "@amodx/math";

import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";

import { BrushTool } from "@divineretro/tile/Data/BrushTool";
import { WorldSpaces } from "@divineretro/tile/Data/WorldSpace";
import { TextureSelect } from "./TextureSelect";
import { WorldBuilderManager } from "WorldBuilder/WorldBuilderManager";

interface TileTypeSelectProps {
  selectedType: string;
  onTileTypeChange: (tileType: string) => void;
}
function WorldLayer(props: { renderer: TileRenderer }) {
  const [layer, setLayer] = useState(WorldBuilderManager.worldLayer);
  return (
    <>
      <label htmlFor="tile-type-select">Select World Layer:</label>
      <div className="state-select">
        <input
          type="number"
          value={layer}
          onChange={(event) => {
            WorldBuilderManager.worldLayer = Number(event.target.value);
            setLayer(WorldBuilderManager.worldLayer);
          }}
          className="number-input"
        />
      </div>
    </>
  );
}
const TileTypeSelect: React.FC<TileTypeSelectProps> = ({
  selectedType,
  onTileTypeChange,
}) => {
  return (
    <div className="tile-type-select">
      <label htmlFor="tile-type-select">Select Type:</label>
      <select
        id="tile-type-select"
        onChange={(event) => onTileTypeChange(event.target.value)}
        value={selectedType}
        className="select-dropdown"
      >
        <option value="" disabled>
          -- Select a Tile Type --
        </option>
        {TileManager.tiles.map((tile) => (
          <option key={tile.id} value={tile.id}>
            {tile.id}
          </option>
        ))}
      </select>
    </div>
  );
};

interface RotationSelectProps {
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  onRoationChange: (rotation: number, flipX: boolean, flipY: boolean) => void;
}

const RotationSelect: React.FC<RotationSelectProps> = ({
  rotation: rotation,
  flipX,
  flipY,
  onRoationChange,
}) => {
  return (
    <div className="tile-type-select">
      <label htmlFor="tile-type-select">Select Rotation:</label>
      <select
        id="tile-type-select"
        onChange={(event) =>
          onRoationChange(Number(event.target.value), flipX, flipY)
        }
        value={rotation}
        className="select-dropdown"
      >
        <option value="" disabled>
          -- Select Rotation --
        </option>
        <option value={0}>{0}</option>
        <option value={1}>{90}</option>
        <option value={2}>{180}</option>
        <option value={3}>{270}</option>
      </select>
      <div style={{ display: "flex" }}>
        <label htmlFor="tile-type-select">Flip X:</label>
        <input
          type="checkbox"
          checked={flipX}
          onChange={(event) =>
            onRoationChange(rotation, Boolean(event.target.checked), flipY)
          }
        />
      </div>
      <div style={{ display: "flex" }}>
        <label htmlFor="tile-type-select">Flip Y:</label>
        <input
          type="checkbox"
          checked={flipY}
          onChange={(event) =>
            onRoationChange(rotation, flipX, Boolean(event.target.checked))
          }
        />
      </div>
    </div>
  );
};
interface ColorSelectProps {
  color: Vec4Array;
  onColorChange: (color: Vec4Array) => void;
}

const ColorSelect: React.FC<ColorSelectProps> = ({ color, onColorChange }) => {
  const handleChange = (index: number, value: number) => {
    const newColor: Vec4Array = [...color];
    newColor[index] = value;
    onColorChange(newColor);
  };

  return (
    <div className="color-select">
      {["R", "G", "B", "A"].map((channel, index) => (
        <div key={channel} className="color-channel">
          <label htmlFor={`color-${channel}`}>Color {channel}:</label>
          <input
            type="range"
            id={`color-${channel}`}
            min="0"
            max="255"
            step="1"
            onChange={(event) =>
              handleChange(index, Number(event.target.value))
            }
            value={color[index]}
            className="color-slider"
          />
          <span className="color-value">{color[index]}</span>
        </div>
      ))}
    </div>
  );
};

interface StateSelectProps {
  state: number;
  onStateChange: (state: number) => void;
}

const StateSelect: React.FC<StateSelectProps> = ({ state, onStateChange }) => {
  return (
    <div className="state-select">
      <label htmlFor="number-input">zOffset:</label>
      <input
        type="number"
        id="number-input"
        value={state}
        onChange={(event) => onStateChange(Number(event.target.value))}
        className="number-input"
      />
    </div>
  );
};

export function TileDataSelector(props: { renderer: TileRenderer }) {
  const [layer, setLayer] = useState(0);
  const [tileData, setTileData] = useState<TileData>({
    texture: "blank",
    flipX: false,
    flipY: false,
    tileY: 0,
    tileX: 0,
    state: 0,
    tileType: "blank",
    rotation: 0,
    color: [255, 255, 255, 255],
  });

  useEffect(() => {
    WorldBuilderManager.updateTileData(tileData);
  }, [tileData]);

  // Handlers to update tile data
  const handleTileTypeChange = (tileType: string) => {
    setTileData((prevData) => ({
      ...prevData,
      tileType,
    }));
  };
  const handleRotationChange = (
    rotation: any,
    flipX: boolean,
    flipY: boolean
  ) => {
    setTileData((prevData) => ({
      ...prevData,
      rotation,
      flipX,
      flipY,
    }));
  };
  const handleColorChange = (color: Vec4Array) => {
    setTileData((prevData) => ({
      ...prevData,
      color,
    }));
  };

  const handleStateChange = (state: number) => {
    setTileData((prevData) => ({
      ...prevData,
      state,
    }));
  };

  return (
    <div className="tile-data-selector">
      {/*    <pre className="tile-data-json">{JSON.stringify(tileData, null, 2)}</pre> */}

      <h2 className="section-title">Tile Data</h2>
      <WorldLayer renderer={props.renderer} />
      <TextureSelect tileData={tileData} setTileData={setTileData} />
      <RotationSelect
        rotation={tileData.rotation!}
        flipX={tileData.flipX}
        flipY={tileData.flipY}
        onRoationChange={handleRotationChange}
      />

      <ColorSelect color={tileData.color!} onColorChange={handleColorChange} />

      <TileTypeSelect
        selectedType={tileData.tileType!}
        onTileTypeChange={handleTileTypeChange}
      />
      <StateSelect state={tileData.state!} onStateChange={handleStateChange} />
      {/* Optionally display or use tileData as needed */}
    </div>
  );
}
