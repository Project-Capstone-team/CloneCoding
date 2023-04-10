// const heart = document.querySelector( '.heart_btn');
// 하트 요소 부분을 선택해서 가져옴
const header = document.querySelector('#header');
const sidebox = document.querySelector('.side_box');
const variableWidth = document.querySelectorAll('.contents_box .contents');
// SelectorAll 로 모든 요소 가져옴
const deligation = document.querySelector('.contents_box');

// heart.addEventListener('click', function(){
//     console.log('hit');
//     heart.classList.toggle('on'); // 하트 클릭 시 .on 클래스 추가
//     // toggle 메서드 : 클래스 존재한다면 클래스 제거,
//     //          클래스 존재하지 않으면 클레스 추가
// });

function deligationFunc(e) {
    let elem = e.target; //클릭한 요소 가져오기

    //잘못 클릭한 경우
    while(!elem.getAttribute('data-name')) {
        //elem의 부모를 찾음
        elem = elem.parentNode;
        if(elem.nodeName === 'BODY'){ //body까지 이벤트가 없을 경우
            elem=null;
            return;
        } //data-name을 가진 속성 찾을 때까지 부모에게 접근 반복함
    } 

    if(elem.matches('[data-name="heartbeat"]')) {
        console.log("하트");
    } else if(elem.matches('[data-name="bookmark"]')) {
        console.log("북마크");
    } else if(elem.matches('[data-name="share"]')) {
        console.log("공유");
    } else if(elem.matches('[data-name="more"]')) {
        console.log("더보기");
    }

    elem.classList.toggle('on');
}

function resizeFunc() {
    if(pageYOffset >= 10) {
        let calcWidth = (window.innerWidth *0.5) +167; //웹 페이지 기준으로 위치 재조정
        sidebox.style.left = calcWidth + 'px';
    }

    if(matchMedia('screen and (max-width : 800px)').matches) {
        // 여러개 컨텐츠 박스가 있으므로 배열 활용
        for(let i=0; i<variableWidth.length; i++) {
            variableWidth[i].style.width = window.innerHeight -20 +'px';
        }
    } else {
        for(let i=0; i<variableWidth.length; i++) {
            if(window.innerHeight > 600) //기본 값이 614이므로 그 이상 커지지 않게
            variableWidth[i].removeAttribute('style');
        }
    }
}

function scrollFunc() {
    if(pageYOffset >= 10) { // 스크롤할 경우, pageYOffset : 세로 스크롤 값
        header.classList.add('on');
        if(sidebox) {
            sidebox.classList.add('on');
        } resizeFunc();
    } else {
        header.classList.remove('on');
        if(sidebox) {
            sidebox.classList.remove('on');
            sidebox.removeAttribute('style');
        }
    }
}

setTimeout(function (){
    scrollTo(0,0);
},100); // 새로고침하면 화면이 제일 위로 가도록 

if(deligation) {
    deligation.addEventListener('click', deligationFunc);
}

window.addEventListener('resize', resizeFunc); 
window.addEventListener('scroll', scrollFunc); //스크롤시 scrollFunc 실행