
const store = {

    /**
     * 处理注册逻辑
     * @param {context} ctx 
     */
    async insertProduct(ctx) {
        const info = ctx.request.body
        
        ctx.body = '添加成功！'
    },

}

module.exports = store