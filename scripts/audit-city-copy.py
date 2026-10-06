"""Measure local draft copy reuse; city names and phone numbers cannot inflate uniqueness.

Directional five-word phrase coverage is a reproducible editorial proxy, not a
Google score or a guarantee of semantic originality. Compare each city page to
all sibling cities and its regional topic. Exclude navigation/CTA/legal disclosure
using explicit data-uniqueness markers. Report failures; never rewrite or publish.
"""
import argparse,json,re
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict
class Copy(HTMLParser):
 def __init__(self):super().__init__();self.depth=0;self.parts=[]
 def handle_starttag(self,tag,attrs):
  if tag in {'img','br','hr','input','source','meta','link'}:return
  if self.depth:self.depth+=1
  elif 'data-uniqueness' in dict(attrs):self.depth=1
 def handle_endtag(self,tag):
  if tag not in {'img','br','hr','input','source','meta','link'} and self.depth:self.depth-=1
 def handle_data(self,data):
  if self.depth:self.parts.append(data)
parser=argparse.ArgumentParser();parser.add_argument('--dist',default='dist');parser.add_argument('--output',required=True);parser.add_argument('--require-pass',action='store_true');args=parser.parse_args()
cities=json.loads(Path('src/data/cities-dfw-metro.json').read_text());existing={c['slug'] for c in cities};cities += [c for c in json.loads(Path('src/data/cities-dfw-expanded.json').read_text()) if c['slug'] not in existing];topics=json.loads(Path('src/data/compact-services.json').read_text());rows=[]
names=sorted({c['name'].lower() for c in cities}|{'dallas–fort worth','dallas-fort worth','texas','dfw'},key=len,reverse=True)
def words(path):
 p=Copy();p.feed(path.read_text());text=' '.join(p.parts).lower()
 for name in names:text=re.sub(r'\b'+re.escape(name)+r'\b',' location ',text)
 text=re.sub(r'\+?[\d ()-]{7,}',' contact ',text)
 return re.findall(r"[a-z]+(?:'[a-z]+)?",text)
def shingles(tokens):return [' '.join(tokens[i:i+5]) for i in range(max(0,len(tokens)-4))]
for topic in topics:
 entries={c['slug']:shingles(words(Path(args.dist)/topic['slug']/c['slug']/'index.html')) for c in cities}
 entries['regional']=shingles(words(Path(args.dist)/'services'/topic['slug']/'index.html'))
 sets={key:frozenset(value) for key,value in entries.items()}
 groups=defaultdict(list)
 for key,value in sets.items():groups[value].append(key)
 for city in cities:
  current=entries[city['slug']]
  identical=[key for key in groups[sets[city['slug']]] if key!=city['slug']]
  if identical: nearest,overlap=identical[0],1.0
  else: nearest,overlap=max(((keys[0],sum(s in other for s in current)/max(1,len(current))) for other,keys in groups.items() if city['slug'] not in keys),key=lambda v:v[1])
  unique=round(100*(1-overlap),2)
  rows.append({'path':f"/{topic['slug']}/{city['slug']}/",'city':city['name'],'service':topic['name'],'unique_percent':unique,'closest_comparison':nearest,'passes_60_percent':unique>=60})
report={'method':'100 minus maximum directional five-word phrase coverage against same-service city siblings and regional topic; normalize city names; exclude navigation, CTA and provider disclosure. Not semantic originality or a Google metric.','threshold':60,'total':len(rows),'passed':sum(r['passes_60_percent'] for r in rows),'pages':rows}
Path(args.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='pages'},indent=2))
if args.require_pass and report['passed']!=report['total']:raise SystemExit(1)
