"""
SearchLab AI - Unified Full-Stack Runner
Launches the FastAPI backend (and serves the SPA frontend or triggers both).
"""

import os
import sys
import time
import webbrowser

# Ensure Python knows where our environment and packages are
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

if "C:\\Users\\cheta\\AppData\\Local\\Programs\\Python\\Python315" not in os.environ.get("PATH", ""):
    os.environ["PATH"] = "C:\\Users\\cheta\\AppData\\Local\\Programs\\Python\\Python315;C:\\Users\\cheta\\AppData\\Local\\Programs\\Python\\Python315\\Scripts;C:\\Program Files\\nodejs;" + os.environ.get("PATH", "")

def main():
    print("=" * 65)
    print("  SearchLab AI - Information Retrieval & Search Engine Using NLP")
    print("  B.Tech Computer Science Engineering Practical Demonstration")
    print("=" * 65)
    
    sys.path.insert(0, BACKEND_DIR)
    
    try:
        import uvicorn
        from main import app
        
        print("\n[1/2] Starting FastAPI Backend & SPA on http://127.0.0.1:8000...")
        print("[2/2] Opening SearchLab AI in default web browser...")
        time.sleep(1)
        webbrowser.open("http://127.0.0.1:8000")
        
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False, app_dir=BACKEND_DIR)
    except KeyboardInterrupt:
        print("\n[SearchLab AI] Server stopped gracefully.")
    except Exception as e:
        print(f"\n[SearchLab AI] Error launching server: {e}")
        print("Tip: Run 'call run_backend.bat' inside the searchlab-ai folder.")

if __name__ == "__main__":
    main()
