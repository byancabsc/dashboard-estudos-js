// Dados Estruturados Padrão
const defaultData = {
    portugues: {
        title: "Língua Portuguesa",
        topics: [
            "1 Ortografia e Acentuação",
            "- Noções Iniciais de Ortografia",
            "- Sons, Letras, Fonemas, Dígrafos -Teoria",
            "- Encontros Vocálicos - Teoria",
            "2 Classes I",
            "- Substantivos - Teoria",
            "- Adjetivo - Teoria",
            "3 Classes de Palavras II - Conectivos",
            "- Preposições e suas combinações",
            "- Conjunções Coordenativas"
        ]
    },
    constitucional: {
        title: "Direito Constitucional",
        topics: [
            "1. Teoria Geral da Constituição",
            "- Conceito de Constituição",
            "- Classificações das Constituições",
            "2. Princípios Fundamentais",
            "- Fundamentos da República (Art. 1º)",
            "- Soberania, Cidadania, Dignidade da Pessoa Humana"
        ]
    },
    administrativo: {
        title: "Direito Administrativo",
        topics: [
            "Lei 8.112/1990 (Estatuto Servidores Federais) - Parte 1: Provimento, Vacância e Movimentação",
            "- 1.1 Disposições Preliminares",
            "- 1.2 Provimento e Vacância",
            "- 1.3 Movimentação",
            "Lei 8.112/1990 (Estatuto Servidores Federais) - Parte 2: Direitos e Vantagens",
            "- 2.1 Vencimento, Remuneração e Vantagens",
            "- 2.2 Férias, Licenças e Afastamentos",
            "- 2.3 Tempo de Serviço e Direito de Petição",
            "Lei 8.112/1990 (Estatuto Servidores Federais) - Parte 3: Regime Disciplinar e Seguridade",
            "- 3.1 Regime Disciplinar - Teoria",
            "- 3.2 Processo Administrativo Disciplinar (PAD) - Teoria",
            "- 3.3 Seguridade Social do Servidor",
            "Lei nº 14.133/2021 (Nova Lei de Licitações)",
            "- Introdução, Princípios, Objetivos e Agentes",
            "- Modalidades e Critérios de Julgamento",
            "- Contratação Direta (Sem Licitação)",
            "- Fases do Processo e Instrumentos Auxiliares"
        ]
    }
};


const contentDiv = document.getElementById('subject-content');

// --- Funções de Dados e Persistência/Export/Import ---

function loadData() {
    const savedTopics = localStorage.getItem('studyTopics');
    if (savedTopics) {
        try {
            return JSON.parse(savedTopics);
        } catch(e) {
            console.error("Erro ao carregar dados do localStorage, usando dados padrão.", e);
            return defaultData;
        }
    }
    return defaultData;
}

function saveData(dataToSave) {
    localStorage.setItem('studyTopics', JSON.stringify(dataToSave));
}

function exportData() {
    const dataToExport = {
        studyTopics: loadData(),
        progress: {}
    };

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('-status') || key.includes('-notes')) {
            dataToExport.progress[key] = localStorage.getItem(key);
        }
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progresso_estudos_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Progresso exportado com sucesso! Procure pelo arquivo JSON na sua pasta de downloads.");
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);

            if (confirm("Importar dados? Isso irá substituir todo o seu progresso e tópicos atuais.")) {
                Object.keys(localStorage).forEach(key => {
                    if (key.includes('-status') || key.includes('-notes') || key === 'studyTopics') {
                        localStorage.removeItem(key);
                    }
                });

                saveData(importedData.studyTopics);

                if (importedData.progress) {
                    for (const key in importedData.progress) {
                        localStorage.setItem(key, importedData.progress[key]);
                    }
                }

                alert("Dados importados com sucesso! Recarregando a página.");
                location.reload(); 
            }
        } catch (error) {
            alert("Erro ao ler o arquivo. Certifique-se de que é um arquivo JSON de progresso válido.");
            console.error("Erro na importação:", error);
        }
    };
    reader.readAsText(file);
}

// =======================================================
// FUNÇÃO DE RENDERIZAÇÃO DA PÁGINA DE CONFIGURAÇÃO (ATUALIZADA)
// =======================================================

function showTopicConfig() {
    const currentData = loadData();
    let htmlContent = '<h1>Editar Tópicos de Estudo</h1>';
    htmlContent += '<p>Adicione ou remova tópicos para cada matéria. **Cada linha é um tópico.** Use um traço inicial (<code>- Subtópico</code>) para criar uma hierarquia.</p>';
    htmlContent += '<p style="color: var(--status-not-started); font-weight: bold;">Atenção: Ao salvar, o progresso (status e notas) será perdido para QUALQUER tópico que for alterado, movido ou removido.</p>';
    
    // 1. Geração das áreas de edição de módulos existentes
    Object.keys(currentData).forEach(key => {
        const moduleName = currentData[key].title || key.charAt(0).toUpperCase() + key.slice(1); 

        htmlContent += `
            <div class="config-area">
                <h2>${moduleName}</h2>
                <textarea id="config-${key}" class="form-control" rows="10">${currentData[key].topics.join('\n')}</textarea>
                <span id="message-${key}" class="config-message"></span>
                <button class="btn-save btn-config" onclick="saveTopics('${key}')">Salvar ${moduleName}</button>
                <button class="btn-delete btn-config" onclick="deleteModule('${key}', '${moduleName}')" style="margin-left: 10px;">Excluir Módulo</button>
                <div style="clear: both;"></div>
            </div>
        `;
    });

    // 2. SEÇÃO DE CRIAÇÃO DE NOVOS MÓDULOS
    htmlContent += `
        <div class="new-module-creator config-area">
            <h2>Criar Novo Módulo</h2>
            <p class="config-message-info">Insira o nome do novo Módulo/Matéria.</p>
            <div class="module-input-group">
                <input type="text" id="new-module-name" placeholder="Ex: Direito do Trabalho, Matemática Avançada, etc." class="config-input-text">
                <button id="btn-create-module" class="btn-save btn-config" onclick="createNewModule()">Adicionar Módulo</button>
            </div>
            <span id="module-creation-feedback" class="config-message"></span>
        </div>
    `;

    contentDiv.innerHTML = htmlContent;
    updateActiveLink('config');
}

function saveTopics(subjectKey) {
    const textArea = document.getElementById(`config-${subjectKey}`);
    const messageSpan = document.getElementById(`message-${subjectKey}`);
    const newTopics = textArea.value.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    
    const currentData = loadData();
    const oldTopics = currentData[subjectKey].topics;
    
    const newProgress = {};
    
    // Mapeia o progresso existente para a nova lista de tópicos
    oldTopics.forEach((oldTopic, oldIndex) => {
        const oldKey = `${subjectKey}-${oldIndex}`;
        const newIndex = newTopics.indexOf(oldTopic);
        
        if (newIndex !== -1) {
            const newKey = `${subjectKey}-${newIndex}`;
            newProgress[newKey + '-status'] = localStorage.getItem(oldKey + '-status') || 'Não iniciado';
            newProgress[newKey + '-notes'] = localStorage.getItem(oldKey + '-notes') || '';
        } 
        
        // Remove dados antigos
        localStorage.removeItem(oldKey + '-status');
        localStorage.removeItem(oldKey + '-notes');
    });
    
    currentData[subjectKey].topics = newTopics;
    saveData(currentData); 

    // Salva o progresso mapeado
    for (const key in newProgress) {
        localStorage.setItem(key, newProgress[key]);
    }
    
    messageSpan.textContent = 'Tópicos salvos! Progresso de tópicos inalterados foi mantido.';
    setTimeout(() => messageSpan.textContent = '', 6000);
}

// =======================================================
// NOVAS FUNÇÕES PARA ADIÇÃO E EXCLUSÃO DE MÓDULOS
// =======================================================

function createNewModule() {
    const newModuleNameInput = document.getElementById('new-module-name');
    const feedbackSpan = document.getElementById('module-creation-feedback');
    const newModuleName = newModuleNameInput.value.trim();

    if (!newModuleName) {
        feedbackSpan.textContent = "Por favor, insira um nome para o novo módulo.";
        feedbackSpan.style.color = 'var(--status-not-started)';
        return;
    }

    const currentData = loadData();
    
    // Cria uma chave segura (sem acentos e minúscula)
    const moduleKey = newModuleName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, ''); 

    // Checar duplicidade de chave
    if (currentData.hasOwnProperty(moduleKey)) {
        feedbackSpan.textContent = `O módulo "${newModuleName}" já existe.`;
        feedbackSpan.style.color = 'var(--status-not-started)';
        return;
    }

    // Adiciona o novo módulo com o nome original
    currentData[moduleKey] = {
        title: newModuleName,
        topics: ["- Novo tópico aqui. Clique em Salvar para editá-lo."],
    };
    
    saveData(currentData); 
    
    feedbackSpan.textContent = `Módulo "${newModuleName}" adicionado com sucesso! Recarregando...`;
    feedbackSpan.style.color = 'var(--status-completed)';

    // Recarrega a página para atualizar a sidebar e a lista de configurações
    setTimeout(() => {
        window.location.reload(); 
    }, 1500);
}

function deleteModule(subjectKey, moduleName) {
    if (confirm(`Deseja realmente excluir o módulo "${moduleName}"? Isso apagará TODOS os tópicos e o progresso salvo!`)) {
        const currentData = loadData();
        
        // 1. Remove do objeto de dados
        delete currentData[subjectKey];
        saveData(currentData);
        
        // 2. Remove todo o progresso associado a essa chave no localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(subjectKey + '-')) {
                localStorage.removeItem(key);
            }
        });

        alert(`Módulo "${moduleName}" excluído com sucesso! Recarregando...`);
        window.location.reload(); 
    }
}


// --- Funções de Visualização e Lógica de Subtópicos ---

function checkMainTopicCompletion(subjectKey, topicIndex) {
    const currentData = loadData();
    const topics = currentData[subjectKey].topics;
    
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    let inProgress = false;
    
    let i = topicIndex + 1;
    while(i < topics.length && topics[i].startsWith('-')) {
        const saveId = `${subjectKey}-${i}`; 
        const status = localStorage.getItem(saveId + '-status') || 'Não iniciado';
        
        totalSubtopics++;
        
        if (status === 'Concluído') {
            completedSubtopics++;
        }
        if (status === 'Em andamento') {
            inProgress = true;
        }
        i++;
    }
    
    if (totalSubtopics === 0) {
        const saveId = `${subjectKey}-${topicIndex}`;
        return localStorage.getItem(saveId + '-status') || 'Não iniciado';
    }

    if (completedSubtopics === totalSubtopics) {
        return 'Concluído';
    }
    if (completedSubtopics > 0 || inProgress) {
        return 'Em andamento';
    }
    return 'Não iniciado'; 
}

function showSubject(subjectKey) {
    const currentData = loadData();
    const subjectData = currentData[subjectKey];
    if (!subjectData) return;

    let htmlContent = `<h1>${subjectData.title}</h1>`;
    
    subjectData.topics.forEach((topicText, index) => {
        const topicId = `${subjectKey}-${index}`;
        const isSubtopic = topicText.startsWith('-');
        const cleanTopicText = isSubtopic ? topicText.substring(1).trim() : topicText.trim();
        const saveId = topicId; 
        
        let isSimpleTopic = !isSubtopic; 
        if (!isSubtopic) {
            let nextIndex = index + 1;
            let hasSubtopics = false;
            while(nextIndex < subjectData.topics.length && subjectData.topics[nextIndex].startsWith('-')) {
                hasSubtopics = true;
                break;
            }
            isSimpleTopic = !hasSubtopics;
        }

        if (!isSubtopic && index > 0) {
            htmlContent += '</div>'; // Fecha a subtopic-area do tópico anterior
            htmlContent += '</div>'; // Fechar o main-topic-container anterior
        }


        if (!isSubtopic) {
            // Lógica para TÓPICOS PRINCIPAIS (ABERTURA DO NOVO BLOCO)
            let topicStatus = checkMainTopicCompletion(subjectKey, index); 
            
            let statusClass = '';
            let borderColor = 'var(--card-border)';
            
            if (topicStatus === 'Concluído') {
                statusClass = 'status-concluido';
                borderColor = 'var(--status-completed)';
            } else if (topicStatus === 'Em andamento') {
                statusClass = 'status-em-andamento';
                borderColor = 'var(--status-in-progress)';
            } else {
                statusClass = 'status-nao-iniciado';
                borderColor = 'var(--status-not-started)';
            }
            
            const simpleStatus = localStorage.getItem(saveId + '-status') || 'Não iniciado';
            const hasNote = localStorage.getItem(saveId + '-notes');

            let statusHtmlBlock = '';
            
            if (isSimpleTopic) {
                statusHtmlBlock = `
                    <div class="topic-status" style="display:flex; align-items:center;">
                        <span 
                            id="${saveId}-display" 
                            class="topic-status-display ${statusClass}"
                            onclick="toggleStatusSelect('${saveId}')">
                            ${simpleStatus}
                        </span>
                        <select id="${saveId}-select" style="display: none;" onchange="saveTopicProgress('${saveId}', true)">
                            <option value="Não iniciado" ${simpleStatus === 'Não iniciado' ? 'selected' : ''}>Não iniciado</option>
                            <option value="Em andamento" ${simpleStatus === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                            <option value="Concluído" ${simpleStatus === 'Concluído' ? 'selected' : ''}>Concluído</option>
                        </select>
                    </div>
                `;
            } else {
                statusHtmlBlock = `<span class="topic-status-display ${statusClass}">${topicStatus}</span>`;
            }
            
            const noteButtonHtml = `<button class="btn-note ${hasNote ? 'has-note' : ''}" onclick="toggleNoteArea('${saveId}', '${cleanTopicText}')">📝 Nota</button>`;

            // Abre um novo container principal
            htmlContent += `
                <div class="main-topic-container" style="border-left-color: ${borderColor};">
                    <div class="main-topic-header" id="${topicId}-header">
                        <div class="main-topic-title">${cleanTopicText}</div>
                        <div class="subtopic-controls">
                            ${noteButtonHtml}
                            ${statusHtmlBlock}
                        </div>
                    </div>
                    
                    <div class="note-input-area ${hasNote ? '' : 'hidden'}" id="${saveId}-note-area">
                        <label for="${saveId}-note-textarea" style="color:var(--accent-color);">Anotações de ${cleanTopicText}:</label>
                        <textarea 
                            id="${saveId}-note-textarea" 
                            onblur="saveInlineNote('${saveId}')" 
                            placeholder="Digite suas anotações aqui. O salvamento é automático ao sair do campo."></textarea>
                    </div>

                    <div class="subtopic-area" id="${topicId}-subarea">
            `;
            
        } else if (isSubtopic) {
            // Lógica para SUBTÓPICOS (Inclusão dentro do bloco aberto)
            
            const savedStatus = localStorage.getItem(saveId + '-status') || 'Não iniciado';
            const hasNote = localStorage.getItem(saveId + '-notes');

            let statusClass = '';
            if (savedStatus === 'Não iniciado') {
                statusClass = 'status-nao-iniciado';
            } else if (savedStatus === 'Em andamento') {
                statusClass = 'status-em-andamento';
            } else {
                statusClass = 'status-concluido';
            }
            
            const noteButtonHtml = `<button class="btn-note ${hasNote ? 'has-note' : ''}" onclick="toggleNoteArea('${saveId}', '${cleanTopicText}')">📝 Nota</button>`;


            htmlContent += `
                <div class="subtopic-item-wrapper">
                    <div class="subtopic-item" id="${saveId}-item">
                        <div class="subtopic-title">${cleanTopicText}</div>
                        <div class="subtopic-controls">
                            ${noteButtonHtml}
                            <span 
                                id="${saveId}-display" 
                                class="topic-status-display ${statusClass}"
                                onclick="toggleStatusSelect('${saveId}')">
                                ${savedStatus}
                            </span>
                            <select id="${saveId}-select" style="display: none;" onchange="saveTopicProgress('${saveId}', true)">
                                <option value="Não iniciado" ${savedStatus === 'Não iniciado' ? 'selected' : ''}>Não iniciado</option>
                                <option value="Em andamento" ${savedStatus === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                                <option value="Concluído" ${savedStatus === 'Concluído' ? 'selected' : ''}>Concluído</option>
                            </select>
                        </div>
                    </div>
                    <div class="note-input-area ${hasNote ? '' : 'hidden'}" id="${saveId}-note-area">
                        <label for="${saveId}-note-textarea" style="font-style: italic;">Anotação:</label>
                        <textarea 
                            id="${saveId}-note-textarea" 
                            onblur="saveInlineNote('${saveId}')" 
                            placeholder="Digite suas anotações aqui. O salvamento é automático ao sair do campo."></textarea>
                    </div>
                </div>
            `;
        }
    });
    
    if (subjectData.topics.length > 0) {
        htmlContent += '</div>'; 
        htmlContent += '</div>'; 
    }

    contentDiv.innerHTML = htmlContent;
    updateActiveLink(subjectKey);
}

function toggleStatusSelect(saveId) {
    const select = document.getElementById(saveId + '-select');
    const display = document.getElementById(saveId + '-display');
    
    if (select && display) {
        if (select.style.display === 'none') {
            select.style.display = 'inline-block';
            display.style.display = 'none';
        } else {
            select.style.display = 'none';
            display.style.display = 'inline-block';
        }
    }
}

function saveTopicProgress(saveId, saveOnlyStatus) {
    const selectElement = document.getElementById(saveId + '-select');

    if (selectElement) { 
        localStorage.setItem(saveId + '-status', selectElement.value);
    } 
    
    alert('Progresso salvo com sucesso!');

    const currentSubjectKey = saveId.substring(0, saveId.indexOf('-'));
    showSubject(currentSubjectKey);
}

// --- Funções de Anotação e Toggle Inline ---

function toggleNoteArea(saveId, topicName) {
    const area = document.getElementById(saveId + '-note-area');
    const noteTextarea = document.getElementById(saveId + '-note-textarea');
    const hasNote = localStorage.getItem(saveId + '-notes');

    if (area.classList.contains('hidden')) {
        area.classList.remove('hidden');
        noteTextarea.value = hasNote || '';
        noteTextarea.focus();
    } else {
        area.classList.add('hidden');
    }
}

function saveInlineNote(saveId) {
    const noteTextarea = document.getElementById(saveId + '-note-textarea');
    if (!noteTextarea) return;

    const newNote = noteTextarea.value.trim();
    const oldNote = localStorage.getItem(saveId + '-notes');
    
    localStorage.setItem(saveId + '-notes', newNote);

    const currentStatus = localStorage.getItem(saveId + '-status');
    if (newNote && currentStatus === 'Não iniciado') {
        localStorage.setItem(saveId + '-status', 'Em andamento');
    }
    
    if (newNote !== oldNote) {
        const currentSubjectKey = saveId.substring(0, saveId.indexOf('-'));
        // Recarregar o assunto para atualizar o status/botão de nota
        showSubject(currentSubjectKey); 
    }
}

// =========================================================================
// FUNÇÕES DE EDIÇÃO E EXCLUSÃO DE NOTAS (PÁGINA TODAS AS ANOTAÇÕES)
// =========================================================================

function showAllNotes() {
    const data = loadData();
    let html = '<h1>Todas as Anotações</h1>';
    let totalNotes = 0;

    Object.keys(data).forEach(subjectKey => {
        const subject = data[subjectKey];
        let hasNotesInSubject = false;
        let subjectNotesHtml = '';
        
        subject.topics.forEach((topicText, index) => {
            const saveId = `${subjectKey}-${index}`;
            const note = localStorage.getItem(saveId + '-notes');

            if (note && note.trim() !== '') {
                hasNotesInSubject = true;
                totalNotes++;
                const isSubtopic = topicText.startsWith('-');
                const cleanTopicText = isSubtopic
                    ? topicText.substring(1).trim()
                    : topicText.trim();
                
                // O TÍTULO É AGORA UM INPUT EDITÁVEL
                subjectNotesHtml += `
                    <div class="note-block" id="note-block-${saveId}">

                        <div class="note-header-controls">
                            <div style="flex-grow: 1; margin-right: 20px;">
                                <label class="note-section-label">Módulo: ${subject.title}</label>
                                <input type="text" id="note-title-${saveId}" 
                                    class="note-title-input"
                                    value="${cleanTopicText}" 
                                    placeholder="Título do Tópico">
                            </div>
                            <button class="btn-save btn-save-note" 
                                    onclick="saveFullNote('${subjectKey}', ${index}, '${saveId}')">
                                Salvar
                            </button>
                        </div>
                        
                        <label for="note-content-${saveId}" class="note-section-label">Conteúdo da Anotação:</label>
                        <textarea id="note-content-${saveId}" 
                            class="note-content-textarea"
                        >${note}</textarea>

                        <div class="note-actions-footer">
                             <button class="btn-delete-note" 
                                    onclick="deleteNote('${saveId}')">
                                Excluir Nota
                            </button>
                        </div>
                    </div>
                `;
            }
        });

        // Adiciona o título do módulo se houver notas para ele
        if (subjectNotesHtml) {
             html += `<h2 style="color: var(--text-color-dark); margin-top:20px; border-bottom: 1px solid var(--card-border); padding-bottom: 5px;">${subject.title}</h2>`;
            html += subjectNotesHtml;
        }
    });

    if (totalNotes === 0) {
        html += '<p style="margin-top: 20px; color: var(--text-color-light);">Nenhuma anotação encontrada. Adicione notas em seus tópicos de estudo para vê-las aqui.</p>';
    }

    const container = document.getElementById('subject-content'); 
    if (container) container.innerHTML = html;
    
    updateActiveLink('notes-list');
}

/**
 * Salva o conteúdo da nota e, opcionalmente, atualiza o nome do tópico no defaultData.
 */
function saveFullNote(subjectKey, topicIndex, saveId) {
    const newTitle = document.getElementById(`note-title-${saveId}`).value.trim();
    const newContent = document.getElementById(`note-content-${saveId}`).value.trim();
    
    // 1. Salva o novo conteúdo da nota no localStorage
    localStorage.setItem(saveId + '-notes', newContent);
    
    // 2. Atualiza o título do tópico, se tiver mudado
    const currentData = loadData();
    const oldTopicText = currentData[subjectKey].topics[topicIndex];
    
    // Verifica se o tópico era um subtópico para manter o prefixo '-'
    const prefix = oldTopicText.startsWith('-') ? '- ' : '';
    const newTopicTextWithPrefix = prefix + newTitle;
    
    if (oldTopicText !== newTopicTextWithPrefix) {
        // Se o título mudou, atualiza o array de tópicos
        currentData[subjectKey].topics[topicIndex] = newTopicTextWithPrefix;
        saveData(currentData);
        alert('Nota e Título do Tópico atualizados com sucesso! (Pode ser necessário recarregar a página para ver a mudança no menu de Configurações)');
    } else {
        alert('Nota atualizada com sucesso!');
    }
    
    // Recarrega a lista de notas para refletir as mudanças
    showAllNotes();
}

/**
 * Exclui a nota (conteúdo e status) e recarrega a página.
 */
function deleteNote(saveId) {
    if (confirm("Tem certeza que deseja EXCLUIR esta anotação? O status do tópico será resetado para 'Não iniciado'.")) {
        localStorage.removeItem(saveId + '-notes');
        localStorage.removeItem(saveId + '-status'); 
        alert('Anotação excluída com sucesso.');
        showAllNotes(); // Recarrega a lista
    }
}


// --- Funções Auxiliares de Navegação e Visão Geral (Dashboard Aprimorado) ---
function showOverview() {
    const currentData = loadData();
    let html = '<h1>Visão Geral</h1><p>Acompanhe o progresso de seus módulos principais aqui.</p>';
    
    Object.keys(currentData).forEach(key => {
        const subject = currentData[key];
        let totalMainTopics = 0;
        let completedMainTopics = 0;
        
        subject.topics.forEach((topicText, index) => {
            if (!topicText.startsWith('-')) {
                const status = checkMainTopicCompletion(key, index);
                
                if (topicText.trim().length > 0) { 
                    totalMainTopics++;
                    if(status === 'Concluído') {
                        completedMainTopics++;
                    }
                }
            }
        });
        
        const percentage = totalMainTopics > 0 ? ((completedMainTopics / totalMainTopics) * 100).toFixed(0) : 0;
        
        const mainColor = percentage == 100 ? 'var(--overview-completed-fill)' : 'var(--overview-progress-bar-fill)';
        const headerBg = percentage == 100 ? 'var(--overview-completed-bg)' : 'var(--overview-header-bg)';
        const progressBg = 'var(--overview-progress-bar-bg)';

        html += `
            <div class="main-topic-container" style="border-left-color: ${mainColor}; margin-bottom: 25px;">
                <div class="main-topic-header" style="background-color: ${headerBg}; padding: 18px 20px;">
                    <div class="main-topic-title">${subject.title}</div>
                </div>
                
                <div style="padding: 15px 20px;">
                    <div style="font-size:1em; color:var(--text-color-dark); font-weight: 500; margin-bottom: 8px;">
                        ${completedMainTopics} de ${totalMainTopics} tópicos concluídos
                    </div>
                    
                    <div style="height: 8px; background-color: ${progressBg}; border-radius: 4px; overflow: hidden;">
                       <div style="width: ${percentage}%; height: 8px; background-color: ${mainColor}; border-radius: 4px;"></div>
                    </div>
                    
                    <div style="text-align: right; font-size: 0.9em; color: ${mainColor}; font-weight: 600; margin-top: 5px;">
                        ${percentage}%
                    </div>
                </div>
            </div>
        `;
    });

    contentDiv.innerHTML = html;
    updateActiveLink(null);
}

function updateActiveLink(subjectKey) {
    document.querySelectorAll('.sidebar-menu a').forEach(a => {
        a.classList.remove('active');
    });
    if (subjectKey === 'config') {
        document.querySelector('[onclick="showTopicConfig()"]').classList.add('active');
    } else if (subjectKey === null) {
        document.querySelector('[onclick="showOverview()"]').classList.add('active');
    } else if (subjectKey === 'notes-list') { 
        document.querySelector('[onclick="showAllNotes()"]').classList.add('active');
    } else {
        const activeLink = document.querySelector(`[onclick="showSubject('${subjectKey}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        body.classList.remove('sidebar-hidden');
    } else {
        sidebar.classList.add('hidden');
        body.classList.add('sidebar-hidden');
    }
}

// Garante que o estado inicial do localStorage seja o default se for a primeira vez
if (!localStorage.getItem('studyTopics')) {
    saveData(defaultData);
}

// Carregamento inicial
document.addEventListener('DOMContentLoaded', showOverview);
