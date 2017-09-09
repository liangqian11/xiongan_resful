//---------------------------------------------------------------------------- Exports
module.exports = function () {
  return async (ctx, next) => {
    // 设置导出格式为json，编码格式为utf-8
    ctx.type = 'application/json; charset=utf-8'
    // console.log(ctx.header.session)
    // session
    let user = await $.mysql.query($.conf.mysql.user, 'select * from user where id=? ', [26])
    ctx.user = user[0]
    let company = await $.mysql.query($.conf.mysql.main, 'select * from company where id=? ', [1])
    ctx.company = company[0]
    // 进入接口处理
    await next()
  }
}
