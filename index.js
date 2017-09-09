// ---------------------------------------------------------------------------- Package
const path = require('path')
const Koa = require('koa')
const router = require('koa-router')()
const body = require('koa-better-body')
const common = require('hw-common-node')
const preset = require('./preset')
// ---------------------------------------------------------------------------- Global
require('hc-basis-node')(require('./conf'))
// ---------------------------------------------------------------------------- App与第三方中间件
global.app = new Koa()
// ---------------------------------------------------------------------------- Body
app.use(body())
app.use(preset())
// ---------------------------------------------------------------------------- Common
app.use(common())
// ---------------------------------------------------------------------------- Router
$.router.getRoutes(router)
app.use(router.routes())
app.use(router.allowedMethods())
// ---------------------------------------------------------------------------- Listen
app.listen($.conf.port)
console.log('开始监听：' + $.conf.port)
