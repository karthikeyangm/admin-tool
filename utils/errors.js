module.exports ={
    getError(message, status, success){
        var error = new Error();
        error.message = message || 'Something went wrong';
        error.status = status || 400;
        error.success = success || false;
        return error;
    }
};