// ---------------------------------------------------------------------------- GET
exports.get = {
  /**
   * 我的投递
   */
  '/user/resume/record': async (ctx, next) => {
    let uid = ctx.user.id
    let record = await $.mysql.query($.conf.mysql.main, 'select * from  resume_record where uid = ?', [uid])
    ctx.result.ok.data = record
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 我的面试邀请
   */
  '/user/invite/record': async (ctx, next) => {
    let uid = ctx.user.id
    let record = await $.mysql.query($.conf.mysql.main, 'select * from  resume_record where uid = ? and status = 1 ', [uid])
    ctx.result.ok.data = record
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 我的收藏列表
   */
  '/user/collect/list': async (ctx, next) => {
    let uid = ctx.user.id
    let time = $.time10()
    let record = await $.mysql.query($.conf.mysql.main, 'select * from  collect where uid = ?  ', [uid])
    let data =[]
    for(let v of record){
      if(time-v.time>2592000){
        await $.mysql.push($.conf.mysql.main, 'delete from collect where id =? ', [ v.id ])
      }else{
        data.push(v)
      }
    }
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  
}
// ---------------------------------------------------------------------------- POST
exports.post = {
   /**
   * 收藏职位
   */
  '/collect/job': async (ctx, next) => {
    let uid = ctx.user.id
    let { jid } = ctx.post
    let time = $.time10()
    let data=await $.mysql.push($.conf.mysql.main, 'insert into collect (uid,jid,time) values (?,?,?) ', [ uid,jid,time ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
   /**
   * 投递简历
   */
  '/add/resume/record': async (ctx, next) => {
    let uid = ctx.user.id
    let { jid, rid } = ctx.post
    let resume = await $.mysql.query($.conf.mysql.main, 'select * from  resume where id = ?', [rid])
    let job = await $.mysql.query($.conf.mysql.main, 'select * from  job where id = ?', [jid])
    let time = $.time10()
    let data=await $.mysql.push($.conf.mysql.main, 'insert into resume_record (uid, rid, cid, cname, jid, time) values (?,?,?,?,?,?)', [uid, rid,job[0].cid,job[0].cname,jid,time ])
    let companycontent = resume[0].name+'投递了您公司的'+ job[0].name +'岗位，请注意查看'
    await $.mysql.push($.conf.mysql.main, 'insert into msg (cid,content,type) values (?,?,?) ', [uid, companycontent,3])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
   /**
   * 发布简历个人基本信息
   */
  '/add/resume': async (ctx, next) => {
    let uid = ctx.user.id
    let {name,sex,head,birthday, education,experience,area,mobile,email}= ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'insert into resume (uid,name,sex,head,birthday, education,experience,area,mobile,email) values(?,?,?,?,?,?,?,?,?,?) ', [ uid,name,sex,head,birthday, education,experience,area,mobile,email ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
   /**
   * 发布简历教育经历
   */
  '/add/education': async (ctx, next) => {
    let { rid, start,end,school,speciality }= ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'insert into education_record (rid, start,end,school,speciality) values (?,?,?,?,?) ', [ rid, start,end,school,speciality])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 发布简历工作经历
   */
  '/add/experience': async (ctx, next) => {
    let { rid, start,end,company,job }= ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'insert into experience_record (rid, start,end,company,job) values (?,?,?,?,?) ', [ rid, start,end,company,job])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
  /**
   * 编辑/添加简历求职意向
   */
  '/add/wanted': async (ctx, next) => {
    let { id,jtid,pay,want_area }= ctx.put
    let data=await $.mysql.push($.conf.mysql.main, 'update resume set jtid = ?,pay=?,want_area=? where id =? ', [ jtid, pay ,want_area, id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 编辑简历个人评价
   */
  '/evaluate/add': async (ctx, next) => {
    let { evaluate,id }= ctx.put
    let data=await $.mysql.push($.conf.mysql.main, 'update resume set evaluate = ? where id =? ', [ evaluate ,id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 编辑简历教育经历
   */
  '/education/edit': async (ctx, next) => {
    let { start,end,school,speciality,id }= ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'update education_record set start = ?,end =?,school =?,speciality=? where id =? ', [ start,end,school,speciality,id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 编辑简历工作经历
   */
  '/experience/edit': async (ctx, next) => {
    let { start,end,company,job,id }= ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'update experience_record set start = ?,end =?,company =?,job=? where id =? ', [ start,end,company,job,id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
 
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  /**
   * 删除简历教育经历
   */
  '/education/delete/:id': async (ctx, next) => {
    let id = ctx.params.id
    let data=await $.mysql.push($.conf.mysql.main, 'delete from education_record where id =? ', [ id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 删除简历工作经历
   */
  '/experience/delete/:id': async (ctx, next) => {
    let id = ctx.params.id
    let data=await $.mysql.push($.conf.mysql.main, 'delete from experience_record where id =? ', [ id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 删除收藏
   */
  '/collect/delete/:id': async (ctx, next) => {
    let id = ctx.params.id
    let data=await $.mysql.push($.conf.mysql.main, 'delete from collect  where id =? ', [ id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}