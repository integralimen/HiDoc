import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

async function seedSlots() {
  await pb
    .collection('users')
    .authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD)

  if (pb.authStore.record?.role !== 'admin') {
    throw new Error('Use an admin account')
  }

  const doctors = await pb.collection('doctors').getFullList()

  const slots = await pb.collection('slots').getFullList({
    filter: pb.filter('datetime >= {:start} && datetime < {:end}', {
      start: '2026-11-16T00:00:00+01:00',
      end: '2026-11-23T00:00:00+01:00',
    }),
  })

  // Check before creating anything.
  for (const doctor of doctors) {
    const count = slots.filter((slot) => slot.doctor === doctor.id).length

    if (count > 10) {
      throw new Error(
        `${doctor.full_name} already has ${count} slots in this period.`,
      )
    }
  }

  const dates = []

  for (let day = 16; day <= 20; day++) {
    for (const hour of ['10:00', '14:00']) {
      dates.push(new Date(`2026-11-${day}T${hour}:00+01:00`).toISOString())
    }
  }

  for (const doctor of doctors) {
    const existing = slots.filter((slot) => slot.doctor === doctor.id)

    const times = new Set(existing.map((slot) => Date.parse(slot.datetime)))

    let count = existing.length

    for (const datetime of dates) {
      if (count >= 10) break
      if (times.has(Date.parse(datetime))) continue

      await pb.collection('slots').create({
        doctor: doctor.id,
        datetime,
        is_booked: false,
      })

      times.add(Date.parse(datetime))
      count++
    }

    console.log(`${doctor.full_name}: ${count} slots`)
  }

  console.log(`Done! ${doctors.length} doctors checked.`)
}

seedSlots().catch((error) => {
  console.error(error.response ?? error.message)
  process.exitCode = 1
})
