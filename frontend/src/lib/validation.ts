const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function requiredMessage(label: string): string {
  return `${label} is required.`
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>
