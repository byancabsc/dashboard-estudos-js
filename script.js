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

// --- Funções de Configuração de Tópicos ---

function showTopicConfig() {
    const currentData = loadData();
    let htmlContent = '<h1>Editar Tópicos de Estudo</h1>';
    htmlContent += '<p>Adicione ou remova tópicos para cada matéria. **Cada linha é um tópico.** Use um traço inicial (<code>- Subtópico</code>) para criar uma hierarquia.</p>';
    htmlContent += '<p style="color: var(--status-not-started); font-weight: bold;">Atenção: Ao salvar, o progresso (status e notas) será perdido para QUALQUER tópico que for alterado, movido ou removido.</p>';
    
    Object.keys(currentData).forEach(key => {
        htmlContent += `
            <div class="config-area">
                <h2>${currentData[key].title}</h2>
                <textarea id="config-${key}" class="form-control" rows="10">${currentData[key].topics.join('\n')}</textarea>
                <span id="message-${key}" class="config-message"></span>
                <button class="btn-save btn-config" onclick="saveTopics('${key}')">Salvar ${currentData[key].title}</button>
                <div style="clear: both;"></div>
            </div>
        `;
    });

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
    
    oldTopics.forEach((oldTopic, oldIndex) => {
        const oldKey = `${subjectKey}-${oldIndex}`;
        const newIndex = newTopics.indexOf(oldTopic);
        
        if (newIndex !== -1) {
            const newKey = `${subjectKey}-${newIndex}`;
            newProgress[newKey + '-status'] = localStorage.getItem(oldKey + '-status') || 'Não iniciado';
            newProgress[newKey + '-notes'] = localStorage.getItem(oldKey + '-notes') || '';
        } 
        
        localStorage.removeItem(oldKey + '-status');
        localStorage.removeItem(oldKey + '-notes');
    });
    
    currentData[subjectKey].topics = newTopics;
    saveData(currentData); 

    for (const key in newProgress) {
        localStorage.setItem(key, newProgress[key]);
    }
    
    messageSpan.textContent = 'Tópicos salvos! Progresso de tópicos inalterados foi mantido.';
    setTimeout(() => messageSpan.textContent = '', 6000);
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
        showSubject(currentSubjectKey); 
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
                    <div style="font-size:1em; color:var(--overview-progress-text); font-weight: 500; margin-bottom: 8px;">
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

                subjectNotesHtml += `
                    <div class="note-block" style="background-color:var(--card-bg);
                                padding:15px;margin-bottom:15px;border-radius:8px;
                                border:1px solid var(--card-border);">
                        <div class="note-title" style="color: var(--accent-color); font-size:1.1em; margin-bottom: 5px;">
                            <strong>${subject.title}:</strong> ${cleanTopicText}
                        </div>
                        <p style="white-space: pre-wrap; font-size:0.95em; color: #ccc;">${note}</p>
                    </div>`;
            }
        });

        if (hasNotesInSubject) {
            html += `<h2 style="color: #ccc; margin-top:20px; border-bottom: 1px solid #444; padding-bottom: 5px;">${subject.title}</h2>`;
            html += subjectNotesHtml;
        }
    });

    if (totalNotes === 0) {
        html += '<p style="margin-top: 20px;">Nenhuma anotação encontrada. Adicione notas em seus tópicos de estudo.</p>';
    }

    const container = document.getElementById('subject-content'); 
    if (container) container.innerHTML = html;
    
    updateActiveLink('notes-list');
}

// Garante que o estado inicial do localStorage seja o default se for a primeira vez
if (!localStorage.getItem('studyTopics')) {
    saveData(defaultData);
}

// Carregamento inicial
document.addEventListener('DOMContentLoaded', showOverview);