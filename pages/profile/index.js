Page({
  data: {
    // 目前后端仅实现收藏接口（FavoriteController），暂无用户信息接口
    // 这里先提供可展示的“用户信息”结构；后续有 user/profile 接口时再替换为后端返回
    user: {
      id: 'iloveHMI',
      name: '臣巳',
      motto: '让做饭更轻松，让家的味道更温暖',
      avatar: 'https://c-ssl.dtstatic.com/uploads/blog/202301/11/20230111141039_8dcde.thumb.400_0.jpg',
      stats: {
        favorites: 8,
        likes: 231,
        cooks: 341
      }
    },
    sections: [
      {
        title: '关于暖食记',
        content: '暖食记是一款专注家庭厨房灵感的工具，提供精选菜谱、步骤指引和烹饪提示。'
      },
      {
        title: '产品理念',
        content: '轻量、好看、好用。让每个普通厨房都能做出温暖的一餐。'
      },
      {
        title: '联系我们',
        content: '反馈与合作：warmbites@support.com'
      }
    ]
  },

  onLoad() {
    this.refreshUserStats();
  },

  onShow() {
    // 从其他页面返回时也刷新一下
    this.refreshUserStats();
  },

  // 当前 SEV 已实现：GET /api/favorite?userId=...
  // 这里用它来展示“收藏数”，其它统计先保留为 0
  refreshUserStats() {
    const that = this;

    wx.request({
      url: 'http://localhost:8080/api/favorite', // TODO: 按实际后端地址修改
      method: 'GET',
      data: {
        userId: this.data.user.id
      },
      success(res) {
        const body = res.data || {};
        if (!body.success) {
          return;
        }
        const ids = body.data;
        const favCount = Array.isArray(ids) ? ids.length : 0;

        that.setData({
          'user.stats.favorites': favCount
        });
      }
    });
  },

  goFavorites() {
    wx.switchTab({
      url: '/pages/favorites/index'
    });
  },

  copyUserId() {
    const id = this.data.user.id;
    wx.setClipboardData({
      data: id,
      success() {
        wx.showToast({
          title: '已复制',
          icon: 'none'
        });
      }
    });
  }
});
