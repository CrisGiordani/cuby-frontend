# Cuby Digital

Website institucional em React, com foco em arquitetura de software, inteligência artificial e automação. Os arquivos usados pelo site estão em `public/images/`. A pasta local `ZERO/` contém referências e materiais de trabalho e não é versionada nem necessária para o build.

## Executar localmente

Requer Node.js 22 ou superior e npm.

```sh
npm install
npm start
```

O comando inicia a página em `http://localhost:3000` e a API em `http://localhost:3001`. O React encaminha `/api/contact` para o servidor. Encerre ambos com Ctrl+C. Não é necessário configurar e-mail para visualizar o site.

## Ativar o formulário

O arquivo `.env` já foi preparado e está ignorado pelo Git. Para novos checkouts, copie `.env.example` para `.env`.

```dotenv
RESEND_API_KEY=re_sua_chave
MAIL_FROM="Cuby Digital <site@notificacoes.cuby.com.br>"
```

1. No [Resend](https://resend.com/domains), adicione e verifique um domínio de envio. Sugestão: `notificacoes.cuby.com.br`.
2. Adicione ao DNS somente os registros de envio pedidos pelo Resend para esse subdomínio. Preserve os registros MX do domínio principal para continuar recebendo no Google Workspace. Não habilite recebimento no Resend para o domínio principal.
3. Crie uma chave de API com permissão de envio para o domínio e preencha `RESEND_API_KEY` no `.env`.
4. Ajuste `MAIL_FROM` para um endereço do domínio/subdomínio que você verificou. Esse remetente não precisa ter uma caixa no Workspace.
5. Reinicie `npm start` após alterar o `.env`. Na Vercel, alterações de variáveis entram em vigor no próximo deploy.

As mensagens são enviadas exclusivamente a **contato@cuby.com.br**. O e-mail do visitante vai no `Reply-To`, permitindo responder diretamente no Google Workspace. A confirmação só aparece após a aceitação da mensagem pelo Resend; ela não comprova chegada à caixa de entrada. Sem chave ou remetente configurado, o formulário informa a indisponibilidade e oferece o WhatsApp.

A chave fica no servidor. Não use o prefixo `REACT_APP_` e não copie o `.env` para a pasta `public/`.

## Produção

### Vercel

O push na branch `main` aciona o deploy automático já configurado. `vercel.json` define o build React (`npm run build`, saída `build/`) e `api/contact.mjs` publica o formulário em `/api/contact` como uma função Node.js. O handler aceita tanto o JSON processado pela Vercel quanto o fluxo de requisição do servidor local, conforme a [documentação do runtime Node.js](https://vercel.com/docs/functions/runtimes/node-js).

Antes do deploy, configure estas variáveis em **Settings → Environment Variables → Production**:

- `RESEND_API_KEY`: chave do Resend com permissão para enviar pelo domínio verificado.
- `MAIL_FROM`: remetente completo, por exemplo `Cuby Digital <site@notificacoes.cuby.com.br>`, usando o domínio que foi verificado no Resend.

Não é necessário configurar `PORT`, `HOST`, `API_PORT` ou `TRUST_PROXY` na Vercel. A função já usa os cabeçalhos do proxy da plataforma. `.env`, `ZERO/`, `build/`, `node_modules/` e `.vercel/` ficam fora do Git. O exemplo `.env.example` é versionado sem credenciais.

O limite de tentativas é local a cada instância da função; não representa uma cota global entre instâncias. A entrega real do e-mail deve ser conferida após o deploy e a configuração do domínio no Resend.

### Servidor Node próprio (opcional)

```sh
npm run build
npm run serve
```

O servidor Node entrega o conteúdo de `build/` e a API no mesmo endereço, sem dependências adicionais de produção. Configure `HOST=0.0.0.0`, a porta `PORT` fornecida pela hospedagem, `RESEND_API_KEY` e `MAIL_FROM` no ambiente de produção. Publique atrás de HTTPS. Hospedagens exclusivamente estáticas precisam de um servidor separado e de um proxy de `/api/contact` para ele.

Atrás de um proxy confiável que **sobrescreva** `X-Forwarded-For` e `X-Forwarded-Host`, configure `TRUST_PROXY=true`. Isso permite limitar tentativas pelo IP do visitante. O limite atual é local ao processo (cinco tentativas por dez minutos); para várias instâncias, use limitação compartilhada na infraestrutura. O formulário também tem validação no servidor, limite de tamanho e campo de detecção de spam.

Em desenvolvimento, a API deve permanecer na porta 3001 para corresponder ao proxy do React. `WEB_PORT` permite alterar a porta da interface.

## Verificações

```sh
npm run build
npm run test:server
```

Os testes da API usam um provedor simulado e não enviam e-mails reais. A entrega real precisa ser conferida depois da configuração do Resend.

## Conteúdo

- `src/App.js`: conteúdo, navegação, diagrama e formulário.
- `src/App.css` e `src/index.css`: identidade visual e estilos responsivos.
- `server/contact.mjs`: validação e envio via API do Resend.
- `api/contact.mjs` e `vercel.json`: integração do formulário e deploy na Vercel.
- `public/images/`: logotipo oficial Cuby Digital e imagem otimizada.

WhatsApp: +55 (61) 99596-5833. Os canais de contato do site são WhatsApp, e-mail e formulário. Brasília e o telefone atual foram conferidos no Maps; o Facebook mantém contatos antigos, que não foram usados. Não foram adicionados endereço completo, estatísticas ou depoimentos não confirmados. A galeria exibe os 14 clientes anteriores informados pelo responsável pela Cuby. A fundação em 2009 foi confirmada por ele; não há alegação de 25 anos de existência.

## Galeria de clientes

A seção é definida em `src/Clients.js`. As 14 marcas são arquivos locais em `public/images/clients/`, com fontes registradas em `SOURCES.md`. Todos os blocos têm o mesmo tamanho; as imagens mantêm a proporção original. A exibição inicial em tons de cinza acompanha o visual da Cuby, com cores no hover (quando a versão original permite).

## Logo oficial

A versão oficial versionada é `public/images/cuby-logo.svg`. Usa o verde #B2DD4C e o preto #22271E, com fundo transparente e “digital” em minúsculas na fonte Istok Web Italic regular, menor e mais leve, convertida em curvas vetoriais. Os originais e referências locais em ZERO foram preservados e estão ignorados pelo Git.
