// ======1.初始化======
var isFilter = false,
    isPaging = false,
    isSearch = false;
var pageContent = getContent();
//document.getElementById('paging').disabled = 'disabled';


createPopupAndAudio();
document.body.addEventListener('click', clickHandler); // 点击页面其他地方popup消失

chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
    console.log(message.content);

    switch (message.content) {
        case 'filter clicked':
            isFilter = !isFilter;

            if (isFilter) {
                filt(pageContent);
            } else {
                unFilt(pageContent);
            }
            break;

        case 'paging clicked':
            isPaging = !isPaging;

            if (isPaging) {
                paging(pageContent);
            } else {
                unPaging();
            }
            break;

        case 'search clicked':
            isSearch = !isSearch;
            if (isSearch) {
                document.body.addEventListener('mouseup', searchHandler);
            } else {
                document.body.removeEventListener('mouseup', searchHandler);
            }
            break;
    }

});
// =======初始化 end=========

// ======2.主要函数======
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

    var imgUrl = chrome.extension.getURL('img/horn24.png');
    popup.innerHTML = '英式发音'
        + '<button id="ukBtn" type="button" style="background: url(' + imgUrl + ') rgb(32,142,113); width: 24px; height: 24px"></button>'
        + '美式发音'
        + '<button id="usBtn" type="button" style="background: url(' + imgUrl + ') rgb(32,142,113); width: 24px; height: 24px"></button>'
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


function filt(pageContent) {
    document.body.style.visibility = 'hidden';
    for (let i of pageContent.arrToShow) {
        i.style.visibility = 'visible';
    }
    for (let i of pageContent.arrToHide) {
        i.style.visibility = 'hidden';
    }
}


function unFilt(pageContent) {
    document.body.style.visibility = 'visible';
    for (let i of pageContent.arrToHide) {
        i.style.visibility = 'visible';
    }
}


function paging(pageContent) {

    document.body.style.backgroundColor = 'rgb(70,202,165)';

    var pagePositionArr = [];
    var contentBeginPosition = pageContent.headerTop;
    var contentEndPosition = pageContent.artcleBodyBottom;

    var btnSet = document.createElement('div');
    btnSet.style.position = 'fixed';
    btnSet.style.top = '0';
    btnSet.style.visibility = 'visible';
    btnSet.style.height = '40px';
    btnSet.style.width = window.innerWidth + 'px';
    btnSet.style.backgroundColor = 'white';

    var pageHeight = window.innerHeight - parseInt(btnSet.style.height) - 32;
    var y = contentBeginPosition - parseInt(btnSet.style.height);
    for (; y < contentEndPosition; y += pageHeight) {
        pagePositionArr.push(y);
    }

    var btnOriginLeft = pageContent.headerLeft;
    for (let i in pagePositionArr) {
        var btn = document.createElement('button');
        btn.style.position = 'relative';
        btn.style.left = btnOriginLeft + 'px';
        btn.innerText = '第' + (parseInt(i) + 1) + '页';
        btn.onclick = function() {
            window.scrollTo(0, pagePositionArr[i])
        };

        btnSet.appendChild(btn);
    }

    document.body.appendChild(btnSet);

    // 默认滚动到第一页的位置
    window.scrollTo(0, pagePositionArr[0]);


}


function unPaging() {
    location.reload();
}


function searchHandler(e) {

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
}



// ======主要函数 end======


// ======3.工具函数======
function getContent() {
    var article = document.getElementById('article');

    var h = article.querySelector('header h1');
    var standfirst = article.querySelector('div.content__standfirst p');
    var img = article.querySelector('#img-1 picture img');
    var figcaption = article.querySelector('#img-1 figcaption');
    var artcleBody = article.querySelector('div.content__article-body');
    var arrToShow = [h, standfirst, img, figcaption, artcleBody];

    var aside = article.querySelector('aside.element.element-rich-link ');
    var ad = article.querySelector('#dfp-ad--inline1');
    var arrToHide = [aside, ad];

    var headerTop = h.getBoundingClientRect().top;
    var headerLeft = h.getBoundingClientRect().left;
    var artcleBodyBottom = artcleBody.getBoundingClientRect().bottom;

    return {
        arrToShow: arrToShow,
        arrToHide: arrToHide,
        headerTop: headerTop,
        headerLeft: headerLeft,
        artcleBodyBottom: artcleBodyBottom
    };
}



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

function clickHandler() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
}
// ======工具函数 end======
