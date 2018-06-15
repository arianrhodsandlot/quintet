# Holly Quintet

[![David](https://img.shields.io/david/arianrhodsandlot/Holly-Quintet.svg)](https://github.com/arianrhodsandlot/Holly-Quintet/blob/master/package-lock.json)

## Website

[https://hollyquintet.tomaketheendofbattle.com](https://hollyquintet.tomaketheendofbattle.com)

---

## What it does

Holly Quintet is a web app used for searching albums' covers from a series of music websites.

All results are picked from [Google Images](https://www.google.com/imghp). In fact, it's just like a [reverse proxy](http://en.wikipedia.org/wiki/Reverse_proxy) of the search results of "`site:itunes.apple.com/us your-key-words`" or `"site:amazone.com your-key-words`".

---

## Development

To start an ephemeral development server run:

```sh
npm i
npm start
```

Then browse to http://localhost:1025 .

By the way, a socks5 server with port 1080 should keep running in background since Google is not always available in some region.

---

## License

MIT
