# Guia: onde alterar o modelo

Todo lugar que precisa ser trocado está marcado no código com **`>>> ALTERAR`**.
No VS Code, use **Ctrl+Shift+F**, pesquise `ALTERAR` e você verá a lista completa.

---

## 1. Os nomes genéricos e o que eles significam

| No modelo | O que é | Na barbearia era | Exemplo: escola |
|---|---|---|---|
| `entidade1` | 1ª tabela (3 campos) | `cliente` | `aluno` |
| `entidade2` | 2ª tabela (3 campos) | `barbeiro` | `professor` |
| `entidade3` | 3ª tabela (texto + número) | `servico` | `curso` |
| `vinculo` | tabela que liga as 3 | `agendamento` | `matricula` |
| `campo1` | coluna principal (nome) | `nome` | `nome` |
| `campo2` | 2ª coluna | `cpf` / `preco` | `cpf` / `carga_horaria` |
| `campo3` | 3ª coluna | `telefone` | `telefone` |
| `data_vinculo` | data do vínculo | `data_agendamento` | `data_matricula` |
| `id_entidade1/2/3` | chaves estrangeiras | `id_cliente`... | `id_aluno`... |

> **A REGRA DE OURO:** o mesmo nome precisa ser igual em **4 lugares**:
> 1. a coluna no `sql.sql`
> 2. o SQL e o `req.body` no `server.js`
> 3. o `name` e o `id` do input no `.html`
> 4. a lista `campos` / `colunas` no `.js` da tela
>
> Se trocar `campo1` por `nome` em um lugar, troque em todos.

**Dica:** use o "Substituir em todos os arquivos" do VS Code (Ctrl+Shift+H).
Troque **primeiro `id_entidade1`** e só depois `entidade1`, senão sobra `id_` errado.

---

## 2. Arquivo por arquivo (com as linhas)

### `sql.sql`
| Linha | O que trocar |
|---|---|
| 1–7 | **Não mexer** (tabela de login `usuario`) |
| 9–16 | nome da tabela `entidade1` e as colunas `campo1/2/3` |
| 18–24 | nome da tabela `entidade2` e as colunas |
| 26–32 | nome da tabela `entidade3`, `campo1` (texto), `campo2` (número `int`) |
| 34–45 | tabela `vinculo`, `data_vinculo`, `id_entidadeX` e os `references entidadeX(id)` |

Quer mais ou menos colunas? Adicione/remova aqui e repita nos outros 3 lugares da regra de ouro.

### `db.js`
| Linha | O que trocar |
|---|---|
| 7 | nome do seu banco (`meu_sistema`) |
| 8 | senha do seu PostgreSQL (`senai`) |

### `src/server.js`
| Linha | O que trocar |
|---|---|
| 10 | `JWT_SECRET`: uma frase secreta qualquer |
| 17 | porta (opcional) |
| 21–97 | **Não mexer** (autenticação, `/registro`, `/login`) |
| 99–148 | bloco **ENTIDADE 2**: rota `'/entidade2'` (4×), tabela `entidade2` no SQL, `campo1/2/3` e as mensagens de erro |
| 150–196 | bloco **ENTIDADE 1**: mesma coisa com `entidade1` |
| 198–258 | bloco **VÍNCULO**: rota `'/vinculo'`, tabela `vinculo`, `data_vinculo`, `id_entidadeX`. No `SELECT` (linhas 205–219), os apelidos `AS entidade1/2/3` são os nomes que aparecem na tabela da tela |
| 260–310 | bloco **ENTIDADE 3**: rota `'/entidade3'`, tabela, `campo1/campo2` |

Em cada bloco há 4 rotas (GET, POST, PUT, DELETE). Troque o nome **nas 4**.

### `public/index.html` e `public/cadastro.html` (login)
| Linha | O que trocar |
|---|---|
| 6 | título da aba |
| 10 (index) | texto "Fazer login no Meu Sistema" |

O resto **não mexer**.

### `public/entidade1.html` e `public/entidade2.html`
| Linha | O que trocar |
|---|---|
| 6 | título da aba |
| 10 | nome do sistema no topo |
| 11–17 | menu: nome dos arquivos `.html` e os textos dos links (**igual em todas as páginas**) |
| 21 | título da tela |
| 23–33 | formulário: texto do `<label>`, `for`, `name` e `id` de cada input |
| 39 | legenda da tabela |
| 42–46 | cabeçalhos `<th>` (mesma ordem de `colunas` no JS) |
| 49 | `id` do `<tbody>` (igual a `tabela` no JS) |

### `public/entidade3.html`
Igual ao de cima: título 6, sistema 10, menu 11–17, tela 20, formulário 22–28, legenda 32, cabeçalhos 35–38.

### `public/vinculo.html`
| Linha | O que trocar |
|---|---|
| 6, 10, 11–17 | título, sistema e menu |
| 21 | título da tela |
| 22–43 | `label`, `name`, `id` do campo de data e dos 3 `<select>` + texto das `<option>` |
| 49–53 | cabeçalhos `<th>` |

### `public/js/entidade1.js`, `entidade2.js`, `entidade3.js`
| Linha | Propriedade | Precisa ser igual a... |
|---|---|---|
| 4 | `endereco` | a rota do `server.js` |
| 5 | `tabela` | o `id` do `<tbody>` |
| 6 | `campos` | os `name` dos inputs |
| 7 | `colunas` | o que aparece na tabela, na ordem dos `<th>` |

Em `entidade3.js` a 2ª coluna é uma função que formata em **R$**. Se o seu número não for dinheiro, troque a função só por `'campo2'`.

### `public/js/vinculo.js`
| Linha | O que trocar |
|---|---|
| 4–8 | as 3 rotas que enchem os `<select>` |
| 10 | os `id` dos 3 `<select>` (**mesma ordem** das rotas) |
| 17 | `registro.campo1`: coluna que aparece escrita dentro do select |
| 23–25 | `endereco`, `tabela`, `campos` |
| 27 | `data_vinculo` |
| 28 | `'entidade1', 'entidade2', 'entidade3'` = os apelidos `AS` do SELECT no server.js |

### `public/js/login.js`
| Linha | O que trocar |
|---|---|
| 28 | `'entidade1.html'`: página que abre depois do login |

### `public/js/api.js`
| Linha | O que trocar |
|---|---|
| 60 | `'/vinculo'` e `'Vincular'`: rota e texto do botão da tela de vínculo |

O resto do `api.js` é o "motor" genérico: **não precisa mexer**.

### Renomear arquivos (opcional)
Se renomear `entidade1.html` para `aluno.html` (e o `.js`), atualize:
- o `<script src="js/...">` no final do próprio HTML;
- os links do menu em **todas** as páginas;
- a linha 28 do `login.js`.

---

## 3. Como rodar

1. No pgAdmin: crie o banco com o nome da linha 7 do `db.js` e rode o `sql.sql`.
2. No terminal, **na pasta raiz do projeto**:
   ```bash
   npm install
   npm run dev
   ```
3. Abra `http://localhost:3000`, crie uma conta e faça login.

## 4. Ordem recomendada para fazer a troca

1. Decida os nomes (preencha a tabela da seção 1 no papel).
2. `sql.sql`, depois rode no banco.
3. `server.js`, e teste as rotas no Thunder Client/Postman.
4. HTMLs.
5. JS das telas.
6. Menu, títulos e textos.
