# syntax=docker/dockerfile:1
# Kaniko-compatible (sin BuildKit-only features como RUN --mount).
FROM node:20.20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.28-alpine
# nginx-unprivileged corre como uid 101 (nginx) y escucha en 8080.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/vangora-demo-angular/browser /usr/share/nginx/html
EXPOSE 8080
USER 101
