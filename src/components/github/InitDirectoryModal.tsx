import { useInitDirectory } from "@/api/github-client-hook";
import Overlay from "../common/Overlay";
import Loader from "../common/Loader";
import Modal from "../common/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isError: boolean;
};

export default function InitDirectoryModal(props: Props) {
  const directoryMutation = useInitDirectory();

  return (
    <>
      <Overlay
        isOpen={props.isError || props.isOpen}
        onClose={props.isError ? undefined : props.onClose}
      >
        <div className="bg-white max-w-lg w-[90%] h-40 rounded p-6 flex flex-col justify-between">
          {directoryMutation.isPending && <Loader />}
          <div className="text-center text-lg">
            {props.isError
              ? "doc/directory.json is not exist"
              : "Do you want to reset the doc/directory.json file?"}
          </div>
          <button
            className="w-full p-2 bg-green-600 rounded"
            onClick={() =>
              directoryMutation.mutate(undefined, {
                onSuccess: props.onClose,
                onError: props.onClose,
              })
            }
          >
            {props.isError ? "create directory.json" : "reset directory.json"}
          </button>
        </div>
      </Overlay>
      <Modal
        isOpen={directoryMutation.isError}
        onClose={() => directoryMutation.reset()}
      >
        <div className="text-green-600 text-center">
          Successfully reset directory.json
        </div>
      </Modal>
      <Modal
        isOpen={directoryMutation.isError}
        onClose={() => directoryMutation.reset()}
      >
        <div className="text-red-600 text-center">
          Failed to reset directory.json
        </div>
      </Modal>
    </>
  );
}
