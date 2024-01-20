set -ex
sudo apt update -y && sudo apt upgrade -y && sudo apt-get update --fix-missing && sudo apt -y install sudo wget unzip;
cd /tmp && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt install ./google-chrome-stable_current_amd64.deb;
sudo mv /usr/bin/google-chrome-stable /usr/bin/google-chrome;
google-chrome --version;
sudo wget https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/120.0.6099.28/linux64/chromedriver-linux64.zip;
sudo unzip chromedriver-linux64.zip;
sudo mv /tmp/chromedriver-linux64/chromedriver /usr/bin/chromedriver
chromedriver --version
cd /workspaces;
pip install -r requirements.txt;
npm install;