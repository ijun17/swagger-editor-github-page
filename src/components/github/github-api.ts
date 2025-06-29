import { Octokit } from "@octokit/rest";

let octokit: Octokit | null = null;
const owner = "ijun17";
const author = {
  name: owner,
  email: "ijun17@naver.com",
};
const repo = "swagger-editor-github-page";
const apiPath = "docs/";
const branch = "main";

// const FILE_BASE = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/`;

function genPath(folder: string, file: string) {
  return apiPath + folder + "/" + file + "";
}

export function login(token: string) {
  localStorage.setItem("token", token);
  return (octokit = new Octokit({ auth: token }));
}

export function checkLogin() {
  const token = localStorage.getItem("token");
  if (token) login(token);
  return !!token;
}

export function logout() {
  localStorage.removeItem("token");
}

// 폴더들 조회하기
export async function getFolders() {
  return await getDirectory(apiPath);
}

// 파일들 조회하기
export async function getFiles(folder: string) {
  return await getDirectory(apiPath + folder);
}

// API 파일을 받아오기
export async function getApi(folder: string, file: string) {
  return await getFileContents(genPath(folder, file));
}

// API 파일 생성 및 수정
export async function upsertApi(folder: string, file: string, content: string) {
  return await createOrUpdateFileContents(genPath(folder, file), content);
}

// API 파일 삭제
export async function deleteApi(folder: string, file: string) {
  deleteFile(genPath(folder, file));
}

// // API 목록 조회
// export async function getApiList() {
//   return await getFileContents(apiPath + "api.json");
// }

// // API 목록 수정
// export async function updateApiList(content: string) {
//   return await createOrUpdateFileContents(apiPath + "api.json", content);
// }

async function getFileContents(path: string) {
  if (!octokit) return;
  const result = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path,
    }
  );
  if (!Array.isArray(result.data)) {
    const downloadUrl = result.data.download_url;
    if (!downloadUrl) return;
    const response = await fetch(downloadUrl);
    const content = await response.text();
    return content;
  }
}

async function getDirectory(path: string) {
  if (!octokit) return;
  const result = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path,
    }
  );
  if (Array.isArray(result.data)) {
    return result.data;
  }
}

async function createOrUpdateFileContents(path: string, content: string) {
  if (!octokit) return;
  const contentBase64 = btoa(unescape(encodeURIComponent(content)));

  let sha;
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    if (!Array.isArray(res.data)) sha = res.data.sha;
  } catch (err) {
    console.log(err);
  }
  const res = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    message: "upsertApi",
    content: contentBase64,
    sha,
    author,
    committer: author,
  });

  return res.data.content;
}

async function deleteFile(path: string) {
  if (!octokit) return;
  const res = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });
  if (!Array.isArray(res.data)) {
    const sha = res.data.sha;
    await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path,
      message: "delete file",
      sha,
      branch,
    });
  }
}
