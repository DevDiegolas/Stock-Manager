# Stock Manager 📦

Sistema web para controle de estoque com autenticação, catálogo de produtos, histórico de movimentações e suporte a fotos por produto.

> Um projeto full stack feito para organizar produtos, acompanhar entradas e saídas e manter tudo registrado de forma simples e rastreável.

## ✨ O que ele faz

- Login e cadastro de usuários com JWT 🔐
- Cadastro, edição, listagem e remoção lógica de produtos 🧾
- Controle de quantidade com motivo da movimentação 📈
- Histórico de ações por produto para auditoria 🕘
- Busca, paginação e dashboard com visão geral 🔎
- Suporte a fotos de produtos com referência por ID 🖼️

## 🧱 Stack

### Backend

- Go
- Chi Router
- PostgreSQL
- SQLx
- golang-migrate
- JWT

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Infraestrutura

- Docker Compose
- Nginx no frontend
- Variáveis de ambiente para configuração

## 🚀 Como rodar

```bash
make up
```

Comandos úteis:

```bash
make down
make build
make logs
make restart
make db-shell
```

## 🌐 Serviços

- Frontend: http://localhost:3000
- API: http://localhost:8081
- PostgreSQL: localhost:5432

## 🧭 Fluxos principais

1. Criar conta ou entrar no sistema.
2. Cadastrar produtos com informações como nome, categoria, cor, tamanho/medida, preço e quantidade.
3. Ajustar o estoque conforme vendas ou reposição, informando o motivo da alteração.
4. Acompanhar o histórico das ações para saber o que mudou e quando mudou.
5. Consultar o dashboard para ver um resumo rápido do inventário.

## 📸 Capturas do sistema

Em breve esta seção vai receber imagens e prints do sistema em funcionamento.

Por enquanto, ela fica reservada para mostrar a interface quando o projeto estiver em uma fase mais estável.

## 📝 Observações

- As migrations rodam automaticamente na inicialização do backend.
- O projeto está organizado como monorepo com backend e frontend separados.
- A base já está pronta para evoluir com novas telas e melhorias visuais.
