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
    console.log(ukAudio);
    console.log(usAudio);

    var res = JSON.parse(json);
    var meaning = res.data.definition;
    var uk_audio = res.data.uk_audio;
    var us_audio = res.data.us_audio;
    //console.log(meaning);
    //console.log(res);
    //console.log(typeof uk_audio);

    p.innerText = meaning;
    if (ukAudio) {
        ukAudio.src = uk_audio;
    }
    if (usAudio) {
        usAudio.src = us_audio;
    }

    popup.style.display = 'block';
}


function createPopupAndAudio() {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.border = '2px solid #cccccc';
    popup.style.boxShadow = '5px 5px 10px #666666';
    popup.style.width = '200px';
    popup.style.height = '100px';
    popup.style.overflow = 'auto';
    popup.style.backgroundColor = 'white';

    popup.innerHTML = '英式发音<button id="ukBtn" style="border-style:none; width: 24px; height: 24px"></button>'
                    + '美式发音<button id="usBtn" style="border-style:none; width: 24px; height: 24px"></button>'
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
    document.body.appendChild(d);

}


document.body.onmouseup = function (e) {

    var selectedTxt = window.getSelection().toString();

    // 判断选中的文本是否是英文
    var re = /[a-zA-Z]+/;
    if (!re.test(selectedTxt)) {
        return;
    }

    console.log('选中的单词: \n' + selectedTxt);

    var popup = document.getElementById('popup');
    popup.style.top = e.clientY + 'px';
    popup.style.left = e.clientX + 'px';
    searchWord(selectedTxt);
};


document.body.onclick = function () {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
};


createPopupAndAudio();