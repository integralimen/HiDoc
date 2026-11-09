import PocketBase from 'pocketbase'

process.env.TZ = 'Europe/Warsaw'

const pb = new PocketBase('http://127.0.0.1:8090')

async function seed() {
  await pb
    .collection('users')
    .authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD)

  if (pb.authStore.record?.role !== 'admin') {
    throw new Error('Use an account with the admin role')
  }

  const doctors = await pb.collection('doctors').getFullList({
    sort: 'created,id',
  })

  if (!doctors.length) {
    throw new Error('Add at least one doctor first')
  }

  const templates = [...doctors]

  while (doctors.length < 200) {
    const index = doctors.length
    const template = templates[index % templates.length]

    const doctor = await pb.collection('doctors').create({
      full_name: `Demo Doctor ${index + 1}`,
      specialty: template.specialty,
      experience_years: 1 + (index % 30),
      rating: Number((3.5 + (index % 16) / 10).toFixed(1)),
      price: 100 + (index % 9) * 50,
      clinic: template.clinic,
      city: template.city,
      about: 'Fictional doctor for demonstration purposes.',
      education: template.education,
      patients_count: 100 + index * 10,
    })

    doctors.push(doctor)
    console.log(`Doctors: ${doctors.length}/200`)
  }

  const slots = await pb.collection('slots').getFullList()

  // Two appointments per day for the next five days.
  const dates = []

  for (let day = 1; day <= 5; day++) {
    for (const hour of [10, 14]) {
      const date = new Date()
      date.setDate(date.getDate() + day)
      date.setHours(hour, 0, 0, 0)
      dates.push(date.toISOString())
    }
  }

  const existing = new Set(
    slots.map((slot) => `${slot.doctor}:${Date.parse(slot.datetime)}`),
  )

  for (const doctor of doctors) {
    for (const datetime of dates) {
      const key = `${doctor.id}:${Date.parse(datetime)}`

      if (existing.has(key)) continue

      await pb.collection('slots').create({
        doctor: doctor.id,
        datetime,
        is_booked: false,
      })

      existing.add(key)
    }

    console.log(`Slots ready: ${doctor.full_name}`)
  }

  console.log('Done!')
}

seed().catch((error) => {
  console.error(error.response ?? error.message)
  process.exitCode = 1
})
