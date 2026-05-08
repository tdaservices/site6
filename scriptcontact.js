(function(){
    emailjs.init("-Qmqar30LPSa43TjM");
})();

const form = document.getElementById("contact-form");

form.addEventListener("submit", function(e) {
    e.preventDefault(); // empêche rechargement

    // récupérer les valeurs
    const nom = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const message = form.message.value.trim();

    // vérification simple
    if (!nom || !email || !message) {
        alert("❌ Veuillez remplir tous les champs.");
        return;
    }

    // message en cours (optionnel mais utile)
    alert("⏳ Envoi du message en cours...");

    const params = {
        user_name: nom,
        user_email: email,
        message: message,
        time: new Date().toLocaleString()
    };

    emailjs.send("service_kwwzkxd", "template_p0pf2rc", params)
    .then(function(response) {
        alert("✅ Message envoyé avec succès ! Nous vous recontactons dès que possible !");
        form.reset();
    })
    .catch(function(error) {
        alert("❌ Erreur lors de l'envoi. Veuillez réessayer.");
        console.log(error);
    });
});