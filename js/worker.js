/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

self.addEventListener('push', event => {
	let promiseChain;
	if (event.data) {
		// We have data - lets use it
		promiseChain = Promise.resolve(event.data.json());
	} else {
		promiseChain = fetch('/some/data/endpoint.json')
				.then(response => response.json());
	}

	promiseChain = promiseChain.then(data => {
		return self.registration.showNotification(data.title, {
			body: data.body,
			icon: (data.icon ? data.icon : '/images/icon-192x192.png'),
			vibrate: [200, 100, 200, 100, 200, 100, 400],
			tag: data.tag
		});
	});
	event.waitUntil(promiseChain);
});