FROM node:alpine
WORKDIR ./
COPY . .
RUN apk upgrade \
  && apk add yarn
RUN rm -rf dist

RUN yarn install --no-optional

ENTRYPOINT ["yarn", "build"]
