# TAaDs – Course Finder with RAG

A text-analysis project from my M.Sc. Applied
Computer Science (Hochschule Schmalkalden).

Students can ask questions in plain language about the courses in the
Applied Computer Science programme (content, credits, workload, semester).
A Retrieval-Augmented Generation (RAG) backend finds the matching course
descriptions and uses a local language model to answer.

## How it works
1. Course descriptions are stored in SQLite and split into chunks.
2. The chunks are embedded with Ollama embeddings and stored in a Chroma
   vector database.
3. For each question, the most relevant chunks are retrieved and passed
   to a local LLM (Ollama) to generate the answer.
4. A Flask API serves the answers to the Angular frontend.

## Tech stack
- **Frontend:** Angular 17 (with SSR), TypeScript, RxJS, Bootstrap 5 /
  ng-bootstrap, Tailwind CSS
- **Backend:** Python, Flask, LangChain, Ollama (LLM + embeddings),
  Chroma, SQLite
- Runs fully locally – no paid AI API needed

## Run locally
**Backend:** install Python and Ollama, open `backend_api/rag.ipynb`
and run all cells – this starts the Flask server.

**Frontend:**
cd Frontend
npm install
ng serve -o
