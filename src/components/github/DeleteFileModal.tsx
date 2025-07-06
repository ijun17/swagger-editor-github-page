import Modal from "../common/Modal";
import { useDeleteFile } from "@/api/github-client-hook";

interface Props extends React.ComponentProps<typeof Modal> {
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={deleteFileMutation.isPending}
      >
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
      </Modal>
      <Modal
        isOpen={deleteFileMutation.isError}
        onClose={() => deleteFileMutation.reset()}
      >
        <div className="text-red-600 text-center">Failed to delete file</div>
      </Modal>
    </>
  );
}
