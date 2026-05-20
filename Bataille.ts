// src/games/Bataille.ts
import { Jeu } from "../core/Jeu.ts";
import { Carte } from "../models/Cartes.ts";

export class Bataille extends Jeu {
    constructor(noms: string[]) {
        super(noms);
    }

    initialiserPaquet(): void {
        this.genererJeu54(); 
    }

    comparerCartes(c1: Carte, c2: Carte): number {
        if (c1.getValeur() > c2.getValeur()) return 1;
        if (c1.getValeur() < c2.getValeur()) return -1;
        return 0;
    }

    calculerPoints(pli: Carte[]): number {
        return pli.length;
    }

    conditionVictoire(): boolean {
        return this.joueurs.some(j => !j.aDesCartes());
    }
}