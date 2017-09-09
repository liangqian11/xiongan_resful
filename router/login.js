// ---------------------------------------------------------------------------- GET
exports.get = {
  /**
   * 公司登录
   */
  '/company/login/:username/:password': async (ctx, next) => {
    let username = ctx.params.username
    let password = ctx.params.password
    let company = await $.mysql.query($.conf.mysql.main, 'select * from company where username = ? and password = ?', [username, password])
    if(company.length > 0){
       ctx.result.ok.data = company
       $.flush(ctx, ctx.result.ok)
    }else{
     ctx.result.e4001.errmsg = '账号或密码错误'
      $.flush(ctx, ctx.result.e4001)
    }
  },
}
// ---------------------------------------------------------------------------- POST
exports.post = {
  /**
   * 公司注册
   */
  '/company/register': async (ctx, next) => {
    let { username,password } = ctx.post
    let company = await $.mysql.query($.conf.mysql.main, 'select * from company where username = ?', [username])
    if(company.length > 0){
       ctx.result.e4001.errmsg = '该账号已存在'
      $.flush(ctx, ctx.result.e4001)
    }else{
      let data = await $.mysql.push($.conf.mysql.main, 'insert into company (username, password) values (?,?)', [username,password])
      ctx.result.ok.data = data
      $.flush(ctx, ctx.result.ok)
    }
  }
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
  /**
   * 公司修改密码
   */
  '/company/change': async (ctx, next) => {
    let { username,oldpassword,newpassword } = ctx.put
    let company = await $.mysql.query($.conf.mysql.main, 'select * from company where username = ?', [username])
    if(company[0].password!= oldpassword){
      ctx.result.e4001.errmsg = '对不起，您输入的原密码有误'
      $.flush(ctx, ctx.result.e4001)
    }else{
      let data = await $.mysql.push($.conf.mysql.main, 'update company set password=? where username=?', [newpassword,username])
      ctx.result.ok.data = data
      $.flush(ctx, ctx.result.ok)
    }
  }
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
}