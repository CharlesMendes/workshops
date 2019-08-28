# Aprendendo `Google Cloud Functions`
## O que é Google Cloud Functions?
É a plataforma de computação na nuvem sem servidor orientada a eventos, possibilitando escalonamento automático, dispensando provisionamento, atualização de servidores, pague somente quando seu código estiver executando

Podemos utilizar o GCF para processamento de arquivos ETL de dados em tempo real, processamento de stream, integração com API de terceiros, backend para IOT ou apps mobiles, aplicações inteligentes como chatbots, análise de video, imagem ou sentimentos

O principal fundamento no uso de microserviços, serverless, functions em geral, é não construir funções complexas, que acabam virando monolitos, dessa forma será possível desenvolver sistemas compostos por pequenas unidades de funcionalidades independentes que cada uma delas executa alguma determinada tarefa muito bem

Para saber mais:
> https://cloud.google.com/functions/

## Nosso estudo de caso
Faremos um exemplo de uma função bem simples que irá consumir uma API de terceiros, a API do Github onde será retornado dados de algum usuário informado

# Criando uma function
## Criando nosso primeiro GCF via Console
Vamos criar a estrutura básica do Package.json
> yarn init

Vamos criar uma function acessando o Console do GCP:
> https://console.cloud.google.com/projectselector2/functions

Será necessário selecionar ou criar um novo projeto, vamos criar um projeto de nome `nodejs-functions` (se pedir para ativar o Faturamento, configure seguindo as instruções da tela e volte para essa etapa)

Agora vamos clicar em `Criar Função`:
```
nome: function-github
memória: 256MB
acionador: http
execução: node.js 10 (Beta)
renomear nome da function de 'helloWorld' para 'execute'
```

Depois de alguns minutos, a function será criada

## Testando a primeira function
Clique nos 3 (...) ao selecionar a function `func-teste-console` > Testar Função
> https://us-central1-nodejs-functions.cloudfunctions.net/func-teste-console

Será exibido o retorno da chamada da nossa function exposta via API

#Configurando o SDK gcloud cli
## Baixando e instalando o SDK
Acesse o link:
> https://cloud.google.com/sdk/docs/quickstart-macos

Realize o download e instalação pelo comando:
> ./google-cloud-sdk/install.sh

Feche e abra um novo Terminal para poder usar o comando do 'gcloud'

## Inicializar o GCloud e autenticar
Abra o diretório da aplicação `nodejs-gcp` e execute o comando:
> gcloud init

Aperte `Y` e autentique com a sua conta google quando solicitado

Selecione um projeto ou crie um novo pelo console, iremos usar o projeto que criamos anteriormente o `nodejs-functions`

# Criando a função `Execute`
## Criando a função
### Estrutura básica
Criaremos uma função, com o `try/catch` para tratar o `event` inicial para `request/response`. Crie a seguinte function no arquivo `app.js`:

```js
'use strict';

module.exports.execute = (request, response) => {
  try {

    const mensagem = 'teste gcp function - charlesmendes';
    response.status(200).send(mensagem);

  } catch (error) {

    response.status(500).send(error);

  }
};
```

### Deploy
Vamos criar uma nova function, mas agora via `cli`, com a seguinte linha de comando informando o nome da function que iremos criar e o que foi definido no exports:
> gcloud functions deploy 'func-teste-cli' --runtime nodejs8 \
> -> --trigger-http --entry-point=execute

Será criado o endpoint após o deploy:
> https://us-central1-nodejs-functions.cloudfunctions.net/func-teste-cli

Pode testar no terminal via:
> curl https://us-central1-nodejs-functions.cloudfunctions.net/func-teste-cli

# Criando a função `github`
## Criando a função
### Estrutura básica
Criaremos uma função, que irá retornar a imagem de perfil de um usuário informado na query string, do github. Crie a seguinte function no arquivo `app.js`:

```js
'use strict';

// function que acessa api do github
const fetch = require('node-fetch');

function getUrlForUser(username) {
  return `https://api.github.com/users/${username}`
}

// iremos utilizar async/await devido a requisição da api
module.exports.execute = async (request, response) => {

  try {
    //atribui um username default, caso não seja informado na querystring
    const username = request.query.username || 'charlesmendes';
    const responseApi = await fetch(getUrlForUser(username));
    const responseObject = await responseApi.json()
    const avatarUrl = responseObject.avatar_url;

    response.redirect(avatarUrl); //redireciona para a url informada

  } catch (error) {

    const mensagem = {
      statusCode: 500,
      body: {
        result: {
          success: false,
          message: error.message
        }
      }
    };

    response.status(500).send(mensagem);

  }
};
```

### Deploy
Vamos criar uma nova function, mas agora via `cli`, com a seguinte linha de comando informando o nome da function que iremos criar e o que foi definido no exports:
> gcloud functions deploy 'func-teste-github' --runtime nodejs8 \
> -> --trigger-http --entry-point=execute

Será criado o endpoint após o deploy:
> https://us-central1-nodejs-functions.cloudfunctions.net/func-teste-github

Pode testar no terminal via:
> curl https://us-central1-nodejs-functions.cloudfunctions.net/func-teste-github
> curl https://us-central1-nodejs-functions.cloudfunctions.net/func-teste-github?username=jsoverson

# Cloud Scheduler (CronJobs)
## Comandos GCP
> gcloud functions event-types list

## Criando um Job
É possível agendar execuções de functions, basta acessar o Cloud Scheduler:
> https://console.cloud.google.com/cloudscheduler

Clicar em `Criar Job`, defina a região, e a frequencia de execução ex: `09**1` (toda segunda as 9h00), vide abaixo link explicando os parametros do cron:
> https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules?hl=pt_BR&_ga=2.109488133.-1804069006.1566610188&_gac=1.204694948.1566870769.EAIaIQobChMIl5jdsfih5AIVCwuRCh1bzgPwEAAYASAAEgIGhPD_BwE#defining_the_job_schedule

Em seguida, vamos criar uma nova function pelo console `func-teste-cron` atribuindo o acionador como `Cloud Pub/Sub` e criar um novo tópico `teste-topic`

```js
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = (event, context) => {
  const pubsubMessage = event.data;
  console.log(Buffer.from(pubsubMessage, 'base64').toString());
};
```
