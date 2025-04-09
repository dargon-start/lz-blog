# Fetch

```js
//get
fetch("http://39.105.207.193:8000/moment?offset=10&&size=10")
    .then((res) => {
    console.log(res.ok);
    if (res.ok) {
        return res.json();
    }
    throw new Error("美亚王");
})
    .then((data) => {
    console.log(data);
});
//post
fetch("http://39.105.207.193:8000/login", {
    method: "post",
    body: JSON.stringify({name: "clz", password: 123456}),
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error("请求失败");
})
    .then((data) => {
    console.log(data);
});
```

