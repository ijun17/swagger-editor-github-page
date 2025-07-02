import AlertModal from "../common/AlertModal";
import Loader from "../common/Loader";
import Overlay from "../common/Overlay";
import { useDeleteFile } from "@/api/github-client-hook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  path: string | null;
}

export default function DeleteFileModal({ isOpen, onClose, path }: Props) {
  const deleteFileMutation = useDeleteFile();

  const handleDelete = () => {
    if (path)
      deleteFileMutation.mutate(path, {
        onSuccess: onClose,
        onError: onClose,
      });
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white rounded p-4 max-w-xl w-[90%] h-40 flex flex-col justify-between">
          <div className="text-center pt-6">
            Do you want to delete <span className="text-red-600">{path}</span>?
          </div>
          <div className="flex justify-center gap-4 [&>*]:rounded [&>*]:p-1 [&>*]:flex-1">
            <button onClick={onClose} className="border border-gray-400">
              cancel
            </button>
            <button onClick={handleDelete} className="bg-red-600 text-white ">
              delete
            </button>
          </div>
          {deleteFileMutation.isPending && <Loader />}
        </div>
      </Overlay>
      <AlertModal color="red">
        {deleteFileMutation.isPending
          ? null
          : deleteFileMutation.isError && "Failed to delete file"}
      </AlertModal>
    </>
  );
}
