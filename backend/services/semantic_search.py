import os
from typing import List, Dict, Any
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

class SemanticSearchEngine:
   
    
    def __init__(self):
        # We use a free HuggingFace model for the PoC to avoid OpenAI API costs during testing.
        # all-MiniLM-L6-v2 is fast and effective for semantic similarity tasks.
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None

    def index_subjects(self, subjects_data: List[Dict[str, Any]]):
        """
        Takes raw subject data from MongoDB and indexes it into a FAISS vector store.
        """
        documents = []
        for subject in subjects_data:
            # Create a rich text representation of the syllabus for the embedding model
            content = f"Course: {subject.get('name', '')}. "
            
            # Add department and semester info
            course_info = subject.get('course', {})
            content += f"Department: {course_info.get('department', '')}. "
            content += f"Semester: {course_info.get('semester', '')}. "
            
            # Add unit topics
            for unit in subject.get('units', []):
                content += f"Unit {unit.get('unit_number')}: {unit.get('title')}. "
                content += f"Topics: {', '.join(unit.get('topics', []))}. "
                
            # Create a Document object with metadata mapping back to the original DB ID
            doc = Document(
                page_content=content,
                metadata={"subject_id": str(subject.get('_id', '')), "slug": subject.get('slug', '')}
            )
            documents.append(doc)

        if documents:
            self.vector_store = FAISS.from_documents(documents, self.embeddings)
            print(f"✅ Successfully indexed {len(documents)} subjects into FAISS vector store.")
        else:
            print("⚠️ No documents provided for indexing.")

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, str]]:
        """
        Performs a semantic similarity search against the indexed syllabi.
        """
        if not self.vector_store:
            print("❌ Vector store is not initialized. Please call `index_subjects` first.")
            return []

        # The vector store handles converting the text query to an embedding and finding the nearest neighbors
        results = self.vector_store.similarity_search(query, k=top_k)
        
        # Return the metadata of the matched subjects
        return [doc.metadata for doc in results]

# Example usage (Commented out for the PoC):
# engine = SemanticSearchEngine()
# engine.index_subjects(mock_mongo_data)
# results = engine.search("I need a course with heavy mathematics and discrete structures")
