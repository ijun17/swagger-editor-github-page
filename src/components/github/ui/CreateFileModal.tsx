import { useState } from "react";
import { createPath, useAddFile } from "../lib/github-client-hook";
import Overlay from "../../shared/ui/Overlay";
import Loader from "../../shared/ui/Loader";

const templates = [
  {
    name: "OpenAPI 3.0 - YAML",
    extension: "yaml",
    template: `
openapi: "3.0.0"
info:
  title: ""
  version: "1.0.0"
paths: {}
components: {}
`,
  },
  {
    name: "OpenAPI 3.0 - JSON",
    extension: "json",
    template: `
{
  "openapi": "3.0.0",
  "info": {
    "title": "",
    "version": "1.0.0"
  },
  "paths": {},
  "components": {}
}
`,
  },
  {
    name: "OpenAPI 2.0 - YAML",
    extension: "yaml",
    template: `
swagger: "2.0"
info:
  title: ""
  version: "1.0.0"
paths: {}
definitions: {}
`,
  },
  {
    name: "OpenAPI 2.0 - JSON",
    extension: "json",
    template: `
{
  "swagger": "2.0",
  "info": {
    "title": "",
    "version": "1.0.0"
  },
  "paths": {},
  "definitions": {}
}
`,
  },

  {
    name: "Empty YAML",
    extension: "yaml",
    template: "",
  },
  {
    name: "Empty JSON",
    extension: "json",
    template: "",
  },
] as const;

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: string | null;
}

const CreateFileModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  folder,
}) => {
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<string>(templates[0].name);

  const addFileMutation = useAddFile();

  const currentTemplete = templates.find((e) => e.name === fileType);

  const handleCreateFile = () => {
    addFileMutation.mutate(
      {
        path: createPath(
          folder || folderName,
          fileName,
          currentTemplete?.extension || "json"
        ),
        content: currentTemplete?.template || "",
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 space-y-4 transform transition-all scale-100">
        {addFileMutation.isPending && <Loader />}
        <h2 className="text-xl font-semibold">create API</h2>
        <div>
          <div className="block text-sm font-medium mb-1">Folder Name</div>
          <input
            type="text"
            name="forder-name"
            value={folder || folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className={
              "w-full border p-2 rounded focus:outline-none focus:ring focus:ring-green-200" +
              (folder ? " bg-gray-100 text-gray-500" : "")
            }
            placeholder="folder name"
            disabled={!!folder}
          />
        </div>

        <div>
          <div className="block text-sm font-medium mb-1">File Name</div>
          <input
            type="text"
            name="file-name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-green-200"
            placeholder="file name"
          />
        </div>

        <div>
          <div className="block text-sm font-medium mb-1">API type</div>
          <select
            value={fileType}
            name={"templete-select"}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-green-200"
          >
            {templates.map((e) => (
              <option key={e.name} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            cancel
          </button>
          <button
            onClick={handleCreateFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            create
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default CreateFileModal;
