import invisibleTether from "@/assets/invisible-tether.jpg";
import scienceOfSilence from "@/assets/science-of-silence.jpg";
import sensoryPoverty from "@/assets/sensory-poverty.jpg";
import notflixAndKnit from "@/assets/notflix-and-knit.jpg";
import aboutBalance from "@/assets/about-balance.jpg";
import newsletterImg from "@/assets/newsletter.jpg";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  quote?: string;
  image: string;
  date: string;
  readingTime: string;
  featured: boolean;
  published: boolean;
  body: string[];
};

export const postImages: Record<string, string> = {
  "invisible-tether": invisibleTether,
  "science-of-silence": scienceOfSilence,
  "sensory-poverty": sensoryPoverty,
  "notflix-and-knit": notflixAndKnit,
  "quiet-check-trap": aboutBalance,
  "digital-shadows": newsletterImg,
};

export const demoPosts: Post[] = [
  {
    id: "p1",
    slug: "invisible-tether",
    title: "Invisible Tether",
    excerpt: "Why we reach for our phones before we're even awake.",
    image: invisibleTether,
    date: "Mar 04, 2026",
    readingTime: "6 min",
    featured: true,
    published: true,
    body: [
      "It happens in the fragile space between sleep and waking. Before your eyes fully adjust to the light, before you check in with your own body, you reach for it.",
      "Your phone waits for your reach like a quiet authority. In the first minute of waking into the new day, an invisible tether tightens, pulling you from your physical reality into a stream of blue light and notifications.",
      "That moment matters more than we think. During the transition from sleep to wakefulness, the brain moves through alpha and theta waves — states linked to creativity, clarity and internal reflection. It's a natural warm-up. A soft launch into consciousness.",
      "But when you open an email, a news app or social media, you interrupt that process. You skip the internal check-in and begin reacting. Instead of choosing your first thought, you outsource it. An algorithm decides what occupies your mind before you've even brushed your teeth.",
      "This isn't weakness. It's wiring. The brain craves novelty and scans for threats. The phone endlessly delivers both. Notifications spike cortisol, curated images trigger comparison, and headlines stir urgency. Before you even touch the floor, your attention is fragmented.",
      "And once scattered, it rarely returns unchanged. The solution isn't dramatic. You don't need to throw your phone away or disappear into the woods. Just create a buffer.",
      "Tomorrow morning, wait a few minutes. Leave the phone where it is. Stretch. Drink water. Look out the window. The urge to reach for the phone will be strong; let it pass.",
      "You may discover that the world didn't end while you used those few minutes for yourself. More importantly, you may rediscover the quiet power of beginning your day on your own terms.",
    ],
  },
  {
    id: "p2",
    slug: "science-of-silence",
    title: "Science of Silence",
    excerpt: "What happens to the brain when the noise stops.",
    image: scienceOfSilence,
    date: "Feb 26, 2026",
    readingTime: "8 min",
    featured: false,
    published: true,
    body: [
      "The modern world is strongly afraid of silence. We fill every gap with sound: podcasts in the car, music when cooking, playlists while waiting. In love, something playing until we fall asleep, etc. Quiet starts to feel unproductive, awkward, almost threatening.",
      "But silence is where the brain does its most important work. When you unplug from constant input, your mind shifts into what neuroscientists call the Default Mode Network — the state responsible for memory consolidation, problem-solving and self-reflection.",
      "That is where loose thoughts connect, where perspective forms, and where identity stabilises. When we drown every silent moment in digital noise, we finish that process. The result isn't just distraction. It's cognitive congestion. A mind that feels busy but rarely clear, stimulated but rarely inspired.",
      "Your nervous system feels it too. Without notifications and artificial sound, the body can move from high-alert mode into 'rest and digest'. Heart rate slows, cortisol settles, and thinking sharpens. Silence isn't empty — it's restorative.",
      "And here's the surprising part: much of the anxiety we carry isn't born from our own lives — it's absorbed, borrowed from headlines, curated feeds, and the low-grade urgency of the internet.",
      "When the noise stops, so does a portion of that borrowed stress. Why not try experimenting with intermittent intentional quiet? Drive without the radio on. Walk without headphones. Stand in line without saving your phone.",
      "Other small pockets of unfilled time. There will be an urge to fill the space — let it rest. It will fade. You're not missing anything essential in those few minutes. You're giving your brain something rare: an empty room.",
      "And in that room, you might find clarity, a creative solution, or simply a steadier, calmer version of yourself — one that no notification can manufacture.",
    ],
  },
  {
    id: "p3",
    slug: "sensory-poverty",
    title: "Sensory Poverty",
    excerpt: "Are we losing the ability to smell, touch, and truly see?",
    image: sensoryPoverty,
    date: "Feb 19, 2026",
    readingTime: "5 min",
    featured: false,
    published: true,
    body: [
      "We live in a world optimised for two senses: sight and hearing. Everything else has been quietly demoted.",
      "Touch has been reduced to glass. Smell has been outsourced to candles labelled with words like 'calm'. Taste happens while looking at a screen. The body becomes a passenger.",
      "Sensory poverty isn't a lack of stimulation; it is a lack of variety. The same flatness, repeated, all day long.",
      "The remedy is embarrassingly simple. Put your hands in soil. Cook something that smells. Walk on an uneven surface. Let the world be textured again.",
    ],
  },
  {
    id: "p4",
    slug: "notflix-and-knit",
    title: "Notflix and Knit",
    excerpt: "The quiet return of hobbies that use your hands.",
    image: notflixAndKnit,
    date: "Feb 11, 2026",
    readingTime: "4 min",
    featured: false,
    published: true,
    body: [
      "There is a particular satisfaction in making something slowly and badly.",
      "Handwork gives the mind a rhythm to follow. It occupies enough attention to quiet rumination, but not so much that thought becomes impossible.",
      "Knitting, whittling, bread, repair. None of it scales. That is precisely the point.",
      "The evening does not have to be consumed. It can be spent.",
    ],
  },
  {
    id: "p5",
    slug: "quiet-check-trap",
    title: "'Quick Check' Trap",
    excerpt: "Ten seconds that quietly cost you forty minutes.",
    image: aboutBalance,
    date: "Feb 02, 2026",
    readingTime: "5 min",
    featured: false,
    published: true,
    body: [
      "The quick check is never quick. It is a doorway.",
      "Attention residue means a fragment of the interrupted task stays behind, humming, while you read something unrelated. Returning is never instant.",
      "Batch the checking. Give it a time and a shape. What is urgent will find you.",
    ],
  },
  {
    id: "p6",
    slug: "digital-shadows",
    title: "Digital Shadows",
    excerpt: "What the internet remembers when you have moved on.",
    image: newsletterImg,
    date: "Jan 24, 2026",
    readingTime: "7 min",
    featured: false,
    published: false,
    body: [
      "Every account left open is a room with the lights still on.",
      "A digital shadow is not dangerous by itself. It simply persists — long after the version of you that made it has changed.",
      "Once a season, walk the corridor. Close the rooms you no longer use.",
    ],
  },
];
