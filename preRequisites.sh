#!/bin/bash
#
# Copyright Coforge Tech All Rights Reserved
#

#Install Azure CLI
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
#Install JQ
    sudo apt-get -y  install jq
#install Kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
    echo "$(<kubectl.sha256) kubectl" | sha256sum --check
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    kubectl version --client

#Install Nodejs
    echo "# Executing nvm installation script"
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
    # Set up nvm environment without restarting the shell
    export NVM_DIR="${HOME}/.nvm"
    [ -s "${NVM_DIR}/nvm.sh" ] && . "${NVM_DIR}/nvm.sh"
    [ -s "${NVM_DIR}/bash_completion" ] && . "${NVM_DIR}/bash_completion"
    # Install node
    echo "# Installing nodeJS"
    nvm install v10.23.2
    nvm use v10.23.2
#Install pm2
    npm install pm2 -g
