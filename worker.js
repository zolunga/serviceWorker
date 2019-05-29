const expectedCaches = ['static-v2'];
self.addEventListener('install', event => {
    console.log('V1 installing…');

    // cache a cat SVG
    event.waitUntil(
        caches.open('static-v2').then(cache => {
            return cache.addAll([
            '/',
            'images/img2.jpg',
            'images/img1.jpg',
            'js/check.js',
            'js/start.js',
            'index.html',
            'dos.html',
            ]).then(() => self.skipWaiting())
        }
        )
    );
});

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!expectedCaches.includes(key)) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('V2 now ready to handle fetches!');
            //caches.open('Data').then(cache => cache.add('val'));
        })
    );

});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    console.log(url.href);
    // serve the cat SVG from the cache if the request is
    // same-origin and the path is '/dog.svg'
    console.log(url.pathname + '==' + 'images/img1.jpg');
    if (url.pathname.localeCompare('/images/img1.jpg') === 0) {
        console.log(true);
        event.respondWith(caches.match('images/img2.jpg'));
    }
    if (url.pathname.localeCompare('/index.html') === 0) {
        console.log(true);
        event.respondWith(caches.match('index.html'));
    }
    if (url.pathname.localeCompare('/js/check.js') === 0) {
        console.log(true);
        event.respondWith(caches.match('js/check.js'));
    }
    if (url.pathname.localeCompare('/js/start.js') === 0) {
        console.log(true);
        event.respondWith(caches.match('js/start.js'));
    }
});

