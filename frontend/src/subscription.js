const convertedVapidKey = urlBase64ToUint8Array("BNaNS34wTu2yDITyrDYB5FXSXilId2PyULKT_iJ4kdn3QNXdNtE8o2AxLmKYakQceWHSqe02pgjmMEbuUIZEch4")

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function sendSubscription(subscription, username) {
    var sub = subscription
    var pair = {username:username}
    var combined = {
    sub: sub,
    pair: pair
}

    var s = JSON.stringify(combined)
  console.log('- -')
  return fetch('https://api.audiotationtech.in:8443/api/subscribe', {
    method: 'POST',
    body: s,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function subscribeUser(username) {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }

      registration.pushManager.getSubscription().then(function(existedSubscription) {
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.')
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
          }).then(function(newSubscription) {
            //console.log('New subscription added.', username)
            sendSubscription(newSubscription, username)
          }).catch(function(e) {
            if (Notification.permission !== 'granted' ) {
              console.log('Permission not granted.')
            } else {
              console.error('An error ocurred during subscription process.', e)
            }
          })
        } else {

          sendSubscription(existedSubscription,  username)
        }
      })
    })
      .catch(function(e) {
        console.error('An error ocurred during Service Worker registration.', e)
      })
  }
}
