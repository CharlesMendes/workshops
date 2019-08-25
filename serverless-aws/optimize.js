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
