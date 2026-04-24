export type AdhkarCategory = "morning" | "evening" | "after-salah" | "sleep" | "general";

export type Adhkar = {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  count: number;
  important?: boolean;
};

export const categoryMeta: Record<
  AdhkarCategory,
  { title: string; arabicTitle: string; description: string; icon: string }
> = {
  morning: {
    title: "Morning",
    arabicTitle: "أذكار الصباح",
    description: "Begin your day with remembrance",
    icon: "sunrise",
  },
  evening: {
    title: "Evening",
    arabicTitle: "أذكار المساء",
    description: "Seal your day with gratitude",
    icon: "sunset",
  },
  "after-salah": {
    title: "After Salah",
    arabicTitle: "أذكار بعد الصلاة",
    description: "Remembrance after each prayer",
    icon: "moon-star",
  },
  sleep: {
    title: "Before Sleep",
    arabicTitle: "أذكار النوم",
    description: "Rest under divine protection",
    icon: "bed",
  },
  general: {
    title: "General Dhikr",
    arabicTitle: "الأذكار العامة",
    description: "Continuous remembrance",
    icon: "sparkles",
  },
};

export const adhkarData: Record<AdhkarCategory, Adhkar[]> = {
  morning: [
    {
      id: "m1",
      arabic:
        "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۚ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
      transliteration:
        "Allāhu lā ilāha illā huwa, al-ḥayyul-qayyūm. Lā taʾkhudhuhu sinatun wa lā nawm...",
      translation:
        "Allah! There is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him.",
      reference: "Ayat al-Kursi — Al-Baqarah 2:255",
      count: 1,
      important: true,
    },
    {
      id: "m2",
      arabic:
        "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      transliteration:
        "Aṣbaḥnā wa aṣbaḥal-mulku lillāh, walḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah.",
      translation:
        "We have reached the morning and at this very time the dominion belongs to Allah. Praise be to Allah. There is no god but Allah, alone, without partner.",
      reference: "Muslim 2723",
      count: 1,
    },
    {
      id: "m3",
      arabic:
        "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
      transliteration:
        "Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr.",
      translation:
        "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
      reference: "Tirmidhi 3391",
      count: 1,
    },
    {
      id: "m4",
      arabic:
        "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Subḥān Allāhi wa biḥamdih.",
      translation: "Glory be to Allah and praise be to Him.",
      reference: "Muslim 2692",
      count: 100,
      important: true,
    },
    {
      id: "m5",
      arabic:
        "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      transliteration:
        "Bismillāhilladhī lā yaḍurru maʿasmihi shayʾun fil-arḍi wa lā fis-samāʾi wa huwas-samīʿul-ʿalīm.",
      translation:
        "In the name of Allah with whose name nothing is harmed on earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
      reference: "Abu Dawud 5088",
      count: 3,
    },
    {
      id: "m6",
      arabic:
        "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
      transliteration:
        "Ḥasbiyallāhu lā ilāha illā huwa, ʿalayhi tawakkaltu wa huwa rabbul-ʿarshil-ʿaẓīm.",
      translation:
        "Allah is sufficient for me. There is no deity but Him. In Him I place my trust, and He is the Lord of the Mighty Throne.",
      reference: "Abu Dawud 5081",
      count: 7,
    },
  ],
  evening: [
    {
      id: "e1",
      arabic:
        "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      transliteration:
        "Amsaynā wa amsal-mulku lillāh, walḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah.",
      translation:
        "We have reached the evening and at this very time the dominion belongs to Allah. Praise be to Allah.",
      reference: "Muslim 2723",
      count: 1,
      important: true,
    },
    {
      id: "e2",
      arabic:
        "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
      transliteration:
        "Allāhumma mā amsā bī min niʿmatin aw bi-aḥadin min khalqika faminka waḥdaka lā sharīka lak, falakal-ḥamdu wa lakash-shukr.",
      translation:
        "O Allah, whatever blessing has come to me or any of Your creation is from You alone, without partner. So all praise and thanks are for You.",
      reference: "Abu Dawud 5073",
      count: 1,
    },
    {
      id: "e3",
      arabic:
        "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      transliteration: "Aʿūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq.",
      translation:
        "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      reference: "Muslim 2708",
      count: 3,
      important: true,
    },
    {
      id: "e4",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      transliteration:
        "Allāhumma innī asʾalukal-ʿafwa wal-ʿāfiyata fid-dunyā wal-ākhirah.",
      translation:
        "O Allah, I ask You for pardon and well-being in this life and the Hereafter.",
      reference: "Ibn Majah 3871",
      count: 1,
    },
    {
      id: "e5",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Subḥān Allāhi wa biḥamdih.",
      translation: "Glory be to Allah and praise be to Him.",
      reference: "Muslim 2692",
      count: 100,
    },
  ],
  "after-salah": [
    {
      id: "s1",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullāh.",
      translation: "I seek forgiveness from Allah.",
      reference: "Muslim 591",
      count: 3,
      important: true,
    },
    {
      id: "s2",
      arabic:
        "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
      transliteration:
        "Allāhumma antas-salāmu wa minkas-salām, tabārakta yā dhal-jalāli wal-ikrām.",
      translation:
        "O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.",
      reference: "Muslim 591",
      count: 1,
    },
    {
      id: "s3",
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "Subḥān Allāh.",
      translation: "Glory be to Allah.",
      reference: "Muslim 596",
      count: 33,
    },
    {
      id: "s4",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alḥamdu lillāh.",
      translation: "All praise is for Allah.",
      reference: "Muslim 596",
      count: 33,
    },
    {
      id: "s5",
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allāhu Akbar.",
      translation: "Allah is the Greatest.",
      reference: "Muslim 596",
      count: 34,
    },
    {
      id: "s6",
      arabic:
        "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration:
        "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr.",
      translation:
        "There is no god but Allah alone, without partner. To Him belongs sovereignty and praise, and He has power over all things.",
      reference: "Muslim 597",
      count: 1,
    },
  ],
  sleep: [
    {
      id: "n1",
      arabic:
        "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismikallāhumma amūtu wa aḥyā.",
      translation: "In Your name, O Allah, I die and I live.",
      reference: "Bukhari 6324",
      count: 1,
      important: true,
    },
    {
      id: "n2",
      arabic:
        "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      transliteration: "Allāhumma qinī ʿadhābaka yawma tabʿathu ʿibādak.",
      translation:
        "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
      reference: "Abu Dawud 5045",
      count: 3,
    },
    {
      id: "n3",
      arabic:
        "سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (34)",
      transliteration: "Subḥān Allāh × 33, Alḥamdu lillāh × 33, Allāhu Akbar × 34.",
      translation:
        "Glory be to Allah, All praise is for Allah, Allah is the Greatest — recited before sleep.",
      reference: "Bukhari 3705",
      count: 1,
    },
    {
      id: "n4",
      arabic:
        "اللَّهُمَّ بِاسْمِكَ وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا",
      transliteration:
        "Allāhumma bismika waḍaʿtu janbī, wa bika arfaʿuh, in amsakta nafsī farḥamhā, wa in arsaltahā faḥfaẓhā.",
      translation:
        "O Allah, in Your name I lay down my side, and by You I rise. If You take my soul, have mercy on it, and if You release it, protect it.",
      reference: "Bukhari 6320",
      count: 1,
    },
  ],
  general: [
    {
      id: "g1",
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
      transliteration: "Lā ilāha illallāh.",
      translation: "There is no deity but Allah.",
      reference: "Tirmidhi 3585",
      count: 100,
      important: true,
    },
    {
      id: "g2",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
      transliteration: "Subḥān Allāhi wa biḥamdih, Subḥān Allāhil-ʿaẓīm.",
      translation:
        "Glory be to Allah and praise be to Him; Glory be to Allah the Magnificent.",
      reference: "Bukhari 6406",
      count: 100,
    },
    {
      id: "g3",
      arabic:
        "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "Lā ḥawla wa lā quwwata illā billāh.",
      translation: "There is no power nor strength except with Allah.",
      reference: "Bukhari 6384",
      count: 100,
    },
    {
      id: "g4",
      arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      transliteration: "Astaghfirullāha wa atūbu ilayh.",
      translation: "I seek forgiveness from Allah and turn to Him in repentance.",
      reference: "Bukhari 6307",
      count: 100,
    },
    {
      id: "g5",
      arabic:
        "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      transliteration: "Allāhumma ṣalli wa sallim ʿalā nabiyyinā Muḥammad.",
      translation: "O Allah, send blessings and peace upon our Prophet Muhammad ﷺ.",
      reference: "Muslim 408",
      count: 10,
      important: true,
    },
  ],
};
