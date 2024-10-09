import { TextureManager } from "@divineretro/tile/Textures/TextureManager";
import { TileManager } from "@divineretro/tile/Tiles/TileManager";
import { EngineSettings } from "@divineretro/tile/Settings/EngineSettings";
import "./WorldBuilder.css";
import { useEffect, useRef, useState } from "react";
import { TileData } from "@divineretro/tile/Tiles/Tiles.types";
import { Vec4Array } from "@amodx/math";
import { EngienNodes } from "../EngineNodes";
import { TileCamera } from "@divineretro/tile/Camera/TileCamera";
import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import {
  ActionEvent,
  ActionManager,
  CreateGround,
  ExecuteCodeAction,
  PointerEventTypes,
  PointerInfo,
  Vector3,
} from "@babylonjs/core";
import { BrushTool } from "@divineretro/tile/Data/BrushTool";
import { WorldSpaces } from "@divineretro/tile/Data/WorldSpace";
export type TileTextureData = {
  id: string;
  src: string;
};

interface TextureSelectProps {
  tileData: TileData;
  setTileData: React.Dispatch<React.SetStateAction<TileData>>;
}

const TextureSelect: React.FC<TextureSelectProps> = ({
  tileData,
  setTileData,
}) => {
  const [selectedTexture, setSelectedTexture] =
    useState<TileTextureData | null>(null);
  const [selectedTile, setSelectedTile] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tilePixelWidth, tilePixelHeight] = EngineSettings.tilePixelSize;
  const textureData: TileTextureData[] = TextureManager.tilesTextures;

  // Handle texture selection change
  const handleTextureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const textureId = e.target.value;
    const texture = textureData.find((t) => t.id === textureId) || null;
    setSelectedTexture(texture);
    setSelectedTile(null); // Reset selected tile when texture changes

    // Update tileData.texture in parent
    if (texture) {
      setTileData((prevData) => ({
        ...prevData,
        texture: texture.id,
      }));
    }
  };

  // Handle image load to get dimensions and draw initial grid
  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });

    // Draw grid lines on the canvas
    drawCanvasGrid(img.naturalWidth, img.naturalHeight);
  };

  // Function to draw grid lines and highlight
  const drawCanvasGrid = (width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match image's natural size
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = tilePixelWidth; x < width; x += tilePixelWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = tilePixelHeight; y < height; y += tilePixelHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // If a tile is selected, highlight it
    if (selectedTile) {
      highlightSelectedTile(ctx, selectedTile);
    }
  };

  // Function to highlight the selected tile
  const highlightSelectedTile = (
    ctx: CanvasRenderingContext2D,
    tile: { row: number; col: number }
  ) => {
    const { row, col } = tile;

    // Calculate the position of the selected tile
    const x = col * tilePixelWidth;
    const y = row * tilePixelHeight;

    // Set highlight style
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Semi-transparent red
    ctx.fillRect(x, y, tilePixelWidth, tilePixelHeight);

    // Optionally, draw a border around the selected tile
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, tilePixelWidth, tilePixelHeight);
  };

  // Handle click on the image to select a tile
  const handleImageClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (!selectedTexture || !imageDimensions) return;

    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();

    // Calculate click position relative to the image
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate the scale factor in case the image is resized
    const scaleX = imageDimensions.width / img.width;
    const scaleY = imageDimensions.height / img.height;

    // Get actual pixel positions
    const actualX = clickX * scaleX;
    const actualY = clickY * scaleY;

    // Calculate row and column
    const col = Math.floor(actualX / tilePixelWidth);
    const row = Math.floor(actualY / tilePixelHeight);

    // Ensure the selected tile is within bounds
    const maxCols = Math.floor(imageDimensions.width / tilePixelWidth);
    const maxRows = Math.floor(imageDimensions.height / tilePixelHeight);
    if (col >= 0 && col < maxCols && row >= 0 && row < maxRows) {
      setSelectedTile({ row, col });

      // Update tileData.tileX and tileData.tileY in parent
      setTileData((prevData) => ({
        ...prevData,
        tileX: col,
        tileY: row,
      }));
    } else {
      // Click was outside the valid tile area
      setSelectedTile(null);
      setTileData((prevData) => ({
        ...prevData,
        tileX: 0,
        tileY: 0,
      }));
    }
  };

  // Effect to redraw the canvas when the selected tile changes
  useEffect(() => {
    if (!imageDimensions) return;

    const { width, height } = imageDimensions;
    drawCanvasGrid(width, height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTile]);

  return (
    <div className="texture-select">
      {/* Texture Selection Dropdown */}
      <label htmlFor="texture-select">Select Texture:</label>
      <select
        id="texture-select"
        onChange={handleTextureChange}
        value={tileData.texture}
        className="select-dropdown"
      >
        <option value="" disabled>
          -- Select a Texture --
        </option>
        {textureData.map((texture) => (
          <option key={texture.id} value={texture.id}>
            {texture.id}
          </option>
        ))}
      </select>

      {/* Display Selected Texture */}
      {selectedTexture && (
        <div className="texture-display">
          <img
            src={selectedTexture.src}
            alt={selectedTexture.id}
            onLoad={handleImageLoad}
            onClick={handleImageClick}
            className="texture-image"
          />
          {/* Canvas Overlay */}
          <canvas ref={canvasRef} className="texture-canvas" />
        </div>
      )}

      {/* Display Selected Tile Coordinates */}
      {selectedTile && (
        <div className="selected-tile">
          <p>
            Selected Tile - Row: <strong>{selectedTile.row}</strong>, Column:{" "}
            <strong>{selectedTile.col}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

interface TileTypeSelectProps {
  selectedType: string;
  onTileTypeChange: (tileType: string) => void;
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
  onRoationChange: (rotation: number) => void;
}

const RotationSelect: React.FC<RotationSelectProps> = ({
  rotation: rotation,
  onRoationChange,
}) => {
  return (
    <div className="tile-type-select">
      <label htmlFor="tile-type-select">Select Rotation:</label>
      <select
        id="tile-type-select"
        onChange={(event) => onRoationChange(Number(event.target.value))}
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
            max="15"
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
      <label htmlFor="state-input">Set State:</label>
      <input
        type="number"
        id="state-input"
        value={state}
        onChange={(event) => onStateChange(Number(event.target.value))}
        className="state-input"
      />
    </div>
  );
};

function TileDataSelector(props: { renderer: TileRenderer }) {
  const [layer, setLayer] = useState(0);
  const [tileData, setTileData] = useState<TileData>({
    texture: "blank",
    tileY: 0,
    tileX: 0,
    state: 0,
    tileType: "blank",
    rotation: 0,
    color: [15, 15, 15, 15],
  });

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [mouseButton, setMouseButton] = useState<number | null>(null); // 0: left, 2: right

  useEffect(() => {
    const pickGround = CreateGround(
      "",
      {
        width: 1_000_000,
        height: 1_000_000,
      },
      props.renderer.scene
    );
    pickGround.position.y = -0.001;
    pickGround.renderingGroupId = 0;

    // Prevent context menu on right-click

    pickGround.actionManager = new ActionManager(props.renderer.scene);
    pickGround.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnRightPickTrigger,
        (event: ActionEvent) => {
          //  event.preventDefault();
          (event.sourceEvent as MouseEvent).preventDefault();
        }
      )
    );

    return () => {
      pickGround.dispose(); // Clean up the ground when the component unmounts
    };
  }, [props.renderer.scene]);

  useEffect(() => {
    const brushTool = new BrushTool();

    const handlePointerAction = (
      point: Vector3 | undefined,
      button: number | null
    ) => {
      if (!point) return;
      const tilePosition = WorldSpaces.getTilePosition(point.x, point.z);

      if (button === 0) {
        // Left button: Paint
        brushTool
          .setTextureId(tileData.texture, tileData.tileX, tileData.tileY)
          .setPosition(tilePosition.x, tilePosition.y)
          .setColorData(...tileData.color!)
          .setRotation(tileData.rotation)
          .setLayer(layer)
          .paint();
      } else if (button === 2) {
        // Right button: Erase
        brushTool
          .setTextureId("blank", 0, 0)
          .setPosition(tilePosition.x, tilePosition.y)
          .setColorData(15, 15, 15, 15)
          .setLayer(layer)
          .setRotation(0)
          .paint();
      }
    };

    const run = (evnt: PointerInfo) => {
      const pointerEvent = evnt.event as PointerEvent;

      switch (evnt.type) {
        case PointerEventTypes.POINTERDOWN:
          setIsMouseDown(true);
          setMouseButton(pointerEvent.button);
          handlePointerAction(evnt.pickInfo?.pickedPoint!, pointerEvent.button);
          break;

        case PointerEventTypes.POINTERUP:
          setIsMouseDown(false);
          setMouseButton(null);
          break;

        case PointerEventTypes.POINTERMOVE:
          if (isMouseDown && pointerEvent.buttons > 0) {
            handlePointerAction(evnt.pickInfo?.pickedPoint!, mouseButton);
          }
          break;

        default:
          break;
      }
    };

    const added = props.renderer.scene.onPointerObservable.add(run);

    return () => {
      props.renderer.scene.onPointerObservable.remove(added);
    };
  }, [tileData, isMouseDown, mouseButton, props.renderer.scene, layer]);

  // Handlers to update tile data
  const handleTileTypeChange = (tileType: string) => {
    setTileData((prevData) => ({
      ...prevData,
      tileType,
    }));
  };
  const handleRotationChange = (rotation: any) => {
    setTileData((prevData) => ({
      ...prevData,
      rotation,
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

      <WorldLayer renderer={props.renderer} layer={layer} setLayer={setLayer} />
      <TileTypeSelect
        selectedType={tileData.tileType!}
        onTileTypeChange={handleTileTypeChange}
      />
      <RotationSelect
        rotation={tileData.rotation!}
        onRoationChange={handleRotationChange}
      />
      <StateSelect state={tileData.state!} onStateChange={handleStateChange} />
      <h2 className="section-title">Set Color</h2>
      <ColorSelect color={tileData.color!} onColorChange={handleColorChange} />
      <TextureSelect tileData={tileData} setTileData={setTileData} />
      {/* Optionally display or use tileData as needed */}
    </div>
  );
}
interface WorldCameraProps {
  camera: TileCamera;
}

const WorldCamera: React.FC<WorldCameraProps> = ({ camera }) => {
  const [x, setX] = useState<number>(camera.position.x);
  const [y, setY] = useState<number>(camera.position.y);

  // Update state when camera position changes externally
  useEffect(() => {
    const handleCameraUpdate = () => {
      setX(camera.position.x);
      setY(camera.position.y);
    };

    // Assuming TileCamera has some event emitter or callback mechanism
    // If not, you might need to implement one in TileCamera
    // For simplicity, we'll use a polling mechanism here
    const interval = setInterval(handleCameraUpdate, 100);

    return () => clearInterval(interval);
  }, [camera]);

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseFloat(e.target.value) || 0;
    setX(newX);
    camera.setPosition(newX, y);
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseFloat(e.target.value) || 0;
    setY(newY);
    camera.setPosition(x, newY);
  };

  const incrementX = () => {
    const newX = x + 1;
    setX(newX);
    camera.setPosition(newX, y);
  };

  const decrementX = () => {
    const newX = x - 1;
    setX(newX);
    camera.setPosition(newX, y);
  };

  const incrementY = () => {
    const newY = y + 1;
    setY(newY);
    camera.setPosition(x, newY);
  };

  const decrementY = () => {
    const newY = y - 1;
    setY(newY);
    camera.setPosition(x, newY);
  };

  return (
    <div className="world-camera">
      <h2 className="section-title">Camera</h2>
      <div className="control-group">
        <label htmlFor="x-position" className="control-label">
          X:
        </label>
        <input
          type="number"
          id="x-position"
          value={x}
          onChange={handleXChange}
          className="control-input"
        />
        <div className="control-buttons">
          <button onClick={decrementX} className="control-button">
            -
          </button>
          <button onClick={incrementX} className="control-button">
            +
          </button>
        </div>
      </div>
      <div className="control-group">
        <label htmlFor="y-position" className="control-label">
          Y:
        </label>
        <input
          type="number"
          id="y-position"
          value={y}
          onChange={handleYChange}
          className="control-input"
        />
        <div className="control-buttons">
          <button onClick={decrementY} className="control-button">
            -
          </button>
          <button onClick={incrementY} className="control-button">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

function WorldLayer(props: {
  renderer: TileRenderer;
  layer: number;
  setLayer: (layer: number) => void;
}) {
  return (
    <>
      <div className="control-group">
        <div className="tile-type-select">
          <label htmlFor="tile-type-select">Select Layer:</label>
          <select
            id="tile-type-select"
            onChange={(event) => props.setLayer(Number(event.target.value))}
            value={props.layer}
            className="select-dropdown"
          >
            <option value="" disabled>
              -- Select a Layer --
            </option>
            {props.renderer.layers.map((layer) => (
              <option key={layer.layerId} value={layer.layerId}>
                {layer.layerId}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default function WorldBuilder(props: { nodes: EngienNodes }) {
  return (
    <div className="world-builder">
      <h1 className="main-title">World Builder</h1>
      <WorldCamera camera={props.nodes.camera} />

      <TileDataSelector renderer={props.nodes.renderer} />
    </div>
  );
}
