
exports.getbusiness = function (req, res) {
	var business_id = { business_id: 40 };
	return business_id;
};

exports.getbaseurl = function (req, res) {
	// var baseurl = "https://m1.quantbots.co/1/api/";
	var baseurl = "http://localhost:9999/1/api/"
	return baseurl;
};

exports.getConfig = function (req, res) {
    return {
        baseurl: "https://api.tradeexchange.co/api-mongodb/",
        orgurl: "https://api.tradeexchange.co/org/",
        wssurl: "wss://api.tradeexchange.co/",
        orgId: "1"
    };
};

exports.getimageurl = function (req, res) {
	var imageURL = "https://api.tradeexchange.co/assets/img/";
	//var imageURL = "http://localhost:2000/assets/img/"; 
	return imageURL;
};

// Need to work on the base url 
