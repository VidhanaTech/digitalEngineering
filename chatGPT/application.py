import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from llama_index import GPTVectorStoreIndex, LLMPredictor, ServiceContext, SimpleDirectoryReader
from langchain.chat_models import ChatOpenAI
import requests
from PyPDF2 import PdfReader
import io
import os
import re
from docx import Document
import openai
import hashlib
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from elasticsearch_dsl import Search, Q
# Initialize your Flask app
app = applicaton = Flask(__name__)

# Initialize CORS for your Flask app
CORS(app)

# Database connection setup 
db_connection = mysql.connector.connect(
    host="hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com",
    user="admin",
    password="Pabbu123",
    database="digital_experience")

# Set up OpenAI API key
os.environ["OPENAI_API_KEY"] = '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 '
openai.api_key = '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 '

# Initialize your existing index as a global variable
existing_index = None

file_info= None

# Define your base paths and directories
base_path = "http://3.7.92.74:8000/services"

#base_directory = '/opt/render/project/src/chatGPT'
#training_data_directory = os.path.join(base_directory, "trainingData")
# = os.path.join(base_directory, "indexes")
training_data_directory="trainingData"
index_directory="indexes"


# Initialize Elasticsearch client
es = Elasticsearch(#
    cloud_id="digitalexperience:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDQ2YWE4MTNhMWRhODRiNWM5MTE3MDQ5MDNkNmNmM2VhJGE1NjZkMDgxZjAyMTRkMGJhMWU1ZmFmYzIxMTJhMjgx",
    basic_auth=('elastic', '18vmJXX53oUUVUA9Z4IK95qB'))

# Ensure the indexes directory exists
def ensure_index_directory():
    if not os.path.exists(index_directory):
        os.makedirs(index_directory)

# Ensure the training data directory exists
def ensure_training_data_directory():
    if not os.path.exists(training_data_directory):
        os.makedirs(training_data_directory)

# Extract text from a PDF file
def extract_text_from_pdf(file_content):
    pdf_document = PdfReader(io.BytesIO(file_content))
    text = ""
    for page in pdf_document.pages:
        text += page.extract_text()
    return text

# Extract text from a DOCX file
def extract_text_from_docx(file_content):
    doc = Document(io.BytesIO(file_content))
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

# Construct the index and save it
def construct_index_and_save(documents):
    global existing_index

    num_outputs = 256
    llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=0.5,
                                                model_name="gpt-3.5-turbo",
                                                max_tokens=num_outputs))
    service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)
    ensure_training_data_directory()
    for document in documents:
        article_id = document["article_id"]
        title = document["title"]
        description = document["description"]
        file_content = document["file_content"]

        content = f"Article ID: {article_id}\nTitle: {title}\nDescription: {description}\nFile Content: {file_content}"

        # Save the content to a text file
        file_path = os.path.join(training_data_directory, f"{article_id}.txt")
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        
        cursor = db_connection.cursor()
        cursor.execute("UPDATE Km_ArticleAttachment SET Indexed = 1 WHERE ArticleId = %s AND (FileName LIKE '%.pdf' OR FileName LIKE '%.docx')", (article_id,))
        db_connection.commit()
        cursor.close()

    docs = SimpleDirectoryReader(training_data_directory).load_data()
    index = GPTVectorStoreIndex.from_documents(docs, service_context=service_context)


    ensure_index_directory()
    
    index.storage_context.persist(persist_dir="indexes")

    existing_index = index

    print("Index construction completed and saved in the 'indexes' directory.")


# Construct the index for eligible files
def construct_index_for_files():
    cursor = db_connection.cursor()
    cursor.execute(
        "SELECT f.ArticleId AS ArticleId, a.Title AS Title, a.Description AS Description, f.FileName AS FileName, f.FilePath AS FilePath, f.Indexed as indexed FROM digital_experience.Km_ArticleAttachment AS f JOIN digital_experience.Km_Article AS a ON f.ArticleId=a.id WHERE Indexed = 0 AND (FileName LIKE '%.pdf' OR FileName LIKE '%.docx')")
    eligible_records = cursor.fetchall()

    documents = []

    for record in eligible_records:
        article_id, title, description, filename, filepath, indexed = record
        complete_file_url = f"{base_path}/{filepath}"

        response = requests.get(complete_file_url)

        if response.status_code == 200:
            file_content = response.content

            if filename.endswith('.pdf'):
                file_text = extract_text_from_pdf(file_content)

            elif filename.endswith('.docx'):
                file_text = extract_text_from_docx(file_content)

            document = {
                "article_id": article_id,
                "title": title,
                "description": description,
                "file_content": file_text,
            }

            documents.append(document)
        else:
            print(f"Failed to retrieve file content for ArticleId {article_id}")

    cursor.close()

    if documents:
        construct_index_and_save(documents)
    elif existing_index is None:
        print("No eligible records found for indexing, and no existing index available.")
    else:
        print("No eligible records found for indexing. Using the existing index.")

# Chatbot function to handle user queries
def chatbot(input_text):
    global existing_index

    if existing_index is None:
        return {'response': 'Index is not initialized'}

    query_engine = existing_index.as_query_engine()

    #prompt ="provide the response along with respective Article ID which are indexed \n"
    # Construct a prompt to consider the article ID for the entire file content
    #prompt += f"Article ID is unique for entire file content:\n{input_text}\n"
    #prompt +="Instructions: For each matched file, search the content for the 'Article ID:' information and return the corresponding article ID when prompted with the user's query \n"
    #prompt +="Instructions: Return the article ID from the matched file content for the user query. Note that the article ID is common for the entire file content\n"
    #prompt += "Return the article ID for the query that matches the content:\n"
    prompt = "Instructions: Provide answers based solely on the given documents\n"

    input=input_text+prompt

    # Query the index based on user input
    response = query_engine.query(input)
    
    return {
        'response': response.response,
    }

    

# Route for the home page
@app.route('/', methods=['GET'])
def home():
    return 'Welcome to the Chatbot API'

# Route for the chat API
@app.route('/api/chat', methods=['POST'])
def chat_api():
    try:
        input_text = request.json['input_text']
        response = chatbot(input_text)
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)})

# Function to check if eligible documents for indexing exist
def check_eligible_documents_exist():
    cursor = db_connection.cursor()
    cursor.execute(
        "SELECT COUNT(*) FROM digital_experience.Km_ArticleAttachment WHERE Indexed = 0 AND (FileName LIKE '%.pdf' OR FileName LIKE '%.docx')")
    count = cursor.fetchone()[0]
    cursor.close()

    return count > 0

# Function to create Elasticsearch index and ingest new documents
def create_index_and_ingest_new_files(files_directory):
    
    index_name = "cognitive_search_index"

    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name)

    # Get the list of existing file names in the index
    existing_files = set()
    if es.indices.exists(index=index_name):
        existing_files_query = {
            "size": 10000,  # Adjust based on your dataset size
            "_source": ["file_name"]
        }
        existing_files_response = es.search(index=index_name, **existing_files_query)
        for hit in existing_files_response["hits"]["hits"]:
            existing_files.add(hit["_source"]["file_name"])

    actions = []

    for root, _, files in os.walk(files_directory):
        for file in files:
            file_path = os.path.join(root, file)

            # Check if the file is not already indexed
            if os.path.isfile(file_path) and file not in existing_files:
                with open(file_path, encoding="utf8") as text_file:
                    content = text_file.read()

                # Extract the article ID from the file name (assuming it's in the format "article_id.txt")
                article_id = os.path.splitext(file)[0]

                # Create a document to index
                doc = {
                    "content": content,
                    "file_name": file,
                    "article_id": article_id  # Include article ID in the document
                }

                action = {
                    "_index": index_name,
                    "_source": doc
                }

                actions.append(action)

    # Ingest new documents into Elasticsearch
    bulk(es, actions)

# Function to perform cognitive search and return file names and article IDs
def cognitive_search(question):
    global file_info
    index_name = "cognitive_search_index"

    # Create an Elasticsearch Search object
    s = Search(using=es, index=index_name)
    
    # Split the user's question into individual terms
    query_terms = question.split()

    # Create a "must" clause for each term
    must_clauses = [Q("match", content=term) for term in query_terms]

    # Combine "must" clauses in a "bool" query
    query = Q("bool", must=must_clauses)

    # Apply the query to the search object
    s = s.query(query)

    # Execute the search
    response = s.execute()

    # Extract file names and article IDs from the search results
    file_info = [{"article_id": hit.article_id} for hit in response]

    return file_info

# Specify the directory containing your files for cognitive search
files_directory = "trainingData"


@app.route('/api/search', methods=['POST'])
@cross_origin()
def search():
    if request.method == 'POST':
        try:
            # Get user question from the request data
            input_text = request.json['input_text']
            #user_question = data['question']

            # Perform cognitive search and get file names and article IDs
            found_file_info = cognitive_search(input_text)

            if found_file_info:
                response = {
                    "message": "Results found",
                    "results": found_file_info
                }
            else:
                response = {
                    "message": "No relevant files found",
                    "results": []
                }

            return jsonify(response)

        except Exception as e:
            return jsonify({"message": "Error: " + str(e)})


if __name__ == '__main__':
    eligible_documents_exist = check_eligible_documents_exist()

    if eligible_documents_exist or not os.path.exists(index_directory):
        construct_index_for_files()
    else:
        # Load existing index if available
        if os.path.exists(index_directory):
            indexed_documents = SimpleDirectoryReader(training_data_directory).load_data()
            existing_index = GPTVectorStoreIndex.from_documents(indexed_documents)
        print("Using exisitng Index")
    # Create Elasticsearch index and ingest new documents
    create_index_and_ingest_new_files(training_data_directory)

    app.run(host='0.0.0.0', port=5000)
