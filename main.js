"use strict";

const notificationButton = document.getElementById("enableNotifications");
const subscribeButton = document.getElementById("subscribeNotifications");
const unsubscribeButton = document.getElementById("unsubscribeNotifications");
let swRegistration = null;

initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");

    navigator.serviceWorker
      .register("sw.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);

        swRegistration = swReg;
        initializeUi();
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });
  } else {
    console.warn("Push messaging is not supported");
    notificationButton.textContent = "Push Not Supported";
  }
}

function initializeUi() {
  notificationButton.addEventListener("click", () => {
    displayNotification();
  });
  subscribeButton.addEventListener("click", () => {
    subscribePush();
  });
  unsubscribeButton.addEventListener("click", () => {
    unsubscribePush();
  });
}

function displayNotification() {
  if (!('PushManager' in window)) {
    alert('Sorry, Push notification isn\'t supported in your browser.');
    return;
  }
  if (window.Notification && Notification.permission === "granted") {
    notification();
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function subscribePush() {
  navigator.serviceWorker.ready
  .then(function(registration) {
    registration.pushManager.getSubscription()
    .catch(function (error) {
      console.error('Error occurred while enabling push ', error);
    });
    registration.pushManager.subscribe({
      userVisibleOnly: true 
    })
    .then(function (subscription) {
      toast('Subscribed successfully.');
      console.info('Push notification subscribed.');
      console.log(subscription);
    })
    .catch(function (error) {
      console.error('Push notification subscription error: ', error);
    });
  })
}

function unsubscribePush() {
  navigator.serviceWorker.ready
  .then(function(registration) {
    registration.pushManager.getSubscription()
    .then(function (subscription) {
      if(!subscription) {
        alert('Unable to unregister push notification.');
        return;
      }

      subscription.unsubscribe()
        .then(function () {
          toast('Unsubscribed successfully.');
          console.info('Push notification unsubscribed.');
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error('Failed to unsubscribe push notification.');
    });
  })
}

function notification() {
  const options = {
    body: "Testing Our Notification",
    icon: "./assets/bell.png"
  };
  swRegistration.showNotification("PWA Notification!", options);
}
