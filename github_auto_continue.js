// ==UserScript==
// @name         GitHub auto continue
// @version      0.0.1
// @description  Click GitHub sso continue button
// @author       Vegar Sechmann Molvig
// @match        https://github.com/orgs/*

// ==/UserScript==
(function () {
    'use strict';
    const initialDelay = 500;
    const retryInterval = 100;

    console.log("autocontinue")

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

    function clickContinue() {
        const fn = () => {
            console.log("autocontinue: checking for next button")
            const continueButton = document.querySelector('.org-sso > .org-sso-panel > form > button[type="submit"]')
            if (!continueButton) {
                console.log("autocontinue: no continue button (yet, retrying)")
                return setTimeout(clickContinue(), retryInterval)
            }
            if (continueButton.innerHTML.trim() !== "Continue") {
                console.log("autocontinue: button does not say \"Continue\" (yet, retrying)")
                return setTimeout(clickContinue(), retryInterval)
            }

            console.log("autocontinue: clicking continue")
            continueButton.click()
        }
        return fn
    }

    [
        { pathStartsWith: "/orgs/navikt/sso", handler: clickContinue },
        { pathStartsWith: "/orgs/navikt-dev/sso", handler: clickContinue },
        { pathStartsWith: "/orgs/nais/sso", handler: clickContinue },


    ].forEach((e) => {
        if (window.location.href.startsWith("https://github.com" + e.pathStartsWith)) {
            console.log("match:", window.location.href, e.handler)
            docReady(e.handler())
        } else {
            console.log("no match:", window.location.href, e.pathStartsWith)
        }
    })
})();
