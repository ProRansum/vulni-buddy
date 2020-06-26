// ==UserScript==
// @name        Vulni-Buddy
// @namespace   https://github.com/ProRansum
// @description monkey script to update users with when new vulnerabilities are pushed to exploit-db.
// @icon        
// @author 	   	git://ProRansum
// @include     http*://*exploit-db.com*
// @match       http*://*exploit-db.com*
// @downloadURL https://github.com/ProRansum/vulni-buddy
// @updateURL   https://raw.githubusercontent.com/ProRansum/vulni-buddy/master/vulni-buddy.user.js
// @version     1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// ==/UserScript==
(function(getExploits, pullExploits, parseExploits) {

    pullExploits(getExploits, parseExploits)

    window._exploitInt = setInterval(function() {
        pullExploits(getExploits, parseExploits)
    }, 3e4)

})(function(callback) {
    fetch("https://www.exploit-db.com/?draw=1&columns%5B0%5D%5Bdata%5D=date_published&columns%5B0%5D%5Bname%5D=date_published&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=download&columns%5B1%5D%5Bname%5D=download&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=application_md5&columns%5B2%5D%5Bname%5D=application_md5&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=verified&columns%5B3%5D%5Bname%5D=verified&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=description&columns%5B4%5D%5Bname%5D=description&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=type_id&columns%5B5%5D%5Bname%5D=type_id&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=platform_id&columns%5B6%5D%5Bname%5D=platform_id&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=author_id&columns%5B7%5D%5Bname%5D=author_id&columns%5B7%5D%5Bsearchable%5D=false&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=code&columns%5B8%5D%5Bname%5D=code.code&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=id&columns%5B9%5D%5Bname%5D=id&columns%5B9%5D%5Bsearchable%5D=false&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=120&search%5Bvalue%5D=&search%5Bregex%5D=false&author=&port=&type=&tag=&platform=&_=1593151106605", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://www.exploit-db.com/",
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(r => {
        return r.json();
    }).then(data => {
        callback(data);
    })
}, function(get, parse) {
    get(parse)
}, function(data) {
    let records = data.data
    // console.log(records)

    let locals = (localStorage.getItem('vuln-buddy')) ? JSON.parse(localStorage.getItem('vuln-buddy')) : new Array()
    let comparables = [records[0]];

    comparables.forEach(function(entry, index) {
        let author = entry.author.name;
        let publish_date = entry.date_published
        let description = entry.description[1]
        
        let code_type = new Array();
        entry.code.forEach(function(t) {
            code_type.push(t.code_type)
        })

        let platform = entry.platform_id;
        let type = entry.type.display;
        
        let string = `(${publish_date})[${type} - ${platform}]: ${description} by ${author} using ${(code_type) ? code_type.join(', ') : 'not included'}`;
        let pop = `NEW: ${string}\nLink: https://www.exploit-db.com/exploits/${entry.id}`
        
        if (locals[index] === undefined) {
            window.alert(pop)
            console.warn(pop)
        } else {
            if (locals[index].id !== entry.id) {
                window.alert(pop)
                console.warn(pop)
            } else {
                console.log(string)
            }
        }
    })

    localStorage.setItem('vuln-buddy', JSON.stringify(comparables))
})