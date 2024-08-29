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
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || 'Failed to send event');
            });
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error sending event:", error.message);
          throw error;
        });
    };
  
    function gatherPageViewData() {
      return {
        url: window.location.href,
        width: window.screen.width.toString(),  // Ensure width is a string
        height: window.screen.height.toString(), // Ensure height is a string
      };
    }
  
    function createPageViewEvent() {
      return {
        EventName: "page_view",
        Timestamp: new Date().toISOString(),
        Properties: gatherPageViewData(),
      };
    }
  
    AnalyticsSDK.init = function () {
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
    };
  
    // Expose AnalyticsSDK to the global object
    window.AnalyticsSDK = AnalyticsSDK;
  
  })(window, document);
  