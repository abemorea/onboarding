FROM node

COPY src/ /app/src/

COPY package.json /app/

WORKDIR /app

RUN npm install

CMD npm start

EXPOSE 3000
