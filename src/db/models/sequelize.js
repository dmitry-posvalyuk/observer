import 'dotenv/config'
import { Sequelize } from 'sequelize'
import safe from 'colors'

const logQuery = (query, options) => {
  console.log(safe.bgGreen(new Date().toLocaleString()))
  console.log(safe.bgYellow(options.bind))
  console.log(safe.bgBlue(query))
  return options
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'db',
  process.env.DB_USER || 'dbuser',
  process.env.DB_PASSWORD || 'dbpassword',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : logQuery,
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    },
    define: {
      underscored: true
    }
  }
)

export default sequelize
