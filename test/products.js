import { writeFile } from 'node:fs'
import { faker } from '@faker-js/faker'

writeFile(
  './test/products.json',
  JSON.stringify(
    new Array(5_000).fill().map(() => ({
      productKey: parseInt(faker.string.numeric({ length: 12, allowLeadingZeros: false })),
      centAmount: faker.number.int({ min: 1_000, max: 100_000 }),
      skus: new Array(faker.number.int({ min: 2, max: 6 }))
        .fill()
        .map(() => parseInt(faker.string.numeric({ length: 9, allowLeadingZeros: false })))
    })),
    null,
    2
  ),
  err => {}
)
