// ==UserScript==
// @name        Vulni-Buddy
// @namespace   https://github.com/ProRansum
// @description monkey script to update users with when new vulnerabilities are pushed to exploit-db.
// @icon        
// @author 	   	git://ProRansum
// @include     http*://*.com*
// @match       http*://*.com*
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

function newNotif(text="", link="javascript:void(0)") {
    let title = "New Exploit Published!"
    let options = {
        requireInteraction: true,
        body: `${text}.\n${link}`,
        icon: 'https://www.clipartmax.com/png/full/361-3610936_computer-icons-software-bug-computer-software-computer-bug-icon-transparent.png',
    }
    let notif = new Notification(title, options)
    notif.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        window.open(link, '_blank');
    }
    return notif;
}

(function(getExploits, pullExploits, parseExploits, notifyExploits) {

    pullExploits(getExploits, parseExploits, notifyExploits)

    window._exploitInt = setInterval(function() {
        pullExploits(getExploits, parseExploits, notifyExploits)
    }, 3e4)

})(function(callback, notify) {
    let url = "https://www.exploit-db.com/?draw=1&columns%5B0%5D%5Bdata%5D=date_published&columns%5B0%5D%5Bname%5D=date_published&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=download&columns%5B1%5D%5Bname%5D=download&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=application_md5&columns%5B2%5D%5Bname%5D=application_md5&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=verified&columns%5B3%5D%5Bname%5D=verified&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=description&columns%5B4%5D%5Bname%5D=description&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=type_id&columns%5B5%5D%5Bname%5D=type_id&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=platform_id&columns%5B6%5D%5Bname%5D=platform_id&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=author_id&columns%5B7%5D%5Bname%5D=author_id&columns%5B7%5D%5Bsearchable%5D=false&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=code&columns%5B8%5D%5Bname%5D=code.code&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=id&columns%5B9%5D%5Bname%5D=id&columns%5B9%5D%5Bsearchable%5D=false&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=15&search%5Bvalue%5D=&search%5Bregex%5D=false&author=&port=&type=&tag=&platform=&_=1593151106605"
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        credentials: "include",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        timeout: 1e4,
        onload: function(r) {
            callback((JSON.parse(r.responseText) ? JSON.parse(r.responseText) : r.responseText), notify);
        },
        onerror: function(e) {
            console.error('**** error ', e);
        },
        onabort: function(e) {
            console.error('**** abort ', e);
        },
        ontimeout: function(e) {
            console.error('**** timeout ', e);
        }
    })
}, function(get, parse, notify) {
    get(parse, notify)
}, function(data, notify) {
    let records = data.data
    // console.log(records)

    let locals = (GM_getValue('vuln-buddy')) ? JSON.parse(GM_getValue('vuln-buddy')) : new Array()
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
        
        let string = `Published: ${publish_date} by ${author}\nType: ${type} - Platform: ${platform}\n- ${description}\nCode: ${(code_type) ? code_type.join(', ') : 'Unspecified'}`;
        
        let link = `https://www.exploit-db.com/exploits/${entry.id}`
        
        if (locals[index] === undefined) {
            notify(string, link)
        } else {
            if (locals[index].id !== entry.id) {
                notify(string, link)
            }
        }
    })

    GM_setValue('vuln-buddy', JSON.stringify(comparables))
}, function(text, link) {
	if (window.Notification && Notification.permission === "granted") {
		let n = newNotif(text, link)
	}

	// If the user hasn't told if he wants to be notified or not
	// Note: because of Chrome, we are not sure the permission property
	// is set, therefore it's unsafe to check for the "default" value.
	else if (window.Notification && Notification.permission !== "denied") {
		Notification.requestPermission(function(status) {
			if (status === "granted") {
				let n = newNotif(text, link)
			}

			// Otherwise, we can fallback to a regular modal alert
			else {
				alert(text);
			}
		});
	}

	// If the user refuses to get notified
	else {
		// We can fallback to a regular modal alert
		alert(text);
	}
})
