import { useEffect, useState } from "react";
import { useAddFile } from "@/api/github-client-hook";
import Modal from "../common/Modal";

const templates = [
  {
    name: "OpenAPI 3.0 - YAML",
    extension: "yaml",
    template: `
openapi: "3.0.0"
info:
  title: "API Title"
  version: "1.0.0"
  description: "API description"
paths:
  /example:
    get:
      summary: "Example GET"
      responses:
        '200':
          description: "Successful response"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Example"
components:
  schemas:
    Example:
      type: object
      properties:
        message:
          type: string
          example: "Hello, world"
`.trim(),
  },
  {
    name: "OpenAPI 3.0 - JSON",
    extension: "json",
    template: JSON.stringify(
      {
        openapi: "3.0.0",
        info: {
          title: "API Title",
          version: "1.0.0",
          description: "API description",
        },
        paths: {
          "/example": {
            get: {
              summary: "Example GET",
              responses: {
                "200": {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Example",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Example: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Hello, world",
                },
              },
            },
          },
        },
      },
      null,
      2
    ),
  },
  {
    name: "OpenAPI 2.0 - YAML",
    extension: "yaml",
    template: `
swagger: "2.0"
info:
  title: "API Title"
  version: "1.0.0"
  description: "API description"
paths:
  /example:
    get:
      summary: "Example GET"
      responses:
        200:
          description: "Successful response"
          schema:
            $ref: "#/definitions/Example"
definitions:
  Example:
    type: object
    properties:
      message:
        type: string
        example: "Hello, world"
`.trim(),
  },
  {
    name: "OpenAPI 2.0 - JSON",
    extension: "json",
    template: JSON.stringify(
      {
        swagger: "2.0",
        info: {
          title: "API Title",
          version: "1.0.0",
          description: "API description",
        },
        paths: {
          "/example": {
            get: {
              summary: "Example GET",
              responses: {
                "200": {
                  description: "Successful response",
                  schema: {
                    $ref: "#/definitions/Example",
                  },
                },
              },
            },
          },
        },
        definitions: {
          Example: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Hello, world",
              },
            },
          },
        },
      },
      null,
      2
    ),
  },
  {
    name: "Empty YAML",
    extension: "yaml",
    template: "# Add your OpenAPI spec here\n",
  },
  {
    name: "Empty JSON",
    extension: "json",
    template: "// Add your OpenAPI spec here\n",
  },
] as const;

interface Props extends React.ComponentProps<typeof Modal> {
  folder: string | null;
}

export function CreateFileModal({ isOpen, onClose, folder }: Props) {
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<string>(templates[0].name);
  const [error, setError] = useState<string | null>(null);

  const addFileMutation = useAddFile();

  const currentTemplete = templates.find((e) => e.name === fileType);

  useEffect(() => {
    setFolderName(folder || "");
  }, [folder]);

  const isButtonActive = folderName.trim() !== "" && fileName.trim() !== "";

  const handleCreateFile = () => {
    if (folderName.includes("/")) setError("Folder name cannot contain '/'");
    else if (fileName.includes("/")) setError("File name cannot contain '/'");
    else {
      addFileMutation.mutate(
        {
          folder: folderName.trim(),
          file: fileName.trim(),
          extension: currentTemplete?.extension || "json",
          content: currentTemplete?.template.trim() || "",
        },
        {
          onSuccess: onClose,
        }
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={addFileMutation.isPending}
      >
        <h2 className="text-xl font-semibold">create API</h2>
        <div>
          <div className="block text-sm font-medium mb-1">Folder Name</div>
          <input
            type="text"
            name="forder-name"
            value={folderName}
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
            style={!isButtonActive ? { background: "lightgray" } : {}}
          >
            create
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={addFileMutation.isError}
        onClose={() => addFileMutation.reset()}
      >
        <div className="text-red-600 text-center">Failed to create file</div>
      </Modal>
      <Modal isOpen={!!error} onClose={() => setError(null)}>
        {error}
      </Modal>
    </>
  );
}

export default CreateFileModal;
