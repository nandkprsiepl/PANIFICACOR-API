var log4js = require('log4js');
var cors = require('cors');
var logger = log4js.getLogger('Smartbolt App');
var express = require('express');
const configJson = require('./config.json');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
app.use(cors());
app.use(express.static('dist'));

var host = process.env.HOST || configJson.host;
var port = process.env.PORT || configJson.port;
var constants = require('./app/utils/constants');
const expFileUpload = require("express-fileupload");
app.use(expFileUpload());


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());

//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json({limit: '500000mb'}));
app.use(bodyParser.urlencoded({limit: '500000mb', extended: true}));
//app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req,res,next){
	req.header("Access-Control-Allow-Origin", "*");
	req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT','POST','PATCH','GET');
		return res.status(200).json({});
	}
	next();
})

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {

	console.log('Node app is running on port', port);
});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************',host,port);

server.timeout = 240000;

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Swagger Config ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
	
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////



var userRoutes = require('./app/routes/userRoutes');
var organizationRoutes = require('./app/routes/organizationRoutes');
var poRoutes = require('./app/routes/poRoutes');
var productRoutes = require('./app/routes/productRoutes');
var invoiceRoutes = require('./app/routes/invoiceRoutes');
var notificationRoutes = require('./app/routes/notificationRoutes');
var txInfoRoutes = require('./app/routes/txInfoRoutes');

app.use('/', userRoutes);
app.use('/', organizationRoutes);
app.use('/', poRoutes);
app.use('/', productRoutes);
app.use('/', invoiceRoutes);
app.use('/', notificationRoutes);
app.use('/', txInfoRoutes);
// make '/app' default route
app.get('/', function (req, res) {
     console.log('rrrrrrrrrrrrrrrrrrr')
    return res.redirect('/api-docs');
});