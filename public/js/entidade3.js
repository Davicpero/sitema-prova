import { iniciarCadastro } from './api.js';

iniciarCadastro({
    endereco: '/entidade3',             // >>> ALTERAR: rota igual à do server.js
    tabela: 'lista-entidade3',          // >>> ALTERAR: id do <tbody> no HTML
    campos: ['campo1', 'campo2'],       // >>> ALTERAR: os "name" dos inputs (= colunas do banco)
    // >>> ALTERAR: 'campo1' e "registro.campo2". A função formata o número como R$.
    //     Se não for dinheiro, troque a função só por 'campo2'.
    colunas: ['campo1', registro => Number(registro.campo2).toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL'
    })]
});
