"""Verify technical/keyword gates for rendered compact pages that passed phrase review."""
import argparse,json,re
from pathlib import Path
from html.parser import HTMLParser
class Page(HTMLParser):
 def __init__(self):super().__init__();self.fields={'title':[],'h1':[],'h2':[],'intro':[]};self.capture=None;self.meta='';self.canonical='';self.robots='';self.image=None;self.h1Count=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['title','h1','h2']:self.capture=tag
  if tag=='h1':self.h1Count+=1
  if tag=='p' and 'data-uniqueness' in a and not self.fields['intro']:self.capture='intro'
  if tag=='meta' and a.get('name')=='description':self.meta=a.get('content','')
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='img' and self.image is None and 'service-guides/' in a.get('src',''):self.image=a
 def handle_endtag(self,tag):
  if tag in ['title','h1','h2','p']:self.capture=None
 def handle_data(self,text):
  if self.capture:self.fields[self.capture].append(text)
def norm(text):return ' '.join(text.lower().split())
p=argparse.ArgumentParser();p.add_argument('--mode',choices=['draft','production'],default='draft');p.add_argument('--dist',required=True);p.add_argument('--review',required=True);p.add_argument('--output',required=True);a=p.parse_args();root=Path(a.dist);review=json.loads(Path(a.review).read_text());sitemap=''.join(f.read_text() for f in root.glob('sitemap*.xml'));rows=[];errors=[]
for row in review['pages']:
 if not row['passes_60_percent']:continue
 route=row['path'];page=Page();page.feed((root/route.strip('/')/'index.html').read_text());fields={k:norm(' '.join(v)) for k,v in page.fields.items()};keyword=norm(row['service']);img=page.image or {}
 checks={'titleKeywordFirst':fields['title'].startswith(keyword),'metaKeyword':keyword in norm(page.meta),'singleH1':page.h1Count==1,'h1Keyword':keyword in fields['h1'],'h2Keyword':keyword in fields['h2'],'introKeywordFirst':fields['intro'].startswith(keyword),'imageAltKeyword':keyword in norm(img.get('alt','')),'imageFile':bool(img) and (root/img.get('src','').lstrip('/')).is_file(),'responsiveImage':bool(img.get('srcset')) and bool(img.get('width')) and bool(img.get('height')),'canonical':page.canonical=='https://gogreenrestorationtx.com'+route,'robots':('noindex' in page.robots)==(a.mode=='draft'),'sitemapInclusion':(('https://gogreenrestorationtx.com'+route+'<') in sitemap)==(a.mode=='production')}
 rows.append({'path':route,'checks':checks})
 for key,passed in checks.items():
  if not passed:errors.append({'path':route,'failed':key})
Path(a.output).write_text(json.dumps({'pages':rows,'errors':errors},indent=2)+'\n');print(json.dumps({'verifiedPages':len(rows),'errors':errors}));raise SystemExit(bool(errors))
