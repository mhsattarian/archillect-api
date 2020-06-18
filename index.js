const Router = require('./router')
const apiHandler = require('./api')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const BASE = 'archillect.com'

const buildURL = url => {
  const urlObj = new URL(url)
  const newURL = urlObj.href.replace(urlObj.host, BASE)
  return newURL
}

/**
 * Response with the raw image
 * @param {Request} request
 */
async function imgDownloaderHandler(request) {
  const { url } = request
  const parts = url.split('/')

  if (parts.length !== 5 || !parts[4].includes('img')) {
    // this is a regular request. forward it.
    return fetch(buildURL(url))
  }

  // otherwise take it a content respose, we need to fetch it and return the image
  const dropURL = parts.slice(0, 4).join('/');
  const dropResponse = await fetch(buildURL(dropURL))

  const rewriter = new HTMLRewriter()
  let imagePath = ''
  await rewriter
    .on('meta[property="og:image"]', {
      element(element) {
        imagePath = element.getAttribute('content')
      },
    })
    .transform(dropResponse)
    .text();
    
  return fetch(imagePath)

  // return new Response(JSON.stringify(parts), {
  //   headers: { 'content-type': 'text/plain' },
  // })
}

/**
 * Adds a download button to image #sources section
 * @param {Request} request
 */
async function imgHandler(request) {
  const { url } = request
  const parts = url.split('/')
  const dropResponse = await fetch(buildURL(url))
  const rewriter = new HTMLRewriter()
  return rewriter
    .on('#sources', {
      element(element) {
        element.prepend(`<a style="width: auto;padding: 0 1em;" href="/${parts[3]}/img">Download</a>`,
          { html: true },
        )
      },
    })
    .transform(dropResponse)
}

/**
 * Adds a download button to image #sources section
 * @param {Request} request
 */
async function mainHandler(request) {
  const { url } = request
  return fetch(buildURL(url))
}

/**
 * main Handler which controls the routes
 * @param {Request} request
 */
async function handleRequest(request) {
  const r = new Router()
  // Replace with the approriate paths and handlers
  r.get('/api/.*', () => apiHandler(request))
  r.get('/.[0-9]*/img', () => imgDownloaderHandler(request))
  r.get('/.[0-9]*', () => imgHandler(request))
  r.get('/.*', () => mainHandler(request))

  const resp = await r.route(request)
  return resp
}
