/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/service_worker/socket.io.min.js',
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			var notification = new Notification('hi', {
				body: 'body',
			});

			notification.onclick = function () {
				notification.close();
			}
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
});