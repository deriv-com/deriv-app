FROM node:12 AS builder
WORKDIR /build/
COPY . .
RUN npm run bootstrap
RUN npm run build:travis
RUN npm run build:storybook

FROM nginx:alpine
COPY --from=builder /build/packages/components/.out/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html
