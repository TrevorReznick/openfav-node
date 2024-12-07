import { pool } from '../database/index'
import { UserModel } from '../interfaces/UsersModel'

//const pool = new Pool()

export class Model {
    
    constructor(data: UserModel) {
        this.nome = data.nome
        this.cognome = data.cognome
        this.email = data.email
    }

    nome: string
    cognome: string
    email: string

    static async queryAll() {
        return await pool.query('SELECT * FROM users')
    }
    static async queryById(id: number) {
        return await pool.query('SELECT * FROM users WHERE id = $1', [id])
    }
    static async create(model: Model) {
        // insert query
    }
    async save() {
        // update query 
    }
    static async delete(id: number) {
        // delete query
    }
}

/* usage
const user = new Model({
    id: 1,
    name: 'John',
    email: 'john@email.com'
})
await Model.create(user)
*/

/* @@ unused/test @@
static async findAll(): Promise<UserModel[]> {
    return await pool.query('SELECT * FROM test')
}
static async findAll() {

    const query = 'SELECT * FROM test'
    try {
        db.connect()
        const result = await db.query('SELECT * FROM test')
        return result.rows
    } catch (error) {
        throw error
    } finally {
        await db.end()
    }
}
*/


