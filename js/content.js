
document.body.onmouseup = (e) => {
    let selectedTxt = window.getSelection().toString();
    console.log(selectedTxt);
};