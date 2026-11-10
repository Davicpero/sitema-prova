import { chamandoServer, iniciarCadastro } from './api.js';

async function carregarOpcoes() {
    // >>> ALTERAR: as 3 rotas que preenchem os <select> (mesma ordem da lista de baixo)
    const listas = await Promise.all([
        chamandoServer('/entidade1'),
        chamandoServer('/entidade2'),
        chamandoServer('/entidade3')
    ]);
    // >>> ALTERAR: ids dos <select> no HTML (mesma ordem das rotas acima)
    ['id_entidade1', 'id_entidade2', 'id_entidade3'].forEach((campo, indice) => {
        const select = document.getElementById(campo);
        if (!Array.isArray(listas[indice])) throw new Error('Não foi possível carregar as opções.');
        // Mantém a opção inicial do HTML e remove opções de carregamentos anteriores.
        select.length = 1;
        for (const registro of listas[indice]) {
            // >>> ALTERAR: registro.campo1 = coluna que aparece escrita na opção
            select.add(new Option(registro.campo1, registro.id));
        }
    });
}
iniciarCadastro({
    endereco: '/vinculo',                                                  // >>> ALTERAR: rota
    tabela: 'lista-vinculo',                                               // >>> ALTERAR: id do <tbody>
    campos: ['data_vinculo', 'id_entidade1', 'id_entidade2', 'id_entidade3'], // >>> ALTERAR: names do form
    colunas: [
        registro => registro.data_vinculo.split('-').reverse().join('/'),  // >>> ALTERAR: data_vinculo
        'entidade1', 'entidade2', 'entidade3'                              // >>> ALTERAR: apelidos (AS) do SELECT no server.js
    ],
    preparar: carregarOpcoes
});
