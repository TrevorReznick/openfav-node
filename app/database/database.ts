import { Client, Pool} from 'pg'

const db_url = process.env.DATABASE_URL

export class Database {

    private client: Client
  
    constructor() {
      this.client = new Client({
        connectionString: db_url
      })
    }
  
    async connect() {
      await this.client.connect()
      console.log('Connected to the database')
    }

    async end() {
        await this.client.end()
        console.log('Close PG connection')
      }
  
    async query(sql: string, params?: any[]) {
      return await this.client.query(sql, params)
    }  
}

export const db = new Database()