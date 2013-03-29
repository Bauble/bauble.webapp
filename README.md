# Bauble 2

An experimental branch of a web based Bauble 2.

## Getting started

First you'll need to install Python3 and NodeJS (http://nodejs.org/).

### Install the app
```shell
git clone https://github.com/Bauble/bauble2.git
cd bauble2
sudo npm install -g yo grunt-cli bower
npm install
bower install
```

### Setup the Python environment
You need to have Python3, virtualenv and pip.

#### In a virtualenv
```shell
pip install -r requirements
```
For testing you'll probably also want to install PhantomJS (http://phantomjs.org/).

### Start the API server with:
./run.py

### Start the web app with:
grunt server
