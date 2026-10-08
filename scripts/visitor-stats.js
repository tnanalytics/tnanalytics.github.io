from pathlib import Path

base = Path("/mnt/data")
scripts = base / "scripts"
scripts.mkdir(exist_ok=True)

js = r"""/**
 * TNAnalytics — Visitor Statistics
 *
 * Responsibilities:
 * - Register a page visit through the configured statistics API.
 * - Retrieve approximate visitor geolocation.
 * - Update the visitor information displayed on the page.
 *
 * The statistics endpoint must be provided by a backend/service.
 * No visitor count is fabricated when the endpoint is unavailable.
 */

(() => {
  "use strict";

  const CONFIG = {
    // Replace with the real visitor statistics endpoint.
    statsEndpoint: "/api/visitor-stats",

    // Public IP geolocation service used only for approximate location.
    geoEndpoint: "https://ipapi.co/json/",

    // HTML id used for the visitor information block.
    displayId: "visitor-stats"
  };

  /**
   * Create the display element when it does not already exist.
   */
  function ensureDisplayElement() {
    let element = document.getElementById(CONFIG.displayId);

    if (element) {
      return element;
    }

    const footer = document.querySelector(".site-footer");

    if (!footer) {
      return null;
    }

    element = document.createElement("div");
    element.id = CONFIG.displayId;
    element.className = "visitor-stats";
    element.setAttribute("aria-live", "polite");

    footer.querySelector(".container")?.appendChild(element);

    return element;
  }

  /**
   * Retrieve approximate visitor location from the IP address.
   */
  async function getVisitorLocation() {
    const response = await fetch(CONFIG.geoEndpoint, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Geolocation request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      country: data.country_name || null,
      region: data.region || null,
      city: data.city || null
    };
  }

  /**
   * Register the visit with the statistics backend.
   */
  async function registerVisit(location) {
    const response = await fetch(CONFIG.statsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || null,
        location
      }),
      keepalive: true
    });

    if (!response.ok) {
      throw new Error(`Statistics request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Update the page with the information returned by the backend.
   */
  function updateDisplay(element, statistics, location) {
    if (!element) {
      return;
    }

    const parts = [
      statistics?.totalVisits != null
        ? `Visitas: ${statistics.totalVisits}`
        : null,
      location?.city && location?.country
        ? `Localização: ${location.city}, ${location.country}`
        : location?.country
          ? `Localização: ${location.country}`
          : null
    ].filter(Boolean);

    element.textContent = parts.join(" · ");
  }

  /**
   * Initialise visitor statistics without interrupting the page.
   */
  async function initVisitorStats() {
    const display = ensureDisplayElement();

    try {
      const location = await getVisitorLocation();
      const statistics = await registerVisit(location);

      updateDisplay(display, statistics, location);
    } catch (error) {
      /*
       * Visitor statistics must never prevent the website from loading.
       * Errors are intentionally ignored in the production UI.
       */
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVisitorStats, {
      once: true
    });
  } else {
    initVisitorStats();
  }
})();
"""

path = scripts / "visitor-stats.js"
path.write_text(js, encoding="utf-8")

print(f"Created: {path}")
print(f"Size: {path.stat().st_size} bytes")
