"""
SearchLab AI - Default Seed Documents Collection
Contains 16 curated academic computer science documents covering:
Artificial Intelligence, Machine Learning, Deep Learning, NLP,
Information Retrieval, Search Engines, Web Crawling, Web Indexing,
PageRank, Data Science, Computer Vision, Neural Networks,
Database Systems, Cybersecurity, Cloud Computing, and Information Retrieval Models.
"""

SAMPLE_DOCUMENTS = [
    {
        "title": "Artificial Intelligence Foundations & Knowledge Systems",
        "category": "Artificial Intelligence",
        "filename": "ai_foundations.txt",
        "file_type": "txt",
        "content": (
            "Artificial Intelligence represents the computational synthesis of human cognitive processes. "
            "Foundational AI encompasses problem solving, heuristic search algorithms such as A* and minimax, "
            "knowledge representation using first-order logic, and automated inference engines. Expert systems "
            "rely on ontologies and rule-based deduction to solve domain-specific problems. Modern artificial intelligence "
            "has evolved from symbolic reasoning to statistical learning and intelligent autonomous agents capable of "
            "perceiving environments through sensors and executing goal-oriented actions. The ethical considerations of AI "
            "include transparency, algorithmic bias, safety verification, and alignment with human welfare."
        )
    },
    {
        "title": "Machine Learning Paradigms & Supervised Classification",
        "category": "Machine Learning",
        "filename": "machine_learning.txt",
        "file_type": "txt",
        "content": (
            "Machine learning enables algorithms to learn patterns and decision boundaries directly from empirical data. "
            "Supervised learning trains mathematical models on labeled training sets to predict continuous targets through regression "
            "or categorical outcomes via classification. Core supervised algorithms include Support Vector Machines, Decision Trees, "
            "Random Forests, and Gradient Boosted Decision Trees. Unsupervised learning discovers hidden topological clusters "
            "and latent representations using k-means, hierarchical clustering, and Principal Component Analysis. Reinforcement learning "
            "optimizes cumulative rewards through agent interactions governed by Markov Decision Processes and Bellman optimality equations."
        )
    },
    {
        "title": "Deep Neural Networks and Backpropagation Optimization",
        "category": "Deep Learning",
        "filename": "deep_learning.txt",
        "file_type": "txt",
        "content": (
            "Deep learning utilizes multi-layered artificial neural network architectures capable of hierarchical feature extraction. "
            "Deep feedforward networks propagate tensor inputs across linear combinations modulated by non-linear activation functions "
            "such as Rectified Linear Units (ReLU), Sigmoid, and GELU. Optimization relies on the backpropagation algorithm, which applies "
            "the chain rule of calculus to compute loss function gradients with respect to network weights. Stochastic Gradient Descent, "
            "Adam, and RMSprop adjust parameter vectors to minimize empirical risk while batch normalization, dropout, and weight decay "
            "mitigate overfitting on complex high-dimensional datasets."
        )
    },
    {
        "title": "Natural Language Processing and Computational Linguistics",
        "category": "Natural Language Processing",
        "filename": "nlp_linguistics.txt",
        "file_type": "txt",
        "content": (
            "Natural Language Processing bridges computational science and human languages. The classic NLP pipeline begins with "
            "tokenization, lowercase normalization, punctuation stripping, stopword filtering, and morphological stemming or lemmatization. "
            "Syntactic parsing derives dependency trees and part-of-speech tags. Semantic analysis models lexical meanings using distributional "
            "semantics, continuous word embeddings such as Word2Vec and GloVe, and bidirectional self-attention mechanisms. Modern NLP "
            "relies on large language models and transformer architectures to accomplish sentiment classification, named entity recognition, "
            "machine translation, summarization, and conversational question answering."
        )
    },
    {
        "title": "Information Retrieval Systems & Vector Space Models",
        "category": "Information Retrieval",
        "filename": "information_retrieval.txt",
        "file_type": "txt",
        "content": (
            "Information Retrieval focuses on locating unstructured material, typically natural language text documents, that satisfies "
            "an explicit user information need from within massive document collections. The Vector Space Model formalizes documents and "
            "user search queries as high-dimensional vectors in a shared vocabulary space. Term Frequency-Inverse Document Frequency (TF-IDF) "
            "assigns continuous weights reflecting term importance within individual documents relative to collection rarity. Retrieval "
            "systems measure semantic proximity via Cosine Similarity between query vectors and document vectors, ranking search results "
            "in descending order of relevance score."
        )
    },
    {
        "title": "Modern Search Engine Architecture & Inverted Indices",
        "category": "Search Engines",
        "filename": "search_engine_arch.txt",
        "file_type": "txt",
        "content": (
            "A modern search engine architecture orchestrates web crawlers, document parsers, distributed indexing clusters, "
            "and low-latency query processing pipelines. The central component of search efficiency is the inverted index data structure, "
            "which maps vocabulary terms to posting lists containing document identifiers, term frequencies, and word position offsets. "
            "When a user issues a query, the search processor tokenizes the text, intersects or unions posting lists from the inverted index, "
            "and evaluates candidate matches using ranking functions like BM25 and cosine similarity before serving formatted search snippets."
        )
    },
    {
        "title": "Web Crawling Strategies and Politeness Policies",
        "category": "Web Crawling",
        "filename": "web_crawling.txt",
        "file_type": "txt",
        "content": (
            "Web crawlers are automated agents that traverse the World Wide Web by iteratively fetching hypertext documents and discovering "
            "hyperlinks. Crawler architectures maintain a frontier queue prioritizing unvisited URLs based on domain importance, freshness, "
            "and topic relevance. Ethical crawling strictly adheres to politeness policies, including parsing robots.txt specifications, "
            "throttling request frequencies per second, and avoiding denial-of-service degradation on host web servers. Distributed web crawlers "
            "employ domain hash partitioning, DNS caching, and duplicate content detection algorithms like MinHash and SimHash to process petabytes of web pages."
        )
    },
    {
        "title": "Web Document Indexing & Storage Techniques",
        "category": "Web Indexing",
        "filename": "web_indexing.txt",
        "file_type": "txt",
        "content": (
            "Web document indexing transforms raw crawled HTML content into optimized, searchable representations. The document parsing stage "
            "strips HTML boilerplate, script tags, and metadata to isolate core linguistic text. Tokenization normalizes characters and generates "
            "lexical tokens. The indexing subsystem constructs forward indices and inverted posting lists, employing compression algorithms such as "
            "Variable Byte encoding, Elias-gamma, and SIMD-based bit-packing to minimize storage footprint in memory and fast solid-state drives. "
            "Positional indices enable exact phrase matching, proximity queries, and wildcard search across billions of indexed documents."
        )
    },
    {
        "title": "PageRank Algorithm and Link Graph Analysis",
        "category": "PageRank",
        "filename": "pagerank_algorithm.txt",
        "file_type": "txt",
        "content": (
            "The PageRank algorithm measures the structural authority and subjective importance of web pages by analyzing the hyperlinked "
            "graph topology of the World Wide Web. PageRank models an idealized random web surfer who either traverses outgoing hyperlinks with "
            "probability d (damping factor, typically 0.85) or teleports to a random page with probability (1 - d). Mathematically, PageRank corresponds "
            "to the principal eigenvector of the stochastic transition matrix representing the web graph. Web pages with numerous incoming links "
            "from authoritative origins receive superior PageRank scores, complementing lexical relevance during search query ranking."
        )
    },
    {
        "title": "Data Science Pipelines and Exploratory Analysis",
        "category": "Data Science",
        "filename": "data_science_pipelines.txt",
        "file_type": "txt",
        "content": (
            "Data Science integrates computer science, mathematical statistics, and domain expertise to extract actionable insights from structured "
            "and unstructured data. Comprehensive pipelines incorporate data ingestion, automated cleaning, imputation of missing values, outlier "
            "detection, and exploratory data analysis (EDA). Feature engineering transforms raw attributes through scaling, one-hot encoding, and "
            "dimensionality reduction. Statistical hypothesis testing, correlation analysis, and predictive modeling validate experimental assumptions, "
            "while interactive data visualizations communicate quantitative findings to researchers and decision-makers."
        )
    },
    {
        "title": "Computer Vision and Convolutional Neural Networks",
        "category": "Computer Vision",
        "filename": "computer_vision.txt",
        "file_type": "txt",
        "content": (
            "Computer vision equips computational algorithms with the capacity to understand and interpret visual inputs from digital images "
            "and video streams. Convolutional Neural Networks (CNNs) serve as the backbone of modern vision systems, applying spatial convolution "
            "kernels to detect local patterns such as edges, gradients, textures, and object parts. Architectures like ResNet introduce residual "
            "skip connections to resolve vanishing gradients in very deep networks. Core computer vision tasks include object classification, "
            "bounding-box object detection (YOLO, Faster R-CNN), semantic segmentation, and Vision Transformers (ViT) that treat image patches as tokens."
        )
    },
    {
        "title": "Recurrent Neural Networks and Transformer Architectures",
        "category": "Neural Networks",
        "filename": "neural_networks.txt",
        "file_type": "txt",
        "content": (
            "Sequential data modeling in artificial intelligence has transitioned from recurrent topologies to attention-driven networks. "
            "Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM) cells process sequential tokens sequentially, preserving hidden state "
            "memories but suffering from gradient vanishing over lengthy contexts. The Transformer architecture revolutionized deep learning by "
            "replacing recurrence with Multi-Head Self-Attention mechanisms, enabling massive parallel computation over entire sequences simultaneously. "
            "Positional encodings inject token order, allowing transformers to capture subtle long-range semantic dependencies in text and time-series."
        )
    },
    {
        "title": "Database Management Systems and B-Tree Indexing",
        "category": "Database Systems",
        "filename": "database_systems.txt",
        "file_type": "txt",
        "content": (
            "Relational Database Management Systems (RDBMS) ensure structured data persistence, consistency, and efficient query execution. "
            "Databases adhere to ACID guarantees: Atomicity, Consistency, Isolation, and Durability, managed through Write-Ahead Logging (WAL) and "
            "concurrency control protocols like Two-Phase Locking and Multi-Version Concurrency Control (MVCC). Query optimization translates declarative "
            "SQL queries into relational algebra execution plans. Indexing structures like balanced B-Trees and B+ Trees provide logarithmic time lookup "
            "and sequential range scans on primary keys and indexed foreign columns."
        )
    },
    {
        "title": "Cybersecurity Vulnerability Detection and Threat Intelligence",
        "category": "Cybersecurity",
        "filename": "cybersecurity.txt",
        "file_type": "txt",
        "content": (
            "Cybersecurity safeguards digital infrastructure, software applications, and network protocols against malicious intrusion and unauthorized "
            "data exploitation. Vulnerability assessment identifies structural security flaws like SQL injection, cross-site scripting (XSS), buffer overflows, "
            "and broken cryptographic handshakes. Defensive paradigms implement defense-in-depth, zero-trust architectures, multi-factor authentication, "
            "and encrypted transport channels using TLS. Intrusion Detection Systems (IDS) leverage machine learning classifiers and heuristic anomaly "
            "detection to recognize advanced persistent threats and zero-day attack vectors in real-time network packet streams."
        )
    },
    {
        "title": "Cloud Computing Infrastructure and Distributed Systems",
        "category": "Cloud Computing",
        "filename": "cloud_computing.txt",
        "file_type": "txt",
        "content": (
            "Cloud computing provides on-demand access to configurable shared computing resources including virtual servers, elastic storage, and "
            "managed serverless execution environments. Distributed computing models satisfy the CAP theorem, balancing consistency, availability, "
            "and partition tolerance. Modern cloud architectures adopt containerization with Docker and orchestration via Kubernetes to deploy microservices "
            "elastically across multi-region data centers. Infrastructure-as-Code (IaC), automated horizontal pod autoscaling, distributed load balancers, "
            "and event-driven streaming pipelines ensure high fault tolerance and resilient service-level objectives."
        )
    },
    {
        "title": "Boolean and Probabilistic Retrieval Models in Search",
        "category": "Information Retrieval Models",
        "filename": "retrieval_models.txt",
        "file_type": "txt",
        "content": (
            "Information Retrieval theory establishes mathematical frameworks for matching query representations against document text. The Boolean "
            "model evaluates queries using exact logical operators (AND, OR, NOT), returning binary membership without relevance ranking. Probabilistic "
            "models, such as the Binary Independence Model and Okapi BM25, calculate the probability that a document is relevant given a specific query. "
            "BM25 incorporates term frequency saturation and document length normalization to prevent lengthy documents from unfairly dominating "
            "search results. Combining vector space cosine similarity with probabilistic BM25 yields hybrid ranking algorithms widely adopted in modern retrieval engines."
        )
    }
]
