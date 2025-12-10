export default class saveInStorage {
  constructor(storage) {
    this.storage = storage;
  }

  setInStorage(state) {
    this.storage.setItem("stateimg", JSON.stringify(state));
  }

  getFromStorage() {
    try {
      return JSON.parse(this.storage.getItem("stateimg"));
    } catch (error) {
      throw new Error("Invalid state");
    }
  }
}
