// ---------------------------------------------------------------------------- GET
const _ = require('lodash')
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
   /**
   * 添加区域
   */
  '/add/area': async (ctx, next) => {
    let { name } =ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'insert into area (name) values (?) ', [name])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
   /**
   * 添加轮播
   */
  '/add/swiper': async (ctx, next) => {
    let { url,sort } =ctx.post
    let data=await $.mysql.push($.conf.mysql.main, 'insert into swiper (url,sort) values (?,?) ', [url,sort])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }
}
// ---------------------------------------------------------------------------- PUT
exports.put = {
   /**
   * 编辑区域
   */
  '/edit/area': async (ctx, next) => {
    let { name,id } =ctx.put
    let data=await $.mysql.push($.conf.mysql.main, 'update area set name=? where id =?', [name,id])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  },
  /**
   * 编辑轮播
   */
  '/edit/swiper': async (ctx, next) => {
    if (!_.isArray(ctx.put)) {
			ctx.put = [ctx.put]
		}
		for (let item of ctx.put) {
      console.log(item.id)
			await $.mysql.push($.conf.mysql.main, 'update swiper set sort=?,url=? where id =?', [item.sort,item.url,item.id])
		}
    $.flush(ctx, ctx.result.ok)
  },
  
}
// ---------------------------------------------------------------------------- DELETE
exports.delete = {
  /**
   * 删除轮播
   */
  '/delete/swiper': async (ctx, next) => {
    let id = ctx.delete
    let data = await $.mysql.push($.conf.mysql.main, 'delete from swiper where id =? ', [ id ])
    ctx.result.ok.data = data
    $.flush(ctx, ctx.result.ok)
  }, 
}