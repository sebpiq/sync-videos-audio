FROM node:12

RUN mkdir code
COPY . code/ 

RUN cd /code/clients ; npm i ; npm run build
RUN cd /code/server ; npm i ; npm run build

EXPOSE 3000

WORKDIR /code/server
ENTRYPOINT [ "npm", "start" ]