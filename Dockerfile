FROM nginx:alpine
COPY ./packages/core/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
