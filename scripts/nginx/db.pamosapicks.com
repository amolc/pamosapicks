
server {
    server_name db.pamosapicks.com;
    return 301 https://$host$request_uri;

    listen 80;
    listen [::]:80;
}

server {
    server_name db.pamosapicks.com; # managed by Certbot

    root /home/ubuntu/mysqladmin;
    index index.php index.html index.htm;

    include /etc/nginx/default.d/*.conf;

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
          try_files $uri =404;
          fastcgi_split_path_info ^(.+\.php)(/.+)$;
          fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
          fastcgi_index index.php;
          include fastcgi_params;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          fastcgi_intercept_errors off;
          fastcgi_buffer_size 16k;
          fastcgi_buffers 4 16k;
          fastcgi_connect_timeout 600;
          fastcgi_send_timeout 600;
          fastcgi_read_timeout 600;
        }

    error_log /var/log/nginx/db.pamosapicks.com.error.log error;

    error_page 404 /404.html;
    location = /40x.html { }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html { }

    listen 443 ssl; # managed by Certbot
    listen [::]:443 ssl; # managed by Certbot

    ssl_certificate /etc/letsencrypt/live/db.pamosapicks.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/db.pamosapicks.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
