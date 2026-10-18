"""Check actual rendered disclosure boundaries using the production audit extractor."""
import json
from pathlib import Path
from html.parser import HTMLParser

# Load only the extractor definition; the audit CLI is intentionally not invoked.
namespace = {}
source = Path('scripts/audit-city-copy.py').read_text()
exec(source.split('parser=argparse.ArgumentParser()')[0], namespace)
Copy = namespace['Copy']
known = json.loads(Path('src/data/compact-audit-disclosures.json').read_text())
normalize = lambda text: ' '.join(text.split())
checked = excluded = 0
for city in ['lucas', 'lowry-crossing', 'maypearl', 'mclendon-chisholm', 'melissa', 'midlothian', 'milford', 'mabank', 'lancaster']:
    records = json.loads(Path(f'src/data/compact-city-editorial-{city}.json').read_text())
    for route, record in records.items():
        html = (Path('.astro/resume-verification') / route / 'index.html').read_text()
        parser = Copy(); parser.feed(html)
        extracted = normalize(' '.join(parser.parts))
        class Visible(HTMLParser):
            def __init__(self): super().__init__(); self.parts = []
            def handle_data(self, text): self.parts.append(text)
        visible = Visible(); visible.feed(html)
        rendered = normalize(' '.join(visible.parts))
        for section in record['sections']:
            text = normalize(section['text'])
            assert text in rendered, (route, 'disclosure/content disappeared')
            if section in known:
                assert text not in extracted, (route, 'disclosure counted')
                excluded += 1
            else:
                assert text in extracted, (route, 'substantive section lost')
        assert normalize(record['intro']) in extracted
        assert normalize(record['estimate']) in extracted
        assert all(normalize(item) in extracted for item in record['checklist'])
        assert 'send the address or ZIP code' in extracted
        assert 'Discuss your property with our team' not in extracted
        checked += 1
# Verify void elements/nested inline links do not swallow adjacent marked sections.
p = Copy(); p.feed('<section data-uniqueness>alpha <a href="/">beta</a><img src="x"> gamma</section><p>excluded disclosure</p><section data-uniqueness>delta</section>')
assert normalize(' '.join(p.parts)) == 'alpha beta gamma delta'
assert excluded >= 63, excluded
print(json.dumps({'renderedPagesChecked': checked, 'visibleDisclosureBlocksExcluded': excluded, 'adjacentSubstantiveCopyPreserved': True}))
