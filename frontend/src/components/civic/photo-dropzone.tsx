import { ImagePlus, X } from 'lucide-react'
import { useRef, type ChangeEvent, type DragEvent } from 'react'
import { cn } from '@/lib/utils'

interface PhotoDropzoneProps {
  previewUrl: string | null
  onFile: (file: File) => void
  onClear: () => void
  invalid?: boolean
}

export function PhotoDropzone({ previewUrl, onFile, onClear, invalid }: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function accept(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    onFile(file)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    accept(event.target.files?.[0])
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    accept(event.dataTransfer.files[0])
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onChange}
      />
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-md border border-line">
          <img src={previewUrl} alt="Selected issue photo" className="max-h-72 w-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              className="rounded-md bg-surface px-2 py-1 text-xs text-ink shadow-sm"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="rounded-md bg-surface p-1 text-ink shadow-sm"
              onClick={onClear}
              aria-label="Remove photo"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className={cn(
            'flex min-h-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-6 text-center',
            invalid ? 'border-error bg-error-soft/40' : 'border-line-strong bg-surface',
          )}
        >
          <ImagePlus className="size-5 text-brand" aria-hidden />
          <p className="text-sm font-medium text-ink">Drop a photo, or click to upload</p>
          <p className="text-xs text-ink-subtle">JPG or PNG. The photo stays on this device in this phase.</p>
        </div>
      )}
    </div>
  )
}
