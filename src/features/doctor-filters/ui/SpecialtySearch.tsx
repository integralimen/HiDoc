import { useEffect, useId, useState } from 'react'
import { specialties } from '../../../entities/doctor/model/specialties'
import styles from './SpecialtySearch.module.css'
import { useDebounce } from '../../../shared/lib/hooks/useDebounce'
import { useQueryParams } from '../../../shared/lib/hooks/useQueryParams'
import { Input } from '../../../shared/ui/Input/Input'

export function SpecialtySearch() {
  const id = useId()
  const listId = `${id}-suggestions`

  const { searchParams, updateParams } = useQueryParams<
    'q' | 'specialty' | 'page'
  >()

  const initialSpecialty = specialties.find(
    (item) => item.id === searchParams.get('specialty'),
  )

  const [text, setText] = useState(
    initialSpecialty?.name ?? searchParams.get('q') ?? '',
  )

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(
    initialSpecialty?.id ?? null,
  )

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const source = JSON.stringify([
    searchParams.get('q'),
    searchParams.get('specialty'),
  ])

  const [previousSource, setPreviousSource] = useState(source)

  // Restore the input when URL parameters change.
  if (source !== previousSource) {
    setPreviousSource(source)
    setText(initialSpecialty?.name ?? searchParams.get('q') ?? '')
    setSelectedSpecialtyId(initialSpecialty?.id ?? null)
  }

  const debouncedText = useDebounce(text, 300)
  const debouncedSpecialty = useDebounce(selectedSpecialtyId, 300)

  useEffect(() => {
    if (text !== debouncedText || selectedSpecialtyId !== debouncedSpecialty) {
      return
    }

    const q = debouncedSpecialty ? '' : debouncedText.trim()
    const specialty = debouncedSpecialty ?? ''

    if (
      (searchParams.get('q') ?? '') === q &&
      (searchParams.get('specialty') ?? '') === specialty
    ) {
      return
    }

    updateParams({ q, specialty, page: '' }, true)
  }, [
    text,
    selectedSpecialtyId,
    debouncedText,
    debouncedSpecialty,
    searchParams,
    updateParams,
  ])

  const suggestions = specialties.filter((specialty) =>
    specialty.name.toLowerCase().includes(text.trim().toLowerCase()),
  )

  function selectSpecialty(index: number) {
    const specialty = suggestions[index]

    if (!specialty) return

    setText(specialty.name)
    setSelectedSpecialtyId(specialty.id)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div
      className={styles.container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
          setActiveIndex(-1)
        }
      }}
    >
      <label className={styles.label} htmlFor={id}>
        Specialty or doctor’s name
      </label>
      <Input
        id={id}
        name={selectedSpecialtyId ? undefined : 'q'}
        type="text"
        role="combobox"
        autoComplete="off"
        placeholder="Enter a specialty or name"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        value={text}
        onFocus={() => {
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onChange={(event) => {
          setText(event.target.value)
          setSelectedSpecialtyId(null)
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex((previous) =>
              Math.min(previous + 1, suggestions.length - 1),
            )
          }

          if (event.key === 'ArrowUp' && suggestions.length > 0) {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex((previous) => Math.max(previous - 1, 0))
          }

          if (
            event.key === 'Enter' &&
            isOpen &&
            activeIndex >= 0 &&
            suggestions[activeIndex]
          ) {
            event.preventDefault()
            selectSpecialty(activeIndex)
          }

          if (event.key === 'Escape') {
            event.preventDefault()
            setIsOpen(false)
            setActiveIndex(-1)
          }
        }}
      />

      {selectedSpecialtyId && (
        <input type="hidden" name="specialty" value={selectedSpecialtyId} />
      )}

      {isOpen && suggestions.length > 0 && (
        <div className={styles.dropdown}>
          <ul id={listId} className={styles.list} role="listbox">
            {suggestions.map((specialty, index) => (
              <li
                key={specialty.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selectedSpecialtyId === specialty.id}
                className={`${styles.option} ${
                  activeIndex === index ? styles.highlighted : ''
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSpecialty(index)}
              >
                {specialty.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
