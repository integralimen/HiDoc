/// <reference path="../pb_data/types.d.ts" />

/* global routerAdd, $apis, ForbiddenError, BadRequestError, ApiError, Record */

routerAdd(
  'POST',
  '/api/hidoc/appointments',
  (event) => {
    if (event.auth.getString('role') !== 'patient') {
      throw new ForbiddenError('Only patients can book appointments.')
    }

    const body = event.requestInfo().body

    if (typeof body.slot !== 'string' || !body.slot) {
      throw new BadRequestError('Choose an appointment time.')
    }

    let appointmentId = ''

    event.app.runInTransaction((app) => {
      const slot = app.findRecordById('slots', body.slot)

      const datetime = new Date(
        slot.getString('datetime').replace(' ', 'T'),
      ).getTime()

      if (!Number.isFinite(datetime) || datetime <= Date.now()) {
        throw new BadRequestError('This appointment time has passed.')
      }

      const existing = app.findRecordsByFilter(
        'appointments',
        'slot = {:slot} && status != "cancelled"',
        '',
        1,
        0,
        { slot: slot.id },
      )

      if (slot.getBool('is_booked') || existing.length > 0) {
        throw new ApiError(409, 'This appointment time is already booked.')
      }

      const collection = app.findCollectionByNameOrId('appointments')
      const appointment = new Record(collection)

      appointment.set('user', event.auth.id)
      appointment.set('doctor', slot.getString('doctor'))
      appointment.set('slot', slot.id)
      appointment.set('status', 'new')

      app.save(appointment)

      slot.set('is_booked', true)
      app.save(slot)

      appointmentId = appointment.id
    })

    return event.json(201, { id: appointmentId })
  },
  $apis.requireAuth('users'),
)

routerAdd(
  'POST',
  '/api/hidoc/appointments/{id}/cancel',
  (event) => {
    const id = event.request.pathValue('id')

    event.app.runInTransaction((app) => {
      const appointment = app.findRecordById('appointments', id)
      const doctor = app.findRecordById(
        'doctors',
        appointment.getString('doctor'),
      )

      const role = event.auth.getString('role')
      const isOwner = appointment.getString('user') === event.auth.id
      const isDoctor =
        role === 'doctor' && doctor.getString('user') === event.auth.id

      if (!isOwner && !isDoctor && role !== 'admin') {
        throw new ForbiddenError('You cannot cancel this appointment.')
      }

      if (appointment.getString('status') === 'cancelled') {
        return
      }

      const slot = app.findRecordById('slots', appointment.getString('slot'))

      const datetime = new Date(
        slot.getString('datetime').replace(' ', 'T'),
      ).getTime()

      if (!Number.isFinite(datetime) || datetime <= Date.now()) {
        throw new BadRequestError('This appointment time has passed.')
      }

      appointment.set('status', 'cancelled')
      app.save(appointment)

      slot.set('is_booked', false)
      app.save(slot)
    })

    return event.json(200, { id, status: 'cancelled' })
  },
  $apis.requireAuth('users'),
)
