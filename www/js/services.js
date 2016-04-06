angular.module('starter.services', [])

.factory('autentica',['$http', function($http){
    var urlBase = 'http://localhost:8080/authenticate';
    var dados = {};

    dados.login = function(user){
        return $http.post(urlBase, user).then(function(result){
          return result;            
        });
    };

    return dados;
}])

.factory('user', ['$http', function($http) {
  
    var urlBase = 'http://localhost:8080/api/usuarios';
    var dados = {};

    dados.getUsers = function () {
        return $http.get(urlBase);
    };

    dados.getUser = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    dados.insertUser = function (cust) {
        return $http.post(urlBase, cust).then(function(result){
          return result;            
        });
    };

    dados.updateUser = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    dados.deleteUser = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    dados.getOrders = function (id) {
        return $http.get(urlBase + '/' + id + '/orders');
    };
    return dados;
}])

.factory('oferta', ['$http', function($http) {
console.log($http.defaults.headers);
  
    //var urlBase = 'http://agenda53.com.br/teste/user.php';
    var urlBase = 'http://localhost:8080/api/ofertas';    
    var dados = {};

    dados.getOfertas = function () {
        //return $http.get(urlBase});//no lado do servidor faz a verficaçao se o usuario ja pegou cupom de tal oferta        
        return $http.get(urlBase);
    };

    dados.getOferta = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    dados.insertOferta = function (cust) {
        return $http.post(urlBase, cust).then(function(result){
          return result;            
        });
    };

    dados.updateOferta = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    dados.deleteOferta = function (id) {
        return $http.delete(urlBase + '/' + id);
    };
    
    console.log(dados);
    return dados;
}])

  .factory('categorias', function($http, $q) {
    var urlBase = 'http://localhost:8080/api/categorias';    
    var dados = {};

    dados.getCategorias = function () {
        return $http.get(urlBase);
    };

    dados.getCategoria = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    dados.insertCategoria = function (cust) {
        return $http.post(urlBase, cust).then(function(result){
          return result;            
        });
    };

    dados.updateCategoria = function (id,dado) {
        return $http.put(urlBase + '/' + id, dado)
    };

    dados.deleteCategoria = function (id) {
        return $http.delete(urlBase + '/' + id);
    };
    
    return dados;
  })

.factory('cupom', ['$http', function($http) {
  
    var urlBase = 'http://localhost:8080/api/cupons';        
    var dados = {};

    dados.getCupoms = function () {
        return $http.get(urlBase);
    };

    dados.getCupom = function (idOferta,idUser,dados) {
        console.log(dados);
        return $http.get(urlBase + '/' + idOferta + '/' + idUser,{params:{dado: dados}});//no lado do servidor faz a verficaçao se o usuario ja pegou cupom de tal oferta
    };

    dados.insertCupom = function (cust) {
        return $http.post(urlBase, cust).then(function(result){
          return result;            
        });
    };

    dados.updateCupom = function (cust) {
        return $http.put(urlBase + '/' + cust.ID, cust)
    };

    dados.deleteCupom = function (id) {
        return $http.delete(urlBase + '/' + id);
    };
    
    console.log(dados);
    return dados;
}])

.factory('sessionInjector', ['$localstorage', function($localstorage) {  
    var sessionInjector = {
        request: function(config) {
            var token = $localstorage.get('token');
            if(token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        }
    };
    return sessionInjector;
}])

.service('APIInterceptor', function($rootScope,$localstorage) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            var token = $localstorage.get('token');
            if (token) {
              // may also use sessionStorage
                //config.headers.Authorization = $localstorage.get('token');
                config.headers['x-access-token'] = token;

            }
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401) {
                //  Redirect user to login page / signup Page.
            }
            return response || $q.when(response);
        }
    };
})

.factory('tokenInjector',['$localstorage',function($localstorage){
    console.log("ham");
    return{
        request: function(config){
            var token = $localstorage.get('token');
            if(token){   
                config.headers['x-access-token'] = token;
            }
            return config;
        }
    }
}])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('Toast', function($rootScope, $timeout, $ionicPopup, $cordovaToast) {
      return {
          show: function (message, duration, position) {
            message = message || "";
            duration = duration || 'short';
            position = position || 'bottom';

            if (!!window.cordova) {
              // Use the Cordova Toast plugin
          $cordovaToast.show(message, duration, position);              
            }
            else {
                    if (duration == 'short') {
                        duration = 2000;
                    }
                    else {
                        duration = 5000;
                    }
            }
      }
    };
  })


;
