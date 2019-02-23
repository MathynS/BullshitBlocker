function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function listener() {
    let removeElements = [];
    let domainXpaths = removeXpaths[document.domain];
    for (let i = 0; i < domainXpaths.length; i++) {
        if (domainXpaths[i].indexOf('<keyword>') === - 1) {
            removeElements.push.apply(removeElements, getElementsByXPath(domainXpaths[i]));
            continue
        }
        for (let j = 0; j < keywords.length; j ++) {
            let xpath = domainXpaths[i].replace('\<keyword\>', escape(keywords[j]));
            console.log(xpath);
            removeElements.push.apply(removeElements, getElementsByXPath(xpath));
        }
    }
    for (let i = 0; i < removeElements.length; i++) {
        removeElements[i].parentNode.removeChild(removeElements[i])
    }
}

let keywords = [];
let removeXpaths = [];
let loaded = false;
const url = chrome.runtime.getURL('config.json');

fetch(url)
    .then((response) => response.json()) //assuming file contains json
    .then((json) => {
        removeXpaths = json;
        console.log(removeXpaths);
        loaded = true;
        listener()
    });

chrome.storage.local.get({userKeywords: []}, function (result) {
    keywords = result.userKeywords
});

if (Object.keys(removeXpaths).indexOf(document.domain) !== -1) {
    let timeout = null;
    document.addEventListener("DOMSubtreeModified", function() {
        if(timeout) {
            clearTimeout(timeout);
        } else if (loaded) {
            timeout = setTimeout(listener, 100);
        }
    }, false);
}

