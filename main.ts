//UzeyirUnver et AronaBa 
//Saé 3.01


import { Belote } from "./games/Belote.ts";
import { Carte } from "./models/Cartes.ts";
import { Couleur } from "./types/index.ts";

function scenarioSauvegardeReplay() {
    console.clear();
   

   
    // 1 Démarrage et PREMIER TOUR DE JEU
 
    console.log(" Démarrage de la partie");
    
    // Noms des joueurs
    const belote = new Belote(["Uzeyir", "Arona", "Alain", "Alice"]);
    
    // Préparation
    belote.initialiserPaquet();
    belote.melanger();
    belote.setAtout(Couleur.Coeur); // On définit l'atout
    belote.distribuer([5]); // On distribue 5 cartes chacun pour tester

    console.log("\n Tout le monde joue une carte !");
    
    // chaque joueur pose une carte
   
    const joueurs = (belote as any).joueurs;
    const pli: Carte[] = [];

    // Chaque joueur joue sa première carte
    for (const joueur of joueurs) {
        const carteJouee = joueur.jouerCarte(0); // Joue la carte à l'index 0
        if (carteJouee) {
            console.log(`    ${joueur.getNom()} joue : ${carteJouee.toString()}`);
            pli.push(carteJouee);
            // On l'ajoute à l'historique pour le replay
            (belote as any).ajouterAction(`${joueur.getNom()} a joué ${carteJouee.toString()}`);
        }
    }

    // gagnant
    let indexGagnant = 0;
    let carteGagnante = pli[0];

    for (let i = 1; i < pli.length; i++) {
    
        if (belote.comparerCartes(carteGagnante, pli[i]) === -1) {
            carteGagnante = pli[i];
            indexGagnant = i;
        }
    }

    const nomGagnant = joueurs[indexGagnant].getNom();
    const points = belote.calculerPoints(pli);
    
    console.log(`\n C'est ${nomGagnant} qui ramasse , +${points} points`);
    (belote as any).ajouterAction(` ${nomGagnant} remporte le pli avec ${points} pts)`);

    //  Sauvegarde
  
    console.log("\nSauvegarde de la partie ");
    const fichierSauvegardeJSON = belote.sauvegarder();
   


    
    //  Restauration
    
    
    console.log("Chargement de la sauvegarde");

    const nouvellePartie = new Belote(["?", "?", "?", "?"]);
    nouvellePartie.charger(fichierSauvegardeJSON);
    
    console.log("Partie restaurée ");
    
  
 
    nouvellePartie.afficherReplay();


}

scenarioSauvegardeReplay();