# 🚀 Swagger Editor on GitHub Pages

This project provides a fully functional **Swagger Editor** that runs **entirely on GitHub Pages**, requiring **no backend server**.

Perfect for lightweight API documentation management directly through GitHub.

---

## 📌 How to Use

### 1. Configure Personal Information

Edit the `.env` file to match your GitHub account details:

```shell
# Your GitHub username
VITE_GITHUB_OWNER="ijun17"

# Your GitHub email
VITE_GITHUB_EMAIL="ijun17@naver.com"

# Repository name
VITE_GITHUB_REPO="swagger-editor-github-page"

# Branch to store API files
VITE_GITHUB_BRANCH="main"
```

### 2. Deploy to GitHub Pages

1. Go to your repository’s **Settings** → **Pages** and enable GitHub Pages.
2. Then go to the **Actions** tab.
3. Select the **Deploy static content to Pages** workflow and click **Run workflow**.

---

### 3. Generate a GitHub Token

This app uses GitHub’s API to manage OpenAPI files in your repository.

You will need a **Personal Access Token** (classic) with the following scopes:

- `repo` (or `repo:contents` if public repo)
- `workflow` (to trigger deployment)

**Steps:**

1. Visit [GitHub → Settings → Developer Settings → Tokens](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. Check the required scopes and generate the token.
4. Copy the token and keep it secure.

> 🔐 The token is stored only in your browser's localStorage. It is never transmitted anywhere else.

---

### 4. Create `directory.json`

1. Visit your deployed GitHub Pages site.
2. Click **Login** and paste your GitHub token.
3. If `directory.json` is missing, a modal will prompt you.
4. Click **Create directory.json** to initialize the structure.

Now you can create, edit, and delete OpenAPI files directly from the UI.

---

## 🖼️ Screenshots

### 📁 Folder & File Management

### 📄 API Viewer

### ✏️ API Editor

---

## ⚙️ Tech Stack

| Layer            | Technology                                                               |
| ---------------- | ------------------------------------------------------------------------ |
| Framework        | [React 17](https://reactjs.org/), [Vite](https://vitejs.dev/)            |
| UI Styling       | [Tailwind CSS](https://tailwindcss.com/)                                 |
| State Management | [Zustand](https://github.com/pmndrs/zustand)                             |
| Networking       | [Octokit REST](https://github.com/octokit/rest.js)                       |
| API Editing      | [swagger-editor-dist](https://www.npmjs.com/package/swagger-editor-dist) |
| API Viewing      | [swagger-ui-react](https://www.npmjs.com/package/swagger-ui-react)       |
| Data Fetching    | [TanStack Query](https://tanstack.com/query/latest)                      |
| Routing          | [React Router v6](https://reactrouter.com/)                              |
| Linting          | ESLint + TypeScript ESLint                                               |
| Language         | TypeScript                                                               |
