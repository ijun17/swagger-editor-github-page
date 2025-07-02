import { useEffect, useMemo, useState } from "react";
import { useDirectoryJson, useGitHubStore } from "@/api/github-client-hook";
import CreateFileModal from "./CreateFileModal";
import DeleteFileModal from "./DeleteFileModal";
import InitDirectoryModal from "./InitDirectoryModal";

type Props = {
  handlePageChange: (pageState: "editor" | "viewer", url: string) => void;
};

export default function ApiDirectory({ handlePageChange }: Props) {
  const [openCreateFileModal, setOpenCreateFileModal] = useState(false);
  const [openInitDirectoryModal, setOpenInitDirectoryModal] = useState(false);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(
    null
  );
  const [deletePath, setDeletePath] = useState<string | null>(null);

  const { isLoggedIn } = useGitHubStore();
  const directoryQuery = useDirectoryJson();

  const directory = useMemo(
    () =>
      directoryQuery.data
        ? directoryQuery.data.filter((e) => e.type === "dir")
        : [],
    [directoryQuery.data]
  );
  const currentFoleder = (
    directory.find((e) => e.name === currentFolderName && e.type === "dir")
      ?.items ?? []
  ).filter((e) => e.type === "file");
  const currentFiles = currentFoleder.filter((e) => e.type === "file");

  useEffect(() => {
    if (!openCreateFileModal && directory[0] && !currentFolderName) {
      setCurrentFolderName(directory[0].name);
    }
  }, [directory, currentFolderName, openCreateFileModal]);

  return (
    <div className="min-w-2xl w-full h-full flex overflow-x-auto">
      {/* 좌측 패널 */}
      <div className="w-1/4 border-r border-gray-300 p-4 bg-white flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Folders</h2>
          {isLoggedIn && (
            <button
              className="text-white bg-green-600 w-6 h-6 rounded hover:bg-green-700 transition"
              onClick={() => {
                setOpenCreateFileModal(true);
                setCurrentFolderName(null);
              }}
            >
              +
            </button>
          )}
        </div>
        <ul className="space-y-2 flex-1">
          {directory.map((folder) => (
            <li
              key={folder.name}
              className={`cursor-pointer px-2 py-1 rounded hover:bg-green-100 transition ${
                folder.name === currentFolderName ? "bg-green-100" : ""
              }`}
              onClick={() => setCurrentFolderName(folder.name)}
            >
              {folder.name}
            </li>
          ))}
        </ul>
        {isLoggedIn && (
          <button
            className="rounded border border-gray-400 p-1 text-gray-400 hover:bg-gray-100"
            onClick={() => setOpenInitDirectoryModal(true)}
          >
            reset directory
          </button>
        )}
      </div>
      {/* 우측 패널 */}
      <div className="w-3/4 p-4 bg-white">
        {currentFolderName ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Files</h2>
              {isLoggedIn && (
                <button
                  className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => setOpenCreateFileModal(true)}
                >
                  + New File
                </button>
              )}
            </div>
            <div className="space-y-2">
              {currentFiles &&
                currentFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex justify-between items-center border border-gray-300 p-3 rounded hover:shadow-sm transition"
                  >
                    <div>
                      <h3 className="font-semibold">{file.name}</h3>
                    </div>
                    <div className="flex gap-2 [&>*]:rounded-md [&>*]:text-xs [&>*]:font-bold [&>*]:border [&>*]:p-1 [&>*]:hover:translate-y-1 [&>*]:transition">
                      <button
                        className="text-green-600"
                        onClick={() => handlePageChange("editor", file.path)}
                      >
                        edit
                      </button>
                      <button
                        className="text-green-600"
                        onClick={() => handlePageChange("viewer", file.path)}
                      >
                        view
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => setDeletePath(file.path)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-500">
            Create or Select Folder
          </div>
        )}
      </div>
      {/* 폴더 생성 모달 */}
      <CreateFileModal
        isOpen={openCreateFileModal}
        onClose={() => setOpenCreateFileModal(false)}
        folder={currentFolderName}
      />
      {/* 파일 삭제 모달 */}
      <DeleteFileModal
        isOpen={!!deletePath}
        onClose={() => setDeletePath(null)}
        path={deletePath}
      />
      {/* directory.json 초기화 모달 */}
      {isLoggedIn && (
        <InitDirectoryModal
          isOpen={openInitDirectoryModal}
          isError={directoryQuery.isError}
          onClose={() => setOpenInitDirectoryModal(false)}
        />
      )}
    </div>
  );
}
