import { useEffect, useState, lazy, Suspense } from "react";
import GithubBar from "./components/github/GithubBar";
import SwaggerApiList from "./components/swagger/SwaggerApiList";
import { useLocation, useNavigate } from "react-router-dom";

const SwaggerEditor = lazy(() => import("./components/swagger/SwaggerEditor"));
const SwaggerViewer = lazy(() => import("./components/swagger/SwaggerViewer"));

// 단일 페이지
function App() {
  const [pageState, setPageState] = useState<
    "list" | "viewer" | "editor" | null
  >(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash == "") setPageState("list");
    if (hash == "#viewer") setPageState("viewer");
    if (hash == "#editor") setPageState("editor");
    const params = new URLSearchParams(location.search);
    const decodedUrl = params.get("url");
    if (decodedUrl) setApiUrl(decodeURIComponent(decodedUrl));
    else setApiUrl(null);
  }, [location]);

  const handlePageChange = (pageState: "viewer" | "editor", apiUrl: string) => {
    navigate(
      window.location.pathname +
        "?url=" +
        encodeURIComponent(apiUrl) +
        "#" +
        pageState
    );
  };

  return (
    <div className="flex flex-col fixed w-full h-full max-w-full max-h-full">
      <GithubBar edit={pageState === "editor"} url={apiUrl} />
      <div className="flex-1 min-h-0">
        {pageState === "list" && (
          <SwaggerApiList handlePageChange={handlePageChange} />
        )}
        {pageState === "viewer" && apiUrl && (
          <Suspense fallback={"로딩중"}>
            <SwaggerViewer url={apiUrl} />
          </Suspense>
        )}

        {pageState === "editor" && apiUrl && (
          <Suspense fallback={"로딩중"}>
            <SwaggerEditor url={apiUrl} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;
