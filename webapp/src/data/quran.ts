// Curated short Quranic surahs with audio (Mishary Rashid Alafasy via mp3quran.net)
export type Surah = {
  id: number;
  name: string;
  arabicName: string;
  transliteration: string;
  meaning: string;
  ayahCount: number;
  audioUrl: string;
  arabic: string;
  translation: string;
};

const audio = (n: number) =>
  `https://server8.mp3quran.net/afs/${String(n).padStart(3, "0")}.mp3`;

export const shortSurahs: Surah[] = [
  {
    id: 1,
    name: "Al-Fatiha",
    arabicName: "الفاتحة",
    transliteration: "Al-Fātiḥah",
    meaning: "The Opening",
    ayahCount: 7,
    audioUrl: audio(1),
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
    translation:
      "In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgement. You alone we worship, and You alone we ask for help. Guide us on the straight path — the path of those You have blessed, not of those who incurred wrath, nor of those who went astray.",
  },
  {
    id: 112,
    name: "Al-Ikhlas",
    arabicName: "الإخلاص",
    transliteration: "Al-Ikhlāṣ",
    meaning: "Sincerity",
    ayahCount: 4,
    audioUrl: audio(112),
    arabic:
      "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
    translation:
      "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent.",
  },
  {
    id: 113,
    name: "Al-Falaq",
    arabicName: "الفلق",
    transliteration: "Al-Falaq",
    meaning: "The Daybreak",
    ayahCount: 5,
    audioUrl: audio(113),
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
    translation:
      "Say: I seek refuge in the Lord of daybreak — from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
  },
  {
    id: 114,
    name: "An-Nas",
    arabicName: "الناس",
    transliteration: "An-Nās",
    meaning: "Mankind",
    ayahCount: 6,
    audioUrl: audio(114),
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
    translation:
      "Say: I seek refuge in the Lord of mankind — the King of mankind, the God of mankind — from the evil of the retreating whisperer, who whispers into the hearts of mankind, from among jinn and men.",
  },
  {
    id: 109,
    name: "Al-Kafirun",
    arabicName: "الكافرون",
    transliteration: "Al-Kāfirūn",
    meaning: "The Disbelievers",
    ayahCount: 6,
    audioUrl: audio(109),
    arabic:
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ ﴿١﴾ لَا أَعْبُدُ مَا تَعْبُدُونَ ﴿٢﴾ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٣﴾ وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ ﴿٤﴾ وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٥﴾ لَكُمْ دِينُكُمْ وَلِيَ دِينِ ﴿٦﴾",
    translation:
      "Say: O disbelievers, I do not worship what you worship. Nor are you worshippers of what I worship. Nor will I be a worshipper of what you worship. Nor will you be worshippers of what I worship. For you is your religion, and for me is my religion.",
  },
  {
    id: 108,
    name: "Al-Kawthar",
    arabicName: "الكوثر",
    transliteration: "Al-Kawthar",
    meaning: "Abundance",
    ayahCount: 3,
    audioUrl: audio(108),
    arabic:
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾ فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾",
    translation:
      "Indeed, We have granted you, [O Muhammad], al-Kawthar. So pray to your Lord and sacrifice. Indeed, your enemy is the one cut off.",
  },
  {
    id: 110,
    name: "An-Nasr",
    arabicName: "النصر",
    transliteration: "An-Naṣr",
    meaning: "The Victory",
    ayahCount: 3,
    audioUrl: audio(110),
    arabic:
      "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ﴿١﴾ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴿٢﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا ﴿٣﴾",
    translation:
      "When the victory of Allah has come and the conquest, and you see the people entering into the religion of Allah in multitudes — then exalt with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.",
  },
  {
    id: 103,
    name: "Al-Asr",
    arabicName: "العصر",
    transliteration: "Al-ʿAṣr",
    meaning: "The Time",
    ayahCount: 3,
    audioUrl: audio(103),
    arabic:
      "وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ﴿٢﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾",
    translation:
      "By time, indeed mankind is in loss — except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
  },
];
