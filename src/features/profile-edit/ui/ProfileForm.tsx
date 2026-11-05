import { useId, useState } from 'react'

import { useUpdateProfileMutation } from '../../../entities/user/api/userApi'
import type { User } from '../../../entities/user/model/types'
import { Button } from '../../../shared/ui/Button/Button'
import { Input } from '../../../shared/ui/Input/Input'
import styles from './ProfileForm.module.css'

type ProfileFormProps = {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const id = useId()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={async (event) => {
        event.preventDefault()

        if (isLoading) return

        setMessage('')
        setIsError(true)

        if (!name.trim()) {
          setMessage('Enter your name.')
          return
        }

        if (phone.trim() && !/^\+?[0-9 ()-]{7,20}$/.test(phone.trim())) {
          setMessage('Enter a valid phone number.')
          return
        }

        try {
          await updateProfile({
            name: name.trim(),
            phone: phone.trim(),
          }).unwrap()

          setIsError(false)
          setMessage('Profile saved')
        } catch {
          setMessage('Unable to save your profile. Please try again.')
        }
      }}
    >
      <p>Email: {user.email}</p>

      <div>
        <label className={styles.label} htmlFor={`${id}-name`}>
          Name
        </label>

        <Input
          id={`${id}-name`}
          autoComplete="name"
          value={name}
          disabled={isLoading}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div>
        <label className={styles.label} htmlFor={`${id}-phone`}>
          Phone
        </label>

        <Input
          id={`${id}-phone`}
          type="tel"
          autoComplete="tel"
          value={phone}
          disabled={isLoading}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      {message && (
        <p
          className={isError ? styles.error : styles.succes}
          role={isError ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
