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
        { keywords: ["bonjour", "salut"], response: "Salut 👋 ! Comment ça va aujourd'hui ?" },
        { keywords: ["merci"], response: "Avec plaisir 😊 !" },
        { keywords: ["au revoir", "bye"], response: "Au revoir 👋 ! À bientôt !" },
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
