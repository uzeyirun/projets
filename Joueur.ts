// src/models/Joueur.ts
import { Carte } from "./Cartes.ts";
import { Couleur } from "../types/index.ts";

export class Joueur {
    private nom: string;
    private main: Carte[];
    private score: number;

    constructor(nom: string) {
        this.nom = nom;
        this.main = [];
        this.score = 0;
    }

    public getNom(): string { return this.nom; }
    public getScore(): number { return this.score; }
    public setScore(s: number): void { this.score = s; }
    public getMain(): Carte[] { return this.main; }

    public ajouterPoints(points: number): void {
        this.score += points;
    }

    public recevoirCarte(c: Carte): void {
        this.main.push(c);
    }

    public jouerCarte(index: number = 0): Carte | null {
        if (this.main.length > index) {
            return this.main.splice(index, 1)[0];
        }
        return null;
    }

    public aDesCartes(): boolean {
        return this.main.length > 0;
    }

    // tri a bulles
    public trierParValeur(): void {
        const n = this.main.length;
        let echange: boolean;
        do {
            echange = false;
            for (let i = 0; i < n - 1; i++) {
                if (this.main[i].getValeur() > this.main[i + 1].getValeur()) {
                    this.echanger(i, i + 1);
                    echange = true;
                }
            }
        } while (echange);
    }

    public trierParCouleurPuisValeur(): void {
        const ordreCouleurs = [Couleur.Coeur, Couleur.Carreau, Couleur.Trefle, Couleur.Pique, Couleur.Atout, Couleur.Aucune];
        
        const n = this.main.length;
        let echange: boolean;
        do {
            echange = false;
            for (let i = 0; i < n - 1; i++) {
                const c1 = this.main[i];
                const c2 = this.main[i + 1];
                const idx1 = ordreCouleurs.indexOf(c1.getCouleur());
                const idx2 = ordreCouleurs.indexOf(c2.getCouleur());

                if (idx1 > idx2 || (idx1 === idx2 && c1.getValeur() > c2.getValeur())) {
                    this.echanger(i, i + 1);
                    echange = true;
                }
            }
        } while (echange);
    }

    private echanger(i: number, j: number): void {
        const temp = this.main[i];
        this.main[i] = this.main[j];
        this.main[j] = temp;
    }
}