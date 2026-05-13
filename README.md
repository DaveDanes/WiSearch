# WiSearch 🔍

An **Intelligent Semantic Search Engine** designed to solve the vocabulary mismatch problem in academic research. 

Traditional keyword search treats queries as a bag of words, failing when your phrasing doesn't precisely match the document's. WiSearch understands context, synonyms, and the actual intent behind your query using dense numerical embeddings via **Sentence Transformers (`all-MiniLM-L6-v2`)** and **FAISS**.

## Features
- **Semantic Understanding**: Search by meaning, not just exact keywords.
- **Micro-Backend Architecture**: Python/FastAPI backend powering FAISS vector similarity search, with seamless frontend fallback algorithms.
- **Curated Dataset**: Focused on foundational papers in AI, Machine Learning, and Cloud Computing.
- **Modern & Elegant Interface**: Clean, minimal UI with smooth animations.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Python, FastAPI, Uvicorn
- **AI / ML Pipeline:** Sentence Transformers, FAISS, Pandas, NumPy

## Getting Started

The project is divided into two parts: the React Frontend and the Python FAISS Backend.
If the backend is not running, the frontend will automatically use a TS-based simulated hybrid algorithm.

### 1. Running the Python Backend (Required for real FAISS vectors)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# 1. Build the FAISS Vector Index (Takes ~2 mins, downloads the transformer model)
python index_builder.py

# 2. Start the FastAPI Microservice
python main.py
```
*The backend will run on `http://localhost:8000`*

### 2. Running the React Frontend

Open a new terminal window at the project root:

```bash
# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend will run on `http://localhost:3000` (or similar)*

## About the Project
This project was built as a **B.Tech Capstone Project** by Computer Science & Engineering students:
Abhishek Gusain, Dhruv, Hemant Garg, Ayush Chauhan, Chaitanya Dhawan, and Yogeeta.

*Submitted under the supervision of Dr. Meena Chaudhary.*
