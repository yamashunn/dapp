App = {
  web3Provider: null,
  contracts: {},
  

  init: async function() {
    // Load pets.
    $.getJSON('../test.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-artist').text(data[i].artist);
        petTemplate.find('.pet-price').text(data[i].price);
        petTemplate.find('.btn-adopt').attr('data-price', data[i].price);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.pet-date').text(data[i].date);
        petsRow.append(petTemplate.html());
        $('.panel-pet').eq(i).find('button').text('購入')//無理矢理購入ボタン配置
        
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {   //web3の準備
    console.log("initWeb3")
  // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    } 
  // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
  // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {//web3のインスタンスか
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    console.log("bindEvents")
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {     //ペットの取得とUIの更新（成功とかの）
    console.log("markAdopted")
    var adoptionInstance;
    var count=0;
    

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {

        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          count+=1
          //$('.panel-pet').eq(i).find('button').text('売り切れ').attr('disabled', true);
        }
        if (count==16){
          $('.panel-pet').eq(i).find('button').text('購入');//無理矢理購入ボタン配置 <- ここ必要？
          for (i = 0; i < adopters.length; i++) {
            adopters[i]=0
          }
          console.log(adopters)
          count=0
        }
      }
      console.log(adopters)
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleAdopt: function(event) { //web3からユーザーのアカウントをもらう、押した時に動くもの。
    console.log("handleAdopt")
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    //17行目btn-adoptに変更後solved
    var petPrice = parseInt($(event.target).data('price'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) { //実行者のアカウントを取得
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var recievAddr = "0x3AeeacbDDFdFBD8d2b3B419691322F21adf8Ae35";

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
  
        console.log("app,contracts.adoption")

        // Execute adopt as a transaction by sending account
        //ここで、配列にpetIDと、アカウントIDを入れている。
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        //successにして、押せないようにする。
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
      web3.eth.sendTransaction({
        from: account,
        to: recievAddr,
        value: web3.toWei(petPrice, "ether"),
        //value: '1000000000000000'
      }, function (err, transactionHash) {
        if (!err) {
          console.log(transactionHash);
        } else {
          console.log("pass this func")
        }
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

function admi(){
  location.href = "http://localhost/pet-shop-tutorial/src/json.html";
}