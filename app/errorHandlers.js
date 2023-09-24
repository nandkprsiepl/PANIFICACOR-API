/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
	var err = new Error('Not Found');
	err.message = "Route not found";
	err.status = 404;
	res.status(404);
	next(err);
};

/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.devErrors = (err, req, res, next) => {
	var errResult = {};
	if (err.status) {
		errResult.code = err.status;
		errResult.message = err.message;
	} else {
		errResult.code = 400;
		errResult.message = 'Internal server error'; 
	}
	res.status(errResult.code);
	res.send(errResult);
};