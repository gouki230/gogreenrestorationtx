export const meta = {
  name: 'dfw-blog-fullrun',
  description: 'Generate DFW blog articles for 29 cities (5 services x 5 rotated angles = 725)',
  phases: [{ title: 'Generate articles', detail: 'per-city writer agents, rotated angles across 5 services' }],
}

// 29 non-Dallas DFW cities injected by the generator script.
const CITIES = __CITIES__;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'description', 'content'],
  properties: {
    title: { type: 'string', description: 'Compelling title that includes the city name. No surrounding quotes.' },
    description: { type: 'string', description: '150-160 character SEO meta description.' },
    content: { type: 'string', description: 'Markdown body, 700-900 words, 3-5 ## subheadings, short paragraphs, no H1/title line.' },
  },
}

const MOLD = `
EXTRA MOLD COMPLIANCE (CRITICAL): In Texas, mold remediation is regulated by TDLR. Go Green Restoration is NOT a licensed mold remediation company and must NOT be portrayed as one. We may legally clean up mold affecting LESS THAN 25 contiguous square feet (the TDLR exemption). Scope ALL of our mold work in this article to small-area cleanup under 25 contiguous square feet; emphasize EPA Lead-Safe certified methods and moisture control; and clearly state that larger or widespread mold requires a TDLR-licensed mold remediation contractor, whom we gladly refer. Never claim to "remove all mold", do "full remediation", or handle large/commercial mold.`

const SERVICES = [
  { cluster: 'water-damage', clusterName: 'Water Damage', label: 'water damage restoration', mold: false, pool: [
    { key: 'water-damage-emergency-first-24-hours', brief: 'The first 24 hours after discovering water damage or a burst pipe: shut off water, safety, what to document/move, why speed matters (mold in 24-48h), and what our crew does on arrival.' },
    { key: 'water-damage-storm-and-hail-flooding', brief: 'Storm- and hail-driven water intrusion from North Texas spring storms: roof leaks, wind-driven rain, flash flooding, immediate steps, and how it differs from a clean-water leak.' },
    { key: 'hidden-water-damage-warning-signs', brief: 'Subtle early signs of hidden water damage: stains, musty smell, warped/cupping floors, high water bills, where leaks hide (slab, behind walls), when to call a pro.' },
    { key: 'water-damage-insurance-claims-guide', brief: 'Navigating a water-damage claim: documenting the loss, sudden-and-accidental vs gradual exclusions, working with the adjuster, how we assist with claim documentation.' },
    { key: 'structural-drying-and-mold-prevention', brief: 'After extraction: professional structural drying, dehumidification, moisture monitoring, antimicrobial treatment, and how proper drying prevents secondary mold in humid North Texas.' },
    { key: 'frozen-and-burst-pipes-winter', brief: 'Winter freeze pipe bursts in North Texas: why uninsulated pipes fail during cold snaps, prevention (drip, insulate, disconnect hoses), what to do the moment a frozen pipe bursts.' },
    { key: 'slab-leaks-and-foundation-water-damage', brief: 'Slab leaks under concrete foundations (common on Texas slab homes): warning signs (warm spots, high bills, cracking), detection, and the water-damage cleanup that follows a slab leak.' },
    { key: 'roof-and-ceiling-leak-water-damage', brief: 'Roof and ceiling leaks: brown rings, sagging drywall, attic moisture, the path water takes from roof to ceiling, and why the visible stain understates the real damage.' },
    { key: 'appliance-and-water-heater-leaks', brief: 'Water damage from failed appliances and water heaters: washing machines, dishwashers, supply lines, and aging water heaters; prevention and rapid cleanup.' },
    { key: 'categories-of-water-damage-explained', brief: 'Clean vs gray vs black water (Category 1/2/3): what each means for safety and what can be saved vs must be removed, and why category drives the whole restoration approach.' },
    { key: 'saving-floors-after-water-damage', brief: 'Saving floors after water damage: hardwood cupping/crowning, laminate swelling, carpet and pad, subfloor saturation, and when flooring can be dried in place vs replaced.' },
  ]},
  { cluster: 'fire-damage', clusterName: 'Fire & Smoke Damage', label: 'fire and smoke damage restoration', mold: false, pool: [
    { key: 'first-steps-after-a-house-fire', brief: 'What to do in the hours and days after a house fire: safety, securing the property, contacting insurance, not re-entering too soon, and the restoration timeline overview.' },
    { key: 'smoke-soot-and-odor-removal', brief: 'Why smoke and soot keep damaging a home after the fire is out, types of soot, professional odor removal (thermal fogging, ozone, hydroxyl, HVAC cleaning), why DIY rarely fully works.' },
    { key: 'kitchen-and-electrical-fire-recovery', brief: 'Common causes of residential kitchen and electrical fires, prevention tips, and what cleanup/recovery looks like for the most common small-to-moderate house fires.' },
    { key: 'fire-damage-insurance-claims', brief: 'Fire insurance claims: contents inventory, additional living expenses, documentation, working with the adjuster, and how we support the claim.' },
    { key: 'structural-rebuild-after-fire', brief: 'The reconstruction phase after fire: assessment, debris removal, structural repairs, rebuilding to code, and a single-source restoration-to-rebuild process.' },
    { key: 'emergency-board-up-and-securing', brief: 'Emergency board-up and roof tarping after a fire: why securing the property immediately matters (weather, theft, liability, insurance requirements) and how it is done.' },
    { key: 'content-cleaning-and-pack-out', brief: 'Salvaging belongings after a fire: contents cleaning, deodorizing, pack-out/storage, what is typically restorable vs a total loss, and inventory for insurance.' },
    { key: 'water-damage-from-firefighting', brief: 'The secondary water damage left behind by firefighting: soaked structures and contents, why fast extraction/drying is needed on top of fire cleanup, and the combined restoration.' },
    { key: 'fireplace-and-chimney-fire-safety', brief: 'Fireplace and chimney fires: creosote buildup, warning signs, prevention/maintenance, and the smoke and structural cleanup after a chimney fire.' },
    { key: 'grass-and-brush-fire-smoke-damage', brief: 'Grass/brush fire and drought-season smoke exposure in North Texas: smoke and ash infiltration into homes near open land, air quality, and exterior/interior cleanup.' },
    { key: 'preventing-house-fires-checklist', brief: 'A practical home fire-prevention checklist: smoke detectors, kitchen/electrical safety, space heaters, dryer vents, and an escape plan; what to do if prevention fails.' },
  ]},
  { cluster: 'mold', clusterName: 'Mold', label: 'small-area mold cleanup', mold: true, pool: [
    { key: 'spotting-small-mold-problems-early', brief: 'Spotting small mold problems early (musty odor, bathroom/kitchen discoloration, around windows, under sinks) and why catching it small keeps it within the under-25-sq-ft cleanup range.' },
    { key: 'understanding-the-25-square-foot-mold-rule', brief: 'Plain-English explanation of the Texas TDLR 25-contiguous-square-foot threshold: what small-area cleanup we can do, what requires a TDLR-licensed remediator, and how to tell which you have.' },
    { key: 'controlling-humidity-and-moisture', brief: 'Controlling indoor humidity/moisture in hot, humid North Texas homes to prevent mold: HVAC, ventilation, dehumidifiers, attic/crawlspace issues, addressing moisture sources.' },
    { key: 'preventing-mold-after-a-water-leak', brief: 'Preventing mold after a small water leak: dry within 24-48h, find the moisture source, when surface cleanup is enough vs when growth has spread beyond the small-area threshold.' },
    { key: 'mold-indoor-air-quality-and-health', brief: 'Mold and indoor air quality/health: who is vulnerable, common symptoms, how EPA Lead-Safe certified small-area cleanup and air filtration help, when air-quality testing makes sense.' },
    { key: 'bathroom-and-shower-mold-cleanup', brief: 'Small bathroom and shower mold: grout, caulk, ceilings, exhaust-fan issues; safe small-area cleanup under the exemption and the ventilation fixes that prevent its return.' },
    { key: 'attic-and-crawlspace-mold-basics', brief: 'Attic and crawlspace mold in humid North Texas: causes (poor ventilation, roof leaks, humidity). Be clear these areas often EXCEED 25 sq ft and then require a TDLR-licensed remediator; frame our role as small-area cleanup plus referral.' },
    { key: 'mold-vs-mildew-difference', brief: 'Mold vs mildew: how to tell them apart, which is a surface nuisance vs a deeper problem, and when a small cleanup suffices vs when to escalate to a licensed remediator.' },
    { key: 'black-mold-myths-and-facts', brief: 'Responsible, non-alarmist facts about so-called black mold (Stachybotrys): what is known, what is exaggerated, and why size/scope (not color) determines whether it needs a TDLR-licensed remediator.' },
    { key: 'hvac-and-air-vent-mold', brief: 'Surface mold around HVAC vents and registers: causes (condensation, humidity), small-area surface cleanup we can do, and when system contamination calls for licensed/specialized help.' },
    { key: 'when-to-test-for-mold', brief: 'When mold testing makes sense: the role of an independent mold assessor, air vs surface sampling, and how testing guides whether a job is small-area cleanup or licensed remediation.' },
  ]},
  { cluster: 'sewage-plumbing', clusterName: 'Sewage & Plumbing', label: 'sewage backup cleanup', mold: false, pool: [
    { key: 'what-to-do-during-a-sewage-backup', brief: 'Immediate steps and safety during a sewage backup: evacuate the area, avoid contact, shut off water if safe, why sewage is a biohazard, and why professional cleanup with PPE is essential.' },
    { key: 'common-causes-of-sewer-backups', brief: 'Common causes of sewer backups: tree-root intrusion, aging clay/cast-iron pipes in older neighborhoods, heavy rain overwhelming systems, grease buildup.' },
    { key: 'sewage-cleanup-health-hazards-and-sanitization', brief: 'Health hazards of sewage (bacteria, viruses, parasites), why porous contaminated materials must be removed, and the professional sanitization process with EPA-registered products.' },
    { key: 'sewage-backup-insurance-coverage', brief: 'Insurance for sewage backups: why a sewer/water backup endorsement matters, what standard policies exclude, documentation, and how we assist with the claim.' },
    { key: 'preventing-sewage-backups', brief: 'Preventing sewage backups: backwater valves, line inspections/cleaning, proper grease/wipe disposal, root management, and what older homes especially should watch.' },
    { key: 'toilet-overflow-cleanup', brief: 'Toilet overflow cleanup: clean vs contaminated overflow, immediate containment, when it is a simple mop-up vs a biohazard job, and proper sanitization of affected materials.' },
    { key: 'basement-and-floor-drain-backups', brief: 'Floor-drain and low-level backups during heavy rain: why the lowest fixtures back up first, safety, extraction, and drying/sanitizing the affected lower level.' },
    { key: 'tree-roots-in-sewer-lines', brief: 'Tree roots invading sewer lines (very common in older DFW neighborhoods with mature trees): warning signs, why it recurs, cleanup after a root-caused backup, and prevention.' },
    { key: 'sump-pump-failure-and-flooding', brief: 'Sump pump failure and resulting flooding: why pumps fail (power loss, stuck float, age), the water damage that follows, and backup/maintenance to prevent it.' },
    { key: 'grease-and-clog-prevention', brief: 'Preventing drain clogs and grease blockages that lead to backups: kitchen habits, what never to flush, enzyme vs chemical cleaners, and routine maintenance.' },
    { key: 'why-sewage-cleanup-is-not-diy', brief: 'Why sewage cleanup is not a DIY job: biohazard exposure, hidden contamination in porous materials, proper PPE/disposal, and the cost of getting it wrong vs professional remediation.' },
  ]},
  { cluster: 'home-restoration', clusterName: 'Home Restoration', label: 'restoration construction and remodeling', mold: false, pool: [
    { key: 'reconstruction-after-major-damage', brief: 'What to expect during reconstruction after major water/fire/storm damage: assessment, scope, structural repairs, finishing, and the value of one restoration-to-rebuild provider.' },
    { key: 'choosing-a-restoration-contractor-in-texas', brief: 'How to choose a restoration contractor in Texas given there is NO statewide GC license: verify bonding/insurance, IICRC/EPA Lead-Safe certs, local references, written estimates, and red flags (storm chasers, full payment upfront). Be Texas-accurate about licensing.' },
    { key: 'remodeling-during-restoration', brief: 'Upgrading/remodeling while rebuilding after a loss: what insurance covers vs out-of-pocket upgrades, smart improvements to bundle in, coordinating design with restoration.' },
    { key: 'permits-and-code-compliance', brief: 'Building permits and code compliance for restoration/reconstruction: when permits are required, inspections, bringing older homes up to current code, and how the contractor handles it.' },
    { key: 'rebuild-timeline-and-cost', brief: 'What drives the timeline and cost of a post-disaster rebuild: scope, materials, permits, insurance approvals; realistic ranges for minor vs major reconstruction and avoiding delays.' },
    { key: 'working-with-insurance-on-your-rebuild', brief: 'Working with your insurer on the rebuild: scope of loss vs scope of repair, supplements, depreciation/recoverable depreciation, and how a restoration contractor advocates for a complete repair.' },
    { key: 'matching-materials-and-finishes', brief: 'Matching materials and finishes after partial damage: flooring, cabinets, paint, and trim; when partial repair blends in vs when a larger area must be replaced for a seamless result.' },
    { key: 'storm-damage-roof-and-exterior-repair', brief: 'Roof and exterior repair after North Texas hail/wind storms: assessment, temporary protection, working with the roof/exterior scope on a storm claim, and full exterior restoration.' },
    { key: 'drywall-and-flooring-replacement', brief: 'Drywall and flooring replacement after water/fire damage: when materials are salvageable vs must be cut out, mold-resistant materials, and the finishing process back to pre-loss condition.' },
    { key: 'building-back-stronger-after-damage', brief: 'Building back more resilient during a rebuild: moisture-resistant materials, better drainage/ventilation, code upgrades, and small choices that reduce the odds of a repeat loss.' },
    { key: 'one-stop-restoration-vs-multiple-contractors', brief: 'Single-source restoration vs juggling separate mitigation, contents, and rebuild contractors: handoffs, accountability, timeline, and documentation benefits of one provider.' },
  ]},
]

// Rotate a distinct set of 5 angles per city (pool size 11, step 5 -> full rotation, adjacent cities differ).
function pickAngles(pool, i) {
  const out = []
  for (let k = 0; k < 5; k++) out.push(pool[(i * 5 + k) % pool.length])
  return out
}

const cityCtx = (c) => `CITY CONTEXT (${c.name}, TX — ${c.county}): Weave in 2-4 of these naturally; never list them all, never keyword-stuff.
- Neighborhoods: ${c.neighborhoods.join(', ')}
- Landmarks: ${c.landmarks.join(', ')}
- Local conditions: ${c.commonIssues}`

const promptFor = (t) => `You are writing ONE SEO blog article for Go Green Restoration, a property-restoration company serving the Dallas-Fort Worth metroplex. Phone: (469) 727-3217.

${cityCtx(t.city)}

WRITING RULES:
- 700-900 words. Markdown with 3-5 "##" subheadings, short readable paragraphs, at most one bulleted list. No H1 or title line inside; start with a 2-3 sentence intro.
- Write to the SPECIFIC ANGLE below; do not drift into generic boilerplate that would read identically for another city or topic. Vary your opening and structure.
- Helpful, expert, locally specific tone for a homeowner. End with a short call-to-action paragraph naming Go Green Restoration and the phone number (469) 727-3217.

COMPLIANCE (never violate): Go Green Restoration is bonded, insured, and IICRC- and EPA Lead-Safe certified. Texas has NO statewide license for general restoration or construction contractors. NEVER claim a state contractor license, NEVER mention "CSLB" or a "Contractors State License Board", NEVER invent a license number, NEVER imply a state GC license exists.${t.s.mold ? MOLD : ''}

THIS ARTICLE:
- Service focus: ${t.s.label}
- Required angle (write specifically to this): ${t.a.brief}

Return ONLY the structured fields (title, description, content). The title MUST include "${t.city.name}".`

const tasks = []
CITIES.forEach((city, i) => {
  for (const s of SERVICES) {
    for (const a of pickAngles(s.pool, i)) tasks.push({ city, s, a })
  }
})
log(`Generating ${tasks.length} articles across ${CITIES.length} cities (5 services x 5 rotated angles)...`)

const results = await parallel(tasks.map((t) => () =>
  agent(promptFor(t), { label: `${t.city.slug}/${t.s.cluster}:${t.a.key}`, phase: 'Generate articles', schema: SCHEMA })
    .then((r) => r && ({
      title: r.title,
      slug: `${t.a.key}-${t.city.slug}`,
      cluster: t.s.cluster,
      clusterName: t.s.clusterName,
      description: r.description,
      content: r.content,
    }))
))

const articles = results.filter(Boolean)
log(`Generated ${articles.length}/${tasks.length} articles`)
return articles
