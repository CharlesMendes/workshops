# Aprendendo `Serverless`
## O que é serverless?
Serverless é um tipo de servidor que hospeda apenas uma funcionalidade sem se preocupar com a parte de deploy e infra, pois é tudo automatizado, é baseado em eventos

É recomendado colocar aplicações simples, que não exigem socket, tempo real etc... muita gente usa Serverless de maneira errada

## Nosso estudo de caso
Faremos um exemplo de quando for realizado um upload de uma imagem no S3 (bucket da AWS), irá disparar uma função que irá converter em um formato mais otimizado (jpg), iremos redimensionar a imagem padronizando, independente da imagem que foi carregada inicialmente (iremos tratar png e jpg na entrada)

# Criando uma função Serverless
## Providers (serverless.com)
Existem multiplos providers que rodam serverless, ex:
- GCP
- AWS
- Azure
- entre outros

Cada provider usa sua forma de trabalho e linguagem especifica, para facilitar o nosso trabalho, iremos usar o framework que facilita a maneira de configurar o serverless independente do provider, facilitando a opção futuramente de migrar uma função para outro provider, para isso, iremos trabalhar com o: www.serverless.com

## Criando nosso primeiro serverless
Vamos criar um serverless usando o template para aws com nodejs, indicando o path (diretório da app), nesse caso pode ser qualquer nome, usaremos o 'serverless-aws' como exemplo:
> serverless create --template aws-nodejs --path serverless-aws

Vamos criar a estrutura básica do Package.json
> npm init -y

Serão criados 2 arquivos:
- serverless.yml
  - basicamente é o arquivo de configurações, assim como o nome do serviço (deve ser um nome único), e a indicação do provider e versão runtime do nodejs que iremos usar (atualmente a 10.x) e outras configurações como functions e indicar `region: sa-east-1` como `São Paulo`

- handler.js
  - é o arquivo que foi criado inicialmente, onde iremos criar a nossa função. Como boa prática iremos dar um nome de 'negócio', renomeei para `optimize.js` pois iremos otimizar uma imagem, e dentro deste arquivo renomeamos a função hello para `execute`

## Configurando as credenciais
Acesse o painel da AWS e o Service IAM (controlar os acessos aos recursos)

Crie um novo usuário e em `anexar politicas existentes` colocar como `Administrador`

Será gerada uma ID chave de acesso e uma chave secreta, rode o seguinte comando, será realizada a configuração:
> serverless config credentials -o --provider aws --key=[SUA_KEY] --secret=[SUA_SECRET]

## Primeiro deploy
Após isso, pode executar o primeiro deploy, será gerado um package do seu serviço e criado o proceso de deploy no `CloudFormation` na AWS, criação de um `Bucket S3` para armazenar o serviço e a função serverless, além do upload para dentro do S3. Faremos o deploy `verboso` para visualizarmos todo o processo:
> serverless deploy -v

## Invocara função
Vamos acessar o serviço `AWS Lambda`e dentro dele iremos gerenciar as funções e ver a função hello que foi criada, e em Monitoramento não existirá nenhum dado invocado disponível, pois ela nunca foi disparada.
Podemos acessar uma função serverless via http outra forma é em uma arquitetura baseada em eventos (nosso caso nesse case). Iremos invocar a função `hello`:

> serverless invoke -f hello -l

Foi chamada a função

## Remover um Serverless
Para apagar o serverless, basta executar o comando abaixo (iremos realizar varias alterações)
> serverless remove

# Criando a função `Optimize`
## Configurando o serverless
- Vamos alterar a região para São Paulo
- Definir nome do serviço, deve ser único
- Especificar tamanho da memória multiplo de 2, iremos por `256` MB
- Usaremos o `iamRoleStatements` para indicar as permissões que essa função esta autorizada a utilizar, nesse caso iremos:
  - Permitir a ação de acessar o `s3:GetObject`, poderemos buscar as informações do que existe no bucket e iremos definir o `s3:PutObject` para nossa app gravar a nova imagem no S3
  - Indicaremos o `Resource` ou seja, qual bucket teremos acesso, iremos liberar acesso completo a todos os buckets com o `*`
- Já na function, iremos definir o nome que iremos utilizar para o `invoke`, trocamos o `hello` para `optimize.execute`
- Definimos também as variáveis de ambiente, como: `bucket` para definir o nome do nosso bucket como `charlesmendes-serverless-aws`
- Definimos o evento que irá disparar a function nesse caso, o `s3:ObjectCreated:*` e o prefixo que é o diretório que iremos monitorar `uploads` e o sufixo que é a extenção `png` e `jpg`

## Criando a função
### Estrutura básica
Criaremos uma função `async`, com o `try/catch` para tratar o `event` inicial para `records` que ira tratar quando chegarem arquivos multiplos simultaneamente, teremos a possibilidade de controlar/percorrer esses `records` com o `map`, para cada elemento, teremos um `await` para aguardar a finalização de cada arquivo que foi criado no bucket, e se deu tudo certo, daremos um retorno `statusCode: 301`

```js
'use strict';
const AWS = require('aws-sdk');

module.exports.execute = async ({ Records: records }, context) => {
    try {
        await Promise.all(records.map(async record => { }));

        return {
            statusCode: 201,
            body: {}
        }
    } catch (error) {
        return error;
    }
};
```
### Acessando dados de cada um dos `Records` (imagens)
Iremos acessar a imagem que foi criada no bucket, da seguinte forma:
```js
'use strict';

const AWS = require('aws-sdk');

const S3 = new AWS.S3(); // basicamente o SDK/API para acessar o AWS S3

module.exports.execute = async ({
  Records: records
}, context) => {
  try {
    // iremos operar de forma assincrona e para ele aguardar ele finalizar
    // teremos que er um await e irá retornar uma promise para ser resolvida,
    // quando tudo terminar, ele retorna para o usuário
    await Promise.all(records.map(async record => {

      // visualizar o conteúdo de cara `record`
      console.log(record);

      // é o caminho completo da imagem dentro do S3 (referencia da imagem e
      // não a imagem em si)
      const {
        key
      } = record.s3.object;

      // captura a imagem que esta no bucket, não é necessário informar credenciais
      // pois ja esta rodando dentro do bucket que tem a credencial
      const image = await S3.getObject({
        Bucket: process.env.bucket,
        Key: key,
      }).promise(); //retorna uma promisse para trabalhar com o async/await

    }));

    return {
      statusCode: 201, //created
      body: {}
    }
  } catch (error) {
    return error;
  }
};
```
### Otimizando a imagem
Usaremos uma lib chamada `Sharp` que possibilida realizar a manipulação da imagem, alterando o tamanho, resolução/qualidade
> yarn add sharp

E adaptamos o código usando essa lib, importando ela no nosso código, finalizando nossa function:
```js
'use strict';

const AWS = require('aws-sdk');
const sharp = require('sharp');
const {
  basename,
  extname
} = require('path');

const S3 = new AWS.S3(); // basicamente o SDK/API para acessar o AWS S3

module.exports.execute = async ({
  Records: records
}, context) => {
  try {
    // iremos operar de forma assincrona e para ele aguardar ele finalizar
    // teremos que er um await e irá retornar uma promise para ser resolvida,
    // quando tudo terminar, ele retorna para o usuário
    await Promise.all(records.map(async record => {

      // visualizar o conteúdo de cara `record`
      console.log(record);

      // é o caminho completo da imagem dentro do S3 (referencia da imagem e
      // não a imagem em si)
      const {
        key
      } = record.s3.object;

      // captura a imagem que esta no bucket, não é necessário informar credenciais
      // pois ja esta rodando dentro do bucket que tem a credencial
      const image = await S3.getObject({
        Bucket: process.env.bucket,
        Key: key,
      }).promise(); //retorna uma promisse para trabalhar com o async/await

      // configura a imagem para o novo formato ja otimizada
      const optimized = await sharp(image.Body) // image.Body retorna o blob da imagem (base64)
        .resize(1280, 720, { // define a resolução máxima
          fit: 'inside', // mantendo as regras do resize (dentro das proporções)
          withoutEnlargement: true // nunca distorcer a imagem
        })
        .toFormat('jpeg', { // sempre converte a imagem para formato jpeg (menor tamanho)
          progressive: true, // menor perda de qualidade
          quality: 50 // diminui pela metade a qualidade da imagem original
        })
        .toBuffer() // streaming da imagem para escrever em um arquivo

      // basename key pega o nome da imagem e o extname key pega a extenção, logo,
      // pegamos o nome do arquivo removendo a sua extenção (no segundo parametro),
      // e atribuimos fixo a nova extensão `.jpg`
      const arquivo = `compressed/${basename(key, extname(key))}.jpg`;
      console.log(arquivo);

      // gravar a imagem no S3 `optimized` que foi criada em buffer
      console.log(process.env.bucket);
      await S3.putObject({
        Body: optimized,
        Bucket: process.env.bucket,
        ContentType: 'image/jpeg',
        Key: arquivo // se usar a mesma key que usamos acima, irá salvar a mesma
        //imagem no mesmo local, criando um loop (bug) recursivo, por isso criamos
        //uma nova key, nesse caso um novo diretorio `compressed`, usaremos a lib `path`
      }).promise(); // converte para uma promisse, para realizar o retorno
    }));

    return {
      statusCode: 201, //created
      body: {
        success: true,
        message: 'imagem otimizada com sucesso'
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        success: false,
        message: error
      }
    };
  }
};
```
## Configurando Package.json
Vamos alterar o `package.json`, antes do deploy iremos remover o modulo `sharp` e realizar o comando para instalar com a dependencia do linux 64bits e com target 10.15.0 o sharp, diretamente compatível com o AWS, em seguida será feito o deploy serverless e ao finalizar o deploy, voltamos para o sharp que estava antes na nossa maquina local (nativa para o MacOS por exemplo).
```json
  "scripts": {
    "predeploy": "rm -rf node_modules/sharp && npm install --arch=x64 --platform=linux --target=10.15.0 sharp",
    "deploy": "serverless deploy -v",
    "postdeploy": "rm -rf node_modules/sharp && npm install sharp"
  },
```
## Deploy da Função
O comando acima `predeploy` foi feito apenas para preparar os pacotes necessários para o AWS e para Linux que roda no AWS

Por fim, podemos realizar o deploy baseado no script:
> yarn deploy

Pronto, nosso deploy foi concluído com sucesso

## Testando a Função
- Acesse o Console AWS, e o `serviço AWS Lambda` e abrir a função e o Monitoramento > Visualizar logs no `CloudWatch` <br />
https://sa-east-1.console.aws.amazon.com/lambda/home?region=sa-east-1#/functions/nodeless-aws-dev-optimize?tab=monitoring <br />
Aqui são gerados os logs para cada invocação realizada

- Acesse em seguida o `serviço AWS S3` e abra o bucket que foi criado automaticamente pelo deploy: `charlesmendes-serverless-aws`

- Senão existir, crie a pasta `uploads`
- Carregue uma imagem dentro da pasta upload (nessa versão do codigo, a imagem nao pode ter espaços)
- Abaixo, o log após realizar o upload da imagem, a app criou a pasta `compressed` automaticamente e gravou a nova imagem otimizada nesse diretório em apenas 1279.43ms (1.3 segs) consumindo 132MB, `ótimo desempenho S2` a imagem original `tinha 246.6 para 60.6KB`
```js
START RequestId: 0192af5e-da85-4ca5-9b27-8e9867e91589 Version: $LATEST
2019-08-25T16:54:07.859Z	0192af5e-da85-4ca5-9b27-8e9867e91589	INFO	{ eventVersion: '2.1',
eventSource: 'aws:s3',
awsRegion: 'sa-east-1',
eventTime: '2019-08-25T16:54:06.730Z',
eventName: 'ObjectCreated:Put',
userIdentity: { principalId: 'A1UHY0ZTTOAXM9' },
requestParameters: { sourceIPAddress: '201.46.18.82' },
responseElements:
{ 'x-amz-request-id': 'A37344FCBD5C2743',
'x-amz-id-2':
'VxwrcpGON78h3Deyf+t5maxFWysiKgXmqPRsPfWh48Z1cFAVth3CYgyBHmSTPi2J3hG/cnrpksU=' },
s3:
{ s3SchemaVersion: '1.0',
configurationId: 'fc8d6d78-40bb-47c8-ba81-2a2bf582102e',
bucket:
{ name: 'charlesmendes-serverless-aws',
ownerIdentity: [Object],
arn: 'arn:aws:s3:::charlesmendes-serverless-aws' },
object:
{ key: 'uploads/wallpaper_RE2.jpg',
size: 252490,
eTag: '7fccd8aa5e8c2b932556ced13bb6cdd6',
sequencer: '005D62BD2E9991FB68' } } }
2019-08-25T16:54:08.896Z	0192af5e-da85-4ca5-9b27-8e9867e91589	INFO	compressed/wallpaper_RE2.jpg
2019-08-25T16:54:08.897Z	0192af5e-da85-4ca5-9b27-8e9867e91589	INFO	charlesmendes-serverless-aws
END RequestId: 0192af5e-da85-4ca5-9b27-8e9867e91589
REPORT RequestId: 0192af5e-da85-4ca5-9b27-8e9867e91589	Duration: 1279.43 ms	Billed Duration: 1300 ms Memory Size: 256 MB	Max Memory Used: 132 MB
```
