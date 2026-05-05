export const ledgerEntries = [
  {
    id: 'bayou-medical-technologies',
    name: 'Bayou Medical Technologies',
    type: 'group',
    shortDefinition: 'The company Delphine represents when she arrives at Restoration Care.',
    fullDescription:
      'Bayou Medical Technologies presents itself as part of the changing future of medical practice, offering tools and products meant to ease the burden on healers.',
    firstChapter: 3,
    aliases: ['Bayou Medical Technologies'],
    tags: ['medicine', 'technology', 'outside-force'],
    timeline: [
      {
        chapter: 3,
        title: 'Delphine arrives',
        summary:
          'Delphine introduces Bayou Medical Technologies while delivering samples and Ray Marrow spectacles to Restoration Care.',
      },
    ],
  },
  {
    id: 'blue-dusk',
    name: 'Blue Dusk',
    type: 'event',
    shortDefinition: 'A social gathering tied to young people, courtship, and village tradition.',
    fullDescription:
      'Blue Dusk is a recurring social event where young people dress, promenade, and begin stepping into adult attention and courtship.',
    firstChapter: 2,
    aliases: ['Blue Dusk', 'Blue'],
    tags: ['custom', 'youth', 'courtship'],
    timeline: [
      {
        chapter: 2,
        title: 'Teenage anticipation',
        summary:
          'Nathaniel and Christopher talk about what they will wear and who they will talk to at Blue Dusk.',
      },
      {
        chapter: 3,
        title: 'Future meeting point',
        summary:
          "Delphine says she expects to speak with Michel'le again at the Blue Dusk gathering.",
      },
      {
        chapter: 4,
        title: 'First cycle to promenade',
        summary:
          'Blue Dusk is framed as a major moment for young people debuting into the social rhythm of the church and village.',
      },
    ],
  },
  {
    id: 'blue-hill-medical',
    name: 'Blue Hill Medical',
    type: 'group',
    shortDefinition: 'A growing medical outfit promoting new tools and treatments.',
    fullDescription:
      'Blue Hill Medical is connected to the push for new medical technology and advertises itself as the future of medicine.',
    firstChapter: 3,
    aliases: ['Blue Hill Medical'],
    tags: ['medicine', 'technology', 'competition'],
    timeline: [
      {
        chapter: 3,
        title: 'Growing up yonder',
        summary:
          'Delphine points to Blue Hill Medical as proof that medical practice is changing quickly.',
      },
      {
        chapter: 4,
        title: 'Flyers everywhere',
        summary:
          'People in Hillpoint are seeing flyers for Blue Hill Medical, promising treatments from Low Lung Cough care to fast casting broken limbs.',
      },
    ],
  },
  {
    id: 'celeste',
    name: 'Celeste',
    type: 'person',
    shortDefinition: 'A frightened woman who brings her injured husband to Restoration Care.',
    fullDescription:
      'Celeste arrives in a panic after her husband Treyveon is trampled by an out-of-control carriage. Her fear frames the emergency that opens the story.',
    firstChapter: 1,
    aliases: ['Celeste'],
    tags: ['patient-family', 'hillpoint'],
    relationships: [
      { type: 'spouse', target: 'treyveon', label: 'Wife of Treyveon' },
    ],
    timeline: [
      {
        chapter: 1,
        title: 'Emergency arrival',
        summary:
          "Brings Treyveon to Restoration Care after the accident and witnesses the narrator's grace at work.",
      },
    ],
  },
  {
    id: 'chioma',
    name: 'Chioma',
    type: 'term',
    shortDefinition: 'A formal title for someone blessed with healing grace.',
    fullDescription:
      'Chioma is the formal title outsiders use for healers blessed with grace. In Hillpoint, the narrator is usually known more personally than formally.',
    firstChapter: 3,
    aliases: ['Chioma', 'the Chioma', 'Chioma of the village'],
    tags: ['healing', 'faith', 'title'],
    relationships: [
      { type: 'role', target: 'narrator', label: 'The narrator is the Chioma of Hillpoint' },
      { type: 'related-concept', target: 'grace', label: 'Chioma are connected to grace' },
    ],
    timeline: [
      {
        chapter: 3,
        title: 'Formal address',
        summary:
          "Delphine addresses the narrator as Chioma Michel'le, revealing both a title and the narrator's name.",
      },
      {
        chapter: 4,
        title: 'Only Chioma in the village',
        summary:
          "Michel'le describes herself as the only Chioma in Hillpoint while discussing Blue Hill Medical with Sister Lakethia.",
      },
    ],
  },
  {
    id: 'christopher',
    name: 'Christopher',
    type: 'person',
    shortDefinition: "One of Michel'le and Jon's teenage sons.",
    fullDescription:
      'Christopher helps around Restoration Care, though his teenage energy and attention do not always match the seriousness of the moment.',
    firstChapter: 1,
    aliases: ['Christopher'],
    tags: ['family', 'restoration-care', 'teen'],
    relationships: [
      { type: 'parent', target: 'narrator', label: "Son of Michel'le" },
      { type: 'parent', target: 'jon', label: 'Son of Jon' },
      { type: 'sibling', target: 'nathaniel', label: 'Brother of Nathaniel' },
    ],
    timeline: [
      {
        chapter: 1,
        title: 'In the middle of the emergency',
        summary:
          "Searches for tools during Treyveon's emergency, adding to the chaos around the narrator.",
      },
      {
        chapter: 2,
        title: 'Teenage son',
        summary:
          "Michel'le reflects on Christopher and Nathaniel as teenage sons: old enough to help, distracted enough to make the practice harder.",
      },
      {
        chapter: 4,
        title: 'Distracted again',
        summary:
          "Christopher is absorbed by the illusion on the gray box when Michel'le needs him to get ready for the supply trip.",
      },
    ],
  },
  {
    id: 'church',
    name: 'The Church',
    type: 'group',
    shortDefinition: "The familiar Christian faith community present in Hillpoint's social life.",
    fullDescription:
      'The Church is a familiar nondenominational Christian-style institution in this alternate world. It has recognizable faith roots while leaving room for its own traditions, rituals, and groups to be revealed later.',
    firstChapter: 4,
    aliases: ['Church', 'church'],
    tags: ['faith', 'community'],
    timeline: [
      {
        chapter: 4,
        title: 'Blue Dusk energy',
        summary:
          'The church community has young people preparing to debut at Blue Dusk, tying faith community and village customs together.',
      },
    ],
  },
  {
    id: 'constable',
    name: 'Constable',
    type: 'term',
    shortDefinition: 'A civic role mentioned in local news.',
    fullDescription:
      'The Constable is referenced through local scandal broadcast by echophone. The office may matter more as Hillpoint civic life develops.',
    firstChapter: 4,
    aliases: ['Constable', 'the Constable'],
    tags: ['civic', 'hillpoint'],
    timeline: [
      {
        chapter: 4,
        title: 'Local scandal',
        summary:
          'A child with an echophone blares news that includes a scandal involving the Constable.',
      },
    ],
  },
  {
    id: 'credits',
    name: 'Credits',
    type: 'term',
    shortDefinition: 'The currency exchanged for care, supplies, and work.',
    fullDescription:
      "Credits are the practical currency of Hillpoint's economy. Chapter 1 shows how scarce they can be when Celeste and Treyveon offer what little they have.",
    firstChapter: 1,
    aliases: ['credits'],
    tags: ['economy', 'hillpoint'],
    timeline: [
      {
        chapter: 1,
        title: 'Payment under strain',
        summary:
          "Celeste and Treyveon can only offer a small amount after emergency treatment, reinforcing the village's hardship.",
      },
      {
        chapter: 4,
        title: 'Work and supplies',
        summary:
          'Jon earns credits through odd jobs around town before helping in the practice, and those credits matter for supply runs.',
      },
    ],
  },
  {
    id: 'cycle',
    name: 'Cycle',
    type: 'term',
    shortDefinition: "The world's equivalent of a year.",
    fullDescription:
      'Cycle is the in-world unit used where readers might expect year, especially around age, development, and social milestones.',
    firstChapter: 4,
    aliases: ['cycle', 'cycles'],
    tags: ['time', 'worldbuilding'],
    timeline: [
      {
        chapter: 4,
        title: 'First cycle to promenade',
        summary:
          "Jasia's first cycle to promenade at Blue Dusk introduces cycle as a social/time marker.",
      },
    ],
  },
  {
    id: 'delphine',
    name: 'Delphine',
    type: 'person',
    shortDefinition: 'A representative of Bayou Medical Technologies.',
    fullDescription:
      "Delphine arrives at Restoration Care with samples, a sales pitch, and a direct interest in Michel'le as Hillpoint's Chioma.",
    firstChapter: 3,
    aliases: ['Delphine'],
    tags: ['bayou-medical-technologies', 'outside-force'],
    relationships: [
      { type: 'represents', target: 'bayou-medical-technologies', label: 'Represents Bayou Medical Technologies' },
    ],
    timeline: [
      {
        chapter: 3,
        title: 'Unwanted pitch',
        summary:
          "Approaches Michel'le after hours to promote medical technology and leaves expecting a future conversation at Blue Dusk.",
      },
    ],
  },
  {
    id: 'echophone',
    name: 'Echophone',
    type: 'object',
    shortDefinition: 'A device used to broadcast news and announcements.',
    fullDescription:
      'An echophone lets a child loudly promote news around The Nexus, including scores, scandals, Blue Dusk, the Hillpoint Fair, and other local items.',
    firstChapter: 4,
    aliases: ['echophone'],
    tags: ['technology', 'communication', 'hillpoint'],
    timeline: [
      {
        chapter: 4,
        title: 'News in the market',
        summary:
          'A child with an echophone blares local updates near the ferry queue at The Nexus.',
      },
    ],
  },
  {
    id: 'ernestine',
    name: 'Ernestine',
    type: 'person',
    shortDefinition: "Old Gerald's wife, known through village gossip for potions and brews.",
    fullDescription:
      'Ernestine is tied to Old Gerald through marriage and village gossip. She is described as handy with potions and brews.',
    firstChapter: 4,
    aliases: ['Ernestine'],
    tags: ['hillpoint', 'family', 'potions'],
    relationships: [
      { type: 'spouse', target: 'gerald', label: 'Wife of Old Gerald' },
    ],
    timeline: [
      {
        chapter: 4,
        title: 'Gossip around Gerald',
        summary:
          "Village gossip suggests Ernestine's knowledge of potions and brews may be relevant to Gerald's stomach trouble.",
      },
    ],
  },
  {
    id: 'gerald',
    name: 'Old Gerald',
    type: 'person',
    shortDefinition: 'A Hillpoint patient treated for an abnormal stomach ache.',
    fullDescription:
      'Old Gerald is treated at Restoration Care while village gossip swirls about his behavior and his wife Ernestine.',
    firstChapter: 4,
    aliases: ['Gerald', 'Old Gerald'],
    tags: ['hillpoint', 'patient'],
    relationships: [
      { type: 'spouse', target: 'ernestine', label: 'Husband of Ernestine' },
    ],
    timeline: [
      {
        chapter: 4,
        title: 'Stomach trouble',
        summary:
          "Comes to Restoration Care for an abnormal stomach ache and receives medicine from Michel'le.",
      },
    ],
  },
  {
    id: 'gizmotronics',
    name: 'Gizmotronics',
    type: 'term',
    shortDefinition: 'A catchall term for newer devices and technological medical tools.',
    fullDescription:
      'Gizmotronics names the kind of new mechanical/technological help being advertised as an alternative or supplement to traditional healing.',
    firstChapter: 4,
    aliases: ['gizmotronics'],
    tags: ['technology', 'medicine', 'worldbuilding'],
    timeline: [
      {
        chapter: 4,
        title: 'Not everything can be replaced',
        summary:
          "Michel'le pushes back on the idea that technology and gizmotronics can replace everything the Favored do.",
      },
    ],
  },
  {
    id: 'god',
    name: 'God',
    type: 'term',
    shortDefinition: "The divine source Michel'le serves and credits for grace.",
    fullDescription:
      "God is central to Michel'le's understanding of her healing work, her purpose, and the grace she draws on while treating patients.",
    firstChapter: 1,
    aliases: ['God', 'His'],
    tags: ['faith', 'grace', 'purpose'],
    timeline: [
      {
        chapter: 1,
        title: 'Source of grace',
        summary:
          "The narrator refers to her healing power as God-given grace and frames Restoration Care as service by His grace.",
      },
    ],
  },
  {
    id: 'grace',
    name: 'Grace',
    type: 'term',
    shortDefinition: "The God-given healing power Michel'le reaches for while treating patients.",
    fullDescription:
      "Grace is the spiritual and healing force Michel'le draws on during care. It can feel present, strained, or slippery depending on her state and the situation.",
    firstChapter: 1,
    aliases: ['grace', 'God given grace', 'well of grace'],
    tags: ['healing', 'faith', 'lore'],
    timeline: [
      {
        chapter: 1,
        title: 'A slippery well',
        summary:
          "The narrator reaches for her grace to heal Treyveon and notices it does not feel as steady as usual.",
      },
      {
        chapter: 3,
        title: 'Still low',
        summary:
          "Michel'le continues to feel tired and low on grace as new technology and outside pressure arrive at Restoration Care.",
      },
    ],
  },
  {
    id: 'gray-box-illustrator',
    name: 'Gray Box',
    revealName: 'Illustrator',
    nameRevealedChapter: null,
    type: 'object',
    shortDefinition: 'A device that shows moving illusions.',
    fullDescription:
      'People refer to the moving images as illusions coming from a gray box. Illustrator is the in-world name for this TV-like technology, to be revealed in-story later.',
    firstChapter: 3,
    aliases: ['gray box', 'illusion', 'illusions', 'Illustrator'],
    tags: ['technology', 'entertainment'],
    timeline: [
      {
        chapter: 3,
        title: 'Moving illusions',
        summary:
          "Michel'le sees watching illusions on the gray box as entertaining but not restorative.",
      },
      {
        chapter: 4,
        title: 'Teen distraction',
        summary:
          'Christopher and Jrue are both distracted by the illusion on the wall during treatment.',
      },
    ],
  },
  {
    id: 'hillpoint',
    name: 'Hillpoint',
    type: 'place',
    shortDefinition: "The small village where Michel'le and her family live and work.",
    fullDescription:
      'Hillpoint is the small village surrounding Restoration Care. Chapter 4 names it directly and begins mapping its families, dock, market, river, farmlands, and hills.',
    firstChapter: 4,
    aliases: ['Hillpoint', 'village'],
    tags: ['village', 'setting'],
    timeline: [
      {
        chapter: 4,
        title: 'The village named',
        summary:
          "Michel'le describes Hillpoint as a small village not far outside of town, with families who have lived there for generations.",
      },
    ],
  },
  {
    id: 'hillpoint-fair',
    name: 'Hillpoint Fair',
    type: 'event',
    shortDefinition: 'A local event mentioned in Hillpoint news.',
    fullDescription:
      'The Hillpoint Fair is part of the local news cycle broadcast near The Nexus, suggesting a larger calendar of village events.',
    firstChapter: 4,
    aliases: ['Hillpoint Fair'],
    tags: ['hillpoint', 'event'],
    timeline: [
      {
        chapter: 4,
        title: 'Local news item',
        summary:
          'The Hillpoint Fair is one of the items shouted through the echophone near the ferry queue.',
      },
    ],
  },
  {
    id: 'jasia',
    name: 'Jasia',
    type: 'person',
    shortDefinition: "Sister Lakethia's daughter, preparing for her first cycle to promenade.",
    fullDescription:
      "Jasia is Sister Lakethia's daughter. She shows interest in Nathaniel, whose awkward response reveals his trouble with words.",
    firstChapter: 4,
    aliases: ['Jasia'],
    tags: ['hillpoint', 'youth', 'blue-dusk'],
    relationships: [
      { type: 'parent', target: 'sister-lakethia', label: 'Daughter of Sister Lakethia' },
      { type: 'sibling', target: 'jrue', label: 'Sister of Jrue' },
    ],
    timeline: [
      {
        chapter: 4,
        title: 'Awkward moment with Nathaniel',
        summary:
          'Tells Nathaniel she cannot wait to see him at Blue Dusk, only for him to stumble into an awkward response.',
      },
    ],
  },
  {
    id: 'jon',
    name: 'Jon',
    type: 'person',
    shortDefinition:
      "Michel'le's husband. Helpful, charming, occasionally asleep when he should not be.",
    fullDescription:
      "Jon is Michel'le's husband and partner in the rhythm of family and Restoration Care. He brings humor and help, even when the timing is imperfect.",
    firstChapter: 1,
    aliases: ['Jon', 'Dad', 'your dad', 'your Dad'],
    tags: ['family', 'restoration-care'],
    relationships: [
      { type: 'spouse', target: 'narrator', label: "Husband of Michel'le" },
      { type: 'parent', target: 'nathaniel', label: 'Father of Nathaniel' },
      { type: 'parent', target: 'christopher', label: 'Father of Christopher' },
    ],
    timeline: [
      {
        chapter: 1,
        title: 'Emergency helper',
        summary:
          "Grabs tools during Treyveon's emergency and later takes over stitching once the narrator has stabilized him.",
      },
      {
        chapter: 2,
        title: 'Asleep on the job',
        summary:
          'Falls asleep while the operating room still needs to be reset, then tries to smooth things over with dinner.',
      },
      {
        chapter: 3,
        title: 'Protective interruption',
        summary:
          "Steps between Michel'le and Delphine, cutting off the pitch and ushering the strangers away.",
      },
      {
        chapter: 4,
        title: 'Morning odd jobs',
        summary:
          'Spends mornings repairing, building, or doing odd jobs around town for credits before helping in the practice.',
      },
    ],
  },
  {
    id: 'jrue',
    name: 'Jrue',
    type: 'person',
    shortDefinition: "Sister Lakethia's son, treated for a sprained ankle.",
    fullDescription:
      "Jrue comes to Restoration Care with Sister Lakethia after spraining his ankle while playing ball.",
    firstChapter: 4,
    aliases: ['Jrue'],
    tags: ['hillpoint', 'patient', 'youth'],
    relationships: [
      { type: 'parent', target: 'sister-lakethia', label: 'Son of Sister Lakethia' },
      { type: 'sibling', target: 'jasia', label: 'Brother of Jasia' },
    ],
    timeline: [
      {
        chapter: 4,
        title: 'Sprained ankle',
        summary:
          "Michel'le treats Jrue's sprained ankle while he and Christopher remain distracted by the illusion on the wall.",
      },
    ],
  },
  {
    id: 'low-lung-cough',
    name: 'Low Lung Cough',
    type: 'term',
    shortDefinition: 'An illness mentioned in Blue Hill Medical advertising.',
    fullDescription:
      'Low Lung Cough is one of the conditions Blue Hill Medical claims its new technology can treat.',
    firstChapter: 4,
    aliases: ['Low Lung Cough'],
    tags: ['illness', 'medicine'],
    timeline: [
      {
        chapter: 4,
        title: 'Advertised treatment',
        summary:
          'Sister Lakethia mentions Blue Hill Medical flyers advertising treatment for Low Lung Cough and fast casting broken limbs.',
      },
    ],
  },
  {
    id: 'mysterious-flyer-man',
    name: 'Mysterious Flyer Man',
    type: 'person',
    shortDefinition: 'A man passing out Blue Hill Medical flyers at the ferry.',
    fullDescription:
      "A man rushes through the ferry line handing out Blue Hill Medical flyers, then stares and smiles directly at Michel'le as the ferry departs.",
    firstChapter: 4,
    aliases: ['gentleman', 'flyer man', 'Mysterious Flyer Man'],
    tags: ['blue-hill-medical', 'mystery'],
    timeline: [
      {
        chapter: 4,
        title: 'The flyer',
        summary:
          "Hands flyers to everyone in line and appears to single Michel'le out with a direct stare and smile.",
      },
    ],
  },
  {
    id: 'narrator',
    name: 'The Narrator',
    revealName: "Michel'le",
    nameRevealedChapter: 3,
    type: 'person',
    shortDefinition: "The healer narrating the story, later revealed as Michel'le.",
    fullDescription:
      "The narrator is the central healer of the story. She stays focused under pressure, drawing on grace while balancing family, faith, and responsibility. Her name is revealed as Michel'le in Chapter 3.",
    firstChapter: 1,
    aliases: ["Michel'le", 'Michelle', 'the Chioma'],
    tags: ['narrator', 'healer', 'restoration-care', 'family'],
    relationships: [
      { type: 'spouse', target: 'jon', label: 'Wife of Jon' },
      { type: 'parent', target: 'nathaniel', label: 'Mother of Nathaniel' },
      { type: 'parent', target: 'christopher', label: 'Mother of Christopher' },
      { type: 'role', target: 'chioma', label: 'Chioma of Hillpoint' },
    ],
    timeline: [
      {
        chapter: 1,
        title: 'Breathe. Assess. Pressure. Inspect. Approximate.',
        summary:
          'Silently repeats a process to steady herself during Treyveon\'s emergency.',
      },
      {
        chapter: 1,
        title: 'The calm within the storm',
        summary:
          'Stabilizes Treyveon during a chaotic emergency by focusing herself and reaching for her grace.',
      },
      {
        chapter: 3,
        title: 'Name revealed',
        summary:
          "Delphine addresses her as Chioma Michel'le, revealing the narrator's name and formal title.",
      },
      {
        chapter: 4,
        title: 'Purpose in Hillpoint',
        summary:
          "Reflects that she is the only Chioma in the village and understands her purpose in Hillpoint.",
      },
    ],
  },
  {
    id: 'nathaniel',
    name: 'Nathaniel',
    type: 'person',
    shortDefinition: "One of Michel'le and Jon's teenage sons.",
    fullDescription:
      'Nathaniel helps around Restoration Care, but nerves and social pressure often leave him saying the wrong thing.',
    firstChapter: 1,
    aliases: ['Nathaniel'],
    tags: ['family', 'restoration-care', 'teen'],
    relationships: [
      { type: 'parent', target: 'narrator', label: "Son of Michel'le" },
      { type: 'parent', target: 'jon', label: 'Son of Jon' },
      { type: 'sibling', target: 'christopher', label: 'Brother of Christopher' },
    ],
    timeline: [
      {
        chapter: 1,
        title: 'Trying to help',
        summary:
          "Attempts to calm Celeste during Treyveon's emergency, but says the wrong things under pressure.",
      },
      {
        chapter: 2,
        title: 'Teenage son',
        summary:
          "Michel'le reflects on Nathaniel and Christopher as teenage sons: old enough to help, distracted enough to make the practice harder.",
      },
      {
        chapter: 4,
        title: 'Bad with words again',
        summary:
          'Responds awkwardly when Jasia says she cannot wait to see him at Blue Dusk.',
      },
    ],
  },
  {
    id: 'nexus',
    name: 'The Nexus',
    type: 'place',
    shortDefinition: "The dock, market, and causeway area that forms Hillpoint's heartbeat.",
    fullDescription:
      'The Nexus is the connection point of Hillpoint: the dock, market, and causeway where village movement, trade, ferry access, and local news converge.',
    firstChapter: 4,
    aliases: ['The Nexus', 'Nexus', 'dock market', 'dock', 'market', 'causeway'],
    tags: ['hillpoint', 'market', 'travel'],
    timeline: [
      {
        chapter: 4,
        title: 'Heartbeat of the village',
        summary:
          "Michel'le describes the dock, market, and causeway as The Nexus, the connection and heartbeat of Hillpoint.",
      },
    ],
  },
  {
    id: 'promenade',
    name: 'Promenade',
    type: 'event',
    shortDefinition: 'A Blue Dusk custom tied to young people entering public social attention.',
    fullDescription:
      'Promenade is the social custom at Blue Dusk where young people dress, move through the gathering, and become visible in a new way.',
    firstChapter: 2,
    aliases: ['promenade', 'debut'],
    tags: ['custom', 'blue-dusk', 'youth'],
    timeline: [
      {
        chapter: 2,
        title: 'Memory of youth',
        summary:
          "Michel'le remembers being young at Blue Dusk, choosing what to wear and promenading around the plateau.",
      },
      {
        chapter: 4,
        title: 'First cycle',
        summary:
          "Jasia's first cycle to promenade marks a social milestone tied to Blue Dusk.",
      },
    ],
  },
  {
    id: 'ray-marrow-spectacles',
    name: 'Ray Marrow Spectacles',
    type: 'object',
    shortDefinition: 'A tool that lets the wearer see bone through skin.',
    fullDescription:
      'Ray Marrow spectacles are offered by Delphine as a sample of new medical technology, promising convenience and reduced burden for healers.',
    firstChapter: 3,
    aliases: ['Ray Marrow spectacles', 'Ray spectacles', 'Ray Marrow'],
    tags: ['technology', 'medicine', 'blue-hill-medical'],
    timeline: [
      {
        chapter: 3,
        title: 'Gift from Delphine',
        summary:
          "Delphine leaves Ray Marrow spectacles with Michel'le as an example of the technology coming through Blue Hill Medical and Bayou Medical Technologies.",
      },
    ],
  },
  {
    id: 'restoration-care',
    name: 'Restoration Care',
    type: 'place',
    shortDefinition: "Michel'le's care facility in Hillpoint.",
    fullDescription:
      "Restoration Care is the local care facility where Michel'le treats patients with limited supplies, practical medicine, and grace.",
    firstChapter: 1,
    aliases: ['Restoration Care', 'care facility', 'facility', 'practice'],
    tags: ['hillpoint', 'medicine', 'healing'],
    timeline: [
      {
        chapter: 1,
        title: 'Emergency room',
        summary:
          "The story opens inside Restoration Care during Treyveon's emergency treatment.",
      },
      {
        chapter: 2,
        title: 'Under strain',
        summary:
          'The practice is low on supplies, energy, credits, and patience after the emergency.',
      },
      {
        chapter: 4,
        title: 'Community care hub',
        summary:
          'A methodical morning of checkups shows Restoration Care as both medical practice and village gossip hub.',
      },
    ],
  },
  {
    id: 'rosa-river',
    name: 'Rosa River',
    type: 'place',
    shortDefinition: 'The river tied to Blue Dusk memories and Hillpoint geography.',
    fullDescription:
      "The Rosa River appears first in Michel'le's memory of Blue Dusk and later helps define Hillpoint's geography.",
    firstChapter: 2,
    aliases: ['Rosa River'],
    tags: ['place', 'hillpoint', 'blue-dusk'],
    timeline: [
      {
        chapter: 2,
        title: 'Blue Dusk memory',
        summary:
          "Michel'le remembers jumping into the Rosa River with Jon when they were young.",
      },
      {
        chapter: 4,
        title: 'Village shape',
        summary:
          'The river curves and twists through Hillpoint, splitting the farmlands from the steep hills.',
      },
    ],
  },
  {
    id: 'silvie',
    name: 'Silvie',
    type: 'person',
    shortDefinition: "A woman Michel'le plans to see before Blue Dusk preparations.",
    fullDescription:
      "Silvie wants Michel'le to look at a few things while helping get girls ready for Blue Dusk.",
    firstChapter: 3,
    aliases: ['Silvie'],
    tags: ['hillpoint', 'blue-dusk'],
    timeline: [
      {
        chapter: 3,
        title: 'Blue Dusk preparations',
        summary:
          "Michel'le plans to close early so she can see Silvie and help with matters before Blue Dusk.",
      },
    ],
  },
  {
    id: 'sister-lakethia',
    name: 'Sister Lakethia',
    type: 'person',
    shortDefinition: 'A church woman who brings her children to Restoration Care.',
    fullDescription:
      "Sister Lakethia brings Jrue in for a sprained ankle and uses the visit to talk with Michel'le about village news, Blue Hill Medical, and Blue Dusk.",
    firstChapter: 4,
    aliases: ['Sister Lakethia', 'Lakethia'],
    tags: ['church', 'hillpoint', 'patient-family'],
    relationships: [
      { type: 'parent', target: 'jrue', label: 'Mother of Jrue' },
      { type: 'parent', target: 'jasia', label: 'Mother of Jasia' },
    ],
    timeline: [
      {
        chapter: 4,
        title: 'News and checkup',
        summary:
          "Brings Jrue and Jasia to Restoration Care and talks with Michel'le about Blue Hill Medical flyers and Blue Dusk.",
      },
    ],
  },
  {
    id: 'treyveon',
    name: 'Treyveon',
    type: 'person',
    shortDefinition: "Celeste's husband and the first emergency patient shown in the story.",
    fullDescription:
      "Treyveon is badly injured after being trampled while protecting Celeste. His treatment introduces the narrator's role as a healer.",
    firstChapter: 1,
    aliases: ['Treyveon'],
    tags: ['patient', 'hillpoint'],
    relationships: [
      { type: 'spouse', target: 'celeste', label: 'Husband of Celeste' },
    ],
    timeline: [
      {
        chapter: 1,
        title: 'Carriage accident',
        summary:
          'Arrives at Restoration Care with a fractured leg and severe abdominal wound after protecting Celeste.',
      },
    ],
  },
  {
    id: 'warden',
    name: 'Warden',
    type: 'person',
    shortDefinition: 'A local figure connected to a supply shed Jon plans to work on.',
    fullDescription:
      "The Warden is mentioned through Jon's plan to finish work on the Warden's supply shed before taking Christopher into town.",
    firstChapter: 3,
    aliases: ['Warden', 'the Warden'],
    tags: ['hillpoint', 'work'],
    timeline: [
      {
        chapter: 3,
        title: 'Supply shed work',
        summary:
          "Jon plans to finish the Warden's supply shed before using credits for the supply trip.",
      },
    ],
  },
];

export const ledgerTypes = [
  'person',
  'place',
  'term',
  'group',
  'object',
  'event',
];
