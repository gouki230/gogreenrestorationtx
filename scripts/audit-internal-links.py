"""Audit rendered editorial links, excluding repeated header/footer navigation."""
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import argparse

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.in_main=False; self.links=set()
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='main': self.in_main=True
        if tag=='a' and self.in_main:
            url=urlsplit(attrs.get('href',''))
            if not url.scheme and url.path.startswith('/'):
                self.links.add(url.path)
    def handle_endtag(self, tag):
        if tag=='main': self.in_main=False

parser=argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args=parser.parse_args()
cities=json.loads(Path('src/data/cities-dfw-metro.json').read_text())
services=json.loads(Path('src/data/services.json').read_text())
articles=json.loads(Path('src/data/blog-articles.json').read_text())
graph={}
for file in Path('dist').rglob('index.html'):
    route='/' + str(file.parent.relative_to('dist')).strip('.')
    route=route.rstrip('/')+'/'
    page=Page();page.feed(file.read_text());graph[route]=page.links
incoming=Counter(target for links in graph.values() for target in links)
checks=[]
for city in cities:
    hub=f"/locations/dfw-metro/{city['slug']}/"
    for service in services:
        local=f"/{service['slug']}/{city['slug']}/"
        pillar=f"/services/{service['slug']}/"
        guides=[f"/resources/{a['cluster']}/{a['slug']}/" for a in articles if a['cluster']==service['relatedResources'][0] and a['slug'].endswith('-'+city['slug'])]
        checks.append({'city':city['slug'],'service':service['slug'],
            'city_to_service':local in graph.get(hub,set()),
            'pillar_to_service':local in graph.get(pillar,set()),
            'service_to_city':hub in graph.get(local,set()),
            'service_to_pillar':pillar in graph.get(local,set()),
            'local_guides':len(guides),
            'service_to_guides':sum(g in graph.get(local,set()) for g in guides),
            'guides_to_service':sum(local in graph.get(g,set()) for g in guides),
            'guides_to_city':sum(hub in graph.get(g,set()) for g in guides),
            'city_to_guides':sum(g in graph.get(hub,set()) for g in guides),
            'editorial_incoming_links':incoming[local]})
broken=[]
for source,links in graph.items():
    for target in links:
        if not target.startswith('//'):
            file=Path('dist')/target.lstrip('/')
            if not file.is_file() and not (file/'index.html').is_file():broken.append({'source':source,'target':target})
report={'pages':len(graph),'city_service_pairs':len(checks),'summary':{key:sum(r[key] for r in checks) for key in ['city_to_service','pillar_to_service','service_to_city','service_to_pillar','local_guides','service_to_guides','guides_to_service','guides_to_city','city_to_guides']},'pillar_to_blog_links':{s['slug']:sum(x.startswith('/resources/') and x.count('/')==4 for x in graph.get('/services/'+s['slug']+'/',set())) for s in services},'orphan_pages_excluding_home':[p for p in graph if p!='/' and not incoming[p]],'broken_links':broken,'details':checks}
Path(args.output).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['details','broken_links','orphan_pages_excluding_home']},indent=2))
print('Broken editorial links:',len(broken))
