// ==UserScript==
// @name         Gcloud auto select account
// @version      0.0.1
// @description  Select my NAV gcloud account automatically and approve access
// @author       Vegar Sechmann Molvig
// @match        https://accounts.google.com/o/oauth2/auth*
// @match        https://accounts.google.com/signin/oauth/consent*
// ==/UserScript==
(function() {
    'use strict';
    const initialDelay = 500;
    const retryInterval = 100;

    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // Ready, wait a bit and make the call
            setTimeout(fn, initialDelay);
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                // When ready, wait a bit more before calling
                setTimeout(fn, initialDelay);
            });
        }
    }

    function getEmailFromUrl(){
        //https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })

        return params.autoAccountSelect
    }

    function selectAccount(email) {
        return () => {
            console.log("Checking for account selector")
            let accountSelector = document.querySelector(`[data-identifier="${email}"]`);
            if (accountSelector != null) {
                console.log("Selecting NAV account (if possible)")
                accountSelector.click()
            } else {
                console.log("no account selec found yet")
            }

            setTimeout(selectAccount, retryInterval)
        }
    }

    function approve() {
        console.log("Checking for approve access button")
        let submitButton = document.querySelector('[id="submit_approve_access"]');
        if (submitButton != null) {
            console.log("Approving access")
            return submitButton.click();
        } else {
            setTimeout(approve, retryInterval)
        }
    }

    if (window.location.href.startsWith("https://accounts.google.com/o/oauth2/auth")) {
        const email = getEmailFromUrl()
        if (email) {
            console.log("auto selecting:", email)
            docReady(selectAccount(email))
        } else {
            console.log("no query param 'autoAccountSelect', ignoring")
        }
    } else {
        console.log("auto approving")
        docReady(approve)
    }

})();
