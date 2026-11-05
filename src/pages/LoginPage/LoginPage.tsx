import { LoginForm } from '../../features/auth-login/ui/LoginForm'
import { Link } from 'react-router'

export function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <LoginForm />
      <p>
        Don’t have an account? <Link to="/register">Create account</Link>
      </p>
    </main>
  )
}
