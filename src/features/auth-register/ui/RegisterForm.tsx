import { useId, useState } from 'react'
import { Link } from 'react-router'

import { useRegisterMutation } from '../../../entities/user/api/authApi'
import { Button } from '../../../shared/ui/Button/Button'
import { Input } from '../../../shared/ui/Input/Input'
import styles from './RegisterForm.module.css'

const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'passwordConfirm',
    label: 'Confirm password',
    type: 'password',
    autoComplete: 'new-password',
  },
] as const

export function RegisterForm() {
  const id = useId()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [message, setMessage] = useState('')
  const [register, { isLoading, isSuccess }] = useRegisterMutation()

  if (isSuccess) {
    return (
      <div role="status">
        <p>Account created. You can now sign in.</p>
        <Link to="/login">Sign in</Link>
      </div>
    )
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={async (event) => {
        event.preventDefault()

        if (isLoading) return

        setMessage('')

        if (!values.name.trim()) {
          setMessage('Enter your name.')
          return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
          setMessage('Enter a valid email.')
          return
        }

        if (values.password.length < 8) {
          setMessage('Password must contain at least 8 characters.')
          return
        }

        if (values.password !== values.passwordConfirm) {
          setMessage('Passwords do not match.')
          return
        }

        try {
          await register({
            ...values,
            name: values.name.trim(),
            email: values.email.trim(),
          }).unwrap()

          setValues({
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
          })
        } catch {
          setMessage(
            'Unable to create an account. Check your details and try again.',
          )
        }
      }}
    >
      {fields.map(({ name, label, type, autoComplete }) => (
        <div key={name}>
          <label className={styles.label} htmlFor={`${id}-${name}`}>
            {label}
          </label>

          <Input
            id={`${id}-${name}`}
            type={type}
            autoComplete={autoComplete}
            value={values[name]}
            disabled={isLoading}
            onChange={(event) =>
              setValues({
                ...values,
                [name]: event.target.value,
              })
            }
          />
        </div>
      ))}

      {message && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  )
}
