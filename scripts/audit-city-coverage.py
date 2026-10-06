"""Verify the requested city → service → compact-service route matrix in a preview build."""
import argparse,json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=set();self.canonical=None;self.noindex=False;self.h1=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a':
   u=urlsplit(a.get('href',''))
   if not u.scheme and u.path.startswith('/'):self.links.add(u.path)
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if tag=='meta' and a.get('name')=='robots':self.noindex='noindex' in a.get('content','')
  if tag=='h1':self.h1+=1
parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);parser.add_argument('--dist',default='dist');args=parser.parse_args()
root=Path(args.dist);inventory=json.loads(Path('docs/seo/dfw-municipality-inventory-2026-10-04.json').read_text())['municipalities'];existing={c['slug'] for c in json.loads(Path('src/data/cities-dfw-metro.json').read_text())};services=json.loads(Path('src/data/services.json').read_text());topics=json.loads(Path('src/data/compact-services.json').read_text());errors=[];rows=[]
def check(route,draft):
 p=root/route.strip('/')/'index.html'
 if not p.exists():errors.append({'route':route,'error':'missing'});return None
 doc=Page();doc.feed(p.read_text())
 if doc.canonical!='https://gogreenrestorationtx.com'+route:errors.append({'route':route,'error':'canonical'})
 if doc.h1!=1:errors.append({'route':route,'error':'H1 count'})
 if draft and not doc.noindex:errors.append({'route':route,'error':'draft missing noindex'})
 for link in doc.links:
  if link.endswith('/') and not (root/link.strip('/')/'index.html').exists():errors.append({'route':route,'error':'broken internal link','target':link})
 return doc
for city in inventory:
 slug=city['slug'];hub=f'/locations/dfw-metro/{slug}/';doc=check(hub,slug not in existing)
 for service in services:
  route=f'/{service["slug"]}/{slug}/';check(route,slug not in existing)
  if doc and route not in doc.links:errors.append({'route':hub,'error':'missing main service link','target':route})
 for topic in topics:
  route=f'/{topic["slug"]}/{slug}/';check(route,True)
 rows.append({'city':city['name'],'hub':hub,'main_services':len(services),'subservices':len(topics)})
report={'cities':len(rows),'city_hubs':len(rows),'main_service_pages':len(rows)*len(services),'subservice_pages':len(rows)*len(topics),'errors':errors,'coverage':rows};Path(args.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='coverage'},indent=2));raise SystemExit(bool(errors))
