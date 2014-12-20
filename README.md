#Stand alone ajax library.

Run npm install then gulp to get minified version.




#Useage
---

####Post

#####Long
```javascript
Ajax({
  type: "POST",
  url: url,
  data: data,
  success: success,
  dataType: dataType
});

```

#####Short
```javascript
Ajax.post('myURL.html', {"data":"Data"}, function(data) {
   console.log(data);
});


