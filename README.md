TinyNews.com Web Server
========

This is the TinyNews.com web server.  It relies heavily on [tinynews-common](https://github.com/mlightning9/tinynews-common).  The app currently
does not use Node.js's Cluster, and as such is designed to have a number of it's processes spawned at any given time.

Stack
----

Node.js, ExpressJS, EJS, Redis, ElasticSearch, OrientDB, Kue, Resque ([coffee-resque](https://github.com/technoweenie/coffee-resque)),
AngularJS, Twitter Bootstrap, [tinynews-node-elasticsearch](https://github.com/mlightning9/tinynews-node-elasticsearch), [tinynews-node-email](https://github.com/mlightning9/tinynews-node-email), [tinynews-node-websocket](https://github.com/mlightning9/tinynews-node-websocket),


Testing
----

Back End:

    grunt test:backend

Front End:

    Requires protractor and grunt-protractor-runner
    A default installation will use a chrome browser driver, but since google no longer supports RHEL 6, and hence CentOS indirectly, a ubuntu machine will be used for testing.

    Test machine setup :
        Requires:
          - an Ubuntu host machine (14.04.1-server-amd64 was used)
          - node.js installed
          - Xvfb installed as a Service
          - Selenium Standalone Server installed as a Service
          - Web browsers ( Chrome, Firefox,Phantomjs(optional) )
          - Imagemagick (optional, if snapshots are taken)

        Installation:
          - Complete installation instructions (including services scripts) can be found here : https://www.exratione.com/2013/12/angularjs-headless-end-to-end-testing-with-protractor-and-selenium/

     Running tests :
    /test/frontend/protractor.conf.js :
         //the address of your standalone selenium server
         seleniumAddress: "http://marius822000.go.ro:4444/wd/hub"
         ...        
        'browserName': 'chrome'
         ...
        baseUrl: <your_app_url>

     Tests :

      All tests are located here :
     /test/frontend/protractor/*.js

      grunt test_frontend   

Running the App
----

    node app
