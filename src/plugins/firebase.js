import { initializeApp } from "firebase/app"
import {getMessaging, onMessage} from "firebase/messaging"
//import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
    apiKey: "AIzaSyC2qd2fKZyJB-17y-3cDgigKJyMa9IYvas",
    authDomain: "infinity-crm-783fe.firebaseapp.com",
    projectId: "infinity-crm-783fe",
    storageBucket: "infinity-crm-783fe.appspot.com",
    messagingSenderId: "406570611493",
    appId: "1:406570611493:web:941a4be9b40f767cb6e0cc",
    measurementId: "G-M18WWX4FN8"
};

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

onMessage(messaging, (payload) => {
    //console.log('Message received.3 ', payload);
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
    const message = new Notification(notificationTitle, notificationOptions);
    message.addEventListener('click', function() {
        window.location.href = data.link;
    });
});

