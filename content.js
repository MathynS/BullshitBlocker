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

function replaceImage(element) {
    let height = element.height;
    let width = element.width;
    element.src = 'https://mathyns.github.io/BullshitBlocker/images/empty_pixel.png';
    element['data-src'] = 'https://mathyns.github.io/BullshitBlocker/images/empty_pixel.png';
    element.style.width = width + 'px';
    element.style.height = height + 'px'
}

function listener() {
    let removeElements = [];
    let domainXpaths = removeXpaths[document.domain];
    console.log(document.domain, domainXpaths);
    if (domainXpaths === undefined) {
        return
    }
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
        if (removeElements[i].value !== undefined) {
            removeElements[i].value = '#';
            console.log(removeElements[i])
        } else if (removeElements[i].tagName.toLowerCase() === 'img') {
            replaceImage(removeElements[i]);
        } else {
            try {
                removeElements[i].parentNode.removeChild(removeElements[i])
            } catch (e) {
                console.log(e)
            }
        }
    }
}

let keywords = [];
let removeXpaths = [];
let loaded = false;
const localConfig = chrome.runtime.getURL('config.json');
let configUrl = 'https://mathyns.github.io/BullshitBlocker/config.json';
let xhr = new XMLHttpRequest();

if ('update_url' in chrome.runtime.getManifest()) {
    xhr.open("GET", configUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            removeXpaths = JSON.parse(xhr.responseText);
            loaded = true;
            listener()
        }
    };
    xhr.send();
} else {
    fetch(localConfig)
        .then((response) => response.json()) //assuming file contains json
        .then((json) => {
            removeXpaths = json;
            loaded = true;
            listener()
        });
}

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

