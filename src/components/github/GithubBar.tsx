import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import { checkLogin, login, logout } from "./github-api";

type Props = {
  edit: boolean;
  url: string | null;
};

export default function GithubBar(props: Props) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkLogin());
  }, []);

  return (
    <div className="h-12 bg-zinc-800 flex justify-between items-center px-4">
      <a
        className="font-bold text-lg text-green-600 flex-shrink-0"
        href={window.location.pathname}
      >
        Swagger Editor
      </a>
      <div className="flex gap-4 flex-shrink">
        {/* url */}
        {props.url && (
          <div className="bg-zinc-700 py-1 px-2 rounded-lg text-xs text-white truncate flex-shrink min-w-0">
            {props.url}
          </div>
        )}
        {/* api 저장 버튼 */}
        {props.edit && isLoggedIn && (
          <button className="bg-green-600 hover:bg-green-700 rounded text-xs p-1 text-white">
            save
          </button>
        )}

        {/* 로그인 로그아웃 버튼 */}
        <button
          className="text-gray-50 text-xs hover:underline"
          onClick={
            isLoggedIn
              ? () => {
                  logout();
                  setIsLoggedIn(false);
                }
              : () => setOpen(true)
          }
        >
          {isLoggedIn ? "logout" : "login"}
        </button>
        <LoginModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={(token) => {
            login(token);
            setIsLoggedIn(true);
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
}
