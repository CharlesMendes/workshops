# workshops
Projeto de estudos em Workshops na FCamara:
> https://www.sympla.com.br/workshop-iniciando-com-nodejs-criando-uma-api-rest-com-conexao-no-mongodb__569772
> https://www.meetup.com/pt-BR/FCTech/events/263462249/

## Passo a Passo
- Criar o projeto
  - npm init
  
- Configurar o compilador do Typescript
  - entry point: server.ts

- instalar componentes
  - npm install -g typescript
  - npm install typescript
  - npm install express
  - npm install mongoose
  - npm install body-parser
  - npm install @types/express @types/node ts-node type -D
  - npm install @types/mongoose -D
  - npm install @types/body-parser -D

- criar diretorio 'server'
  - criar os seguintes arquivos:
    - touch app.ts
    - touch server.ts

- no arquivo 'server/app.ts', vamos criar os métodos para definir as rotas
- no arquivo 'server/server.ts', vamos configurar a inicialiação do app
- configurar o atalho no 'package.json' o 'start' para rodar via comando 'npm start'
  - npm start
  - http://localhost:3000/

- vamos configurar o MongoDB
  - mongo ds143181.mlab.com:43181/fcamara-nodejs -u u-fcamara-nodejs -p senha123
  - mongodb://u-fcamara-nodejs:senha123@ds143181.mlab.com:43181/fcamara-nodejs
  - criar schema model
  - realizar conexao com BD
  - criar controller


## instruções
http://dontpad.com/jakeliny
https://httpstatusdogs.com/

### Instalação: 
https://www.meetup.com/pt-BR/FCTech/events/263462249/


https://medium.com/nerdzao/crie-uma-api-restful-em-nodejs-para-gerenciar-seus-crushs-c4c74c3db96e


api de crush: https://crush-management.herokuapp.com/api/crushs


Windows:
"start": "set NODE_ENV=development && [c:// .... ]/node_modules/.bin/ts-node ./server/server.ts"

Linux
"start": "NODE_ENV=development ./node_modules/.bin/ts-node ./server/server.ts"

### Módulos:
npm install express
npm install -g typescript
npm install typescript
npm install  @types/express @types/node ts-node type -D


### Site da Jak
http://jakeliny.com.br

Configurar variável de ambiente no Windows (7 ou superior)

> https://udgwebdev.com/node-js-para-leigos-instalacao-e-configuracao/


