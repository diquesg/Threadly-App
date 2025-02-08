# Thread.ly

Thread.ly é uma plataforma web moderna inspirada em redes sociais como Twitter e Threads. O projeto utiliza uma arquitetura full-stack, com um front-end desenvolvido em Angular (usando componentes standalone, signals e Tailwind CSS) e um back-end construído com NestJS e MongoDB. O sistema conta com recursos de comentários aninhados, gerenciamento global de estado e um layout responsivo que se adapta a diferentes tamanhos de tela.

## Features

- **Layout Responsivo:**  
  - Header fixo no topo.  
  - Sidebar fixa à esquerda em telas maiores e oculta em telas pequenas.  
  - Área principal (main) que se ajusta dinamicamente para evitar sobreposição.

- **Comentários Aninhados:**  
  - Criação, resposta e deleção de comentários com estrutura hierárquica.  
  - Atualização global dos comentários utilizando um serviço de store (com signals e BehaviorSubjects).

- **API RESTful:**  
  - Endpoints para criação, atualização, deleção e consulta de usuários e comentários.
  
- **Estilização com Tailwind CSS:**  
  - Layout moderno e personalizável utilizando classes utilitárias.

## Tech Stack

- **Front-end:**  
  - Angular (standalone components, signals, RxJS)  
  - Tailwind CSS

- **Back-end:**  
  - NestJS  
  - MongoDB com Mongoose

- **Ferramentas e Outros:**  
  - Node.js  
  - Possivelmente Vite (dependendo da configuração do projeto)

## Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Angular CLI](https://angular.io/cli)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- Uma instância do MongoDB (local ou remota)

### Front-end

1. Clone o repositório:

   ``` 
   git clone https://github.com/seu-usuario/threadly.git
   cd threadly
2. Instale as dependências:
  ```
  npm install
  ```

3. Configure as variáveis de ambiente no arquivo src/environments/environment.ts (ou equivalente):
```

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000', // URL do backend
  randomUserApiUrl: 'https://api.example.com/random-user', // API para gerar nomes aleatórios
  randomIconApiUrl: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=' // API para gerar avatares
};
```

### Back-end

1. Navegue até a pasta do back-end (threads-be):
```
cd threads-be
```

2. Instale as dependências:
```
npm install
```

3. Configure as variáveis de ambiente (crie um arquivo .env):
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/threadly
```

4. Inicie o servidor:
```
npm run start:dev
```

## Execução do Projeto

### Front-end

1. Para iniciar o servidor de desenvolvimento do Angular, execute:

```
ng serve
```

2. Acesse o projeto em: http://localhost:4200

### Back-end

Certifique-se de que o MongoDB esteja em execução e inicie o servidor NestJS:
```
npm run start:dev
```

Os endpoints da API estarão disponíveis em: http://localhost:3000

## Endpoints da API
### Usuários
POST /users: Cria um novo usuário.
GET /users/:id: Retorna os dados de um usuário pelo ID.
### Comentários
GET /comments: Retorna todos os comentários.
GET /comments/:id: Retorna um comentário específico pelo ID.
POST /comments: Cria um novo comentário.
DELETE /comments/:id: Remove um comentário pelo ID.
PUT /comments/:id: Atualiza um comentário pelo ID.

Consulte a documentação do back-end para detalhes sobre payloads e respostas.

## Atualização Global dos Comentários
O estado dos comentários é gerenciado globalmente através de um serviço (CommentStoreService) que utiliza um BehaviorSubject (ou signals) para manter a lista de comentários.
Quando um comentário é adicionado ou removido (em qualquer nível – pai ou filho), o serviço atualiza o estado global, e todos os componentes inscritos são automaticamente notificados e atualizados.

Exemplo de deleção de comentário no front-end (em um componente de comentário):
```
deleteComment(commentId: string) {
  this.commentService.deleteComment(commentId).subscribe({
    next: () => {
      console.log("Comentário deletado com sucesso.");
      // Atualiza o estado global removendo o comentário deletado
      this.commentStoreService.removeComment(commentId);
    },
    error: (error) => {
      console.error("Erro ao deletar o comentário: ", error);
    }
  });
}
```
Contribuição
Contribuições são bem-vindas! Se você deseja colaborar, por favor, abra uma issue ou envie um pull request. Certifique-se de seguir as diretrizes de contribuição e teste suas alterações.

Licença
Este projeto é licenciado sob a MIT License.

Agradecimentos
Agradecimento à Muhammad Ahsan Ayaz pela ideia inicial do projeto e tutorial passo a passo no youtube: https://www.youtube.com/watch?v=cAj6gzAMNfA
Inspirado por plataformas como Twitter e Threads.
Desenvolvido com Angular, NestJS, MongoDB e Tailwind CSS.
Agradecimentos a todos os colaboradores e à comunidade open-source.


