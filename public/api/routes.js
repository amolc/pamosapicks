var https = require('https');
var request = require('request');
var config = require('./config');
var business_id = config.getbusiness();
var baseUrl = config.getbaseurl();
var imageURL = config.getimageurl();

function get_json(url, callback) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	console.log(baseUrl + url);
	request(baseUrl + url, { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
		callback(res.body);
	});
}

exports.login = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Login - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('login', data1);
};

exports.index = function (req, res) {
    var data1 = {};

    get_json('product/products/', function (response1) {
        data1['productData'] = response1.data;
        res.render('index', data1);
    });
};

exports.about = function (req, res) {
    var data1 = {};
    res.render('about', data1);
};
exports.blog = function (req, res) {
    var data1 = {};
    res.render('blog', data1);
};

exports.cart = function (req, res) {
    const productId = req.query.id; 
    console.log('Product ID:', productId);

    const apiUrl = `product/get-products/${productId}/`;
    console.log('Fetching from API URL:', apiUrl);

    get_json(apiUrl, function (response) {
        const data1 = {};
        data1['productDetail'] = response.data;
        console.log(data1['productDetail']); // Ensure `price` is present in the response
        
        res.render('cart', data1); // Ensure your view file is named 'shop-details'
    });
};

exports.checkout = function (req, res) {
    const productId = req.query.id; 
    console.log('Product ID:', productId);

    const apiUrl = `product/get-products/${productId}/`;
    console.log('Fetching from API URL:', apiUrl);

    get_json(apiUrl, function (response) {
        const data1 = {};
        data1['productDetails'] = response.data;
        console.log(data1['productDetails']); 
        
        // Render the checkout view with the product data
        res.render('checkout', data1);
    });
};




exports.contact = function (req, res) {
    var data1 = {};
    res.render('contact', data1);
};
exports.wishlist = function (req, res) {
    var data1 = {};
    res.render('wishlist', data1);
};
// exports.shop_details = function (req, res) {
//     var data1 = {};
// 	get_json('product/products/', function (response1) {
//         data1['productDetail'] = response1.data;
//     res.render('shop-details', data1);
// });
// };



exports.shop_details = function (req, res) {
    const productId = req.query.id; 
    console.log('Product ID:', productId);

    const apiUrl = `product/get-products/${productId}/`;
    console.log('Fetching from API URL:', apiUrl);

    get_json(apiUrl, function (response) {
        const data1 = {};
        data1['productDetail'] = response.data;
        console.log(data1['productDetail']); // Ensure `price` is present in the response
        
        res.render('shop-details', data1); // Ensure your view file is named 'shop-details'
    });
};
exports.log_In = function (req, res) {
    var data1 = {};
    res.render('log-in', data1);
};

exports.shop_left_sidebar = function (req, res) {
    var data1 = {};
    res.render('shop-left-sidebar', data1);
};
exports.quant_strategies_details = function (req, res) {
	var data1 = [];
	get_json('modelportfolio/get-all-strategy-portfolio/' , function (response1) {
		data1['portfolioData'] = response1.data;
		res.render('quant_strategies_details', data1);
	});

};



exports.quant_strategy_signals = function (req, res) {
	var data1 = [];
	const portfolioName = req.query.portfolio;
	console.log(portfolioName);
	
	get_json(`modelportfolio/get-latest-signals/?portfolio_name=${portfolioName}` , function (response1) {
		data1['signals'] = response1.data;
		console.log(data1);
		res.render('quant_strategy_signals', data1);
	});

};


exports.helloworld = function (req, res) {
	var data1 = [];
	data1['title'] = "This is the tile ";
	res.render('helloworld', data1);
};

exports.quant_strategy_stock_signal = function (req, res) {
    var data1 = {};  // Changed to an object
    const portfolioName = req.query.portfolio;
    const stock = req.query.stock;

    console.log(portfolioName);
    console.log(stock);

    get_json(`modelportfolio/get-stock-signals-history/?portfolio_name=${portfolioName}&stock=${stock}`, function (response1, error) {
        if (error) {
            console.error("Error fetching stock signals history:", error);
            return res.status(500).send("An error occurred while fetching stock signals history.");
        }

        console.log(response1.data);
        data1['signals'] = response1.data;
        res.render('quant_strategy_stock_signal', data1);
    });
};


exports.strategies_overview = function (req, res) {
	var data1 = [];

	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('strategies_overview', data1);
};



exports.our_team = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('our_team', data1);
};


exports.about = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('about', data1);
};


exports.pms = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('pms', data1);
};



exports.contact_us = function (req, res) {
	var data1 = [];

	res.render('contact-us', data1);
};

exports.news_letter_plans = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('news-letter-plans', data1);
};


exports.telegram_plans = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('telegram-plans', data1);
};


exports.qr_plan = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('qr-plan', data1);
};



exports.login = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('login', data1);
};



exports.register = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Profile - Virtualhire!',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('register', data1);
};




exports.dashboard = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Hiring-Step 1',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('dashboard', data1);
};

exports.strategies = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Hiring-Step 2',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('strategies', data1);
};

exports.strategy_signals = function (req, res) {
	var data1 = [];
	const portfolioName = req.query.portfolio;
	get_json(`modelportfolio/get-latest-signals/?portfolio_name=${portfolioName}` , function (response1) {
		data1['signals'] = response1.data;
	
		res.render('strategy_signals', data1);
	});
};

exports.strategies_details = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Hiring-Step 4',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('strategies-details', data1);
};

exports.smart_portfolio = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Hiring-Step 5',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('smart-portfolio', data1);
};

exports.robot_congrats = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Hiring-Step 6',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('robot-congrats', data1);
};

exports.portfolio_demo_list = function (req, res) {
	var data1 = [];
	var seoData = {
		seoId: 1,
		title: 'We help global talent to work remotely.',
		description: 'Virtualhire is the best place for find the right talent to work for your company.',
		keywords: 'Virtualhire, remote hire, work from home, find remote jobs',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-demo-list', data1);
};


exports.portfolio_ig_list = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 2 - Join Us As A Candidate',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-list', data1);
};

exports.portfolio_cttrade_list = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 3 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-cttrade-list', data1);
};


exports.portfolio_alpaca_list = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 3 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('alpaca-portfolio', data1);
};

exports.portfolio_aliceblue_list = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 3 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-aliceblue-list', data1);
};


exports.portfolio_limetrader_list = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 3 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-limetrader-list', data1);
};


exports.portfolio_limetrader_details = function (req, res) {
	var data1 = [];
	res.render('portfolio-limetrader-details', data1);
};

exports.portfolio_limetrader_transaction = function (req, res) {
	var data1 = [];
	res.render('portfolio-limetrader-transaction', data1);
};

exports.portfolio_demo_details = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-demo-details', data1);
};

exports.portfolio_demo_transaction = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-demo-transaction', data1);
};

exports.portfolio_ig_details = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-ig', data1);
};


exports.portfolio_ig_transaction = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-ig-transaction', data1);
};

exports.portfolio_cttrade_details= function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-cttrade-details', data1);
};

exports.portfolio_cttrade_transaction = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-cttrade-transaction', data1);
};


exports.portfolio_alpaca_details = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-alpaca', data1);
};

exports.portfolio_alpaca_transaction = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-alpaca-transaction', data1);
};



exports.portfolio_aliceblue_details = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-aliceblue-details', data1);
};

exports.portfolio_aliceblue_transaction = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('portfolio-aliceblue-transaction', data1);
};


exports.backtest_stock = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('backtest-stock', data1);
};


exports.backtest_stock_vwap = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Step 4 - Application Form',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('backtest-stock-vwap', data1);
};



exports.news_letter_plans_list = function (req, res) {
	var data1 = [];

	res.render('news-letter-plans-list', data1);
};


exports.telegram_plan_list = function (req, res) {
	var data1 = [];

	res.render('telegram-plans-list', data1);
};


exports.qr_plan_payment = function (req, res) {
	var data1 = [];

	res.render('qr-plan-payment', data1);
};


exports.category = function (req, res) {
	var data1 = [];
	var urlparams = req.url;
	var category = urlparams.split('/')[2].split('.');
	var seoData = {
		seoId: 1
	};
	get_json('getCandidateByCat/' + category[0].replace(/-/g, " "), function (response1) {
		data1['categoryData'] = response1;
		seoData.title = response1[0].category;
		seoData.keywords = 'Find remote employee for ' + response1[0].category + ',' + ' Virtualhire, Remote Employee for ' + response1[0].category + ', Work from home for ' + response1[0].category + ' ';
		seoData.description = 'Virtualhire is great place to find remote emoplyee for ' + response1[0].category + ' ';
		data1['seoData'] = seoData;
		res.render('category', data1);
	});
};
exports.candidateName = function (req, res) {
	var data1 = [];
	var seoData = {
		seoId: 1,
	};
	var urlparams = req.url;
	var name = urlparams.split('/')[3].split('.')[0];
	get_json('getCandidatebyName/' + name, function (response1) {
		data1['categoryCandidate'] = response1;
		get_json('getCandidateExperienceByName/' + name, function (response2) {
			if (response2.length > 0) {
				data1['experExist'] = true;
			} else {
				data1['experExist'] = false;
			}
			data1['candidateExperiences'] = response2;
			seoData.description = response1[0].abt_me;
			seoData.keywords = response1[0].skills;
			seoData.title = response1[0].category;
			get_json('getCandidateProjectsByName/' + name, (response3) => {
				if (response3.length > 0) {
					data1['projectExist'] = true;
				} else {
					data1['projectExist'] = false;
				}
				data1['candidateProjects'] = response3;
				data1['seoData'] = seoData;
				res.render('profile', data1);
			});

		});
	});
};
exports.thankyou = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Category',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, Remote Employee',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('thankyou', data1);
};



exports.interview = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	var urlparams = req.url;
	var name = urlparams.split('/')[3];
	var contactName = name.replace(/-/g, " ");
	data1['name'] = contactName;
	var seoData = {
		seoId: 1,
	};
	seoData.title = contactName
	seoData.description = 'Hire ' + contactName + ' on virtualhire.co for ' + urlparams.split('/')[2].replace(/-/g, " ") + ' category';
	seoData.keywords = '' + contactName + ' ,' + urlparams.split('/')[2].replace(/-/g, " ") + ', ' + ',Virtual hire', 'Remote Employee';
	data1['seoData'] = seoData;
	res.render('interview', data1);
};
exports.hire_thankyou = function (req, res) {
	var data1 = [];
	var seoData = {
		seoId: 1,
		title: 'Thankyou',
		description: 'Virtualhire.',
		keywords: 'Virtualhire, Remote Employee',
	};
	var url = req.url;
	var params = url.split('/');
	get_json(params[2] + '/' + params[3] + '/' + params[4], function (response1) {
		data1['categoryData'] = response1;
		data1['seoData'] = seoData;
		res.render('hire-thankyou', data1);
	});

};
exports.hire_signup = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Thanku',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, exporters, importers',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('hire_signup', data1);
};


exports.emp_thankyou = function (req, res) {
	var data1 = [];
	data1['imageURL'] = imageURL;
	data1['business_id'] = business_id.business_id;
	var seoData = {
		seoId: 1,
		title: 'Hire-Thankyou',
		description: 'Virtualhire is great place to find remote emoplyee for different category',
		keywords: 'Virtualhire, exporters, importers',
		special: ''
	};
	data1['seoData'] = seoData;
	res.render('emp-thankyou', data1);
};