## axios使用

### GET

```js
 //get1
axios.get('/list?name=wf&age=123').then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

//get2
axios.get('/list1', {
    username: 'jams',
    age: 30
}).then((res) => {
    console.log(res);
})

```

### POST

```js
//post1
axios.post('/list', {
    page: 0,
    count: 10
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})

//post2
axios.post(
    '/list',
    ' page=0&count=10'
).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
}
```

