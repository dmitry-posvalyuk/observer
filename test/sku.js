import { writeFile } from 'node:fs'
import { faker } from '@faker-js/faker'

const skuQty = 5_000

let skuList = []
for (let i = 0; i < skuQty; i++) {
  skuList[i] = faker.string.numeric({ length: 9, allowLeadingZeros: false })
}

writeFile('./skus.json', JSON.stringify(skuList), err => {})
