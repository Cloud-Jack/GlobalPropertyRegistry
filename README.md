# Global Property Registry

This is my pet/experimental project in which I am implementing set of services for Global Property Registry(GPR).
Global Property Registry - blockchain based dApp that can merge all property registries in the world into one decentralized.
The idea is to simplify and make it easier for property owners to manage their properties. User just creates account, verifies necessary data and he is ready to explore a unified registry. Some advantages are: transparency, clear ownership history, easy to sell/purchase, scale, no need for middlemen.

Main project parts:
- Smartcontracts [Solidity, Ethereum] ( NodeFactory, Node, Property)
- Auth/user service (Registration/Login without password!, using MetaMask)
- Property service (Properties info with Geography data for maps)
- Blockchain service (Binding all services to blockchain)
- Control service (Controlling data consistency and relevance)
- User verification service
- Property verification service

Miro docs soon


- [monorepo docs](https://docs.nestjs.com/cli/monorepo)

| Statements                                                                                 | Branches                                                                       | Functions                                                                           | Lines                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-59.08%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-35.48%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-33.92%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-57.14%25-red.svg?style=flat) |

##### Monorepo with nestjs

- Docker

- Secrets Service

- Logs Service

  - Pinojs
  - Elastic

- Observability

  - Jeager
  - Opentracing

- Authentication

- Error Handler

- Libs Structure

- Dependency Inversion Pattern
- Anti Corruption Layer Pattern
- Generic Repository Pattern

- Swaggger Documentation

- Redis

- Typeorm

- Tests
  - unit
  - e2e
  - 90% coverage

---

#### Prerequisite

- Node: 14 => <= 16
- Docker
- npm install -g commitizen
- npm install -g changelog
- https://stedolan.github.io/jq/download/

#### Instalation

- install monorepo dependencies
  ```bash
  $ yarn monorepo:install
  ```
- install project dependencies
  ```bash
  $ yarn workspace <workspaceName> install
  ```
- install lib on project
  ```bash
  $ yarn workspace <workspaceName> add <libName>
  ```

---

#### Running local mongodb/redis/kibana/jeager

```bash
$ yarn infra:local
# http://0.0.0.0:8082/ to access mongo
# http://0.0.0.0:8081/ to access redis
# http://0.0.0.0:5601/app/home to access kibana
# http://0.0.0.0:16686/search to access jeager
```

#### Running the app

- local

  ```bash
  $ yarn start:user-api:dev
  ```

- dev/hml/prd environment

  ```bash
  $ docker-compose up --build
  ```

---

---

##### workspace list

```bash
$ yarn workspaces info
```

- @app/user.api
- @tools/eslint.config
- @libs/utils
- @libs/modules
- @libs/core

---


#### Tests

- unit

  ```bash
  # Run monorepo tests
  $ yarn test
  ```

  ```bash
  # Run project tests
  $ yarn test main.api
  $ yarn test auth.api
  $ yarn test libs
  ```

- e2e

  ```
  $ yarn test:e2e
  ```

  - coverage

  ```
  $ yarn test:coverage
  ```

---

#### Lint

- Run monorepo lint

  ```bash
  $ yarn lint
  ```

- Run project lint
  ```
  $ yarn workspace <workspaceName> lint
  ```

---

#### Build

- Run project build
  ```
  $ yarn build <workspaceName>
  ```

---

---

#### Architecture

- `├── tools`: Project tools like: eslint, prettier and etc.
- `├── tests`: Monorepo tests initializer like: env, mocks and configs.
- `├── apps`: Monorepo Applications.
- `├── apps ├── user-api `: Authentication api, use to getting token to navigate between other projects.
- `├── libs`: Application shared libs.
- `├── libs ├── core`: Core business rules, don't use nestjs dependecies here, only class and rules that will be shared with other projects
- `├── libs ├── modules`: Application modules, use only nestjs modules here, you can add modules like: http, databse etc.
- `├── libs ├── utils`: Application utils, utilities that will shared with your monorepo.

- `├── libs ├── modules ├── global ├── secrets`: Monorepo secrets.

---

## License

It is available under the MIT license.
[License](https://opensource.org/licenses/mit-license.php)
