# Static build of the site, served by nginx.
# Public VITE_* settings are baked in at build time (docker compose passes them from .env).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_GCAL_ID VITE_GCAL_KEY VITE_WEB3FORMS_KEY VITE_CONTACT_EMAIL
ENV VITE_GCAL_ID=$VITE_GCAL_ID \
    VITE_GCAL_KEY=$VITE_GCAL_KEY \
    VITE_WEB3FORMS_KEY=$VITE_WEB3FORMS_KEY \
    VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
