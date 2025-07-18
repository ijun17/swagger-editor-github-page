import { useEffect, useRef, useState } from "react";
import SwaggerEditorBundle from "swagger-editor-dist/swagger-editor-bundle";
import SwaggerEditorStandalonePreset from "swagger-editor-dist/swagger-editor-standalone-preset";
import "swagger-editor-dist/swagger-editor.css";
import "./SwaggerEditor.css";
import { useEditorUrl, useGitHubStore } from "@/api/github-client-hook";

declare global {
  interface Window {
    editor: object;
  }
}

type Props = {
  path: string;
};

function SwaggerEditor({ path }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isLoggedIn } = useGitHubStore();
  const { url, headers, downloadUrl } = useEditorUrl(path);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 처음 한번만 생성
    if (ref.current && ref.current.childElementCount === 0) {
      const editor = SwaggerEditorBundle({
        dom_id: "#swagger-editor",
        layout: "StandaloneLayout",
        presets: [SwaggerEditorStandalonePreset],
        queryConfigEnabled: false,
        url: downloadUrl,
        requestInterceptor: (e) => {
          e.url = url;
          e.headers = {
            ...e.headers,
            ...headers,
          };
          return e;
        },
        responseInterceptor: (e) => {
          setIsLoading(false);
          return e;
        },
        showCommonExtensions: true,
      });
      window.editor = editor;
    }
  }, [ref, url, downloadUrl, headers]);
  return (
    <div
      id="swagger-editor"
      className={
        "h-full min-w-2xl" +
        (isLoading ? " swagger-editor-hide-code" : "") +
        (isLoggedIn ? "" : " not-logged-in")
      }
      ref={ref}
    ></div>
  );
}

export default SwaggerEditor;
