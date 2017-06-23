/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

self.addEventListener('push', function(event) {
  const promiseChain = getData(event.data)
  .then(data => {
    return self.registration.getNotifications({tag: data.tag})
    .then(notifications => {
      var noteOptions = {
        body: data.body,
        icon: (data.icon ? data.icon : '/images/ic_flight_takeoff_black_24dp_2x.png'),
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        tag: data.tag,
        data: data
        };

      if (notifications.length > 0) {
        data.title = "Flight Updates";
        noteOptions.body = "There are several updates regarding your flight, 5212 to Kansas City.";
        noteOptions.renotify = true;
        noteOptions.actions = [
          {action: 'view', title: 'View updates'},
          {action: 'notNow', title: 'Not now'}
        ];
      }

      return self.registration.showNotification(data.title, noteOptions);
    });
  });
  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'confirm') {
    var fetchOptions = {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: event.notification.data.confirmation_id
    };
    var confirmation = new Request('/back/end/system/confirm');
    event.waitUntil(fetch(confirmation, fetchOptions));
    return; // So we don't open the page when we don't need to.
  } else if (event.action === 'change') {
    var appUrl = '?confirmation_id=' +
      event.notification.data.confirmation_id + '#reschedule';
  } else {
    var appUrl = '/';
  }

  event.waitUntil(clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
    }).then( activeClients => {
      if (activeClients.length > 0) {
        activeClients[0].navigate(appUrl);
        activeClients[0].focus();
      } else {
        clients.openWindow(appUrl);
      }
    })
  );
});