#!/bin/bash

HOST=$(hostname --fqdn)


# openssl req -x509 -newkey rsa:2048 -nodes -sha256 -keyout localhost.key -out localhost.crt

# echo '(assumes previously)     sudo apt-get install libnss3-tools'
# npx tls-keygen server.key server.crt

# previously ...  
#   need certutil installed
#       apt install libnss3-tools
#   https://docs.brew.sh/Homebrew-on-Linux
#       sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
#   https://github.com/FiloSottile/mkcert
#       brew install mkcert 
# 
mkcert -install
mkcert $HOST "*.$HOST" example.test localhost 127.0.0.1 ::1

