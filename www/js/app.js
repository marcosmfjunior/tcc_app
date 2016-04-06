
angular.module('starter', ['ionic','starter.controllers','starter.services','starter.filter','starter.directive','ngOpenFB','ui.router'])

.run(function($ionicPlatform,ngFB) {
  ngFB.init({appId: '238494773148832'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

   
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'//,
    //controller: 'AppCtrl'
  })

  .state('app.ofertas', {
    url: '/ofertas',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertas.html',
        controller: 'OfertasCtrl'
      }
    }
  })

  .state('app.ofertas-detail', {
    url: '/ofertas/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/oferta.html',
        controller: 'OfertaCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'        
      }
    }
  })

  .state('app.profile', {
      url: "/profile",
      views: {
          'menuContent': {
              templateUrl: "templates/profile.html",
              controller: "ProfileCtrl"
          }
      }
  })

  .state('app.cupons', {
      url: "/cupons",
      views: {
          'menuContent': {
              templateUrl: "templates/cupons.html",
              controller: "CuponsCtrl"
          }
      }
  })

   $httpProvider.interceptors.push('APIInterceptor');

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
