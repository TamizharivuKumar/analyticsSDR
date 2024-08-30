(function (window, document) {
  var defaultBaseURL =
    "https://c639-2401-4900-1ce2-a051-616b-b07d-7cf4-d15f.ngrok-free.app/";

  function AnalyticsClient(baseURL) {
    this.baseURL = baseURL || defaultBaseURL;
    this.sessionId = generateSessionId();
    this.scrollDepth = 0;
    this.startTime = Date.now();

    // Initialize page tracking
    this.init();
  }

  // Send any event to the backend
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

  // Initialize page tracking
  AnalyticsClient.prototype.init = function () {
    var self = this;

    // Track the PageView event on load
    var pageViewEvent = createPageViewEvent(self.sessionId);
    self
      .sendEvent(pageViewEvent)
      .then((response) => {
        console.log("Page view event sent successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to send page view event:", error);
      });

    // Track scroll depth
    window.addEventListener("scroll", function () {
      self.calculateScrollDepth();
    });

    // Track the PageExit event on page unload
    window.addEventListener("beforeunload", function () {
      self.trackPageExit();
    });
  };

  // Calculate scroll depth
  AnalyticsClient.prototype.calculateScrollDepth = function () {
    var scrollTop = window.scrollY;
    var docHeight = document.body.scrollHeight - window.innerHeight;
    var scrollPercent = (scrollTop / docHeight) * 100;
    this.scrollDepth = Math.max(this.scrollDepth, Math.floor(scrollPercent));
  };

  // Track the PageExit event
  AnalyticsClient.prototype.trackPageExit = function () {
    var timeOnPage = Math.floor((Date.now() - this.startTime) / 1000); // Time in seconds

    var pageExitEvent = createPageExitEvent(
      this.sessionId,
      timeOnPage,
      this.scrollDepth
    );
    this.sendEvent(pageExitEvent)
      .then((response) => {
        console.log("Page exit event sent successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to send page exit event:", error);
      });
  };

  // Detect device type
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

  // Get operating system name
  function getOSName() {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) return "Windows";
    if (platform.includes("mac")) return "macOS";
    if (platform.includes("linux")) return "Linux";
    return "Unknown";
  }

  // Get browser version
  function getBrowserVersion() {
    const userAgent = navigator.userAgent;
    const matches =
      userAgent.match(
        /(firefox|chrome|safari|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    return matches[2] || "Unknown";
  }

  function createPageViewEvent(sessionId) {
    return {
      eventName: "page_view",
      timestamp: new Date().toISOString(),
      properties: {
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrerUrl: document.referrer || "Direct",
        sessionId: sessionId,
        deviceType: detectDeviceType(),
        // userId: this.userId || 'anonymous',
        BrowserInfo: getBrowserInfo(),
      },
    };
  }

  function createPageExitEvent(sessionId, timeOnPage, scrollDepth) {
    return {
      eventName: "page_exit",
      timestamp: new Date().toISOString(),
      properties: {
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrerUrl: document.referrer || "Direct",
        sessionId: sessionId,
        timeOnPage: timeOnPage,
        scrollDepth: scrollDepth,
        deviceType: detectDeviceType(),
        // userId: this.userId || 'anonymous',
        BrowserInfo: getBrowserInfo(),
      },
    };
  }

  function getBrowserInfo() {
    return {
      browserName: navigator.userAgent,
      browserVersion: getBrowserVersion(),
      osName: getOSName(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
    };
  }

  // Automatically initialize the analytics client
  new AnalyticsClient();
})(window, document);
