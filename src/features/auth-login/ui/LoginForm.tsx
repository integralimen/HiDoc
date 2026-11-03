import { useId, useState } from 'react'

import { useLoginMutation } from '../../../entities/user/api/authApi'
import { useAuth } from '../../../entities/user/model/useAuth'
import { Button } from '../../../shared/ui/Button/Button'
import { Input } from '../../../shared/ui/Input/Input'
import styles from './LoginForm.module.css'
import { pb } from '../../../shared/api/pocketbase'

export function LoginForm() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const [login, { isLoading }] = useLoginMutation()
  const { user } = useAuth()

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={async (event) => {
        event.preventDefault()

        if (isLoading) return

        const normalizedEmail = email.trim()
        const nextEmailError = !normalizedEmail
          ? 'Enter your email.'
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
            ? 'Enter a valid email.'
            : ''
        const nextPasswordError = password ? '' : 'Enter your password.'

        setEmailError(nextEmailError)
        setPasswordError(nextPasswordError)
        setSubmitError('')

        if (nextEmailError || nextPasswordError) return

        try {
          await login({
            email: normalizedEmail,
            password,
          }).unwrap()

          setPassword('')
        } catch (error: unknown) {
          setSubmitError(
            typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
              ? error.message
              : 'Unable to sign in. Please try again.',
          )
        }
      }}
    >
      <div>
        <label className={styles.label} htmlFor={`${id}-email`}>
          Email
        </label>

        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="username"
          value={email}
          disabled={isLoading}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? `${id}-email-error` : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />

        {emailError && (
          <p id={`${id}-email-error`} className={styles.error}>
            {emailError}
          </p>
        )}
      </div>

      <div>
        <label className={styles.label} htmlFor={`${id}-password`}>
          Password
        </label>

        <Input
          id={`${id}-password`}
          type="password"
          autoComplete="current-password"
          value={password}
          disabled={isLoading}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? `${id}-password-error` : undefined}
          onChange={(event) => setPassword(event.target.value)}
        />

        {passwordError && (
          <p id={`${id}-password-error`} className={styles.error}>
            {passwordError}
          </p>
        )}
      </div>

      {submitError && (
        <p className={styles.error} role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {user && (
        <div>
          <p role="status">Signed in as {user.email}</p>

          <Button
            type="button"
            onClick={() => {
              pb.authStore.clear()
              setSubmitError('')
            }}
          >
            Sign out
          </Button>
        </div>
      )}
    </form>
  )
}
