'use strict';

module.exports = {
    client: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.min.css',
                'public/lib/bootstrap-daterangepicker/daterangepicker-bs3.min.css',
                'public/lib/ng-table/dist/ng-table.min.css',
                'https://fonts.googleapis.com/css?family=Open+Sans'
            ],
            js: [
                'public/lib/angular/angular.min.js',
                'public/lib/angular-resource/angular-resource.min.js',
                'public/lib/angular-animate/angular-animate.min.js',
                'public/lib/angular-ui-router/release/angular-ui-router.min.js',
                'public/lib/angular-ui-utils/ui-utils.min.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'public/lib/angular-file-upload/angular-file-upload.min.js',
                'public/lib/angular-locale_en-ie.min.js',
                'public/lib/Chart.min.js/Chart.min.js',
                'public/lib/tc-angular-chartjs/dist/tc-angular-chartjs.min.js',
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/bootstrap/dist/js/bootstrap.min.js',
                'public/lib/moment/moment.min.js',
                'public/lib/moment/locale/en-ie.min.js',		// Note necessary for proper IE date handling
                'public/lib/bootstrap-daterangepicker/daterangepicker.min.js',
                'public/lib/angular-daterangepicker/js/angular-daterangepicker.min.js',
                'public/lib/lodash/lodash.min.js',
                'public/lib/ng-table/dist/ng-table.min.js'
            ]
        },
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    }
};
