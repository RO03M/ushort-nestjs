# Sobre
A aplicação deve possibilitar o cadastro e usuários e a encurtação de urls (seja com um usuário autenticado ou não)

### Comportamentos da aplicação

- **Qualquer um** pode criar uma url encurtada, mesmo não estando autenticado, porém somente um usuário cadastrado pode editar, deletar, ou listar todas as suas urls já criadas

- Na rota de criação de url, se somente a url longa for provida, uma hash de 6 caracteres será gerada automaticamente. Porém, é possível passar um apelido manualmente para a rota em questão, com limite de até 50 caracteres.

# Diferenciais

### Escalabilidade

- A aplicação possuí um sistema de filas, task scheduling e cache para lidar com muitos acessos simultâneos, enquanto lida com a contagem de visitas na url e mantêm um tempo de retorno médio menor do que 50ms.

- Foi feito um teste de estresse utilizando a ferramenta [k6](https://k6.io/) e obtive os seguintes resultados:
  - 500 usuários virtuais
  - Quase 2 milhões de acessos em menos de 5 minutos
  - 6726 req/s
  - Tempo médio de resposta de 48ms

- Resultados do k6:
<p align="center">
    <img
        width="50%"
        src="docs/stress-tests-result.png"
        alt="Resultados do k6"
    />
</p>

### Outros

- Lefthook para executar hooks pre commit e pre push
- BiomeJs para fazer o lint e a formação do projeto
- Dockerfile e docker compose para subir o projeto com o ambiente já configurado
- Testes e2e
- Documentação dos endpoints com o Swagger

# Como Executar

```sh
# Clonando o repositório
git clone git@github.com:RO03M/ushort-nestjs.git

# Acessando a pasta do projeto
cd ushort-nestjs

# Criação do .env base
cp .env.example .env

# Criando os containers (api, redis e postgres)
docker compose up -d api

# Comando para criar as tabelas no banco de dados
docker compose exec -it api yarn migrate
```

# Tecnologias Utilizadas
