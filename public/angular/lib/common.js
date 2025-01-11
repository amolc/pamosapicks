const jsonToQueryString = params => {
  return Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');
}

const navigateToPage = page => {
  const url = new URL(window.location.href);
  url.searchParams.set('page', page);
  window.location.assign(url);
}

const urlParams = Object.fromEntries(
  new URLSearchParams(window.location.search)
);
