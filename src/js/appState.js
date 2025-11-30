export default class SaveAppState {
    constructor() {
        this.imgArray = [];
    }

    static from(object) {
        // TODO: create object
        if (typeof object === 'object') {
          return object;
        }
        return null;
    }
}