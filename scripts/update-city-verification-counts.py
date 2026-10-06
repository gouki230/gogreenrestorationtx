#!/usr/bin/env python3
"""Refresh progress from intersecting rendered reports; never treat source as verified."""
import collections
import datetime
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
docs = root / 'docs/seo'
def read(name):
    return json.loads((docs / f'{name}.json').read_text())

progress = read('city-expansion-progress')
compact = read('city-copy-review')
core = read('city-core-copy-review')
core_technical_report = read('city-core-verification')
core_error_routes = {e.get('route') for e in core_technical_report.get('errors', []) if isinstance(e, dict)}
technical = {p['route'] for p in core_technical_report['pages'] if all(p['checks'].values()) and p['route'] not in core_error_routes}
isolated = {p['path'] for p in read('city-core-production-isolation')['pages'] if all(p['checks'].values())}
editorial_holds = set(progress.get('editorialHoldPaths', []))
core_pass = [p for p in core['pages'] if p['phrasePass'] and p['path'] in technical & isolated and p['path'] not in editorial_holds]
compact_technical = {p['path'] for p in read('compact-city-technical-review')['pages'] if all(p['checks'].values())}
compact_pass = [p for p in compact['pages'] if p['passes_60_percent'] and p['path'] in compact_technical and p['path'] not in editorial_holds]
by_city = collections.Counter(p['path'].strip('/').split('/')[-1] for p in compact_pass)
hubs = {p['city'] for p in core_pass if p['group'] == 'hub'}
main = collections.Counter(p['city'] for p in core_pass if p['group'] != 'hub')
for city in progress['cities']:
    slug = city['slug']
    city.update(compactPassed=by_city[slug], hub='reviewed_draft' if slug in hubs else 'needs_editorial_review', mainServices='five_reviewed_drafts' if main[slug] == 5 else 'needs_editorial_review')
def authored(pattern):
    records = {}
    for path in (root / 'src/data').glob(pattern):
        records.update(json.loads(path.read_text()))
    return len(records)
progress.update(updatedUTC=datetime.datetime.now(datetime.timezone.utc).isoformat(), verifiedCompactPassed=len(compact_pass), verifiedCompactRemaining=4944-len(compact_pass), verifiedCityHubs=len(hubs), verifiedMainServiceCityPages=sum(main.values()), remainingCityHubs=206-len(hubs), remainingMainServiceCityPages=1030-sum(main.values()))
progress['coreEditorial'].update(authored=authored('city-core-editorial-*.json'), hubPhrasePassed=len(hubs), mainServicePhrasePassed=sum(main.values()), remainingEditorial=1236-len(core_pass), verifiedDrafts=len(core_pass))
compact_authored = authored('compact-city-editorial*.json')
progress['compactEditorial'].update(authored=compact_authored, verifiedDrafts=len(compact_pass), authoredPendingVerification=compact_authored-len(compact_pass))
(docs/'city-expansion-progress.json').write_text(json.dumps(progress, indent=2)+'\n')
(root/'src/data/city-copy-review-summary.json').write_text(json.dumps({'scores':{p['path']:p['unique_percent'] for p in compact['pages']}},separators=(',',':'))+'\n')
print(json.dumps({'compact':len(compact_pass),'hubs':len(hubs),'main':sum(main.values()),'coreAuthored':progress['coreEditorial']['authored'],'compactAuthored':compact_authored}))
