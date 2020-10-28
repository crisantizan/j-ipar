FROM ubuntu

WORKDIR /root

RUN apt-get update
RUN apt-get -y install git python3 curl build-essential

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn

COPY . /usr/src/nuxt-app/

WORKDIR /usr/src/nuxt-app/

# RUN rm /usr/src/nuxt-app/package-lock.json
RUN yarn install
RUN yarn build

EXPOSE 8090

CMD [ "yarn", "start" ]


