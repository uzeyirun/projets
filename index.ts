// src/types/index.ts

export enum Couleur {
    Coeur = "Cœur",
    Carreau = "Carreau",
    Trefle = "Trèfle",
    Pique = "Pique",
    Atout = "Atout",   // Pour le Tarot
    Aucune = "Aucune"  // Pour Joker , Excuse
}

// sauvegarde JSON
export interface SauvegardeDonnees {
    typeJeu: string;
    historique: string[];
    joueurs: {
        nom: string;
        score: number;
        main: { valeur: number, nom: string, couleur: Couleur }[];
    }[];
    etatSpecifique?: any; 
}