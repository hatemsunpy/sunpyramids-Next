const RECAPTCHA_SITE_KEY = "6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn";

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
