"""Check authored core drafts without treating a phrase score as editorial approval."""
import argparse,json,re
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
from urllib.parse import urlsplit
class Page(HTMLParser):
 def __init__(self):super().__init__();self.h1=0;self.canonical='';self.robots='';self.links=[];self.images=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='img':self.images.append(a)
p=argparse.ArgumentParser();p.add_argument('--mode',choices=['draft','production'],default='draft');p.add_argument('--dist',required=True);p.add_argument('--output',required=True);p.add_argument('--manifest');args=p.parse_args();root=Path(args.dist)
copy=json.loads(Path(args.manifest).read_text()) if args.manifest else {}
if not args.manifest:
 for file in Path('src/data').glob('city-core-editorial-*.json'):copy.update(json.loads(file.read_text()))
sitemap=''.join(f.read_text() for f in root.glob('sitemap*.xml'));errors=[];rows=[]
for key,content in copy.items():
 route=f'/{key}/' if '/' in key else f'/locations/dfw-metro/{key}/';html=(root/route.strip('/')/'index.html').read_text();doc=Page();doc.feed(html)
 checks={'h1':doc.h1==1,'canonical':doc.canonical=='https://gogreenrestorationtx.com'+route,'robots':('noindex' in doc.robots)==(args.mode=='draft'),'sitemapInclusion':(('https://gogreenrestorationtx.com'+route+'<') in sitemap)==(args.mode=='production'),'intro':content['intro'] in unescape(html),'image':any('service-guides/' in i.get('src','') and bool(i.get('alt')) and (root/i['src'].lstrip('/')).exists() for i in doc.images)}
 try:
  schemas=[json.loads(block) for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',html,re.S)]
  checks['jsonLd']=bool(schemas)
 except json.JSONDecodeError: checks['jsonLd']=False
 publicCopy=' '.join([content['intro']]+[paragraph for section in content['sections'] for paragraph in section['paragraphs']]+content['checklist'])
 checks['customerLanguage']=not bool(re.search(r'\b(?:SEO|keywords?|cannibali[sz]ation|page ownership|focused owners|search intent|topic owners?|remain the owners)\b',publicCopy,re.I))
 for href in doc.links:
  url=urlsplit(href)
  if not url.scheme and url.path.startswith('/') and url.path.endswith('/') and not (root/url.path.strip('/')/'index.html').exists():errors.append({'route':route,'brokenLink':href})
 for check,passed in checks.items():
  if not passed:errors.append({'route':route,'failed':check})
 rows.append({'route':route,'checks':checks})
report={'pages':rows,'errors':errors};Path(args.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'pages':len(rows),'errors':errors}));raise SystemExit(bool(errors))
