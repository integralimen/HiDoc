import { useId, useState } from 'react'

import { specialties } from '../../../entities/doctor/model/specialties'
import styles from './SpecialtySearch.module.css'

export function SpecialtySearch() {
  const id = useId()
  const listId = `${id}-suggestions`

  const [text, setText] = useState('')
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(
    null,
  )
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

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
      <input
        id={id}
        name={selectedSpecialtyId ? undefined : 'q'}
        className={styles.input}
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

      {isOpen && (
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

          {suggestions.length === 0 && (
            <p className={styles.message} role="status">
              No matching specialties. You can still search by doctor’s name.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
