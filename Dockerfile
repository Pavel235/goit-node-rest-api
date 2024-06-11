FROM node

WORKDIR /project

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
