FROM public.ecr.aws/docker/library/node:12-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
RUN npm install
COPY . /app
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL ${REACT_APP_BACKEND_URL}
RUN npm i -D --save-exact mini-css-extract-plugin@2.4.5
RUN npm run build

FROM public.ecr.aws/nginx/nginx:1.21-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx","-g","daemon off;"]