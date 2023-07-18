FROM node:16.14

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/user-api

COPY apps/user-api/package.json dist/apps/user-api/
COPY apps/user-api/tsconfig.build.json dist/apps/user-api/
COPY apps/user-api/tsconfig.json dist/apps/user-api/

EXPOSE 4000

RUN yarn --cwd dist/apps/user-api
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/user-api -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:user-api:prd