export class MHSF {
    private favorites: number = 0;
    private customization: any = {};

    getMHSF() {
        return {favorites: this.favorites, customization: this.customization}
    }

    setFavorites(num: number) {
        this.favorites = num;
        
    }

    setCustomizations(num: object) {
        this.customization = num;
    }
}