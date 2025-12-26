export default class SaveAppState {
  constructor() {
    this.imgArray = [];
  }

  // static from(object) {
  //   // TODO: create object
  //   if (typeof object === "object") {
  //     return object;
  //   }
  //   return null;
  // }

  static from(object) {
    if (typeof object === "object" && object !== null) {
      const instance = new SaveAppState();
      instance.imgArray = object.imgArray || [];
      return instance;
    }
    return new SaveAppState(); // Возвращаем новый экземпляр, если объект некорректен
  }
}
