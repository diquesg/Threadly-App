# Thread.ly

Thread.ly é uma plataforma web moderna inspirada em redes sociais de micro-blogging. O projeto utiliza uma arquitetura full-stack, com um front-end desenvolvido em Angular (usando componentes standalone, signals e Tailwind CSS) e um back-end construído com NestJS e MongoDB. O sistema conta com recursos de comentários aninhados, gerenciamento global de estado e um layout responsivo que se adapta a diferentes tamanhos de tela.

## Features

- **Layout Responsivo: (WIP)**  
  - Header fixo no topo.  
  - Sidebar fixa à esquerda em telas maiores e oculta em telas pequenas.  
  - Área principal se ajusta dinamicamente para evitar sobreposição.

- **Comentários Aninhados:**  
  - Criação, resposta e exclusão de comentários com estrutura hierárquica.  

- **API RESTful:**  
  - Endpoints para criação, atualização, exclusão e consulta de usuários e comentários.
  
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
   ```
2. Instale as dependências:
  ```
  npm install
  ```

3. Configure as variáveis de ambiente no arquivo src/environments/environment.ts (ou equivalente):
```
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000', // URL do backend
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
npm run start
```

## Execução do Projeto

### Front-end

1. Para iniciar o servidor de desenvolvimento do Angular, execute:

```
ng serve
```

2. Acesse o projeto em: http://localhost:4200

Os endpoints da API estarão disponíveis em: http://localhost:3000

## Contribuição
Contribuições são bem-vindas! Se você deseja colaborar, por favor, abra uma issue ou envie um pull request. Certifique-se de seguir as diretrizes de contribuição e teste suas alterações.

## Licença
Este projeto é licenciado sob a MIT License.

## Agradecimentos

Agradecimento à Muhammad Ahsan Ayaz pela ideia inicial do projeto e tutorial passo a passo no youtube: https://www.youtube.com/watch?v=cAj6gzAMNfA

Inspirado por plataformas como Twitter e Threads.

Desenvolvido com Angular, NestJS, MongoDB e Tailwind CSS.



