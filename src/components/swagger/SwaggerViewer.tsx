import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Params = {
  url: string;
};

export default function SwaggerViewer({ url }: Params) {
  return <SwaggerUI url={url} />;
}
