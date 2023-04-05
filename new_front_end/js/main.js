const heart = document.querySelector('.heart_btn'); // 하트 요소 부분을 선택해서 가져옴

heart.addEventListener('click', function(){
    heart.classList.toggle('on'); // 하트 클릭 시 .on 클래스 추가
});

window.addEventListener('DOMContentLoaded', function(){

});