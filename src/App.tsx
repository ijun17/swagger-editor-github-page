import { useEffect, useState, lazy, Suspense } from "react";
import GithubBar from "./components/github/ui/GithubBar";
import SwaggerApiList from "./components/github/ui/ApiList";
import { useLocation, useNavigate } from "react-router-dom";

const SwaggerEditor = lazy(() => import("./components/swagger/SwaggerEditor"));
const SwaggerViewer = lazy(() => import("./components/swagger/SwaggerViewer"));

// 단일 페이지
function App() {
  const [pageState, setPageState] = useState<
    "list" | "viewer" | "editor" | null
  >(null);
  const [path, setPath] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash == "") setPageState("list");
    if (hash == "#viewer") setPageState("viewer");
    if (hash == "#editor") setPageState("editor");
    const params = new URLSearchParams(location.search);
    const decodedPath = params.get("path");
    if (decodedPath) setPath(decodeURIComponent(decodedPath));
    else setPath(null);
  }, [location]);

  const handlePageChange = (pageState: "viewer" | "editor", apiUrl: string) => {
    navigate(
      window.location.pathname +
        "?path=" +
        encodeURIComponent(apiUrl) +
        "#" +
        pageState
    );
  };

  return (
    <div className="flex flex-col w-full h-full max-w-full max-h-full">
      <GithubBar edit={pageState === "editor"} path={path} />
      <div className="flex-1 min-h-0 overflow-auto">
        {pageState === "list" && (
          <SwaggerApiList handlePageChange={handlePageChange} />
        )}
        {pageState === "viewer" && path && (
          <Suspense fallback={"Loading..."}>
            <SwaggerViewer path={path} />
          </Suspense>
        )}

        {pageState === "editor" && path && (
          <Suspense fallback={"Loading..."}>
            <SwaggerEditor path={path} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;
