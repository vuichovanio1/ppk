import re
import json

with open('c:/Users/MacMic/source/repos/ppk/slivnica.html', 'r', encoding='utf-8') as f:
    content = f.read()

scripts = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL | re.IGNORECASE)

print(f'Found {len(scripts)} JSON-LD scripts in slivnica.html\n')

for i, script in enumerate(scripts):
    print(f'=== Script {i+1} ===')
    try:
        parsed = json.loads(script.strip())
        if isinstance(parsed, dict):
            if '@graph' in parsed:
                print(f'  Type: Graph with {len(parsed["@graph"])} entities')
                for entity in parsed['@graph']:
                    print(f'    - {entity.get("@type", "Unknown")}: {entity.get("name", entity.get("@id", "No name"))[:50]}...')
            else:
                print(f'  Type: {parsed.get("@type", "Unknown")}')
                name = parsed.get('name', 'No name')
                print(f'  Name: {name[:50]}...')
        else:
            print('  Type: Unknown structure')
    except json.JSONDecodeError as e:
        print(f'  ❌ Invalid JSON: {e}')
    print()