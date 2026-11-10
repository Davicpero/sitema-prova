import "dotenv/config"
import {Pool} from 'pg'

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'meu_sistema',   // >>> ALTERAR: nome do seu banco
    password: process.env.DB_PASSWORD || 'senai',     // >>> ALTERAR: senha do seu PostgreSQL
    port: process.env.DB_PORT || 5432
})

export default pool
