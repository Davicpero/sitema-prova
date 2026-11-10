-- Tabela de login: NÃO precisa alterar
CREATE TABLE if not exists usuario(
id serial primary key,
nome varchar(100) not null,
email varchar(100) not null unique, 
senha varchar(100) not null
);

-- >>> ALTERAR: entidade1 = nome da sua 1ª tabela (ex.: cliente, aluno, produto)
-- >>> ALTERAR: campo1, campo2, campo3 = nomes das colunas
CREATE TABLE if not exists entidade1(
id serial primary key,
campo1 varchar(100) not null,
campo2 varchar(100) not null unique,
campo3 varchar(100) not null unique
);

-- >>> ALTERAR: entidade2 = nome da sua 2ª tabela (ex.: barbeiro, professor, fornecedor)
CREATE TABLE if not exists entidade2(
id serial primary key,
campo1 varchar(100) not null,
campo2 varchar(100) not null unique,
campo3 varchar(100) not null unique 
);

-- >>> ALTERAR: entidade3 = nome da sua 3ª tabela (ex.: servico, curso, categoria)
-- >>> ALTERAR: campo1 (texto) e campo2 (número inteiro)
CREATE TABLE if not exists entidade3(
id serial primary key, 
campo1 varchar(100),
campo2 int
);

-- >>> ALTERAR: vinculo = tabela que LIGA as outras 3 (ex.: agendamento, matricula, pedido)
-- >>> ALTERAR: data_vinculo e os id_entidadeX (precisam bater com os nomes das tabelas acima)
CREATE TABLE if not exists vinculo(
id serial primary key,
data_vinculo date not null,
id_entidade3 int not null,
id_entidade1 int not null,
id_entidade2 int not null,
foreign key (id_entidade3) references entidade3(id),
foreign key (id_entidade1) references entidade1(id),
foreign key (id_entidade2) references entidade2(id)
);
