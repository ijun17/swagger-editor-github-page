import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "./SwaggerEditor.css";
import { useEditorUrl } from "@/api/github-client-hook";

type Params = {
  path: string;
};

export default function SwaggerViewer({ path }: Params) {
  const { url, headers, downloadUrl } = useEditorUrl(path);
  return (
    <div className="h-full overflow-y-auto">
      <SwaggerUI
        url={downloadUrl}
        requestInterceptor={(e) => {
          e.url = url;
          e.headers = {
            ...e.headers,
            ...headers,
          };
          return e;
        }}
      />
    </div>
  );
}
