# Create a Nodejs environemt with version 16.13.2 and start a server
FROM node:16.13.2

WORKDIR /app
COPY yarn.lock .
COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "start"]

