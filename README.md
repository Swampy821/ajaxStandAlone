#Stand alone ajax library.

Run npm install then gulp to get minified version.




#Useage
---

###Ajax
```javascript
Ajax({
  type: "POST/GET",
  url: url,
  data: data,
  success: success,
  dataType: dataType
});

```

#####post
```javascript
Ajax.post('myURL.html', {"data":"Data"}, function(data) {
   console.log(data);
});


#####get
```javascript
Ajax.get('myURL.html', function(myData) {
   console.log(myData);
}, 'json');
```


#####getJSON
```javascript
Ajax.getJSON('my.json', function(data) {
   console.log(data);
});
```

