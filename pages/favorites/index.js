const { RECIPES } = require('../../data/recipes');

Page({
  data: {
    favorites: []
  },

  onShow() {
    // 每次进入都刷新，确保和首页收藏状态一致
    this.loadFavorites();
  },

  loadFavorites() {
    let ids = [];
    try {
      const v = wx.getStorageSync('favoriteIds');
      ids = Array.isArray(v) ? v : [];
    } catch (e) {
      ids = [];
    }

    const favorites = ids
      .map((id) => RECIPES.find((r) => r.id === id))
      .filter(Boolean);

    this.setData({ favorites });
  },

  openRecipe(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    // 复用步骤页作为“详情继续做”入口
    wx.navigateTo({ url: `/pages/steps/index?id=${id}` });
  },

  removeFavorite(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;

    let ids = [];
    try {
      const v = wx.getStorageSync('favoriteIds');
      ids = Array.isArray(v) ? v : [];
    } catch (e) {
      ids = [];
    }

    const next = ids.filter((x) => x !== id);
    try {
      wx.setStorageSync('favoriteIds', next);
    } catch (e) {
      // ignore
    }

    this.loadFavorites();
    wx.showToast({ title: '已取消收藏', icon: 'none' });
  }
});

