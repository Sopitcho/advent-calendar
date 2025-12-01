/* ===========================
    Calendrier — script principal
    Français — responsive — mode test/admin
    =========================== */

/* ========== CONFIG ========== */
// ⚠️ VÉRIFIEZ ET METTEZ À JOUR L'URL DE VOTRE APPS SCRIPT APRÈS CHAQUE DÉPLOIEMENT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUhHxS_hDuo1SK7_-ELVgAswnF_mMboj2dGKIo8hkOsZCyVAjcWrJZ68818Pv-D-8Elg/exec"; // Mettre à jour avec votre URL actuelle !

// Heure d'ouverture (9h)
const HEURE_OUVERTURE = 9;

// Jours (1..19 sans week-ends)
const JOURS = [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19];

const ENIGMES = {
  1:"J'ai un bureau mais je ne suis jamais dedans.. Qui suis-je ?",
  2:"En hiver, je porte souvent un bonnet, même s'il m'arrive de le perdre. Qui suis-je ?",
  3:"Je fais toujours attention à mon style. D'ailleurs, mes lunettes sont souvent accordées à mon pull et à mes basket. Qui suis-je ?",
  4:"Le plus beau déguisement du carnaval ? C'est moi ! Qui suis-je ?",
  5:"On ne me voit jamais sans un élève accroché à mes basket. Qui suis-je ?",
  8:" ",
  9:"J'ai battu un élève à Fifa.. il était doué mais je l'ai eu aux pélantys ! Qui suis-je ?",
  10:"Aujourd'hui défi particulier, pour l'emporter, il faut trouver où se trouve aumônerie et faire une photo de la salle. Bonne chance !",
  11:"Grâce à l'intervention de M.Albert, j'ai pu éviter une heure de colle. Qui suis-je ?",
  12:"Énigme 12...",
  15:"Énigme 15...",
  16:"Énigme 16...",
  17:"Énigme 17...",
  18:"Énigme 18...",
  19:"Énigme 19..."
};

/* positions visuelles */
const POSITIONS = [
  {left:"10%", top:"8%"},
  {left:"78%", top:"10%"},
  {left:"8%", top:"32%"},
  {left:"38%", top:"62%"},
  {left:"70%", top:"44%"},
  {left:"52%", top:"18%"},
  {left:"22%", top:"46%"},
  {left:"12%", top:"72%"},
  {left:"80%", top:"66%"},
  {left:"50%", top:"36%"},
  {left:"28%", top:"12%"},
  {left:"62%", top:"78%"},
  {left:"40%", top:"8%"},
  {left:"86%", top:"36%"},
  {left:"66%", top:"54%"}
];

/* ========== MODE TEST & ADMIN ========== */
/* true = mode test activé (simule jour+heure). Mets false en production */
let MODE_TEST = false;

/* jour et heure simulés (si MODE_TEST = true) */
let JOUR_SIMULE = 5;    // change le jour ici pour tester (ou appuie sur "A")
let HEURE_SIMULE = 12; // change l'heure simulée

/* admin secret : appuie sur "A" pour saisir un jour (prompt) */
document.addEventListener("keydown", (e) => {
  if (e.key === "A") {
    const j = prompt("Jour à simuler (1-24) — laisse vide pour désactiver");
    if (j === null) return;
    if (j.trim() === "") {
      MODE_TEST = false;
      alert("Mode test désactivé.");
      window.location.reload();
      return;
    }
    const jj = parseInt(j);
    if (!isNaN(jj)) {
      MODE_TEST = true;
      JOUR_SIMULE = jj;
      alert("Mode test activé → jour simulé : " + JOUR_SIMULE);
      window.location.reload();
    }
  }
});

/* retourne un objet Date utilisé par le site (réel ou simulé) */
function obtenirDateActuelle(){
  const maintenant = new Date();
  if (MODE_TEST) {
    return new Date(maintenant.getFullYear(), 11, JOUR_SIMULE, HEURE_SIMULE, 0, 0);
  }
  return maintenant;
}

/* ========== INIT SCÈNE ========== */
const scene = document.getElementById("scene");
const annee = new Date().getFullYear();
const mois = 11; // décembre

let caseOuverte = null;

/* génération des flocons */
function genererFlocons(){
  scene.innerHTML = "";
  const dateUtilisee = obtenirDateActuelle();

  JOURS.forEach((jour, i) => {
    const fl = document.createElement("div");
    fl.className = "flake";
    fl.style.left = POSITIONS[i % POSITIONS.length].left;
    fl.style.top = POSITIONS[i % POSITIONS.length].top;
    fl.style.animation = `floaty ${5 + (i % 3)}s ease-in-out ${i % 2}s infinite`;
    fl.dataset.jour = jour;

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = jour;
    fl.appendChild(num);

    const dateCase = new Date(annee, mois, jour, HEURE_OUVERTURE, 0, 0);

    if (dateUtilisee < dateCase) {
      fl.classList.add("trop-tot");
    } else if (dateUtilisee.toDateString() !== dateCase.toDateString()) {
      // jour passé
      fl.classList.add("passe");
    }

    fl.addEventListener("click", () => onFlakeClick(jour, fl));
    scene.appendChild(fl);
  });
}

/* appel initial */
genererFlocons();

/* ========== MODAL + FLOW ========== */
const modal = document.getElementById("modal");
const etapeNom = document.getElementById("step-name");
const etapeEnigme = document.getElementById("step-enigme");
const etapeFini = document.getElementById("step-done");

const btnFermer = document.getElementById("modal-close");
const btnDoneClose = document.getElementById("done-close");
if (btnFermer) btnFermer.onclick = () => modal.classList.add("hidden");
if (btnDoneClose) btnDoneClose.onclick = () => modal.classList.add("hidden");

const inputNom = document.getElementById("input-name");
const inputReponse = document.getElementById("input-answer");

const msgNom = document.getElementById("modal-msg");
const msgReponse = document.getElementById("modal-msg-2");

const titreEnigme = document.getElementById("modal-title-enigme");
const texteEnigme = document.getElementById("enigme-text");

/* au clic sur un flocon */
function onFlakeClick(jour, element){
  const dateCase = new Date(annee, mois, jour, HEURE_OUVERTURE, 0, 0);
  const dateUtilisee = obtenirDateActuelle();

  if (dateUtilisee < dateCase) {
    // Pas encore ouvert : préciser l'heure exacte
    alert(`Trop tôt — l'énigme s'ouvrira le ${dateCase.toLocaleDateString()} à ${HEURE_OUVERTURE}h.`);
    return;
  }

  if (dateUtilisee.toDateString() !== dateCase.toDateString()) {
    alert("Jour passé — réponses fermées.");
    return;
  }

  // c'est le jour J et l'heure est passée => ouvrir flow
  caseOuverte = jour;
  if (inputNom) inputNom.value = "";
  if (inputReponse) inputReponse.value = "";
  if (msgNom) msgNom.textContent = "";
  if (msgReponse) msgReponse.textContent = "";

  if (etapeNom) etapeNom.classList.remove("hidden");
  if (etapeEnigme) etapeEnigme.classList.add("hidden");
  if (etapeFini) etapeFini.classList.add("hidden");

  if (modal) modal.classList.remove("hidden");
}

/* bouton suivant -> afficher énigme */
if (document.getElementById("to-enigme")) {
    document.getElementById("to-enigme").onclick = () => {
        if (!inputNom.value.trim()) {
            msgNom.textContent = "Entre ton nom.";
            return;
        }
        msgNom.textContent = "";
        etapeNom.classList.add("hidden");
        etapeEnigme.classList.remove("hidden");

        titreEnigme.textContent = `Jour ${caseOuverte}`;
        texteEnigme.textContent = ENIGMES[caseOuverte] || "Aucune énigme définie.";
        setTimeout(()=> inputReponse.focus(), 120);
    };
}


/* envoi de la réponse vers Google Sheets (Apps Script) */
if (document.getElementById("send-answer")) {
    document.getElementById("send-answer").onclick = async () => {
        if (!inputReponse || !inputReponse.value.trim()) {
            msgReponse.textContent = "Entre une réponse.";
            return;
        }

        const payload = {
            nom: inputNom.value.trim(),
            jour: caseOuverte,
            reponse: inputReponse.value.trim()
        };

        msgReponse.textContent = "Envoi en cours..."; // Ajout d'un feedback pendant l'attente

        try {
            const res
