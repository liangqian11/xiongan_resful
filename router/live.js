// ---------------------------------------------------------------------------- GET
exports.get = {
 /**
  * 直播列表
  */
  '/live/list/manager': async (ctx, next) =>{
    let arg = []
    let where = ''
    if(ctx.name){
      where = where == '' ? ' where name = ?' : where + ' and name = ?'
			arg.push(ctx.name)
    }
    let live = await $.mysql.query($.conf.mysql.main, 'select * from live' + where, [arg])
    ctx.result.ok.data = live
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 直播详情
   */
  '/live/detail/manager/:id': async (ctx, next) =>{
    let id = ctx.params.id
    let detail = await $.mysql.query($.conf.mysql.main, 'select * from live where id = ?', [id])
    ctx.result.ok.data = detail
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 首页只显示一个
   */
  '/live/one': async (ctx, next) =>{
    let data = await $.mysql.query($conf.mysql.main, 'select * from live where ishome = 1', [null])
    if(data.length != 1){
      ctx.result.e4001.errmsg = '已经设置过了'
      $.flush(ctx, ctx.result.e4001)
    }
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- POST
exports.post = {
  /**
   * 添加直播
   */
  '/live/add': async (ctx, next) => {
    let {name, img, href, time, end_time, ishome, status} = ctx.post
    let data = await $.mysql.push($.conf.mysql.main, 'insert into live (name,img,href,time,end_time,ishome,status) values(?,?,?,?,?,?,?)', [name,img,href,time,end_time,ishome,status])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
  /**
   * 编辑直播
   */
  '/live/edit/manager': async (ctx, next) =>{
    let {name, img, href, time, end_time, ishome, status, id} = ctx.put
    let data = await $.mysql.push($.conf.mysql.main, 'update live name=?, img=?, href=?, time=?, end_time=?, ishome=?, status=? where id=?', [name,img,href,time,end_time,ishome,status,id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  /**
   * 删除直播
   */
  '/live/delete/manager/:id': async (ctx, next) =>{
    let id = ctx.params.id
    let data = await $.mysql.push($.conf.mysql.main, 'delete from live where id = ?', [id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}