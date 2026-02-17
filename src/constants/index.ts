// Website Configuration
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quranlake.com';
export const BASE_URL = SITE_URL;

export const QuranAyahsQuotes = [
    {
      "arabic": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "surah": "الفاتحة",
      "ayah": 5
    },
    {
      "arabic": "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      "surah": "طه",
      "ayah": 114
    },
    {
      "arabic": "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      "surah": "البقرة",
      "ayah": 153
    },
    {
      "arabic": "وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ",
      "surah": "الحجر",
      "ayah": 99
    },
    {
      "arabic": "فَاذْكُرُونِي أَذْكُرْكُمْ",
      "surah": "البقرة",
      "ayah": 152
    },
    {
      "arabic": "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
      "surah": "هود",
      "ayah": 88
    },
    {
      "arabic": "وَلَا تَيْأَسُوا مِن رَّحْمَةِ اللَّهِ",
      "surah": "الزمر",
      "ayah": 53
    },
    {
      "arabic": "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      "surah": "الشرح",
      "ayah": 6
    },
    {
      "arabic": "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ",
      "surah": "التوبة",
      "ayah": 105
    },
    {
      "arabic": "فَإِذَا فَرَغْتَ فَانصَبْ وَإِلَىٰ رَبِّكَ فَارْغَبْ",
      "surah": "الشرح",
      "ayah": "7-8"
    }
  ]


  export const randomQuranAyahQuote = () => {
    const { arabic, surah, ayah } = QuranAyahsQuotes[Math.floor(Math.random() * QuranAyahsQuotes.length)];
    return { arabic, surah, ayah };
  }
  