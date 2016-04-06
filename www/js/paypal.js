var app = {
   // Application Constructor
   initialize: function() {
       this.bindEvents();
   },
   // Bind Event Listeners
   //
   // Bind any events that are required on startup. Common events are:
   // 'load', 'deviceready', 'offline', and 'online'.
   bindEvents: function() {
       document.addEventListener('deviceready', this.onDeviceReady, false);
   },
   // deviceready Event Handler
   //
   // The scope of 'this' is the event. In order to call the 'receivedEvent'
   // function, we must explicity call 'app.receivedEvent(...);'
   onDeviceReady: function() {
       app.receivedEvent('deviceready');
   },
   // Update DOM on a Received Event
   receivedEvent: function(id) {
       var parentElement = document.getElementById(id);
       var listeningElement = parentElement.querySelector('.listening');
       var receivedElement = parentElement.querySelector('.received');

       listeningElement.setAttribute('style', 'display:none;');
       receivedElement.setAttribute('style', 'display:block;');

       console.log('Received Event: ' + id);

       // start to initialize PayPalMobile library
       app.initPaymentUI();
   },
   initPaymentUI : function () {
     var clientIDs = {
       "PayPalEnvironmentProduction": "ATmHAgc4r9tLPlIQ3pC7Coi3e5vYnbqJsl0YcfWbkej-aZpEuw_LpeQdsD_5YFlIH8fpB5d89UhSANgC",
       "PayPalEnvironmentSandbox": "AXbwCFREGQ5hSeq3-5SatXo5JIjV5ToalVGVQRjM7WozCk_pUU1R8-bF1GvavLBs_TDwvIy1LG0R0elh"
     };
     PayPalMobile.init(clientIDs, app.onPayPalMobileInit);

   },
   onSuccesfulPayment : function(payment) {
     console.log("payment success: " + JSON.stringify(payment, null, 4));
   },
   onAuthorizationCallback : function(authorization) {
     console.log("authorization: " + JSON.stringify(authorization, null, 4));
   },
   createPayment : function () {
     // for simplicity use predefined amount
     // optional payment details for more information check [helper js file](https://github.com/paypal/PayPal-Cordova-Plugin/blob/master/www/paypal-mobile-js-helper.js)
     var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
     var payment = new PayPalPayment("50.00", "USD", "Awesome Sauce", "Sale", paymentDetails);
     return payment;
   },
   configuration : function () {
     // for more options see `paypal-mobile-js-helper.js`
     var config = new PayPalConfiguration({merchantName: "My test shop", merchantPrivacyPolicyURL: "https://mytestshop.com/policy", merchantUserAgreementURL: "https://mytestshop.com/agreement"});
     return config;
   },
   onPrepareRender : function() {
     // buttons defined in index.html
     //  <button id="buyNowBtn"> Buy Now !</button>
     //  <button id="buyInFutureBtn"> Pay in Future !</button>
     //  <button id="profileSharingBtn"> ProfileSharing !</button>
     var buyNowBtn = document.getElementById("buyNowBtn");
     var buyInFutureBtn = document.getElementById("buyInFutureBtn");
     var profileSharingBtn = document.getElementById("profileSharingBtn");

     buyNowBtn.onclick = function(e) {
       // single payment
       PayPalMobile.renderSinglePaymentUI(app.createPayment(), app.onSuccesfulPayment, app.onUserCanceled);
     };

     buyInFutureBtn.onclick = function(e) {
       // future payment
       PayPalMobile.renderFuturePaymentUI(app.onAuthorizationCallback, app.onUserCanceled);
     };

     profileSharingBtn.onclick = function(e) {
       // profile sharing
       PayPalMobile.renderProfileSharingUI(["profile", "email", "phone", "address", "futurepayments", "paypalattributes"], app.onAuthorizationCallback, app.onUserCanceled);
     };
   },
   onPayPalMobileInit : function() {
     // must be called
     // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
     PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", app.configuration(), app.onPrepareRender);
   },
   onUserCanceled : function(result) {
     console.log(result);
   }
};

app.initialize();