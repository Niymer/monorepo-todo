// const logger = require('../utils/logger');
// /**
//  * 给 res 对象挂载统一的成功 / 失败输出方法
//  * res.success({ id: 1 })          -> { code: 0, msg: 'success', data: {...} }
//  * res.fail(400, '参数错误')        -> { code: 400, msg: '参数错误', data: null }
//  */
// module.exports = function responseWrapper(req, res, next) {
//   /** 成功 */
//   res.success = (data = null, msg = 'success') => {
//     res.json({ code: 0, msg, data });
//   };
//
//   /** 失败 */
//   res.fail = (code = 500, msg = 'server error', data = null) => {
//     logger.error(`${req.method} ${req.originalUrl} ${code} - ${msg}`);
//     res.status(code >= 100 && code < 600 ? code : 500)
//     .json({ code, msg, data });
//   };
//
//   next();
// };

const logger = require('../utils/logger')

/**
 * 统一返回包装
 * - success       : 通用成功（非分页）
 * - successList   : 分页成功
 * - fail          : 失败
 */
module.exports = (req, res, next) => {
  /** 通用成功（例如：新增 / 修改 / 删除 / 登录…） */
  res.success = (data = null, msg = '业务正常') =>
    res.json({
      code: 1,                // 成功统一用 1
      msg,
      errorMsg: '',
      currentTime: Date.now(),
      data,
      requestParams: null,
    })

  /** 分页成功（返回 list & total） */
  res.successList = ({ list, total }, msg = '业务正常') =>
    res.json({
      code: 1,
      msg,
      errorMsg: '',
      count: total,
      currentTime: Date.now(),
      data: list,
      requestParams: null,
    })

  /** 失败 */
  res.fail = (code = 500, msg = 'server error', data = null) => {
    logger.error(`${req.method} ${req.originalUrl} ${code} - ${msg}`)
    res.status(code).json({
      code,
      msg,
      errorMsg: msg,
      currentTime: Date.now(),
      data,
    })
  }

  next()
}

