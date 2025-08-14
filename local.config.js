exports.getbusiness = function (req, res) {
    var business_id = { business_id: 40 };
    return business_id;
};

exports.getbaseurl = function (req, res) {
    var baseurl = "http://localhost:9999/1/api/";
    return baseurl;
};

exports.getConfig = function (req, res) {
    return {
        baseurl: "http://localhost:9999/1/api/",
        orgurl: "http://localhost:9999/1/api/",
        wssurl: "ws://localhost:9999/",
        orgId: "1"
    };
};

exports.getimageurl = function (req, res) {
    var imageURL = "http://localhost:9999/assets/img/";
    return imageURL;
};
