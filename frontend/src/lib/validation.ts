const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function requiredMessage(label: string): string {
  return `Enter your ${label.toLowerCase()}.`
}

export function passwordMessage(): string {
  return 'Use at least 8 characters. Avoid your name or email.'
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>
