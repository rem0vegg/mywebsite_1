"use strict";

async function updateServiceStatus() {
  const status = document.querySelector("#service-status");

  try {
    const response = await fetch("/healthz", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Health check returned ${response.status}`);
    }

    status.textContent = "Service healthy";
    status.dataset.state = "healthy";
  } catch {
    status.textContent = "Service unavailable";
    status.dataset.state = "unavailable";
  }
}

updateServiceStatus();

