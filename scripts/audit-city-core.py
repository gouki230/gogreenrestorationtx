"""Audit hub/main-service draft copy independently of compact topic pages.

Unmarked legacy pages stay unreviewed, but their main text is still compared
against authored drafts. Phrase scores never replace editorial usefulness review.
"""
import argparse
import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

class Body(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth=0; self.main=0; self.marked=[]; self.all=[]
    def handle_starttag(self, tag, attrs):
        if tag in {'img','br','hr','input','source','meta','link'}: return
        if self.main: self.main+=1
        elif tag=='main': self.main=1
        if self.depth: self.depth+=1
        elif 'data-uniqueness' in dict(attrs): self.depth=1
    def handle_endtag(self,tag):
        if tag in {'img','br','hr','input','source','meta','link'}: return
        if self.depth: self.depth-=1
        if self.main: self.main-=1
    def handle_data(self,data):
        if self.main: self.all.append(data)
        if self.depth: self.marked.append(data)

parser=argparse.ArgumentParser();parser.add_argument('--dist',required=True);parser.add_argument('--output',required=True);args=parser.parse_args()
cities=json.loads(Path('src/data/cities-dfw-metro.json').read_text())+json.loads(Path('src/data/cities-dfw-expanded.json').read_text())
cities=list({c['slug']:c for c in cities}.values())
services=json.loads(Path('src/data/services.json').read_text())
names=sorted({c['name'].lower() for c in cities}|{'texas','dfw','dallas–fort worth','dallas-fort worth'},key=len,reverse=True)
def phrases(text):
    text=text.lower()
    for name in names: text=re.sub(r'\b'+re.escape(name)+r'\b',' location ',text)
    text=re.sub(r'\+?[\d ()-]{7,}',' contact ',text)
    tokens=re.findall(r"[a-z]+(?:'[a-z]+)?",text)
    return [' '.join(tokens[i:i+5]) for i in range(max(0,len(tokens)-4))]
rows=[]
for group in ['hub']+[s['slug'] for s in services]:
    entries={}
    for city in cities:
        path=f"/locations/dfw-metro/{city['slug']}/" if group=='hub' else f"/{group}/{city['slug']}/"
        file=Path(args.dist)/path.strip('/')/'index.html'
        body=Body();body.feed(file.read_text())
        entries[city['slug']]={'path':path,'marked':bool(body.marked),'phrases':phrases(' '.join(body.marked or body.all))}
    if group != 'hub':
        regional=Path(args.dist)/'services'/group/'index.html'
        body=Body();body.feed(regional.read_text())
        entries['regional']={'path':f'/services/{group}/','marked':False,'phrases':phrases(' '.join(body.marked or body.all))}
    sets={key:set(value['phrases']) for key,value in entries.items()}
    for slug,value in entries.items():
        if slug == 'regional': continue
        if value['marked'] and value['phrases']:
            nearest,overlap=max(((key,sum(s in other for s in value['phrases'])/len(value['phrases'])) for key,other in sets.items() if key!=slug),key=lambda row:row[1])
            score=round(100*(1-overlap),2)
        else: nearest,score=None,None
        rows.append({'path':value['path'],'city':slug,'group':group,'markedCopy':value['marked'],'uniquePercent':score,'closestComparison':nearest,'phrasePass':score is not None and score>=60,'editorialStatus':'requires_separate_review'})
report={'method':'Normalized directional five-word phrase coverage against sibling cities. Unmarked legacy content remains unreviewed and supplies comparisons only.','total':len(rows),'phrasePassed':sum(r['phrasePass'] for r in rows),'pages':rows}
Path(args.output).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='pages'},indent=2))
