angular.module('starter.filter', [])

.filter('totime', function() {
  return function(input) {
    return input.substring(0, 5);
  };
})

.filter('OfertasFilter', function() {
  return function(input, ofertasDeHoje,categorias) {
    var hoje =  new Date().getDay();
    var filteredList = [];
    var diaAtual = new Date();
    var dataVencimento;

    for(var i=0,tam=input.length; i<tam; i++){
      dataVencimento = new Date(input[i].validade);
      if(dataVencimento > diaAtual){
        for(var j=0,tam2=categorias.length; j<tam2; j++){
          if(categorias[j].nome == input[i].categoria && categorias[j].mostra){//VERIFICA se categoria da oferta está setada
            if(ofertasDeHoje && input[i].diasValidos[hoje]){//verifica se está setada apenas ofertas do dia e se a oferta é valida para o dia
              filteredList.push(input[i]);
            }else if(!ofertasDeHoje){
              filteredList.push(input[i]);
            }
          }
        }
      }
    }


    // for(var i = 0; i < input.length; i ++) {        
    //   dataVencimento = new Date(input[i].validade);              
    //   if(dataVencimento > diaAtual){
    //     for(var i=0;i<categorias.length;i++) {
    //       if(categorias[i].mostra) {
    //         if(ofertasDeHoje){//se tiver setado apenas ofertas do dia
    //           if(input[i].categoria._id === categorias[i]._id && input[i].diasValidos[hoje] == true) {
    //                 filteredList.push(input[i]);
    //               break;
    //           }
    //         }else{
    //           if(input[i].categoria._id === categorias[i]._id) {
    //               filteredList.push(input[i]);
    //               break;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    return filteredList;
  };
})

.filter('converteData', function() {
  return function(data) {
    data= new Date(data);
    var dd = data.getDate();
    var mm = data.getMonth()+1; //January is 0!

    var yyyy = data.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var dia = dd+'/'+mm;
    return dia;
  };
})

;