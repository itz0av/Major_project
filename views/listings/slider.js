const right = document.querySelector("#sec-button");
const left = document.querySelector("#first-arrow");
const slider = document.querySelector(".filters");
const icon = document.querySelector(".filter");

let slideNumber = 1;
const length = icon.length;

const nextSlide = () => {
  console.log("working");
  slider.style.transform = `translateX(-${slideNumber * 180}px)`;
  slideNumber++;
  console.log(slideNumber);
};
const getFirstSlide = () => {
  slider.style.transform = `translateX(0px)`;
  slideNumber = 1;
};
right.addEventListener("click", () => {
  console.log("working");
  slideNumber < length ? nextSlide() : getFirstSlide();
});