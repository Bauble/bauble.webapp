## This repo has been put out to pasture.  For the future of Bauble on the web see the [Bauble/bauble.web](https://github.com/Bauble/bauble.web).

# Bauble
Bauble is a web application for managing plant collections.  It is intended to be used by botanic gardens,
arboreta and herbariums to manage their plant records. For more information visit http://bauble.io

## Development - Getting Started
First you'll need to install [NodeJS](http://nodejs.org/) and make sure that the executable `nodejs` is also linked as [`node`](https://github.com/Bauble/bauble2/issues/34)...

### Install the app
```shell
mkdir bauble
git clone https://github.com/Bauble/webapp.git bauble/webapp
cd bauble/webapp
sudo npm install -g yo grunt-cli bower
npm install
bower install
```

### Start the web app with:
```shell
grunt server
```

** You will also need the [bauble.api](https://github.com/Bauble/bauble.api) server running to use the app.


# License
BSD 3-Clause
