# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

# ---- serve ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
ENV BACKEND_URL=http://poc-backend:8080
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
# The nginx entrypoint envsubstitutes ${BACKEND_URL} in templates/ -> conf.d/ at container start.
