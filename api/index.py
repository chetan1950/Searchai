import os
import sys

# Ensure backend directory is discoverable
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Ensure NLTK data directory is in /tmp for serverless functions
import nltk
nltk_data_dir = "/tmp/nltk_data"
os.makedirs(nltk_data_dir, exist_ok=True)
if nltk_data_dir not in nltk.data.path:
    nltk.data.path.insert(0, nltk_data_dir)

# Pre-download required NLTK resources into /tmp if not present
for res in ["punkt", "punkt_tab", "stopwords"]:
    try:
        nltk.data.find(f"tokenizers/{res}" if "punkt" in res else f"corpora/{res}")
    except LookupError:
        try:
            nltk.download(res, download_dir=nltk_data_dir, quiet=True)
        except Exception:
            pass

# Expose the FastAPI application for Vercel
from backend.main import app
