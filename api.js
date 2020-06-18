const Router = require('./router')

const BASE = 'archillect.com'
let lastID = 0

const buildURL = url => {
  const urlObj = new URL(url)
  const newURL = urlObj.href.replace(urlObj.host, BASE)
  return newURL
}

/**
 * Response with the last archillect image id
 * @param {Request} request
 */
async function lastIdHandler(request) {
  const { url } = request
  const parts = url.split('/')

  if (parts.length < 5 || !parts[3].includes('api')) {
    return new Response('Not found', { status: 404 })
  }

  const dropResponse = await fetch(buildURL('https://archillect.com/'));
  const rewriter = new HTMLRewriter();
  let flag = false;
  await rewriter
    .on('a.post', {
      element(element) {
        if (!flag) {
          lastID = element.getAttribute('href').split('/')[1]
          flag = true
        }
      },
    })
    .transform(dropResponse)
    .text()

  return new Response(JSON.stringify({lastID}), {
    headers: { 'content-type': 'text/plain' },
  })
}

/**
 * Response with a random archillect image
 * @param {Request} request
 */
async function randomHandler(request) {
  const { url } = request
  const parts = url.split('/')

  if (parts.length < 5 || !parts[3].includes('api')) {
    return new Response('Not found', { status: 404 })
  }

  const randomID = Math.floor(Math.random() * lastID) + 1;

  return Response.redirect(`https://archillect.mhsattarian.workers.dev/${randomID}/img`, 301);
}

module.exports = async function handleRequest(request) {
  const r = new Router()
  // Replace with the approriate paths and handlers
  r.get('/api/last', () => lastIdHandler(request))
  r.get('/api/random', () => randomHandler(request))

  const resp = await r.route(request)
  return resp
}
