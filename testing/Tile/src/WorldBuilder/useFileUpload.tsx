import { ReactNode, useRef } from "react";

export function useFileUpload(): [
  fileInput: ReactNode,
  (type: "string" | "binary") => Promise<any | null>
] {
  const ref = useRef<HTMLInputElement | null>(null);

  return [
    <input type="file" ref={ref} style={{ display: "none" }} />,
    (type: "string" | "binary" = "binary") => {
      return new Promise<any>((resolve) => {
        console.log("upload file",ref.current)
        const listener = () => {
          console.log("usup ")
          const file = ref!.current!.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (type === "string") {
                resolve(reader.result as string);
              } else {
                resolve(reader.result as ArrayBuffer);
              }
            };
            if (type === "string") {
              reader.readAsText(file);
            }
            if (type === "binary") {
              reader.readAsArrayBuffer(file);
            }
          } else {
            resolve(null);
          }
          ref!.current!.removeEventListener("change", listener);
        };
        ref!.current!.addEventListener("change", listener);

        ref!.current!.click();
      });
    },
  ];
}
