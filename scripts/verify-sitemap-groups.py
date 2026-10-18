"""Verify sitemap grouping preserves the published inventory and excludes drafts."""
import argparse
from collections import Counter
import json
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('--dist', required=True)
parser.add_argument('--baseline', required=True, help='Previous production URL sitemap XML')
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(args.dist)
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
base = 'https://gogreenrestorationtx.com'
index = ET.parse(root / 'sitemap-index.xml').getroot()
files = [node.text for node in index.findall('s:sitemap/s:loc', ns)]
errors = []
rows = []
urls = []
expected_names = {'city-hubs', 'main-service-cities', 'compact-service-cities', 'commercial', 'resources', 'pages'}
seen_groups = set()
for url in files:
    path = urlsplit(url).path
    file = root / path.lstrip('/')
    if not url.startswith(base + '/sitemap-') or not file.is_file():
        errors.append(['missing or invalid sitemap', url])
        continue
    group = file.stem.removeprefix('sitemap-').rsplit('-', 1)[0]
    seen_groups.add(group)
    tree = ET.parse(file).getroot()
    entries = tree.findall('s:url', ns)
    locations = [node.find('s:loc', ns).text for node in entries]
    rows.append({'file': file.name, 'group': group, 'urls': len(locations), 'bytes': file.stat().st_size})
    if not locations or len(locations) > 50000 or file.stat().st_size > 52428800:
        errors.append(['sitemap size/empty', file.name])
    urls.extend(locations)
    for location in locations:
        path = urlsplit(location).path
        html = root / path.lstrip('/') / 'index.html'
        if not location.startswith(base + '/') or not html.is_file():
            errors.append(['missing page', location])
        elif 'content="noindex' in html.read_text():
            errors.append(['noindex page', location])
if seen_groups != expected_names:
    errors.append(['unexpected groups', sorted(seen_groups)])
counts = Counter(urls)
if any(n != 1 for n in counts.values()):
    errors.append(['duplicate URLs', [u for u, n in counts.items() if n != 1]])
baseline = {n.text for n in ET.parse(args.baseline).getroot().findall('s:url/s:loc', ns)}
if set(urls) != baseline:
    errors.append(['inventory changed', {'missing': sorted(baseline - set(urls)), 'added': sorted(set(urls) - baseline)}])
manifest = json.loads(Path('src/data/expansion-release-manifest.json').read_text())
for key in ['corePaths', 'compactPaths', 'commercialPaths', 'commercialRegionalPaths']:
    missing = [p for p in manifest[key] if base + p not in counts]
    if missing:
        errors.append(['approved URLs missing', key, missing])
progress = json.loads(Path('docs/seo/city-expansion-progress.json').read_text())
for path in progress['editorialHoldPaths'] + ['/city-service-preview/', '/commercial-expansion-preview/', '/thank-you/']:
    if base + path in counts:
        errors.append(['excluded URL in sitemap', path])
report = {'index': 'sitemap-index.xml', 'totalUrls': len(urls), 'baselineUrls': len(baseline), 'sitemaps': rows, 'errors': errors}
Path(args.output).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
raise SystemExit(bool(errors))
