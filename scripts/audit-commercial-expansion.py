"""Audit rendered commercial drafts; phrase uniqueness is an editorial proxy."""
import argparse,json,re
from pathlib import Path
from html.parser import HTMLParser
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.depth=0;self.copy=[];self.h1=[];self.h2=[];self.title=[];self.active=None;self.meta={};self.canonical='';self.images=[];self.links=[];self.paragraphs=[];self.current_paragraph=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta':self.meta[a.get('name','')]=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='img':self.images.append(a)
  if tag=='a':self.links.append(a.get('href',''))
  if tag in {'h1','h2','title'}:self.active=tag
  if tag not in {'img','meta','link','br','hr','input','source'}:
   if self.depth:self.depth+=1
   elif 'data-commercial-copy' in a:self.depth=1
  if tag=='p' and self.depth:self.current_paragraph=[]
 def handle_endtag(self,tag):
  if tag=='p' and self.current_paragraph is not None:
   self.paragraphs.append(' '.join(self.current_paragraph));self.current_paragraph=None
  if tag==self.active:self.active=None
  if tag not in {'img','meta','link','br','hr','input','source'} and self.depth:self.depth-=1
 def handle_data(self,data):
  if self.depth:self.copy.append(data)
  if self.current_paragraph is not None:self.current_paragraph.append(data)
  if self.active:getattr(self,self.active).append(data)
p=argparse.ArgumentParser();p.add_argument('--dist',required=True);p.add_argument('--output',required=True);p.add_argument('--mode',choices=['draft','production'],default='draft');p.add_argument('--manifest',help='Optional source snapshot captured before the build; final full-corpus audit should omit it.');args=p.parse_args();root=Path(args.dist)
topics=json.loads(Path('src/data/commercial-expansion-topics.json').read_text())
for f in Path('src/data').glob('commercial-regional-*.json'):topics += json.loads(f.read_text())
names=[]
for f in ['cities-dfw-metro.json','cities-dfw-expanded.json']:names += [c['name'].lower() for c in json.loads((Path('src/data')/f).read_text())]
names=sorted(set(names)|{'texas','dfw','dallas–fort worth'},key=len,reverse=True)
def phrases(page):
 text=' '.join(page.copy).lower()
 for name in names:text=re.sub(r'\b'+re.escape(name)+r'\b',' location ',text)
 words=re.findall(r"[a-z]+(?:'[a-z]+)?",text)
 return [' '.join(words[i:i+5]) for i in range(max(0,len(words)-4))]
def business_address_errors(value):
 errors=[]
 if isinstance(value,dict):
  types=value.get('@type',[]);types=[types] if isinstance(types,str) else types
  if {'Organization','LocalBusiness'}.intersection(types) and value.get('name')=='Go Green Restoration TX Inc':
   address=value.get('address')
   if isinstance(address,dict) and (address.get('addressLocality')!='Wylie' or address.get('addressRegion')!='TX'):errors.append('unverified business office address')
  for nested in value.values():errors += business_address_errors(nested)
 elif isinstance(value,list):
  for nested in value:errors += business_address_errors(nested)
 return errors
rows=[];regional=[];sitemaps=''.join(f.read_text() for f in root.glob('sitemap*.xml'))
for topic in topics:
 folder=root/'commercial'/topic['slug'];pages={}
 for file in folder.rglob('index.html'):
  page=Page();page.feed(file.read_text())
  if not page.copy:continue # Existing audience city pages await preview-only editorial overrides.
  pages['/'+str(file.parent.relative_to(root))+'/']=(page,phrases(page))
 sets={path:frozenset(items[1]) for path,items in pages.items()}
 for path,(page,current) in pages.items():
  heading=''.join(page.h1);keyword=topic['name'].lower();is_city=path.count('/')==4
  comparison,overlap=max(((other,sum(s in sets[other] for s in current)/max(1,len(current))) for other,items in pages.items() if other!=path),key=lambda row:row[1],default=('',0))
  image=next((img for img in page.images if 'service-guides' in img.get('src','')),{});errors=[]
  for paragraph in page.paragraphs:
   sentences=len(re.findall(r'[.!?](?:\s|$)',paragraph))
   if not 1<=sentences<=4:errors.append('paragraph sentence count '+str(sentences))
  if not is_city:
   for child in pages:
    if child.count('/')==4 and child not in page.links:errors.append('missing regional-to-city link '+child)
  if re.search(r'\b(?:SEO|keyword(?:s)?|phrase uniqueness|editorial audit|city-topic|search ranking(?:s)?)\b',' '.join(page.copy),re.I):errors.append('internal editorial language in customer copy')
  if page.copy and re.search(r'\b(?:starts|begins) with (?:a |an )?(?:scoped inquiry|service request|client contact|conversation)\b',page.copy[0],re.I):errors.append('administration-led opening')
  if re.search(r'\bask (?:the provider|your contractor|the contractor|the proposal|whether the provider)\b',' '.join(page.copy),re.I):errors.append('customer-directed contractor instructions')
  if not ''.join(page.title).lower().startswith(heading.lower()+' '):errors.append('title keyword')
  if '| Request an Estimate | Go Green Restoration TX Inc' not in ''.join(page.title):errors.append('title CTA or brand')
  if heading.lower() not in page.meta.get('description','').lower():errors.append('description keyword')
  if keyword not in heading.lower():errors.append('H1 keyword')
  if not any(heading.lower() in text.lower() for text in page.h2):errors.append('H2 service/city keyword')
  if not ' '.join(page.copy).lower().startswith(heading.lower()):errors.append('intro keyword')
  if keyword not in image.get('alt','').lower():errors.append('image keyword')
  if not all(image.get(k) for k in ['src','srcset','sizes','width','height']):errors.append('responsive image')
  if not (root/image.get('src','').lstrip('/')).is_file():errors.append('image missing')
  for source in image.get('srcset','').split(','):
   asset=source.strip().split(' ')[0]
   if asset and not (root/asset.lstrip('/')).is_file():errors.append('responsive source missing '+asset)
  noindex='noindex' in page.meta.get('robots','')
  if (args.mode=='draft' and not noindex) or (args.mode=='production' and noindex):errors.append('robots')
  if page.canonical!='https://gogreenrestorationtx.com'+path:errors.append('canonical')
  in_sitemap='https://gogreenrestorationtx.com'+path in sitemaps
  if (args.mode=='draft' and in_sitemap) or (args.mode=='production' and not in_sitemap):errors.append('sitemap inclusion')
  for link in page.links:
   if link.startswith('/') and not link.startswith('//'):
    dest=link.split('#')[0].split('?')[0];file=root/dest.lstrip('/')
    if not file.is_file() and not (file/'index.html').is_file():errors.append('broken link '+link)
  raw=(root/path.lstrip('/')/'index.html').read_text()
  for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',raw,re.S):
   try:errors += business_address_errors(json.loads(block))
   except json.JSONDecodeError:errors.append('invalid JSON-LD')
  if (topic['parent']=='mold-remediation' or topic.get('requiresMoldDisclosure')) and not all(phrase in raw for phrase in ['license application is pending','appropriately licensed partner companies','Independent assessment']):errors.append('mold provider disclosure')
  unique=round(100*(1-overlap),2)
  row={'path':path,'unique_percent':unique,'closest_comparison':comparison,'passes_60_percent':unique>=60,'errors':errors}
  (rows if is_city else regional).append(row)
expected=[]
if args.manifest:expected=json.loads(Path(args.manifest).read_text())['paths']
else:
 for f in Path('src/data').glob('commercial-city-editorial*.json'):
  data=json.loads(f.read_text())
  expected += [f'/commercial/{topic}/{city}/' for topic,entries in data.items() for city in entries]
manifest_errors=[]
if len(expected)!=len(set(expected)):manifest_errors.append('Duplicate city-topic editorial owner')
missing=sorted(set(expected)-{r['path'] for r in rows})
if missing:manifest_errors.append({'missingRenderedDrafts':missing})
directory_errors=[];directory=root/'commercial-expansion-preview'/'index.html'
if args.mode=='draft':
 if not directory.is_file():directory_errors.append('Draft directory missing')
 else:
  directory_page=Page();directory_page.feed(directory.read_text())
  if 'noindex' not in directory_page.meta.get('robots',''):directory_errors.append('Draft directory robots')
  if 'https://gogreenrestorationtx.com/commercial-expansion-preview/' in sitemaps:directory_errors.append('Draft directory sitemap inclusion')
  absent=[row['path'] for row in rows if row['path'] not in directory_page.links]
  if absent:directory_errors.append({'missingCityLinks':absent})
elif directory.exists():directory_errors.append('Draft directory present in production')
report={'mode':args.mode,'directoryErrors':directory_errors,'manifestSnapshot':args.manifest,'expectedCityPages':len(expected),'manifestErrors':manifest_errors,'method':'Normalized rendered substantive body five-word phrase coverage against same-topic sibling cities and regional owner; excludes shared template navigation, CTA and footer provider disclosure; in-body scope remains counted. Not semantic originality or a search engine metric.','cityPages':len(rows),'phrasePassed':sum(r['passes_60_percent'] for r in rows),'technicalPassed':sum(not r['errors'] for r in rows+regional),'pages':rows,'regionalOwners':regional}
Path(args.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in {'pages','regionalOwners'}}));print(json.dumps([r for r in rows+regional if r['errors'] or not r['passes_60_percent']],indent=2))
if manifest_errors or directory_errors or any(r['errors'] for r in rows+regional) or any(not r['passes_60_percent'] for r in rows):raise SystemExit(1)
