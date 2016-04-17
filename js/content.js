document.body.onmouseup = function () {
    var selectedTxt = window.getSelection().toString();
    
    // 判断选中的文本是否是英文
    var re = /[a-zA-Z]+/;
    if (!re.test(selectedTxt)) {
        return;
    };

    console.log('selectedTxt: \n' + selectedTxt);

    searchWord(selectedTxt);
};


function searchWord(word) {
    var request = new XMLHttpRequest();
    var url = 'https://api.shanbay.com/bdc/search/?word=' + word;
    
    request.onreadystatechange = function () { 
        if (request.readyState === 4) { 
            if (request.status === 200) {
                return success(request.responseText);
            } 
        } 
    }

    // 发送请求:
    request.open('GET', url, true);
    request.send();

}


function success(json) {
    var re = JSON.parse(json);
    console.log('汉语意思：\n' + re.data.cn_definition.defn);
}
