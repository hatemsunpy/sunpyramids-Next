"use client";

import { useEffect } from "react";

const TRUSTINDEX_TIMEOUT_MS = 10_000;
let initializationQueue = Promise.resolve();

function widgetId(script: string) {
  try {
    return new URL(script).search.slice(1).split("&", 1)[0];
  } catch {
    return "";
  }
}

function hasRenderedWidget(container: HTMLElement, script: string) {
  if (container.querySelector(".ti-widget")) return true;
  if (!script.includes("loader-cert.js")) return false;

  const id = widgetId(script);
  return id
    ? document.querySelector(`.ti-widget[data-pid="${id}"]`) !== null
    : document.querySelector(".ti-widget") !== null;
}

function initializeWidget(
  container: HTMLElement,
  containerId: string,
  script: string,
  isCancelled: () => boolean,
) {
  return new Promise<void>((resolve) => {
    if (isCancelled() || !container.isConnected || hasRenderedWidget(container, script)) {
      resolve();
      return;
    }

    const existingLoader = container.querySelector<HTMLScriptElement>(
      `script[data-trustindex-container="${containerId}"]`,
    );
    if (existingLoader) {
      resolve();
      return;
    }

    let settled = false;
    let releasedDeferredWidget = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.clearInterval(poll);
      observer.disconnect();
      resolve();
    };
    const check = () => {
      const placeholder = container.firstElementChild as
        | (HTMLElement & { contentHtml?: unknown })
        | null;
      if (
        !releasedDeferredWidget &&
        !script.includes("loader-cert.js") &&
        typeof placeholder?.contentHtml === "string"
      ) {
        releasedDeferredWidget = true;
        // The vendor queues non-crawler widgets for its activity handler even
        // when the target is already visible. Release that supported queue so
        // the current container does not depend on a later physical mouse move.
        window.dispatchEvent(new Event("mousemove"));
      }
      if (
        isCancelled() ||
        !container.isConnected ||
        hasRenderedWidget(container, script)
      ) {
        finish();
      }
    };
    const observer = new MutationObserver(check);
    const timeout = window.setTimeout(finish, TRUSTINDEX_TIMEOUT_MS);
    const poll = window.setInterval(check, 50);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const node = document.createElement("script");
    node.src = script;
    node.async = true;
    node.defer = true;
    node.dataset.type = "stripe";
    node.dataset.location = containerId;
    node.dataset.trustindexContainer = containerId;
    node.addEventListener("error", finish, { once: true });
    container.appendChild(node);
    check();
  });
}

export function TrustIndexLoader({ containerId, script }: { containerId: string; script: string }) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("no-third-party") === "1") return;
    let cancelled = false;
    let timer: number | undefined;
    let visibilityObserver: IntersectionObserver | undefined;

    const enqueueInitialization = (container: HTMLElement) => {
      visibilityObserver?.disconnect();
      if (timer !== undefined) return;

      // Deferring one task cancels React Strict Mode's throwaway effect before
      // it can execute a third-party loader.
      timer = window.setTimeout(() => {
        initializationQueue = initializationQueue
          .catch(() => undefined)
          .then(() => initializeWidget(container, containerId, script, () => cancelled));
      }, 0);
    };

    const container = document.getElementById(containerId);
    if (!container) return;

    if (script.includes("loader-cert.js") || typeof IntersectionObserver === "undefined") {
      enqueueInitialization(container);
    } else {
      // TrustIndex defers off-screen review widgets until user activity. Loading
      // only when the container nears the viewport makes its own synchronous
      // initialization path reliable across automated and client navigation.
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) enqueueInitialization(container);
        },
        { rootMargin: "1200px 0px" },
      );
      visibilityObserver.observe(container);
    }

    return () => {
      cancelled = true;
      visibilityObserver?.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [containerId, script]);

  return null;
}
