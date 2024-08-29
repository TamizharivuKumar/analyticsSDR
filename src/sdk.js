(function (window, document) {
  var AnalyticsSDK = {};

  var defaultBaseURL =
    "https://5106-2401-4900-1ce2-a051-7d90-76e-cde0-a6c6.ngrok-free.app";

  function AnalyticsClient(baseURL) {
    this.baseURL = baseURL || defaultBaseURL;
  }

  AnalyticsClient.prototype.sendEvent = function (event) {
    return fetch(this.baseURL + "/api/Event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error sending event:", error.message);
        throw error;
      });
  };

  function detectDeviceType() {
    return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop";
  }

  // Generate a unique session ID
  function generateSessionId() {
    return "xxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function createPageViewEvent() {
    return {
      eventName: "page_view",
      timestamp: new Date().toISOString(),
      properties: {
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrerUrl: document.referrer || "Direct",
        sessionId: generateSessionId(),
        deviceType: detectDeviceType(),
        // userId: this.userId || 'anonymous',
        BrowserInfo: getBrowserInfo(),
      },
    };
  }

  function getBrowserInfo() {
    return {
      browserName: navigator.userAgent,
      browserVersion: navigator.appVersion,
      osName: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
    };
  }

  function initAnalytics() {
    var client = new AnalyticsClient();
    var event = createPageViewEvent();
    client
      .sendEvent(event)
      .then((response) => {
        console.log("Page view event sent successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to send page view event:", error);
      });
  }

  // Automatically initialize the analytics SDK
  initAnalytics();
})(window, document);
