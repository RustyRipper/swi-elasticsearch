import requests
import pandas as pd
import time
import psutil
import json
import numpy as np
from datetime import datetime

# Parametry
INDEX_NAME = "genius_songs2"
BASE_URL = f"http://localhost:9200/{INDEX_NAME}"
CSV_FILE_PATH = "new.csv"  # Ścieżka do pliku CSV

# Załaduj dane CSV do pandas
def load_csv_data(file_path):
    return pd.read_csv(file_path)

# Definicja schematu (indeksu)
mapping = {
    "settings": {
        "number_of_shards": 5,
        "number_of_replicas": 1,
        "analysis": {
            "analyzer": {
                "custom_lyrics_analyzer": {
                    "type": "standard",
                    "stopwords": "_english_"
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "title": {"type": "text", "boost": 2.0},
            "artist": {"type": "keyword"},
            "tag": {"type": "keyword"},
            "year": {"type": "integer"},
            "views": {"type": "integer"},
            "features": {"type": "text"},
            "lyrics": {"type": "text", "analyzer": "custom_lyrics_analyzer"},
            "language": {"type": "keyword"},
            "id": {"type": "integer"}
        }
    }
}

# Tworzenie indeksu
def create_index():
    response = requests.put(BASE_URL, json=mapping)
    return response.json()

# Funkcja do indeksowania dokumentów
def index_documents(documents):
    headers = {'Content-Type': 'application/json'}
    for doc in documents:
        # Przekazywanie nazwy indeksu jako parametr w URL
        response = requests.post(f"{BASE_URL}/_doc/{doc['_id']}", json=doc["_source"], headers=headers)

        if response.status_code != 200 and response.status_code != 201:
            # Zapisz pełną odpowiedź na błąd (w tym szczegóły)
            print(f"Error indexing document with ID {doc['_id']}: {response.status_code}")
            print(f"Response content: {response.json()}")
        #else:
        #print(f"Indexed document with ID {doc['_id']}: {response.status_code}")




# Statystyki indeksowania
def get_index_stats():
    response = requests.get(f"{BASE_URL}/_stats")
    return response.json()

# Funkcja do czyszczenia pamięci cache Elasticsearch
def clear_cache():
    response = requests.post(f"{BASE_URL}/_cache/clear")
    return response.json()

# Funkcja do monitorowania zasobów
def monitor_resources():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    print(f"CPU Usage: {cpu_percent}%")
    print(f"Memory Usage: {memory_info.percent}%")

    return cpu_percent, memory_info.percent


def clean_value(value):
    """Replace NaN values with None for Elasticsearch compatibility."""
    if isinstance(value, float) and np.isnan(value):
        return None
    return value

def clean_features(features):
    """Ensure 'features' is always a string."""
    if isinstance(features, str):
        return features  # Already a string, return as is
    if isinstance(features, (list, dict)):
        return json.dumps(features)  # Convert list/dict to JSON string
    return ""  # Default empty string if value is missing

# Funkcja przekształcająca dane CSV na listę dokumentów
def prepare_documents_from_csv(df):
    documents = []
    for _, row in df.iterrows():
        doc = {
            "_index": INDEX_NAME,
            "_id": str(clean_value(row["id"])),
            "_source": {
                "title": clean_value(row["title"]),
                "artist": clean_value(row["artist"]),
                "tag": clean_value(row["tag"]),
                "year": clean_value(row["year"]),
                "views": clean_value(row["views"]),
                "features": clean_features(row["features"]),  # Ensuring it's a string
                "lyrics": clean_value(row["lyrics"]),
                "language": clean_value(row["language"]),
            }
        }
        documents.append(doc)
    return documents

# Funkcja do indeksowania różnych procentów danych
def index_percentage_of_data(df, percentage):
    print(f"Indexing {percentage}% of the data...")
    documents = prepare_documents_from_csv(df)
    # Liczba dokumentów do zaindeksowania
    num_documents = int(len(documents) * (percentage / 100))
    index_documents(documents[:num_documents])

# Główna funkcja - wykonanie zadania
def main():
    start_time = time.time()

    # Tworzymy indeks
    print("Creating index...")
    create_index()

    # Ładujemy dane z CSV
    print(f"Loading CSV data from {CSV_FILE_PATH}...")
    df = load_csv_data(CSV_FILE_PATH)
    print(f"Loaded {len(df)} rows from CSV")

    # Testowanie różnych procentów danych
    # for percentage in [10, 20, 50, 100]:
    for percentage in [10]:

        print(f"\n--- Indexing {percentage}% of data ---")

        # Indeksowanie
        index_percentage_of_data(df, percentage)

        # Statystyki indeksowania
        stats = get_index_stats()
        print("Indexing Stats:", json.dumps(stats, indent=2))

        # Czyszczenie pamięci cache
        print("Clearing cache...")
        clear_cache()

        # Monitorowanie zasobów (CPU i RAM)
        print("Monitoring resources...")
        monitor_resources()

        # Czas indeksowania
        elapsed_time = time.time() - start_time
        print(f"Time taken for indexing {percentage}% of documents: {elapsed_time:.2f} seconds")

    # Podsumowanie po zakończeniu operacji
    print("\n--- Final Summary ---")

    # Czas całkowity
    total_time = time.time() - start_time
    print(f"Total Time Taken for All Operations: {total_time:.2f} seconds")

    # Statystyki indeksu
    print("\nGetting final index stats...")
    final_stats = get_index_stats()
    total_documents = final_stats.get('indices', {}).get(INDEX_NAME, {}).get('total', {}).get('docs', {}).get('count', 0)
    total_size = final_stats.get('indices', {}).get(INDEX_NAME, {}).get('total', {}).get('store', {}).get('size_in_bytes', 0)

    print(f"Total Documents Indexed: {total_documents}")
    print(f"Total Index Size: {total_size / (1024 * 1024):.2f} MB")  # Rozmiar w MB

    # Monitorowanie zasobów na koniec
    print("Final Resource Usage:")
    final_cpu_percent, final_memory_percent = monitor_resources()
    print(f"Final CPU Usage: {final_cpu_percent}%")
    print(f"Final Memory Usage: {final_memory_percent}%")

if __name__ == "__main__":
    main()
