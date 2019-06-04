const expectedCaches = ['static-v2'];
self.addEventListener('install', event => {
    console.log('V2 installing…');
    event.waitUntil(
        caches.open('static-v2').then(cache => {
                return cache.addAll([
                    '/',
                    'images/img2.jpg',
                    'images/img1.jpg',
                    'js/check.js',
                    'js/jquery.js',
                    'js/start.js',
                    'js/db.js',
                    'js/database.js',
                    'js/prueba.js',
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

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request))
});



/*
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            console.log(event.request);
            return caches.match(event.request);
        })
    );
});

 */