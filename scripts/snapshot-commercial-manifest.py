"""Capture the authored commercial source corpus immediately before a build."""
import argparse, hashlib, json
from datetime import datetime, timezone
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
parser.add_argument('--city-limit', type=int, help='Freeze a completed city cohort while later drafts are being written.')
args = parser.parse_args()
selected = None
if args.city_limit is not None:
    cities = json.loads(Path('docs/seo/commercial-city-expansion-progress.json').read_text())['cityOrder']
    if not 1 <= args.city_limit <= len(cities):
        parser.error('--city-limit must select 1–206 cities')
    selected = set(cities[:args.city_limit])
paths, files = [], {}
for file in sorted(Path('src/data').glob('commercial-city-editorial*.json')):
    raw = file.read_bytes()
    data = json.loads(raw)
    file_paths = [f'/commercial/{topic}/{city}/' for topic, entries in data.items() for city in entries if selected is None or city in selected]
    if file_paths:
        files[str(file)] = hashlib.sha256(raw).hexdigest()
        paths.extend(file_paths)
snapshot = {'capturedAt': datetime.now(timezone.utc).isoformat(), 'paths': paths, 'sourceFiles': files}
if args.city_limit is not None:
    snapshot['cityLimit'] = args.city_limit
Path(args.output).write_text(json.dumps(snapshot, indent=2) + '\n')
print(json.dumps({'sourceFiles': len(files), 'cityPages': len(paths), 'output': args.output}))
