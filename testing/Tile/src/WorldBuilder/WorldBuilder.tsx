import "./WorldBuilder.css";

import { EngienNodes } from "../EngineNodes";
import WorldManager from "./Components/WorldManager";
import { TileDataSelector } from "./Components/TileDataSelect";
import { WorldCamera } from "./Components/WorldCamera";
import { TileConstructor } from "./Components/TileConstructor";
import { RendererLayers } from "./Components/RendererLayers";

export default function WorldBuilder(props: { nodes: EngienNodes }) {
  return (
    <div className="world-builder">
      <h1 className="main-title">⛯ Divine Retro Tile ⛯</h1>
      <h2 className="sub-title">World Builder</h2>
      <WorldManager renderer={props.nodes.renderer} />
      <WorldCamera camera={props.nodes.camera} />
      <RendererLayers renderer={props.nodes.renderer} />
      <TileConstructor renderer={props.nodes.renderer} />
      <TileDataSelector renderer={props.nodes.renderer} />
    </div>
  );
}
