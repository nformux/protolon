var data = {};

$(function(){
  data = ko.mapping.fromJS(harpData);
  ko.applyBindings(data); 
});