document.body.onmouseup = (e) => {
    let selectedTxt = window.getSelection().toString();
    
    // 判断选中的文本是否是英文
    var re = /[a-zA-Z]+/;
    if (!re.test(selectedTxt)) {
        return;
    };

    console.log(selectedTxt);
};

