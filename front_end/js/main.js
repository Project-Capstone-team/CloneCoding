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
        // console.log("하트");
        let pk = elem.getAttribute('name'); // pk 값을 받아옴

        $.ajax({ // Ajax 통신은 $.ajax로 시작함
            Method: 'POST', // 에러날 경우 GET으로 변경 가능
            url: 'data/like.json',
            data: {pk},
            dataType: 'json', // 어떻게 들어올지 설정
            success: function(response) { // 통신에 성공한 데이터가 response로 들어옴
                let likeCount = document.querySelector('#like-count-37'); // CSS 선택자에 매치되는 element 중 첫 번째 항목 반환
                likeCount.innerHTML = '좋아요' + response.like_count + '개';
            },
            error: function(request, status, error){
                alert('로그인이 필요합니다.');
                window.location.replace('https://www.naver.com'); // 임시 에러 웹 페이지로 이동
            }
        })
    } else if(elem.matches('[data-name="bookmark"]')) { 
        // console.log("북마크");
        let pk = elem.getAttribute('name'); // pk 값을 받아옴
        $.ajax({
            Method: 'POST', // 에러날 경우 GET으로 변경 가능
            url: 'data/bookmark.json',
            data: {pk},
            dataType: 'json', // 어떻게 들어올지 설정
            success: function(response) { // 통신에 성공한 데이터가 response로 들어옴
                let bookmarkCount = document.querySelector('#bookmark-count-37');
                bookmarkCount.innerHTML = '북마크' + response.bookmark_count + '개';
            },
            error: function(request, status, error){
                alert('로그인이 필요합니다.');
                window.location.replace('https://www.naver.com'); // 임시 에러 웹 페이지로 이동
            }
        })
    } else if(elem.matches('[data-name="comment"]')) {
        let content = document.querySelector('#add-comment-post37 > input[type=text]').value;

        console.log(content);

        if(content.length > 140) {
            alert('댓글은 최대 140자 입력 가능합니다. 현재 글자수 : ' + content.length);
            return;
        }

        $.ajax({
            Method: 'POST', // 에러날 경우 GET으로 변경 가능
            url: './comment.html', // ./는 현재 폴더를 뜻함
            data: {
                'pk': 37,
                'content': content
            },
            dataType: 'html',
            success: function(data) {
                document.querySelector('#comment-list-ajax-post37').insertAdjacentHTML('afterbegin', data);
            },
            error: function(request, status, error){
                alert('문제가 발생했습니다.');
            }
        })
        document.querySelector('#add-comment-post37>input[type=text]').value='';

    } else if(elem.matches('[data-name="comment_delete"]')) {
        $.ajax({
            Method: 'POST', // 에러날 경우 GET으로 변경 가능
            url: 'data/delete.json',
            data: {
                'pk': 37 // ''pk': pk
            },
            dataType: 'json',
            success: function(response) {
                if(response.status) {
                    let comt = document.querySelector('.comment-detail');
                    comt.remove();
                }
            },
            error: function(request, status, error){
                alert('문제가 발생했습니다.');
                window.location.replace('https://www.naver.com'); // 임시 에러 웹 페이지로 이동
            }
        })
    } else if(elem.matches('[data-name="follow"]')) {
        $.ajax({
            Method: 'POST', // 에러날 경우 GET으로 변경 가능
            url: 'data/follow.json',
            data: {
                'pk': 37
            },
            dataType: 'json',
            success: function(response) {
                if(response.status) {
                    document.querySelector('input.follow').value="팔로잉";
                }else {
                    document.querySelector('input.follow').value="팔로워";
                }
            },
            error: function(request, status, error){
                alert('문제가 발생했습니다.');
                window.location.replace('https://www.naver.com'); // 임시 에러 웹 페이지로 이동
            }
        })
    } else if(elem.matches('[data-name="share"]')) {
        console.log("공유");
    } if(elem.matches('[data-name="more"]')) {
        console.log("더보기");
    }

    elem.classList.toggle('on');
}

function resizeFunc() {
    if(pageYOffset >= 10) {
        let calcWidth = (window.innerWidth *0.5) +167; // 웹 페이지 기준으로 위치 재조정
        sidebox.style.left = calcWidth + 'px';
    }

    if(matchMedia('screen and (max-width : 800px)').matches) {
        // 여러개 컨텐츠 박스가 있으므로 배열 활용
        for(let i=0; i<variableWidth.length; i++) {
            variableWidth[i].style.width = window.innerHeight -20 +'px';
        }
    } else {
        for(let i=0; i<variableWidth.length; i++) {
            if(window.innerHeight > 600) // 기본 값이 614이므로 그 이상 커지지 않게
            variableWidth[i].removeAttribute('style');
        }
    }
}

function scrollFunc() {
    let scrollHeight = pageYOffset+window.innerHeight;
    let documentHeight = document.body.scrollHeight;

    console.log('scrollHeight : ' + scrollHeight);
    console.log('documentHeight : ' + documentHeight);

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
    if(scrollHeight >= documentHeight){
        let page = document.querySelector('#page').value;
        document.querySelector('#page').value = parseInt(page) + 1;

        callMorePostAjax(page);
        if(page > 5){
            return;
        }
    }
}

function callMorePostAjax(page){
    if(page > 5){
        return;
    }

    $.ajax({
        Method: 'POST', // 에러날 경우 GET으로 변경 가능
        url: './post.html',
        data: {
            'page': page
        },
        dataType: 'html',
        success: addMorePostAjax,
        error: function(request, status, error){
            alert('문제가 발생했습니다.');
            window.location.replace('https://www.naver.com'); // 임시 에러 웹 페이지로 이동
        }
    })
}

function addMorePostAjax(data){
    deligation.insertAdjacentHTML('beforeEnd', data);
}

setTimeout(function (){
    scrollTo(0,0);
},100); // 새로고침하면 화면이 제일 위로 가도록 

if(deligation) {
    deligation.addEventListener('click', deligationFunc);
}

window.addEventListener('resize', resizeFunc); 
window.addEventListener('scroll', scrollFunc); //스크롤시 scrollFunc 실행