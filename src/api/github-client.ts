import { Octokit } from "@octokit/rest";

export interface FileOperation {
  path: string;
  content: string | ArrayBuffer;
}

export type DirectoryStructure = (DirectoryFolder | DirectoryFile)[];

interface DirectoryFolder {
  name: string;
  path: string;
  description?: string;
  html_url: string | null;
  download_url: null;
  type: "dir";
  items: DirectoryStructure;
}

interface DirectoryFile {
  name: string;
  path: string;
  description?: string;
  html_url: string | null;
  download_url: string;
  type: "file";
  items?: null;
}

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private email: string;
  private repo: string;
  private branch: string;
  // private branchSha: string | null = null;

  constructor(
    owner: string,
    repo: string,
    branch: string,
    email: string,
    token: string
  ) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.email = email;
    this.repo = repo;
    this.branch = branch;
  }

  /**
   * 브랜치의 최신 SHA를 가져와서 캐시합니다
   */
  // private async getBranchSha(): Promise<string> {
  //   if (!this.branchSha) {
  //     const { data } = await this.octokit.repos.getBranch({
  //       owner: this.owner,
  //       repo: this.repo,
  //       branch: this.branch,
  //     });
  //     this.branchSha = data.commit.sha;
  //   }
  //   return this.branchSha;
  // }

  /**
   * SHA 캐시를 무효화합니다
   */
  // private invalidateShaCache(): void {
  //   this.branchSha = null;
  // }

  /**
   * 문자열 내용을 base64로 인코딩합니다
   */
  private encodeContent(content: string | ArrayBuffer): string {
    if (typeof content === "string") {
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(content);
      return this.arrayBufferToBase64(uint8Array.buffer);
    }
    return this.arrayBufferToBase64(content);
  }

  /**
   * ArrayBuffer를 base64 문자열로 변환하는 브라우저 호환 메서드
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * base64를 디코딩하는 브라우저 호환 메서드
   */
  private base64Decode(base64: string): string {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = new TextDecoder("utf-8");
      return decoder.decode(bytes);
    } catch (error) {
      console.warn("Failed to decode as UTF-8:", error);
      return atob(base64); // 폴백으로 단순 atob 사용
    }
  }

  // async createFile(
  //   path: string,
  //   content: string | ArrayBuffer,
  //   message: string
  // ) {
  //   const author = {
  //     name: this.owner,
  //     email: this.email,
  //   };

  //   await this.octokit.rest.repos.createOrUpdateFileContents({
  //     owner: this.owner,
  //     repo: this.repo,
  //     path,
  //     message,
  //     content: this.encodeContent(content),
  //     branch: this.branch,
  //     author,
  //     committer: author,
  //   });
  // }

  async createOrUpdateFileContent(
    path: string,
    newContent: string | ArrayBuffer,
    message: string
  ) {
    // 1) 기존 파일의 SHA 조회
    const fileData = await this.getContent(path);
    const sha = Array.isArray(fileData) || !fileData ? undefined : fileData.sha;
    const author = {
      name: this.owner,
      email: this.email,
    };

    // 2) 파일 업데이트
    await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      content: this.encodeContent(newContent),
      sha,
      branch: this.branch,
      author,
      committer: author,
    });
  }

  async deleteFile(path: string, message: string) {
    // 1) 기존 파일의 SHA 조회
    const fileData = await this.getContent(path);
    if (!fileData) throw Error("file not found");
    const sha = Array.isArray(fileData) ? fileData[0].sha : fileData.sha;
    const author = {
      name: this.owner,
      email: this.email,
    };
    await this.octokit.rest.repos.deleteFile({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      sha,
      branch: this.branch,
      author,
      committer: author,
    });
  }

  // /**
  //  * 여러 파일을 생성하거나 수정합니다
  //  */
  // async createOrUpdateFiles(
  //   files: FileOperation[],
  //   commitMessage: string = "Update files"
  // ): Promise<void> {
  //   try {
  //     await this.batchCommit({ upserts: files, commitMessage });
  //   } catch (error) {
  //     throw new Error(`Failed to create/update files: ${error}`);
  //   }
  // }

  // /**
  //  * 여러 파일을 삭제합니다
  //  */
  // async deleteFiles(
  //   filePaths: string[],
  //   commitMessage: string = "Delete files"
  // ): Promise<void> {
  //   try {
  //     await this.batchCommit({ deletes: filePaths, commitMessage });
  //   } catch (error) {
  //     throw new Error(`Failed to delete files: ${error}`);
  //   }
  // }

  // async batchCommit({
  //   upserts = [],
  //   deletes = [],
  //   commitMessage = "Batch commit files",
  // }: {
  //   upserts?: FileOperation[];
  //   deletes?: string[];
  //   commitMessage?: string;
  // }): Promise<void> {
  //   if (upserts.length === 0 && deletes.length === 0) return;

  //   // 1. 현재 브랜치 최신 SHA(커밋) 조회
  //   const baseSha = await this.getBranchSha();

  //   // 2. 해당 커밋의 트리 SHA 조회
  //   const { data: baseCommit } = await this.octokit.git.getCommit({
  //     owner: this.owner,
  //     repo: this.repo,
  //     commit_sha: baseSha,
  //   });

  //   // 3. 트리 엔트리 배열 생성
  //   const treeEntries = [
  //     // upserts: content로 지정하면 신규 생성 또는 수정
  //     ...upserts.map((file) => ({
  //       path: file.path,
  //       mode: "100644" as const,
  //       type: "blob" as const,
  //       content: this.encodeContent(file.content),
  //     })),
  //     // deletes: sha를 null로 지정하면 삭제
  //     ...deletes.map((path) => ({
  //       path,
  //       mode: "100644" as const,
  //       type: "blob" as const,
  //       sha: null,
  //     })),
  //   ];

  //   // 4. 새로운 트리 생성 (base_tree 위에 덮어쓰기)
  //   const { data: newTree } = await this.octokit.git.createTree({
  //     owner: this.owner,
  //     repo: this.repo,
  //     base_tree: baseCommit.tree.sha,
  //     tree: treeEntries,
  //   });

  //   // 5. 새 커밋 생성
  //   const { data: newCommit } = await this.octokit.git.createCommit({
  //     owner: this.owner,
  //     repo: this.repo,
  //     message: commitMessage,
  //     tree: newTree.sha,
  //     parents: [baseSha],
  //   });

  //   // 6. 브랜치 포인터 업데이트
  //   await this.octokit.git.updateRef({
  //     owner: this.owner,
  //     repo: this.repo,
  //     ref: `heads/${this.branch}`,
  //     sha: newCommit.sha,
  //   });

  //   // 7. SHA 캐시 무효화
  //   this.invalidateShaCache();
  // }

  /**
   * 파일 또는 폴더를 조회합니다
   */
  async getContent(path: string) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      // 파일인 경우 내용을 디코딩
      if (!Array.isArray(data) && data.type === "file") {
        const decodedContent = this.base64Decode(data.content);
        return {
          ...data,
          decodedContent,
        };
      }

      return data;
    } catch {
      return null;
    }
  }

  /**
   * 특정 폴더를 재귀적으로 탐색하여 JSON 구조로 반환합니다
   */
  async getDirectoryStructure(
    folderPath: string = ""
  ): Promise<DirectoryStructure> {
    try {
      const structure: DirectoryStructure = [];
      await this.buildDirectoryStructure(folderPath, structure);
      return structure;
    } catch (error) {
      throw new Error(
        `Failed to get directory structure for ${folderPath}: ${error}`
      );
    }
  }

  /**
   * 재귀적으로 디렉토리 구조를 빌드하는 헬퍼 메서드
   */
  private async buildDirectoryStructure(
    path: string,
    structure: DirectoryStructure
  ): Promise<void> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.type === "dir") {
            // 디렉토리인 경우
            const folder: DirectoryFolder = {
              name: item.name,
              path: item.path,
              html_url: item.html_url,
              download_url: null, // 디렉토리는 항상 null
              type: "dir",
              items: [], // 빈 배열로 초기화
            };

            // 재귀적으로 자식 디렉토리 구조 빌드
            await this.buildDirectoryStructure(item.path, folder.items);
            structure.push(folder);
          } else if (item.type === "file") {
            // 파일인 경우
            const file: DirectoryFile = {
              name: item.name,
              path: item.path,
              html_url: item.html_url,
              download_url: item.download_url || "", // download_url이 null인 경우 빈 문자열
              type: "file",
            };
            structure.push(file);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to access path ${path}:`, error);
    }
  }

  /**
   * 현재 설정된 저장소 정보를 반환합니다
   */
  getRepositoryInfo(): { owner: string; repo: string; branch: string } {
    return {
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
    };
  }

  /**
   * 브랜치를 변경합니다
   */
  // setBranch(branch: string): void {
  //   this.branch = branch;
  //   this.invalidateShaCache();
  // }
}
