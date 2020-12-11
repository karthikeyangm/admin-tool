var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var errorMsg = require('../utils/errors');
// var secretKey = 'yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
var secretKey = require("../config/config")

/**
 * Auth middleware to verify the token and its retun the encoded data 
 * @module AuthMiddleware
 */

module.exports = ((req, res, callback) => {

	/**
	 * Its verify the tooken via JWT.Verify method
	 * @function JwtVerify
	 * @param  {string} reqToken Its represent the encode token details.
	 * @param  {string} secretKey Its represent the secret key.
	 * @return {Objec} Its return decoded data.
	 */
	console.log("=======headers")
	console.log(req.headers)
	if (!req.headers['x-auth-token']) {
		var err = errorMsg.getError('x-auth-token is required');
		return res.send(err);
	}
	if (req.headers['x-auth-token']) {
		var reqToken = req.headers['x-auth-token'];
		jwt.verify(reqToken, secretKey.secretKey, function (err, decoded) {
			//DETAILS : decoded contains t(required details), iat, exp
			if (err) {
				if (err.name === 'TokenExpiredError') { // 'TokenExpiredError'
					res.statusCode = 307;
				} else {
					res.statusCode = 401; //error: JsonWebTokenError: invalid signature
				}
				return res.send((err));
			} else {
				req.username = decoded.id;
				return callback();
			}
		});
	}
})
