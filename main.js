const container = document.querySelector('.img_container');
const startBtn = document.querySelector('.gameStart');
const gameText = document.querySelector('.gameText');
let playTime = document.querySelector('.time');
const tileCount = 16;
let tiles = [];
let dragged = {
    el: null,
    class: null,
    index: null
}
let isPlaying = false;
let timeInterval = null;
let time = 0;

function checkStatus() {
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child,index) => 
        Number(child.getAttribute('data-index')) !== index
    );
    console.log(unMatchedList);
    if(unMatchedList.length===0) {
        gameText.style.display ='block';
        isPlaying = false;
        clearInterval(timeInterval);
        time = 0;
        startBtn.innerText = 'start';
        startBtn.classList.toggle('playing');
    }
}

function setGame() {
    isPlaying = true;
    if(!isPlaying) return;
    container.innerHTML = '';
    gameText.style.display = 'none';
    clearInterval(timeInterval);

    timeInterval = setInterval(() => {
        playTime.innerText = time;
        time++;
        
    }, 1000)

    tiles = createImgFile();
    tiles.forEach( tile => container.appendChild(tile));
    setTimeout(() => {
        container.innerHTML = '';
        shuffle(tiles).forEach( tile => container.appendChild(tile))
    }, 5000);
}

function createImgFile() {
    const tempArray = [];
    Array(tileCount).fill().forEach((item, i) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', i);
        li.setAttribute('draggable',true);
        li.classList.add(`list${i}`);
        tempArray.push(li);
    })
    return tempArray;
}

function shuffle(array) {
    let index = array.length-1;
    while(index > 0){
        const randomIndex = Math.floor(Math.random()*(index+1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
        index--;
    }
    return array;
}

container.addEventListener('dragstart', e => {
    if(!isPlaying) return;
    let obj = e.target;
    dragged.el =obj;
    dragged.class =obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
});

container.addEventListener('dragover', e => {
    e.preventDefault();
    console.log('over');
});
container.addEventListener('drop', e => {
    if(!isPlaying) return;
    let obj = e.target;

   
   
    if(obj.className !== dragged.class) {
        let orginPlace;
        let isLast = false;
    
        // nextSibling은 자신의 다음 위치에 있는 요소, previousSlibling은 자신의 이전 위치에 있는 요소
        // nextSibling이 false인 경우에는 현재 자신이 마지막 위치에 있기 때문에 다음 위치에 있는 요소가 없는 경우
        if(dragged.el.nextSibling) orginPlace = dragged.el.nextSibling;
        else {
            orginPlace = dragged.el.previousSibling;
            isLast = true;
        }
       const droppedIndex = [...obj.parentNode.children].indexOf(obj);
       dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
       isLast ? orginPlace.after(obj) : orginPlace.before(obj);
   }

   checkStatus();


});

startBtn.addEventListener('click',() => {
    setGame();
    startBtn.innerText = '...ing';
    startBtn.classList.toggle('playing');
})