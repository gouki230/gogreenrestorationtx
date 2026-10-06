"""Confirm draft core overrides cannot replace live owners in an ordinary build."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--dist',required=True);p.add_argument('--output',required=True);p.add_argument('--manifest');args=p.parse_args()
root=Path(args.dist);content=json.loads(Path(args.manifest).read_text()) if args.manifest else {}
if not args.manifest:
 for file in Path('src/data').glob('city-core-editorial-*.json'):content.update(json.loads(file.read_text()))
existing={c['slug'] for c in json.loads(Path('src/data/cities-dfw-metro.json').read_text())}
sitemap=''.join(file.read_text() for file in root.glob('sitemap*.xml'));rows=[];errors=[]
for key,copy in content.items():
 city=key.split('/')[-1];route=f'/{key}/' if '/' in key else f'/locations/dfw-metro/{key}/';file=root/route.strip('/')/'index.html';listed='https://gogreenrestorationtx.com'+route+'<' in sitemap
 if city in existing:
  checks={'liveOwnerRetained':file.exists(),'draftCopyExcluded':file.exists() and copy['intro'] not in file.read_text(),'liveOwnerInSitemap':listed}
 else:checks={'newDraftExcluded':not file.exists(),'newDraftNotInSitemap':not listed}
 rows.append({'path':route,'checks':checks})
 for name,passed in checks.items():
  if not passed:errors.append({'path':route,'failed':name})
Path(args.output).write_text(json.dumps({'pages':rows,'errors':errors},indent=2)+'\n');print(json.dumps({'pages':len(rows),'errors':errors}));raise SystemExit(bool(errors))
