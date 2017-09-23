// ---------------------------------------------------------------------------- GET
exports.get = {
  /**
   * 区域列表
   */
  '/area/list': async (ctx, next) => {
    let area = await $.mysql.query($.conf.mysql.main, 'select * from area', [null]) 
    ctx.result.ok.data = area
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 首页轮播列表
   */
  '/swiper/list': async (ctx, next) => {
    let swiper = await $.mysql.query($.conf.mysql.main, 'select * from swiper', [null]) 
    ctx.result.ok.data = swiper
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- POST
exports.post = {
 
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
  
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  
}