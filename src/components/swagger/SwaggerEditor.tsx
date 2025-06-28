import { useEffect, useRef } from "react";
import SwaggerEditorBundle from "swagger-editor-dist/swagger-editor-bundle";
import SwaggerEditorStandalonePreset from "swagger-editor-dist/swagger-editor-standalone-preset";
import "swagger-editor-dist/swagger-editor.css";
import "./SwaggerEditor.css";

declare global {
  interface Window {
    editor: object;
  }
}

type Props = {
  url?: string;
  spec?: object;
};

function SwaggerEditor({ url, spec }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      const editor = SwaggerEditorBundle({
        dom_id: "#swagger-editor",
        layout: "StandaloneLayout",
        presets: [SwaggerEditorStandalonePreset],
        queryConfigEnabled: false,
        url,
        spec,
      });
      window.editor = editor;
    }
  }, [ref, url, spec]);
  return <div id="swagger-editor" className="flex-1 min-h-0" ref={ref}></div>;
}

export default SwaggerEditor;
