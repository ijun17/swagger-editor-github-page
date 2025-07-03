import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import { useGitHubStore, useUpdateFiles } from "@/api/github-client-hook";
import Loader from "../common/Loader";
import Modal from "../common/Modal";

const SWAGGER_LOCALSTORAGE_ITEM = "swagger-editor-content";

type Props = {
  edit: boolean;
  path: string | null;
};

export default function HeaderBar(props: Props) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, login, logout } = useGitHubStore();
  const updateFileMutation = useUpdateFiles();

  useEffect(() => {
    localStorage.removeItem(SWAGGER_LOCALSTORAGE_ITEM);
  }, []);

  const handleSaveFile = () => {
    if (!props.path) return;
    try {
      const content = localStorage.getItem(SWAGGER_LOCALSTORAGE_ITEM);
      const path = props.path;
      if (!path || !content)
        throw Error(`Invalid path:${path} / content:${content}`);
      updateFileMutation.mutate({ path, content });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-12 bg-zinc-800 flex justify-between items-center px-4">
      <a
        className="font-bold text-lg text-green-600 flex-shrink-0"
        href={window.location.pathname}
      >
        Swagger Editor
      </a>
      <div className="flex gap-4 flex-shrink">
        {/* url */}
        {props.path && (
          <div className="bg-zinc-700 py-1 px-2 rounded-lg text-xs text-white truncate flex-shrink min-w-0">
            {props.path.split("/").slice(1).join("/")}
          </div>
        )}
        {/* api 저장 버튼 */}
        {props.edit && isLoggedIn && (
          <button
            className="bg-green-600 hover:bg-green-700 rounded text-xs p-1 text-white"
            onClick={handleSaveFile}
          >
            save
          </button>
        )}
        {updateFileMutation.isPending && <Loader />}
        <Modal
          isOpen={updateFileMutation.isError}
          onClose={() => updateFileMutation.reset()}
        >
          <div className="text-red-600 text-center">
            Failed to reset directory.json
          </div>
        </Modal>

        {/* 로그인 로그아웃 버튼 */}
        <button
          className="text-gray-50 text-xs hover:underline"
          onClick={
            isLoggedIn
              ? () => {
                  logout();
                }
              : () => setOpen(true)
          }
        >
          {isLoggedIn ? "logout" : "login"}
        </button>
        <LoginModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={(token) => {
            login(token);
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
}
