import { writeFile } from 'node:fs'
import { faker } from '@faker-js/faker'

const customerQty = 10_000
let customers = []
for (let i = 0; i < customerQty; i++) {
  customers[i] = faker.helpers.arrayElement(['guest-', '']) + faker.string.uuid()
}

writeFile('./test/anonymousIds.json', JSON.stringify(customers), err => {})
