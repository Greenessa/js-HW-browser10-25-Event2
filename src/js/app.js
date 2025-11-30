import saveInStorage from "./saveInStorage";
import workWithImg from "./workWithImg";

// comment this to pass build
const unusedVariable = "variable";

// for demonstration purpose only
export default function demo(value) {
  return `Demo: ${value}`;
}

console.log("app.js included");

const save = new saveInStorage(localStorage);
let imgApp = new workWithImg(save);
imgApp.loadImg();
