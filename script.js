// Carrega as tarefas salvas ou cria a lista inicial com exemplos ao carregar a página
window.onload = function () {
    const tarefasIniciais = [
        { texto: 'Ler 20 páginas do livro', concluida: false },
        { texto: 'Fazer anotações de cálculo', concluida: false }
    ];
    if (!localStorage.getItem('tarefas')) {
        salvarTarefas(tarefasIniciais); // Salva as tarefas iniciais no localStorage
    }
    carregarTarefas(); // Carrega as tarefas da lista
};

// Função para salvar tarefas no localStorage
function salvarTarefas(tarefas) {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Salva a lista de tarefas como uma string JSON
}

// Função para carregar e exibir as tarefas do localStorage
function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Obtém as tarefas
    const container = document.getElementById('adicionar');
    container.innerHTML = ''; // Limpa a lista antes de carregar

    tarefas.forEach((tarefa, index) => {
        container.appendChild(criarElementoTarefa(tarefa, index)); // Cria e adiciona cada tarefa ao container
    });
}

// Função para adicionar uma nova tarefa
function adicionarTarefa(event) {
    event.preventDefault(); // Impede o envio do formulário
    const inputTarefa = document.getElementById('nova-tarefa');
    const texto = inputTarefa.value.trim(); // Remove espaços em branco extras

    if (texto) {
        const novaTarefa = { texto, concluida: false }; // Cria a nova tarefa
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Obtém tarefas existentes
        tarefas.push(novaTarefa); // Adiciona nova tarefa à lista
        salvarTarefas(tarefas); // Salva a lista atualizada
        carregarTarefas(); // Atualiza a exibição
        inputTarefa.value = ''; // Limpa o campo após adicionar
    }
}

// Função para criar o HTML de uma tarefa
function criarElementoTarefa(tarefa, index) {
    const divAtividade = document.createElement('div');
    divAtividade.id = 'atividade';

    const checkAtividade = document.createElement('div');
    checkAtividade.id = 'check-atividade';

    // Cria checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarefa.concluida;
    checkbox.onchange = () => toggleConclusao(index); // Marca/desmarca tarefa

    // Cria rótulo editável para a tarefa
    const label = document.createElement('label');
    label.textContent = tarefa.texto;
    label.className = 'editable'; // Classe para estilização

    checkAtividade.appendChild(checkbox);
    checkAtividade.appendChild(label);

    // Cria a área de ações (editar e excluir)
    const divAcoes = document.createElement('div');
    divAcoes.className = 'acoes';

    // Botão de editar
    const btnEditar = document.createElement('span');
    btnEditar.id = 'icon editar';
    btnEditar.innerHTML = '<img src="icon/note-pencil.svg" alt="editar">';
    btnEditar.onclick = () => editarTarefa(label); // Ativa edição

    // Botão de excluir
    const btnExcluir = document.createElement('span');
    btnExcluir.id = 'icon excluir';
    btnExcluir.innerHTML = '<img src="icon/trash.svg" alt="excluir">';
    btnExcluir.onclick = () => excluirTarefa(index); // Exclui a tarefa

    divAcoes.appendChild(btnEditar);
    divAcoes.appendChild(btnExcluir);
    divAtividade.appendChild(checkAtividade);
    divAtividade.appendChild(divAcoes);

    return divAtividade; // Retorna a tarefa criada
}

// Função para ativar a edição do texto
function editarTarefa(label) {
    label.contentEditable = true; // Torna o texto editável
    label.focus(); // Foca no rótulo

    // Posiciona o cursor no fim do texto
    document.execCommand("selectAll", false, null); // Seleciona todo o texto
    document.getSelection().collapseToEnd(); // Colapsa a seleção no final

    // Salva o novo texto ao perder o foco
    label.onblur = () => {
        label.contentEditable = false; // Desativa edição
        const index = Array.from(label.parentNode.parentNode.children).indexOf(label.parentNode);
        atualizarTexto(index, label.textContent); // Atualiza o texto
    };
}

// Função para atualizar o texto no localStorage
function atualizarTexto(index, novoTexto) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Obtém tarefas existentes
    tarefas[index].texto = novoTexto; // Atualiza o texto da tarefa
    salvarTarefas(tarefas); // Salva a lista atualizada
}

// Função para marcar/desmarcar tarefa como concluída
function toggleConclusao(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Obtém tarefas existentes
    tarefas[index].concluida = !tarefas[index].concluida; // Alterna o estado de conclusão
    salvarTarefas(tarefas); // Salva a lista atualizada
    carregarTarefas(); // Atualiza a exibição
}

// Função para excluir uma tarefa
function excluirTarefa(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Obtém tarefas existentes
    tarefas.splice(index, 1); // Remove a tarefa
    salvarTarefas(tarefas); // Salva a lista atualizada
    carregarTarefas(); // Atualiza a exibição
}
