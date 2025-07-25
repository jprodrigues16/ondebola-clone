# OndeBola Clone

Esta aplicação é um clone simples do site ondebola.com, destinado a
mostrar em que canais de televisão serão transmitidos os jogos de
equipas portuguesas de futebol. O frontend foi construído com
[Next.js](https://nextjs.org/) e [Tailwind CSS](https://tailwindcss.com/), enquanto o backend utiliza as
rotas API do Next.js para servir dados obtidos através da API‑Football
(fornecida pela API‑Sports).

## Funcionalidades

* Seleção de uma data específica (por defeito hoje) para ver os jogos
  de equipas portuguesas nesse dia.
* Filtragem opcional por equipa — pode escolher um clube português
  específico (ex.: Benfica, Porto, Sporting, Braga, etc.) ou ver todos
  os jogos.
* Listagem dos jogos com informação sobre as equipas, horário de
  início, estádio e canal de televisão, se disponível.
* Todos os horários são apresentados no fuso horário de Lisboa
  através do parâmetro `timezone` da API 【91804133009562†screenshot】.

## Pré‑requisitos

* **Node.js >= 18** – necessário para executar o servidor e o
  frontend. O projeto usa `fetch` nativo do Node para chamar a API.
* **Chave de API da API‑Football (API‑Sports)** – registe‑se no
  painel da API‑Sports para obter a sua chave. A chave é
  obrigatória para utilizar as rotas de `fixtures` e `teams`. Pode
  consultar o tutorial oficial para obter os IDs das equipas via
  endpoint `teams`【66957918526591†L121-L129】.

## Instalação

1. Clone este repositório.
2. Entre na pasta do projecto: `cd ondebola-clone`.
3. Renomeie o ficheiro `.env.local.example` para `.env.local` e
   substitua `YOUR_API_KEY_HERE` pela sua chave da API.
4. Instale as dependências (é necessário acesso à internet para
   descarregar as bibliotecas):

   ```bash
   npm install
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## Estrutura do projeto

* `pages/index.js` – página principal que renderiza a interface
  gráfica. Permite escolher a data e a equipa e apresenta a lista de
  jogos.
* `pages/api/fixtures.js` – rota API que faz proxy para o endpoint
  `fixtures` da API‑Football. Esta rota adiciona cabeçalhos
  `x-apisports-key` e `x-apisports-host` conforme indicado na
  documentação 【91804133009562†screenshot】 e suporta parâmetros de
  filtragem (`team`, `date`, `league`, `season`, etc.).
* `pages/api/teams.js` – rota API que consulta o endpoint `teams` da
  API‑Football para obter as equipas portuguesas. Usa o parâmetro
  `country` e uma época (season) actual【66957918526591†L121-L129】.
* `styles/globals.css` – ficheiro de estilos globais que importa as
  directivas da Tailwind.

## Notas importantes

* A API‑Football permite filtrar jogos por equipa e data através dos
  parâmetros `team` e `date` no endpoint `fixtures`【91804133009562†screenshot】. Utilize o ID da equipa
  retornado pela rota `teams` para compor a consulta.
* A informação de canais de televisão nem sempre está disponível na
  API. O campo `broadcast` ou `fixture.tv` é utilizado se estiver
  presente; caso contrário, aparece `N/D` na interface.
* Para limitar o consumo de chamadas, as rotas API do Next.js
  actuam como proxy. O parâmetro `timezone` é definido como
  `Europe/Lisbon` para que os horários correspondam a Portugal【91804133009562†screenshot】.

## Futuras melhorias

* Integração com página de resultados passados e futuros, incluindo
  pesquisa por competições.
* Melhoramento da pesquisa de equipas com autocompletar.
* Implementação de cache no servidor para reduzir chamadas repetidas
  à API.

Sinta‑se à vontade para contribuir ou adaptar este projecto às suas
necessidades!