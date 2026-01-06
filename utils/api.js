// API工具文件
const BASE_URL = 'http://127.0.0.1:8080';

/**
 * 获取用户ID（从本地存储或全局数据）
 */
function getUserId() {
  // 优先从全局数据获取
  const app = getApp();
  if (app && app.globalData && app.globalData.userId) {
    return app.globalData.userId;
  }
  
  // 从本地存储获取
  try {
    const userId = wx.getStorageSync('userId');
    if (userId) {
      return userId;
    }
  } catch (e) {
    console.error('获取用户ID失败:', e);
  }
  
  // 默认返回一个测试用户ID（实际项目中应该通过登录获取）
  return '2938475';
}

/**
 * 通用请求方法
 * @param {Object} options 请求配置
 * @param {String} options.url 请求路径
 * @param {String} options.method 请求方法 GET/POST
 * @param {Object} options.data 请求参数
 * @param {Function} options.success 成功回调
 * @param {Function} options.fail 失败回调
 */
function request(options) {
  const { url, method = 'GET', data = {}, success, fail } = options;
  
  // 构建完整URL
  let fullUrl = BASE_URL + url;
  
  // 将参数拼接到URL（GET和POST都使用查询参数）
  if (Object.keys(data).length > 0) {
    const params = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
    fullUrl += (url.includes('?') ? '&' : '?') + params;
  }
  
  wx.request({
    url: fullUrl,
    method: method,
    data: {}, // 参数都放在URL中，请求体为空
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      const response = res.data || {};
      
      // 根据后端返回格式处理：{ code, msg, data }
      if (response.code === '200' || response.code === 200) {
        success && success(response.data, response);
      } else {
        const errorMsg = response.msg || '请求失败';
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
        fail && fail(response);
      }
    },
    fail: (err) => {
      console.error('请求失败:', err);
      
      // 检查是否是域名校验错误
      if (err.errMsg && err.errMsg.includes('url not in domain list')) {
        console.warn('域名校验失败，请在微信开发者工具中：设置 -> 项目设置 -> 本地设置 -> 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"');
        // 开发环境下不显示错误提示，避免干扰
        // 生产环境需要在微信公众平台配置合法域名
      } else {
        wx.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none',
          duration: 2000
        });
      }
      fail && fail(err);
    }
  });
}

/**
 * 切换收藏状态
 * @param {String} recipeId 菜谱ID
 * @param {Function} success 成功回调，参数为状态文本（如"已收藏"）
 * @param {Function} fail 失败回调
 */
function toggleFavorite(recipeId, success, fail) {
  const userId = getUserId();
  request({
    url: '/api/favorite/toggle',
    method: 'POST',
    data: {
      userId: userId,
      recipeId: recipeId
    },
    success: (data) => {
      success && success(data);
    },
    fail: fail
  });
}

/**
 * 获取收藏列表
 * @param {Function} success 成功回调，参数为收藏ID数组
 * @param {Function} fail 失败回调
 */
function getFavorites(success, fail) {
  const userId = getUserId();
  request({
    url: '/api/favorite',
    method: 'GET',
    data: {
      userId: userId
    },
    success: (data) => {
      // 确保返回的是数组
      const favoriteIds = Array.isArray(data) ? data : [];
      success && success(favoriteIds);
    },
    fail: fail
  });
}

module.exports = {
  getUserId,
  request,
  toggleFavorite,
  getFavorites,
  BASE_URL
};

