"use client";

import { useEffect } from "react";

const loadedScripts = new Set<string>();

export function TrustIndexLoader({ containerId, script }: { containerId: string; script: string }) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("no-third-party") === "1") return;
    const container = document.getElementById(containerId);
    if (!container || loadedScripts.has(script)) return;

    const node = document.createElement("script");
    node.src = script;
    node.async = true;
    node.defer = true;
    node.dataset.type = "stripe";
    node.dataset.location = containerId;
    container.appendChild(node);
    loadedScripts.add(script);
  }, [containerId, script]);

  return null;
}
