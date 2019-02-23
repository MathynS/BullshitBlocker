let addButton = document.getElementById('add-keyword');
let tagsBox = document.getElementById('tags');
let alert = document.getElementById('alert');
let closeAlertButton = document.getElementById('close-alert');
let changeMessage = document.getElementById('change-message');

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
    showChangeMessage();
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

function setWarning(text) {
    alert.childNodes[0].nodeValue = text;
    alert.style.display = 'block';
}

function closeAlert() {
    alert.style.display = 'none';
}

function showChangeMessage() {
    changeMessage.style.display = 'block';
}

addButton.onclick = function() {
    let newKeyword = document.getElementById('keyword').value;
    if (newKeyword.length === 0 ) {
        setWarning('Keyword should not be empty!');
        return
    }
    createTag(newKeyword);
    let userKeywords;
    chrome.storage.local.get({userKeywords: []}, function (result) {
        userKeywords = result.userKeywords;
        if (userKeywords.indexOf(newKeyword) !== -1) {
            setWarning('Keyword "' + newKeyword +'" already exists!');
            return
        }
        userKeywords.push(newKeyword);
        chrome.storage.local.set({userKeywords: userKeywords}, function () {
            closeAlert();
            document.getElementById('keyword').value = '';
            showChangeMessage()
        });
    });
};

closeAlertButton.onclick = closeAlert;

chrome.storage.local.get({userKeywords: []}, function (result) {
    console.log(result.userKeywords);
    for (let i = 0; i < result.userKeywords.length; i ++) {
        createTag(result.userKeywords[i])
    }
});



