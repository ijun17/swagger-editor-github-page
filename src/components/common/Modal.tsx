import type React from "react";
import Loader from "./Loader";
import Overlay from "./Overlay";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, isLoading, children }: Props) {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-[80%] p-6 space-y-4 transform transition-all scale-100">
        {isLoading && <Loader />}
        {children}
      </div>
    </Overlay>
  );
}
