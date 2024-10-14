import ExportWorld from "@divineretro/tile/Archive/ExportWorld";
import ImportWorld from "@divineretro/tile/Archive/ImportWorld";
import { useFileDownload } from "../useFileDownload";
import { useFileUpload } from "../useFileUpload";
import { TilesEngine } from "@divineretro/tile/TilesEngine";
import { TileRenderer } from "@divineretro/tile/Renderer/TileRenderer";
import { ArchivedWorldData } from "@divineretro/tile/Archive/Archive.types";
export default function WorldManager(props: { renderer: TileRenderer }) {
  const { downloadFile } = useFileDownload();
  const [fileInput, uploadFiel] = useFileUpload();
  return (
    <>
      <h2 className="section-title">Archive</h2>
      {fileInput}
      <div className="control-group">
        <button
          onClick={async () => {
            TilesEngine.addWorld({ id: "main", chunks: [] });
            props.renderer.world = "main";
          }}
        >
          New World
        </button>
        <button
          onClick={async () => {
            const world = await ExportWorld({
              worldId: "main",
            });
            downloadFile(`${world.id}.json`, JSON.stringify(world));
          }}
        >
          Archive World
        </button>
        <button
          onClick={async () => {
            console.log("import world");
            const data: ArchivedWorldData = JSON.parse(
              await uploadFiel("string")
            );
            console.log("dat", data);
            const world = await ImportWorld({
              data,
            });
            TilesEngine.addWorld(world);
            props.renderer.world = data.id;
          }}
        >
          Import World
        </button>
      </div>
    </>
  );
}
