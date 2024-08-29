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

  function gatherPageViewData() {
    return {
      url: window.location.href,
      width: window.screen.width,
      height: window.screen.height,
    };
  }

  // function calculateSessionDuration() {
  //   return 300; // Placeholder value
  // }

  // function determineIfNewUser() {
  //   return true; // Placeholder value
  // }

  function createPageViewEvent() {
    return {
      EventName: "page_view",
      Timestamp: new Date().toISOString(),
      Properties: gatherPageViewData(),
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
