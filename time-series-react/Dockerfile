# Stage 1: Build the React application
FROM node:18-alpine

WORKDIR /app

#COPY package.json package-lock.json ./

COPY ./time-series-react/ .
COPY ./packages/ ./src/packages/

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["yarn", "start"]