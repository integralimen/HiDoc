import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

async function renameDoctors() {
  await pb
    .collection('users')
    .authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD)

  if (pb.authStore.record?.role !== 'admin') {
    throw new Error('Use an admin account')
  }

  const firstNames = [
    'Adam',
    'Piotr',
    'Pawel',
    'Michal',
    'Tomasz',
    'Jakub',
    'Jan',
    'Kamil',
    'Marcin',
    'Mateusz',
    'Anna',
    'Maria',
    'Katarzyna',
    'Magdalena',
    'Joanna',
    'Aleksandra',
    'Zofia',
    'Julia',
    'Natalia',
    'Ewa',
    'Krzystof',
    'Jan',
    'Nikodem',
    'Aleksander',
    'Maja',
    'Julia',
    'Hanna',
    'Oliwia',
  ]

  const lastNames = [
    'Nowak',
    'Wojcik',
    'Mazur',
    'Krawczyk',
    'Kaczmarek',
    'Zajac',
    'Krol',
    'Wrobel',
    'Wieczorek',
    'Dudek',
    'Pawlak',
    'Walczak',
    'Sikora',
    'Baran',
    'Szewczyk',
  ]

  const doctors = await pb.collection('doctors').getFullList()
  const usedNames = new Set(doctors.map((doctor) => doctor.full_name))

  const names = firstNames
    .flatMap((first) => lastNames.map((last) => `${first} ${last}`))
    .filter((name) => !usedNames.has(name))

  const demoDoctors = doctors.filter((doctor) =>
    doctor.full_name.startsWith('Demo Doctor '),
  )

  if (names.length < demoDoctors.length) {
    throw new Error('Not enough unique names')
  }

  for (const doctor of demoDoctors) {
    const index = Math.floor(Math.random() * names.length)
    const [name] = names.splice(index, 1)

    await pb.collection('doctors').update(doctor.id, {
      full_name: name,
    })

    console.log(name)
  }

  console.log(`Done! Renamed ${demoDoctors.length} doctors.`)
}

renameDoctors().catch((error) => {
  console.error(error.response ?? error.message)
  process.exitCode = 1
})
