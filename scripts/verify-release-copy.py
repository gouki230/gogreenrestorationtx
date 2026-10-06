"""Ensure release promotion preserves the fully audited marked substantive copy."""
import ast,json
from pathlib import Path
source=Path('scripts/audit-city-copy.py').read_text();tree=ast.parse(source)
ns={};exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom,ast.ClassDef))],type_ignores=[]),'audit-parser','exec'),ns)
m=json.loads(Path('src/data/expansion-release-manifest.json').read_text());errors=[]
for route in m['corePaths']+m['compactPaths']:
 values=[]
 for root in ['.astro/general-verification','dist']:
  p=ns['Copy']();p.feed((Path(root)/route.strip('/')/'index.html').read_text());values.append(' '.join(' '.join(p.parts).split()))
 if values[0]!=values[1]:errors.append(route)
r={'comparedPages':len(m['corePaths'])+len(m['compactPaths']),'comparison':'Rendered data-uniqueness text identical to full sibling/regional audited preview','changedPaths':errors};Path('docs/seo/release-copy-preservation.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r));raise SystemExit(bool(errors))
