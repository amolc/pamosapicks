const initializeSearchElements = () => {
  $(".header-search").on('click', () => {
    $(".search-popup-wrap").slideToggle();
  });
  
  $(".search-close, .search-body-overlay").on("click", () => {
    $(".search-popup-wrap").slideUp(500);
  });
  
  $(".tp-search-toggle").on("click", () => {
    $(".tp-sidebar-area").addClass("tp-searchbar-opened");
  });
  
  $(".tpsearchbar__close, .search-body-overlay").on("click", () => { 
    $(".tp-sidebar-area").removeClass("tp-searchbar-opened");
    $(".search-body-overlay").removeClass("opened");
  });
}
