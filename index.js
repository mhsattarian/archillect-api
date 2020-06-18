addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

const BASE = 'archillect.com'

const buildURL = url => {
  const urlObj = new URL(url);
  const newURL = urlObj.href.replace(urlObj.host, BASE);
  return newURL;
}


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const { url } = request;
  const parts = url.split('/');

  
  if (parts.length !== 5 || !parts[4].includes('img')) {
    // this is a regular request. forward it.
    return fetch(buildURL(url));
  }
  
  // otherwise take it a content respose, we need to fetch it and return the image 
  const dropURL = parts.slice(0, 4).join('/');
  const dropResponse = await fetch(buildURL(dropURL));
  
  const rewriter = new HTMLRewriter();
  let imagePath = '';
  await rewriter.on('meta[property="og:image"]',{
    element(element) {
      imagePath = element.getAttribute('content');
    }
  }).transform(dropResponse).text();
  
  return fetch(imagePath);

  // return new Response(JSON.stringify(parts), {
  //   headers: { 'content-type': 'text/plain' },
  // })
}
