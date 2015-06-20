![DMD Logo](dmd_logo.png)

## DMD Manufacturing Ltd. Innovation Voucher IV 2015 - 1244 Jun 2015 - Jul 2015
This prototype examines a proposal to present monitoring data gathered from weighing scales (as well as other sources) to farmers.
The development stack is:

* MongoDb
* ExpressJS
* AngularJS
* NodeJS


## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! your application should be running by now, to proceed with your development check the other sections in this documentation. 
If you encounter any problem try the Troubleshooting section.

## License

The work herein contained is subject to copyright IT Sligo / John Kelleher, save the meanjs.org stack.

### Initialisation of meanjs stack

* bower install all key components
* angular-ui-utils breaks dropdown so add data attributes for dropdown and dropdown-toggle rather than classes in header.client.view.html
* 

### Debugging in Webstorm

* Run Grunt (default) task in console
* Ensure Webstorm debug plugin in place for Chrome/Firefox
* Create Edit Configuration for Javascript and run to catch breakpoints
* Use ps -ax | grep node to identify if port is in use if get EADDRINUSE error shows and kill -9 portNumber to kill
* Or stop Run processes in WebStorm
