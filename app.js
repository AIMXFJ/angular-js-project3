(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'foundItems',
    bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {

}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.searchTerm;
  menu.found;

  menu.search = function(){
    menu.found = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    menu.found.then(function (response) {
      menu.found = response;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
  }

  menu.onRemove = function(itemIndex){
    menu.found.splice(itemIndex,1);
  }

  menu.isEmpty = function () {
    if(menu.found.length <=0)
      return true;
    
    return false;
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm){
    service.searchTerm = searchTerm;
    return $http(
    {
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
    }).then(function (result) {
    // process result and only keep items that match
    var foundItems = new Array();
    var menu_items = result.data.menu_items;

    if(menu_items.length > 0){
      for(var i in menu_items){
        var desc = menu_items[i].description;
        if(desc.toLowerCase().indexOf(service.searchTerm.toLowerCase())!=-1){
          foundItems.push(menu_items[i]);
        }
      }
    }

    // return processed items
    return foundItems;
  });
  };

}

})();