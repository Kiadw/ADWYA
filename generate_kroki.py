import urllib.request
import urllib.error

with open('diagram1.mmd', 'r') as f:
    text1 = f.read().encode('utf-8')

with open('diagram2.mmd', 'r') as f:
    text2 = f.read().encode('utf-8')

def download(data, output_path):
    req = urllib.request.Request("https://kroki.io/mermaid/svg", data=data, headers={'Content-Type': 'text/plain', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        with open(output_path, 'wb') as f:
            f.write(response.read())

print("Downloading diagram 1...")
download(text1, "public/architecture-system.svg")
print("Downloading diagram 2...")
download(text2, "public/architecture-ai.svg")
print("Done!")
