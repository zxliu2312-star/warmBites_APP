// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // TODO: 实际项目中应该通过登录接口获取userId
      }
    })
    
    // 初始化用户ID（如果本地存储中没有，使用默认值）
    this.initUserId();
  },
  
  // 初始化用户ID
  initUserId() {
    try {
      let userId = wx.getStorageSync('userId');
      if (!userId) {
        // 默认用户ID，实际项目中应该通过登录获取
        userId = '2938475';
        wx.setStorageSync('userId', userId);
      }
      this.globalData.userId = userId;
    } catch (e) {
      console.error('初始化用户ID失败:', e);
      this.globalData.userId = '2938475';
    }
  },
  
  globalData: {
    userInfo: null,
    userId: '2938475' // 默认用户ID
  }
})
