/**
 * South African Chat Safety Interceptor
 * File: scam-interceptor.ts
 *
 * TypeScript version
 * Detects suspicious chat messages using rules, risk scores,
 * South African slang, and starter multilingual patterns.
 */

export type RiskCategory =
  | "credential_theft"
  | "banking_details"
  | "payment_scam"
  | "payment_credentials"
  | "suspicious_link"
  | "social_engineering"
  | "intimate_image_risk"
  | "off_platform_pressure"
  | "south_african_bank_context"
  | "afrikaans_payment_scam"
  | "zulu_xhosa_payment_scam"
  | "sotho_tswana_scam"
  | "south_african_slang";

export type InterceptorAction =
  | "allow"
  | "monitor"
  | "warn_user"
  | "hold_for_review"
  | "block_and_review"
  | "reject";

export interface InterceptorConfig {
  monitorThreshold: number;
  warningThreshold: number;
  holdThreshold: number;
  holdHighRiskMessages: boolean;
  blockCriticalCredentialRequests: boolean;
  maxMessageLength: number;
}

export interface Finding {
  category: RiskCategory;
  weight: number;
  critical: boolean;
}

export interface InterceptorResult {
  safe: boolean;
  score: number;
  action: InterceptorAction;
  categories: RiskCategory[];
  safetyContextDetected: boolean;
  findings: Finding[];
  reason: string;
}

interface ScamRule {
  category: RiskCategory;
  weight: number;
  critical?: boolean;
  patterns: RegExp[];
}

export const DEFAULT_CONFIG: Readonly<InterceptorConfig> = {
  monitorThreshold: 10,
  warningThreshold: 30,
  holdThreshold: 60,
  holdHighRiskMessages: true,
  blockCriticalCredentialRequests: true,
  maxMessageLength: 10_000,
};

// --------------------------------------------------
// 1. NORMALIZATION
// --------------------------------------------------

export function normalizeMessage(message: string): string {
  return message
    .normalize("NFKC")
    .replace(/[\u200B-\u200F\uFEFF]/g, "")
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
    .toLowerCase()
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Secondary scan only. Never use this as the sole basis
// for blocking messages.
export function compactForSecondaryScan(message: string): string {
  return normalizeMessage(message).replace(/[\s._*-]+/g, "");
}

// --------------------------------------------------
// 2. DETECTION RULES
// --------------------------------------------------

const SCAM_RULES: ScamRule[] = [
  {
    category: "credential_theft",
    weight: 6,
    critical: true,
    patterns: [
      /\b(send|share|tell|give|forward|reveal)\b.{0,40}\b(otp|one[- ]time password|verification code|security code)\b/i,
      /\b(otp|one[- ]time password|verification code|security code)\b.{0,40}\b(send|share|tell|give|forward)\b/i,
      /\b(send|share|tell|give)\b.{0,35}\b(password|passcode|login credentials|ewallet pin|wallet pin)\b/i,
      /\b(pin|pin code|ewallet pin|wallet pin)\b.{0,35}\b(send|share|tell|give)\b/i,
      /\b(card cvv|card cvc|security digits)\b/i,
    ],
  },
  {
    category: "banking_details",
    weight: 5,
    patterns: [
      /\b(bank|banking)\s*(account|details|number|information)\b/i,
      /\b(account|acc)\s*(number|no\.?|details)\b/i,
      /\b(iban|swift|bic|routing number|sort code)\b/i,
      /\b(send|share|provide|confirm)\b.{0,40}\b(bank details|account number|card details)\b/i,
      /\b(bankbesonderhede|rekeningnommer|kaartbesonderhede)\b/i,
      /\b(bank statement|proof of payment)\b/i,
    ],
  },
  {
    category: "payment_scam",
    weight: 5,
    patterns: [
      /\b(pay|send|transfer|deposit)\b.{0,35}\b(first|upfront|before|in advance)\b/i,
      /\b(upfront|advance)\s*(fee|payment|deposit|charge)\b/i,
      /\b(pay\s*me\s*first|payment\s*required\s*first)\b/i,
      /\b(activation|release|clearance|unlocking)\s*fee\b/i,
      /\b(guaranteed profit|double your money|claim your prize)\b/i,
      /\b(pay|send|deposit)\b.{0,35}\b(to receive|to unlock|to release)\b/i,
    ],
  },
  {
    category: "payment_credentials",
    weight: 6,
    critical: true,
    patterns: [
      /\b(credit|debit|bank)\s*card\b.{0,35}\b(number|details|pin|cvv|cvc)\b/i,
      /\b(card number|expiry date|expiration date|card pin)\b/i,
      /\b(cvv|cvc)\b/i,
      /\b(send|share|provide|enter)\b.{0,35}\b(card details|card number|cvv)\b/i,
    ],
  },
  {
    category: "suspicious_link",
    weight: 3,
    patterns: [
      /\bhttps?:\/\/[^\s]+/i,
      /\bwww\.[^\s]+/i,
      /\b(bit\.ly|tinyurl\.com|cutt\.ly|is\.gd)\b/i,
    ],
  },
  {
    category: "social_engineering",
    weight: 3,
    patterns: [
      /\b(account|profile|wallet)\b.{0,30}\b(suspended|blocked|locked|terminated)\b/i,
      /\b(act now|urgent|limited time|immediately)\b/i,
      /\b(don't tell|do not tell|keep this secret)\b/i,
      /\b(verify|restore|reactivate)\b.{0,30}\b(account|wallet|profile)\b/i,
    ],
  },
  {
    category: "intimate_image_risk",
    weight: 5,
    patterns: [
      /\b(send|share|show|upload)\b.{0,35}\b(nudes?|naked pics?|intimate photos?|explicit pictures?)\b/i,
      /\b(nudes?|intimate photos?)\b.{0,40}\b(money|payment|pay|blackmail)\b/i,
      /\b(pay or else|i will leak|i will expose|i will share your photos)\b/i,
    ],
  },
  {
    category: "off_platform_pressure",
    weight: 2,
    patterns: [
      /\b(whatsapp|telegram|signal)\b.{0,35}\b(me|privately|private|instead)\b/i,
      /\b(move|take|continue)\b.{0,25}\b(chat|conversation)\b.{0,25}\b(whatsapp|telegram|off.?platform)\b/i,
    ],
  },
  {
    category: "south_african_bank_context",
    weight: 1,
    patterns: [
      /\b(capitec|fnb|absa|nedbank|standard bank|tymebank|discovery bank)\b/i,
    ],
  },
  {
    category: "afrikaans_payment_scam",
    weight: 5,
    patterns: [
      /\b(stuur|betaal|deponeer|oorbetaal)\b.{0,40}\b(geld|eers|vooraf|deposito|fooi)\b/i,
      /\b(betaal eers|stuur eers geld|vooruitbetaling|administrasiefooi)\b/i,
      /\b(jy het gewen|prysgeld|jou rekening is geblokkeer)\b/i,
      /\b(stuur vir my)\b.{0,30}\b(geld|pin|otp|wagwoord)\b/i,
    ],
  },
  {
    category: "zulu_xhosa_payment_scam",
    weight: 4,
    patterns: [
      /\b(thumela|ngithumele|ungithumele|sithumele)\b.{0,40}\b(imali|i-money|r\d+)\b/i,
      /\b(faka imali|imali kuqala|imali first)\b/i,
      /\b(ngithumele i-?otp|thumela i-?otp|i-?pin yakho)\b/i,
      /\b(ngizokubuyisela|ndiza kukubuyisela)\b.{0,35}\b(imali|money)\b/i,
    ],
  },
  {
    category: "sotho_tswana_scam",
    weight: 4,
    patterns: [
      /\b(romela|nthomelle|ntsheletse pele)\b.{0,40}\b(chelete|madi|tšhelete|tshelete)\b/i,
      /\b(romela madi|romela chelete|lefa pele)\b/i,
      /\b(pin ya hao|password ya hao|otp ya hao)\b/i,
      /\b(chelete pele|madi pele|tshelete pele)\b/i,
    ],
  },
  {
    category: "south_african_slang",
    weight: 3,
    patterns: [
      /\b(plug|blesser|sugar mummy|sugar daddy)\b.{0,50}\b(allowance|send money|cash|fee|deposit)\b/i,
      /\b(cash send|e-?wallet|instant money)\b.{0,40}\b(pin|code|send|claim)\b/i,
      /\b(airtime|data|voucher)\b.{0,40}\b(send|buy|load|first)\b/i,
      /\b(i can flip your money|double your cash|quick cash|investment plug)\b/i,
    ],
  },
];

// --------------------------------------------------
// 3. SECURITY-WARNING CONTEXT
// --------------------------------------------------

const SAFETY_CONTEXT_PATTERNS: RegExp[] = [
  /\bnever share\b.{0,40}\b(otp|pin|password|verification code)\b/i,
  /\b(do not|don't|never)\b.{0,35}\b(send|share|give)\b.{0,30}\b(otp|pin|password)\b/i,
  /\b(scammers?|fraudsters?)\b.{0,60}\b(ask|request|steal|otp|pin|password)\b/i,
  /\b(report|reported|warning about)\b.{0,40}\b(scam|fraud|phishing)\b/i,
  /\b(i was scammed|this is a scam|that is a scam)\b/i,
];

// --------------------------------------------------
// 4. INTERCEPTOR
// --------------------------------------------------

export function inspectChatMessage(
  message: string,
  config: Readonly<InterceptorConfig> = DEFAULT_CONFIG,
): InterceptorResult {
  if (typeof message !== "string") {
    throw new TypeError("Message must be a string.");
  }

  if (message.length > config.maxMessageLength) {
    return {
      safe: false,
      score: 100,
      action: "reject",
      categories: [],
      safetyContextDetected: false,
      findings: [],
      reason: "Message exceeds the configured size limit.",
    };
  }

  const normalized = normalizeMessage(message);
  const findings: Finding[] = [];

  for (const rule of SCAM_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) {
      findings.push({
        category: rule.category,
        weight: rule.weight,
        critical: Boolean(rule.critical),
      });
    }
  }

  const safetyContextDetected = SAFETY_CONTEXT_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );

  const categories = [...new Set(findings.map((finding) => finding.category))];

  let rawScore = findings.reduce((total, finding) => total + finding.weight, 0);

  // A bank name alone is not suspicious enough to score.
  if (
    findings.length === 1 &&
    categories.includes("south_african_bank_context")
  ) {
    rawScore = 0;
  }

  // Context helps, but cannot automatically override critical findings.
  if (safetyContextDetected && rawScore < 10) {
    rawScore = 0;
  } else if (safetyContextDetected) {
    rawScore = Math.max(0, rawScore - 4);
  }

  const score = Math.min(100, rawScore * 10);

  const criticalCredentialRequest = findings.some(
    (finding) =>
      finding.critical &&
      (finding.category === "credential_theft" ||
        finding.category === "payment_credentials"),
  );

  let action: InterceptorAction = "allow";

  if (
    config.blockCriticalCredentialRequests &&
    criticalCredentialRequest &&
    !safetyContextDetected
  ) {
    action = "block_and_review";
  } else if (config.holdHighRiskMessages && score >= config.holdThreshold) {
    action = "hold_for_review";
  } else if (score >= config.warningThreshold) {
    action = "warn_user";
  } else if (score >= config.monitorThreshold) {
    action = "monitor";
  }

  return {
    safe: action === "allow",
    score,
    action,
    categories,
    safetyContextDetected,
    findings,
    reason: categories.length
      ? "Potentially risky content detected."
      : "No configured risk patterns detected.",
  };
}

// --------------------------------------------------
// 5. DELIVERY DECISION
// --------------------------------------------------

export function shouldDeliverMessage(result: InterceptorResult): boolean {
  return (
    result.action === "allow" ||
    result.action === "monitor" ||
    result.action === "warn_user"
  );
}

// --------------------------------------------------
// 6. QUICK TEST
// --------------------------------------------------

export function runTests() {
  const messages = [
    "Please send me your OTP to unlock your account.",
    "Pay an activation fee before your prize is released.",
    "Send me your banking details and card PIN.",
    "The meeting has moved to 3 PM tomorrow.",
    "Never share your OTP with anyone.",
    "Stuur eers geld vir die activation fee.",
    "My plug can double your cash today, just deposit first.",
  ];

  return messages.map((message) => ({
    message,
    ...inspectChatMessage(message),
  }));
}
