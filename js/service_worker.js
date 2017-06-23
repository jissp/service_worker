/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var serviceWorkerClass = {
	registration : null,
	init : function() {
		if ( this.isServiceWorker() ) {
			this.askPermission().then(function() {
				// 서비스 워커 등록
				navigator.serviceWorker.register('./js/worker.js').then(function(registration) {
					console.log('ServiceWorker registration successful with scope: ', registration.scope);
					return serviceWorkerClass.registration = registration;
				}).catch(function (err) {
					console.log('ServiceWorker registration failed: ', err);
				});
			}, function() {
				// reject
			});
		} else {
			alert('사용할 수 없는 브라우저입니다.');
		}
	},
	/* notification 알림 설정 */
	askPermission : function() {
		return new Promise(function (resolve, reject) {
			// 알림 요청
			const permissionResult = Notification.requestPermission(function (result) {
				resolve(result);
			});

			// 이미 수락 / 거절 누른 상태일 경우 처리
			if ( permissionResult ) {
				permissionResult.then(resolve, reject);
			}
		})
		.then(function (permissionResult) {
			if (permissionResult !== 'granted') {
				throw new Error('We weren\'t granted permission.');
			}
		});
	},
	isServiceWorker : function() {
		return (!! navigator.serviceWorker);
	}
}

serviceWorkerClass.init();