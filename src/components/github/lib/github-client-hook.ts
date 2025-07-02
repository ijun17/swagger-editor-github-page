import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GitHubClient,
  type FileOperation,
  type DirectoryStructure,
} from "./github-client";
import { create } from "zustand";

const owner = import.meta.env.VITE_GITHUB_OWNER;
const email = import.meta.env.VITE_GITHUB_EMAIL;
const repo = import.meta.env.VITE_GITHUB_REPO;
const branch = import.meta.env.VITE_GITHUB_BRANCH;
const API_PATH = "docs";
const FILE_PATH = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

export function getContentUrl(path: string) {
  return FILE_PATH + path;
}
export function extractPathFromContentUrl(url: string) {
  return url.replace(FILE_PATH, "");
}
export function getApiContentUrl(path: string) {
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
}
export function createPath(folder: string, file: string, extention: string) {
  return `${API_PATH}/${folder}/${file}.${extention}`;
}
const directory_path = API_PATH + "/directory.json";
const LOCALSTORAGE_GITHUB_TOKEN = "gh_token";

interface GitHubState {
  client: GitHubClient | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useGitHubStore = create<GitHubState>((set) => ({
  client: null,
  isLoggedIn: false,
  token: null,

  login: (token) => {
    localStorage.setItem(LOCALSTORAGE_GITHUB_TOKEN, token);
    const client = new GitHubClient(owner, repo, branch, email, token);
    set({ client, isLoggedIn: true, token });
  },

  logout: () => {
    localStorage.removeItem(LOCALSTORAGE_GITHUB_TOKEN);
    set({ client: null, isLoggedIn: false, token: null });
  },
}));

// auto login
const localStorageToken = localStorage.getItem(LOCALSTORAGE_GITHUB_TOKEN);
if (localStorageToken) {
  useGitHubStore.getState().login(localStorageToken);
}

// Fetch doc/directory.json
export function useDirectoryJson() {
  const { isLoggedIn, token } = useGitHubStore();
  return useQuery<DirectoryStructure | null>({
    queryFn: async () => {
      if (isLoggedIn) {
        return await fetch(getApiContentUrl(directory_path), {
          cache: "no-store",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3.raw",
          },
        }).then((res) => res.json());
      }
      return await fetch(
        FILE_PATH + directory_path + `?t=${Date.now().toString()}`,
        {
          cache: "no-store",
        }
      ).then((res) => res.json());
    },
    queryKey: ["directoryJson"],
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
  });
}

// Add file & update directory.json
export function useAddFile() {
  const { client } = useGitHubStore();
  const qc = useQueryClient();
  return useMutation(
    async ({ path, content }: FileOperation) => {
      if (!client) throw new Error("Not logged in");
      // Create new file
      await client.createOrUpdateFileContent(path, content, `Add ${path}`);
      // Update directory.json
      await initDirectory(client);
    },
    {
      onSuccess: invalidateDirectory(qc),
    }
  );
}

// Update file only
export function useUpdateFiles() {
  const { client } = useGitHubStore();
  return useMutation(async ({ path, content }: FileOperation) => {
    if (!client) throw new Error("Not logged in");
    await client.createOrUpdateFileContent(path, content, `Update ${path}`);
  });
}

// Delete file & update directory.json
export function useDeleteFile() {
  const { client } = useGitHubStore();
  const qc = useQueryClient();
  return useMutation(
    async (path: string) => {
      if (!client) throw new Error("Not logged in");
      await client.deleteFile(path, `Delete ${path}`);
      await initDirectory(client);
    },
    {
      onSuccess: invalidateDirectory(qc),
    }
  );
}

// Rename file & update directory.json
export function useRenameFile() {
  const { client } = useGitHubStore();
  const qc = useQueryClient();
  return useMutation(
    async ({ oldPath, newPath }: { oldPath: string; newPath: string }) => {
      if (!client) throw new Error("Not logged in");
      // Fetch content first
      const content = await fetch(FILE_PATH + oldPath).then((res) =>
        res.text()
      );
      // Delete old, create new
      await client.createOrUpdateFileContent(
        newPath,
        content,
        `Rename ${oldPath} → ${newPath}`
      );
      await client.deleteFile(oldPath, `Rename ${oldPath} → ${newPath}`);

      // Update manifest
      await initDirectory(client);
    },
    {
      onSuccess: invalidateDirectory(qc),
    }
  );
}

export function useEditorUrl(path: string) {
  const { isLoggedIn } = useGitHubStore();
  const url = isLoggedIn
    ? getApiContentUrl(path)
    : getContentUrl(path) + `?t=${Date.now().toString()}`;
  const headers: HeadersInit = isLoggedIn
    ? { Accept: "application/vnd.github.v3.raw" }
    : {};
  return { url, headers };
}

// Initialize directory.json from scratch
export function useInitDirectory() {
  const { client } = useGitHubStore();
  const qc = useQueryClient();
  return useMutation(
    async () => {
      if (!client) throw new Error("Not logged in");
      await initDirectory(client);
    },
    {
      onSuccess: invalidateDirectory(qc),
    }
  );
}

function invalidateDirectory(queryClient: ReturnType<typeof useQueryClient>) {
  return () => queryClient.invalidateQueries({ queryKey: ["directoryJson"] });
}

async function initDirectory(client: GitHubClient) {
  const dir = await client.getDirectoryStructure(API_PATH);
  await client.createOrUpdateFileContent(
    directory_path,
    JSON.stringify(dir, null, 2),
    "Update directory.json"
  );
}
