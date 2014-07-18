var vm = {};

$(function(){
  vm = ko.mapping.fromJS(harpData);
  ko.applyBindings(vm); 
});