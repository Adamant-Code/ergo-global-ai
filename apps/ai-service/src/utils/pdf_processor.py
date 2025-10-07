import asyncio
import logging
import time
from pathlib import Path
from typing import List, Optional

from pydantic import BaseModel

from src.utils.token_counter import count_tokens
from src.utils.vector_db import VectorDBInterface

# Stub definitions for types used in processing.
class PDFPage(BaseModel):
    page_number: int
    text: str

class ParsedContent(BaseModel):
    page_number: int
    content: str

class TextChunk(BaseModel):
    chunk_id: str
    content: str
    metadata: dict

class ProcessingResult(BaseModel):
    document_id: str
    total_chunks: int
    total_tokens: int
    processing_time: float
    vector_ids: List[str]

class PDFProcessor:
    def __init__(self, vector_db: Optional[VectorDBInterface] = None, vector_size: int = 3):
        """
        Initialize PDFProcessor with an optional vector database instance.
        :param vector_db: An instance implementing VectorDBInterface for storing vector embeddings.
        :param vector_size: Dimension of vector embeddings.
        """
        self.vector_db = vector_db
        self.vector_size = vector_size

    async def process_pdf(
        self,
        file_path: str,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        embedding_model: str = "text-embedding-3-large",
        collection_name: str = "default_collection"
    ) -> ProcessingResult:
        start_time = time.time()
        # Step 1: PDF Splitting
        pages = await self.split_pdf(file_path)
        # Step 2: Content Parsing using LlamaParse
        parsed_contents = await self.parse_content(pages)
        # Step 3: Chunking the parsed content
        chunks = []
        for content in parsed_contents:
            page_chunks = await self.chunk_content(content, chunk_size, chunk_overlap)
            chunks.extend(page_chunks)
        # Step 4: Generate vector embeddings and store them in the vector DB if provided.
        vector_ids = await self.store_vector_embeddings(chunks, embedding_model, collection_name)
        # Count tokens using the provided token counter.
        total_tokens = sum(count_tokens(chunk.content, model=embedding_model) for chunk in chunks)
        processing_time = time.time() - start_time
        document_id = Path(file_path).stem

        return ProcessingResult(
            document_id=document_id,
            total_chunks=len(chunks),
            total_tokens=total_tokens,
            processing_time=processing_time,
            vector_ids=vector_ids
        )

    async def split_pdf(self, file_path: str) -> List[PDFPage]:
        """
        Splits a PDF into pages while preserving page order and handling large or corrupt files.
        """
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(file_path)
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages.append(PDFPage(page_number=i + 1, text=text))
            return pages
        except Exception as e:
            logging.exception("Failed to split PDF file: %s", file_path)
            raise e

    async def parse_content(self, pages: List[PDFPage]) -> List[ParsedContent]:
        """
        Parses the content of each PDF page using LlamaParse.
        Extracts tables/lists and maintains formatting. Falls back to raw text on failure.
        """
        try:
            from llama_parse import LlamaParse
        except ImportError as e:
            logging.error("LlamaParse library not installed. Please install with 'pip install llama-parse'.")
            raise e

        parser = LlamaParse(
            api_key="YOUR_LLAMA_PARSE_API_KEY",  # Replace with your actual API key or set via env variable.
            result_type="markdown",
            verbose=True,
        )
        parsed = []
        for page in pages:
            try:
                # Assume the parser processes raw text; adjust if your usage differs.
                documents = parser.load_data(page.text)
                content = "\n".join(documents) if isinstance(documents, list) else documents
            except Exception as e:
                logging.exception("Error parsing content on page %d", page.page_number)
                content = page.text  # Fallback to raw page text.
            parsed.append(ParsedContent(page_number=page.page_number, content=content))
        return parsed

    async def chunk_content(
        self,
        content: ParsedContent,
        chunk_size: int,
        chunk_overlap: int
    ) -> List[TextChunk]:
        """
        Chunks parsed content into text chunks that respect sentence boundaries,
        maintain context, and preserve metadata.
        """
        try:
            import nltk
            nltk.download('punkt', quiet=True)
            sentences = nltk.tokenize.sent_tokenize(content.content)
        except Exception as e:
            logging.exception("NLTK tokenization failed, falling back to whitespace splitting.")
            sentences = content.content.split(". ")

        chunks = []
        current_chunk = ""
        chunk_count = 0

        for sentence in sentences:
            if len(current_chunk) + len(sentence) + 1 <= chunk_size:
                current_chunk = f"{current_chunk} {sentence}".strip() if current_chunk else sentence
            else:
                chunk_id = f"{content.page_number}_{chunk_count}"
                metadata = {"page_number": content.page_number, "chunk_order": chunk_count}
                chunks.append(TextChunk(chunk_id=chunk_id, content=current_chunk, metadata=metadata))
                chunk_count += 1

                if chunk_overlap > 0:
                    words = current_chunk.split()
                    overlap_words = words[-chunk_overlap:] if len(words) >= chunk_overlap else words
                    current_chunk = " ".join(overlap_words) + " " + sentence
                else:
                    current_chunk = sentence

        if current_chunk:
            chunk_id = f"{content.page_number}_{chunk_count}"
            metadata = {"page_number": content.page_number, "chunk_order": chunk_count}
            chunks.append(TextChunk(chunk_id=chunk_id, content=current_chunk, metadata=metadata))

        return chunks

    def generate_embedding(self, text: str) -> List[float]:
        """
        Dummy embedding generator that returns a fixed-size vector derived from the text.
        """
        if not text:
            return [0.0] * self.vector_size
        ascii_sum = sum(ord(c) for c in text)
        # Generate a dummy vector; each element is computed from the ascii_sum.
        return [float((ascii_sum / (i + 1)) % 1) for i in range(self.vector_size)]

    async def store_vector_embeddings(
        self,
        chunks: List[TextChunk],
        embedding_model: str,
        collection_name: str
    ) -> List[str]:
        """
        Generates vector embeddings for each chunk and stores them in the vector database if provided.
        Otherwise, simulates vector storage.
        """
        if self.vector_db:
            try:
                await self.vector_db.create_collection(collection_name, self.vector_size)
            except Exception as e:
                logging.warning("Collection creation may have already been done: %s", e)
            vectors = [self.generate_embedding(chunk.content) for chunk in chunks]
            metadata = [chunk.metadata for chunk in chunks]
            ids = [chunk.chunk_id for chunk in chunks]
            await self.vector_db.add_vectors(collection_name, vectors, metadata, ids)
            return ids
        else:
            vector_ids = []
            for chunk in chunks:
                vector_id = f"vec_{chunk.chunk_id}"
                vector_ids.append(vector_id)
                await asyncio.sleep(0.001)
            return vector_ids
