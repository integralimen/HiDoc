import { useAuth } from '../../entities/user/model/useAuth'
import { ProfileForm } from '../../features/profile-edit/ui/ProfileForm'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <main>
      <h1>Profile</h1>
      <ProfileForm key={user.id} user={user} />
    </main>
  )
}
