/**
 * Real-audio podcast episodes (mp3 in front/public/audio/podcasts).
 * sentences[].start/end are seconds in the mp3 (aligned with speech recognition / TTS segment durations).
 * Negative order + publishedAt put these first and mark them as new.
 */
export const audioPodcasts = [
  {
    "slug": "why-we-dream",
    "title": "Why Do We Dream?",
    "titleAz": "Niyə yuxu görürük?",
    "level": "B1",
    "alsoFor": [
      "A2",
      "B2"
    ],
    "minutes": 3,
    "durationSec": 152,
    "accent": "lilac",
    "order": -10,
    "audioUrl": "/audio/podcasts/why-we-dream.mp3",
    "transcriptAvailable": true,
    "publishedAt": "2026-11-04T18:21:01.357Z",
    "summary": "Every night you go to a cinema inside your head. Why does the brain make dreams, why do we forget them, and can you control them?",
    "summaryAz": "Hər gecə başının içindəki kinoya gedirsən. Beyin niyə yuxu yaradır və niyə onları unuduruq?",
    "sentences": [
      {
        "speaker": "Host",
        "en": "Hello, and welcome to Ingri English Podcast. Last night, you probably went to a cinema. A very strange cinema. You were the director, the actor and the audience. And when you woke up, you forgot almost everything. Today, we're talking about dreams.",
        "az": "Salam, Ingri English Podcast-a xoş gəldin. Dünən gecə yəqin ki, kinoya getmisən. Çox qəribə bir kinoya. Rejissor da, aktyor da, tamaşaçı da sən idin. Oyananda isə demək olar ki, hər şeyi unutdun. Bu gün yuxular haqqında danışırıq.",
        "start": 0,
        "end": 17.8
      },
      {
        "speaker": "Host",
        "en": "Here's a fun fact to start. Everybody dreams, every single night, even people who say they never dream. On average, we have four to six dreams a night. Over a lifetime, that's about six years of dreaming!",
        "az": "Başlamaq üçün maraqlı fakt: hamı hər gecə yuxu görür, hətta heç yuxu görmədiyini deyənlər də. Orta hesabla gecədə dörd-altı yuxu görürük. Ömür boyu bu, təxminən altı il yuxu deməkdir!",
        "start": 17.8,
        "end": 34.34
      },
      {
        "speaker": "Host",
        "en": "Most of our dreams happen during a stage of sleep called REM. That stands for Rapid Eye Movement, because your eyes move quickly under your eyelids, as if you are watching a film. At the same time, your body is almost paralysed. That's actually a good thing. It stops you from running around the bedroom while you dream about football.",
        "az": "Yuxularımızın çoxu REM adlanan yuxu mərhələsində olur. Bu, sürətli göz hərəkəti deməkdir, çünki gözlərin göz qapaqlarının altında film izləyirmiş kimi tez hərəkət edir. Eyni zamanda bədənin demək olar ki, iflic olur. Bu, əslində yaxşıdır: futbol haqqında yuxu görəndə yataq otağında qaçmağına mane olur.",
        "start": 34.34,
        "end": 55.96
      },
      {
        "speaker": "Host",
        "en": "So why do we dream? Scientists still don't know for sure, but they have some good ideas. One idea is that dreams help us store memories. While you sleep, your brain sorts the day, keeps the important things and throws away the rest.",
        "az": "Bəs niyə yuxu görürük? Alimlər hələ dəqiq bilmir, amma yaxşı fikirləri var. Bir fikrə görə yuxular xatirələri saxlamağa kömək edir. Sən yatarkən beynin günü çeşidləyir, vacib şeyləri saxlayır, qalanını atır.",
        "start": 55.96,
        "end": 74.46
      },
      {
        "speaker": "Host",
        "en": "Another idea is that dreams are like a practice room. In a dream, you can face danger without real risk. That might be why so many people dream about being chased or falling. The brain is training for difficult moments.",
        "az": "Başqa bir fikrə görə yuxular məşq otağı kimidir. Yuxuda real risk olmadan təhlükə ilə üzləşə bilərsən. Bəlkə də buna görə çox adam qovulduğunu və ya yıxıldığını görür. Beyin çətin anlara hazırlaşır.",
        "start": 74.46,
        "end": 90.96
      },
      {
        "speaker": "Host",
        "en": "Dreams can even be creative. The scientist Dmitri Mendeleev said he saw the periodic table in a dream. And Paul McCartney woke up with the melody of the song Yesterday already in his head.",
        "az": "Yuxular hətta yaradıcı da ola bilər. Alim Dmitri Mendeleyev dövri cədvəli yuxuda gördüyünü deyib. Pol Makkartni isə “Yesterday” mahnısının melodiyası başında oyanıb.",
        "start": 90.96,
        "end": 105.68
      },
      {
        "speaker": "Host",
        "en": "So why do we forget them so quickly? During REM sleep, the part of the brain that saves new memories is not very active. If you want to remember your dreams, keep a notebook next to your bed and write them down the moment you wake up.",
        "az": "Bəs niyə onları belə tez unuduruq? REM yuxusunda yeni xatirələri saxlayan beyin hissəsi o qədər də aktiv olmur. Yuxularını xatırlamaq istəyirsənsə, yatağının yanında dəftər saxla və oyanan kimi yaz.",
        "start": 105.68,
        "end": 121.84
      },
      {
        "speaker": "Host",
        "en": "And finally, some people can have lucid dreams. That means they know they are dreaming, and sometimes they can even control the dream. Imagine flying over the city, just because you decided to. Sweet dreams!",
        "az": "Nəhayət, bəzi insanlar aydın yuxu görə bilir. Yəni yuxu gördüklərini bilirlər və bəzən hətta yuxunu idarə edə bilirlər. Təsəvvür et, sadəcə qərar verdiyin üçün şəhərin üstündə uçursan. Şirin yuxular!",
        "start": 121.84,
        "end": 137.12
      },
      {
        "speaker": "Host",
        "en": "Today's key words: dream, stage, eyelid, paralysed, memory, sort, chase, melody, notebook, lucid. Thanks for listening to Ingri English Podcast. See you next time!",
        "az": "Bugünkü açar sözlər. Ingri English Podcast-ı dinlədiyin üçün sağ ol. Növbəti dəfəyədək!",
        "start": 137.12,
        "end": 152.03
      }
    ],
    "glossary": [
      {
        "en": "dream",
        "az": "yuxu görmək; yuxu",
        "example": "I had a strange dream last night."
      },
      {
        "en": "stage",
        "az": "mərhələ",
        "example": "REM is a stage of sleep."
      },
      {
        "en": "eyelid",
        "az": "göz qapağı",
        "example": "Your eyes move under your eyelids."
      },
      {
        "en": "paralysed",
        "az": "iflic olmuş, hərəkətsiz",
        "example": "During REM, the body is almost paralysed."
      },
      {
        "en": "memory",
        "az": "xatirə, yaddaş",
        "example": "Sleep helps your memory."
      },
      {
        "en": "sort",
        "az": "çeşidləmək",
        "example": "The brain sorts the events of the day."
      },
      {
        "en": "chase",
        "az": "qovmaq, təqib etmək",
        "example": "I dreamed a dog was chasing me."
      },
      {
        "en": "melody",
        "az": "melodiya",
        "example": "He woke up with a melody in his head."
      },
      {
        "en": "notebook",
        "az": "dəftər",
        "example": "Keep a notebook next to your bed."
      },
      {
        "en": "lucid",
        "az": "aydın, şüurlu",
        "example": "In a lucid dream, you know you are dreaming."
      }
    ],
    "quiz": [
      {
        "prompt": "How many dreams do we have on average each night?",
        "promptAz": "Orta hesabla gecədə neçə yuxu görürük?",
        "options": [
          "One",
          "Four to six",
          "Twenty",
          "None"
        ],
        "answer": 1,
        "explain": "Four to six dreams a night.",
        "explainAz": "Gecədə dörd-altı yuxu."
      },
      {
        "prompt": "What does REM stand for?",
        "promptAz": "REM nə deməkdir?",
        "options": [
          "Rapid Eye Movement",
          "Real Easy Memory",
          "Rest Every Minute",
          "Random Energy Mode"
        ],
        "answer": 0,
        "explain": "Rapid Eye Movement.",
        "explainAz": "Sürətli göz hərəkəti."
      },
      {
        "prompt": "Why is the body almost paralysed during REM?",
        "promptAz": "REM zamanı bədən niyə demək olar ki, iflic olur?",
        "options": [
          "Because we are tired",
          "So we don't act out our dreams",
          "Because it is cold",
          "To help digestion"
        ],
        "answer": 1,
        "explain": "It stops you from moving while you dream.",
        "explainAz": "Yuxu görərkən hərəkət etməyinə mane olur."
      },
      {
        "prompt": "Which song came to Paul McCartney in a dream?",
        "promptAz": "Hansı mahnı Pol Makkartniyə yuxuda gəldi?",
        "options": [
          "Let It Be",
          "Hey Jude",
          "Yesterday",
          "Help!"
        ],
        "answer": 2,
        "explain": "He woke up with the melody of Yesterday.",
        "explainAz": "O, “Yesterday”-in melodiyası ilə oyandı."
      },
      {
        "prompt": "What is a lucid dream?",
        "promptAz": "Aydın yuxu nədir?",
        "options": [
          "A very short dream",
          "A dream you know is a dream",
          "A dream about light",
          "A nightmare"
        ],
        "answer": 1,
        "explain": "You know you are dreaming.",
        "explainAz": "Yuxu gördüyünü bilirsən."
      }
    ]
  },
  {
    "slug": "deep-ocean-mysteries",
    "title": "Into the Deep: Mysteries of the Dark Ocean",
    "titleAz": "Dərinliyə: qaranlıq okeanın sirləri",
    "level": "B1",
    "alsoFor": [
      "A2",
      "B2"
    ],
    "minutes": 3,
    "durationSec": 149,
    "accent": "aqua",
    "order": -9,
    "audioUrl": "/audio/podcasts/deep-ocean-mysteries.mp3",
    "transcriptAvailable": true,
    "publishedAt": "2026-11-04T18:21:01.357Z",
    "summary": "We know more about the Moon than our own ocean floor. Dive into the dark with glowing fish, giant squid and the deepest place on Earth.",
    "summaryAz": "Biz Ay haqqında öz okean dibimizdən çox bilirik. İşıq saçan balıqlar və nəhəng kalmarla dərinliyə en.",
    "sentences": [
      {
        "speaker": "Host",
        "en": "Hello, and welcome to Ingri English Podcast. Close your eyes for a moment. You're inside a small submarine, going down, down, down. The blue water turns dark blue, then black. There's no sunlight here at all. Welcome to the deep ocean.",
        "az": "Salam, Ingri English Podcast-a xoş gəldin. Bir anlıq gözlərini yum. Kiçik bir sualtı qayıqdasan, aşağı, aşağı enirsən. Mavi su tünd maviyə, sonra qaraya çevrilir. Burada heç günəş işığı yoxdur. Dərin okeana xoş gəldin.",
        "start": 0,
        "end": 17.18
      },
      {
        "speaker": "Host",
        "en": "Here's a surprising fact. The ocean covers more than seventy percent of our planet, but we have explored only a small part of it. Some scientists say we have better maps of the Moon and Mars than of our own ocean floor.",
        "az": "Təəccüblü fakt: okean planetimizin yetmiş faizindən çoxunu örtür, amma biz onun yalnız kiçik hissəsini araşdırmışıq. Bəzi alimlər deyir ki, Ayın və Marsın xəritələri öz okean dibimizin xəritələrindən daha yaxşıdır.",
        "start": 17.18,
        "end": 32.34
      },
      {
        "speaker": "Host",
        "en": "The deepest place on Earth is the Challenger Deep, in the Pacific Ocean. It's almost eleven kilometres down. If you put Mount Everest there, its top would still be under more than two kilometres of water. The pressure is incredible, like having an elephant standing on your thumb.",
        "az": "Yer üzünün ən dərin yeri Sakit okeandakı Çellencer çökəkliyidir. Təxminən on bir kilometr dərinlikdədir. Everesti ora qoysan, zirvəsi yenə iki kilometrdən çox suyun altında qalar. Təzyiq inanılmazdır, sanki baş barmağının üstündə fil durur.",
        "start": 32.34,
        "end": 50.72
      },
      {
        "speaker": "Host",
        "en": "More people have walked on the Moon than have visited the Challenger Deep. Twelve people walked on the Moon, but for many years only a few brave explorers reached the bottom of the ocean.",
        "az": "Aya ayaq basan insanlar Çellencer çökəkliyinə gedənlərdən çoxdur. Ayda on iki nəfər gəzib, amma uzun illər okean dibinə yalnız bir neçə cəsur tədqiqatçı çatıb.",
        "start": 50.72,
        "end": 63.22
      },
      {
        "speaker": "Host",
        "en": "And yet, there is life down there. Lots of it. Many deep-sea animals make their own light. This is called bioluminescence. The anglerfish has a little glowing light on its head, like a fishing rod. Small fish swim towards the light, and then, snap! Dinner.",
        "az": "Və yenə də orada həyat var, özü də çox. Dərin dəniz heyvanlarının çoxu öz işığını yaradır. Buna bioluminessensiya deyilir. Balıqçı balığının başında balıq tilovu kimi kiçik işıq var. Balaca balıqlar işığa tərəf üzür və sonra, şap! Şam yeməyi.",
        "start": 63.22,
        "end": 82.7
      },
      {
        "speaker": "Host",
        "en": "Then there's the giant squid, a real sea monster. It can be as long as a bus, and it has the biggest eyes in the animal kingdom, as big as a dinner plate. For centuries, sailors told stories about it, but nobody filmed a living one until two thousand and four.",
        "az": "Bir də nəhəng kalmar var, əsl dəniz canavarı. Avtobus uzunluğunda ola bilər və heyvanlar aləmində ən böyük gözlərə sahibdir, nahar boşqabı boyda. Əsrlər boyu dənizçilər onun haqqında hekayələr danışıb, amma 2004-cü ilə qədər heç kim canlısını lentə almamışdı.",
        "start": 82.7,
        "end": 102.1
      },
      {
        "speaker": "Host",
        "en": "Every year, scientists discover new species in the deep ocean. Some look like aliens from a science fiction film. There are worms that live next to hot volcanic vents, where the water is hotter than three hundred degrees.",
        "az": "Hər il alimlər dərin okeanda yeni növlər kəşf edir. Bəziləri elmi-fantastik filmdən çıxmış yadplanetlilərə oxşayır. Suyun üç yüz dərəcədən isti olduğu vulkanik çatların yanında yaşayan qurdlar var.",
        "start": 102.1,
        "end": 118.34
      },
      {
        "speaker": "Host",
        "en": "So the next time you look at the sea, remember: under those waves there is a dark, quiet world full of secrets, waiting to be explored. Maybe one day, you will be the one who discovers them.",
        "az": "Növbəti dəfə dənizə baxanda xatırla: o dalğaların altında kəşf olunmağı gözləyən, sirlərlə dolu qaranlıq, sakit bir dünya var. Bəlkə bir gün onları kəşf edən sən olacaqsan.",
        "start": 118.34,
        "end": 132.66
      },
      {
        "speaker": "Host",
        "en": "Today's key words: submarine, explore, ocean floor, pressure, brave, glow, fishing rod, giant, species, wave. Thanks for listening to Ingri English Podcast. See you next time!",
        "az": "Bugünkü açar sözlər. Ingri English Podcast-ı dinlədiyin üçün sağ ol. Növbəti dəfəyədək!",
        "start": 132.66,
        "end": 148.56
      }
    ],
    "glossary": [
      {
        "en": "submarine",
        "az": "sualtı qayıq",
        "example": "The submarine went down into the dark."
      },
      {
        "en": "explore",
        "az": "araşdırmaq, kəşf etmək",
        "example": "We have explored only a small part of the ocean."
      },
      {
        "en": "ocean floor",
        "az": "okean dibi",
        "example": "The ocean floor is very deep."
      },
      {
        "en": "pressure",
        "az": "təzyiq",
        "example": "The pressure at the bottom is incredible."
      },
      {
        "en": "brave",
        "az": "cəsur",
        "example": "Only a few brave explorers went there."
      },
      {
        "en": "glow",
        "az": "işıq saçmaq",
        "example": "Some fish glow in the dark."
      },
      {
        "en": "fishing rod",
        "az": "balıq tilovu",
        "example": "The light looks like a fishing rod."
      },
      {
        "en": "giant",
        "az": "nəhəng",
        "example": "The giant squid is as long as a bus."
      },
      {
        "en": "species",
        "az": "növ",
        "example": "Scientists find new species every year."
      },
      {
        "en": "wave",
        "az": "dalğa",
        "example": "There is a hidden world under the waves."
      }
    ],
    "quiz": [
      {
        "prompt": "How much of our planet does the ocean cover?",
        "promptAz": "Okean planetimizin nə qədərini örtür?",
        "options": [
          "About 30%",
          "More than 70%",
          "Exactly 50%",
          "10%"
        ],
        "answer": 1,
        "explain": "More than seventy percent.",
        "explainAz": "Yetmiş faizdən çox."
      },
      {
        "prompt": "How deep is the Challenger Deep?",
        "promptAz": "Çellencer çökəkliyi nə qədər dərindir?",
        "options": [
          "About 1 km",
          "About 5 km",
          "Almost 11 km",
          "50 km"
        ],
        "answer": 2,
        "explain": "Almost eleven kilometres.",
        "explainAz": "Təxminən on bir kilometr."
      },
      {
        "prompt": "What is bioluminescence?",
        "promptAz": "Bioluminessensiya nədir?",
        "options": [
          "Animals making their own light",
          "A kind of submarine",
          "Very cold water",
          "A type of fish food"
        ],
        "answer": 0,
        "explain": "Living things making light.",
        "explainAz": "Canlıların işıq yaratması."
      },
      {
        "prompt": "How big are the giant squid's eyes?",
        "promptAz": "Nəhəng kalmarın gözləri nə boydadır?",
        "options": [
          "Like a coin",
          "Like a dinner plate",
          "Like a car",
          "Like an apple seed"
        ],
        "answer": 1,
        "explain": "As big as a dinner plate.",
        "explainAz": "Nahar boşqabı boyda."
      },
      {
        "prompt": "When was a living giant squid first filmed?",
        "promptAz": "Canlı nəhəng kalmar ilk dəfə nə vaxt lentə alındı?",
        "options": [
          "1904",
          "1969",
          "2004",
          "2020"
        ],
        "answer": 2,
        "explain": "Not until 2004.",
        "explainAz": "2004-cü ilə qədər yox."
      }
    ]
  },
  {
    "slug": "how-cats-choose-their-humans",
    "title": "How Cats Choose Their Humans",
    "titleAz": "Pişiklər insanlarını necə seçir",
    "level": "B1",
    "alsoFor": [
      "A2",
      "B2"
    ],
    "minutes": 3,
    "durationSec": 154,
    "accent": "peach",
    "order": -8,
    "audioUrl": "/audio/podcasts/how-cats-choose-their-humans.mp3",
    "transcriptAvailable": true,
    "publishedAt": "2026-11-04T18:21:01.357Z",
    "summary": "You didn't adopt your cat. Your cat adopted you. Slow blinks, head bumps and the secret meaning of a meow.",
    "summaryAz": "Sən pişiyi seçmədin, pişik səni seçdi. Yavaş göz qırpma, baş sürtmə və miyovun gizli mənası.",
    "sentences": [
      {
        "speaker": "Host",
        "en": "Hello, and welcome to Ingri English Podcast. Have you ever been to a party where a cat walks past everyone who loves cats, and jumps straight onto the lap of the one person who says, I don't really like cats? Today we're asking: how do cats choose their humans?",
        "az": "Salam, Ingri English Podcast-a xoş gəldin. Heç olubmu ki, qonaqlıqda pişik pişiksevərlərin hamısının yanından keçib düz “mən pişikləri o qədər sevmirəm” deyən adamın qucağına tullansın? Bu gün soruşuruq: pişiklər insanlarını necə seçir?",
        "start": 0,
        "end": 17.4
      },
      {
        "speaker": "Host",
        "en": "Let's start with history. Dogs were domesticated by humans. But many scientists think cats domesticated themselves. About ten thousand years ago, people started farming and storing grain. Grain attracted mice, and mice attracted wild cats. The cats stayed because it was a good deal for everyone.",
        "az": "Tarixdən başlayaq. İtləri insanlar əhliləşdirib. Amma bir çox alim düşünür ki, pişiklər özlərini əhliləşdirib. Təxminən on min il əvvəl insanlar əkinçiliklə məşğul olub taxıl saxlamağa başladılar. Taxıl siçanları, siçanlar da vəhşi pişikləri cəlb etdi. Pişiklər qaldı, çünki bu, hamı üçün sərfəli idi.",
        "start": 18,
        "end": 38.78
      },
      {
        "speaker": "Host",
        "en": "So, back to the party. Why did the cat choose the person who ignored it? For a cat, a direct stare can feel like a threat. Cat lovers often look at the cat, call it and reach for it. The person who doesn't care just sits quietly. To a cat, that person seems calm and safe.",
        "az": "Qonaqlığa qayıdaq. Pişik niyə ona fikir verməyən adamı seçdi? Pişik üçün birbaşa baxış təhlükə kimi hiss oluna bilər. Pişiksevərlər çox vaxt pişiyə baxır, onu çağırır və ona əl uzadır. Vecinə olmayan adam isə sakitcə oturur. Pişiyə o adam sakit və təhlükəsiz görünür.",
        "start": 39.38,
        "end": 59.26
      },
      {
        "speaker": "Host",
        "en": "Want a cat to like you? Try the slow blink. Look at the cat, then close your eyes slowly and open them again. In cat language, this means: I trust you. In a study, cats were more likely to come to people who slow-blinked at them. It's like a cat smile.",
        "az": "Pişiyin səni sevməsini istəyirsən? Yavaş göz qırpmanı yoxla. Pişiyə bax, sonra gözlərini yavaşca yum və yenidən aç. Pişik dilində bu, “sənə güvənirəm” deməkdir. Bir araşdırmada pişiklər onlara yavaş göz qırpan insanlara daha çox yaxınlaşıb. Bu, pişik təbəssümü kimidir.",
        "start": 59.86,
        "end": 77.98
      },
      {
        "speaker": "Host",
        "en": "When a cat bumps its head against you, it isn't just being cute. Cats have scent glands on their cheeks. They are marking you with their smell, saying: this human is mine. Congratulations, you belong to a cat.",
        "az": "Pişik başını sənə sürtəndə sadəcə şirinlik etmir. Pişiklərin yanaqlarında qoxu vəziləri var. Səni öz qoxuları ilə nişanlayır və deyir: bu insan mənimdir. Təbriklər, sən bir pişiyə məxsussan.",
        "start": 78.58,
        "end": 92.28
      },
      {
        "speaker": "Host",
        "en": "Here's a fun fact. Adult cats almost never meow at other cats. They save meowing mostly for humans. Over time, each cat develops its own special meows for its own person. Your cat has, in a way, invented a language just for you.",
        "az": "Maraqlı fakt: yetkin pişiklər demək olar ki, heç vaxt başqa pişiklərə miyovlamır. Miyovlamağı əsasən insanlar üçün saxlayırlar. Zamanla hər pişik öz insanı üçün xüsusi miyovlar yaradır. Pişiyin, bir növ, yalnız sənin üçün dil icad edib.",
        "start": 92.88,
        "end": 110.54
      },
      {
        "speaker": "Host",
        "en": "Purring is another mystery. Cats purr when they are happy, but also sometimes when they are hurt or stressed. Some scientists think the vibration of purring may even help bones heal faster.",
        "az": "Mırıldamaq başqa bir sirrdir. Pişiklər xoşbəxt olanda mırıldayır, amma bəzən ağrıyanda və ya stresdə olanda da. Bəzi alimlər düşünür ki, mırıltının titrəyişi hətta sümüklərin tez sağalmasına kömək edə bilər.",
        "start": 111.14,
        "end": 123.89
      },
      {
        "speaker": "Host",
        "en": "So, if a cat sleeps on your bed, follows you from room to room, or brings you a little present, even a not-so-nice one, take it as a compliment. You didn't choose your cat. Your cat chose you.",
        "az": "Deməli, pişik sənin yatağında yatırsa, otaqdan otağa arxanca gəzirsə və ya sənə kiçik hədiyyə gətirirsə, hətta o qədər də xoş olmayanını, bunu kompliment kimi qəbul et. Sən pişiyi seçmədin. Pişik səni seçdi.",
        "start": 124.49,
        "end": 138
      },
      {
        "speaker": "Host",
        "en": "Today's key words: lap, domesticate, grain, attract, ignore, stare, threat, trust, purr, compliment. Thanks for listening to Ingri English Podcast. See you next time!",
        "az": "Bugünkü açar sözlər. Ingri English Podcast-ı dinlədiyin üçün sağ ol. Növbəti dəfəyədək!",
        "start": 138.6,
        "end": 154.07
      }
    ],
    "glossary": [
      {
        "en": "lap",
        "az": "qucaq (oturanda dizlərin üstü)",
        "example": "The cat jumped onto my lap."
      },
      {
        "en": "domesticate",
        "az": "əhliləşdirmək",
        "example": "Humans domesticated dogs long ago."
      },
      {
        "en": "grain",
        "az": "taxıl",
        "example": "Farmers stored grain."
      },
      {
        "en": "attract",
        "az": "cəlb etmək",
        "example": "Grain attracted mice."
      },
      {
        "en": "ignore",
        "az": "fikir verməmək",
        "example": "He ignored the cat, and it loved him."
      },
      {
        "en": "stare",
        "az": "dik baxmaq",
        "example": "Cats don't like a direct stare."
      },
      {
        "en": "threat",
        "az": "təhlükə, hədə",
        "example": "A stare can feel like a threat."
      },
      {
        "en": "trust",
        "az": "güvənmək",
        "example": "A slow blink means 'I trust you'."
      },
      {
        "en": "purr",
        "az": "mırıldamaq (pişik)",
        "example": "My cat purrs when she is happy."
      },
      {
        "en": "compliment",
        "az": "kompliment, tərif",
        "example": "Take it as a compliment."
      }
    ],
    "quiz": [
      {
        "prompt": "Why did wild cats first come to human villages?",
        "promptAz": "Vəhşi pişiklər insan kəndlərinə ilk dəfə niyə gəldi?",
        "options": [
          "To find mice near the grain",
          "Because people called them",
          "To drink milk",
          "To sleep in houses"
        ],
        "answer": 0,
        "explain": "Grain attracted mice, mice attracted cats.",
        "explainAz": "Taxıl siçanları, siçanlar pişikləri cəlb etdi."
      },
      {
        "prompt": "Why do cats often choose people who ignore them?",
        "promptAz": "Pişiklər niyə çox vaxt onlara fikir verməyənləri seçir?",
        "options": [
          "Those people have food",
          "They seem calm and don't stare",
          "They are louder",
          "They smell like fish"
        ],
        "answer": 1,
        "explain": "A direct stare can feel like a threat.",
        "explainAz": "Birbaşa baxış təhlükə kimi hiss olunur."
      },
      {
        "prompt": "What does a slow blink mean in cat language?",
        "promptAz": "Pişik dilində yavaş göz qırpma nə deməkdir?",
        "options": [
          "I'm hungry",
          "Go away",
          "I trust you",
          "I'm sleepy"
        ],
        "answer": 2,
        "explain": "It means 'I trust you'.",
        "explainAz": "“Sənə güvənirəm” deməkdir."
      },
      {
        "prompt": "Why does a cat bump its head against you?",
        "promptAz": "Pişik niyə başını sənə sürtür?",
        "options": [
          "To mark you with its scent",
          "Because it has a headache",
          "To push you away",
          "To clean its face"
        ],
        "answer": 0,
        "explain": "Scent glands on its cheeks mark you as its human.",
        "explainAz": "Yanaqlarındakı qoxu vəziləri ilə səni nişanlayır."
      },
      {
        "prompt": "Who do adult cats mostly meow at?",
        "promptAz": "Yetkin pişiklər əsasən kimə miyovlayır?",
        "options": [
          "Other cats",
          "Dogs",
          "Humans",
          "Birds"
        ],
        "answer": 2,
        "explain": "They save meowing mostly for humans.",
        "explainAz": "Miyovlamağı əsasən insanlar üçün saxlayırlar."
      }
    ]
  },
  {
    "slug": "hidden-life-of-trees",
    "title": "The Hidden Life of Trees",
    "titleAz": "Ağacların gizli həyatı",
    "level": "B1",
    "alsoFor": [
      "A2",
      "B2"
    ],
    "minutes": 3,
    "durationSec": 152,
    "accent": "mint",
    "order": -7,
    "audioUrl": "/audio/podcasts/hidden-life-of-trees.mp3",
    "transcriptAvailable": true,
    "publishedAt": "2026-11-04T18:21:01.357Z",
    "summary": "Trees talk, share food and look after their children through an underground network scientists call the Wood Wide Web.",
    "summaryAz": "Ağaclar danışır, qida paylaşır və yeraltı şəbəkə vasitəsilə balalarına qayğı göstərir.",
    "sentences": [
      {
        "speaker": "Host",
        "en": "Hello, and welcome to Ingri English Podcast. Next time you walk through a forest, listen carefully. It seems quiet, doesn't it? But under your feet, the trees are having a busy conversation. Today, let's discover the hidden life of trees.",
        "az": "Salam, Ingri English Podcast-a xoş gəldin. Növbəti dəfə meşədən keçəndə diqqətlə qulaq as. Sakit görünür, elə deyilmi? Amma ayaqlarının altında ağaclar canlı söhbət edir. Bu gün ağacların gizli həyatını kəşf edək.",
        "start": 0,
        "end": 17.66
      },
      {
        "speaker": "Host",
        "en": "Trees are connected by a huge network underground. Their roots are linked by tiny threads of fungi, a kind of mushroom. Through this network, trees can send water, sugar and even warning messages to each other. Scientists have a funny name for it: the Wood Wide Web.",
        "az": "Ağaclar yerin altında nəhəng şəbəkə ilə bağlıdır. Kökləri göbələk növü olan kiçik göbələk sapları ilə birləşir. Bu şəbəkə vasitəsilə ağaclar bir-birinə su, şəkər və hətta xəbərdarlıq mesajları göndərə bilir. Alimlər ona gülməli ad veriblər: Meşə Geniş Şəbəkəsi, yəni Wood Wide Web.",
        "start": 18.26,
        "end": 36.94
      },
      {
        "speaker": "Host",
        "en": "A Canadian scientist named Suzanne Simard spent years studying this network. She found that the biggest, oldest trees in a forest act like mothers. She called them mother trees. They send extra food to young trees growing in the shade, where there isn't enough sunlight.",
        "az": "Suzanna Simard adlı kanadalı alim illərlə bu şəbəkəni öyrənib. O, meşədəki ən böyük, ən yaşlı ağacların analar kimi davrandığını tapıb. Onlara ana ağaclar deyib. Onlar kifayət qədər günəş işığı olmayan kölgədə böyüyən gənc ağaclara əlavə qida göndərir.",
        "start": 37.54,
        "end": 55.94
      },
      {
        "speaker": "Host",
        "en": "Trees also warn each other about danger. In Africa, when giraffes start eating acacia trees, the trees produce a bitter chemical in their leaves. They also release a gas into the air. Nearby trees smell it and start making the bitter chemical too, before the giraffes even arrive.",
        "az": "Ağaclar həm də bir-birini təhlükə barədə xəbərdar edir. Afrikada zürafələr akasiya ağaclarını yeməyə başlayanda ağaclar yarpaqlarında acı kimyəvi maddə yaradır. Havaya qaz da buraxırlar. Yaxındakı ağaclar onu hiss edir və zürafələr gəlməmiş özləri də acı maddə hazırlamağa başlayır.",
        "start": 56.54,
        "end": 75.38
      },
      {
        "speaker": "Host",
        "en": "Here's a fact that sounds impossible. Scientists once found an old tree stump in a forest. The tree was cut down hundreds of years ago, but the stump was still alive. How? The trees around it were feeding it sugar through their roots. They were keeping their old friend alive.",
        "az": "İnanılmaz səslənən bir fakt: alimlər bir dəfə meşədə köhnə kötük tapıblar. Ağac yüz illər əvvəl kəsilmişdi, amma kötük hələ də canlı idi. Necə? Ətrafdakı ağaclar kökləri ilə ona şəkər verirdi. Köhnə dostlarını yaşadırdılar.",
        "start": 75.98,
        "end": 94.44
      },
      {
        "speaker": "Host",
        "en": "Trees are also the oldest living things on our planet. A bristlecone pine tree in California is more than four thousand eight hundred years old. It was already old when the pyramids in Egypt were being built.",
        "az": "Ağaclar həm də planetimizin ən yaşlı canlılarıdır. Kaliforniyada bir şam ağacı dörd min səkkiz yüz ildən yaşlıdır. Misirdə piramidalar tikiləndə o artıq qoca idi.",
        "start": 95.04,
        "end": 107.86
      },
      {
        "speaker": "Host",
        "en": "And one more reason to love trees. Studies show that spending time in a forest can lower stress and help you feel calmer. In Japan, people even have a word for it: shinrin-yoku, or forest bathing. No water needed, just you and the trees.",
        "az": "Ağacları sevmək üçün daha bir səbəb: araşdırmalar göstərir ki, meşədə vaxt keçirmək stresi azalda və səni sakitləşdirə bilər. Yaponiyada bunun üçün hətta söz var: şinrin-yoku, yəni meşə vannası. Su lazım deyil, yalnız sən və ağaclar.",
        "start": 108.46,
        "end": 125.86
      },
      {
        "speaker": "Host",
        "en": "So the next time you see a forest, don't think of it as just a group of trees. Think of it as a family, talking, sharing and looking after each other.",
        "az": "Növbəti dəfə meşə görəndə onu sadəcə ağaclar dəstəsi kimi düşünmə. Onu danışan, paylaşan və bir-birinə qayğı göstərən bir ailə kimi düşün.",
        "start": 126.46,
        "end": 136.34
      },
      {
        "speaker": "Host",
        "en": "Today's key words: forest, root, network, fungi, shade, warn, bitter, stump, ancient, stress. Thanks for listening to Ingri English Podcast. See you next time!",
        "az": "Bugünkü açar sözlər. Ingri English Podcast-ı dinlədiyin üçün sağ ol. Növbəti dəfəyədək!",
        "start": 136.94,
        "end": 151.77
      }
    ],
    "glossary": [
      {
        "en": "forest",
        "az": "meşə",
        "example": "We walked through the forest."
      },
      {
        "en": "root",
        "az": "kök",
        "example": "Tree roots grow deep underground."
      },
      {
        "en": "network",
        "az": "şəbəkə",
        "example": "Trees are connected by a network."
      },
      {
        "en": "fungi",
        "az": "göbələklər",
        "example": "Fungi connect the roots of trees."
      },
      {
        "en": "shade",
        "az": "kölgə",
        "example": "Young trees grow in the shade."
      },
      {
        "en": "warn",
        "az": "xəbərdar etmək",
        "example": "Trees warn each other about danger."
      },
      {
        "en": "bitter",
        "az": "acı",
        "example": "The leaves become bitter."
      },
      {
        "en": "stump",
        "az": "kötük",
        "example": "The old stump was still alive."
      },
      {
        "en": "ancient",
        "az": "qədim, çox yaşlı",
        "example": "Some trees are ancient."
      },
      {
        "en": "stress",
        "az": "stres",
        "example": "A forest walk can lower stress."
      }
    ],
    "quiz": [
      {
        "prompt": "What connects the roots of trees underground?",
        "promptAz": "Ağacların köklərini yerin altında nə birləşdirir?",
        "options": [
          "Fungi",
          "Worms",
          "Water pipes",
          "Rocks"
        ],
        "answer": 0,
        "explain": "Tiny threads of fungi.",
        "explainAz": "Kiçik göbələk sapları."
      },
      {
        "prompt": "What do 'mother trees' do?",
        "promptAz": "'Ana ağaclar' nə edir?",
        "options": [
          "Cut other trees",
          "Send food to young trees",
          "Eat giraffes",
          "Make rain"
        ],
        "answer": 1,
        "explain": "They send extra food to young trees in the shade.",
        "explainAz": "Kölgədəki gənc ağaclara qida göndərir."
      },
      {
        "prompt": "How do acacia trees protect themselves from giraffes?",
        "promptAz": "Akasiya ağacları özlərini zürafələrdən necə qoruyur?",
        "options": [
          "They run away",
          "They make their leaves bitter",
          "They grow taller at night",
          "They drop all their leaves"
        ],
        "answer": 1,
        "explain": "They produce a bitter chemical and warn nearby trees.",
        "explainAz": "Acı maddə yaradır və qonşuları xəbərdar edir."
      },
      {
        "prompt": "Why was the old tree stump still alive?",
        "promptAz": "Köhnə kötük niyə hələ də canlı idi?",
        "options": [
          "It had new leaves",
          "People watered it",
          "Other trees fed it through their roots",
          "It was made of plastic"
        ],
        "answer": 2,
        "explain": "Neighbour trees fed it sugar.",
        "explainAz": "Qonşu ağaclar ona şəkər verirdi."
      },
      {
        "prompt": "What is 'shinrin-yoku'?",
        "promptAz": "'Şinrin-yoku' nədir?",
        "options": [
          "A Japanese tree",
          "Forest bathing",
          "A kind of mushroom",
          "A tea ceremony"
        ],
        "answer": 1,
        "explain": "Spending calm time in a forest.",
        "explainAz": "Meşədə sakit vaxt keçirmək."
      }
    ]
  },
  {
    "slug": "how-bees-talk",
    "title": "How Do Bees Talk?",
    "titleAz": "Arılar necə danışır?",
    "level": "A2",
    "alsoFor": [
      "B1"
    ],
    "minutes": 5,
    "accent": "peach",
    "order": -5,
    "audioUrl": "/audio/podcasts/how-bees-talk.mp3",
    "transcriptAvailable": true,
    "summary": "Bees can't speak, but they dance and use smells to share information. Learn the round dance, the waggle dance and 10 key words.",
    "summaryAz": "Arılar danışa bilmir, amma rəqs edərək və qoxu ilə məlumat paylaşırlar. Dairəvi rəqsi, “yırğalanma rəqsi”ni və 10 açar sözü öyrən.",
    "sentences": [
      {
        "speaker": "Host",
        "en": "Hello and welcome to Ingri English Podcast! I'm your host. Today we have a sweet topic. How do bees talk? Bees cannot speak like us. But they can share a lot of information. Let's find out how!",
        "az": "Salam, Ingri English Podcast-a xoş gəlmisiniz! Mən aparıcınızam. Bu gün şirin bir mövzumuz var. Arılar necə danışır? Arılar bizim kimi danışa bilmir. Amma çoxlu məlumat paylaşa bilirlər. Gəlin necə olduğunu öyrənək!",
        "start": 0,
        "end": 19.82
      },
      {
        "speaker": "Host",
        "en": "A honey bee lives in a big family called a colony. One colony can have fifty thousand bees. There is one queen. Most of the other bees are workers. The workers have many jobs. Some clean the hive. Some make honey. And some fly outside to look for food.",
        "az": "Bal arısı koloniya adlanan böyük ailədə yaşayır. Bir koloniyada əlli min arı ola bilər. Bir ana arı (kraliça) var. Qalan arıların çoxu işçi arılardır. İşçilərin çoxlu işi var. Bəziləri pətəyi təmizləyir. Bəziləri bal düzəldir. Bəziləri isə yemək axtarmaq üçün çölə uçur.",
        "start": 19.82,
        "end": 43.64
      },
      {
        "speaker": "Host",
        "en": "Imagine a worker bee finds a field full of flowers. The flowers have sweet nectar. That is great news! But how can she tell her sisters where the flowers are? She has no phone and no map. So, she dances!",
        "az": "Təsəvvür et ki, işçi arı çiçəklərlə dolu bir tarla tapır. Çiçəklərin şirin nektarı var. Bu, əla xəbərdir! Amma o, bacılarına çiçəklərin harada olduğunu necə deyə bilər? Onun telefonu da, xəritəsi də yoxdur. Ona görə də rəqs edir!",
        "start": 43.64,
        "end": 62.94
      },
      {
        "speaker": "Host",
        "en": "Yes, really. Bees dance to communicate. When the flowers are close to the hive, the bee does a round dance. She moves in small circles. The other bees understand: food is near, search around here.",
        "az": "Bəli, həqiqətən. Arılar ünsiyyət üçün rəqs edir. Çiçəklər pətəyə yaxın olanda arı dairəvi rəqs edir. O, kiçik dairələrlə hərəkət edir. Digər arılar başa düşür: yemək yaxındadır, buralarda axtarın.",
        "start": 62.94,
        "end": 80.36
      },
      {
        "speaker": "Host",
        "en": "When the flowers are far away, the bee does a waggle dance. She walks in a straight line and shakes her body from side to side. Then she turns and does it again. The direction of the line shows the direction of the flowers, compared to the sun. And the length of the waggle shows the distance. A long waggle means the food is far. A short waggle means it is closer.",
        "az": "Çiçəklər uzaqda olanda arı “yırğalanma rəqsi” edir. O, düz xətt üzrə yeriyir və bədənini sağa-sola silkələyir. Sonra dönür və bunu yenidən edir. Xəttin istiqaməti günəşə nisbətən çiçəklərin istiqamətini göstərir. Yırğalanmanın uzunluğu isə məsafəni göstərir. Uzun yırğalanma yeməyin uzaqda olduğunu bildirir. Qısa yırğalanma daha yaxın olduğunu bildirir.",
        "start": 80.36,
        "end": 108.82
      },
      {
        "speaker": "Host",
        "en": "This is amazing, isn't it? A tiny insect uses the sun like a compass. A scientist named Karl von Frisch discovered this secret. In nineteen seventy-three, he won the Nobel Prize for his work.",
        "az": "Heyrətamizdir, elə deyilmi? Kiçik bir həşərat günəşdən kompas kimi istifadə edir. Karl fon Friş adlı alim bu sirri kəşf edib. 1973-cü ildə o, bu işinə görə Nobel mükafatı qazanıb.",
        "start": 108.82,
        "end": 126.02
      },
      {
        "speaker": "Host",
        "en": "Bees also use smell to talk. The queen makes a special smell. It tells the colony: I am here, everything is okay. And when a bee feels danger, it makes a warning smell. Then other bees come to protect the hive.",
        "az": "Arılar danışmaq üçün qoxudan da istifadə edir. Ana arı xüsusi qoxu yayır. Bu, koloniyaya deyir: mən buradayam, hər şey qaydasındadır. Arı təhlükə hiss edəndə isə xəbərdarlıq qoxusu yayır. Onda digər arılar pətəyi qorumağa gəlir.",
        "start": 126.02,
        "end": 144.06
      },
      {
        "speaker": "Host",
        "en": "So next time you see a bee, remember. It is not just flying around. It is part of a smart, busy family that talks with dances and smells. Now, let's learn the key words from today's episode. Listen and repeat!",
        "az": "Növbəti dəfə arı görəndə yadına sal. O, sadəcə ətrafda uçmur. O, rəqs və qoxu ilə danışan ağıllı, çalışqan bir ailənin üzvüdür. İndi bugünkü epizodun açar sözlərini öyrənək. Dinlə və təkrar et!",
        "start": 144.06,
        "end": 166.76
      },
      {
        "speaker": "Host",
        "en": "hive · colony · worker · nectar · dance · direction · distance · compass · smell · danger",
        "az": "pətək · koloniya, arı ailəsi · işçi arı · çiçək nektarı · rəqs etmək · istiqamət · məsafə · kompas · qoxu · təhlükə",
        "start": 166.76,
        "end": 241.08
      },
      {
        "speaker": "Host",
        "en": "Great job! That's all for today. Keep learning, and see you next time on Ingri English Podcast. Bye!",
        "az": "Əla! Bu günlük bu qədər. Öyrənməyə davam et, növbəti dəfə Ingri English Podcast-da görüşənədək. Sağ ol!",
        "start": 241.08,
        "end": 254.57
      }
    ],
    "glossary": [
      {
        "en": "hive",
        "az": "pətək",
        "ipa": "/haɪv/"
      },
      {
        "en": "colony",
        "az": "koloniya, arı ailəsi",
        "ipa": "/ˈkɒləni/"
      },
      {
        "en": "worker",
        "az": "işçi arı",
        "ipa": "/ˈwɜːkə/"
      },
      {
        "en": "nectar",
        "az": "çiçək nektarı",
        "ipa": "/ˈnektə/"
      },
      {
        "en": "dance",
        "az": "rəqs etmək",
        "ipa": "/dɑːns/"
      },
      {
        "en": "direction",
        "az": "istiqamət",
        "ipa": "/dəˈrekʃn/"
      },
      {
        "en": "distance",
        "az": "məsafə",
        "ipa": "/ˈdɪstəns/"
      },
      {
        "en": "compass",
        "az": "kompas",
        "ipa": "/ˈkʌmpəs/"
      },
      {
        "en": "smell",
        "az": "qoxu",
        "ipa": "/smel/"
      },
      {
        "en": "danger",
        "az": "təhlükə",
        "ipa": "/ˈdeɪndʒə/"
      }
    ],
    "quiz": [
      {
        "prompt": "What does the round dance tell other bees?",
        "promptAz": "Dairəvi rəqs digər arılara nə deyir?",
        "options": [
          "The food is near the hive",
          "The food is very far",
          "The queen is sick",
          "It is going to rain"
        ],
        "answer": 0,
        "explain": "Round dance = food is close: search around here.",
        "explainAz": "Dairəvi rəqs = yemək yaxındadır, buralarda axtarın."
      },
      {
        "prompt": "In the waggle dance, what does the length of the waggle show?",
        "promptAz": "Yırğalanma rəqsində yırğalanmanın uzunluğu nəyi göstərir?",
        "options": [
          "The colour of the flowers",
          "The distance to the food",
          "The number of bees",
          "The time of day"
        ],
        "answer": 1,
        "explain": "A long waggle means far, a short waggle means closer.",
        "explainAz": "Uzun yırğalanma — uzaq, qısa — daha yaxın."
      },
      {
        "prompt": "The direction of the waggle line is compared to…",
        "promptAz": "Yırğalanma xəttinin istiqaməti nəyə nisbətən göstərilir?",
        "options": [
          "the moon",
          "the hive door",
          "the sun",
          "the wind"
        ],
        "answer": 2,
        "explain": "Bees use the sun like a compass.",
        "explainAz": "Arılar günəşdən kompas kimi istifadə edir."
      },
      {
        "prompt": "Who discovered the bee dance, and when did he win the Nobel Prize?",
        "promptAz": "Arı rəqsini kim kəşf edib və Nobel mükafatını nə vaxt alıb?",
        "options": [
          "Charles Darwin, 1859",
          "Karl von Frisch, 1973",
          "Marie Curie, 1911",
          "Karl von Frisch, 1937"
        ],
        "answer": 1,
        "explain": "Karl von Frisch won the Nobel Prize in 1973.",
        "explainAz": "Karl fon Friş 1973-cü ildə Nobel mükafatı qazanıb."
      },
      {
        "prompt": "Which sentence is TRUE?",
        "promptAz": "Hansı cümlə DOĞRUDUR?",
        "options": [
          "A colony can have up to 50,000 bees, and bees make a warning smell when they feel danger.",
          "A colony has five queens.",
          "Bees use phones and maps.",
          "Only the queen looks for food."
        ],
        "answer": 0,
        "explain": "Up to 50,000 bees; the queen's smell says 'all is okay'; a warning smell calls bees to protect the hive.",
        "explainAz": "50 000-ə qədər arı; ana arının qoxusu “hər şey qaydasındadır” deyir; xəbərdarlıq qoxusu arıları pətəyi qorumağa çağırır."
      }
    ],
    "durationSec": 255,
    "publishedAt": "2026-11-04T18:21:01.357Z"
  },
  {
    "slug": "amazing-octopus",
    "title": "Amazing Octopus",
    "titleAz": "Heyrətamiz ahtapot",
    "level": "A2",
    "minutes": 2,
    "accent": "aqua",
    "order": -4,
    "audioUrl": "/audio/podcasts/octopus.mp3",
    "transcriptAvailable": true,
    "summary": "A short episode about one of the smartest animals in the sea: eight arms, three hearts, blue blood and colour-changing skin.",
    "summaryAz": "Dənizin ən ağıllı heyvanlarından biri haqqında qısa epizod: səkkiz qol, üç ürək, mavi qan və rəngini dəyişən dəri.",
    "sentences": [
      {
        "speaker": "Host",
        "en": "Hi, and welcome to today's little podcast. Our topic: why octopuses are so strange and so smart.",
        "az": "Salam, bugünkü kiçik podkastımıza xoş gəldin. Mövzumuz: ahtapotlar niyə belə qəribə və ağıllıdır.",
        "start": 0,
        "end": 8.5
      },
      {
        "speaker": "Host",
        "en": "An octopus has three hearts and blue blood. And here's the amazing part: most of its brain cells are in its arms.",
        "az": "Ahtapotun üç ürəyi və mavi qanı var. Ən heyrətamizi isə budur: beyin hüceyrələrinin çoxu qollarındadır.",
        "start": 8.5,
        "end": 16.6
      },
      {
        "speaker": "Host",
        "en": "Each arm can touch, taste and even make small decisions by itself.",
        "az": "Hər qol toxuna, dad bilə və hətta özü kiçik qərarlar verə bilir.",
        "start": 16.6,
        "end": 22.2
      },
      {
        "speaker": "Host",
        "en": "Octopuses are also great escape artists. Some have left their tank at night, eaten fish in another tank, and come back before morning.",
        "az": "Ahtapotlar həm də böyük qaçaq ustalarıdır. Bəziləri gecə akvariumundan çıxıb, başqa akvariumda balıq yeyib və səhərə qədər geri qayıdıb.",
        "start": 22.2,
        "end": 30.2
      },
      {
        "speaker": "Host",
        "en": "They can also change colour in less than a second. That's all for today. See you next time!",
        "az": "Onlar bir saniyədən az vaxtda rəngini də dəyişə bilir. Bu günlük bu qədər. Növbəti dəfəyədək!",
        "start": 30.2,
        "end": 38
      },
      {
        "speaker": "Host",
        "en": "Key words: arm, decision, escape, seaweed.",
        "az": "Açar sözlər: qol, qərar, qaçmaq, dəniz yosunu.",
        "start": 38,
        "end": 77.26
      }
    ],
    "glossary": [
      {
        "en": "octopus",
        "az": "ahtapot",
        "ipa": "/ˈɒktəpəs/"
      },
      {
        "en": "arm",
        "az": "qol",
        "ipa": "/ɑːm/"
      },
      {
        "en": "heart",
        "az": "ürək",
        "ipa": "/hɑːt/"
      },
      {
        "en": "blood",
        "az": "qan",
        "ipa": "/blʌd/"
      },
      {
        "en": "change colour",
        "az": "rəngini dəyişmək",
        "ipa": "/tʃeɪndʒ ˈkʌlə/"
      },
      {
        "en": "smart",
        "az": "ağıllı",
        "ipa": "/smɑːt/"
      },
      {
        "en": "hide",
        "az": "gizlənmək",
        "ipa": "/haɪd/"
      },
      {
        "en": "sea",
        "az": "dəniz",
        "ipa": "/siː/"
      }
    ],
    "quiz": [
      {
        "prompt": "How many hearts does an octopus have?",
        "promptAz": "Ahtapotun neçə ürəyi var?",
        "options": [
          "One",
          "Two",
          "Three",
          "Eight"
        ],
        "answer": 2,
        "explain": "An octopus has three hearts.",
        "explainAz": "Ahtapotun üç ürəyi var."
      },
      {
        "prompt": "What colour is octopus blood?",
        "promptAz": "Ahtapotun qanı hansı rəngdədir?",
        "options": [
          "Red",
          "Blue",
          "Green",
          "Yellow"
        ],
        "answer": 1,
        "explain": "Its blood is blue.",
        "explainAz": "Onun qanı mavidir."
      },
      {
        "prompt": "How many arms does an octopus have?",
        "promptAz": "Ahtapotun neçə qolu var?",
        "options": [
          "Six",
          "Eight",
          "Ten",
          "Twelve"
        ],
        "answer": 1,
        "explain": "Octo = eight.",
        "explainAz": "Octo = səkkiz."
      },
      {
        "prompt": "Which sentence is TRUE?",
        "promptAz": "Hansı cümlə DOĞRUDUR?",
        "options": [
          "An octopus can change colour and is very smart.",
          "An octopus cannot move.",
          "An octopus lives in the desert.",
          "An octopus has no arms."
        ],
        "answer": 0,
        "explain": "Octopuses change colour to hide and are very intelligent.",
        "explainAz": "Ahtapotlar gizlənmək üçün rəngini dəyişir və çox ağıllıdır."
      }
    ],
    "durationSec": 77,
    "publishedAt": "2026-11-04T18:21:01.357Z"
  }
];
