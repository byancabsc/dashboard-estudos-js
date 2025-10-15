# 📚 Dashboard Interativo de Plano de Estudos

![Dashboard Light Mode Roxo e Cinza](https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/assets/sua-imagem-aqui.png)
*(Substitua este link pela URL da sua imagem de demonstração hospedada no GitHub! Lembre-se do caminho: `assets/nome-do-arquivo.png`)*

Este é um projeto **autônomo** (Single-Page Application) desenvolvido em **HTML, CSS e JavaScript (Vanilla)** para auxiliar no acompanhamento e gestão de progresso em planos de estudo.

O sistema salva automaticamente todo o status e anotações do usuário no armazenamento local do navegador (`localStorage`), dispensando a necessidade de qualquer servidor ou banco de dados.

## ✨ Funcionalidades

* **Tema Light Mode Roxo e Cinza Claro:** Interface moderna e limpa, adaptada para longas sessões de estudo.
* **Controle de Progresso Hierárquico:** Gerenciamento de Tópicos Principais e Subtópicos, com status calculado para os módulos principais.
* **Dashboard Visual Aprimorado:** Visão geral com barras de progresso claras e porcentagens visíveis para cada matéria.
* **Anotações Inline:** Adicione, visualize e edite notas diretamente sob cada tópico ou subtópico (sem pop-ups/modais). O salvamento é automático (`onblur`).
* **Gestão e Criação de Módulos:** Ferramenta para editar a estrutura de tópicos de cada matéria e **adicionar novos módulos/matérias** diretamente na interface.
* **Gerenciamento de Dados:** Funcionalidades de **Exportar** e **Importar** o progresso completo (`.json`) para backup ou migração.
* **Botão de Menu Funcional:** Botão de **recolher/expandir menu** no canto superior direito para maximizar o espaço de tela.

## 🛠️ Modularização e Estrutura

O projeto foi organizado em três arquivos principais para melhor manutenção:

| Arquivo | Conteúdo |
| :--- | :--- |
| `index.html` | Estrutura principal e links para CSS/JS. |
| `style.css` | Todo o design (Light Mode, cores, estilos de status, layout e posicionamento). |
| `script.js` | Toda a lógica: `localStorage` (persistência), gerenciamento de tópicos, cálculo de progresso, e as funções de gestão de módulos/anotações. |

## 🚀 Como Executar o Projeto

O projeto é 100% *client-side* (executa apenas no navegador) e não requer instalação de pacotes ou servidor:

1.  **Clone o Repositório:**

    ```bash
git clone [https://github.com/byancabsc/dashboard-estudos-js.git](https://github.com/byancabsc/dashboard-estudos-js.git)    ```

2.  **Abra o Arquivo:** Navegue até a pasta e dê um **duplo clique** no arquivo `index.html`.

3.  **Hospedagem no GitHub Pages:** Você pode visualizar o projeto online gratuitamente ativando o **GitHub Pages** nas configurações do repositório, apontando para o branch `main` e a pasta `/root`.
