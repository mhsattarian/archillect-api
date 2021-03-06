# Archillect API

[![Header image](/assets/header.png)](https://archillect.mhsattarian.workers.dev/)

[Archillect](https://archillect.com) (Archive + Intellect) is an awesome AI aimed to discover and share stimulating visual contents (images and GIFs).

[Archillect API](https://archillect.mhsattarian.workers.dev/) uses [Cloudflare workers](https://workers.cloudflare.com/) as an Intermediate layer to add the following options to the platform:

- [`:id/img`](https://archillect.mhsattarian.workers.dev/1/img) endpoint to access raw image files
- `Download` button on image pages to access above endpoint more easily
- [`/api/last`](https://archillect.mhsattarian.workers.dev/api/last) api endpoint to fetch the last archillect image ID
- [`/api/random`](https://archillect.mhsattarian.workers.dev/api/random) api endpoint to fetch a random raw image

so Archillect API is actually exactly as Archillect website, with only the above few modifications.

Also, contents are hosted on tumblr so images are not actually raw, cause highest quality availeble to public is somewhere around `1280px` ([more details](https://stackoverflow.com/a/16836223/5863267)) as images width.
