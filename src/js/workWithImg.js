import SaveAppState from "./appState";

export default class workWithImg {
    constructor(storage) {
        this.saveInStorage = storage;
        this.flagEl = document.querySelector('#flag');
        this.inputElName = document.querySelector('#imgname');
        this.inputElSrc = document.querySelector('#src');
        this.buttonEl = document.querySelector('.add');
        this.removeEl = document.querySelector('.img-container');
        this.imgContainerEl = document.querySelector('.img-container');
        this.saveSrcImg = this.saveSrcImg.bind(this);
        this.saveImg = this.saveImg.bind(this);
        this.loadImg = this.loadImg.bind(this);
        this.removeImg = this.removeImg.bind(this);
        this.saveAppState = new SaveAppState();
        this.inputElSrc.addEventListener('keypress', this.saveSrcImg);
        this.buttonEl.addEventListener('click',this.saveImg);
        this.removeEl.addEventListener('click',this.removeImg);
    }

    loadImg() {
        let obj = this.saveInStorage.getFromStorage();
        console.log(obj);
        this.saveAppState = SaveAppState.from(obj);
        console.log('Загруженные изображения', this.saveAppState.imgArray);
        if (this.saveAppState != null) {
            this.addImg(this.saveAppState.imgArray);
        } 
        this.flagEl.classList.remove('error');
        this.flagEl.classList.add('no-error');
    } 

    saveSrcImg (event) {
        this.flagEl.classList.remove('error');
        this.flagEl.classList.add('no-error');
        if (event.code === 'Enter') {
            // event.preventDefault();
            this.saveImg(event);
        }
    }

    saveImg (event) {
        this.flagEl.classList.remove('error');
        this.flagEl.classList.add('no-error');
        event.preventDefault();
        if (this.inputElSrc.value != '') {
            if (this.inputElName.value != '') {
                let containerArray = [];
                containerArray.push(this.inputElName.value);
                containerArray.push(this.inputElSrc.value);
                console.log('Текущее изображение', containerArray);
                this.saveAppState.imgArray.push(containerArray);
                console.log('Массив текущий', this.saveAppState.imgArray);
                this.addImg(this.saveAppState.imgArray);
                this.saveInStorage.setInStorage(this.saveAppState);  
            } else {
                this.saveAppState.imgArray.push(['No name', this.inputElSrc.value]);
                this.addImg(this.saveAppState.imgArray);
                // console.log('Массив текущий', this.saveAppState.imgArray);
                this.saveInStorage.setInStorage(this.saveAppState);  
            }
        this.inputElSrc.value = null;
        this.inputElName.value = null;
        } else {
            this.inputElSrc.setAttribute('placeholder', 'Ошибка! Вы ничего не ввели!');
        }
    }

    addImg (array) {
        let imgEls = this.imgContainerEl.querySelectorAll('.container');
        if (imgEls) {
            for (const imgEl of imgEls) {
                imgEl.remove();
            }
        }
        for (const img of array) {
            let imgNewEl = document.createElement('div');
            imgNewEl.classList.add('container');
            let nameEl=document.createElement('h3');
            nameEl.classList.add('name');
            nameEl.textContent = img[0];
            console.log(img[0], img[1]);
            let srsEl = document.createElement('img');
            srsEl.classList.add('picture');
            srsEl.src = img[1];
            srsEl.setAttribute('alt', '');
            let butEl = document.createElement('button');
            butEl.classList.add('delete-button');
            butEl.innerHTML = '&times;';
            imgNewEl.append(nameEl, butEl, srsEl);
            srsEl.onload = () => {
                // imgNewEl.append(srsEl);
                if (this.width + this.height == 0) {
                    this.onerror();
                    return;
                }
            }
            srsEl.onerror = () => {
                console.error('Ошибка загрузки изображения');
                this.flagEl.classList.remove('no-error');
                this.flagEl.classList.add('error');
            }

            // const blob = new Blob([img[1]], { type: 'text/plain' });
            // let url = URL.createObjectURL(blob);
            this.imgContainerEl.append(imgNewEl);
        }
        
    }

     removeImg (event) {
        console.log(this.saveAppState.imgArray)
        if (event.target.classList.contains('delete-button')) {
            console.log(event.target.closest('.container'));
            let srcImg = event.target.closest('.container').querySelector('.picture').getAttribute('src');
            console.log(srcImg)
            event.target.closest('.container').remove();
            for (let i = this.saveAppState.imgArray.length - 1; i >= 0; i--) {
                if (this.saveAppState.imgArray[i][1] === srcImg) {
                    this.saveAppState.imgArray.splice(i, 1);
                }
            }  
            this.saveInStorage.setInStorage(this.saveAppState);  
        }
        console.log(this.saveAppState.imgArray)
     }
}






