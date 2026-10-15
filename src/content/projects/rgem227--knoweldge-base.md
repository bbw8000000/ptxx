---
title: "rgem227/knoweldge-base"
owner: "rgem227"
name: "knoweldge-base"
fullName: "rgem227/knoweldge-base"
description: "Personal or team knowledge base, supports MCP API calls."
sourceUrl: "https://github.com/rgem227/knoweldge-base"
stars: 136
forks: 2
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-23"
pushedAt: "2026-09-22T05:28:17Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Knowledge Base Phase 1

This repository contains the phase 1 minimum viable file knowledge base.

## Current Stack

- Backend: FastAPI
- Database: SQLite
- File storage: local filesystem
- Task queue: placeholder for later phases

PostgreSQL and object storage are reserved for a later migration. The current
version does not require Docker, MinIO, or a running database service.

## Local development

1. Copy the root environment template to `backend/.env`:

```powershell
Copy-Item ..\.env.example .env
```

2. Install dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Initialize the SQLite database:

```bash
python -m app.db.init_db
```

4. Run backend:

```bash
uvicorn app.main:app --reload
```

## Verify

From the `backend` directory:

```bash
set PYTHONPATH=.
python -m pytest
```

PowerShell:

```powershell
$env:PYTHONPATH = "."
python -m pytest
```

Initialize or recreate the SQLite tables:

```bash
python -m app.db.init_db
```

Runtime files are created under `backend/data/`:

- `knowledge_base.db`: SQLite database
- `storage/`: uploaded files and generated Markdown files

The existing Docker Compose file is reserved for the later PostgreSQL and
object storage migration. It is not required for the current phase.

Service start, restart, stop, and status commands are provided by the separate
PowerShell control files under `scripts/`.

## Current scope

- Administrator-created users, login, and JWT authentication
- Public knowledge bases
- Nested folders with breadcrumb navigation
- Folder-scoped document listing and upload
- Owner-only folder rename and empty-folder deletion API
- Single-file and batch upload
- Upload support for PDF, text/Markdown/HTML, images, PowerPoint, Word, and Excel files
- Document metadata and tags
- Original file preview and download
- In-app reader for text, Markdown, PDF, DOCX, XLSX, PPTX, and images
- Browser-local preview for PDF, DOCX, XLS/XLSX, and Markdown using Vue-based
  preview components, with PPTX rendered by the bundled `pptx-renderer`
- Best-effort text extraction for legacy DOC, XLS, and PPT files
- Owner-only document editing
- Owner-only soft delete and restore
- Recycle bin listing
- SQLite database initialization
- Local filesystem storage with path traversal protection
- Administrator-only user management and audit log pages
- Per-user MCP Token expiration policies, including persistent long-lived Tokens
- In-app upload progress, safe HTML preview, document owner/uploader metadata, and
  administrator MCP invocation logs
- Cross-scope copy for documents and folders, including recursive folder copies and
  physical local-storage duplication

Operational configuration is controlled through `.env.example`,
`backend/app/core/config.py`, and the scripts under `scripts/`. The repository
also includes a read-only REST API, OpenAPI endpoints, MCP integration, and the
knowledge-base Skill under `skills/knowledge-base/`.

## API examples

Log in and receive a token:

```powershell
$body = @{
  username = "demo"
  password = "password-123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:8000/api/v1/auth/login `
  -ContentType "application/json" `
  -Body $body
```

Upload a document:

```powershell
$token = ""
$knowledgeBaseId = 1

curl.exe `
  -X POST `
  "http://127.0.0.1:8000/api/v1/documents/upload" `
  -H "Authorization: Bearer $token" `
  -F "knowledge_base_id=$knowledgeBaseId" `
  -F "tags=制度,测试" `
  -F "file=@D:\path\to\guide.txt"
```

The generated API documentation is available at `/docs`.

## Browser-local document preview

The frontend uses `vue3-office-preview` for DOCX, PPTX, XLS, and XLSX,
`@vue3-office/vue-pdf` for PDF, and `@deot/docs-markdown` for Markdown.
Files are fetched through the authenticated API into browser memory and
rendered locally. No LibreOffice, ONLYOFFICE, Docker, or Python SDK is
required for this preview path.

The original file remains in local storage. Markdown extraction and the
legacy `.doc`, `.xls`, and `.ppt` fallback remain handled by the backend.

## Folder API

Create a folder under a knowledge base:

```powershell
$body = @{
  knowledge_base_id = 1
  name = "实验方案"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:8000/api/v1/folders `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
```

Upload into a folder by adding `folder_id` to the multipart form. The web page
does this automatically for the currently selected folder.

The knowledge base selector defaults to `全部`. In this mode the page shows
folders and root documents across all public knowledge bases. New folders are
assigned to the knowledge base selected in the dialog; uploads from `全部`
use the first available knowledge base unless a folder is selected.

## MCP read-only service

The project includes a separate MCP service for agents. It shares the same
SQLite database, local filesystem storage, JWT secret, and document reader as
the FastAPI application. It supports local stdio and remote Streamable HTTP
transports. Phase 1 exposes read-only tools:

- `list_knowledge_bases`
- `list_documents`
- `search_knowledge`
- `get_document`
- `get_document_metadata`

The MCP process does not expose upload, move, delete, or folder-management
operations. It uses the JWT identity from `KB_MCP_TOKEN`, so an agent cannot
see documents that the corresponding user cannot read.

For local stdio clients, `KB_MCP_TOKEN` can be omitted. The agent must then
call the `authenticate` tool once with the user's username and password; the
short-lived session remains only in the MCP process memory.

Create the MCP environment once from PowerShell:

```powershell
cd backend
python -m venv .mcp-venv
.\.mcp-venv\Scripts\python.exe -m pip install -r requirements-mcp.txt
```

Set the same database and storage settings as the API, then put a login
`access_token` in `KB_MCP_TOKEN`:

```powershell
$env:PYTHONPATH = "."
$env:KB_MCP_TOKEN = ""
.\.mcp-venv\Scripts\python.exe -m app.mcp_server
```

The process speaks MCP over stdin/stdout. Do not add ordinary `print()` output
to the service; diagnostics must go to stderr so the protocol remains valid.

For remote Streamable HTTP mode:

```powershell
$env:PYTHONPATH = "."
$env:MCP_TRANSPORT = "streamable-http"
$env:MCP_HOST = "0.0.0.0"
$env:MCP_PORT = "8020"
$env:MCP_PATH = "/mcp"
$env:MCP_STATELESS_HTTP = "true"
.\.mcp-venv\Scripts\python.exe -m app.mcp_server
```

The remote endpoint is `https://your-domain/mcp` after HTTPS reverse proxy
configuration. Remote clients must send
`Authorization: Bearer `. Configure the remote client with the
same endpoint and protected Bearer credential used by the API connection.

The browser page `/mcp-token.html` reads the current logged-in account and
requests an MCP Token without reading or storing the account password. The
administrator page `/admin.html` is protected by the administrator role and
allows user status, role, password, and MCP Token expiration policy changes.

Run the local protocol smoke test:

```powershell
$env:PYTHONPATH = "."
.\.mcp-venv\Scripts\python.exe scripts\mcp_stdio_smoke.py
```
