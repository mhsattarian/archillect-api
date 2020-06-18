const Router = require('./router')

const BASE = 'archillect.com'
let lastID = 0

const buildURL = url => {
  const urlObj = new URL(url)
  const newURL = urlObj.href.replace(urlObj.host, BASE)
  return newURL
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function lastHandler(request) {
  const { url } = request
  const parts = url.split('/')

  if (parts.length < 5 || !parts[3].includes('api')) {
    // this is a regular request. forward it.
    return new Response('Not found', { status: 404 })
  }

  // otherwise take it a content respose, we need to fetch it and return the image
  // const dropURL = parts.slice(0, 4).join('/');
  const dropResponse = await fetch(buildURL('https://archillect.com/'))

  const rewriter = new HTMLRewriter()
  let flag = false
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

  return new Response(`${lastID}`, { status: 404 })

  // return new Response(JSON.stringify(parts), {
  //   headers: { 'content-type': 'text/plain' },
  // })
}

async function handler(request) {
  return new Response(JSON.stringify(request), {
    headers: { 'content-type': 'text/plain' },
  })
}

module.exports = async function handleRequest(request) {
  const r = new Router()
  // Replace with the approriate paths and handlers
  // r.get('/', () => fetch(buildURL(url))) // return a default message for the root route
  r.get('/api/last', () => lastHandler(request))
  r.get('/api/', () => handler(request))
  // r.get('/api/.*', () => imgHandler(request))

  const resp = await r.route(request)
  return resp
}
