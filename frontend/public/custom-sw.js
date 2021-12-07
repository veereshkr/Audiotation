var url=''
self.addEventListener('push', event => {
  const data = event.data.json()
  //console.log('New notification', data)
   url = data.url
  const options = {

    body: data.body,
    icon:data.iconUrl,
    requireInteraction: true,
    timestamp: new Date(),
    tag:data.tag,
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
   //  actions: [
   // {action: 'like', title: '👍Like'},
   // {action: 'reply', title: '⤻ Reply'}]


  }
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

self.addEventListener('notificationclick', function(event) {
  var messageId = event.notification.data;

  event.notification.close();

  // if (event) {
  //     if(!url){
  //         clients.openWindow('https://audiotationtech.in/home/')
  //     }else{
  //         clients.openWindow(url);
  //     }
  //
  //
  //   //silentlyLikeItem();
  //   }else{
  //       clients.openWindow('https://audiotationtech.in/home/')
  //   }
  // else if (event.action === 'reply') {
  //   clients.openWindow("/messages?reply=" + messageId);
  // }
  // else {
  //   clients.openWindow("/messages?reply=" + messageId);
  // }
}, false);
