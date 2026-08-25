export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-xs text-error" role="alert">
      {message}
    </p>
  )
}
