$scope.initializeHeader = () => {
      /**
       * Depends on: 
       *  - lib/cart.js.
       *  - lib/search.js.
       */
      initializeCartElements();
      initializeSearchElements();
    };