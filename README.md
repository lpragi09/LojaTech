# Projeto Loja Tech - Desenvolvimento Web

Este projeto é uma aplicação web para gerenciamento de usuários e produtos, desenvolvida como requisito avaliativo da disciplina. O sistema consome a API pública dummyjson.com e implementa validações de formulário rigorosas.

## 👥 Integrantes do Grupo
* [Luiz Paulo M Ragi]

## 🚀 Funcionalidades
1.  **Página Inicial:** Apresentação da loja.
2.  **Gestão de Usuários:**
    * Listagem via API.
    * Adição de novos usuários com validação (Nome, Email, Idade).
    * Remoção de usuários da lista visual.
3.  **Gestão de Produtos:**
    * Listagem via API.
    * Adição de produtos com validação (Preço, Títulos, URL).
    * Remoção de produtos.

## 🛠 Tecnologias Utilizadas
* HTML5
* CSS3 (Estilização responsiva e variáveis CSS)
* JavaScript (ES6+, Fetch API, RegEx)

## 📋 Regras de Validação Implementadas
* **Campos de Texto:** Mínimo 3 e máximo 50 caracteres.
* **Email:** Validação via RegEx complexa.
* **Numéricos (Idade/Preço):** Devem ser positivos e menores que 120.
* **Imagens:** URL válida (opcional).

