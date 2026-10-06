"""Record a manually reviewed batch only after the rendered audit passes."""
import argparse,json
from pathlib import Path
from datetime import datetime,timezone
from zoneinfo import ZoneInfo
p=argparse.ArgumentParser();p.add_argument('--batch',required=True);p.add_argument('--started',required=True);p.add_argument('--review',required=True);p.add_argument('--next',required=True);args=p.parse_args()
ledger_path=Path('docs/seo/commercial-city-expansion-progress.json');ledger=json.loads(ledger_path.read_text());audit=json.loads(Path('docs/seo/commercial-copy-review.json').read_text());copies=json.loads(Path(args.batch).read_text());rows={r['path']:r for r in audit['pages']};paths=[f'/commercial/{topic}/{city}/' for topic,entries in copies.items() for city in entries]
assert all(path in rows and rows[path]['passes_60_percent'] and not rows[path]['errors'] for path in paths),'Batch audit incomplete or failed'
assert not audit.get('manifestErrors'), 'Editorial manifest regression'
assert not audit.get('directoryErrors'), 'Review directory regression'
assert audit.get('mode', 'draft') == 'draft', 'Batch recording requires a draft audit'
assert not any(r['errors'] for r in audit['pages']+audit['regionalOwners']),'Technical regression'
assert all(r['passes_60_percent'] for r in audit['pages']),'Copy regression'
production=Path('.astro/commercial-production-check')
for path in rows:
 file=production/path.lstrip('/')/'index.html'
 assert not file.exists() or 'data-commercial-copy' not in file.read_text(),'Draft leaked to ordinary build'
now=datetime.now(timezone.utc);start=datetime.fromisoformat(args.started.replace('Z','+00:00'));elapsed=round((now-start).total_seconds(),1)
previous=set(ledger.get('completedCityRoutes',[]));completed=previous|set(paths);assert all(path in rows and not rows[path]['errors'] and rows[path]['passes_60_percent'] for path in completed)
record={'batchFile':args.batch,'startedAt':args.started,'verifiedAt':now.isoformat(),'elapsedSeconds':elapsed,'verifiedPages':len(paths),'newlyVerifiedPages':len(set(paths)-previous),'phraseRange':[min(rows[path]['unique_percent'] for path in paths),max(rows[path]['unique_percent'] for path in paths)],'editorialReview':args.review,'evidence':{'audit':'docs/seo/commercial-copy-review.json','previewBuildLog':'.astro/commercial-build.log','productionBuildLog':'.astro/commercial-production-build.log'}}
if audit.get('manifestSnapshot'):
 snapshot=json.loads(Path(audit['manifestSnapshot']).read_text())
 record['sourceSnapshot']={'capturedAt':snapshot.get('capturedAt'),'expectedCityPages':len(snapshot['paths']),'sourceFiles':snapshot.get('sourceFiles',{})}
ledger.setdefault('batchHistory',[]).append(record);ledger.update({'updated':now.astimezone(ZoneInfo('America/Chicago')).date().isoformat(),'status':'in_progress','verifiedComplete':len(completed),'remainingCityTopicTargets':ledger['scope']['cityTopicTargets']-len(completed),'completedCityRoutes':sorted(completed),'lastBatch':record,'nextAction':args.next})
ledger['preview']['normalBuild']=f"New commercial content drafts and directory remain absent; existing PM/HOA routes preserved. {len(completed)} city topics verified so far."
history=ledger['batchHistory'];measured_pages=sum(batch['newlyVerifiedPages'] for batch in history)
ledger.setdefault('throughputEvidence',{}).update({'measuredBatches':len(history),'verifiedPages':measured_pages,'latestBatchPages':len(paths),'latestBatchSeconds':elapsed,'latestCadencePagesPerMinute':round(60*len(paths)/max(1,elapsed),2),'measurementNote':f'Timed batches cover {measured_pages} of {len(completed)} verified city drafts; the initial 20 preceded this timing series.'})
ledger_path.write_text(json.dumps(ledger,indent=2)+'\n')
p=Path('docs/seo/commercial-expansion-url-inventory.json');inventory=json.loads(p.read_text());inventory['verifiedReviewDrafts']=len(completed)
for target in inventory['targets']:
 target['status']='verified_review_draft' if target['path'] in completed else 'pending_editorial_and_verification'
p.write_text(json.dumps(inventory,indent=2)+'\n');print(json.dumps({'totalVerified':len(completed),'batchVerified':len(paths),'remaining':ledger['remainingCityTopicTargets'],'elapsedSeconds':elapsed}))
