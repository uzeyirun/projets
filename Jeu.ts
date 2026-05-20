// src/core/Jeu.ts
import { Joueur } from "../models/Joueur.ts";
import { Carte } from "../models/Cartes.ts";
import { Couleur, SauvegardeDonnees } from "../types/index.ts";

export abstract class Jeu {
    protected joueurs: Joueur[];
    protected paquet: Carte[];
    protected historique: string[];

    constructor(nomsJoueurs: string[]) {
        this.joueurs = nomsJoueurs.map(nom => new Joueur(nom));
        this.paquet = [];
        this.historique = [];
    }

    // Méthodes abstraites
    abstract initialiserPaquet(): void;
    abstract comparerCartes(c1: Carte, c2: Carte): number;
    abstract calculerPoints(pli: Carte[]): number;
    abstract conditionVictoire(): boolean;

    protected ajouterAction(action: string): void {
        const log = `[Tour ${this.historique.length + 1}] ${action}`;
        this.historique.push(log);
        console.log(log);
    }

    public afficherReplay(): void {
        console.log("\n Début du replay");
        for (const action of this.historique) {
            console.log("Replay : " + action);
        }
        console.log("fin du replay\n");
    }

    public melanger(): void {
        // Algorithme de Fisher-Yates
        for (let i = this.paquet.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.paquet[i];
            this.paquet[i] = this.paquet[j];
            this.paquet[j] = temp;
        }
        this.ajouterAction("Le paquet a été mélangé.");
    }

    public distribuer(pattern: number[]): void {
        let joueurIndex = 0;
        let patternIndex = 0;
        this.ajouterAction(`Distribution selon le pattern : ${pattern.join('-')}`);

        while (this.paquet.length > 0) {
            const nbCartes = pattern[patternIndex % pattern.length];
            if (this.paquet.length < nbCartes) break;

            for (let i = 0; i < nbCartes; i++) {
                const c = this.paquet.pop();
                if (c) this.joueurs[joueurIndex].recevoirCarte(c);
            }
            joueurIndex = (joueurIndex + 1) % this.joueurs.length;
            if (joueurIndex === 0) patternIndex++;
        }
    }

    public sauvegarder(): string {
        const donnees: SauvegardeDonnees = {
            typeJeu: this.constructor.name,
            historique: this.historique,
            joueurs: this.joueurs.map(j => ({
                nom: j.getNom(),
                score: j.getScore(),
                main: j.getMain().map(c => ({
                    valeur: c.getValeur(),
                    nom: c.getNom(),
                    couleur: c.getCouleur()
                }))
            }))
        };
        this.ajouterDonneesSpecifiques(donnees);
        return JSON.stringify(donnees);
    }

    public charger(jsonDonnees: string): void {
        const donnees: SauvegardeDonnees = JSON.parse(jsonDonnees);
        this.historique = donnees.historique;
        this.ajouterAction("Partie chargée depuis une sauvegarde");

        this.joueurs = [];
        for (const jData of donnees.joueurs) {
            const joueur = new Joueur(jData.nom);
            joueur.setScore(jData.score);
            for (const cData of jData.main) {
                joueur.recevoirCarte(new Carte(cData.valeur, cData.nom, cData.couleur));
            }
            this.joueurs.push(joueur);
        }

        if (donnees.etatSpecifique) {
            this.chargerDonneesSpecifiques(donnees);
        }
    }

    protected ajouterDonneesSpecifiques(data: SauvegardeDonnees): void {}
    protected chargerDonneesSpecifiques(data: SauvegardeDonnees): void {}

    // generer jeu
    protected genererJeu32(): void {
        const couleurs = [Couleur.Coeur, Couleur.Carreau, Couleur.Trefle, Couleur.Pique];
        const valeurs: [number, string][] = [
            [7,"7"], [8,"8"], [9,"9"], [10,"10"], 
            [11,"Valet"], [12,"Dame"], [13,"Roi"], [14,"As"]
        ];
        this.genererCartes(couleurs, valeurs);
    }

    protected genererJeu54(): void {
        const couleurs = [Couleur.Coeur, Couleur.Carreau, Couleur.Trefle, Couleur.Pique];
        const valeurs: [number, string][] = [];
        for(let i=2; i<=10; i++) valeurs.push([i, i.toString()]);
        valeurs.push([11,"Valet"], [12,"Dame"], [13,"Roi"], [14,"As"]);
        this.genererCartes(couleurs, valeurs);
        this.paquet.push(new Carte(15, "Joker Rouge", Couleur.Aucune));
        this.paquet.push(new Carte(15, "Joker Noir", Couleur.Aucune));
    }

    private genererCartes(couleurs: Couleur[], valeurs: [number, string][]): void {
        for (const c of couleurs) {
            for (const v of valeurs) {
                this.paquet.push(new Carte(v[0], v[1], c));
            }
        }
    }
}