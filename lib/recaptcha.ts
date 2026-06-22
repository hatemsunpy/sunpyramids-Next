const RECAPTCHA_SITE_KEY = "6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn";
const RECAPTCHA_SCRIPT_ID = "sunpyramids-recaptcha-enterprise";

type GrecaptchaWindow = Window & {
  grecaptcha?: {
    enterprise?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  };
};

export async function generateRecaptchaToken(action = "submit") {
  if (typeof window === "undefined") return null;
  if (new URLSearchParams(window.location.search).get("no-third-party") === "1") return null;
  await loadRecaptchaScript();
  const grecaptcha = (window as GrecaptchaWindow).grecaptcha?.enterprise;
  if (!grecaptcha) return null;

  try {
    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve).catch(reject);
      });
    });
  } catch {
    return null;
  }
}

function loadRecaptchaScript() {
  if ((window as GrecaptchaWindow).grecaptcha?.enterprise) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const existing = document.getElementById(RECAPTCHA_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(script);
  });
}
