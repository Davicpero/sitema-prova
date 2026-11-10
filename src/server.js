import express from "express"
import cors from "cors"
import pool from "../db.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

const app = express()

const JWT_SECRET = "TROQUE_ESTA_CHAVE" // >>> ALTERAR: qualquer frase secreta sua

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.static('public'))

const PORT = 3000 // >>> ALTERAR (opcional): porta do servidor

const SALT = await bcrypt.genSalt(10)

// Middleware de autenticação: NÃO precisa alterar
function autentificarToken(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: "Acesso negado."})
    }

    try{
        const usuarioJWT = jwt.verify(token, JWT_SECRET)
        req.usuarioJWT = usuarioJWT
        next()
    }catch(erro){
        return res.status(403).json({message: "Token inválido."})
    }
}

//LOGIN ROTAS: NÃO precisa alterar
app.post('/registro', async (req, res) => {
    const {nome, email, senha} = req.body
    try{
        if(!nome || !email || !senha){
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios!"
            })
        }

        const senhaHash = await bcrypt.hash(senha, SALT)
        const novoUsuario = await pool.query("INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email", [nome, email, senhaHash])

        res.json(novoUsuario.rows[0])
        }catch(erro){
            res.json({message: "erro"})
        }
    }
)

app.post('/login', async (req, res) => {
    const {email, senha} = req.body
    const resultado = await pool.query("SELECT * FROM usuario WHERE email = $1", [email])

    if(resultado.rows.length === 0){
        return res.status(401).json({
            erro: "Email e senha inválidos!"
        })
    }

    const usuario = resultado.rows[0]

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCorreta){
        return res.status(401).json({
            erro: "Email e senha inválidos!"
        })
    }

    const token = jwt.sign(
        {id: usuario.id, email: usuario.email},
        JWT_SECRET,
        {expiresIn: "1h"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, //pra testar localmente
        sameSite: "lax",
        maxAge: 3600000
    })

    return res.status(200).json({
        message: "Login realizado com sucesso!",
        user: {
            "nome": usuario.nome
        }
    })
})

// =====================================================================
// ROTAS ENTIDADE 2
// >>> ALTERAR neste bloco: '/entidade2' (rota), entidade2 (tabela no SQL),
//     campo1, campo2, campo3 (colunas) e as mensagens de erro
// =====================================================================
app.get('/entidade2', autentificarToken, async (req, res) => {
    try{
    const registros = await pool.query('SELECT id, campo1, campo2, campo3 FROM entidade2')
    res.json(registros.rows)
    }catch(erro){
        res.json({message: "Erro ao consultar entidade 2."})
    }
})

app.post('/entidade2', autentificarToken, async (req, res) => {
    const {campo1, campo2, campo3} = req.body
    try{

        const novoRegistro = await pool.query('INSERT INTO entidade2 (campo1, campo2, campo3) VALUES ($1, $2, $3) RETURNING *', [campo1, campo2, campo3])

        res.json(novoRegistro.rows[0])
    }catch(erro){
            res.json({message: "Erro ao cadastrar entidade 2!"})
        }
})

app.put('/entidade2/:id', autentificarToken, async (req, res) => {
    const {id} = req.params
    const {campo1, campo2, campo3} = req.body

    try{

    const atualizarRegistro = await pool.query('UPDATE entidade2 SET campo1 = $1, campo2 = $2, campo3 = $3 WHERE id = $4 RETURNING *', [campo1, campo2, campo3, id])

    res.json(atualizarRegistro.rows[0])
    }catch(erro){
            res.json({message: "Erro ao atualizar entidade 2!"})
        }
})

app.delete('/entidade2/:id', autentificarToken, async (req, res) => {
    const {id} = req.params

    try{
    const deletarRegistro = await pool.query('DELETE FROM entidade2 WHERE id = $1 RETURNING *', [id])
    res.json(deletarRegistro.rows[0])
    }catch(erro){
            res.json({message: "Erro ao deletar entidade 2!"})
        }
})

// =====================================================================
// ROTAS ENTIDADE 1
// >>> ALTERAR neste bloco: '/entidade1', entidade1, campo1, campo2, campo3
//     e as mensagens de erro
// =====================================================================
app.get('/entidade1', autentificarToken, async (req, res) => {
    try{
    const registros = await pool.query('SELECT id, campo1, campo2, campo3 FROM entidade1')
    res.json(registros.rows)
    }catch(erro){
        res.json({message: "Erro ao consultar entidade 1!"})
    }
})

app.post('/entidade1', autentificarToken, async (req, res) => {
    const {campo1, campo2, campo3} = req.body
    try{

        const novoRegistro = await pool.query('INSERT INTO entidade1 (campo1, campo2, campo3) VALUES ($1, $2, $3) RETURNING *', [campo1, campo2, campo3])
        res.json(novoRegistro.rows[0])
    }catch(erro){
        res.json({message: "Erro ao cadastrar entidade 1!"})
    }
})

app.put('/entidade1/:id', autentificarToken, async (req, res) => {
    const {id} = req.params
    const {campo1, campo2, campo3} = req.body
    try{

        const atualizarRegistro = await pool.query('UPDATE entidade1 SET campo1 = $1, campo2 = $2, campo3 = $3 WHERE id = $4 RETURNING *', [campo1, campo2, campo3, id])
        res.json(atualizarRegistro.rows[0])
    }catch(erro){
        res.json({message: "Erro ao atualizar entidade 1!"})
    }
})

app.delete('/entidade1/:id', autentificarToken, async (req, res) => {
    const {id} = req.params
    try{
        const deletarRegistro = await pool.query('DELETE FROM entidade1 WHERE id = $1 RETURNING *', [id])
        res.json(deletarRegistro.rows[0])
    }catch(erro){
        res.json({message: "Erro ao deletar entidade 1!"})
    }
})

// =====================================================================
// ROTAS VÍNCULO (a tabela que liga as outras 3)
// >>> ALTERAR neste bloco: '/vinculo', vinculo, data_vinculo,
//     id_entidade1/2/3, entidade1/2/3 e os campos mostrados (campo1 AS ...)
// =====================================================================
app.get('/vinculo', autentificarToken, async (req, res) => {
    try{
        const registros = await pool.query(`
            SELECT
                vinculo.id,
                TO_CHAR(vinculo.data_vinculo, 'YYYY-MM-DD') AS data_vinculo,
                vinculo.id_entidade3,
                entidade3.campo1 AS entidade3,
                entidade3.campo2,
                vinculo.id_entidade1,
                entidade1.campo1 AS entidade1,
                vinculo.id_entidade2,
                entidade2.campo1 AS entidade2
            FROM vinculo
            JOIN entidade3 ON entidade3.id = vinculo.id_entidade3
            JOIN entidade1 ON entidade1.id = vinculo.id_entidade1
            JOIN entidade2 ON entidade2.id = vinculo.id_entidade2
            ORDER BY vinculo.data_vinculo
        `)
        res.json(registros.rows)
    }catch(erro){
        res.status(500).json({message: "Erro ao consultar vínculos!"})
    }
})

app.post('/vinculo', autentificarToken, async (req, res) => {
    const {data_vinculo, id_entidade3, id_entidade1, id_entidade2} = req.body
    try{
        const novoRegistro = await pool.query('INSERT INTO vinculo (data_vinculo, id_entidade3, id_entidade1, id_entidade2) VALUES ($1, $2, $3, $4) RETURNING *', [data_vinculo, id_entidade3, id_entidade1, id_entidade2])
        res.json(novoRegistro.rows[0])
    }catch(erro){
        res.json({message: "Erro ao cadastrar vínculo!"})
    }
})

app.put('/vinculo/:id', autentificarToken, async (req, res) => {
    const {id} = req.params
    const {data_vinculo, id_entidade3, id_entidade1, id_entidade2} = req.body

    try{
        const atualizarRegistro = await pool.query('UPDATE vinculo SET data_vinculo = $1, id_entidade3 = $2, id_entidade1 = $3, id_entidade2 = $4 WHERE id = $5 RETURNING *', [data_vinculo, id_entidade3, id_entidade1, id_entidade2, id])
        res.json(atualizarRegistro.rows[0])
    }catch(erro){
        res.json({message: "Erro ao atualizar vínculo!"})
    }
})

app.delete('/vinculo/:id', autentificarToken, async (req, res) => {
    const {id} = req.params
    try{
        const deletarRegistro = await pool.query('DELETE FROM vinculo WHERE id = $1 RETURNING *', [id])
        res.json(deletarRegistro.rows[0])
    }catch(erro){
        res.json({message: "Erro ao deletar vínculo!"})
    }
})

// =====================================================================
// ROTAS ENTIDADE 3
// >>> ALTERAR neste bloco: '/entidade3', entidade3, campo1, campo2
//     e as mensagens de erro
// =====================================================================
app.get('/entidade3', autentificarToken, async (req, res) => {
    try{
        const registros = await pool.query("SELECT id, campo1, campo2 FROM entidade3")
        return res.status(200).json(registros.rows)
    }catch(erro){
        return res.status(400).json({
            message: "Erro ao consultar entidade 3."
        })
    }
})

app.post('/entidade3', autentificarToken, async (req, res) => {
    const {campo1, campo2} = req.body
    try{
        const novoRegistro = await pool.query("INSERT INTO entidade3 (campo1, campo2) VALUES ($1, $2) RETURNING *", [campo1, campo2])
        return res.status(200).json(novoRegistro.rows[0])
    }catch(erro){
        return res.status(400).json({
            message: "Não foi possível cadastrar entidade 3."
        })
    }
})

app.put('/entidade3/:id', autentificarToken, async (req, res) => {
    const { id } = req.params
    const { campo1, campo2 } = req.body
    try {
        const resultado = await pool.query(
            'UPDATE entidade3 SET campo1 = $1, campo2 = $2 WHERE id = $3 RETURNING *',
            [campo1, campo2, id]
        )
        if (!resultado.rows.length) return res.status(404).json({ message: "Registro não encontrado." })
        return res.json(resultado.rows[0])
    } catch (erro) {
        return res.status(400).json({ message: "Não foi possível atualizar entidade 3." })
    }
})

app.delete('/entidade3/:id', autentificarToken, async (req, res) => {
    try {
        const resultado = await pool.query('DELETE FROM entidade3 WHERE id = $1 RETURNING *', [req.params.id])
        if (!resultado.rows.length) return res.status(404).json({ message: "Registro não encontrado." })
        return res.json(resultado.rows[0])
    } catch (erro) {
        return res.status(400).json({ message: "Não foi possível excluir. Verifique se ele possui vínculos." })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
