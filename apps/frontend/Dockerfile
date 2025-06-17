FROM nginx:mainline-alpine

COPY --chown=nginx:nginx  ./tools/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx  ./tools/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx  ./apps/frontend/dist /usr/share/nginx/html

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx

USER nginx