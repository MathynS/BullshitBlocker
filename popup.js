let addButton = document.getElementById('addKeyword');
let tagsBox = document.getElementById('tags');

let deleteTag = function (button) {
    let deleteTag = button.target.parentNode;
    deleteTag.removeChild(button.target);
    chrome.storage.local.get({userKeywords: []}, function (result) {
        let userKeywords = result.userKeywords;
        let index = userKeywords.indexOf(deleteTag.innerText);
        if (index > -1) {
            userKeywords.splice(index, 1);
        }
        chrome.storage.local.set({userKeywords: userKeywords}, function () {
        });
    });
    tagsBox.removeChild(deleteTag)
};

function createTag(tagName) {
    let newTag = document.createElement('span');
    newTag.classList.add('badge');
    newTag.classList.add('badge-info');
    newTag.innerHTML = tagName;
    let closeButton = document.createElement('a');
    closeButton.classList.add('hover');
    closeButton.onclick = deleteTag;
    closeButton.innerHTML = '&nbsp;&times;';
    newTag.appendChild(closeButton);
    tagsBox.appendChild(newTag);
}

addButton.onclick = function() {
    let newKeyword = document.getElementById('keyword').value;
    if (newKeyword.length === 0 ) {
        return
    }
    createTag(newKeyword);
    document.getElementById('keyword').value = '';
    chrome.storage.local.get({userKeywords: []}, function (result) {
        let userKeywords = result.userKeywords;
        userKeywords.push(newKeyword);
        chrome.storage.local.set({userKeywords: userKeywords}, function () {
        });
    });
};

chrome.storage.local.get({userKeywords: []}, function (result) {
    console.log(result.userKeywords);
    for (let i = 0; i < result.userKeywords.length; i ++) {
        createTag(result.userKeywords[i])
    }
});



