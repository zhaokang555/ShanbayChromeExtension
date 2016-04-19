function createPopupAndAudio() {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.boxShadow = '5px 5px 10px #666666';
    popup.style.borderRadius = '3px';
    popup.style.color = 'white';
    popup.style.width = '200px';
    popup.style.height = '100px';
    popup.style.overflow = 'auto';
    popup.style.backgroundColor = 'rgb(32,142,113)';

    popup.innerHTML = '英式发音<button id="ukBtn" style="width: 24px; height: 24px"></button>'
        + '美式发音<button id="usBtn" style="width: 24px; height: 24px"></button>'
        + '<p id="p"></p>';


    popup.onclick = function (e) {
        e.stopPropagation();

        var id = e.target.id;
        var uk = document.getElementById('uk');
        var us = document.getElementById('us');
        if (id === 'ukBtn') {
            uk.play();
        } else if (id === 'usBtn') {
            us.play();
        }

    };

    popup.onmouseup = function (e) {
        e.stopPropagation();
    };

    document.body.appendChild(popup);

    var d = document.createElement('div');
    d.innerHTML = '<audio id="uk"></audio><audio id="us"></audio>';
    popup.appendChild(d);

}


// 鼠标抬起时popup
function mouseupListener(e) {

    var selectedTxt = window.getSelection().toString();

    // 判断选中的文本是否是英文
    var re = /[a-zA-Z]+/;
    if (!re.test(selectedTxt)) {
        return;
    }

    //console.log('选中的单词: \n' + selectedTxt);

    // 判断popup是否在边界上
    var popup = document.getElementById('popup');

    if (parseInt(e.clientY) > window.innerHeight - 100) {
        popup.style.top = (e.clientY - 100) + 'px';
    } else {
        popup.style.top = e.clientY + 'px';
    }

    if (parseInt(e.clientX) > window.innerWidth - 200) {
        popup.style.left = (e.clientX - 200) + 'px';
    } else {
        popup.style.left = e.clientX + 'px';
    }

    searchWord(selectedTxt);
};


// 点击页面其他地方popup消失
function clickListener() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
};


function searchWord(word) {
    var request = new XMLHttpRequest();
    var url = 'https://api.shanbay.com/bdc/search/?word=' + word;
    
    request.onreadystatechange = function () { 
        if (request.readyState === 4) { 
            if (request.status === 200) {
                return showPopup(request.responseText);
            } 
        } 
    };

    // 发送请求:
    request.open('GET', url, true);
    request.send();
}


function showPopup(json) {
    var popup = document.getElementById('popup');
    var p = document.getElementById('p');
    var ukAudio = document.getElementById('uk');
    var usAudio = document.getElementById('us');
    //console.log(ukAudio);
    //console.log(usAudio);

    var res = JSON.parse(json);
    if (res.msg !== 'SUCCESS') {
        return;
    }
    var meaning = res.data.definition;
    var uk_audio = res.data.uk_audio;
    var us_audio = res.data.us_audio;
    //console.log(meaning);
    //console.log(res);
    //console.log(typeof uk_audio);

    p.innerText = meaning;
    //if (ukAudio) {
        ukAudio.src = uk_audio;
    //}
    //if (usAudio) {
        usAudio.src = us_audio;
    //}

    popup.style.display = 'block';
}


// init
createPopupAndAudio();
document.body.addEventListener('mouseup', mouseupListener);
document.body.addEventListener('click', clickListener);

