/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

self.addEventListener('push', event => {
	event.waitUntil(
		self.registration.showNotification(title, {
			body: 'Are you free tonight?',
			icon: 'images/joe.png',
			vibrate: [200, 100, 200, 100, 200, 100, 400],
			tag: 'request',
			actions: [
				{action: 'yes', title: 'Yes!', icon: 'images/thumb-up.png'},
				{action: 'no', title: 'No', icon: 'images/thumb-down.png'}
			]
		})
	);
});