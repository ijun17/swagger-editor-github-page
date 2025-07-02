import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { getContentUrl } from "../github/lib/github-client-hook";

type Params = {
  path: string;
};

export default function SwaggerViewer({ path }: Params) {
  return (
    <div className="h-full overflow-y-auto">
      <SwaggerUI url={getContentUrl(path) + `?t=${Date.now().toString()}`} />
    </div>
  );
}
