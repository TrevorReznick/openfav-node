import { Pool } from 'pg'

const config = {
  connectionString: process.env.DATABASE_URL
}

export const pool = new Pool(config)

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
})