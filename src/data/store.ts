import type { Beat, BeatCollection, LicenseOption } from "@/types/store";

export const licenseTemplates: LicenseOption[] = [
  { id: "basic", name: "Basic lease", price: 29.99, summary: "For your next release", includes: ["MP3 file", "Up to 10,000 streams"], available: true },
  { id: "premium", name: "Premium lease", price: 49.99, summary: "More room to move", includes: ["MP3 + WAV files", "Up to 100,000 streams"], available: true },
  { id: "trackout", name: "Trackout lease", price: 99.99, summary: "Take it to the studio", includes: ["WAV + trackouts", "Up to 500,000 streams"], available: true },
  { id: "exclusive", name: "Exclusive", price: null, summary: "Let’s talk", includes: ["Exclusive rights", "Custom delivery"], available: false },
];

const palette = ["#aa7052", "#718078", "#786f8e", "#b2945e", "#557078", "#9a665c", "#697d57", "#827260"];
const titles = ["No Sleep In June", "On The Line", "Velvet Rope", "Half Past", "Blue Hour", "Last Call", "Off The Map", "Heavy Weather"];
const descriptions = [
  "Warm keys and patient drums leave room for every word. Built for the late-night record.",
  "A little dust, a little swing. Find the pocket and make it yours.",
  "Low lights, wide chords, and a knock that carries. The rest is up to you.",
  "Unhurried drums meet a restless melody. For the stories that stay with you.",
];

export const beats: Beat[] = titles.map((title, index) => ({
  id: `beat-${index + 1}`,
  slug: title.toLowerCase().replaceAll(" ", "-"),
  title,
  description: descriptions[index % descriptions.length],
  bpm: [88, 94, 76, 102, 83, 91, 110, 72][index],
  key: ["F minor", "D minor", "A♭ major", "C minor", "E♭ major", "G minor", "B♭ minor", "C major"][index],
  genre: ["Soul", "Hip-hop", "R&B", "Hip-hop", "Soul", "R&B", "Hip-hop", "Soul"][index],
  moods: [["Reflective", "Warm"], ["Confident", "Dusty"], ["Late night", "Smooth"], ["Focused", "Soulful"]][index % 4],
  tags: ["sample-driven", "soul", "live drums"],
  artwork: `linear-gradient(145deg, ${palette[index]}, #151512 82%)`,
  featured: index < 4,
  published: true,
  collectionIds: index % 2 === 0 ? ["soul-searchin"] : ["chopshop"],
  createdAt: `2026-0${(index % 6) + 1}-01`,
  licenses: licenseTemplates.map((license) => ({ ...license })),
}));

export const collections: BeatCollection[] = [
  { id: "soul-searchin", slug: "soul-searchin", title: "Soul Searchin’", description: "Dusty chops, warm keys, and the feeling that started it all.", artwork: "linear-gradient(140deg, #aa7052, #28201a 75%)", beatIds: ["beat-1", "beat-3", "beat-5", "beat-7"] },
  { id: "no-reservations", slug: "no-reservations", title: "No Reservations", description: "Open roads, new sounds. Production without borders.", artwork: "linear-gradient(140deg, #557078, #182023 75%)", beatIds: ["beat-2", "beat-4", "beat-6"] },
  { id: "chopshop", slug: "chopshop", title: "Chopshop", description: "Flipped, flipped again, and left with a new story.", artwork: "linear-gradient(140deg, #786f8e, #211f27 75%)", beatIds: ["beat-2", "beat-4", "beat-8"] },
  { id: "new-arrivals", slug: "new-arrivals", title: "New arrivals", description: "Fresh heat from the kitchen. First in, first heard.", artwork: "linear-gradient(140deg, #b2945e, #282419 75%)", beatIds: ["beat-5", "beat-6", "beat-7", "beat-8"] },
];

export function getBeat(slug: string) { return beats.find((beat) => beat.slug === slug); }
export function getCollection(slug: string) { return collections.find((collection) => collection.slug === slug); }
export function getCollectionBeats(collection: BeatCollection) { return collection.beatIds.map((id) => beats.find((beat) => beat.id === id)).filter((beat): beat is Beat => Boolean(beat)); }
export function formatPrice(price: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price); }
