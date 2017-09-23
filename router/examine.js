// ---------------------------------------------------------------------------- GET
exports.get = {
    /**
   * 公司列表
   */
  '/get_company/list':async(ctx,next) => {
    let data = await $.mysql.query($.conf.mysql.main,'select * from company where examine = 1 order by id')
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
    /**
   * 公司列表详情
   */
  '/get_company/datail/:id':async(ctx,next) => {
    let id = ctx.params.id
    let data = await $.mysql.query($.conf.mysql.main,'select * from company where examine = 1 and id=?',[id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
    /**
   * 公司列表详情的发布岗位
   */
  '/get_job/datail/:id':async(ctx,next) => {
    let id = ctx.params.id
    let data = await $.mysql.query($.conf.mysql.main,'select A.id,A.examine, B.* from company A, job B where A.id = B.cid and A.examine=1 and A.id = ?',[id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },

  /**
   * 公司审核列表
   */
  '/company/list':async(ctx,next) => {
    let data = await $.mysql.query($.conf.mysql.main,'select * from company where examine = 0 order by id')
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
    /**
   * 公司详情
   */
  '/company/detail/:id':async(ctx,next) => {
    let id = ctx.params.id
    let data = await $.mysql.query($.conf.mysql.main,'select * from company where examine = 0 and id=?',[id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 岗位列表
   */
  '/job/list':async(ctx,next) => {
    let job = await $.mysql.query($.conf.mysql.main,'select A.*,B.id,B.logo,B.examine as mine from job A,company B where A.cid = B.id and  A.examine = 0 and B.examine = 1 order by A.issue_time desc')
    ctx.result.ok.data = job
    $.flush(ctx, ctx.result.ok)
  },
    /**
   * 岗位详情
   */
  '/job/detail/:id':async(ctx,next) => {
    let id = ctx.params.id
    let job = await $.mysql.query($.conf.mysql.main,'select A.*,B.id,B.logo,B.examine as mine from job A,company B where A.cid = B.id and  A.examine = 0 and B.examine = 1 and A.id=?',[id])
    ctx.result.ok.data = job
    $.flush(ctx, ctx.result.ok)
  }


}
// ---------------------------------------------------------------------------- POST
exports.post = {
 
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
    /**
   * 公司审核
   */
  '/company/examine':async(ctx,next) => {
    let {id,examine,name} = ctx.put
    let content = []
    let data = await $.mysql.push($.conf.mysql.main,'update company set examine = ? where id = ?',[examine,id])
    let company = await $.mysql.query($.conf.mysql.main,'select * from company where id=?',[id])
    if(company[0].examine == 1){
       content = '您申请的'+name+'企业认证于'+$.time.format('yyyy-mm-dd')+'，审核通过，请注意查看'
    }else{
      content = '您申请的'+name+'企业认证于'+$.time.format('yyyy-mm-dd')+'，审核未通过，请注意查看'
    }
    let time = $.time10()
    await $.mysql.push($.conf.mysql.main, 'insert into msg (cid ,content,time) values(?,?,?)', [id ,content,time])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },

    /**
   * 岗位审核
   */
  '/job/examine':async(ctx,next) => {
    let {id,examine} = ctx.put
    let content = []
    let job = await $.mysql.push($.conf.mysql.main,'update job set examine = ? where id=?',[examine,id])
    let data = await $.mysql.query($.conf.mysql.main,'select A.*,B.id from job A,company B where A.id=? and A.cid = B.id ',[id])
    console.log(data)
    if(data[0].examine == 1){
      content = '您申请的'+data[0].name+'岗位认证于'+$.time.format('yyyy-mm-dd')+'，审核通过，请注意查看'
    }else{
      content = '您申请的'+data[0].name+'岗位认证于'+$.time.format('yyyy-mm-dd')+'，审核未通过，请注意查看'
    }
    let time = $.time10()
    await $.mysql.push($.conf.mysql.main, 'insert into msg (cid ,content,time) values(?,?,?)', [data[0].cid ,content,time])
    ctx.result.ok.data = job
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  
}