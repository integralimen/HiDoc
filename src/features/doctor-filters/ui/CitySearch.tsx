import { useId, useState } from 'react'

import styles from './CitySearch.module.css'

import { Input } from '../../../shared/ui/Input/Input'

const cities = ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan']

export function CitySearch() {
  const id = useId()
  const listId = `${id}-cities`

  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestions = cities.filter((city) =>
    city.toLowerCase().includes(text.trim().toLowerCase()),
  )

  function selectCity(index: number) {
    const city = suggestions[index]

    if (!city) return

    setText(city)
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
        City
      </label>

      <Input
        id={id}
        name="city"
        type="text"
        role="combobox"
        autoComplete="off"
        placeholder="Enter a city"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          isOpen && suggestions[activeIndex]
            ? `${listId}-${activeIndex}`
            : undefined
        }
        value={text}
        onFocus={() => {
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onChange={(event) => {
          setText(event.target.value)
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

          if (event.key === 'Enter' && isOpen && suggestions[activeIndex]) {
            event.preventDefault()
            selectCity(activeIndex)
          }

          if (event.key === 'Escape') {
            event.preventDefault()
            setIsOpen(false)
            setActiveIndex(-1)
          }
        }}
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <ul id={listId} className={styles.list} role="listbox">
            {suggestions.map((city, index) => (
              <li
                key={city}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={text === city}
                className={`${styles.option} ${
                  activeIndex === index ? styles.highlighted : ''
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectCity(index)}
              >
                {city}
              </li>
            ))}
          </ul>

          {suggestions.length === 0 && (
            <p className={styles.message} role="status">
              No matching cities.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
