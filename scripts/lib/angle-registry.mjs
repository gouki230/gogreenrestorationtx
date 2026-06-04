/**
 * 10 article angles per service (50 total).
 * Each angle has a titleTemplate, promptFocus, and slugPrefix.
 * {city} and {characteristic} are replaced at generation time.
 */

const ANGLES = {
  'water-damage-restoration': [
    { titleTemplate: 'Water Damage Emergency Guide for {city} Residents', slugPrefix: 'water-damage-emergency-guide', promptFocus: 'Write an emergency response guide for homeowners dealing with water damage. Cover immediate steps, safety concerns, what to do before professionals arrive, and common mistakes to avoid. Reference specific neighborhoods and local conditions.' },
    { titleTemplate: 'Common Causes of Water Damage in {city} Homes', slugPrefix: 'common-causes-water-damage', promptFocus: 'Explain the most common causes of water damage specific to this city — aging pipes, appliance failures, storm drainage issues, and foundation problems. Reference local building eras, soil conditions, and infrastructure.' },
    { titleTemplate: "How {city}'s {characteristic} Affects Water Damage Risk", slugPrefix: 'location-water-damage-risk', promptFocus: 'Analyze how the city\'s geographic and climate characteristics increase water damage risk. Cover terrain, weather patterns, proximity to water sources, building stock age, and seasonal factors.' },
    { titleTemplate: 'Water Damage Insurance Claims in {city}: What Homeowners Need to Know', slugPrefix: 'water-damage-insurance-claims', promptFocus: 'Guide homeowners through the water damage insurance claims process specific to their area. Cover what\'s typically covered, documentation tips, working with adjusters, and common claim pitfalls.' },
    { titleTemplate: 'Choosing a Water Damage Restoration Company in {city}', slugPrefix: 'choosing-water-damage-company', promptFocus: 'Help homeowners evaluate and choose a water damage restoration company. Cover licensing requirements, certifications, questions to ask, red flags, and what to expect from the restoration process.' },
    { titleTemplate: 'Hidden Water Damage in {city}: What Lurks Behind Your Walls', slugPrefix: 'hidden-water-damage', promptFocus: 'Reveal the signs of hidden water damage that homeowners often miss. Cover wall discoloration, musty odors, warped materials, mold behind surfaces, and how local building construction styles affect where hidden damage occurs.' },
    { titleTemplate: 'Seasonal Water Damage Risks in {city} and How to Prepare', slugPrefix: 'seasonal-water-damage-risks', promptFocus: 'Break down water damage risks by season in this specific area. Cover rainy season preparation, summer HVAC condensation, winter pipe concerns, and spring maintenance checklists.' },
    { titleTemplate: 'Water Damage Restoration Timeline: What {city} Homeowners Can Expect', slugPrefix: 'water-damage-restoration-timeline', promptFocus: 'Provide a detailed timeline of the water damage restoration process. Cover assessment, extraction, drying, cleaning, and repair phases with realistic timeframes for different severity levels.' },
    { titleTemplate: '{city} Neighborhood Guide: Water Damage Risks by Area', slugPrefix: 'neighborhood-water-damage-risks', promptFocus: 'Analyze water damage risks across different neighborhoods in the city. Reference specific areas, their elevation, proximity to waterways, building age, and infrastructure quality.' },
    { titleTemplate: 'DIY vs Professional Water Damage Cleanup in {city}', slugPrefix: 'diy-vs-professional-water-damage', promptFocus: 'Help homeowners understand when they can handle water damage themselves vs when they need professional help. Cover severity assessment, equipment needs, health risks, insurance implications, and cost comparisons.' },
  ],

  'fire-smoke-damage-restoration': [
    { titleTemplate: 'Fire Damage Emergency Steps for {city} Homeowners', slugPrefix: 'fire-damage-emergency-steps', promptFocus: 'Guide homeowners through the critical first steps after a fire. Cover safety, contacting authorities, insurance notification, securing property, and beginning the recovery process.' },
    { titleTemplate: 'Smoke Damage Cleanup in {city}: What Most People Miss', slugPrefix: 'smoke-damage-cleanup-mistakes', promptFocus: 'Reveal the hidden aspects of smoke damage that homeowners overlook. Cover HVAC contamination, hidden soot deposits, odor penetration into materials, and why DIY cleanup often fails.' },
    { titleTemplate: 'Wildfire Risk in {city}: How to Protect Your Property', slugPrefix: 'wildfire-risk-protection', promptFocus: 'Assess wildfire risk specific to this city\'s geography. Cover defensible space, home hardening, evacuation planning, and how the city\'s terrain and vegetation create fire risk.' },
    { titleTemplate: 'Fire Damage Insurance Claims in {city}: Complete Guide', slugPrefix: 'fire-damage-insurance-claims', promptFocus: 'Walk homeowners through the fire damage insurance claims process. Cover documentation, working with adjusters, ALE coverage, content claims, and common mistakes.' },
    { titleTemplate: 'Choosing a Fire Restoration Company in {city}', slugPrefix: 'choosing-fire-restoration-company', promptFocus: 'Help homeowners select a qualified fire and smoke damage restoration company. Cover certifications, experience, questions to ask, and what to expect from the process.' },
    { titleTemplate: 'Smoke Odor Removal in {city} Homes: Professional Methods', slugPrefix: 'smoke-odor-removal-methods', promptFocus: 'Explain professional smoke odor elimination methods including thermal fogging, ozone treatment, and hydroxyl generators. Cover why home remedies fail and when each method is appropriate.' },
    { titleTemplate: 'Post-Fire Rebuilding in {city}: What to Expect', slugPrefix: 'post-fire-rebuilding-guide', promptFocus: 'Guide homeowners through the reconstruction process after a fire. Cover planning, permits, timeline, working with insurance, and opportunities to upgrade during rebuilding.' },
    { titleTemplate: '{city} Fire Safety: Prevention Tips for Your Neighborhood', slugPrefix: 'fire-safety-prevention-tips', promptFocus: 'Provide fire safety and prevention tips specific to the city. Cover smoke detectors, electrical safety, kitchen fire prevention, wildfire preparation, and local fire department resources.' },
    { titleTemplate: 'Fire Damage to {city} Commercial Properties: Restoration Guide', slugPrefix: 'commercial-fire-damage-guide', promptFocus: 'Address fire damage restoration for commercial and multi-unit properties. Cover business continuity, tenant coordination, commercial insurance claims, and regulatory compliance.' },
    { titleTemplate: 'The True Cost of Fire Damage Restoration in {city}', slugPrefix: 'fire-damage-restoration-cost', promptFocus: 'Provide realistic cost information for fire damage restoration. Cover factors affecting cost, insurance coverage, out-of-pocket expenses, and how to avoid overpaying.' },
  ],

  'mold-remediation': [
    { titleTemplate: 'Mold Emergency Guide for {city} Homeowners', slugPrefix: 'mold-emergency-guide', promptFocus: 'Guide homeowners on what to do when they discover mold. Cover immediate steps, health precautions, when to evacuate, and how to prevent spreading while waiting for professionals.' },
    { titleTemplate: 'Common Mold Problems in {city} Homes and How to Spot Them', slugPrefix: 'common-mold-problems', promptFocus: 'Identify the most common mold issues in this city\'s homes. Reference local building styles, climate factors, and common locations where mold grows in the types of homes found here.' },
    { titleTemplate: "How {city}'s Climate Creates Mold-Friendly Conditions", slugPrefix: 'climate-mold-conditions', promptFocus: 'Analyze how the local climate contributes to mold growth. Cover marine layer, seasonal moisture, HVAC condensation, and how the city\'s specific weather patterns create ideal mold conditions.' },
    { titleTemplate: 'Mold Remediation Insurance Coverage in {city}', slugPrefix: 'mold-insurance-coverage', promptFocus: 'Explain mold-related insurance coverage and claims. Cover what\'s typically covered vs excluded, how cause affects coverage, documentation needs, and navigating the claims process.' },
    { titleTemplate: 'Choosing a Mold Removal Company in {city}', slugPrefix: 'choosing-mold-removal-company', promptFocus: 'Help homeowners select a qualified mold remediation company. Cover certifications, testing protocols, containment practices, post-remediation verification, and questions to ask.' },
    { titleTemplate: 'Health Risks of Mold Exposure in {city} Homes', slugPrefix: 'mold-health-risks', promptFocus: 'Explain the health risks of mold exposure. Cover symptoms, vulnerable populations, different mold types, and when mold becomes a health emergency. Include local health resources.' },
    { titleTemplate: 'Preventing Mold Growth in {city}: A Seasonal Guide', slugPrefix: 'preventing-mold-seasonal-guide', promptFocus: 'Provide a season-by-season mold prevention guide specific to the local climate. Cover moisture control, ventilation, HVAC maintenance, and rainy season preparation.' },
    { titleTemplate: 'Hidden Mold in {city} Homes: Where to Look', slugPrefix: 'hidden-mold-where-to-look', promptFocus: 'Reveal where hidden mold commonly grows in local homes. Cover behind walls, under flooring, in HVAC systems, attics, crawl spaces, and how the city\'s building styles create hiding spots.' },
    { titleTemplate: 'Mold Testing in {city}: When and Why You Need It', slugPrefix: 'mold-testing-when-why', promptFocus: 'Explain when mold testing is necessary, what types of testing are available, how to interpret results, and how local environmental factors affect testing recommendations.' },
    { titleTemplate: '{city} Rental Properties and Mold: Tenant and Landlord Rights', slugPrefix: 'rental-mold-tenant-landlord-rights', promptFocus: 'Cover the legal rights and responsibilities of tenants and landlords regarding mold. Include California law, disclosure requirements, remediation obligations, and dispute resolution.' },
  ],

  'sewage-backup-cleanup': [
    { titleTemplate: 'Sewage Backup Emergency Guide for {city} Residents', slugPrefix: 'sewage-backup-emergency-guide', promptFocus: 'Guide residents through a sewage backup emergency. Cover immediate safety steps, evacuation, what not to touch, health hazards, and how to protect your property while waiting for professionals.' },
    { titleTemplate: 'Why Sewage Backups Happen in {city} and How to Prevent Them', slugPrefix: 'why-sewage-backups-happen', promptFocus: 'Explain the common causes of sewage backups specific to this city. Cover tree root intrusion, aging infrastructure, grease buildup, storm overwhelm, and local sewer system characteristics.' },
    { titleTemplate: "{city}'s Aging Sewer Infrastructure and Your Property", slugPrefix: 'aging-sewer-infrastructure', promptFocus: 'Discuss how the city\'s sewer infrastructure age and condition affects residential properties. Cover pipe materials by construction era, common failure points, and infrastructure upgrade status.' },
    { titleTemplate: 'Sewage Cleanup Insurance Claims in {city}', slugPrefix: 'sewage-insurance-claims', promptFocus: 'Guide homeowners through sewage backup insurance claims. Cover sewer backup endorsements, what\'s covered, documentation requirements, and tips for maximizing your claim.' },
    { titleTemplate: 'Choosing a Sewage Cleanup Company in {city}', slugPrefix: 'choosing-sewage-cleanup-company', promptFocus: 'Help homeowners select a qualified sewage cleanup company. Cover biohazard certifications, safety protocols, equipment needs, response time, and what to expect from professional cleanup.' },
    { titleTemplate: 'Health Hazards of Sewage Backup in {city} Homes', slugPrefix: 'sewage-health-hazards', promptFocus: 'Explain the serious health risks of sewage backup exposure. Cover bacteria, viruses, parasites, chemical contaminants, who is most vulnerable, and when to seek medical attention.' },
    { titleTemplate: 'Preventing Sewer Line Problems in {city}', slugPrefix: 'preventing-sewer-problems', promptFocus: 'Provide actionable prevention strategies for sewer line problems. Cover regular maintenance, camera inspections, root treatment, drain care, and backwater prevention valves.' },
    { titleTemplate: 'Tree Root Intrusion in {city} Sewer Lines: Causes and Solutions', slugPrefix: 'tree-root-intrusion-sewer', promptFocus: 'Address the common problem of tree roots damaging sewer lines. Cover which local tree species are worst offenders, detection signs, removal methods, and prevention strategies.' },
    { titleTemplate: 'Storm-Related Sewage Backups in {city}: What to Know', slugPrefix: 'storm-sewage-backups', promptFocus: 'Explain how heavy rain and storms cause sewage backups in the local area. Cover the storm/sewer system interaction, high-risk zones, preparation steps, and emergency response.' },
    { titleTemplate: 'Commercial Sewage Cleanup in {city}: Business Owner\'s Guide', slugPrefix: 'commercial-sewage-cleanup', promptFocus: 'Address sewage cleanup for commercial properties and multi-unit buildings. Cover business continuity, employee safety, regulatory compliance, and commercial insurance claims.' },
  ],

  'construction-remodeling': [
    { titleTemplate: 'Post-Disaster Reconstruction Guide for {city} Homeowners', slugPrefix: 'post-disaster-reconstruction-guide', promptFocus: 'Guide homeowners through the reconstruction process after any type of disaster. Cover assessment, planning, permits, contractor selection, timeline, and working with insurance.' },
    { titleTemplate: 'Restoration vs Remodeling in {city}: Making the Right Choice', slugPrefix: 'restoration-vs-remodeling', promptFocus: 'Help homeowners decide between restoration and remodeling after damage. Cover cost differences, insurance implications, timeline, and how to combine both for the best result.' },
    { titleTemplate: 'Building Permits and Codes in {city} for Restoration Projects', slugPrefix: 'building-permits-codes', promptFocus: 'Explain the permit process and building code requirements for restoration work in this city. Cover when permits are needed, how to apply, inspections, and code compliance.' },
    { titleTemplate: 'Choosing a Licensed Restoration Contractor in {city}', slugPrefix: 'choosing-licensed-contractor', promptFocus: 'Guide homeowners in selecting a licensed restoration contractor. Cover California licensing, verification, certifications, questions to ask, red flags, and local references.' },
    { titleTemplate: 'Eco-Friendly Rebuilding Options for {city} Properties', slugPrefix: 'eco-friendly-rebuilding', promptFocus: 'Present eco-friendly and sustainable options for property restoration and rebuilding. Cover green materials, energy efficiency upgrades, and how to rebuild better while respecting the environment.' },
    { titleTemplate: 'Kitchen and Bathroom Restoration in {city} After Damage', slugPrefix: 'kitchen-bathroom-restoration', promptFocus: 'Focus on restoring the most commonly damaged rooms. Cover water damage to kitchens and bathrooms, material selection, layout improvements, and combining restoration with upgrades.' },
    { titleTemplate: 'Timeline and Cost of Reconstruction in {city}', slugPrefix: 'reconstruction-timeline-cost', promptFocus: 'Provide realistic timelines and cost ranges for different types of reconstruction. Cover factors affecting both, how to budget, financing options, and avoiding cost overruns.' },
    { titleTemplate: '{city} Historic Home Restoration: Preserving Character After Damage', slugPrefix: 'historic-home-restoration', promptFocus: 'Address the unique challenges of restoring historic or older homes. Cover preservation techniques, matching original materials, code compliance, and maintaining character while modernizing.' },
    { titleTemplate: 'Insurance-Covered Upgrades During Restoration in {city}', slugPrefix: 'insurance-covered-upgrades', promptFocus: 'Explain how homeowners can upgrade their property during insurance-covered restoration. Cover what insurance pays for, code upgrades, betterment, and how to maximize the opportunity.' },
    { titleTemplate: 'Multi-Unit Reconstruction in {city}: HOA and Apartment Buildings', slugPrefix: 'multi-unit-reconstruction', promptFocus: 'Address reconstruction challenges unique to multi-unit properties. Cover HOA coordination, tenant displacement, phased construction, common area restoration, and commercial insurance.' },
  ],
};

export function getAngles(serviceSlug) {
  return ANGLES[serviceSlug] || [];
}

export function getAngle(serviceSlug, angleIndex) {
  const angles = getAngles(serviceSlug);
  return angles[angleIndex] || null;
}

export function buildTitle(serviceSlug, angleIndex, cityName, characteristics) {
  const angle = getAngle(serviceSlug, angleIndex);
  if (!angle) return null;
  let title = angle.titleTemplate.replace(/\{city\}/g, cityName);
  const mainCharacteristic = characteristics?.[0] || 'Location';
  const charLabels = {
    coastal: 'Coastal Location',
    'wildfire-zone': 'Wildfire Risk Zone',
    'older-buildings': 'Aging Housing Stock',
    hillside: 'Hillside Terrain',
    urban: 'Urban Environment',
    dense: 'Dense Housing',
    'extreme-heat': 'Extreme Heat Climate',
    desert: 'Desert Climate',
    foothill: 'Foothill Location',
    affluent: 'Luxury Properties',
    'beach-community': 'Beach Community Setting',
    valley: 'Valley Location',
  };
  title = title.replace(/\{characteristic\}/g, charLabels[mainCharacteristic] || mainCharacteristic);
  return title;
}

export function buildSlug(serviceSlug, angleIndex, citySlug) {
  const angle = getAngle(serviceSlug, angleIndex);
  if (!angle) return null;
  return `${angle.slugPrefix}-${citySlug}`;
}

export default ANGLES;
