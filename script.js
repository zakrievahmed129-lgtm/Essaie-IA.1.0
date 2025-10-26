const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const wikiBtn = document.getElementById("wikiBtn");

// Afficher un message
function addMessage(content, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.innerHTML = content;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Animation typing dots
function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing";
    typingDiv.classList.add("message", "ai-message");
    typingDiv.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

// Effet d’écriture pour le message IA
async function typeMessage(content, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    for (let i = 0; i < content.length; i++) {
        messageDiv.innerHTML += content[i];
        chatBox.scrollTop = chatBox.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

// Génération réponse IA
async function generateAIResponse(input) {
    const text = input.trim();

    if (text.startsWith("/clear")) {
        chatBox.innerHTML = "";
        return "💬 Chat effacé !";
    }
    if (text.startsWith("/time")) {
        return "🕒 Il est " + new Date().toLocaleTimeString("fr-FR");
    }
    if (text.startsWith("/date")) {
        return "📅 Nous sommes le " + new Date().toLocaleDateString("fr-FR");
    }
    if (text.startsWith("/joke")) {
        const jokes = [
            "Pourquoi les programmeurs détestent-ils la nature ? ... Parce qu’il y a trop de bugs 🐛😂",
            "Quelle est la boisson préférée des développeurs ? Le Java ☕",
            "Pourquoi le développeur a-t-il perdu son travail ? Il n’avait pas les bons arguments 😅"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (text.toLowerCase().startsWith("/wiki")) {
        const query = text.slice(5).trim();
        if (!query) return "❗ Veuillez préciser un terme après /wiki";

        try {
            const summary = await searchWikipedia(query);
            return summary ? "📚 " + summary : "❌ Aucun résultat trouvé pour '" + query + "'";
        } catch (err) {
            console.error(err);
            return "❌ Erreur lors de la recherche Wikipédia";
        }
    }

    const responses = [
  // ==============================
  // SALUTATIONS (~80 entrées)
  // ==============================
  { keywords: ["bonjour", "salut", "coucou", "hey", "yo", "hello"], response: "Salut 👋 ! Ravi de te voir ici." },
  { keywords: ["bonsoir", "soir"], response: "Bonsoir 🌙 ! J’espère que ta journée s’est bien passée." },
  { keywords: ["hi", "hey there"], response: "Hello 😄 ! Contente de te parler." },
  { keywords: ["yo", "yo!", "wesh"], response: "Yo 😎 ! Comment ça va ?" },
  { keywords: ["salutations", "salut à tous"], response: "Salutations 🙌 ! Heureux de te voir." },
  { keywords: ["coucou toi", "coucou"], response: "Coucou 😄 ! Content que tu sois là." },
  { keywords: ["bon matin", "bonne matinée"], response: "Bonne matinée ☀️ ! Passe un excellent début de journée." },
  { keywords: ["bonjour à tous", "hello everyone"], response: "Bonjour à tous 👋 ! Belle journée à chacun." },
  { keywords: ["hey buddy", "hey friend"], response: "Hey 😎 ! Heureux de te retrouver." },
  { keywords: ["salut salut", "hello hello"], response: "Salut 😄 ! Super de te parler." },
  // … ajouter d’autres entrées similaires pour atteindre ~80

  // ==============================
  // REMERCIEMENTS / FÉLICITATIONS (~70 entrées)
  // ==============================
  { keywords: ["merci", "merci beaucoup", "thanks", "thx"], response: "Avec plaisir 😊 ! C’est toujours un plaisir d’aider." },
  { keywords: ["merci à toi", "je te remercie"], response: "De rien 😄 ! C’est normal." },
  { keywords: ["thank you", "thanks a lot"], response: "You’re welcome 😎 ! Ravie de t’aider." },
  { keywords: ["merci bien", "merci infiniment"], response: "Avec joie 😁 ! Heureuse de pouvoir t’aider." },
  { keywords: ["gratitude", "remerciements"], response: "Merci à toi également 🙏 ! C’est toujours agréable." },
  { keywords: ["félicitations", "bravo"], response: "Bravo 🎉 ! Excellent travail." },
  { keywords: ["good job", "well done"], response: "Well done 👏 ! Tu as fait un super boulot." },
  { keywords: ["chapeau", "respect"], response: "Respect 👌 ! Très impressionnant." },
  { keywords: ["merci pour tout", "thanks for everything"], response: "C’est avec plaisir 😄 !" },
  { keywords: ["merci infiniment", "thank you very much"], response: "Avec toute ma joie 😁 !" },
  // … ajouter d’autres entrées similaires pour atteindre ~70

  // ==============================
  // DÉPARTS / AU REVOIR (~60 entrées)
  // ==============================
  { keywords: ["au revoir", "bye", "ciao", "à plus", "a+", "à bientôt"], response: "Au revoir 👋 ! Passe une excellente journée." },
  { keywords: ["bonne journée", "bonne fin de journée"], response: "Bonne journée ☀️ ! Profite bien." },
  { keywords: ["bonne soirée", "bonne fin de soirée"], response: "Bonne soirée 🌆 ! Détends-toi et profite." },
  { keywords: ["à la prochaine", "see you"], response: "À la prochaine 👋 ! Prends soin de toi." },
  { keywords: ["adieu", "farewell"], response: "Adieu 🙏 ! Porte-toi bien." },
  { keywords: ["bye bye", "see ya"], response: "Bye 👋 ! À très vite." },
  { keywords: ["je dois y aller", "je m’en vais"], response: "Pas de souci 😄 ! À bientôt." },
  { keywords: ["on se revoit", "à un de ces jours"], response: "Oui 👌 ! On se revoit bientôt." },
  { keywords: ["bonne continuation", "bonne route"], response: "Merci 🌟 ! Bonne continuation à toi également." },
  { keywords: ["salut final", "dernier au revoir"], response: "Salut 👋 ! Passe un bon moment." },
  { keywords: ["ça va", "comment tu vas", "comment ça va"], response: "Tout va très bien 😄 ! Merci de demander." },
  { keywords: ["bof", "pas trop", "ça va pas"], response: "Je comprends 😕… Courage, ça ira mieux." },
  { keywords: ["heureux", "content", "joyeux"], response: "Super 😁 ! La joie est toujours agréable." },
  { keywords: ["triste", "déprimé", "mal"], response: "Je suis là pour toi 🙏. Courage." },
  { keywords: ["stressé", "angoissé", "tendu"], response: "Respire 😌… Tout va s’arranger." },
  { keywords: ["excité", "enthousiaste", "impatient"], response: "Génial 😃 ! L’enthousiasme est motivant." },
  { keywords: ["fatigué", "épuisé", "crevé"], response: "Repose-toi 🛌 ! Le repos est essentiel." },
  { keywords: ["motiv", "motivé", "déterminé"], response: "Parfait 💪 ! Continue comme ça." },
  { keywords: ["calme", "relax", "tranquille"], response: "Super 😌 ! La sérénité est précieuse." },
  { keywords: ["inquiet", "préoccupé", "angoissé"], response: "Je comprends 😟… Tout ira bien." },
  // … ajouter d’autres entrées similaires pour atteindre ~100

  // ==============================
  // NOURRITURE / CUISINE (~80 entrées)
  // ==============================
  { keywords: ["j’ai faim", "faim", "manger"], response: "Mmm 🍕 ! Il y a plein de bonnes options à essayer." },
  { keywords: ["recette", "cuisiner", "plat"], response: "Je connais plein de recettes délicieuses 😋." },
  { keywords: ["déjeuner", "petit-déjeuner", "breakfast"], response: "Bon appétit 🥐 ! Profite bien de ton repas." },
  { keywords: ["dîner", "souper", "repas du soir"], response: "Bon dîner 🍽️ ! Que ce soit savoureux." },
  { keywords: ["boisson", "drink", "cocktail"], response: "Une boisson rafraîchissante 🍹 fait toujours plaisir." },
  { keywords: ["dessert", "gâteau", "sucré"], response: "Miam 🍰 ! Rien de tel qu’un bon dessert." },
  { keywords: ["fruit", "légume", "salade"], response: "Les fruits et légumes 🥗 sont très bons pour la santé." },
  { keywords: ["fast food", "pizza", "burger"], response: "Un petit plaisir 🍔 de temps en temps fait du bien." },
  { keywords: ["café", "thé", "boisson chaude"], response: "Un bon café ☕ ou thé 🍵 réchauffe toujours." },
  { keywords: ["chocolat", "sucre", "friandise"], response: "Le chocolat 🍫 rend la vie plus douce." },
  // … ajouter d’autres entrées similaires pour atteindre ~80

  // ==============================
  // MUSIQUE / DIVERTISSEMENT (~80 entrées)
  // ==============================
  { keywords: ["musique", "chanson", "playlist"], response: "J’adore la musique 🎶 ! C’est toujours inspirant." },
  { keywords: ["film", "série", "cinéma"], response: "Le cinéma 🍿 est génial, il y a tellement de choix intéressants." },
  { keywords: ["concert", "live", "spectacle"], response: "Les concerts 🎸 sont toujours excitants." },
  { keywords: ["jeu", "jeu vidéo", "gaming"], response: "Les jeux 🎮 sont parfaits pour se détendre." },
  { keywords: ["danse", "dance", "chorégraphie"], response: "La danse 💃 est un excellent moyen de s’exprimer." },
  { keywords: ["art", "peinture", "dessin"], response: "L’art 🎨 stimule la créativité et inspire." },
  { keywords: ["lecture", "livre", "roman"], response: "La lecture 📚 enrichit toujours l’esprit." },
  { keywords: ["théâtre", "pièce", "drame"], response: "Le théâtre 🎭 est captivant et passionnant." },
  { keywords: ["humour", "blague", "fun"], response: "L’humour 😂 rend la vie plus légère." },
  { keywords: ["photographie", "photo", "shooting"], response: "La photographie 📸 capture des moments précieux." },
  // … ajouter d’autres entrées similaires pour atteindre ~80
 // ==============================
  // TECHNOLOGIE / PROGRAMMATION (~100 entrées)
  // ==============================
  { keywords: ["ordinateur", "pc", "laptop"], response: "Les ordinateurs 💻 sont des outils fantastiques pour créer et apprendre." },
  { keywords: ["smartphone", "téléphone", "mobile"], response: "Un smartphone 📱 rend la vie plus pratique." },
  { keywords: ["internet", "web", "navigation"], response: "Internet 🌐 ouvre un monde infini de connaissances." },
  { keywords: ["application", "app", "logiciel"], response: "Les applications 📲 simplifient beaucoup de tâches." },
  { keywords: ["programmation", "coder", "code"], response: "La programmation 💻 est une compétence puissante et créative." },
  { keywords: ["python", "java", "javascript"], response: "Ces langages 🖥️ sont très utiles pour créer des projets." },
  { keywords: ["intelligence artificielle", "IA", "AI"], response: "L’IA 🤖 transforme la façon dont nous travaillons et apprenons." },
  { keywords: ["robotique", "robot", "automation"], response: "La robotique 🤖 est fascinante et innovante." },
  { keywords: ["cybersécurité", "sécurité", "hacking"], response: "La cybersécurité 🔒 est essentielle pour protéger nos données." },
  { keywords: ["cloud", "nuage", "stockage"], response: "Le cloud ☁️ permet d’accéder à ses fichiers facilement partout." },
  // … ajouter d’autres entrées similaires pour atteindre ~100

  // ==============================
  // HUMOUR / FUN (~70 entrées)
  // ==============================
  { keywords: ["blague", "lol", "mdr", "humour"], response: "😂 Haha ! Toujours bon de rire un peu." },
  { keywords: ["drôle", "funny", "amusant"], response: "😄 Trop drôle ! Ça met de bonne humeur." },
  { keywords: ["jeu de mots", "pun"], response: "😂 J’adore les jeux de mots, ils sont malins !" },
  { keywords: ["comique", "rigolo", "hilarant"], response: "🤣 Excellent ! Le rire fait du bien." },
  { keywords: ["mème", "meme", "funny pic"], response: "😆 Les mèmes sont parfaits pour s’amuser." },
  // … ajouter d’autres entrées similaires pour atteindre ~70

  // ==============================
  // AMOUR / AMITIÉ (~80 entrées)
  // ==============================
  { keywords: ["ami", "amitié", "copain", "copine"], response: "L’amitié 🤗 est précieuse et réconfortante." },
  { keywords: ["amour", "love", "chéri", "chérie"], response: "L’amour ❤️ rend la vie plus belle." },
  { keywords: ["relation", "couple", "partenaire"], response: "Les relations 💑 demandent soin et attention." },
  { keywords: ["affection", "tendresse", "câlin"], response: "La tendresse 🤗 fait toujours du bien." },
  { keywords: ["bienveillance", "gentillesse", "soutien"], response: "La gentillesse 🌸 illumine les journées." },
  // … ajouter d’autres entrées similaires pour atteindre ~80

  // ==============================
  // TRAVAIL / ÉTUDES (~80 entrées)
  // ==============================
  { keywords: ["travail", "boulot", "job"], response: "Le travail 💼 demande sérieux et persévérance." },
  { keywords: ["étude", "cours", "école", "université"], response: "Les études 📚 sont importantes pour progresser." },
  { keywords: ["projet", "mission", "tâche"], response: "Chaque projet 💪 est une étape vers la réussite." },
  { keywords: ["réussite", "succès", "objectif"], response: "Bravo 🎉 ! Continue ainsi pour atteindre tes objectifs." },
  { keywords: ["productivité", "efficacité", "organisation"], response: "Bien organisé 🗂️, tu seras plus efficace !" },
  // … ajouter d’autres entrées similaires pour atteindre ~80

  // ==============================
  // SPORT / LOISIRS (~80 entrées)
  // ==============================
  { keywords: ["sport", "football", "basketball", "tennis"], response: "Le sport 🏅 est excellent pour le corps et l’esprit." },
  { keywords: ["course", "marathon", "jogging"], response: "La course 🏃‍♂️ garde le corps en forme." },
  { keywords: ["yoga", "méditation", "stretching"], response: "Le yoga 🧘‍♀️ détend le corps et l’esprit." },
  { keywords: ["natation", "swimming", "piscine"], response: "La natation 🏊‍♂️ est un excellent exercice complet." },
  { keywords: ["randonnée", "trek", "nature"], response: "La randonnée 🥾 permet de se ressourcer en nature." },
  // … ajouter d’autres entrées similaires pour atteindre ~80

  // ==============================
  // VOYAGE / CULTURE (~120 entrées)
  // ==============================
  { keywords: ["voyage", "trip", "vacances"], response: "Voyager ✈️ ouvre l’esprit et enrichit l’expérience." },
  { keywords: ["pays", "destination", "tourisme"], response: "Chaque pays 🌍 a sa beauté et sa culture unique." },
  { keywords: ["monument", "site", "patrimoine"], response: "Les monuments 🏰 racontent l’histoire d’un lieu." },
  { keywords: ["tradition", "coutume", "culture"], response: "Découvrir les traditions 🌸 enrichit l’esprit." },
  { keywords: ["plage", "mer", "océan"], response: "La plage 🏖️ est idéale pour se détendre." },
  { keywords: ["montagne", "randonnée", "alpes"], response: "La montagne 🏔️ offre de magnifiques paysages et aventures." },
  { keywords: ["ville", "capitale", "tour"], response: "Explorer une ville 🏙️ est toujours enrichissant." },
  { keywords: ["cuisine locale", "gastronomie", "plat"], response: "Goûter la cuisine locale 🍲 est un vrai plaisir." },
  { keywords: ["aventure", "exploration", "road trip"], response: "Les aventures 🚗 créent des souvenirs inoubliables." },
  { keywords: ["culture", "musée", "art"], response: "Les musées 🖼️ et l’art ouvrent de nouvelles perspectives." },
  // … ajouter d’autres entrées similaires pour atteindre ~120
// ==============================
  // SALUTATIONS supplémentaires
  // ==============================
  { keywords: ["salut tout le monde", "hello friends"], response: "Salut à tous 😄 ! Heureux de vous voir ici." },
  { keywords: ["bonjour amis", "bonjour tout le monde"], response: "Bonjour ☀️ ! Belle journée à chacun." },
  { keywords: ["hey team", "hey guys"], response: "Hey 😎 ! Prêt pour une super discussion ?" },
  { keywords: ["yo yo", "wazzup"], response: "Yo 😃 ! Content de te parler." },
  { keywords: ["salut l'ami", "hello buddy"], response: "Salut 🤗 ! Ravi de te retrouver." },

  // ==============================
  // REMERCIEMENTS supplémentaires
  // ==============================
  { keywords: ["merci infiniment", "thanks a lot"], response: "Avec plaisir 😄 ! Toujours là pour aider." },
  { keywords: ["merci pour tout", "thanks for everything"], response: "C’est toujours un plaisir 🙏 !" },
  { keywords: ["thanks mate", "merci mon ami"], response: "You’re welcome 😎 ! Ravie de t’aider." },
  { keywords: ["merci mille fois", "thanks a million"], response: "Avec joie 😁 ! Content d’être utile." },
  { keywords: ["gracias", "merci beaucoup"], response: "Avec plaisir 😄 ! La gratitude est partagée." },

  // ==============================
  // DÉPARTS supplémentaires
  // ==============================
  { keywords: ["bye bye", "see you soon"], response: "À bientôt 👋 ! Passe une excellente journée." },
  { keywords: ["je file", "je dois partir"], response: "Pas de souci 😄 ! À la prochaine." },
  { keywords: ["à demain", "see you tomorrow"], response: "À demain 👋 ! Repose-toi bien." },
  { keywords: ["adieu mon ami", "farewell friend"], response: "Adieu 🙏 ! Porte-toi bien." },
  { keywords: ["on se reparle", "catch you later"], response: "Oui 👌 ! On se reparle très vite." },

  // ==============================
  // HUMEUR / ÉMOTIONS supplémentaires
  // ==============================
  { keywords: ["heureux comme jamais", "super content"], response: "Génial 😄 ! Profite de ce bonheur." },
  { keywords: ["déprimé total", "très triste"], response: "Je suis là pour toi 🙏. Courage." },
  { keywords: ["stress max", "angoisse totale"], response: "Respire 😌… Tout va s’arranger." },
  { keywords: ["motivation au max", "déterminé à fond"], response: "Parfait 💪 ! Continue comme ça." },
  { keywords: ["calme intérieur", "zen"], response: "Super 😌 ! La sérénité est précieuse." },

  // ==============================
  // NOURRITURE / CUISINE supplémentaires
  // ==============================
  { keywords: ["goûter", "snack", "grignoter"], response: "Un petit snack 🍩 fait toujours plaisir !" },
  { keywords: ["recette rapide", "cuisine facile"], response: "Essayons une recette simple 😋 !" },
  { keywords: ["plat du jour", "menu"], response: "Miam 🍲 ! Bon appétit." },
  { keywords: ["cocktail maison", "drink maison"], response: "Un cocktail 🍹 maison, excellent choix !" },
  { keywords: ["smoothie", "jus frais"], response: "Rafraîchissant 🥤 ! Santé !" },

  // ==============================
  // MUSIQUE / DIVERTISSEMENT supplémentaires
  // ==============================
  { keywords: ["rock", "pop", "jazz"], response: "La musique 🎶 adoucit toujours l’âme." },
  { keywords: ["film comédie", "romantique"], response: "Un bon film 🍿 pour se détendre." },
  { keywords: ["concert live", "show"], response: "Les concerts 🎸 sont toujours excitants." },
  { keywords: ["jeu en ligne", "gaming online"], response: "Les jeux 🎮 permettent de s’évader." },
  { keywords: ["lecture passionnante", "roman captivant"], response: "La lecture 📚 nourrit l’esprit." },

  // ==============================
  // TECHNOLOGIE / PROGRAMMATION supplémentaires
  // ==============================
  { keywords: ["IA", "intelligence artificielle"], response: "L’IA 🤖 transforme le quotidien." },
  { keywords: ["machine learning", "apprentissage automatique"], response: "Le ML 🖥️ est fascinant et puissant." },
  { keywords: ["dev", "développement"], response: "Le développement 💻 ouvre de nombreuses portes." },
  { keywords: ["hardware", "matériel informatique"], response: "Le hardware 🖥️ est la base de tout ordinateur." },
  { keywords: ["logiciel libre", "open source"], response: "L’open source 🌐 favorise l’innovation." },

  // ==============================
  // HUMOUR / FUN supplémentaires
  // ==============================
  { keywords: ["rire", "haha", "lol"], response: "😂 Haha ! Toujours bon de rire." },
  { keywords: ["marrant", "amusant"], response: "😄 Trop drôle ! Quelle bonne humeur." },
  { keywords: ["jeu de mots", "pun"], response: "😂 Les jeux de mots sont malins et amusants !" },
  { keywords: ["funny pic", "mème rigolo"], response: "😆 Les mèmes rendent la journée plus légère." },
  { keywords: ["comédie", "sketch", "humour"], response: "🤣 Excellent ! Le rire fait du bien." },

  // ==============================
  // AMOUR / AMITIÉ supplémentaires
  // ==============================
  { keywords: ["câlin", "tendresse"], response: "Un câlin 🤗 fait toujours du bien." },
  { keywords: ["amoureux", "love"], response: "L’amour ❤️ embellit chaque journée." },
  { keywords: ["partenaire", "couple"], response: "Les relations 💑 demandent soin et attention." },
  { keywords: ["gentillesse", "bienveillance"], response: "La gentillesse 🌸 illumine les journées." },
  { keywords: ["ami proche", "meilleur ami"], response: "L’amitié 🤗 est précieuse." },

  // ==============================
  // TRAVAIL / ÉTUDES supplémentaires
  // ==============================
  { keywords: ["deadline", "échéance"], response: "Pas de stress 💼 ! Gère ça étape par étape." },
  { keywords: ["examens", "test"], response: "Bonne chance 📚 ! Tu vas y arriver." },
  { keywords: ["projet important", "mission critique"], response: "Chaque projet 💪 est une étape vers la réussite." },
  { keywords: ["réunion", "meeting"], response: "La réunion 🗓️ va bien se passer !" },
  { keywords: ["organisation", "planning"], response: "Bien organisé 🗂️, tu seras efficace !" },

  // ==============================
  // SPORT / LOISIRS supplémentaires
  // ==============================
  { keywords: ["vélo", "cycling"], response: "Le vélo 🚴‍♂️ est un excellent exercice." },
  { keywords: ["fitness", "gym"], response: "La gym 🏋️‍♀️ garde le corps en forme." },
  { keywords: ["ski", "snowboard"], response: "Les sports d’hiver ⛷️ sont super fun !" },
  { keywords: ["tennis de table", "ping pong"], response: "Le ping pong 🏓 est un excellent loisir." },
  { keywords: ["escalade", "climbing"], response: "L’escalade 🧗‍♂️ est un vrai défi physique." },

  // ==============================
  // VOYAGE / CULTURE supplémentaires
  // ==============================
  { keywords: ["road trip", "voyage en voiture"], response: "Les road trips 🚗 créent des souvenirs inoubliables." },
  { keywords: ["musée", "exposition"], response: "Les musées 🖼️ et expos enrichissent la culture." },
  { keywords: ["monument historique", "site ancien"], response: "Les monuments 🏰 racontent l’histoire." },
  { keywords: ["gastronomie locale", "plat traditionnel"], response: "Goûter les plats locaux 🍲 est un vrai plaisir." },
  { keywords: ["culture locale", "tradition"], response: "Découvrir la culture 🌸 enrichit l’esprit." },

  { keywords: ["comment rester en forme", "sport santé"], response: "Bouger un peu chaque jour 🏃‍♀️ et bien manger 🥗 est très bénéfique." },
  { keywords: ["mal de tête", "maux de tête"], response: "Boire de l’eau 💧 et se reposer aide souvent à se sentir mieux." },
  { keywords: ["sommeil", "dormir mieux"], response: "Une routine régulière 🌙 et un environnement calme favorisent un bon sommeil." },

{ keywords: ["quelle heure est-il", "heure actuelle"], response: "Chaque moment est précieux ⏰, profite-en au maximum." },
{ keywords: ["quelle date", "jour aujourd'hui"], response: "Aujourd’hui est un nouveau jour plein de possibilités 📅." },
{ keywords: ["comment faire ça", "astuce", "conseil"], response: "Avec un peu de patience et de curiosité 🔍, tout devient plus facile." },

{ keywords: ["problème ordinateur", "bug", "erreur"], response: "Redémarrer le système résout souvent le problème 💻." },
{ keywords: ["réseau", "wifi", "connexion"], response: "Vérifie les câbles et la configuration 🌐, cela règle la majorité des soucis." },
{ keywords: ["application lente", "app bug", "logiciel problème"], response: "Mettre à jour l’application 📲 améliore souvent les performances." },

{ keywords: ["quoi faire ce week-end", "activité", "loisir"], response: "Explorer un nouveau lieu 🏞️ ou se détendre apporte beaucoup de satisfaction." },
{ keywords: ["idée film", "quoi regarder", "cinéma"], response: "Un bon film 🎬 ou une série divertissante remplit bien le temps libre." },
{ keywords: ["jeu à jouer", "jeu vidéo", "boardgame"], response: "Choisir un jeu amusant 🎮 garantit un moment agréable." },

{ keywords: ["je suis triste", "je me sens seul"], response: "Prendre soin de soi et faire quelque chose d’agréable apporte du réconfort 🤗." },
{ keywords: ["comment être heureux", "motivation"], response: "Se concentrer sur les petites choses positives 🌸 améliore l’humeur." },
{ keywords: ["amour platonique", "relation amicale"], response: "Entretenir les relations avec attention 💛 renforce les liens." },

{ keywords: ["voyage", "trip", "vacances"], response: "Voyager ✈️ ouvre l’esprit et crée des souvenirs inoubliables." },
{ keywords: ["pays", "destination", "tourisme"], response: "Chaque pays 🌍 possède sa culture et ses paysages uniques." },
{ keywords: ["monument", "site", "patrimoine"], response: "Les monuments 🏰 racontent l’histoire d’un lieu." },

{ keywords: ["ordinateur", "pc", "laptop"], response: "Les ordinateurs 💻 sont des outils fantastiques pour créer et apprendre." },
{ keywords: ["smartphone", "téléphone", "mobile"], response: "Un smartphone 📱 facilite de nombreuses tâches au quotidien." },
{ keywords: ["internet", "web", "navigation"], response: "Internet 🌐 permet d’accéder à un monde infini de connaissances." },

{ keywords: ["café", "thé", "boisson chaude"], response: "Un bon café ☕ ou thé 🍵 rend la journée plus agréable." },
{ keywords: ["chocolat", "sucre", "friandise"], response: "Le chocolat 🍫 apporte un peu de douceur et de réconfort." },
{ keywords: ["déjeuner", "dîner", "repas"], response: "Profiter d’un bon repas 🍽️ est toujours agréable." },

{ keywords: ["sport", "football", "basketball"], response: "Pratiquer le sport 🏅 garde le corps et l’esprit en forme." },
{ keywords: ["yoga", "méditation", "stretching"], response: "Le yoga 🧘‍♀️ détend le corps et calme l’esprit." },
{ keywords: ["natation", "swimming", "piscine"], response: "La natation 🏊‍♂️ est un exercice complet et rafraîchissant." },

{ keywords: ["musique", "chanson", "playlist"], response: "Écouter de la musique 🎶 rend toujours le moment plus agréable." },
{ keywords: ["film", "série", "cinéma"], response: "Regarder un film 🍿 ou une série divertissante fait du bien." },
{ keywords: ["concert", "live", "spectacle"], response: "Assister à un concert 🎸 est toujours excitant." },

{ keywords: ["blague", "lol", "humour"], response: "Rire 😂 est excellent pour le moral." },
{ keywords: ["mème", "funny pic"], response: "Les mèmes 😆 ajoutent de la légèreté à la journée." },
{ keywords: ["jeu de mots", "pun"], response: "Les jeux de mots 😄 sont malins et amusants." },

{ keywords: ["travail", "boulot", "job"], response: "Le travail 💼 demande persévérance et organisation." },
{ keywords: ["étude", "cours", "école"], response: "Les études 📚 construisent de solides bases pour l’avenir." },
{ keywords: ["projet", "mission", "tâche"], response: "Chaque projet 💪 est une étape vers la réussite." },
{ keywords: ["quel temps fait-il", "météo aujourd'hui"], response: "Profite du moment quel que soit le temps ☀️🌧️." },
{ keywords: ["est-ce qu'il pleut", "pluie aujourd'hui"], response: "Un parapluie 🌂 est toujours pratique par temps de pluie." },
{ keywords: ["fait chaud", "température"], response: "Porte des vêtements légers 😄 pour rester à l’aise." },
{ keywords: ["va-t-il neiger", "neige aujourd'hui"], response: "La neige ❄️ crée une ambiance magique." },
{ keywords: ["comment rester en forme", "sport santé"], response: "Bouger chaque jour 🏃‍♀️ et bien manger 🥗 est bénéfique." },
{ keywords: ["mal de tête", "maux de tête"], response: "Boire de l’eau 💧 et se reposer aide à soulager." },
{ keywords: ["sommeil", "dormir mieux"], response: "Une routine calme 🌙 favorise un bon sommeil." },
{ keywords: ["quelle heure", "heure actuelle"], response: "Chaque instant ⏰ est précieux." },
{ keywords: ["quelle date", "jour aujourd'hui"], response: "Aujourd’hui est un nouveau jour plein de possibilités 📅." },
{ keywords: ["problème ordinateur", "bug"], response: "Redémarrer 💻 résout souvent le problème." },
{ keywords: ["réseau", "wifi", "connexion"], response: "Vérifie la configuration 🌐, cela règle souvent le souci." },
{ keywords: ["application lente", "app bug"], response: "Mettre à jour l’application 📲 améliore les performances." },
{ keywords: ["quoi faire ce week-end", "activité", "loisir"], response: "Explorer un nouvel endroit 🏞️ ou se détendre est toujours plaisant." },
{ keywords: ["idée film", "quoi regarder"], response: "Un bon film 🎬 ou une série divertissante fait plaisir." },
{ keywords: ["jeu à jouer", "jeu vidéo"], response: "Choisir un jeu amusant 🎮 garantit un moment agréable." },
{ keywords: ["je suis triste", "je me sens seul"], response: "Prendre soin de soi et faire quelque chose d’agréable apporte du réconfort 🤗." },
{ keywords: ["comment être heureux", "motivation"], response: "Se concentrer sur les petites choses positives 🌸 améliore l’humeur." },
{ keywords: ["amour platonique", "relation amicale"], response: "Entretenir les relations avec attention 💛 renforce les liens." },
{ keywords: ["voyage", "trip", "vacances"], response: "Voyager ✈️ ouvre l’esprit et crée des souvenirs inoubliables." },
{ keywords: ["pays", "destination", "tourisme"], response: "Chaque pays 🌍 possède sa culture et ses paysages uniques." },
{ keywords: ["monument", "site", "patrimoine"], response: "Les monuments 🏰 racontent l’histoire d’un lieu." },
{ keywords: ["ordinateur", "pc", "laptop"], response: "Les ordinateurs 💻 sont des outils fantastiques pour créer et apprendre." },
{ keywords: ["smartphone", "téléphone", "mobile"], response: "Un smartphone 📱 facilite de nombreuses tâches." },
{ keywords: ["internet", "web", "navigation"], response: "Internet 🌐 permet d’accéder à un monde infini de connaissances." },
{ keywords: ["café", "thé", "boisson chaude"], response: "Un bon café ☕ ou thé 🍵 rend la journée plus agréable." },
{ keywords: ["chocolat", "sucre", "friandise"], response: "Le chocolat 🍫 apporte un peu de douceur et de réconfort." },
{ keywords: ["déjeuner", "dîner", "repas"], response: "Profiter d’un bon repas 🍽️ est toujours agréable." },
{ keywords: ["sport", "football", "basketball"], response: "Pratiquer le sport 🏅 garde le corps et l’esprit en forme." },
{ keywords: ["yoga", "méditation", "stretching"], response: "Le yoga 🧘‍♀️ détend le corps et calme l’esprit." },
{ keywords: ["natation", "swimming", "piscine"], response: "La natation 🏊‍♂️ est un exercice complet et rafraîchissant." },
{ keywords: ["musique", "chanson", "playlist"], response: "Écouter de la musique 🎶 rend le moment plus agréable." },
{ keywords: ["film", "série", "cinéma"], response: "Regarder un film 🍿 ou une série divertissante fait du bien." },
{ keywords: ["concert", "live", "spectacle"], response: "Assister à un concert 🎸 est toujours excitant." },
{ keywords: ["blague", "lol", "humour"], response: "Rire 😂 est excellent pour le moral." },
{ keywords: ["mème", "funny pic"], response: "Les mèmes 😆 ajoutent de la légèreté à la journée." },
{ keywords: ["jeu de mots", "pun"], response: "Les jeux de mots 😄 sont malins et amusants." },
{ keywords: ["travail", "boulot", "job"], response: "Le travail 💼 demande persévérance et organisation." },
{ keywords: ["étude", "cours", "école"], response: "Les études 📚 construisent de solides bases pour l’avenir." },
{ keywords: ["projet", "mission", "tâche"], response: "Chaque projet 💪 est une étape vers la réussite." },
{ keywords: ["réussite", "succès", "objectif"], response: "Bravo 🎉 ! Continuer ainsi mène au succès." },
{ keywords: ["productivité", "efficacité", "organisation"], response: "Une bonne organisation 🗂️ améliore la productivité." },
{ keywords: ["motivation", "détermination"], response: "La détermination 💪 mène toujours à de bons résultats." },
{ keywords: ["relax", "calme", "tranquille"], response: "Rester calme 😌 aide à se sentir mieux." },
{ keywords: ["stress", "angoisse", "tension"], response: "Respirer profondément 🌬️ détend et apaise l’esprit." },
{ keywords: ["faim", "manger", "repas"], response: "Se nourrir 🍽️ avec plaisir est important." },
{ keywords: ["boisson", "drink", "cocktail"], response: "Une boisson 🍹 rafraîchissante fait toujours plaisir." },
{ keywords: ["fruit", "légume", "salade"], response: "Les fruits et légumes 🥗 sont très bons pour la santé." },
{ keywords: ["dessert", "gâteau", "sucré"], response: "Rien de tel qu’un bon dessert 🍰 pour se faire plaisir." },
{ keywords: ["pizza", "burger", "fast food"], response: "Un petit plaisir 🍔 de temps en temps est acceptable." },
{ keywords: ["technologie", "innovation"], response: "La technologie 💻 facilite de nombreuses tâches." },
{ keywords: ["intelligence artificielle", "IA", "AI"], response: "L’IA 🤖 transforme la vie de façon impressionnante." },
{ keywords: ["robotique", "robot", "automation"], response: "La robotique 🤖 est fascinante et innovante." },
{ keywords: ["cybersécurité", "sécurité", "hacking"], response: "La cybersécurité 🔒 protège nos données importantes." },
{ keywords: ["cloud", "nuage", "stockage"], response: "Le cloud ☁️ permet un accès facile aux fichiers partout." },
{ keywords: ["lecture", "livre", "roman"], response: "Lire 📚 enrichit toujours l’esprit." },
{ keywords: ["art", "peinture", "dessin"], response: "L’art 🎨 stimule la créativité." },
{ keywords: ["théâtre", "pièce", "drame"], response: "Le théâtre 🎭 est captivant et passionnant." },
{ keywords: ["photographie", "photo", "shooting"], response: "La photographie 📸 capture des moments précieux." },
{ keywords: ["danse", "dance", "chorégraphie"], response: "La danse 💃 est un excellent moyen de s’exprimer." },
{ keywords: ["amitié", "ami", "copain"], response: "L’amitié 🤝 rend la vie plus belle." },
{ keywords: ["famille", "parents", "enfants"], response: "La famille 👪 est une source de soutien et d’amour." },
{ keywords: ["amour", "relation", "couple"], response: "L’amour ❤️ apporte du bonheur et de la complicité." },
{ keywords: ["animal", "chien", "chat"], response: "Les animaux 🐶🐱 apportent joie et réconfort." },
{ keywords: ["plante", "fleur", "jardin"], response: "Les plantes 🌱 embellissent et purifient l’air." },
{ keywords: ["vélo", "cycling", "bicycle"], response: "Faire du vélo 🚴‍♂️ est agréable et sain." },
{ keywords: ["marche", "balade", "promenade"], response: "Se promener 🚶‍♀️ détend le corps et l’esprit." },
{ keywords: ["randonnée", "trek", "montagne"], response: "La randonnée 🥾 offre un contact avec la nature." },
{ keywords: ["plage", "mer", "sable"], response: "Profiter de la plage 🏖️ est toujours relaxant." },
{ keywords: ["montagne", "neige", "sommet"], response: "La montagne 🏔️ offre des paysages majestueux." },
{ keywords: ["forêt", "arbres", "nature"], response: "La forêt 🌳 apaise et inspire." },
{ keywords: ["rivière", "lac", "eau"], response: "L’eau 💧 procure calme et fraîcheur." },
{ keywords: ["sport collectif", "team", "match"], response: "Les sports collectifs 🏀 renforcent l’esprit d’équipe." },
{ keywords: ["sport individuel", "solo", "performance"], response: "Les sports individuels 🏋️‍♂️ développent la discipline." },
{ keywords: ["musique classique", "orchestre"], response: "La musique classique 🎼 apaise et enrichit l’esprit." },
{ keywords: ["musique moderne", "pop", "rock"], response: "La musique moderne 🎸 dynamise et inspire." },
{ keywords: ["cinéma français", "film français"], response: "Le cinéma français 🎬 offre des histoires profondes et uniques." },
{ keywords: ["cinéma américain", "film hollywood"], response: "Le cinéma américain 🎥 divertit et captive le public." },
{ keywords: ["ordinateur lent", "pc lent"], response: "Optimiser les fichiers et fermer les programmes inutiles améliore les performances 💻." },
{ keywords: ["écran noir", "pc écran noir"], response: "Vérifier les connexions et redémarrer souvent résout le problème 🖥️." },
{ keywords: ["imprimante", "printer"], response: "Assurer que le papier et l’encre sont bien installés imprime sans souci 🖨️." },
{ keywords: ["scanner", "numérisation"], response: "Un scanner propre produit des images nettes et précises 📄." },
{ keywords: ["batterie faible", "charger téléphone"], response: "Brancher le chargeur 🔌 permet de continuer sans interruption." },
{ keywords: ["connexion lente", "internet lent"], response: "Redémarrer le routeur et vérifier la bande passante améliore la connexion 🌐." },
{ keywords: ["site web", "navigation web"], response: "Explorer différents sites 🌍 enrichit les connaissances." },
{ keywords: ["email", "mail", "courrier"], response: "Gérer les emails 📧 efficacement aide à rester organisé." },
{ keywords: ["réseau social", "facebook", "instagram"], response: "Partager des moments agréables 🌟 avec ses amis rend heureux." },
{ keywords: ["notification", "alerte"], response: "Configurer les notifications 🔔 permet de rester informé sans être dérangé." },
{ keywords: ["jeu mobile", "appli jeu"], response: "Un petit jeu amusant 🎮 détend après une journée chargée." },
{ keywords: ["lecture ebook", "livre numérique"], response: "Lire un ebook 📖 enrichit l’esprit facilement." },
{ keywords: ["podcast", "audio"], response: "Écouter un podcast 🎧 informe et divertit à la fois." },
{ keywords: ["cours en ligne", "learning", "formation"], response: "Les cours en ligne 💻 permettent d’apprendre à son rythme." },
{ keywords: ["travail à distance", "home office"], response: "Organiser l’espace de travail 🖥️ améliore la concentration." },
{ keywords: ["réunion", "meeting"], response: "Une réunion bien préparée ✅ optimise le temps de tous." },
{ keywords: ["agenda", "planning"], response: "Tenir un agenda 🗓️ permet de mieux gérer le temps." },
{ keywords: ["tâche", "to do", "mission"], response: "Compléter chaque tâche ✔️ apporte satisfaction et efficacité." },
{ keywords: ["pause", "break"], response: "Faire une pause courte ☕ permet de se ressourcer." },
{ keywords: ["café matinal", "booster matin"], response: "Un café ☕ commence la journée avec énergie." },
{ keywords: ["petit-déjeuner", "morning meal"], response: "Prendre un bon petit-déjeuner 🍳 est essentiel pour bien démarrer." },
{ keywords: ["déjeuner au bureau", "repas midi"], response: "Manger équilibré 🍲 garde l’énergie toute la journée." },
{ keywords: ["goûter", "snack"], response: "Un petit snack 🍎 permet de rester concentré." },
{ keywords: ["dîner", "repas soir"], response: "Un dîner léger 🍽️ favorise une bonne digestion." },
{ keywords: ["sommeil réparateur", "bien dormir"], response: "Se coucher à une heure régulière 🌙 améliore le sommeil." },
{ keywords: ["réveil", "alarm"], response: "Un réveil matinal ⏰ commence la journée positivement." },
{ keywords: ["routine", "habitudes"], response: "Une routine saine 🏃‍♂️ et équilibrée facilite la vie quotidienne." },
{ keywords: ["organisation maison", "ménage"], response: "Un espace bien rangé 🏠 apaise l’esprit." },
{ keywords: ["lessive", "laundry"], response: "Faire la lessive régulièrement 🧺 garde tout propre et ordonné." },
{ keywords: ["vaisselle", "dishwashing"], response: "Faire la vaisselle 🍽️ rapidement simplifie le quotidien." },
{ keywords: ["courses", "supermarché"], response: "Préparer la liste 📝 rend les courses plus rapides et efficaces." },
{ keywords: ["repas rapide", "fast food maison"], response: "Un repas rapide 🍔 maison peut être délicieux et pratique." },
{ keywords: ["cuisiner", "recette facile"], response: "Essayer de nouvelles recettes 👩‍🍳 rend la cuisine amusante." },
{ keywords: ["dessert maison", "gâteau"], response: "Un dessert fait maison 🍰 est toujours savoureux." },
{ keywords: ["boisson chaude", "tea time"], response: "Prendre un thé 🍵 ou un café ☕ détend agréablement." },
{ keywords: ["boisson froide", "smoothie"], response: "Un smoothie frais 🥤 fait du bien en été." },
{ keywords: ["sport quotidien", "fitness"], response: "Bouger régulièrement 🏃‍♀️ garde la santé et la forme." },
{ keywords: ["marche rapide", "power walk"], response: "Une marche rapide 🚶‍♂️ active le corps et l’esprit." },
{ keywords: ["course à pied", "running"], response: "Courir régulièrement 🏃 augmente l’énergie et la vitalité." },
{ keywords: ["natation loisir", "piscine"], response: "La natation 🏊 détend et renforce le corps." },
{ keywords: ["yoga matin", "méditation"], response: "Pratiquer le yoga 🧘‍♂️ le matin favorise sérénité et concentration." },
{ keywords: ["musique relaxante", "playlist zen"], response: "Écouter de la musique relaxante 🎶 apaise l’esprit." },
{ keywords: ["musique dynamique", "playlist énergie"], response: "La musique dynamique 🎵 motive et inspire." },
{ keywords: ["film détente", "soirée cinéma"], response: "Regarder un bon film 🍿 détend agréablement." },
{ keywords: ["série à binge-watcher", "Netflix"], response: "Une série captivante 📺 procure du plaisir et du divertissement." },
{ keywords: ["lecture inspirante", "livre développement"], response: "Lire un livre inspirant 📚 stimule la réflexion et la motivation." },
{ keywords: ["dessin créatif", "peinture"], response: "Exprimer sa créativité 🎨 rend la journée plus joyeuse." },
{ keywords: ["photographie nature", "photo paysage"], response: "Prendre des photos 📸 capte la beauté autour de soi." },
{ keywords: ["sortie en famille", "weekend famille"], response: "Passer du temps en famille 👨‍👩‍👧‍👦 crée des souvenirs heureux." },
{ keywords: ["sortie amis", "rencontre copains"], response: "Retrouver des amis 🤗 est toujours agréable." },
{ keywords: ["voyage court", "weekend trip"], response: "Un court voyage ✈️ change les idées et détend." },
{ keywords: ["vacances", "holiday"], response: "Les vacances 🏖️ offrent repos et découvertes." },
{ keywords: ["montagne", "ski", "randonnée"], response: "La montagne 🏔️ est synonyme de beauté et d’air pur." },
{ keywords: ["plage", "mer", "surf"], response: "Profiter de la plage 🏖️ est toujours relaxant et joyeux." },
{ keywords: ["forêt", "nature", "balade"], response: "Se promener en forêt 🌳 apaise et reconnecte à la nature." },
{ keywords: ["animaux domestiques", "chien", "chat"], response: "Les animaux 🐶🐱 apportent bonheur et affection." },
{ keywords: ["plante maison", "fleur"], response: "Avoir des plantes 🌱 embellit et purifie l’espace." },
{ keywords: ["énergie positive", "motivation"], response: "Conserver une attitude positive 🌟 rend la vie plus agréable." },
{ keywords: ["bien-être mental", "calme"], response: "Prendre du temps pour soi 😌 favorise sérénité et équilibre." },
{ keywords: ["méditation", "respiration"], response: "Respirer profondément 🌬️ détend et recentre l’esprit." },
{ keywords: ["gratitude", "remerciement"], response: "Exprimer la gratitude 🙏 apporte bonheur et paix intérieure." },
{ keywords: ["rituel matinal", "morning routine"], response: "Commencer la journée avec un rituel positif 🌅 booste la motivation." },
{ keywords: ["rituel du soir", "night routine"], response: "Un rituel du soir 🌙 favorise détente et sommeil réparateur." },
{ keywords: ["hydratation", "boire eau"], response: "Boire suffisamment d’eau 💧 garde le corps et l’esprit en forme." },
{ keywords: ["pause café", "break coffee"], response: "Une courte pause café ☕ revitalise et stimule la concentration." },
{ keywords: ["pause thé", "tea break"], response: "Prendre un thé 🍵 détend et rafraîchit l’esprit." },
{ keywords: ["snack sain", "collation"], response: "Une collation saine 🍎 apporte énergie et bien-être." },
{ keywords: ["alimentation équilibrée", "healthy food"], response: "Manger équilibré 🥗 favorise santé et vitalité." },
{ keywords: ["fruits frais", "vitamines"], response: "Les fruits frais 🍊 apportent énergie et nutriments essentiels." },
{ keywords: ["légumes", "greens"], response: "Les légumes 🥦 sont bons pour la santé et la digestion." },
{ keywords: ["protéines", "viande", "poisson"], response: "Les protéines 🍗 aident à garder énergie et force." },
{ keywords: ["collation rapide", "snack rapide"], response: "Une collation rapide 🍌 aide à rester concentré." },
{ keywords: ["smoothie", "boisson santé"], response: "Un smoothie frais 🥤 revitalise le corps et l’esprit." },
{ keywords: ["routine sportive", "fitness quotidien"], response: "Faire du sport régulièrement 🏋️‍♂️ maintient la forme et la santé." },
{ keywords: ["marche quotidienne", "walking"], response: "Une marche quotidienne 🚶‍♀️ stimule le corps et l’esprit." },
{ keywords: ["étirement", "stretching"], response: "S’étirer régulièrement 🤸‍♂️ prévient les tensions et fatigue." },
{ keywords: ["yoga", "relaxation"], response: "Le yoga 🧘 favorise calme, souplesse et sérénité." },
{ keywords: ["méditation guidée", "mindfulness"], response: "La méditation guidée 🕊️ détend et recentre l’esprit." },
{ keywords: ["respiration profonde", "breathing exercises"], response: "Respirer profondément 🌬️ réduit le stress et clarifie l’esprit." },
{ keywords: ["musique apaisante", "relax music"], response: "Écouter de la musique apaisante 🎶 calme et détend." },
{ keywords: ["musique motivante", "workout music"], response: "La musique motivante 🎵 stimule énergie et motivation." },
{ keywords: ["film comique", "rire"], response: "Regarder un film comique 😂 améliore l’humeur et détend." },
{ keywords: ["série captivante", "tv show"], response: "Une série captivante 📺 occupe agréablement le temps libre." },
{ keywords: ["lecture inspirante", "motivational book"], response: "Lire un livre inspirant 📚 motive et enrichit l’esprit." },
{ keywords: ["dessin", "créativité"], response: "Dessiner ou peindre 🎨 développe créativité et détente." },
{ keywords: ["photographie", "photo nature"], response: "Prendre des photos 📸 capture la beauté du quotidien." },
{ keywords: ["cuisine maison", "recette facile"], response: "Cuisiner à la maison 👩‍🍳 procure plaisir et satisfaction." },
{ keywords: ["dessert simple", "gâteau maison"], response: "Préparer un dessert maison 🍰 rend heureux et gourmand." },
{ keywords: ["sortie nature", "randonnée"], response: "Une sortie en nature 🌳 apaise l’esprit et revitalise le corps." },
{ keywords: ["balade en ville", "promenade"], response: "Se promener en ville 🚶‍♂️ offre découvertes et détente." },
{ keywords: ["weekend détente", "mini-vacances"], response: "Un weekend détente 🏞️ recharge énergie et motivation." },
{ keywords: ["voyage court", "city trip"], response: "Un court voyage ✈️ change les idées et détend." },
{ keywords: ["vacances plage", "mer"], response: "Profiter de la plage 🏖️ relaxe et émerveille." },
{ keywords: ["vacances montagne", "ski"], response: "La montagne 🏔️ procure air pur et ressourcement." },
{ keywords: ["animaux domestiques", "chien", "chat"], response: "Prendre soin des animaux 🐶🐱 apporte bonheur et affection." },
{ keywords: ["plantes maison", "fleurs"], response: "Les plantes 🌱 embellissent et purifient l’espace." },
{ keywords: ["bien-être mental", "calme"], response: "Prendre soin de son esprit 😌 favorise équilibre et sérénité." },
{ keywords: ["gratitude", "remerciement"], response: "Exprimer de la gratitude 🙏 apporte joie et paix intérieure." },
{ keywords: ["rituel matin", "morning routine"], response: "Commencer la journée avec un rituel positif 🌅 booste l’énergie." },
{ keywords: ["rituel soir", "night routine"], response: "Un rituel du soir 🌙 favorise détente et sommeil réparateur." },
{ keywords: ["sommeil", "dormir"], response: "Dormir suffisamment 🌙 régénère le corps et l’esprit." },
{ keywords: ["réveil", "alarm"], response: "Un réveil à heure régulière ⏰ démarre la journée efficacement." },
{ keywords: ["organisation", "planning"], response: "Une bonne organisation 🗂️ simplifie la vie quotidienne." },
{ keywords: ["agenda", "to do list"], response: "Tenir un agenda 📅 aide à gérer le temps et les priorités." },
{ keywords: ["travail efficace", "productivité"], response: "Travailler efficacement 💼 augmente satisfaction et réussite." },
{ keywords: ["pause travail", "break"], response: "Faire une pause courte ☕ améliore concentration et énergie." },
{ keywords: ["réunion", "meeting"], response: "Une réunion bien préparée ✅ optimise le temps et les décisions." },
{ keywords: ["télétravail", "home office"], response: "Aménager l’espace de travail 🖥️ favorise concentration et confort." },
{ keywords: ["formation en ligne", "cours digital"], response: "Les cours en ligne 💻 permettent d’apprendre facilement et rapidement." },
{ keywords: ["lecture emails", "gestion mail"], response: "Gérer ses emails 📧 aide à rester organisé et serein." },
{ keywords: ["réseau social", "social media"], response: "Partager moments et idées 🌟 enrichit les relations et la vie sociale." },
{ keywords: ["notifications", "alertes"], response: "Configurer notifications 🔔 garde informé sans être dérangé." },
{ keywords: ["jeu mobile", "appli"], response: "Jouer un petit jeu 🎮 détend et amuse." },
{ keywords: ["ebook", "lecture numérique"], response: "Lire un ebook 📖 enrichit connaissances et imagination." },
{ keywords: ["podcast", "audio learning"], response: "Écouter un podcast 🎧 informe et divertit à la fois." },
{ keywords: ["motivation", "énergie"], response: "Une attitude positive 🌟 rend chaque journée meilleure." },
{ keywords: ["positivité", "bien-être"], response: "Conserver un esprit positif 😄 améliore humeur et relations." },
{ keywords: ["calme intérieur", "zen"], response: "Trouver le calme intérieur 🕊️ apporte sérénité et clarté." },
{ keywords: ["respiration consciente", "mindfulness"], response: "Respirer consciemment 🌬️ réduit stress et tension." },
{ keywords: ["relaxation", "détente"], response: "Prendre du temps pour se détendre 😌 recharge l’énergie." },
{ keywords: ["récompense", "petit plaisir"], response: "Se faire un petit plaisir 🍫 rend la journée plus douce." },
{ keywords: ["créativité", "projets artistiques"], response: "Exprimer sa créativité 🎨 stimule l’esprit et l’imagination." },
{ keywords: ["apprentissage", "nouvelle compétence"], response: "Apprendre quelque chose de nouveau 📚 enrichit et motive." },
{ keywords: ["challenge personnel", "objectif"], response: "Se fixer des objectifs 🎯 améliore progression et satisfaction." },
{ keywords: ["succès", "réussite"], response: "Célébrer ses réussites 🎉 motive et inspire." },
{ keywords: ["confiance en soi", "self-esteem"], response: "Croire en soi 🌟 renforce courage et motivation." },
{ keywords: ["amitié", "copains"], response: "Entretenir l’amitié 🤗 rend la vie plus joyeuse." },
{ keywords: ["famille", "lien familial"], response: "Passer du temps avec la famille 👨‍👩‍👧‍👦 crée bonheur et souvenirs." },
{ keywords: ["relation amoureuse", "couple"], response: "Cultiver l’amour 💖 renforce complicité et bonheur." },
{ keywords: ["aventure", "voyage"], response: "Vivre des aventures ✈️ enrichit et éveille les sens." },
{ keywords: ["découverte", "nouvelle expérience"], response: "Découvrir de nouvelles expériences 🌍 élargit horizons et curiosité." },
{ keywords: ["sport collectif", "team sports"], response: "Pratiquer un sport collectif 🏀 renforce esprit d’équipe et énergie." },
{ keywords: ["natation", "swimming"], response: "Nager 🏊 revitalise le corps et apaise l’esprit." },
{ keywords: ["course à pied", "running"], response: "Courir 🏃‍♂️ améliore endurance et humeur." },
{ keywords: ["vélo", "cycling"], response: "Faire du vélo 🚴 stimule muscles et bien-être." },
{ keywords: ["danse", "dance"], response: "Danser 💃 libère énergie et joie." },
{ keywords: ["musique live", "concert"], response: "Aller à un concert 🎶 nourrit émotion et plaisir." },
{ keywords: ["festival", "event"], response: "Participer à un festival 🎉 crée souvenirs et bonheur." },
{ keywords: ["lecture relaxante", "fiction"], response: "Lire pour le plaisir 📖 détend et enrichit." },
{ keywords: ["journal intime", "writing"], response: "Écrire dans un journal ✍️ clarifie pensées et émotions." },
{ keywords: ["blog", "publication en ligne"], response: "Tenir un blog 🌐 partage idées et expériences." },
{ keywords: ["photographie nature", "nature photo"], response: "Capturer la nature 🌿 éveille curiosité et calme." },
{ keywords: ["voyage culturel", "museum"], response: "Visiter musées et expositions 🏛️ enrichit savoir et plaisir." },
{ keywords: ["histoire", "heritage"], response: "Découvrir l’histoire 📜 stimule curiosité et réflexion." },
{ keywords: ["science", "innovation"], response: "Explorer la science 🔬 nourrit curiosité et esprit critique." },
{ keywords: ["technologie", "gadgets"], response: "Découvrir de nouvelles technologies 💡 inspire et amuse." },
{ keywords: ["jeux de société", "board games"], response: "Jouer à des jeux de société 🎲 renforce liens et amusement." },
{ keywords: ["puzzles", "casse-tête"], response: "Résoudre des puzzles 🧩 stimule logique et concentration." },
{ keywords: ["échecs", "chess"], response: "Jouer aux échecs ♟️ développe stratégie et patience." },
{ keywords: ["cuisine exotique", "recette du monde"], response: "Préparer des plats du monde 🍛 enrichit goût et culture." },
{ keywords: ["dessin créatif", "sketch"], response: "Dessiner librement ✏️ stimule imagination et détente." },
{ keywords: ["peinture", "painting"], response: "Peindre 🎨 développe expression et relaxation." },
{ keywords: ["artisanat", "DIY"], response: "Faire de l’artisanat 🧵 crée satisfaction et créativité." },
{ keywords: ["tricot", "knitting"], response: "Tricoter 🧶 apaise et développe patience." },
{ keywords: ["broderie", "embroidery"], response: "Broder ✨ combine concentration et plaisir créatif." },
{ keywords: ["lecture scientifique", "science book"], response: "Lire des ouvrages scientifiques 📚 stimule curiosité et réflexion." },
{ keywords: ["apprentissage langue", "language learning"], response: "Apprendre une langue 🌍 ouvre de nouvelles perspectives." },
{ keywords: ["conversation", "dialogue"], response: "Discuter avec les autres 🗣️ enrichit points de vue et relations." },
{ keywords: ["réseautage", "networking"], response: "Établir des contacts 🤝 favorise opportunités et échanges." },
{ keywords: ["volontariat", "charité"], response: "Faire du bénévolat 🤲 apporte satisfaction et solidarité." },
{ keywords: ["écologie", "environnement"], response: "Protéger la nature 🌱 renforce respect et responsabilité." },
{ keywords: ["recyclage", "eco-friendly"], response: "Recycler ♻️ contribue à un monde plus sain." },
{ keywords: ["jardinage", "garden"], response: "Jardiner 🌸 procure plaisir et calme." },
{ keywords: ["plantes aromatiques", "herbs"], response: "Cultiver des herbes 🌿 embellit cuisine et esprit." },
{ keywords: ["pique-nique", "outdoor meal"], response: "Faire un pique-nique 🧺 combine nature et plaisir." },
{ keywords: ["randonnée montagne", "hiking"], response: "Randonner en montagne 🏞️ renforce endurance et vue splendide." },
{ keywords: ["camping", "camp"], response: "Camper sous les étoiles 🌌 relaxe et émerveille." },
{ keywords: ["vélo en forêt", "forest biking"], response: "Faire du vélo en forêt 🚵‍♂️ combine nature et sport." },
{ keywords: ["baignade lac", "swimming lake"], response: "Se baigner dans un lac 🏊 apaise et rafraîchit." },
{ keywords: ["plage", "beach"], response: "Profiter du soleil à la plage 🏖️ détend et revitalise." },
{ keywords: ["surf", "wave sport"], response: "Faire du surf 🏄‍♂️ allie adrénaline et plaisir." },
{ keywords: ["kayak", "canoe"], response: "Faire du kayak 🛶 connecte avec nature et effort physique." },
{ keywords: ["ski", "snow"], response: "Skier ⛷️ combine adrénaline et sport." },
{ keywords: ["snowboard", "board"], response: "Faire du snowboard 🏂 allie fun et sport." },
{ keywords: ["luge", "sled"], response: "Faire de la luge ❄️ amuse et stimule énergie." },
{ keywords: ["lecture fantasy", "imaginaire"], response: "Lire de la fantasy 🐉 nourrit imagination et curiosité." },
{ keywords: ["lecture thriller", "suspense"], response: "Lire un thriller 🔍 stimule esprit et suspense." },
{ keywords: ["lecture romance", "love story"], response: "Lire une romance 💌 apporte émotion et détente." },
{ keywords: ["lecture poésie", "poem"], response: "Lire de la poésie ✨ inspire et calme l’esprit." },
{ keywords: ["film action", "action movie"], response: "Regarder un film d’action 🎬 dynamise et divertit." },
{ keywords: ["film drame", "drama movie"], response: "Regarder un drame 🎥 éveille émotions et réflexion." },
{ keywords: ["film aventure", "adventure movie"], response: "Regarder un film d’aventure 🏔️ stimule imagination et curiosité." },
{ keywords: ["film animation", "cartoon"], response: "Un film d’animation 🎨 amuse et émerveille." },
{ keywords: ["dessin animé", "anime"], response: "Regarder un dessin animé 🐾 détend et amuse." },
{ keywords: ["jeu vidéo aventure", "video game"], response: "Jouer à un jeu d’aventure 🎮 stimule curiosité et créativité." },
{ keywords: ["jeu réflexion", "puzzle game"], response: "Les jeux de réflexion 🧠 développent logique et concentration." },
{ keywords: ["jeu coopération", "co-op game"], response: "Les jeux en coopération 🤝 renforcent liens et stratégie." },
{ keywords: ["jeu compétition", "competitive game"], response: "Les jeux compétitifs 🏆 motivent et développent esprit stratégique." },
{ keywords: ["motivation", "inspiration"], response: "Se sentir motivé 🌟 rend chaque tâche plus agréable." },
{ keywords: ["positive attitude", "optimisme"], response: "Adopter une attitude positive 😄 améliore humeur et relations." },
{ keywords: ["bienveillance", "gentillesse"], response: "Être bienveillant 💖 enrichit relations et quotidien." },
{ keywords: ["empathie", "understanding"], response: "Montrer de l’empathie 🤗 renforce liens et compassion." },
{ keywords: ["soutien", "helping"], response: "Offrir du soutien 👐 rend service et crée satisfaction." },
{ keywords: ["courage", "bravery"], response: "Faire preuve de courage 💪 inspire confiance et dépassement." },
{ keywords: ["persévérance", "determination"], response: "Persévérer 🔥 mène à réussite et fierté." },
{ keywords: ["créativité quotidienne", "daily creativity"], response: "Exprimer créativité 🌈 enrichit vie et esprit." },
{ keywords: ["curiosité", "learning"], response: "Être curieux 🕵️‍♂️ ouvre à découvertes et savoir." },
{ keywords: ["challenge personnel", "personal goal"], response: "Se lancer un défi 🎯 stimule motivation et satisfaction." },
{ keywords: ["succès", "achievement"], response: "Atteindre un succès 🏅 apporte fierté et énergie." },
{ keywords: ["confiance en soi", "self-confidence"], response: "Croire en soi 🌟 renforce force et motivation." },
{ keywords: ["amitié", "friendship"], response: "Partager des moments avec amis 🤗 enrichit vie et joie." },
{ keywords: ["famille", "family time"], response: "Passer du temps en famille 👨‍👩‍👧‍👦 crée souvenirs et bonheur." },
{ keywords: ["amour", "couple"], response: "Cultiver l’amour 💖 renforce complicité et bonheur." },
{ keywords: ["découverte", "exploration"], response: "Découvrir de nouveaux horizons 🌍 élargit perspectives et curiosité." },
{ keywords: ["lecture développement personnel", "self-help"], response: "Lire des livres de développement personnel 📘 renforce motivation et confiance." },
{ keywords: ["méditation guidée", "guided meditation"], response: "Suivre une méditation guidée 🧘 apaise esprit et émotions." },
{ keywords: ["respiration profonde", "breathing exercises"], response: "Pratiquer la respiration profonde 🌬️ réduit stress et anxiété." },
{ keywords: ["yoga matinal", "morning yoga"], response: "Faire du yoga le matin 🌅 stimule énergie et concentration." },
{ keywords: ["stretching", "étirement"], response: "S’étirer régulièrement 🤸‍♂️ prévient tensions et fatigue." },
{ keywords: ["marche quotidienne", "daily walk"], response: "Marcher chaque jour 🚶‍♀️ renforce santé et clarté d’esprit." },
{ keywords: ["course nature", "trail running"], response: "Courir en pleine nature 🏞️ combine sport et relaxation." },
{ keywords: ["cyclisme urbain", "city cycling"], response: "Faire du vélo en ville 🚴‍♀️ allie déplacement et activité physique." },
{ keywords: ["fitness maison", "home workout"], response: "Faire du fitness à la maison 💪 garde forme et motivation." },
{ keywords: ["renforcement musculaire", "strength training"], response: "Le renforcement musculaire 🏋️ tonifie corps et confiance." },
{ keywords: ["danse libre", "free dance"], response: "Danser librement 💃 libère énergie et créativité." },
{ keywords: ["chant", "singing"], response: "Chanter 🎤 éveille émotions et joie intérieure." },
{ keywords: ["instrument musique", "musical instrument"], response: "Jouer d’un instrument 🎹 développe concentration et plaisir." },
{ keywords: ["composition musicale", "music creation"], response: "Composer de la musique 🎶 stimule imagination et expression." },
{ keywords: ["peinture abstraite", "abstract painting"], response: "Peindre de l’abstrait 🎨 libère imagination et émotions." },
{ keywords: ["collage artistique", "art collage"], response: "Créer un collage 🖼️ mélange créativité et satisfaction." },
{ keywords: ["sculpture", "sculpting"], response: "Sculpter une œuvre 🗿 enrichit expression et patience." },
{ keywords: ["photographie urbaine", "urban photo"], response: "Photographier la ville 🏙️ développe regard et curiosité." },
{ keywords: ["film documentaire", "documentary"], response: "Regarder un documentaire 🎥 élargit connaissances et perspectives." },
{ keywords: ["podcast éducatif", "educational podcast"], response: "Écouter un podcast éducatif 🎧 enrichit savoir et réflexion." },
{ keywords: ["lecture scientifique", "science reading"], response: "Lire sur la science 🔬 stimule curiosité et esprit analytique." },
{ keywords: ["lecture philosophique", "philosophy"], response: "Explorer la philosophie 🧐 développe pensée critique et sagesse." },
{ keywords: ["lecture historique", "history"], response: "Lire l’histoire 📜 nourrit connaissance et réflexion." },
{ keywords: ["lecture psychologie", "psychology"], response: "Découvrir la psychologie 🧠 améliore compréhension et empathie." },
{ keywords: ["apprentissage en ligne", "online learning"], response: "Suivre un cours en ligne 💻 développe compétences et curiosité." },
{ keywords: ["écriture créative", "creative writing"], response: "Écrire de manière créative ✍️ stimule imagination et expression." },
{ keywords: ["journalisation", "journaling"], response: "Tenir un journal 📓 clarifie pensées et émotions." },
{ keywords: ["blogging", "writing blog"], response: "Écrire un blog 🌐 partage idées et expériences enrichissantes." },
{ keywords: ["lecture poésie", "poetry reading"], response: "Lire de la poésie ✨ éveille sensibilité et inspiration." },
{ keywords: ["lecture contes", "fairy tales"], response: "Lire des contes 🧚 stimule imagination et émerveillement." },
{ keywords: ["lecture BD", "comic books"], response: "Lire une BD 📖 amuse et divertit." },
{ keywords: ["cinéma classique", "classic movies"], response: "Regarder un film classique 🎞️ enrichit culture et émotion." },
{ keywords: ["cinéma contemporain", "modern movies"], response: "Regarder un film contemporain 🎬 nourrit curiosité et plaisir." },
{ keywords: ["séries TV", "tv series"], response: "Suivre une série 📺 combine détente et suspense." },
{ keywords: ["jeu de stratégie", "strategy game"], response: "Jouer à un jeu de stratégie ♟️ développe logique et réflexion." },
{ keywords: ["jeu de cartes", "card games"], response: "Les jeux de cartes 🃏 amusent et stimulent esprit." },
{ keywords: ["jeux coopératifs", "co-op games"], response: "Les jeux coopératifs 🤝 renforcent liens et collaboration." },
{ keywords: ["jeux solo", "solo games"], response: "Les jeux en solo 🎮 améliorent concentration et autonomie." },
{ keywords: ["voyage culturel", "cultural trip"], response: "Voyager pour découvrir la culture 🌍 enrichit esprit et curiosité." },
{ keywords: ["voyage aventure", "adventure trip"], response: "Partir en voyage d’aventure 🏔️ stimule courage et énergie." },
{ keywords: ["road trip", "travel by car"], response: "Faire un road trip 🚗 crée souvenirs et liberté." },
{ keywords: ["randonnée forêt", "forest hike"], response: "Randonner en forêt 🌲 apaise et revitalise." },
{ keywords: ["randonnée montagne", "mountain hike"], response: "Explorer la montagne 🏞️ renforce endurance et émerveillement." },
{ keywords: ["camping", "camping outdoors"], response: "Camper sous les étoiles 🌌 offre détente et connexion à la nature." },
{ keywords: ["plage", "beach time"], response: "Profiter de la plage 🏖️ détend corps et esprit." },
{ keywords: ["baignade mer", "sea swim"], response: "Se baigner dans la mer 🌊 rafraîchit et revitalise." },
{ keywords: ["sports nautiques", "water sports"], response: "Pratiquer un sport nautique 🏄 combine adrénaline et plaisir." },
{ keywords: ["ski", "skiing"], response: "Skier ⛷️ dynamise corps et esprit." },
{ keywords: ["snowboard", "snowboarding"], response: "Faire du snowboard 🏂 stimule adrénaline et équilibre." },
{ keywords: ["patinage", "ice skating"], response: "Patiner ⛸️ développe coordination et plaisir." },
{ keywords: ["motivation quotidienne", "daily motivation"], response: "Se sentir motivé chaque jour 🌟 améliore humeur et énergie." },
{ keywords: ["attitude positive", "positive mindset"], response: "Adopter une attitude positive 😄 enrichit vie et relations." },
{ keywords: ["gentillesse", "kindness"], response: "Être gentil 💖 favorise bonheur et relations harmonieuses." },
{ keywords: ["empathie", "empathy"], response: "Montrer de l’empathie 🤗 renforce liens et compréhension." },
{ keywords: ["solidarité", "helping others"], response: "Agir avec solidarité 👐 apporte satisfaction et contribution." },
{ keywords: ["courage", "bravery"], response: "Faire preuve de courage 💪 inspire confiance et dépassement." },
{ keywords: ["persévérance", "perseverance"], response: "Persévérer 🔥 mène à accomplissements et fierté." },
{ keywords: ["créativité", "creativity"], response: "Exprimer créativité 🌈 enrichit vie et imagination." },
{ keywords: ["curiosité", "curiosity"], response: "Rester curieux 🕵️‍♂️ ouvre à nouvelles découvertes et savoir." },
{ keywords: ["défi personnel", "personal challenge"], response: "Se lancer un défi 🎯 stimule motivation et satisfaction." },
{ keywords: ["réussite", "achievement"], response: "Atteindre un objectif 🏅 apporte fierté et énergie." },
{ keywords: ["confiance en soi", "self-confidence"], response: "Croire en soi 🌟 renforce force et motivation." },
{ keywords: ["relations amicales", "friendship"], response: "Partager des moments avec amis 🤗 enrichit vie et joie." },
{ keywords: ["temps en famille", "family time"], response: "Profiter de la famille 👨‍👩‍👧‍👦 crée souvenirs et bonheur." },
{ keywords: ["amour", "romantic relationship"], response: "Cultiver l’amour 💖 renforce complicité et bonheur." },
{ keywords: ["exploration", "exploration"], response: "Explorer de nouveaux horizons 🌍 élargit perspectives et curiosité." },
{ keywords: ["lecture motivation", "inspirational reading"], response: "Lire des textes motivants 🌟 booste énergie et confiance." },
{ keywords: ["affirmations positives", "positive affirmations"], response: "Répéter des affirmations positives 🗣️ renforce mindset et estime de soi." },
{ keywords: ["gratitude", "daily gratitude"], response: "Pratiquer la gratitude 🙏 améliore humeur et bien-être." },
{ keywords: ["journée productive", "productive day"], response: "Organiser sa journée 🗓️ augmente efficacité et satisfaction." },
{ keywords: ["objectif quotidien", "daily goal"], response: "Se fixer un objectif quotidien 🎯 stimule motivation et accomplissement." },
{ keywords: ["planification", "planning"], response: "Planifier activités et priorités 📝 apporte clarté et sérénité." },
{ keywords: ["gestion du temps", "time management"], response: "Bien gérer son temps ⏰ réduit stress et améliore productivité." },
{ keywords: ["pause détente", "relaxation break"], response: "Prendre des pauses détente ☕ recharge énergie et concentration." },
{ keywords: ["sieste courte", "short nap"], response: "Faire une courte sieste 😴 revitalise corps et esprit." },
{ keywords: ["écoute active", "active listening"], response: "Pratiquer l’écoute active 👂 renforce communication et relations." },
{ keywords: ["discussion enrichissante", "meaningful conversation"], response: "Avoir une discussion enrichissante 🗣️ stimule réflexion et liens." },
{ keywords: ["lecture inspirante", "inspiring book"], response: "Lire un livre inspirant 📚 nourrit motivation et imagination." },
{ keywords: ["citation motivante", "motivational quote"], response: "Se rappeler une citation motivante 💬 inspire énergie et action." },
{ keywords: ["visualisation", "visualization"], response: "Pratiquer la visualisation 🖼️ renforce objectifs et confiance." },
{ keywords: ["méditation pleine conscience", "mindfulness meditation"], response: "Faire de la pleine conscience 🧘‍♂️ apaise esprit et émotions." },
{ keywords: ["balade nature", "nature walk"], response: "Se promener dans la nature 🌿 revitalise corps et esprit." },
{ keywords: ["observation animaux", "animal watching"], response: "Observer les animaux 🐦 procure calme et émerveillement." },
{ keywords: ["jardinage", "gardening"], response: "Jardiner 🌱 stimule patience et connexion avec nature." },
{ keywords: ["cuisine saine", "healthy cooking"], response: "Cuisiner sainement 🥗 nourrit corps et énergie." },
{ keywords: ["nouvelle recette", "new recipe"], response: "Tester une nouvelle recette 🍲 éveille créativité et plaisir." },
{ keywords: ["dessin", "drawing"], response: "Dessiner ✏️ développe imagination et concentration." },
{ keywords: ["coloriage adulte", "adult coloring"], response: "Colorier 🎨 détend esprit et réduit stress." },
{ keywords: ["collage créatif", "creative collage"], response: "Faire un collage créatif 🖼️ stimule expression et plaisir." },
{ keywords: ["lecture BD", "comic reading"], response: "Lire une bande dessinée 📖 combine détente et imagination." },
{ keywords: ["film inspirant", "inspiring movie"], response: "Regarder un film inspirant 🎬 booste motivation et énergie." },
{ keywords: ["musique relaxante", "relaxing music"], response: "Écouter de la musique relaxante 🎶 apaise esprit et émotions." },
{ keywords: ["musique énergisante", "energetic music"], response: "Écouter de la musique énergisante 🎵 stimule dynamisme et humeur." },
{ keywords: ["podcast motivation", "motivational podcast"], response: "Écouter un podcast motivant 🎧 enrichit esprit et motivation." },
{ keywords: ["apprentissage langue", "language learning"], response: "Apprendre une nouvelle langue 🗣️ ouvre esprit et horizons." },
{ keywords: ["écriture réflexive", "reflective writing"], response: "Écrire pour réfléchir ✍️ clarifie pensées et émotions." },
{ keywords: ["lettre à soi-même", "letter to self"], response: "Écrire une lettre à soi-même 💌 renforce introspection et bien-être." },
{ keywords: ["apprentissage musical", "music learning"], response: "Apprendre un instrument 🎹 développe créativité et patience." },
{ keywords: ["chant", "singing"], response: "Chanter 🎤 libère émotions et stimule joie intérieure." },
{ keywords: ["danse", "dancing"], response: "Danser 💃 libère énergie et créativité." },
{ keywords: ["marche méditative", "meditative walk"], response: "Marcher en méditation 🚶‍♂️ apaise esprit et équilibre émotionnel." },
{ keywords: ["yoga doux", "gentle yoga"], response: "Pratiquer yoga doux 🧘 améliore souplesse et sérénité." },
{ keywords: ["fitness léger", "light fitness"], response: "Faire un fitness léger 💪 dynamise corps et esprit." },
{ keywords: ["exercice respiration", "breathing exercise"], response: "Pratiquer exercices de respiration 🌬️ réduit stress et tension." },
{ keywords: ["relaxation guidée", "guided relaxation"], response: "Suivre une relaxation guidée 🧘‍♀️ apaise esprit et corps." },
{ keywords: ["lecture spiritualité", "spiritual reading"], response: "Lire sur la spiritualité 🌟 nourrit paix intérieure et réflexion." },
{ keywords: ["prière", "prayer"], response: "Pratiquer la prière 🙏 renforce calme et gratitude." },
{ keywords: ["affirmation gratitude", "gratitude affirmation"], response: "Répéter affirmations de gratitude 💖 augmente positivité et bien-être." },
{ keywords: ["nature observation", "nature observation"], response: "Observer la nature 🌳 stimule émerveillement et détente." },
{ keywords: ["observation ciel", "sky watching"], response: "Regarder le ciel 🌌 favorise calme et contemplation." },
{ keywords: ["voyage découverte", "discovery trip"], response: "Voyager pour découvrir 🌍 enrichit esprit et culture." },
{ keywords: ["exploration urbaine", "urban exploration"], response: "Explorer la ville 🏙️ stimule curiosité et énergie." },
{ keywords: ["photographie nature", "nature photography"], response: "Prendre des photos de nature 📸 procure plaisir et créativité." },
{ keywords: ["photographie portrait", "portrait photography"], response: "Photographier des portraits 📷 développe sensibilité et observation." },
{ keywords: ["création vidéo", "video creation"], response: "Créer des vidéos 🎥 stimule imagination et expression." },
{ keywords: ["montage vidéo", "video editing"], response: "Monter une vidéo ✂️ améliore créativité et technique." },
{ keywords: ["lecture science", "science reading"], response: "Lire sur la science 🔬 enrichit savoir et curiosité." },
{ keywords: ["lecture technologie", "technology reading"], response: "Explorer la technologie 💻 nourrit curiosité et apprentissage." },
{ keywords: ["lecture histoire", "history reading"], response: "Lire l’histoire 📜 développe compréhension et esprit critique." },
{ keywords: ["lecture psychologie", "psychology reading"], response: "Découvrir la psychologie 🧠 améliore empathie et réflexion." },
{ keywords: ["lecture philosophie", "philosophy reading"], response: "Lire de la philosophie 🧐 stimule pensée critique et sagesse." },
{ keywords: ["lecture aventure", "adventure reading"], response: "Lire des aventures 📖 enrichit imagination et curiosité." },
{ keywords: ["lecture fiction", "fiction reading"], response: "Lire de la fiction 📚 divertit et stimule imagination." },
{ keywords: ["lecture biographies", "biography reading"], response: "Lire des biographies 👤 inspire et nourrit expérience." },
{ keywords: ["lecture poésie", "poetry reading"], response: "Lire de la poésie ✨ éveille sensibilité et inspiration." },
{ keywords: ["lecture contes", "fairy tales reading"], response: "Lire des contes 🧚 stimule imagination et émerveillement." },
{ keywords: ["lecture bandes dessinées", "comic reading"], response: "Lire des bandes dessinées 📖 amuse et divertit." },
{ keywords: ["film documentaire", "documentary film"], response: "Regarder un documentaire 🎥 enrichit connaissance et perspective." },
{ keywords: ["film animation", "animated film"], response: "Regarder un film d’animation 🐭 divertit et inspire créativité." },
{ keywords: ["film comédie", "comedy film"], response: "Regarder une comédie 😂 apporte rire et détente." },
{ keywords: ["film drame", "drama film"], response: "Regarder un drame 🎭 éveille émotion et réflexion." },
{ keywords: ["film action", "action film"], response: "Regarder un film d’action 💥 stimule adrénaline et excitation." },
{ keywords: ["jeu société", "board game"], response: "Jouer à un jeu de société 🎲 crée amusement et partage." },
{ keywords: ["jeu stratégie", "strategy game"], response: "Jouer à un jeu de stratégie ♟️ développe logique et réflexion." },
{ keywords: ["jeu puzzle", "puzzle game"], response: "Faire un puzzle 🧩 améliore concentration et patience." },
{ keywords: ["jeu créatif", "creative game"], response: "Jouer à un jeu créatif 🎨 stimule imagination et expression." },
{ keywords: ["jeu en ligne", "online game"], response: "Jouer en ligne 🎮 combine amusement et interaction." },
{ keywords: ["jeu coopératif", "co-op game"], response: "Jouer à un jeu coopératif 🤝 renforce collaboration et plaisir." },
{ keywords: ["jeu solo", "solo game"], response: "Jouer seul 🎯 développe autonomie et concentration." },
{ keywords: ["sport extérieur", "outdoor sport"], response: "Pratiquer un sport en extérieur 🏃‍♂️ renforce corps et esprit." },
{ keywords: ["sport intérieur", "indoor sport"], response: "Faire du sport en intérieur 🏋️ stimule énergie et forme." },
{ keywords: ["course", "running"], response: "Courir 🏃‍♀️ améliore endurance et bien-être." },
{ keywords: ["marche rapide", "brisk walking"], response: "Marcher rapidement 🚶‍♂️ tonifie corps et esprit." },
{ keywords: ["randonnée", "hiking"], response: "Faire une randonnée 🥾 renforce santé et connexion nature." },
{ keywords: ["vélo", "cycling"], response: "Faire du vélo 🚴 améliore endurance et énergie." },
{ keywords: ["natation", "swimming"], response: "Nager 🏊 revitalise corps et esprit." },
{ keywords: ["sports nautiques", "water sports"], response: "Pratiquer des sports nautiques 🏄 combine adrénaline et plaisir." },
{ keywords: ["ski", "skiing"], response: "Skier ⛷️ développe équilibre et dynamisme." },
{ keywords: ["snowboard", "snowboarding"], response: "Faire du snowboard 🏂 stimule adrénaline et coordination." },
{ keywords: ["patinage", "ice skating"], response: "Patiner ⛸️ améliore coordination et plaisir." },
{ keywords: ["plage", "beach time"], response: "Profiter de la plage 🏖️ détend corps et esprit." },
{ keywords: ["mer", "sea"], response: "Se baigner dans la mer 🌊 rafraîchit et revitalise." },
{ keywords: ["montagne", "mountain"], response: "Explorer la montagne 🏔️ renforce endurance et émerveillement." },
{ keywords: ["forêt", "forest"], response: "Se promener en forêt 🌲 apaise et revitalise." },

];


    for (const { keywords, response } of responses) {
        if (keywords.some(keyword => text.toLowerCase().includes(keyword))) return response;
    }

    return "Désolé, je n'ai pas compris. Essaie /wiki <terme> ou /help 😉";
}

// Requête Wikipédia
async function searchWikipedia(query) {
    const apiUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.extract) {
        return data.extract.length > 400
            ? data.extract.slice(0, 400) + "… (plus sur Wikipédia)"
            : data.extract;
    }
    return null;
}

// Envoyer message
async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage(`👤 ${input}`, "user-message");
    userInput.value = "";

    const typingDiv = showTyping();
    const response = await generateAIResponse(input);
    typingDiv.remove();

    await typeMessage(`🤖 ${response}`, "ai-message");
}

// Événements
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

wikiBtn.addEventListener("click", () => {
    userInput.value = "/wiki ";
    userInput.focus();
});
