# VelasAroma - Projeto de E-commerce Full-Stack

![Status do Projeto](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

Um e-commerce completo de velas aromáticas construído com Next.js, TypeScript e Prisma. Este projeto serve como uma demonstração de ponta a ponta das minhas competências como desenvolvedor full-stack.

![Demonstração da Aplicação](caminho/para/sua/imagem_ou_gif.gif)

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
- [Próximos Passos](#próximos-passos-roadmap)
- [Contato](#contato)

## Sobre o Projeto

O **VelasAroma** é uma simulação de uma loja virtual completa, projetada para demonstrar a implementação de funcionalidades essenciais de um e-commerce moderno. O foco foi construir uma base de código limpa, escalável, segura e bem testada, utilizando as melhores práticas do ecossistema JavaScript/TypeScript.

## Funcionalidades Implementadas

- **Autenticação de Utilizadores:**
  - Registo de conta com e-mail e senha.
  - Login com credenciais e social (GitHub).
  - Gestão de sessão com NextAuth.js.
  - Rotas protegidas para utilizadores logados e administradores.

- **Vitrine e Carrinho de Compras (Front-end):**
  - Página inicial com produtos em destaque.
  - Página de listagem de produtos com busca e paginação.
  - Página de detalhes do produto.
  - Carrinho de compras reativo e persistente com Zustand.
  - Lógica de frete condicional.

- **Área do Cliente:**
  - Página de perfil com dados do utilizador.
  - Gestão de endereços (CRUD completo).
  - Histórico de pedidos.

- **Painel de Administração:**
  - Layout protegido, acessível apenas a administradores.
  - Interface com abas para gerir diferentes partes do sistema.
  - CRUD completo para Produtos (criar, ver, editar, apagar) com formulários em modais.
  - Visualização e gestão de status de todos os pedidos.
  - Visualização de todos os utilizadores registados.

- **API Back-end:**
  - Arquitetura de serviços para uma lógica de negócio organizada.
  - Endpoints RESTful para todas as funcionalidades.
  - Validação de dados de entrada com Zod.
  - Suíte de testes automatizados com Jest para garantir a fiabilidade da API.

## Tecnologias Utilizadas

- **Front-end:** React, Next.js (App Router), TypeScript, Tailwind CSS
- **Componentes de UI:** Shadcn/UI, Lucide Icons
- **Gestão de Estado (Cliente):** Zustand
- **Back-end:** Next.js (API Routes), Node.js
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** NextAuth.js
- **Validação:** Zod
- **Testes:** Jest
- **Assets Visuais:** Canva AI

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto na sua máquina.

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Uma instância de PostgreSQL a correr

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Adriano549/e-commerce-velas.git](https://github.com/Adriano549/e-commerce-velas.git)
    ```
2.  **Navegue para a pasta do projeto:**
    ```bash
    cd e-commerce-velas
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Configuração do Ambiente

1.  **Crie o ficheiro de variáveis de ambiente:**
    Copie o ficheiro `.env.example` (se o criar) ou crie um novo ficheiro chamado `.env` na raiz do projeto.

2.  **Preencha as variáveis:**
    ```env
    DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO"
    NEXTAUTH_SECRET="GERAR_UMA_CHAVE_SECRETA_FORTE"
    NEXTAUTH_URL="http://localhost:3000"
    GITHUB_CLIENT_ID="SEU_ID_DO_GITHUB_OAUTH"
    GITHUB_CLIENT_SECRET="SEU_SECRET_DO_GITHUB_OAUTH"
    ```

### Banco de Dados

1.  **Aplique o schema ao seu banco de dados:**
    ```bash
    npx prisma db push
    ```
2.  **(Opcional) Popule o banco com dados iniciais:**
    ```bash
    npm run db:seed
    ```

### Rodando a Aplicação

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
2.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Próximos Passos (Roadmap)

Como este é um projeto em desenvolvimento, aqui estão algumas funcionalidades planeadas para o futuro:
- [ ] Integração com um gateway de pagamento de teste (ex: Stripe).
- [ ] Página de confirmação do pedido com mais detalhes.
- [ ] Envio de e-mails transacionais (confirmação de registo, confirmação de pedido).
- [ ] Filtros avançados na página de produtos (por preço, etc.).

## Contato

**[Seu Nome]**
- **LinkedIn:** [https://linkedin.com/in/SEU_USUARIO_LINKEDIN](https://www.linkedin.com/in/adriano-almeida-510a0a309/)
- **GitHub:** [https://github.com/Adriano549](https://github.com/Adriano549)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
