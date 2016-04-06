angular.module('starter.controllers', [ 'ngOpenFB'])

.controller('LoginCtrl', function($scope, $ionicModal, $localstorage, $timeout, ngFB,$http, $state, user, autentica) {
  var token = $localstorage.get('token');  
  if(token){         
    $state.go('app.ofertas');                
  }

  $scope.fbLogin = function () {
      ngFB.login({scope: 'email,public_profile,user_birthday,user_location'}).then(
          function (response) {
              if (response.status === 'connected') {

                  getInfo_Salva(response.authResponse.accessToken);                  
                  console.log(response.authResponse.accessToken);
                  //$scope.closeLogin();

              } else {
                  alert('Facebook login failed');
              }
          });
  };

  function getInfo_Salva(token){
    ngFB.api({
        path: '/me',
        params: {fields: 'id,email,birthday,name,gender,location'}
    }).then(
        function (dados_fb) {
          var dados = {
              nome: dados_fb.name,
              email: dados_fb.email,
              senha: token
          };            
            console.log(dados);
            user.insertUser(dados).then(function(res){
              console.log(res);
              if(res.data.op == true){//verifica se info retornada do server é verdadeira(incluiu os dados)
                $localstorage.set('userId', res.data.user);
                console.log($localstorage.get('userId'));
                $state.go('app.ofertas');                
              } 
              else 
                  console.log('false');
            });     
        },
        function (error) {
          alert("nao foi   "+error);
            alert('Facebook error: ' + error.error_description);
        });
  }
  $scope.fbLogout = function (){
    ngFB.logout().then(
      function (response) {
        console.log(response);
    });   
  };

  $scope.login = function(){
    autentica.login($scope.loginData).then(function(res){
        console.log(res);
      
      if(res.data.success == true){
        $localstorage.set('token', res.data.token);
        console.log($localstorage.get('token'));     
        $http.defaults.headers.common['Auth-Token'] = res.data.token;
        console.log($http.defaults.headers);
        closeLogin();
      }
    })
  }

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $state.go('app.ofertas');
  };


})

.controller('ProfileCtrl', function ($scope, ngFB,user, $state) {
    ngFB.api({
        path: '/me',
        params: {fields: 'id,email,birthday,name,gender,location'}
    }).then(
        function (user) {
            $scope.user = user;
            $scope.user.birthday = new Date($scope.user.birthday);
            console.log(user);
        },
        function (error) {
          alert("nao foi   "+error);
            alert('Facebook error: ' + error.error_description);
        });


  $scope.insertUser = function () {
    var dados = {
        nome: $scope.user.name,
        email: $scope.user.email,
        senha: $scope.user.senha,
        cidade: $scope.user.location.name,
        cpf: $scope.user.cpf,
        telefone: $scope.user.telefone,
        aniversario: $scope.user.birthday
    };
    user.insertUser(dados).then(function(res){
      if(res.data == 1) //verifica se info retornada do server é verdadeira(incluiu os dados)
          $state.go('app.ofertas');
        else 
          console.log('false');
    });                        
  };   
})

.controller('OfertasCtrl', function ($scope, oferta, categorias, $state, $ionicModal) {
    
  $scope.categoriasDisponivel = [];
  $scope.ofertasDeHoje = true;

  //$scope.diasSema=[{"dia":"SEG"},{"dia":"TER"},{"dia":"QUA"},{"dia":"QUI"},{"dia":"SEX"},{"dia":"SAB"},{"dia":"DOM"}];

  categorias.getCategorias().then(function(res){
    if(res){
      $scope.categorias = res.data;
      console.log($scope.categorias);
      geraCategoriasFiltro();
    }
    else
      console.log("nao");
  });

  function geraCategoriasFiltro(){
    for(var i=0;i< $scope.categorias.length; i++){
      var cat = {"_id":$scope.categorias[i]._id, "nome":$scope.categorias[i].nome, "mostra":true};
      $scope.categoriasDisponivel.push(cat);     
    }
  }  

  $scope.toggleAltera = function(){
     if($scope.ofertasDeHoje == false) {
     $scope.ofertasDeHoje = true;  
     }
     else
       $scope.ofertasDeHoje = false;
   };
  // fim inputs do modal

  oferta.getOfertas().then(function(res){
    console.log(res.data);
    if(res)
      $scope.ofertas = res.data;
    else
      console.log("nao");
  });

  $ionicModal.fromTemplateUrl('templates/modal_filtro.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.abreFiltro = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  }); 

  $scope.verOferta = function(idOferta){
    $state.go('app.ofertas-detail',{id:idOferta});
  }  

  
})

.controller('OfertaCtrl', function ($scope, oferta, cupom, $state, $stateParams, $ionicPopup,$ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicLoading){
  $ionicSlideBoxDelegate.update();
  $scope.onUserDetailContentScroll = onUserDetailContentScroll

  oferta.getOferta($stateParams.id).then(function(res){
    if(res)
      $scope.oferta = res.data;
    else
      console.log("nao");
  console.log($scope.oferta);
  console.log($scope.oferta.diasValidos[1]);
  });

  // $scope.oferta = 
  // {'id':'1','nome':'Hamburguer grande + Coca-Cola Média + Batata frita Grande','estabelecimento':'Burger-King','validade': '15/12','categoria':'alimentacao','desconto':'1','diasValidos':{'1':true,'2':false,'3':true,'4':false,'5':true,'6':true,'7':true,},'imagem':'https://img.peixeurbano.com.br/?img=https://s3.amazonaws.com/pu-mgr/default/a0RG000000eftxbMAA/553fbe53e4b0392bfc8ab196.jpg&w=620&h=400','logo':'http://alscib.com.br/wp-content/uploads/2015/08/Burger-KIng.jpg','empresa':'EmPrEsa','descricao':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'};
  
  // var idOferta = $scope.oferta.id;
  $scope.diaValido= function(dia){
    if($scope.oferta.diasValidos[dia] == true)
      return "valido";
    else
      return "";
    //if($scope.oferta.diasValidos)
  }

  $scope.getCupom = function (idOferta,idUser) {
    $ionicLoading.show({
      noBackdrop:true,
      template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>'
    });
    console.log(idOferta);
    console.log(idUser);
    idUser = $localstorage.get('userId');
      
     cupom.getCupom(idOferta,idUser,$scope.oferta).then(function(res){
      $ionicLoading.hide();
      console.log(res);
      if(res.data ){ 
        //verifica se info retornada do server é verdadeira(incluiu os dados)
        $state.go('app.cupons',{id:idUser});

      }   
      else{ 
         var alertPopup = $ionicPopup.alert({
           title: 'Cupom já resgatado',
           template: 'Acesse a área "Meus Cupons"'
         });
        $state.go('app.cupons',{id:idUser});         
      }
    });                        
  };   

  function onUserDetailContentScroll(){
    var scrollDelegate = $ionicScrollDelegate.$getByHandle('userDetailContent');
    var scrollView = scrollDelegate.getScrollView();
    $scope.$broadcast('userDetailContent.scroll', scrollView);
  }
})

.controller('CuponsCtrl', function ($scope, cupom, $localstorage, $state,$stateParams, $ionicLoading){
  idUser = $localstorage.get('userId');

  cupom.getCupoms(idUser).then(function(res){
    if(res)
      $scope.cupons = res.data;
    else
      console.log("nao");
  console.log($scope.cupons);
  });

  $scope.cupons =[
  {'id':'1','numero':'ABC1234','estabelecimento':'Burger-King','utilizado':true,'nome':'Hamburguer grande + Coca-Cola Média + Batata frita Grande','validade': '15/03','categoria':'alimentacao','desconto':'1','diasValidos':{'1':true,'2':false,'3':true,'4':false,'5':true,'6':true,'7':true,},'imagem':'https://img.peixeurbano.com.br/?img=https://s3.amazonaws.com/pu-mgr/default/a0RG000000eftxbMAA/553fbe53e4b0392bfc8ab196.jpg&w=620&h=400','logo':'http://alscib.com.br/wp-content/uploads/2015/08/Burger-KIng.jpg','empresa':'EmPrEsa','descricao':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
  {'id':'1','numero':'ABC1234','estabelecimento':'Burger-King 2','utilizado':false,'nome':'Pizza grande','validade': '15/03','categoria':'alimentacao','desconto':'1','diasValidos':{'1':true,'2':false,'3':true,'4':false,'5':true,'6':true,'7':true,},'imagem':'https://img.peixeurbano.com.br/?img=https://s3.amazonaws.com/pu-mgr/default/a0RG000000eftxbMAA/553fbe53e4b0392bfc8ab196.jpg&w=620&h=400','logo':'http://alscib.com.br/wp-content/uploads/2015/08/Burger-KIng.jpg','empresa':'EmPrEsa','descricao':'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
  ];
  
})

;