// ---------------------------------------------------------------------------- GET
exports.get = {
  /**
   * 培训课程列表
   */ 
  '/cultivate/list': async (ctx,next) => {
    let where = ''
    let arg = []
    if(ctx.get.type){
      where = where == ''? 'where type = ? ' : where + ' and type = ? '
      arg.push(ctx.get.type)
    }
    if(ctx.get.name){
      where = where == ''? 'where name = ? ' : where + ' and name = ? '
      arg.push(ctx.get.name)
    }
    let data = await $.mysql.query($.conf.mysql.main,'select * from cultivate ' + where,arg)
    for(let cultivate of data){
      let sum = await $.mysql.query($.conf.mysql.main,'select summary, merit from school_detail where culid = ?',[cultivate.id])
      cultivate.summary = sum.length == 0? '': sum[0].summary
      cultivate.merit = sum.length == 0? '': sum[0].merit
    }
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训课程详情
   */
  '/cultivate/detail/:id': async (ctx,next) => {
    let id = ctx.params.id
    let cultivate = await $.mysql.query($.conf.mysql.main,'select A.*,B.summary,B.merit from cultivate A,school_detail B where A.id = ? and A.id = B.culid ',[id])
    ctx.result.ok.data = cultivate
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训课程轮播图列表
   */ 
  '/cultivate/swiper/list': async (ctx,next) => {
    let where = ''
    let arg = []
    if(ctx.get.culid){
      where = where == '' ? 'where culid = ? ' : where + ' and culid = ?'
      arg.push(ctx.get.name)
    }
    let swiper = await $.mysql.query($.conf.mysql.main,'select * from class_swiper' + where,arg)
    ctx.result.ok.data = swiper
    $.flush(ctx, ctx.result.ok)
  },
}
// ---------------------------------------------------------------------------- POST
exports.post = {
  /**
   * 培训课程添加
   */
  '/cultivate/add': async (ctx, next) => {
    let { name, address, class_starttime, apply_endtime, mobile, img, url, content, type, keyword, summary, merit } = ctx.post
    let cultivate = await $.mysql.push($.conf.mysql.main, 'insert into cultivate (name, address, class_starttime, apply_endtime, mobile, img, url, content, type, keyword) values (?,?,?,?,?,?,?,?,?,?) ', [ name, address, class_starttime, apply_endtime, mobile, img, url, content, type, keyword ])
    let sum = await $.mysql.push($.conf.mysql.main, 'insert into school_detail (summary, merit, culid) values (?,?,?) ', [summary, merit, cultivate.insertId ])
    ctx.result.ok.data = cultivate
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训课程轮播图添加
   */
  '/cultivate/swiper/add': async (ctx, next) => {
    let { url, culid } = ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'insert into class_swiper (url, culid) values (?,?) ', [ url, culid ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
  /**
   * 培训课程行更新
   */
  '/cultivate/uprow': async (ctx, next) =>{
    if (!(ctx.put instanceof Array)) {
      ctx.put = [ctx.put]
    }
    let sql = []
    let arg = []
    for (let item of ctx.put) {
      let { id, name, mobile } = item
      sql.push('update cultivate set name=?, mobile=? where id=?')
      arg.push([name, mobile, id])
    }
    let data = $.mysql.push($.conf.mysql.main,sql,arg)
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训课程编辑
   */
  '/cultivate/edit': async (ctx, next) =>{
    let { id, name, address, class_starttime, apply_endtime, mobile, img, url, content, type, keyword, summary, merit } = ctx.put
    let data = await $.mysql.push($.conf.mysql.main,['update cultivate set name = ?, address = ?, class_starttime = ?, apply_endtime = ?, mobile = ?, img = ?, url = ?, content = ?, type = ?, keyword = ? where id = ?','update school_detail set summary = ?, merit = ? where culid = ?'],[[name, address, class_starttime, apply_endtime, mobile, img, url, content, type, keyword,id],[summary, merit,id]])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  /**
   * 培训课程删除
   */
  '/cultivate/delete/:id': async (ctx, next) => {
    let id = ctx.params.id
    let data=await $.mysql.push($.conf.mysql.main, ['delete from cultivate where id =?','delete from school_detail where culid =?','delete from class_swiper where culid =?'], [ [id],[id],[id] ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训课程轮播图删除
   */
  '/cultivate/swiper/delete/:id': async (ctx, next) => {
    let id = ctx.params.id
    let data=await $.mysql.push($.conf.mysql.main, 'delete from class_swiper where id =?', [id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
}