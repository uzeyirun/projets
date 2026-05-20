// src/games/Belote.ts
import { Jeu } from "../core/Jeu.ts";
import { Carte } from "../models/Cartes.ts";
import { Couleur, SauvegardeDonnees } from "../types/index.ts";

export class Belote extends Jeu {
    private atout: Couleur;

    constructor(noms: string[]) {
        super(noms);
        this.atout = Couleur.Coeur;
    }

    public setAtout(c: Couleur) {
        this.atout = c;
        this.ajouterAction(`L'atout est maintenant : ${c}`);
    }

    initialiserPaquet(): void {
        this.genererJeu32();
    }

    protected ajouterDonneesSpecifiques(donnees: SauvegardeDonnees): void {
        donnees.etatSpecifique = { atout: this.atout };
    }

    protected chargerDonneesSpecifiques(donnees: SauvegardeDonnees): void {
        if (donnees.etatSpecifique && donnees.etatSpecifique.atout) {
            this.atout = donnees.etatSpecifique.atout as Couleur;
        }
    }

    comparerCartes(c1: Carte, c2: Carte): number {
        const estAtout1 = c1.getCouleur() === this.atout;
        const estAtout2 = c2.getCouleur() === this.atout;

        if (estAtout1 && !estAtout2) return 1;
        if (!estAtout1 && estAtout2) return -1;

        if (estAtout1 && estAtout2) {
            return this.getForceAtout(c1) > this.getForceAtout(c2) ? 1 : -1;
        }

        if (c1.getCouleur() === c2.getCouleur()) {
            return this.getForceNonAtout(c1) > this.getForceNonAtout(c2) ? 1 : -1;
        }

        return 1;
    }

    calculerPoints(pli: Carte[]): number {
        let total = 0;
        for (const c of pli) {
            if (c.getCouleur() === this.atout) {
                if (c.getNom() === "Valet") total += 20;
                else if (c.getNom() === "9") total += 14;
                else total += this.getPointsGeneriques(c);
            } else {
                total += this.getPointsGeneriques(c);
            }
        }
        return total;
    }

    private getPointsGeneriques(c: Carte): number {
        switch (c.getNom()) {
            case "As": return 11;
            case "10": return 10;
            case "Roi": return 4;
            case "Dame": return 3;
            case "Valet": return 2;
            default: return 0;
        }
    }

    private getForceAtout(c: Carte): number {
        if (c.getNom() === "Valet") return 200;
        if (c.getNom() === "9") return 150;
        return c.getValeur();
    }

    private getForceNonAtout(c: Carte): number {
        if (c.getNom() === "10") return 13.5;
        return c.getValeur();
    }

    conditionVictoire(): boolean {
        return this.joueurs.some(j => j.getScore() >= 500);
    }
}