"""Audit the explicitly approved production subset, not source draft presence."""
import argparse,json,re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
p=argparse.ArgumentParser();p.add_argument('--dist',default='dist');p.add_argument('--output',default='docs/seo/release-technical-review.json');a=p.parse_args();root=Path(a.dist)
manifest=json.loads(Path('src/data/expansion-release-manifest.json').read_text());approved=set(sum([manifest[k] for k in ['corePaths','compactPaths','commercialPaths','commercialRegionalPaths']],[]))
sitemap=''.join(f.read_text() for f in root.glob('sitemap*.xml'));errors=[];count=0
class Page(HTMLParser):
 def __init__(self):super().__init__();self.h1=0;self.canonical=[];self.robots='';self.links=[];self.images=[];self.assets=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if tag=='meta' and d.get('name')=='robots':self.robots=d.get('content','')
  if tag=='a':self.links.append(d.get('href',''))
  if tag=='img':
   self.images.append(d);self.assets.append(d.get('src',''))
   self.assets.extend(s.strip().split(' ')[0] for s in d.get('srcset','').split(',') if s.strip())
  if tag=='script' and d.get('src'):self.assets.append(d['src'])
  if tag=='link' and d.get('rel')=='stylesheet':self.assets.append(d.get('href',''))
def exists(url):
 u=urlsplit(url)
 if u.netloc and u.netloc!='gogreenrestorationtx.com':return True
 if not u.path.startswith('/'):return True
 f=root/unquote(u.path).lstrip('/')
 return f.is_file() or (f/'index.html').is_file()
for f in root.rglob('*.html'):
 route='/'+f.relative_to(root).as_posix().removesuffix('index.html');raw=f.read_text();doc=Page();doc.feed(raw);count+=1
 if f.name!='index.html':continue
 if doc.h1!=1:errors.append([route,'h1',doc.h1])
 if doc.canonical!=['https://gogreenrestorationtx.com'+route]:errors.append([route,'canonical',doc.canonical])
 for href in set(doc.links+doc.assets):
  if not exists(href):errors.append([route,'missing target',href])
 for img in doc.images:
  if 'alt' not in img:errors.append([route,'missing alt',img.get('src')])
 for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',raw,re.S):
  try:json.loads(block)
  except json.JSONDecodeError:errors.append([route,'invalid JSON-LD'])
 if route in approved:
  if 'noindex' in doc.robots:errors.append([route,'noindex on released page'])
  if 'https://gogreenrestorationtx.com'+route+'<' not in sitemap:errors.append([route,'missing sitemap'])
  if re.search(r'Local review draft|Draft preview|not for indexing',raw,re.I):errors.append([route,'draft notice'])
for route in approved:
 if not (root/route.strip('/')/'index.html').exists():errors.append([route,'released route missing'])
for route in ['/city-service-preview/','/commercial-expansion-preview/','/locations/dfw-metro/royse-city/','/water-damage-restoration/royse-city/']:
 if (root/route.strip('/')/'index.html').exists():errors.append([route,'unreleased route exists'])
cities=json.loads(Path('src/data/cities-dfw-expanded.json').read_text())+json.loads(Path('src/data/cities-dfw-metro.json').read_text())
slugs={c['slug'] for c in cities}
topics=json.loads(Path('src/data/compact-services.json').read_text())
all_expected={f'/{t["slug"]}/{city}/' for t in topics for city in slugs}
all_expected.update(f'/{service}/{city}/' for service in ['water-damage-restoration','mold-remediation','fire-smoke-damage-restoration','sewage-backup-cleanup','construction-remodeling'] for city in slugs)
all_expected.update(f'/locations/dfw-metro/{city}/' for city in slugs)
for route in all_expected-approved:
 if (root/route.strip('/')/'index.html').exists():errors.append([route,'unapproved expansion route rendered'])
report={'pages':count,'approvedExpansionRoutes':len(approved),'errors':errors};Path(a.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'pages':count,'approvedExpansionRoutes':len(approved),'errorCount':len(errors),'firstErrors':errors[:20]}));raise SystemExit(bool(errors))
