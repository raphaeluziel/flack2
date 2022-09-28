server {

    listen 80;
    listen [::]:80;

    server_name flack.raphaeluziel.com;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/raphaeluziel/flack/flack.sock;
      	proxy_http_version 1.1;
      	proxy_buffering off;
      	proxy_set_header Upgrade $http_upgrade;
      	proxy_set_header Connection "Upgrade";
    }

}
