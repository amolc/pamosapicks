app.controller("editpropertyCtrl", function ($scope, $http, $window, $location, config) {
  var urlParams = new URLSearchParams(window.location.search);
  var propertyId = urlParams.get('property_id');
  $scope.baseurl = config.baseurl;
  $scope.displayedCities = 3;
  console.log(config);

  // Initialization function to fetch destinations and properties
  $scope.init = function () {
      console.log("index2init");
      // $scope.getalldestinations();
      $scope.getallproperty();
      $scope.fetchAgentInfo();
  };

  // Function to get all properties
  $scope.getallproperty = function () {
      var urlconfig = {
          headers: {
              "Content-Type": "application/json;"
          },
      };

      $http
          .get($scope.baseurl + 'property/properties/', urlconfig)
          .then(function (response) {
              console.log("++++data++++++", response.data);
              $scope.propertyList = response.data.data;
          })
          .catch(function (error) {
              console.log(error);
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


  // Navigate to the property detail page based on the property ID
  $scope.goToPropertyDetail = function (propertyId) {
      $window.location.href = '/detail.html?property_id=' + propertyId;
  };

  // Initialize your property object
  $scope.property = {
      property_name: '',
      property_type: '',
      cost_per_night: '',
      description: '',
      floors: 0,
      num_bedrooms: 0,
      num_bathrooms: 0,
      guest_limit: 0,
      meals_available: '',
      bedroom1_image: '',
      bedroom2_image: '',
      bedroom3_image: '',
      bedroom4_image: '',
      total_bedroom_size: '',
      square_feet: '',
      location_url: '',
      great_for: '',
      other_images: '',
      img:'',
      img3:'',
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      room_name_1:'',
      room_name_1_cost:'',
      room_name_2:'',
      room_name_2_cost:'',
      room_name_3:'',
      room_name_3_cost:'',
      room_name_4:'',
      room_name_4_cost:'',
      amenities: {}
  };

  // Fetch the property details based on the URL parameter (property_id)
  if (propertyId) {
    $http.get($scope.baseurl + `property/properties/${propertyId}`)
        .then(function (response) {
            console.log("Property details fetched:", response.data);
            $scope.property = response.data.data;

            // Default amenities list
            const defaultAmenities = [
                'Swimming Pool', 'Lawn', 'BBQ', 'Air Conditioner',
                'Parking', 'Water Purifier', 'Indoor Games',
                'Driver/Staff', 'Bar', 'Pet Friendly', 'Towels'
            ];

            // Ensure amenities object is initialized
            if (!$scope.property.amenities) {
                $scope.property.amenities = {};
            }

            // Initialize missing amenities to `false` if they are not already set
            defaultAmenities.forEach(function (amenity) {
                if (typeof $scope.property.amenities[amenity] === 'undefined') {
                    $scope.property.amenities[amenity] = false;
                }
            });

        })
        .catch(function (error) {
            console.error("Error fetching property details:", error);
        });
 }

 

  // Submit the updated property data
  $scope.submitProperty = function () {
      

      // Prepare property data
      var propertyData = {
          property_name: $scope.property.property_name,
          property_key_name: $scope.property.property_key_name,
          city: $scope.property.city,
          state: $scope.property.state,
          cost_per_night: $scope.property.cost_per_night,
          title: $scope.property.title,
          property_type: $scope.property.property_type,
          price: $scope.property.price,
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
          great_for: $scope.property.great_for,
          other_images: $scope.property.other_images,
          img: $scope.property.img,
          img3: $scope.property.img3,
          address1: $scope.property.address1,
          address2: $scope.property.address2,
          pincode: $scope.property.pincode,
          agent_id: $scope.property.agent_id,
          room_name_1: $scope.property.room_name_1,
          room_name_1_cost: $scope.property.room_name_1_cost,
          room_name_2: $scope.property.room_name_2,
          room_name_2_cost: $scope.property.room_name_2_cost,
          room_name_3: $scope.property.room_name_3,
          room_name_3_cost: $scope.property.room_name_3_cost,
          room_name_4: $scope.property.room_name_4,
          room_name_4_cost: $scope.property.room_name_4_cost,
          amenities: $scope.property.amenities
      };

      // Send updated property data via PATCH request
      $http.patch($scope.baseurl + `property/properties/${propertyId}/`, propertyData)
            .then(function(response) {
                console.log("Property updated successfully:", response.data);
                alert("Property successfully updated!");
                
                // Redirect to property.html after successful update
                $scope.redirect();
            })
            .catch(function(error) {
                console.error("Update failed:", error);
                alert("Update failed! Please try again.");
            });
    };

    // Redirect function
    $scope.redirect = function() {
        console.log("Redirecting to property.html");
        window.location.href = 'property.html'; // Adjust the path as necessary
    };

  // Initialize the page by fetching destinations and properties
  $scope.init();
});
