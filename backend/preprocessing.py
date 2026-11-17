"""
SearchLab AI - NLP Text Preprocessing Pipeline
Implements the 6-stage NLP preprocessing pipeline using NLTK and morphological normalization.
"""

import string
import re
import io
import os
from typing import List, Dict, Any, Tuple
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Configure NLTK data directory for serverless environments (writable /tmp)
nltk_download_dir = None
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    nltk_download_dir = "/tmp/nltk_data"
    os.makedirs(nltk_download_dir, exist_ok=True)
    if nltk_download_dir not in nltk.data.path:
        nltk.data.path.insert(0, nltk_download_dir)

# Ensure NLTK data resources are loaded
try:
    STOPWORDS = set(stopwords.words('english'))
except LookupError:
    if nltk_download_dir:
        nltk.download('stopwords', download_dir=nltk_download_dir, quiet=True)
    else:
        nltk.download('stopwords', quiet=True)
    STOPWORDS = set(stopwords.words('english'))

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    if nltk_download_dir:
        nltk.download('punkt', download_dir=nltk_download_dir, quiet=True)
        nltk.download('punkt_tab', download_dir=nltk_download_dir, quiet=True)
    else:
        nltk.download('punkt', quiet=True)
        nltk.download('punkt_tab', quiet=True)

stemmer = PorterStemmer()

STAGE_EXPLANATIONS = {
    1: {
        "title": "Original Text Input",
        "description": "Raw, unmodified text entered by the user or extracted from a document. Contains varied casing, punctuation, grammatical markers, and numbers.",
        "why": "Serves as the raw ground truth for linguistic processing.",
        "impact": "Unprocessed text results in high vocabulary fragmentation and vocabulary sparsity."
    },
    2: {
        "title": "Lowercase Normalization",
        "description": "Converts all alphabetic characters to lowercase format using Unicode standard case-folding.",
        "why": "Ensures case insensitivity so 'Search', 'search', and 'SEARCH' are treated as identical semantic entities.",
        "impact": "Reduces vocabulary dimensionality and prevents artificial vocabulary splitting."
    },
    3: {
        "title": "Tokenization",
        "description": "Splits the continuous character sequence into discrete syntactic units called tokens (words, punctuation, symbols).",
        "why": "Computers process language as discrete discrete lexical units rather than continuous strings.",
        "impact": "NLTK Treebank word tokenizer isolates contractions and punctuation boundaries cleanly."
    },
    4: {
        "title": "Punctuation & Special Character Removal",
        "description": "Filters out punctuation symbols (e.g., periods, commas, exclamation marks, colons, hyphens) and non-alphanumeric tokens.",
        "why": "Punctuation marks rarely convey independent topical relevance in keyword-based information retrieval.",
        "impact": "Eliminates syntactic noise from index terms and reduces inverted index posting sizes."
    },
    5: {
        "title": "Stopword Removal",
        "description": "Removes high-frequency function words (e.g., 'the', 'is', 'at', 'which', 'on', 'and') that carry minimal discriminative topical information.",
        "why": "Stopwords appear uniformly across nearly all documents and possess near-zero IDF (Inverse Document Frequency) values.",
        "impact": "Saves up to 40% index storage space and accelerates query evaluation significantly."
    },
    6: {
        "title": "Morphological Stemming (Porter)",
        "description": "Reduces inflected and derived words to their linguistic root base or stem (e.g., 'retrieval' -> 'retriev', 'searches' -> 'search', 'learning' -> 'learn') using Porter's affix removal algorithm.",
        "why": "Unifies grammatical variations (plural nouns, verb tenses, gerunds) into a singular canonical index key.",
        "impact": "Maximizes search recall by matching user queries with morphologically varied forms of identical base concepts."
    }
}

def run_pipeline(text: str) -> Dict[str, Any]:
    """
    Executes the full 6-stage NLP pipeline and captures detailed state at each stage.
    """
    if not text:
        text = ""

    # Stage 1: Original Text
    stage1_text = text
    stage1_char_count = len(text)
    stage1_word_count = len(text.split()) if text.strip() else 0

    # Stage 2: Lowercase Conversion
    stage2_text = text.lower()

    # Stage 3: Tokenization
    try:
        stage3_tokens = word_tokenize(stage2_text)
    except Exception:
        # Fallback regex tokenizer
        stage3_tokens = re.findall(r'\b\w+\b|[^\w\s]', stage2_text)
    stage3_token_count = len(stage3_tokens)

    # Stage 4: Punctuation Removal
    stage4_tokens = []
    removed_punctuation = []
    for token in stage3_tokens:
        # Check if purely punctuation or contains alphanumeric
        cleaned = re.sub(r'[^\w\s]', '', token)
        if cleaned:
            stage4_tokens.append(cleaned)
        else:
            removed_punctuation.append(token)
    stage4_token_count = len(stage4_tokens)

    # Stage 5: Stopword Removal
    stage5_tokens = []
    removed_stopwords = []
    for token in stage4_tokens:
        if token in STOPWORDS:
            removed_stopwords.append(token)
        else:
            stage5_tokens.append(token)
    stage5_token_count = len(stage5_tokens)

    # Stage 6: Stemming
    stage6_tokens = []
    stem_transformations = []
    for token in stage5_tokens:
        stemmed = stemmer.stem(token)
        stage6_tokens.append(stemmed)
        if stemmed != token:
            stem_transformations.append({"original": token, "stemmed": stemmed})

    stage6_token_count = len(stage6_tokens)
    unique_stems_count = len(set(stage6_tokens))

    stages = [
        {
            "stage_number": 1,
            "name": STAGE_EXPLANATIONS[1]["title"],
            "explanation": STAGE_EXPLANATIONS[1]["description"],
            "why": STAGE_EXPLANATIONS[1]["why"],
            "impact": STAGE_EXPLANATIONS[1]["impact"],
            "data_type": "string",
            "output": stage1_text,
            "metrics": {
                "character_count": stage1_char_count,
                "whitespace_words": stage1_word_count
            }
        },
        {
            "stage_number": 2,
            "name": STAGE_EXPLANATIONS[2]["title"],
            "explanation": STAGE_EXPLANATIONS[2]["description"],
            "why": STAGE_EXPLANATIONS[2]["why"],
            "impact": STAGE_EXPLANATIONS[2]["impact"],
            "data_type": "string",
            "output": stage2_text,
            "metrics": {
                "character_count": len(stage2_text),
                "cased_changes": sum(1 for c in stage1_text if c.isupper())
            }
        },
        {
            "stage_number": 3,
            "name": STAGE_EXPLANATIONS[3]["title"],
            "explanation": STAGE_EXPLANATIONS[3]["description"],
            "why": STAGE_EXPLANATIONS[3]["why"],
            "impact": STAGE_EXPLANATIONS[3]["impact"],
            "data_type": "list",
            "output": stage3_tokens,
            "metrics": {
                "total_tokens": stage3_token_count,
                "unique_tokens": len(set(stage3_tokens))
            }
        },
        {
            "stage_number": 4,
            "name": STAGE_EXPLANATIONS[4]["title"],
            "explanation": STAGE_EXPLANATIONS[4]["description"],
            "why": STAGE_EXPLANATIONS[4]["why"],
            "impact": STAGE_EXPLANATIONS[4]["impact"],
            "data_type": "list",
            "output": stage4_tokens,
            "removed_items": removed_punctuation[:30],
            "metrics": {
                "tokens_retained": stage4_token_count,
                "punctuation_removed_count": len(removed_punctuation)
            }
        },
        {
            "stage_number": 5,
            "name": STAGE_EXPLANATIONS[5]["title"],
            "explanation": STAGE_EXPLANATIONS[5]["description"],
            "why": STAGE_EXPLANATIONS[5]["why"],
            "impact": STAGE_EXPLANATIONS[5]["impact"],
            "data_type": "list",
            "output": stage5_tokens,
            "removed_items": list(set(removed_stopwords))[:30],
            "metrics": {
                "tokens_retained": stage5_token_count,
                "stopwords_removed_count": len(removed_stopwords),
                "vocabulary_reduction_pct": round(
                    ((stage4_token_count - stage5_token_count) / max(1, stage4_token_count)) * 100, 1
                )
            }
        },
        {
            "stage_number": 6,
            "name": STAGE_EXPLANATIONS[6]["title"],
            "explanation": STAGE_EXPLANATIONS[6]["description"],
            "why": STAGE_EXPLANATIONS[6]["why"],
            "impact": STAGE_EXPLANATIONS[6]["impact"],
            "data_type": "list",
            "output": stage6_tokens,
            "transformations": stem_transformations[:30],
            "metrics": {
                "final_tokens": stage6_token_count,
                "unique_stems": unique_stems_count,
                "stems_modified_count": len(stem_transformations)
            }
        }
    ]

    return {
        "original_text": text,
        "final_tokens": stage6_tokens,
        "stages": stages,
        "summary": {
            "initial_words": stage1_word_count,
            "final_tokens": stage6_token_count,
            "unique_stems": unique_stems_count,
            "noise_reduction_pct": round(
                ((stage3_token_count - stage6_token_count) / max(1, stage3_token_count)) * 100, 1
            )
        }
    }

def clean_and_tokenize(text: str) -> List[str]:
    """
    Fast utility method returning final clean, stemmed tokens for indexing & searching.
    """
    if not text:
        return []
    text_lower = text.lower()
    try:
        tokens = word_tokenize(text_lower)
    except Exception:
        tokens = re.findall(r'\b\w+\b', text_lower)
    
    clean_tokens = []
    for t in tokens:
        cleaned = re.sub(r'[^\w\s]', '', t)
        if cleaned and cleaned not in STOPWORDS and not cleaned.isdigit() and len(cleaned) > 1:
            clean_tokens.append(stemmer.stem(cleaned))
    return clean_tokens

def extract_text_from_file(file_bytes: bytes, filename: str) -> Tuple[str, str]:
    """
    Extracts plain text from PDF, DOCX, or TXT file bytes.
    Returns: (extracted_text, file_type)
    """
    ext = filename.lower().split('.')[-1]
    
    if ext == 'txt':
        try:
            return file_bytes.decode('utf-8'), 'txt'
        except UnicodeDecodeError:
            return file_bytes.decode('latin-1', errors='replace'), 'txt'
            
    elif ext == 'pdf':
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(extracted)
            return "\n".join(text_parts), 'pdf'
        except Exception as e:
            return f"Error extracting PDF: {str(e)}", 'pdf'
            
    elif ext in ['docx', 'doc']:
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            text_parts = [para.text for para in doc.paragraphs if para.text]
            return "\n".join(text_parts), 'docx'
        except Exception as e:
            return f"Error extracting DOCX: {str(e)}", 'docx'
            
    else:
        # Default try utf-8
        try:
            return file_bytes.decode('utf-8'), ext
        except Exception:
            return file_bytes.decode('latin-1', errors='replace'), ext
