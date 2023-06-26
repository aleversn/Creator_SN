FROM nginx as deploy

WORKDIR /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/certs /etc/nginx/certs
COPY dist/ ./
EXPOSE 80
EXPOSE 443


