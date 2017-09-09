// ---------------------------------------------------------------------------- GET
exports.get = {
  /**
   * 区域列表
   */
  '/area/list': async (ctx, next) => {
    ctx.result.ok.data = ['容城','雄县','安新','保定']
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 薪资列表
   */
  '/pay/list': async (ctx, next) => {
    ctx.result.ok.data = ['2000以下','2000-3000','3000-5000','5000-10000',,'10000以上']
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 福利待遇列表
   */
  '/benefit/list': async (ctx, next) => {
    ctx.result.ok.data = ['五险一金','年底双薪','绩效奖金','年终分红','股票期权','加班补助','全勤奖','包吃包住','交通补助','餐补','房补','通讯补贴','采暖补贴','带薪年假','弹性工作','补充医疗保险','定期体检','免费班车','员工旅游','高温补贴','节日福利']
    $.flush(ctx, ctx.result.ok)
  },
   /**
   * 学历要求列表
   */
  '/education/list': async (ctx, next) => {
    ctx.result.ok.data = ['不限','初中','中技','高中','中专','大专','本科','硕士','MBA','EMBA','博士','其他']
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 企业性质列表
   */
  '/company/kind/list': async (ctx, next) => {
    ctx.result.ok.data = ['国企','外商独资','代表处','合资','民营','股份制企业','上市公司','国家机关','事业单位','银行','医院','学校/下级学院','律师事务所','社会团体','港澳台公司','其他']
    $.flush(ctx, ctx.result.ok)
  },
   /**
   * 公司规模列表
   */
  '/company/scope/list': async (ctx, next) => {
    ctx.result.ok.data = ['20人以下','20-99人','100-499人','500-999人','1000-9999人','10000人以上' ]
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 职位列表
   */
  '/job/all/list': async (ctx, next) => {
    let{ name, area, pay, time,benefit } = ctx.get
    let where = ''
    let params = []
    let sql=''
    if(name){
      where = where == '' ? ' where (name = ? or cname = ? )' : where + ' and (name = ? or cname = ? )'
      params.push(name,name)
    }
    if(area){
      where = where == '' ? ' where area = ?' : where + ' and area = ? '
      params.push(area)
    }
    if(pay){
      where = where == '' ? ' where pay = ?' : where + ' and pay = ? '
      params.push(pay)
    }
    if(time){
        let a = $.time.betweenDay().start/1000-(time-1)*60*60*24
        where = where == '' ? ' where time>?' : where + ' and time > ? '
        params.push(a)
    }
    if(benefit){
      let a  = benefit.split("|")
       for(let v of a ){
        where = where == '' ? ' where benefit like "%'+ v + '%"' : where + ' and benefit like "%'+ v + '%"'
      }
    }
    sql= 'select * from job' + where +'and examine = 1 and status=1 order by issue_time' 
    let job = await $.mysql.query($.conf.mysql.main, sql, params)
    ctx.result.ok.data = job
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 搜索为你推荐
   */
  '/search/recommend': async (ctx, next) => {
    let {name} = ctx.get
    let data = []
    let where = ''
    if(name){
      await $.mysql.push($.conf.mysql.main, 'insert into history (uid,keyword) ', [ uid,name ])
      for(let v of name ){
        where = where == '' ? ' where name like "%'+ v + '%" or cname like "%' + v + '%"' : where + ' or name like "%'+ v + '%" or cname like "%' + v + '%"'
      }
      let sql= 'select * from job ' + where +' and examine = 1 and status=1 order by issue_time' 
      let job = await $.mysql.query($.conf.mysql.main, sql, [null])
      ctx.result.ok.data = job
      $.flush(ctx, ctx.result.ok)
    }
  },
  /**
   * 首页直播
   */
  '/home/live': async (ctx, next) => {
    let live = await $.mysql.query($.conf.mysql.main, 'select * from live where ishome =1' , [null])
    ctx.result.ok.data = live
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 直播列表
   */
  '/live/list': async (ctx, next) => {
    let live = await $.mysql.query($.conf.mysql.main, 'select * from live ' , [null])
    ctx.result.ok.data = live
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训列表
   */
  '/cultivate/list': async (ctx, next) => {
    let cultivate = await $.mysql.query($.conf.mysql.main, 'select * from cultivate ' , [null])
    ctx.result.ok.data = cultivate
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 培训列表
   */
  '/cultivate/detail/:id': async (ctx, next) => {
    let cultivate = await $.mysql.query($.conf.mysql.main, 'select * from cultivate where id =? ' , [ctx.params.id])
    ctx.result.ok.data = cultivate
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 首页轮播
   */
  '/home/swiper': async (ctx, next) => {
    let swiper = await $.mysql.query($.conf.mysql.main, 'select * from swiper order by sort' , [null])
    ctx.result.ok.data = swiper
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 搜索记录列表
   */
  '/search/history/list': async (ctx, next) => {
    let uid = ctx.user.id
    let history = await $.mysql.query($.conf.mysql.main, 'select * from history where uid =? order by id desc' , [uid])
    ctx.result.ok.data = history
    $.flush(ctx, ctx.result.ok)
  },
}
// ---------------------------------------------------------------------------- POST
exports.post = {
   /**
   * 报名培训
   */
  '/add/cultivate/record': async (ctx, next) => {
    let uid = ctx.user.id
    let cid = ctx.company.id
    let { culid, culname} = ctx.post
    let apply_time = $.time10()
    if(cid){
      let data=await $.mysql.push($.conf.mysql.main, 'insert into cultivate_record (culid,culname,cid,apply_time) ', [culid,culname,cid,apply_time])
      ctx.result.ok.data = data
      $.flush(ctx, ctx.result.ok)
    }else{
      let data=await $.mysql.push($.conf.mysql.main, 'insert into cultivate_record (culid,culname,uid,apply_time) ', [culid,culname,uid,apply_time])
      ctx.result.ok.data = data
      $.flush(ctx, ctx.result.ok)
    }
  }
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
  /**
   * 取消报名培训
   */
  '/cancel/cultivate/record': async (ctx, next) => {
    let uid = ctx.user.id
    let cid = ctx.company.id
    let { id } = ctx.post
    let cancle_time = $.time10()
    let data=await $.mysql.push($.conf.mysql.main, 'update cultivate_record set status = 2 and cancle_time=? where id =? ', [cancle_time,id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  '/': async (ctx, next) => {
    ctx.result.ok.data = ctx.delete
    $.flush(ctx, ctx.result.ok)
  }
}