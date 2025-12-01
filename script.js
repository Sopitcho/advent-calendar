/* ===========================
    Calendrier — script principal
    Français — responsive — mode test/admin
    =========================== */

/* ========== CONFIG ========== */
// ⚠️ VÉRIFIEZ ET METTEZ À JOUR L'URL DE VOTRE APPS SCRIPT APRÈS CHAQUE DÉPLOIEMENT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUhHxS_hDuo1SK7_-ELVgAswnF_mMboj2dGKIo8hkOsZCyVAjcWrJZ68818Pv-D-8Elg/exec";

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
  {left:"86%", top:"3
