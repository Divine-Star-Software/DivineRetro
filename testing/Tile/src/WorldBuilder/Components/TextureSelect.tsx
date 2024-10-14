import { TextureManager } from "@divineretro/tile/Textures/TextureManager";
import { TileManager } from "@divineretro/tile/Tiles/TileManager";
import { EngineSettings } from "@divineretro/tile/Settings/EngineSettings";
import { useEffect, useRef, useState } from "react";
import { TileData } from "@divineretro/tile/Tiles/Tiles.types";
import { TileTextureData } from "@divineretro/tile/Textures/Texture.types";
import WorldBuilder from "WorldBuilder/WorldBuilder";
import { WorldBuilderManager } from "WorldBuilder/WorldBuilderManager";

interface TextureSelectProps {
  tileData: TileData;
  setTileData: React.Dispatch<React.SetStateAction<TileData>>;
}

export const TextureSelect: React.FC<TextureSelectProps> = ({
  tileData,
  setTileData,
}) => {
  const [selectedTexture, setSelectedTexture] =
    useState<TileTextureData | null>(null);

  const [selectedTiles, setSelectedTiles] = useState<
    {
      row: number;
      col: number;
    }[]
  >([]);

  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State variables for drag selection
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [tilePixelWidth, tilePixelHeight] = EngineSettings.tilePixelSize;
  const textureData: TileTextureData[] = TextureManager.tilesTextures;

  useEffect(() => {
    WorldBuilderManager.selectedTiles = selectedTiles;
  }, [selectedTiles]);

  // Handle texture selection change
  const handleTextureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const textureId = e.target.value;
    const texture = textureData.find((t) => t.id === textureId) || null;
    setSelectedTexture(texture);
    setSelectedTiles([]); // Reset selected tiles when texture changes

    // Update tileData.texture in parent
    if (texture) {
      setTileData((prevData) => ({
        ...prevData,
        texture: texture.id,
        tileX: 0, // Reset tile selections
        tileY: 0,
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
    drawCanvasGrid(img.naturalWidth, img.naturalHeight, []);
  };

  // Function to get mouse position relative to the image
  const getMousePositionOnImage = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!imageDimensions || !selectedTexture) return { x: 0, y: 0 };

    const imgElement = e.currentTarget.querySelector(
      "img.texture-image"
    ) as HTMLImageElement;
    if (!imgElement) return { x: 0, y: 0 };

    const rect = imgElement.getBoundingClientRect();

    // Calculate click position relative to the image
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate the scale factor in case the image is resized
    const scaleX = imageDimensions.width / imgElement.width;
    const scaleY = imageDimensions.height / imgElement.height;

    // Get actual pixel positions
    const actualX = clickX * scaleX;
    const actualY = clickY * scaleY;

    return { x: actualX, y: actualY };
  };

  // Function to get tile coordinates from mouse event
  const getTileFromMouseEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const { x, y } = getMousePositionOnImage(e);

    // Calculate row and column
    const col = Math.floor(x / tilePixelWidth);
    const row = Math.floor(y / tilePixelHeight);

    // Ensure the selected tile is within bounds
    const maxCols = Math.floor(imageDimensions!.width / tilePixelWidth);
    const maxRows = Math.floor(imageDimensions!.height / tilePixelHeight);

    if (col >= 0 && col < maxCols && row >= 0 && row < maxRows) {
      return { row, col };
    } else {
      return null;
    }
  };

  // Function to get all tiles within a rectangle
  const getTilesInRectangle = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    // Get the rectangle coordinates
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);

    const colStart = Math.floor(x1 / tilePixelWidth);
    const rowStart = Math.floor(y1 / tilePixelHeight);
    const colEnd = Math.floor(x2 / tilePixelWidth);
    const rowEnd = Math.floor(y2 / tilePixelHeight);

    // Ensure the selection is within bounds
    const maxCols = Math.floor(imageDimensions!.width / tilePixelWidth);
    const maxRows = Math.floor(imageDimensions!.height / tilePixelHeight);

    const tiles = [];
    for (let row = rowStart; row <= rowEnd; row++) {
      if (row < 0 || row >= maxRows) continue;
      for (let col = colStart; col <= colEnd; col++) {
        if (col < 0 || col >= maxCols) continue;
        tiles.push({ row, col });
      }
    }

    return tiles;
  };

  // Function to draw grid lines and highlight selected tiles
  const drawCanvasGrid = (
    width: number,
    height: number,
    tilesToHighlight: { row: number; col: number }[],
    selectionRect?: {
      dragStart: { x: number; y: number } | null;
      dragCurrent: { x: number; y: number } | null;
    }
  ) => {
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

    // Highlight all selected tiles
    tilesToHighlight.forEach((tile) => {
      highlightSelectedTile(ctx, tile);
    });

    // Draw selection rectangle if dragging
    if (
      selectionRect &&
      selectionRect.dragStart &&
      selectionRect.dragCurrent
    ) {
      drawSelectionRectangle(
        ctx,
        selectionRect.dragStart,
        selectionRect.dragCurrent
      );
    }
  };

  // Function to highlight a single tile
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

  // Function to draw the selection rectangle during drag
  const drawSelectionRectangle = (
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    // Draw the selection rectangle
    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // Green color
    ctx.lineWidth = 2;
    ctx.setLineDash([6]); // Dashed line

    ctx.beginPath();
    ctx.rect(
      Math.min(start.x, end.x),
      Math.min(start.y, end.y),
      Math.abs(end.x - start.x),
      Math.abs(end.y - start.y)
    );
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash
  };

  // Handle mouse down event for drag selection
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!selectedTexture || !imageDimensions) return;

    // Start drag selection
    setIsDragging(true);
    const { x, y } = getMousePositionOnImage(e);
    setDragStart({ x, y });
    setDragCurrent({ x, y });

    // Unselect all tiles when starting new drag
    setSelectedTiles([]);
  };

  // Handle mouse move event during drag
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      const { x, y } = getMousePositionOnImage(e);
      setDragCurrent({ x, y });
      // Redraw the canvas to show selection rectangle
      if (imageDimensions) {
        drawCanvasGrid(
          imageDimensions.width,
          imageDimensions.height,
          selectedTiles,
          { dragStart, dragCurrent: { x, y } }
        );
      }
    }
  };

  // Handle mouse up event to finalize selection
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      setIsDragging(false);
      if (!dragStart || !dragCurrent) return;

      // Calculate the tiles within the drag rectangle
      const tilesInRect = getTilesInRectangle(dragStart, dragCurrent);

      // Set selected tiles to tilesInRect
      setSelectedTiles(tilesInRect);

      // Update tileData.tileX and tileData.tileY in parent
      if (tilesInRect.length > 0) {
        setTileData((prevData) => ({
          ...prevData,
          tileX: tilesInRect[0].col,
          tileY: tilesInRect[0].row,
        }));
      } else {
        setTileData((prevData) => ({
          ...prevData,
          tileX: 0,
          tileY: 0,
        }));
      }

      // Clear dragStart and dragCurrent
      setDragStart(null);
      setDragCurrent(null);
    }
  };

  // Effect to redraw the canvas when the selected tiles or drag changes
  useEffect(() => {
    if (!imageDimensions) return;

    const { width, height } = imageDimensions;
    drawCanvasGrid(width, height, selectedTiles, { dragStart, dragCurrent });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTiles, imageDimensions, dragStart, dragCurrent]);

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
        <div
          className="texture-display"
          draggable={false}
          style={{
            position: "relative",
            userSelect: "none",
            width: "100%",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Optional: handle mouse leaving the area
        >
          <img
            draggable={false}
            src={selectedTexture.src}
            alt={selectedTexture.id}
            onLoad={handleImageLoad}
            className="texture-image"
            style={{
              width: "100%",
              userSelect: "none",
              display: "block",
            }}
          />
          {/* Canvas Overlay */}
          <canvas
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              userSelect: "none",
              height: "100%",
              pointerEvents: "none",
            }}
            ref={canvasRef}
            className="texture-canvas"
          />
        </div>
      )}

      {/* Display Selected Tile Coordinates */}
      {selectedTiles.length > 0 && (
        <div className="selected-tiles">
          <p>
            Selected Tiles:
            {selectedTiles.map((tile, index) => (
              <span key={index}>
                {" "}
                (Row: <strong>{tile.row}</strong>, Column:{" "}
                <strong>{tile.col}</strong>)
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};
