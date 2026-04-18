/* =========================================
   Shared animal data — used by both
   app.js (matching) and animals.html (gallery)
   ========================================= */

const ANIMALS = {
  owl: {
    name: "The Owl",
    emoji: "🦉",
    tag: "Curious · Clever · Night-owl energy",
    fact: "Owls can turn their heads almost all the way around — up to 270 degrees! That's because they can't move their eyes like we can, so their super-flexible necks do the work instead.",
    keywords: ["read", "book", "smart", "study", "learn", "think", "quiet", "night", "curious", "question", "wise", "homework", "math", "science"]
  },
  cheetah: {
    name: "The Cheetah",
    emoji: "🐆",
    tag: "Fast · Focused · Total speed demon",
    fact: "A cheetah can go from zero to 60 miles per hour in just three seconds — that's faster than most sports cars! But they can only sprint that fast for about half a minute before getting tired.",
    keywords: ["fast", "run", "speed", "race", "quick", "soccer", "track", "sprint", "athletic", "sport", "football", "basketball"]
  },
  dolphin: {
    name: "The Dolphin",
    emoji: "🐬",
    tag: "Friendly · Playful · Loves the crew",
    fact: "Dolphins give each other names! They use special whistle sounds to call their friends, and each dolphin has its very own signature whistle.",
    keywords: ["friend", "swim", "water", "pool", "beach", "ocean", "social", "funny", "joke", "happy", "smile", "laugh", "play", "team"]
  },
  elephant: {
    name: "The Elephant",
    emoji: "🐘",
    tag: "Kind · Caring · Never forgets a friend",
    fact: "Elephants can recognize themselves in a mirror, and they really do have amazing memories — they can remember friends and family members for decades.",
    keywords: ["kind", "help", "family", "remember", "memory", "gentle", "big", "care", "love", "hug", "nice", "sister", "brother", "mom", "dad", "grandma", "grandpa"]
  },
  penguin: {
    name: "The Penguin",
    emoji: "🐧",
    tag: "Loyal · Warm-hearted · Squad goals",
    fact: "Emperor penguins huddle together to stay warm in temperatures as cold as -60°F. They take turns standing on the outside of the group so everyone gets a chance to be in the cozy middle.",
    keywords: ["cold", "snow", "ice", "winter", "slide", "waddle", "cute", "together", "group", "sharing", "share", "fair"]
  },
  dog: {
    name: "The Dog",
    emoji: "🐶",
    tag: "Loyal · Joyful · Best friend forever",
    fact: "A dog's sense of smell is up to 100,000 times stronger than ours! Some dogs can even sniff out illnesses before doctors notice them.",
    keywords: ["dog", "puppy", "loyal", "loving", "cuddle", "pet", "walk", "fetch", "ball", "bark", "fur"]
  },
  cat: {
    name: "The Cat",
    emoji: "🐱",
    tag: "Cool · Independent · A little mysterious",
    fact: "Cats can make about 100 different sounds — way more than dogs, who only make about 10. And a cat's purr vibrates at a frequency that can actually help heal bones!",
    keywords: ["cat", "kitten", "independent", "alone", "calm", "chill", "cozy", "nap", "sleep", "quiet", "mystery"]
  },
  monkey: {
    name: "The Monkey",
    emoji: "🐵",
    tag: "Playful · Clever · Always up to something",
    fact: "Capuchin monkeys use tools! They crack open nuts with rocks, and some even make their own brushes from leaves to put medicine on their fur.",
    keywords: ["play", "climb", "tree", "jump", "silly", "funny", "goofy", "banana", "joke", "prank", "fun", "energy", "hyper"]
  },
  butterfly: {
    name: "The Butterfly",
    emoji: "🦋",
    tag: "Creative · Colorful · Changing & growing",
    fact: "Butterflies taste with their feet! When they land on a leaf or flower, they can immediately tell if it's something yummy or a good place to lay eggs.",
    keywords: ["art", "draw", "paint", "color", "pretty", "dance", "music", "sing", "flower", "pink", "purple", "rainbow", "creative", "make", "craft"]
  },
  lion: {
    name: "The Lion",
    emoji: "🦁",
    tag: "Brave · Bold · Born to lead",
    fact: "A lion's roar is so loud it can be heard from 5 miles away! Lions live in family groups called prides, and they're the only big cats that live in groups.",
    keywords: ["brave", "leader", "lead", "loud", "strong", "boss", "first", "captain", "king", "queen", "confident", "proud"]
  },
  turtle: {
    name: "The Sea Turtle",
    emoji: "🐢",
    tag: "Patient · Calm · Takes the long view",
    fact: "Sea turtles can hold their breath for hours when they're resting! And some sea turtles travel more than 10,000 miles across the ocean in their lifetime.",
    keywords: ["slow", "calm", "patient", "careful", "think", "shy", "quiet", "chill", "relax"]
  },
  hummingbird: {
    name: "The Hummingbird",
    emoji: "🐦",
    tag: "Energetic · Bright · Full of spark",
    fact: "Hummingbirds can flap their wings up to 80 times per second and are the only birds that can fly backwards! Their hearts beat over 1,200 times a minute.",
    keywords: ["energy", "fly", "bird", "bright", "zoom", "buzz", "busy", "active", "lively", "wiggle"]
  },
  otter: {
    name: "The Sea Otter",
    emoji: "🦦",
    tag: "Playful · Warm · Pure good vibes",
    fact: "Sea otters hold hands while they sleep so they don't drift apart on the water! They also carry a favorite rock in a pouch under their arm to crack open shells.",
    keywords: ["cute", "cuddle", "hold", "hand", "float", "water", "play", "best", "friend", "nice", "sweet"]
  },
  fox: {
    name: "The Fox",
    emoji: "🦊",
    tag: "Sly · Smart · A little sneaky (in a good way)",
    fact: "Foxes use Earth's magnetic field to hunt! They always pounce in a northeast direction, which helps them catch their prey with amazing accuracy.",
    keywords: ["sneaky", "clever", "trick", "hide", "seek", "puzzle", "game", "mystery", "detective", "solve", "orange", "red"]
  },
  panda: {
    name: "The Panda",
    emoji: "🐼",
    tag: "Chill · Snacky · Expert at relaxing",
    fact: "Pandas eat for up to 14 hours every single day — they munch through about 26 to 84 pounds of bamboo! Baby pandas are born tiny and pink, about the size of a stick of butter.",
    keywords: ["food", "eat", "snack", "hungry", "pizza", "ice cream", "cookie", "sweet", "chocolate", "candy", "relax", "lazy", "sleep", "bed"]
  }
};
