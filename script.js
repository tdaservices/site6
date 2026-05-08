(function () {
    emailjs.init("-Qmqar30LPSa43TjM");
})();

document.querySelectorAll(".service button").forEach(btn => {
    btn.addEventListener("click", () => {

        const DELAI_ANTI_SPAM = 30 * 60 * 1000;

        function ask(question, validator = null, transform = null) {
            let value;

            while (true) {
                value = prompt(question);

                if (value === null || value.trim() === "") {
                    alert("⚠️ Annulation du message");
                    throw "cancel";
                }

                value = value.trim();

                if (transform) value = transform(value);

                if (!validator || validator(value)) return value;

                alert("❌ Format invalide, veuillez réessayer.");
            }
        }

        function normalizeName(str) {
            return str
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        try {
            // ⛔ Anti-spam
            let lastSend = localStorage.getItem("lastEmailSend");

            if (lastSend) {
                let diff = Date.now() - parseInt(lastSend);

                if (diff < DELAI_ANTI_SPAM) {
                    let minutes = Math.ceil((DELAI_ANTI_SPAM - diff) / 60000);
                    alert("⏳ Attendez encore " + minutes + " minute(s).");
                    return;
                }
            }

            // 🎯 Récupération du service cliqué
            let serviceDiv = btn.closest(".service");

            if (!serviceDiv) {
                console.error("Service introuvable");
                return;
            }

            let serviceName = serviceDiv.querySelector("h3")?.textContent || "Inconnu";
            let adresse = serviceDiv.querySelectorAll("p")[1]?.textContent || "Inconnue";

            console.log("Service sélectionné :", serviceName);
            console.log("Adresse :", adresse);

            // 👤 Infos utilisateur
            let nom = ask("Nom :", v => v.length >= 2, normalizeName);
            let prenom = ask("Prénom :", v => v.length >= 2, normalizeName);

            let telephone = ask(
                "Téléphone (10 chiffres) :",
                v => /^[0-9]{10}$/.test(v)
            );

            let email = ask(
                "Email :",
                v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                v => v.toLowerCase()
            );

            let heure = ask("Heure souhaitée :");

            // ✅ RGPD
            let consentement = confirm("J'accepte que mes données soient utilisées pour être recontacté.");

            if (!consentement) {
                alert("❌ Consentement requis.");
                return;
            }

            let params = {
                service: serviceName,
                adresse: adresse,
                nom: nom,
                prenom: prenom,
                telephone: telephone,
                email: email,
                heure: heure,
                time: new Date().toLocaleString()
            };

            console.log("📤 Envoi EmailJS :", params);

            emailjs.send("service_kqfkmxs", "template_gcwwqhr", params)
                .then(() => {
                    localStorage.setItem("lastEmailSend", Date.now().toString());
                    alert("✅ Demande envoyée !");
                })
                .catch(err => {
                    console.error("❌ Erreur EmailJS :", err);
                    alert("❌ Erreur lors de l'envoi.");
                });

        } catch (e) {
            if (e !== "cancel") {
                console.error("❌ Erreur JS :", e);
            }
        }
    });
});