import { useInitDirectory } from "@/api/github-client-hook";
import Overlay from "../common/Overlay";
import Loader from "../common/Loader";
import AlertModal from "../common/AlertModal";

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
      <AlertModal color="green">
        {directoryMutation.isPending
          ? null
          : directoryMutation.isSuccess && "Successfully reset directory.json"}
      </AlertModal>
      <AlertModal color="red">
        {directoryMutation.isPending
          ? null
          : directoryMutation.isError && "Failed to reset directory.json"}
      </AlertModal>
    </>
  );
}
