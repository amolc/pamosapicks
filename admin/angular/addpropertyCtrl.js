app.controller(
    "addpropertyCtrl",
    function ($scope, $http, $window, $location, config) {
      
      var urlParams = new URLSearchParams(window.location.search);
      var propertyId = urlParams.get('property_id');
      $scope.baseurl = config.baseurl;
      $scope.displayedCities = 3;
      console.log(config);
  
      // Initialization function to fetch destinations and properties
      $scope.property = {};

    // Initialization function to fetch destinations and properties
    $scope.init = function() {
        console.log("index2init");
        $scope.setAgentId();
        $scope.getalldestinations();
        $scope.getallproperty();
        $scope.fetchAgentInfo();
    };

    // Function to set the agent ID from local storage
    $scope.setAgentId = function() {
        const agent_id = localStorage.getItem('agent_id'); // Retrieve agent ID
        console.log("Retrieved agent ID from local storage:", agent_id); // Debugging log

        // Ensure the property object is initialized before setting agent_id
        if (!$scope.property) {
            $scope.property = {}; // Initialize if not defined
        }

        if (agent_id) {
            $scope.property.agent_id = agent_id; // Set agent ID in property object
            console.log("Agent ID set in property object:", $scope.property.agent_id); // Debugging log
        } else {
            console.error('Agent ID not found in local storage.');
        }
    };
    

      // Function to get all properties
      $scope.getallproperty = function() {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json;"
            },
        };
  
        $http
            .get($scope.baseurl + 'property/properties/', urlconfig)
            .success(function (data, status, headers, config) {
                console.log("++++data++++++", data);
                $scope.propertyList = data.data;
            })
            .error(function (data, status, header, config) {
                console.log(data);
            });
      };
  
      $scope.fetchAgentInfo = function() {
        const agent_id = localStorage.getItem('agent_id');
    
        if (!agent_id) {
            console.error('Agent ID not found.');
            return;
        }

        console.log("Fetching info for agent ID:", agent_id);

        $http.get(config.baseurl + 'agent/get-agent/' + agent_id + '/')

            .then(function(response) {
                $scope.agentInfo = response.data.data;
                console.log('Agent Info:', $scope.agentInfo);
            })
            .catch(function(error) {
                console.error('Error fetching agent info:', error);
            });
    };


      $scope.signOut = function() {
        // Remove any stored authentication information, e.g., token or agent_id
        localStorage.removeItem('agent_id');
        
        // Optionally, you might also want to remove other data
        localStorage.clear(); // Clear all localStorage data
    
        // Redirect to the login or index page
        window.location.href = 'index.html'; // Adjust the path based on your project structure
    };
      // Function to get all destinations
      $scope.getalldestinations = function() {
        console.log("getalldestinations");
        
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
        };
        
        $http
          .get($scope.baseurl + 'destination/destinations/', urlconfig)
          .success(function (data, status, headers, config) {
            console.log("++++data++++++", data);
            $scope.destinations = data.data;
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
      };
  
       // Function to show more cities when 'Explore more' is clicked
       $scope.showMoreCities = function() {
        if ($scope.displayedCities < $scope.destinations.length) {
            $scope.displayedCities += 3; // Show 3 more cities
        }
    };
  
      // Navigate to the property detail page based on the property ID
      $scope.goToPropertyDetail = function (propertyId) {
        $window.location.href = '/detail.html?property_id=' + propertyId;
      };
      
      // Fetch the property details based on the URL parameter (property_id)
      if (propertyId) {
        $http.get($scope.baseurl + `property/properties/${propertyId}`)
          .success(function (data, status, headers, config) {
              console.log("Property details:", data);
              $scope.propertyDetail = data.data;
          })
          .error(function (data, status, header, config) {
              console.log(data);
          });
      }
    // Initialize property and amenities
  
  
  // Submit form
  $scope.submitProperty = function() {
    console.log("Property data being sent:", $scope.property);
    var amenities = Object.keys($scope.property.amenities).filter(function(key) {
      return $scope.property.amenities[key];
  });
  
    
  
   // Prepare property data
    var propertyData = {
    property_name: $scope.property.property_name,
    property_key_name: $scope.property.property_key_name,
    city: $scope.property.city,
    state: $scope.property.state,
    cost_per_night: $scope.property.cost_per_night,
    title: $scope.property.title,
    property_type: $scope.property.property_type,
    // price: $scope.property.price,
    description: $scope.property.description,
    floors: $scope.property.floors,
    num_bedrooms: $scope.property.num_bedrooms,
    num_bathrooms: $scope.property.num_bathrooms,
    guest_limit: $scope.property.guest_limit,
    meals_available: $scope.property.meals_available,
    bedroom1_image: $scope.property.bedroom1_image,
    bedroom2_image: $scope.property.bedroom2_image,
    bedroom3_image: $scope.property.bedroom3_image,
    bedroom4_image: $scope.property.bedroom4_image,
    total_bedroom_size: $scope.property.total_bedroom_size,
    square_feet: $scope.property.square_feet,
    location_url: $scope.property.location_url,
    video_url : $scope.property.video_url,
    great_for: $scope.property.great_for,
    other_images: $scope.property.other_images,
    img: $scope.property.img,
    img3: $scope.property.img3,
    address1: $scope.property.address1,
    address2: $scope.property.address2,
    pincode: $scope.property.pincode,
    agent_id: $scope.property.agent_id,
    room_name_1: $scope.property.room_name_1 || null,
    room_name_1_cost: $scope.property.room_name_1_cost || null,
    room_name_2: $scope.property.room_name_2 || null,
    room_name_2_cost: $scope.property.room_name_2_cost || null,
    room_name_3: $scope.property.room_name_3 || null,
    room_name_3_cost: $scope.property.room_name_3_cost || null,
    room_name_4: $scope.property.room_name_4 || null,
    room_name_4_cost: $scope.property.room_name_4_cost || null,
    amenities: amenities
   };

   console.log("Final property data:", propertyData);
    // Send booking data via POST request
    $http.post($scope.baseurl + 'property/properties/', propertyData)
        .then(function(response) { // Use .then() instead of .success() and .error()
            console.log("Property added successfully:", response.data);
            alert("Property successfully created!");

            // Redirect to property.html after successful addition
            $scope.redirect();
        })
        .catch(function(error) {
            console.error("AddProperty failed:", error);
            alert("AddProperty failed! Please try again.");
        });
};

// Redirect function
$scope.redirect = function() {
    console.log("Redirecting to property.html");
    window.location.href = 'property.html'; // Adjust this path if necessary
};
    }
  );
  