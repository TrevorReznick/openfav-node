"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const index_1 = require("../database/index");
//const pool = new Pool()
class Model {
    constructor(data) {
        this.nome = data.nome;
        this.cognome = data.cognome;
        this.email = data.email;
    }
    static queryAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.pool.query('SELECT * FROM users');
        });
    }
    static queryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        });
    }
    static create(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // insert query
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // update query 
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // delete query
        });
    }
}
exports.Model = Model;
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
