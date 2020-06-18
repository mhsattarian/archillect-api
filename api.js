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

module.exports = async function handleRequest(request) {
  const r = new Router()
  // Replace with the approriate paths and handlers
  r.get('/api/last', () => lastIdHandler(request))

  const resp = await r.route(request)
  return resp
}
