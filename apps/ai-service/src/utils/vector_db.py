from typing import List, Dict, Optional, Protocol
from dataclasses import dataclass

@dataclass
class SearchResult:
    id: str
    score: float
    metadata: Dict

class VectorDBInterface(Protocol):
    async def create_collection(
        self,
        name: str,
        vector_size: int,
        distance_metric: str = "cosine"
    ) -> None:
        ...

    async def add_vectors(
        self,
        collection: str,
        vectors: List[List[float]],
        metadata: List[Dict],
        ids: Optional[List[str]] = None
    ) -> None:
        ...

    async def search_vectors(
        self,
        collection: str,
        query_vector: List[float],
        limit: int = 10,
        metadata_filter: Optional[Dict] = None,
        score_threshold: Optional[float] = None
    ) -> List[SearchResult]:
        ...

    async def keyword_search(
        self,
        collection: str,
        query: str,
        limit: int = 10,
        metadata_filter: Optional[Dict] = None
    ) -> List[SearchResult]:
        ...

    async def delete_collection(self, name: str) -> None:
        ...

    async def delete_vectors(
        self,
        collection: str,
        metadata_filter: Dict
    ) -> None:
        ...

class VectorDBError(Exception):
    pass

class DummyVectorDB(VectorDBInterface):
    def __init__(self):
        # Each collection is stored as a dict with collection properties and lists of vectors, metadata, and ids.
        self.collections: Dict[str, Dict] = {}

    async def create_collection(
        self,
        name: str,
        vector_size: int,
        distance_metric: str = "cosine"
    ) -> None:
        if name in self.collections:
            raise VectorDBError(f"Collection '{name}' already exists.")
        self.collections[name] = {
            "vector_size": vector_size,
            "distance_metric": distance_metric,
            "vectors": [],
            "metadata": [],
            "ids": []
        }

    async def add_vectors(
        self,
        collection: str,
        vectors: List[List[float]],
        metadata: List[Dict],
        ids: Optional[List[str]] = None
    ) -> None:
        if collection not in self.collections:
            raise VectorDBError(f"Collection '{collection}' does not exist.")
        coll = self.collections[collection]
        if len(vectors) != len(metadata):
            raise VectorDBError("The number of vectors and metadata entries must match.")
        if ids and len(ids) != len(vectors):
            raise VectorDBError("The number of ids must match the number of vectors.")

        for i, vec in enumerate(vectors):
            if len(vec) != coll["vector_size"]:
                raise VectorDBError("One or more vectors do not match the collection's vector size.")
            coll["vectors"].append(vec)
            coll["metadata"].append(metadata[i])
            # If no id is provided, generate a simple id.
            coll["ids"].append(ids[i] if ids else f"{len(coll['ids'])+1}")

    async def search_vectors(
        self,
        collection: str,
        query_vector: List[float],
        limit: int = 10,
        metadata_filter: Optional[Dict] = None,
        score_threshold: Optional[float] = None
    ) -> List[SearchResult]:
        if collection not in self.collections:
            raise VectorDBError(f"Collection '{collection}' does not exist.")
        coll = self.collections[collection]
        if len(query_vector) != coll["vector_size"]:
            raise VectorDBError("Query vector size does not match collection's vector size.")

        # Simple Euclidean distance search.
        def euclidean(a: List[float], b: List[float]) -> float:
            return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

        results: List[SearchResult] = []
        for idx, vec in enumerate(coll["vectors"]):
            score = euclidean(query_vector, vec)
            if score_threshold is not None and score > score_threshold:
                continue

            # Validate metadata filter: all key-value pairs must be present.
            if metadata_filter:
                current_meta = coll["metadata"][idx]
                if not all(item in current_meta.items() for item in metadata_filter.items()):
                    continue

            results.append(SearchResult(
                id=coll["ids"][idx],
                score=score,
                metadata=coll["metadata"][idx]
            ))
        # Return sorted results by score (lower is better) and limit the output.
        results.sort(key=lambda r: r.score)
        return results[:limit]

    async def keyword_search(
        self,
        collection: str,
        query: str,
        limit: int = 10,
        metadata_filter: Optional[Dict] = None
    ) -> List[SearchResult]:
        if collection not in self.collections:
            raise VectorDBError(f"Collection '{collection}' does not exist.")
        coll = self.collections[collection]

        results: List[SearchResult] = []
        for idx, meta in enumerate(coll["metadata"]):
            # Apply metadata filter if provided.
            if metadata_filter:
                if not all(item in meta.items() for item in metadata_filter.items()):
                    continue
            # Search all string values in the metadata.
            if any(query.lower() in str(value).lower() for value in meta.values()):
                results.append(SearchResult(
                    id=coll["ids"][idx],
                    score=0.0,  # For keyword search, a score might be computed differently.
                    metadata=meta
                ))
        return results[:limit]

    async def delete_collection(self, name: str) -> None:
        if name not in self.collections:
            raise VectorDBError(f"Collection '{name}' does not exist.")
        del self.collections[name]

    async def delete_vectors(
        self,
        collection: str,
        metadata_filter: Dict
    ) -> None:
        if collection not in self.collections:
            raise VectorDBError(f"Collection '{collection}' does not exist.")
        coll = self.collections[collection]
        # Keep vectors that do not match the metadata filter.
        new_vectors, new_metadata, new_ids = [], [], []
        for vec, meta, vid in zip(coll["vectors"], coll["metadata"], coll["ids"]):
            if not all(item in meta.items() for item in metadata_filter.items()):
                new_vectors.append(vec)
                new_metadata.append(meta)
                new_ids.append(vid)
        coll["vectors"] = new_vectors
        coll["metadata"] = new_metadata
        coll["ids"] = new_ids

# Example usage in a transaction-like pattern.
class DummyTransaction:
    def __init__(self, db: DummyVectorDB):
        self.db = db
        self._backup = None

    async def __aenter__(self):
        # Make a deep copy of the db state as a backup.
        self._backup = {k: v.copy() for k, v in self.db.collections.items()}
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Rollback if an exception occurs.
        if exc_type:
            self.db.collections = self._backup

# Example usage:
# async def example_usage():
#     db = DummyVectorDB()
#     async with DummyTransaction(db):
#         await db.create_collection("example", vector_size=3)
#         await db.add_vectors("example", vectors=[[1, 2, 3]], metadata=[{"tag": "test"}])
#         results = await db.search_vectors("example", query_vector=[1, 2, 3])
#         print(results)
