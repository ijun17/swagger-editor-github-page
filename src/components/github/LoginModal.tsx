import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSubmit,
}: LoginModalProps) {
  const [password, setPassword] = useState("");

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-150 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-xl shadow-xl max-w-80 w-10/12 p-6 transform transition-transform duration-150 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4">GitHub Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(password);
          }}
          className="space-y-2 text-sm"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              username
            </label>
            <input
              type="text"
              value="ijun17"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="GitHub token"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className={
              "w-full mt-4 text-white py-2 rounded transition " +
              (password !== ""
                ? " bg-green-600 hover:bg-green-700"
                : " bg-gray-300")
            }
            disabled={!password}
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
}
