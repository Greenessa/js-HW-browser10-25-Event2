import SaveAppState from "./appState";

export default class workWithImg {
  constructor(storage) {
    this.saveInStorage = storage;
    this.flagEl = document.querySelector("#flag");
    this.inputElName = document.querySelector("#imgname");
    this.inputElSrc = document.querySelector("#src");
    this.buttonEl = document.querySelector(".add");
    this.removeEl = document.querySelector(".img-container");
    this.imgContainerEl = document.querySelector(".img-container");
    this.saveSrcImg = this.saveSrcImg.bind(this);
    this.saveImg = this.saveImg.bind(this);
    this.loadImg = this.loadImg.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.saveAppState = new SaveAppState();
    this.inputElSrc.addEventListener("keypress", this.saveSrcImg);
    this.buttonEl.addEventListener("click", this.saveImg);
    this.removeEl.addEventListener("click", this.removeImg);
  }

  loadImg() {
    let obj = this.saveInStorage.getFromStorage();
    console.log(obj);
    this.saveAppState = SaveAppState.from(obj);
    console.log("Загруженные изображения", this.saveAppState.imgArray);
    if (this.saveAppState.imgArray) {
      this.addImg(this.saveAppState.imgArray);
    }
    this.flagEl.classList.remove("error");
    this.flagEl.classList.add("no-error");
  }

  saveSrcImg(event) {
    this.flagEl.classList.remove("error");
    this.flagEl.classList.add("no-error");
    if (event.code === "Enter") {
      // event.preventDefault();
      this.saveImg(event);
    }
  }

  saveImg(event) {
    this.flagEl.classList.remove("error");
    this.flagEl.classList.add("no-error");
    event.preventDefault();
    if (this.inputElSrc.value.trim() === "") {
      this.inputElSrc.setAttribute(
        "placeholder",
        "Ошибка! Вы ничего не ввели!",
      );
      return;
    }
    // Проверяем, что URL начинается с http/https или является относительным путем
    const urlPattern = /^(https?:\/\/|\/|\.\/|\.\.\/)/;
    if (!urlPattern.test(this.inputElSrc.value.trim())) {
      this.flagEl.textContent = "Неверный формат ссылки на изображение";
      this.flagEl.classList.remove("no-error");
      this.flagEl.classList.add("error");
      return;
    }
    const name = this.inputElName.value.trim() || "No name";
    const src = this.inputElSrc.value.trim();
    // автоматически формирyем правильный путь, используя window.location.origin
    // const fullUrl = new URL(src, window.location.origin).href;
    // Проверяем, нет ли уже такого изображения в массиве
    const isDuplicate = this.saveAppState.imgArray.some(
      (img) => img[1] === src,
    );
    if (isDuplicate) {
      this.flagEl.textContent = "Такое изображение уже добавлено";
      this.flagEl.classList.remove("no-error");
      this.flagEl.classList.add("error");
      return;
    }

    this.saveAppState.imgArray.push([name, src]);
    console.log("Массив текущий", this.saveAppState.imgArray);
    // Создаем временное изображение для проверки URL
    const testImg = new Image();
    testImg.onload = () => {
      this.addImg(this.saveAppState.imgArray);
      this.saveInStorage.setInStorage(this.saveAppState);
      this.inputElSrc.value = "";
      this.inputElName.value = "";
    };
    testImg.onerror = () => {
      // Удаляем добавленное изображение из массива, если оно не загрузилось
      this.saveAppState.imgArray.pop();
      this.flagEl.textContent =
        "Не удалось загрузить изображение по указанной ссылке";
      this.flagEl.classList.remove("no-error");
      this.flagEl.classList.add("error");
    };
    testImg.src = src;
    // testImg.src = fullUrl;
  }

  addImg(array) {
    // Сначала очищаем контейнер
    let imgEls = this.imgContainerEl.querySelectorAll(".container");
    if (imgEls) {
      for (const imgEl of imgEls) {
        imgEl.remove();
      }
    }
    // Создаем и добавляем изображения
    for (const img of array) {
      let imgNewEl = document.createElement("div");
      imgNewEl.classList.add("container");

      let nameEl = document.createElement("h3");
      nameEl.classList.add("name");
      nameEl.textContent = img[0];

      let srsEl = document.createElement("img");
      srsEl.classList.add("picture");
      srsEl.setAttribute("alt", img[0]);

      let butEl = document.createElement("button");
      butEl.classList.add("delete-button");
      butEl.innerHTML = "&times;";

      // Добавляем элементы в контейнер, но пока не добавляем в DOM
      imgNewEl.append(nameEl, butEl, srsEl);

      // Обработчик успешной загрузки
      srsEl.onload = () => {
        // Проверяем размеры изображения
        if (srsEl.naturalWidth === 0 || srsEl.naturalHeight === 0) {
          srsEl.onerror();
          return;
        }
        // Если всё в порядке, добавляем контейнер в DOM
        this.imgContainerEl.append(imgNewEl);
      };

      // Обработчик ошибки загрузки
      srsEl.onerror = () => {
        console.error("Ошибка загрузки изображения:", img[1]);
        this.flagEl.classList.remove("no-error");
        this.flagEl.classList.add("error");
        // Не добавляем контейнер в DOM, если изображение не загрузилось
      };
      // Устанавливаем источник изображения после добавления обработчиков
      srsEl.src = img[1];
    }
  }

  removeImg(event) {
    console.log(this.saveAppState.imgArray);
    if (event.target.classList.contains("delete-button")) {
      console.log(event.target.closest(".container"));
      let srcImg = event.target
        .closest(".container")
        .querySelector(".picture")
        .getAttribute("src");
      console.log(srcImg);
      event.target.closest(".container").remove();
      for (let i = this.saveAppState.imgArray.length - 1; i >= 0; i--) {
        if (this.saveAppState.imgArray[i][1] === srcImg) {
          this.saveAppState.imgArray.splice(i, 1);
        }
      }
      this.saveInStorage.setInStorage(this.saveAppState);
    }
    console.log(this.saveAppState.imgArray);
  }
}
