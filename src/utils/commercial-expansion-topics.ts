import initialTopics from '../data/commercial-expansion-topics.json';
const regionalFiles = import.meta.glob('../data/commercial-regional-*.json', {eager:true,import:'default'});
// Each file adds regional owners; existing PM and HOA owners are intentionally reused.
type CommercialTopic = (typeof initialTopics)[number] & {
  reuseExistingRoutes?: boolean;
  requiresMoldDisclosure?: boolean;
  imageDescription?: string;
  checklist?: string[];
};
const topics = [...initialTopics,...Object.values(regionalFiles).flat()] as CommercialTopic[];
export default topics;
