importScripts("https://www.gstatic.com/firebasejs/9.6.9/firebase-app-compat.js")
importScripts('https://www.gstatic.com/firebasejs/9.6.9/firebase-messaging-compat.js')
//importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-analytics-compat.js')

var firebaseConfig = {
    apiKey: "AIzaSyC2qd2fKZyJB-17y-3cDgigKJyMa9IYvas",
    authDomain: "infinity-crm-783fe.firebaseapp.com",
    projectId: "infinity-crm-783fe",
    storageBucket: "infinity-crm-783fe.appspot.com",
    messagingSenderId: "406570611493",
    appId: "1:406570611493:web:941a4be9b40f767cb6e0cc",
    measurementId: "G-M18WWX4FN8"
}

firebase.initializeApp(firebaseConfig)
//firebase.analytics()

const messaging = firebase.messaging()


messaging.onBackgroundMessage((payload) => {
    // console.log(
    //     '[firebase-messaging-sw.js] 1 Received background message ',
    //     payload
    // );

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = {...payload.notification, ...payload.data};
    const notificationTitle = data.title;
    let notificationOptions = {
        body: data.body,
        requireInteraction: true,
        data
    }
    if (data.icon) {
        notificationOptions.icon = data.icon
    }

    if (data.image) {
        notificationOptions.image = data.image
    }
    if (data.click_action) {
        notificationOptions.click_action = data.click_action
    }

    self.registration.showNotification(notificationTitle,  notificationOptions);

    self.addEventListener('notificationclick', (event) => {

        if(event.notification && event.notification.data && event.notification.data.link){
            event.notification.close();
            event.waitUntil(self.clients.openWindow(event.notification.data.link));
        }
    });
    self.addEventListener('install', (e) => {
        console.log(`** Installation du service worker firebase-messaging-sw.js`);
        self.skipWaiting(); //Force activation si MAJ
    });

    self.addEventListener('activate', (e) => {
        console.log(`** Activation du service worker firebase-messaging-sw.js`);
    });

});


