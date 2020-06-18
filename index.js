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
  console.log('this is a image response');
  console.log(url);
  
  const dropURL = parts.slice(0, 4).join('/');
  const dropResponse = await fetch(buildURL(dropURL));
  const dropHTML = await dropResponse.text();
  const dropOgImage = dropHTML.split('\n').find(line => line.includes('og:image'));
  const dropParts = dropOgImage.split('"');
  const contentIndex = dropParts.findIndex(part => part.includes('content='));
  const imagePath = dropParts[contentIndex+1];
  console.log(imagePath);
  return fetch(imagePath);

  // return new Response(JSON.stringify(parts), {
  //   headers: { 'content-type': 'text/plain' },
  // })
}
