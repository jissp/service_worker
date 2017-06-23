/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var serviceWorkerClass = {
	registration : null,
	init : function() {
		if ( this.isServiceWorker() ) {
			// 서비스 워커 등록
			navigator.serviceWorker.register('./js/worker.js').then(function(registration) {
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
				serviceWorkerClass.registration = registration;
				return registration;
			}).catch(function (err) {
				console.log('ServiceWorker registration failed: ', err);
			});
		} else {
			alert('사용할 수 없는 브라우저입니다.');
		}
	},
	/* notification 알림 설정 */
	askPermission : function() {
		return new Promise(function (resolve, reject) {
			const permissionResult = Notification.requestPermission(function (result) {
				resolve(result);
			});

			if (permissionResult) {
				permissionResult.then(resolve, reject);
			}
		})
		.then(function (permissionResult) {
			if (permissionResult === 'granted') {
				console.log('Granted!');
			} else {
				throw new Error('We weren\'t granted permission.');
			}
		});
	},
	/* Push 사용자 등록 */
	subscribeUserToPush : function() {
		return this.init().then(function (registration) {
			const subscribeOptions = {
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					'BH3058mPbrdNUFKyDt7-TNi0mAgbOx-WapuVQwfrMRO4HgjtBjyA5Ie5DoMCnM9HU0JDbfMgZ3G-CAa7nsujMQI'
				)
			};
			return registration.pushManager.subscribe(subscribeOptions);
		})
		.then(function (pushSubscription) {
			console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
			return pushSubscription;
		});
	},
	isServiceWorker : function() {
		return (!! navigator.serviceWorker);
	}
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
			.replace(/\-/g, '+')
			.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

var res = serviceWorkerClass.subscribeUserToPush();
console.log(res);