#!/usr/bin/env bash
set -ex
PNPM_VERSION='8.14.3'
NESTJS_VERSION='10.3.0'
cd /tmp && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt install -y ./google-chrome-stable_current_amd64.deb;
sudo mv /usr/bin/google-chrome-stable /usr/bin/google-chrome;
google-chrome --version;
sudo wget https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/120.0.6099.28/linux64/chromedriver-linux64.zip;
sudo unzip chromedriver-linux64.zip;
sudo mv /tmp/chromedriver-linux64/chromedriver /usr/bin/chromedriver
chromedriver --version
python3 --version;
cd /workspace/app/;
pip3 install -r requirements.txt;
npm install -g pnpm@${PNPM_VERSION};
npm install -g @nestjs/cli@${NESTJS_VERSION};