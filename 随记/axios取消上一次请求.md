# axios取消上一次请求

案例：在输入框输入后触发接口请求，接口返回数据回填输入框，但是会出现发出请求后，数据还未返回，用户继续输入。等到数据返回后，输入框使用了旧的数据。

解决方案：在用户输入后，取消上一次的接口请求

## axios实现取消请求

```vue2
created(){
    // 根本原因
    this.$watch(
      () => {
        return this.accCountData[1]?.phenomenon
      },
      (val) => {
        // 如果存在上一次的请求，则取消
        if (this.cancelTokenSource) {
          this.cancelTokenSource.cancel('请求已取消')
        }
        this.getRecordCount()
      },
    )
},
methods:{
    getData: lodash.debounce(async function () {

        // 创建新的 CancelToken
        this.cancelTokenSource = axios.CancelToken.source()

        const body = {
            orgId: this.responsibleOrgId,
        }
        const { data } = await getAccidentCount(body, {
            cancelToken: this.cancelTokenSource.token,
        })
        this.accCountData = data || []

    }, 500),
}


// 接口请求
export function getAccidentCount(data, config = {}) {
  return request({
    url: 'xxx',
    method: 'post',
    data,
    codeParams,
    ...config,
  })
}
```