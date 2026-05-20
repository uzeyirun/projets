// src/models/Carte.ts
import { Couleur } from "../types/index.ts"; 

export class Carte {
    private valeur: number;
    private nom: string;
    private couleur: Couleur;

    constructor(valeur: number, nom: string, couleur: Couleur) {
        this.valeur = valeur;
        this.nom = nom;
        this.couleur = couleur;
    }

    public getValeur(): number { return this.valeur; }
    public getNom(): string { return this.nom; }
    public getCouleur(): Couleur { return this.couleur; }

    public toString(): string {
        if (this.couleur === Couleur.Aucune) return `[${this.nom}]`;
        if (this.couleur === Couleur.Atout) return `[${this.nom} d'Atout]`;
        return `${this.nom} de ${this.couleur}`;
    }
}