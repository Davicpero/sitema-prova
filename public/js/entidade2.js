import { iniciarCadastro } from './api.js';

iniciarCadastro({
    endereco: '/entidade2',                    // >>> ALTERAR: rota igual à do server.js
    tabela: 'lista-entidade2',                 // >>> ALTERAR: id do <tbody> no HTML
    campos: ['campo1', 'campo2', 'campo3'],     // >>> ALTERAR: os "name" dos inputs (= colunas do banco)
    colunas: ['campo1', 'campo2', 'campo3']     // >>> ALTERAR: o que aparece na tabela, na ordem dos <th>
});
