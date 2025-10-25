import asyncio
from fastapi import FastAPI
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

# -----------------------------------------------------
#  FastAPI setup
# -----------------------------------------------------
app = FastAPI()
load_dotenv()

# Global variables
vectore_store = None
conversationnal_chain = None

chat_History = [
    AIMessage(content="Hello, I am **M795 AI chatbot**. How can I help you?")
]

# -----------------------------------------------------
#  Enable CORS for your frontend
# -----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
#  Create Vector Store
# -----------------------------------------------------
def get_vectore(url):
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        asyncio.set_event_loop(asyncio.new_event_loop())

    loader = WebBaseLoader(url)
    document = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    document_chunk = text_splitter.split_documents(document)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    vector_store = FAISS.from_documents(document_chunk, embeddings)
    return vector_store

# -----------------------------------------------------
#  Create Conversational RAG Chain
# -----------------------------------------------------
def get_conversational_rag_chain(vector_store):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,             # More creativity
        max_output_tokens=2048       # Prevent short/truncated answers
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are **M795 AI chatbot**,you can generate accurate, context-aware answers based on given information.,developed by **Mamun Ahmed**, "
         "a 4th-year, 2nd-semester student in the ICT Department at MBSTU. "
         "He is a competitive programmer. He was never very good at programming, but he never gave up on it."
         "When asked 'who are you' or 'who developed you', answer only with your name and developer identity in **bold**. "
         "Otherwise, answer normally, clearly, and in the same language as the user. "
         "Answer based on the context below:\n\n{context}\n\n"
         "You can use external general knowledge only when needed. "
         "Highlight important words in **bold** and ensure perfect grammar."
         ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}")
    ])

    retriever = vector_store.as_retriever()
    stuff_documents_chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retriever, stuff_documents_chain)

# -----------------------------------------------------
# 💬 Get Response Function
# -----------------------------------------------------
def get_response(user_input):
    global conversationnal_chain, chat_History
    if conversationnal_chain is None:
        return "Please process a website first!"

    result = conversationnal_chain.invoke({
        "chat_history": chat_History,
        "input": user_input
    })

    # Ensure we always extract plain text
    if isinstance(result, dict):
        answer = result.get("answer", "")
    elif hasattr(result, "content"):
        answer = result.content
    else:
        answer = str(result)

    return answer or "No answer found."

# -----------------------------------------------------
#  Pydantic Model
# -----------------------------------------------------
class WebsiteInput(BaseModel):
    web: str

# -----------------------------------------------------
#  Process Website Endpoint
# -----------------------------------------------------


@app.get("/")
def root():
    return {"message": "✅ M795 AI chatbot backend is running successfully!"}



@app.post("/process_url")
def process_url(data: WebsiteInput):
    try:
        url = data.web
        global vectore_store
        vectore_store = get_vectore(url)

        global conversationnal_chain
        conversationnal_chain = get_conversational_rag_chain(vectore_store)

        return {"message": " Website processed successfully! You can now chat."}
    except Exception as e:
        return {"Note": " Website is not correct or could not be loaded."}

# -----------------------------------------------------
#  Chat Message Endpoint
# -----------------------------------------------------
@app.post("/send_msg")
def send_msg1(data: WebsiteInput):
    user_input = data.web
    ans = get_response(user_input)

    chat_History.append(HumanMessage(content=user_input))
    chat_History.append(AIMessage(content=ans))

    return {"ans": ans}
