import { useCancelAppointmentMutation } from '../../../entities/appointment/api/appointmentApi'
import { Button } from '../../../shared/ui/Button/Button'

type CancelAppointmentProps = {
  appointmentId: string
}

export function CancelAppointment({ appointmentId }: CancelAppointmentProps) {
  const [cancelAppointment, { isLoading, error }] =
    useCancelAppointmentMutation()

  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={() => {
          void cancelAppointment(appointmentId)
        }}
      >
        {isLoading ? 'Cancelling...' : 'Cancel appointment'}
      </Button>

      {error && (
        <p role="alert">
          {'message' in error ? error.message : 'Unable to cancel appointment.'}
        </p>
      )}
    </div>
  )
}
