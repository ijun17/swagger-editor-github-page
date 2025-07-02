import { useEffect, useState } from "react";
import Overlay from "./Overlay";

type Props = {
  children: string | null | undefined | false;
  onClose?: () => void;
  color?: React.CSSProperties["color"]; //"red" | "black" | "blue" | "green" | "gray";
};

export default function AlertModal({
  children: message,
  onClose,
  color = "black",
}: Props) {
  const [open, setOpen] = useState(!!message);
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);
  return (
    <Overlay
      isOpen={open}
      onClose={() => {
        setOpen(false);
        if (onClose) onClose();
      }}
    >
      <div className="rounded bg-white px-4 py-10 z-100 max-w-xl w-[80%] flex justify-center items-center">
        <div className="text-lg" style={{ color }}>
          {message}
        </div>
      </div>
    </Overlay>
  );
}
