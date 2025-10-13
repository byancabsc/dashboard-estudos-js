# 📚 Dashboard Interativo de Plano de Estudos

![Dashboard Dark Mode Roxo e Preto](https://i.imgur.com/Seu-Link-Da-Imagem-Aqui.png)
*(Substitua este link pela URL da sua imagem de demonstração!)*

Este é um projeto **autônomo** (Single-Page Application) desenvolvido em **HTML, CSS e JavaScript (Vanilla)** para auxiliar no acompanhamento e gestão de progresso em planos de estudo.

O sistema salva automaticamente todo o status e anotações do usuário no armazenamento local do navegador (`localStorage`), dispensando a necessidade de qualquer servidor ou banco de dados.

## ✨ Funcionalidades

* **Tema Dark Mode Roxo e Preto:** Interface moderna e focada.
* **Controle de Progresso Hierárquico:** Gerenciamento de Tópicos Principais e Subtópicos, com status calculado para os módulos principais.
* **Dashboard Visual Aprimorado:** Visão geral com barras de progresso mais claras, cores dinâmicas e porcentagens visíveis para cada matéria.
* **Anotações Inline:** Adicione, visualize e edite notas diretamente sob cada tópico ou subtópico (sem pop-ups/modais). O salvamento é automático (no `onblur`).
* **Gestão de Tópicos:** Ferramenta para editar a estrutura de tópicos de cada matéria diretamente na interface.
* **Gerenciamento de Dados:** Funcionalidades de **Exportar** e **Importar** o progresso completo (`.json`) para backup ou migração.
* **Botão de Menu Funcional:** Botão de **recolher/expandir menu** no canto superior direito para maximizar o espaço de tela, com posicionamento garantido via `position: absolute`.

## 🛠️ Modularização e Estrutura

O projeto foi organizado em três arquivos principais para melhor manutenção:

| Arquivo | Conteúdo |
| :--- | :--- |
| `index.html` | Estrutura principal e links para CSS/JS. **Observação:** O botão de menu foi movido para dentro do `<div class="main-content">`. |
| `style.css` | Todo o design (Dark Mode, temas de cores de status, estilos inline das anotações e regras de layout/posicionamento). |
| `script.js` | Toda a lógica: `localStorage` (persistência), gerenciamento de tópicos, cálculo de progresso (`checkMainTopicCompletion`), e as funções de toggle/salvamento inline. |

## 📐 Solução da Correção do Botão de Menu

Para garantir que o botão de toggle do menu (`.toggle-sidebar-btn`) aparecesse corretamente e não fosse encoberto pela sidebar (`.sidebar`), a seguinte correção de posicionamento foi aplicada:

1.  **No HTML (`index.html`):** O botão foi movido da tag `<body>` para dentro do container `<div class="main-content">`.
2.  **No CSS (`style.css`):**
    * O container `.main-content` recebeu `position: relative;` e teve seu `padding-top` ajustado para `0`.
    * O botão `.toggle-sidebar-btn` recebeu `position: absolute;`, `top: 15px;`, `right: 40px;` e um `z-index` alto (`9999`) para flutuar de forma garantida no canto superior direito do painel principal.

## 🚀 Como Executar o Projeto

O projeto é 100% *client-side* (executa apenas no navegador) e não requer instalação de pacotes ou servidor:

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/byancabsc/dashboard-estudos-js.git](https://github.com/byancabsc/dashboard-estudos-js.git)
    ```
2.  **Abra o Arquivo:** Navegue até a pasta e dê um **duplo clique** no arquivo `index.html`.
3.  **Hospedagem no GitHub Pages:** Você pode visualizar o projeto online gratuitamente ativando o **GitHub Pages** nas configurações do repositório, apontando para o branch `main` (ou `master`) e a pasta `/root`.

