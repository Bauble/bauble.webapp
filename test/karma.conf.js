// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '..';

// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,

    'app/components/jquery/jquery.js',
    'app/components/angular/angular.js',
    'app/components/angular-mocks/angular-mocks.js',
    'app/lib/angular-bootstrap/ui-bootstrap-tpls-0.7.0-SNAPSHOT.min.js',
    'app/components/select2/select2.js',
    'app/components/angular-ui-select2/src/select2.js',
    'app/components/bootstrap-datepicker/js/bootstrap-datepicker.js',
    'app/components/angular-grid/ng-grid-2.0.7.min.js',
    'app/components/momentjs/min/moment.min.js',
    'app/scripts/*.js',
    'app/scripts/**/*.js',
    //'test/mock/**/*.js',
    'test/spec/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9101;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
//browsers = ['Chrome'];
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
