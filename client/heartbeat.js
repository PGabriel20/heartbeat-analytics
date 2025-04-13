
(function () {
    'use strict'

    var clientDomain = document.currentScript.getAttribute('client-domain');
    var apiUrl = 'http://localhost:8080/v1/intake';
    var location = window.location
    var lastPage;

    // Generate a UUID for visitor and session if not already present
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Function to get or set Visitor ID in localStorage
    function getVisitorId() {
        var visitorId = localStorage.getItem('_hb_visitor');
        if (!visitorId) {
            visitorId = generateUUID();
            localStorage.setItem('_hb_visitor', visitorId);
        }
        return visitorId;
    }

    // Function to get or set Session ID in sessionStorage
    //@TODO - Remove hb_last_activity item
    function getSessionId() {
        var sessionId = sessionStorage.getItem('_hb_session');
        var lastActivity = sessionStorage.getItem('_hb_last_activity');
        var now = Date.now();

        // Check if the session has expired (e.g., 30 minutes of inactivity)
        if (!sessionId || !lastActivity || (now - lastActivity > 30 * 60 * 1000)) {
            sessionId = generateUUID();
        }
        sessionStorage.setItem('_hb_session', sessionId);

        // Update last activity timestamp
        sessionStorage.setItem('_hb_last_activity', now);
        return sessionId;
    }

    // Get page details
    function getPageDetails() {
        return {
            page_url: window.location.href,
            referrer_url: document.referrer || null,
            browser_lang: navigator.language || navigator.userLanguage,
            device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        };
    }

    // Function to send data to backend
    function sendDataToBackend(data) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }



    function intake(event, metadata) {
        var visitorId = getVisitorId();
        var sessionId = getSessionId();
        var pageDetails = getPageDetails();

        var basePayload = {
            event_type: event,
            visitor_id: visitorId,
            session_id: sessionId,
            domain: clientDomain,
            page_url: pageDetails.page_url,
            referrer_url: pageDetails.referrer_url,
            browserLanguage: pageDetails.browser_lang,
        };

        if(metadata) basePayload.metadata = metadata

        sendDataToBackend(basePayload);
    }

    //Handles SPA navigation
    function handleSPANavigation() {
        var history = window.history

        if (history.pushState) {
            var originalPushState = history['pushState']

            history.pushState = function() {
                originalPushState.apply(this, arguments)
                handlePage()
            }
            
            window.addEventListener('popstate', handlePage)

            return
        }

        window.addEventListener('hashchange', handlePage);
    }

    //Handles initial and regular navigation
    function handlePage() {

        var hash = location.hash

        if((!hash && location.pathname === lastPage)) return

        var options

        if(hash) {
            options = {hash}
        }

        lastPage = location.pathname
        intake('pageview', options)
    }

    handlePage()
    handleSPANavigation()
})();
