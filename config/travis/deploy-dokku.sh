#!/bin/bash
openssl aes-256-cbc -K $encrypted_9d581fdc29c5_key -iv $encrypted_9d581fdc29c5_iv -in .travis/dokku-deploy-admin.key.enc -out .travis/dokku-deploy-admin.key -d
eval "$(ssh-agent -s)";
chmod 600 .travis/dokku-deploy-admin.key.key;
ssh-add .travis/dokku-deploy-admin.key.key;
ssh-keyscan "$DOKKU_HOST" >> ~/.ssh/known_hosts;
git remote add deploy dokku@"$DOKKU_HOST":"$DOKKU_APP";
git config --global push.default simple;
git fetch --unshallow;
git push deploy master --force;