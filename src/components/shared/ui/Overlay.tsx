import { useRef } from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactElement;
}

export default function Overlay({ isOpen, onClose, children }: OverlayProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (onClose && ref.current && e.target === ref.current) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleClick}
      ref={ref}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-150 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
