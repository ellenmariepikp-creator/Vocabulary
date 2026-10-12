import { WordItem, CompanionPet, HatItem, Badge } from '../types';

export const INITIAL_WORDS: WordItem[] = [
  // --- GRADE 1 & 2 (Star Explorers) ---
  {
    id: 'g1-curious',
    word: 'curious',
    simpleDefinition: 'Eager to learn or know about something new!',
    fullDefinition: 'Having a strong desire to know or learn something.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The curious puppy sniffed the mysterious cardboard box.',
    phonetic: '/ˈkjʊə.ri.əs/',
    syllables: ['cu', 'ri', 'ous'],
    synonyms: ['inquisitive', 'interested', 'nosy'],
    category: 'Feelings & Thinking',
    gradeLevel: 'grade_1_2',
    emoji: '🔍',
    mysteryClues: [
      'It describes how you feel when you want to discover a secret.',
      'It has 3 syllables and ends with "-ous".',
      'The _____ kitten peeked into the open garden shed.',
      'Means wanting to learn or find out more!'
    ]
  },
  {
    id: 'g1-gigantic',
    word: 'gigantic',
    simpleDefinition: 'Super enormous, like a towering mountain or whale!',
    fullDefinition: 'Of very great size or extent; huge or colossal.',
    partOfSpeech: 'adjective',
    exampleSentence: 'We saw a gigantic dinosaur skeleton at the museum.',
    phonetic: '/dʒaɪˈɡæn.tɪk/',
    syllables: ['gi', 'gan', 'tic'],
    synonyms: ['huge', 'colossal', 'massive'],
    category: 'Describing Words',
    gradeLevel: 'grade_1_2',
    emoji: '🦕',
    mysteryClues: [
      'Describes something that is way, way bigger than normal.',
      'Starts with "g" and rhymes with frantic.',
      'The friendly giant built a _____ sandcastle on the beach.',
      'A word that means extremely huge!'
    ]
  },
  {
    id: 'g1-gentle',
    word: 'gentle',
    simpleDefinition: 'Kind, soft, and careful so nothing gets hurt.',
    fullDefinition: 'Mild in temperament or behavior; kind or tender.',
    partOfSpeech: 'adjective',
    exampleSentence: 'Maya was very gentle when petting the baby rabbit.',
    phonetic: '/ˈdʒen.təl/',
    syllables: ['gen', 'tle'],
    synonyms: ['tender', 'mild', 'soft'],
    category: 'Feelings & Thinking',
    gradeLevel: 'grade_1_2',
    emoji: '🐰',
    mysteryClues: [
      'Describes how you touch something delicate like a butterfly.',
      'Rhymes with "mental" and starts with a soft "g".',
      'A _____ summer breeze rustled the green tree leaves.',
      'Means soft, tender, and caring.'
    ]
  },
  {
    id: 'g1-scurry',
    word: 'scurry',
    simpleDefinition: 'To run with quick, hurried little steps!',
    fullDefinition: 'To move hurriedly with short, quick steps.',
    partOfSpeech: 'verb',
    exampleSentence: 'We watched the little mice scurry under the wooden porch.',
    phonetic: '/ˈskʌr.i/',
    syllables: ['scur', 'ry'],
    synonyms: ['dash', 'hurry', 'scamper'],
    category: 'Action Verbs',
    gradeLevel: 'grade_1_2',
    emoji: '🐿️',
    mysteryClues: [
      'An action that little animals like squirrels do when scared.',
      'Rhymes with "hurry" and starts with "sc-".',
      'When the rain started, the ants began to _____ to their nest.',
      'Means running quickly with short little steps.'
    ]
  },
  {
    id: 'g1-glimmer',
    word: 'glimmer',
    simpleDefinition: 'To shine with a soft, flickering little light.',
    fullDefinition: 'Shine faintly with a wavering, soft light.',
    partOfSpeech: 'verb',
    exampleSentence: 'Fireflies began to glimmer among the quiet willow trees.',
    phonetic: '/ˈɡlɪm.ər/',
    syllables: ['glim', 'mer'],
    synonyms: ['twinkle', 'gleam', 'sparkle'],
    category: 'Nature & Wonders',
    gradeLevel: 'grade_1_2',
    emoji: '✨',
    mysteryClues: [
      'Describes what stars or glowworms do in the twilight.',
      'Rhymes with "shimmer" and starts with "gl-".',
      'A tiny candle continued to _____ in the bedroom window.',
      'Means to shine softly and twinkle.'
    ]
  },
  {
    id: 'g1-delighted',
    word: 'delighted',
    simpleDefinition: 'Full of big smiles and bursting with joy!',
    fullDefinition: 'Feeling or showing great pleasure and happiness.',
    partOfSpeech: 'adjective',
    exampleSentence: 'Leo was delighted when his puppy learned to fetch the ball.',
    phonetic: '/dɪˈlaɪ.tɪd/',
    syllables: ['de', 'light', 'ed'],
    synonyms: ['joyful', 'thrilled', 'overjoyed'],
    category: 'Feelings & Thinking',
    gradeLevel: 'grade_1_2',
    emoji: '🎉',
    mysteryClues: [
      'Describes how you feel on your birthday with friends.',
      'Contains the word "light" in the middle!',
      'Grandma was _____ to receive a colorful handmade drawing.',
      'A wonderful word for super happy and thrilled!'
    ]
  },
  {
    id: 'g1-whisper',
    word: 'whisper',
    simpleDefinition: 'To speak in a very quiet, gentle voice using breath.',
    fullDefinition: 'To speak very softly using breath rather than full voice.',
    partOfSpeech: 'verb',
    exampleSentence: 'In the quiet library, we had to whisper our questions.',
    phonetic: '/ˈwɪs.pər/',
    syllables: ['whis', 'per'],
    synonyms: ['murmur', 'mumble', 'breathe'],
    category: 'Action Verbs',
    gradeLevel: 'grade_1_2',
    emoji: '🤫',
    mysteryClues: [
      'What you do when you are sharing a secret with your friend.',
      'Starts with "wh-" and rhymes with "crisper".',
      'Please _____ so you don\'t wake the sleeping baby.',
      'Means talking very softly without vocal cords.'
    ]
  },
  {
    id: 'g1-cozy',
    word: 'cozy',
    simpleDefinition: 'Warm, comfortable, and safe like a blanket nest.',
    fullDefinition: 'Giving a feeling of comfort, warmth, and relaxation.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The reading corner with soft pillows was super cozy.',
    phonetic: '/ˈkoʊ.zi/',
    syllables: ['co', 'zy'],
    synonyms: ['snug', 'comfy', 'warm'],
    category: 'Describing Words',
    gradeLevel: 'grade_1_2',
    emoji: '☕',
    mysteryClues: [
      'How your bed feels on a chilly rainy afternoon.',
      'Starts with "c" and ends with "zy".',
      'The kitten curled up in a _____ wool basket.',
      'Means snug, warm, and delightfully comfortable.'
    ]
  },

  // --- GRADE 3 & 4 (Word Adventurers) ---
  {
    id: 'g3-luminous',
    word: 'luminous',
    simpleDefinition: 'Bright and glowing in the dark, shining beautifully!',
    fullDefinition: 'Emitting or reflecting light; glowing with radiance.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The luminous jellyfish drifted through the deep dark sea.',
    phonetic: '/ˈluː.mɪ.nəs/',
    syllables: ['lu', 'mi', 'nous'],
    synonyms: ['radiant', 'glowing', 'brilliant'],
    category: 'Nature & Wonders',
    gradeLevel: 'grade_3_4',
    emoji: '🏮',
    mysteryClues: [
      'Describes an object that emits a soft glow in pitch blackness.',
      'Root word relates to light (lum-).',
      'The stars were so _____ they lit up the grassy path.',
      'Means bright, radiant, and gently glowing.'
    ]
  },
  {
    id: 'g3-courageous',
    word: 'courageous',
    simpleDefinition: 'Brave and fearless, even when things are scary.',
    fullDefinition: 'Possessing or characterized by courage; brave.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The courageous knight stepped forward to rescue the village.',
    phonetic: '/kəˈreɪ.dʒəs/',
    syllables: ['cour', 'age', 'ous'],
    synonyms: ['brave', 'valiant', 'heroic'],
    category: 'Feelings & Thinking',
    gradeLevel: 'grade_3_4',
    emoji: '🛡️',
    mysteryClues: [
      'A quality shared by superheroes, firefighters, and knights.',
      'Contains the root word "courage".',
      'It was a _____ decision to speak up for the new classmate.',
      'Means being truly brave despite being frightened.'
    ]
  },
  {
    id: 'g3-miniature',
    word: 'miniature',
    simpleDefinition: 'A tiny, working version of something much bigger!',
    fullDefinition: 'Much smaller than the normal or usual size.',
    partOfSpeech: 'adjective',
    exampleSentence: 'Lucas built a miniature wooden train that ran on a tiny track.',
    phonetic: '/ˈmɪn.i.ə.tʃər/',
    syllables: ['min', 'i', 'a', 'ture'],
    synonyms: ['tiny', 'pocket-sized', 'petite'],
    category: 'Describing Words',
    gradeLevel: 'grade_3_4',
    emoji: '🔬',
    mysteryClues: [
      'Describes dollhouses, bonsai trees, or pocket toy cars.',
      'Starts with "mini-".',
      'The fairy lived inside a _____ teapot hidden under the mushrooms.',
      'Means made on a much smaller scale than usual.'
    ]
  },
  {
    id: 'g3-ancient',
    word: 'ancient',
    simpleDefinition: 'Existing from thousands of years ago in old history.',
    fullDefinition: 'Belonging to the very distant past and no longer in existence.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The explorers uncovered an ancient temple covered in vines.',
    phonetic: '/ˈeɪn.ʃənt/',
    syllables: ['an', 'cient'],
    synonyms: ['prehistoric', 'antique', 'timeworn'],
    category: 'Adventure & Magic',
    gradeLevel: 'grade_3_4',
    emoji: '🏺',
    mysteryClues: [
      'Older than grandparents, older than castles, from millennia ago!',
      'Begins with the letter "A" and ends with "-cient".',
      'The museum displayed an _____ stone bowl carved by Egyptians.',
      'Means from the very distant past long ago.'
    ]
  },
  {
    id: 'g3-hibernate',
    word: 'hibernate',
    simpleDefinition: 'To sleep deeply through the cold winter season.',
    fullDefinition: 'To spend the winter in a dormant, sleep-like state.',
    partOfSpeech: 'verb',
    exampleSentence: 'Bears eat lots of berries before they hibernate in caves.',
    phonetic: '/ˈhaɪ.bər.neɪt/',
    syllables: ['hi', 'ber', 'nate'],
    synonyms: ['sleep', 'slumber', 'dormant'],
    category: 'Nature & Wonders',
    gradeLevel: 'grade_3_4',
    emoji: '🐻',
    mysteryClues: [
      'What hedgehogs and grizzly bears do when snow arrives.',
      'Has 3 syllables and ends with the suffix "-ate".',
      'Frogs bury themselves in pond mud to _____ until spring.',
      'Means to spend the winter resting in deep sleep.'
    ]
  },
  {
    id: 'g3-dazzle',
    word: 'dazzle',
    simpleDefinition: 'To amaze or blind someone with brilliant bright light.',
    fullDefinition: 'Blind someone temporarily with extremely bright light.',
    partOfSpeech: 'verb',
    exampleSentence: 'The fireworks exploded in gold sparklers that dazzle everyone.',
    phonetic: '/ˈdæz.əl/',
    syllables: ['daz', 'zle'],
    synonyms: ['blind', 'amaze', 'impress'],
    category: 'Nature & Wonders',
    gradeLevel: 'grade_3_4',
    emoji: '🎆',
    mysteryClues: [
      'What sunlight reflected off diamonds does to your eyes.',
      'Rhymes with "puzzle" and has a double "z".',
      'The magician prepared an illusion that would _____ the audience.',
      'Means to overwhelm with brilliance or shining splendor.'
    ]
  },
  {
    id: 'g3-peculiar',
    word: 'peculiar',
    simpleDefinition: 'Strange, unusual, or different in an intriguing way.',
    fullDefinition: 'Different to what is normal or expected; strange.',
    partOfSpeech: 'adjective',
    exampleSentence: 'We noticed a peculiar purple bird whistling like a flute.',
    phonetic: '/pɪˈkjuː.li.ər/',
    syllables: ['pe', 'cu', 'li', 'ar'],
    synonyms: ['unusual', 'strange', 'bizarre'],
    category: 'Describing Words',
    gradeLevel: 'grade_3_4',
    emoji: '🎭',
    mysteryClues: [
      'Describes an odd sound, a wacky machine, or a curious habit.',
      'Has 4 syllables and starts with "pe-".',
      'The old grandfather clock made a _____ clanking sound at noon.',
      'Means unusual, odd, or distinctively weird.'
    ]
  },
  {
    id: 'g3-wander',
    word: 'wander',
    simpleDefinition: 'To walk around freely with no rush and no strict path.',
    fullDefinition: 'Walk or move in a leisurely, casual, or aimless way.',
    partOfSpeech: 'verb',
    exampleSentence: 'We love to wander through the pine forest on sunny mornings.',
    phonetic: '/ˈwɒn.dər/',
    syllables: ['wan', 'der'],
    synonyms: ['stroll', 'roam', 'ramble'],
    category: 'Action Verbs',
    gradeLevel: 'grade_3_4',
    emoji: '🌲',
    mysteryClues: [
      'What you do when exploring woods without a map.',
      'Looks similar to "wonder" but has an "a"!',
      'The lost duckling began to _____ along the sandy creek.',
      'Means strolling or roaming without a set destination.'
    ]
  },

  // --- GRADE 5 & 6 (Word Masters) ---
  {
    id: 'g5-resilient',
    word: 'resilient',
    simpleDefinition: 'Able to bounce back quickly after trouble or hard times!',
    fullDefinition: 'Able to withstand or recover quickly from difficult conditions.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The resilient pine tree survived the howling windstorm.',
    phonetic: '/rɪˈzɪl.jənt/',
    syllables: ['re', 'sil', 'i', 'ent'],
    synonyms: ['tough', 'adaptable', 'hardy'],
    category: 'Feelings & Thinking',
    gradeLevel: 'grade_5_6',
    emoji: '🌱',
    mysteryClues: [
      'A character trait for someone who never gives up after stumbling.',
      'Starts with "re-" and ends with "-ient".',
      'Athletes must be _____ when facing tough losses.',
      'Means able to recover quickly from hardship or strain.'
    ]
  },
  {
    id: 'g5-metamorphosis',
    word: 'metamorphosis',
    simpleDefinition: 'A magical complete transformation from one form into another!',
    fullDefinition: 'A change of the form or nature of a thing or person into a completely different one.',
    partOfSpeech: 'noun',
    exampleSentence: 'A caterpillar undergoes metamorphosis inside a chrysalis to become a butterfly.',
    phonetic: '/ˌmet.əˈmɔː.fə.sɪs/',
    syllables: ['met', 'a', 'mor', 'pho', 'sis'],
    synonyms: ['transformation', 'mutation', 'conversion'],
    category: 'Space & Science',
    gradeLevel: 'grade_5_6',
    emoji: '🦋',
    mysteryClues: [
      'The scientific word for a tadpole turning into an adult frog.',
      'Has 5 syllables and comes from Greek roots for form-change.',
      'The dramatic _____ of the clumsy grub stunned the botanists.',
      'Means a striking, complete change of form or structure.'
    ]
  },
  {
    id: 'g5-kaleidoscope',
    word: 'kaleidoscope',
    simpleDefinition: 'A constantly shifting, colorful pattern of changing shapes!',
    fullDefinition: 'A toy consisting of a tube containing mirrors and colored glass reflecting infinite patterns; a shifting scene of varied colors.',
    partOfSpeech: 'noun',
    exampleSentence: 'The autumn leaves created a kaleidoscope of scarlet and gold.',
    phonetic: '/kəˈlaɪ.də.skoʊp/',
    syllables: ['ka', 'lei', 'do', 'scope'],
    synonyms: ['spectrum', 'mosaic', 'motley'],
    category: 'Adventure & Magic',
    gradeLevel: 'grade_5_6',
    emoji: '💎',
    mysteryClues: [
      'A cylinder you hold to your eye that spins colored geometric beads.',
      'Contains "scope" at the end.',
      'Looking at the coral reef was like diving into a living _____.',
      'Means a continually changing pattern of shapes and colors.'
    ]
  },
  {
    id: 'g5-tranquility',
    word: 'tranquility',
    simpleDefinition: 'A peaceful, serene state of complete quiet and calm.',
    fullDefinition: 'The quality or state of being tranquil; calm.',
    partOfSpeech: 'noun',
    exampleSentence: 'The mountain lake at sunrise was a place of pure tranquility.',
    phonetic: '/træŋˈkwɪl.ə.ti/',
    syllables: ['tran', 'quil', 'i', 'ty'],
    synonyms: ['peace', 'serenity', 'calmness'],
    category: 'Nature & Wonders',
    gradeLevel: 'grade_5_6',
    emoji: '🧘',
    mysteryClues: [
      'The quiet feeling when paddling on a mirror-smooth lake at dawn.',
      'Rhymes with "ability" and starts with "tran-".',
      'The library was filled with soothing silence and _____.',
      'Means peacefulness, calm, and freedom from disturbance.'
    ]
  },
  {
    id: 'g5-perpetual',
    word: 'perpetual',
    simpleDefinition: 'Never ending or changing, continuing forever and ever!',
    fullDefinition: 'Never ending or changing; occurring repeatedly.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The waterfall flowed in perpetual motion down the granite cliff.',
    phonetic: '/pɚˈpetʃ.u.əl/',
    syllables: ['per', 'pet', 'u', 'al'],
    synonyms: ['everlasting', 'eternal', 'unceasing'],
    category: 'Space & Science',
    gradeLevel: 'grade_5_6',
    emoji: '⏳',
    mysteryClues: [
      'Scientists have tried to build a _____ motion machine that never stops.',
      'Starts with "per-" and ends with "-ual".',
      'The snowy peaks existed in a state of _____ winter.',
      'Means lasting forever or never ceasing.'
    ]
  },
  {
    id: 'g5-bewildered',
    word: 'bewildered',
    simpleDefinition: 'Completely confused and puzzled by something unexpected.',
    fullDefinition: 'Perplexed and confused; very puzzled.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The explorer looked bewildered when the map showed a floating island.',
    phonetic: '/bɪˈwɪl.dɚd/',
    syllables: ['be', 'wil', 'dered'],
    synonyms: ['perplexed', 'confused', 'baffled'],
    category: 'Feelings & Thinking',
    gradeLevel: 'grade_5_6',
    emoji: '🧩',
    mysteryClues: [
      'Describes a detective scratching their head when clues do not add up.',
      'Contains the word "wild" in the middle.',
      'The sudden turn of events left all the chess spectators _____.',
      'Means completely puzzled, baffled, or perplexed.'
    ]
  },
  {
    id: 'g5-elaborate',
    word: 'elaborate',
    simpleDefinition: 'Detailed, intricate, and worked out with great care.',
    fullDefinition: 'Involving many carefully arranged parts or details; detailed and complicated in design.',
    partOfSpeech: 'adjective',
    exampleSentence: 'The spider spun an elaborate web that caught morning dew like jewels.',
    phonetic: '/ɪˈlæb.ɚ.ət/',
    syllables: ['e', 'lab', 'o', 'rate'],
    synonyms: ['intricate', 'detailed', 'complex'],
    category: 'Describing Words',
    gradeLevel: 'grade_5_6',
    emoji: '🕸️',
    mysteryClues: [
      'Describes a clockwork mechanism with hundreds of golden gears.',
      'Has 4 syllables and starts with "e-".',
      'They devised an _____ plan to build a treehouse with a zip line.',
      'Means decorated with great detail and intricacy.'
    ]
  },
  {
    id: 'g5-audacious',
    word: 'audacious',
    simpleDefinition: 'Showing a willingness to take bold, daring risks!',
    fullDefinition: 'Showing a willingness to take surprisingly bold risks.',
    partOfSpeech: 'adjective',
    exampleSentence: 'Her audacious plan to cross the rope bridge in the storm succeeded.',
    phonetic: '/ɑːˈdeɪ.ʃəs/',
    syllables: ['au', 'da', 'cious'],
    synonyms: ['bold', 'daring', 'fearless'],
    category: 'Adventure & Magic',
    gradeLevel: 'grade_5_6',
    emoji: '🦅',
    mysteryClues: [
      'Describes a skydiving leap or an ultra-brave expedition.',
      'Starts with "au-" and rhymes with "spacious".',
      'The pirates made an _____ escape right under the captain\'s nose.',
      'Means boldly daring and taking astonishing risks.'
    ]
  }
];

export const COMPANION_PETS: CompanionPet[] = [
  {
    id: 'pet-fox',
    name: 'Pip the Fox',
    animal: 'Red Fox',
    emoji: '🦊',
    title: 'The Clever Pathfinder',
    color: 'from-amber-400 to-orange-500',
    accentColor: '#F97316',
    personality: 'Energetic, witty, and always sniffing out hidden word treasures!',
    favoriteWord: 'curious'
  },
  {
    id: 'pet-owl',
    name: 'Ollie the Owl',
    animal: 'Barn Owl',
    emoji: '🦉',
    title: 'The Scholar Sage',
    color: 'from-sky-400 to-indigo-500',
    accentColor: '#0EA5E9',
    personality: 'Wise, observant, and loves digging into syllables and origins!',
    favoriteWord: 'luminous'
  },
  {
    id: 'pet-dragon',
    name: 'Bubbles the Dragon',
    animal: 'Baby Dragon',
    emoji: '🐲',
    title: 'The Spark Weaver',
    color: 'from-emerald-400 to-teal-600',
    accentColor: '#10B981',
    personality: 'Playful, breathes confetti sparks when words are solved correctly!',
    favoriteWord: 'kaleidoscope'
  },
  {
    id: 'pet-cat',
    name: 'Luna the Kitty',
    animal: 'Star Cat',
    emoji: '🐱',
    title: 'The Cosmic Dreamer',
    color: 'from-purple-400 to-pink-500',
    accentColor: '#A855F7',
    personality: 'Curious stargazed kitty who purrs rhythmically to phonetic beats!',
    favoriteWord: 'tranquility'
  },
  {
    id: 'pet-bear',
    name: 'Barnaby the Bear',
    animal: 'Honey Bear',
    emoji: '🐻',
    title: 'The Gentle Giant',
    color: 'from-amber-600 to-yellow-700',
    accentColor: '#D97706',
    personality: 'Warm, huggable, loves cozy words and sweet honey rewards!',
    favoriteWord: 'cozy'
  }
];

export const ACCESSORY_HATS: HatItem[] = [
  {
    id: 'hat-none',
    name: 'Natural Look',
    emoji: '✨',
    cost: 0,
    description: 'Fresh and free, showing off natural fluffy ears!'
  },
  {
    id: 'hat-party',
    name: 'Party Cone',
    emoji: '🥳',
    cost: 10,
    description: 'Festive polka-dotted cone hat for celebrate vibes!'
  },
  {
    id: 'hat-detective',
    name: 'Detective Cap',
    emoji: '🕵️',
    cost: 20,
    description: 'Classic tweed magnifying cap for word sleuths.'
  },
  {
    id: 'hat-wizard',
    name: 'Star Wizard Hat',
    emoji: '🧙',
    cost: 25,
    description: 'Pointed velvet hat twinkling with celestial magic.'
  },
  {
    id: 'hat-astronaut',
    name: 'Space Helmet',
    emoji: '🧑‍🚀',
    cost: 35,
    description: 'Gold-tinted visor ready for orbital vocabulary missions.'
  },
  {
    id: 'hat-crown',
    name: 'Golden Crown',
    emoji: '👑',
    cost: 50,
    description: 'Royal jewel-encrusted crown for vocabulary champions.'
  },
  {
    id: 'hat-chef',
    name: 'Chef Toque',
    emoji: '🧑‍🍳',
    cost: 20,
    description: 'Tall snowy chef hat for cooking up delicious sentences!'
  },
  {
    id: 'hat-pirate',
    name: 'Pirate Tricorne',
    emoji: '🏴‍☠️',
    cost: 30,
    description: 'Ahoy! Ready to plunder buried vocabulary treasure!'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-word',
    name: 'First Word Spelled',
    description: 'Mastered your first vocabulary challenge!',
    icon: '🌱',
    unlocked: true,
    category: 'mastery'
  },
  {
    id: 'badge-bubble-pop',
    name: 'Bubble Blaster',
    description: 'Popped 5 definition bubbles without a miss!',
    icon: '🫧',
    unlocked: false,
    category: 'speed'
  },
  {
    id: 'badge-detective',
    name: 'Master Sleuth',
    description: 'Cracked a Mystery Word with 2 or fewer clues!',
    icon: '🔍',
    unlocked: false,
    category: 'explorer'
  },
  {
    id: 'badge-scramble-ace',
    name: 'Tile Architect',
    description: 'Completed a Word Scramble without using hints!',
    icon: '🧩',
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'badge-streak-3',
    name: 'Streak Pioneer',
    description: 'Kept your learning quest alive 3 days running!',
    icon: '🔥',
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'badge-stylist',
    name: 'Pet Fashionista',
    description: 'Equipped a hat or accessory onto your companion pet!',
    icon: '🎩',
    unlocked: false,
    category: 'explorer'
  },
  {
    id: 'badge-story-weaver',
    name: 'Story Crafter',
    description: 'Generated a personalized adventure story with learned words!',
    icon: '📖',
    unlocked: false,
    category: 'story'
  },
  {
    id: 'badge-vocab-titan',
    name: 'Vocabulary Champ',
    description: 'Mastered 10 or more challenging words!',
    icon: '🏆',
    unlocked: false,
    category: 'mastery'
  }
];
