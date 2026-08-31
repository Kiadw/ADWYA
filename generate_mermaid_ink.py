import base64
import json
import urllib.request
import urllib.error

with open('diagram1.mmd', 'r') as f:
    text1 = f.read()

with open('diagram2.mmd', 'r') as f:
    text2 = f.read()

def download(code, output_path):
    data = {"code": code, "mermaid": {"theme": "default"}}
    b64_data = base64.urlsafe_b64encode(json.dumps(data).encode('utf-8')).decode('ascii')
    url = f"https://mermaid.ink/svg/{b64_data}"
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        with open(output_path, 'wb') as f:
            f.write(response.read())

print("Downloading diagram 1...")
download(text1, "public/architecture-system.svg")
print("Downloading diagram 2...")
download(text2, "public/architecture-ai.svg")
print("Done!")
