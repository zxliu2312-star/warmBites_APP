const { RECIPES } = require('../../data/recipes');
const { getFavorites, toggleFavorite } = require('../../utils/api');

Page({
  data: {
    favorites: [],
    showFilter: false,
    selectedIngredients: [], // 选中的食材筛选条件
    isDeleteMode: false, // 是否处于删除模式
    filterCategories: [
      {
        name: '蔬菜',
        items: ['番茄', '土豆', '洋葱', '生菜', '圣女果'],
        active: true
      },
      {
        name: '肉类',
        items: ['猪肋排', '肥牛', '培根'],
        active: false
      },
      {
        name: '蛋类',
        items: ['鸡蛋'],
        active: true
      },
      {
        name: '调料',
        items: ['盐', '糖', '生抽', '老抽', '香醋'],
        active: false
      }
    ]
  },

  onShow() {
    // 每次进入都刷新，确保和首页收藏状态一致
    this.loadFavorites();
  },

  loadFavorites() {
    // 默认9个菜谱（包括西红柿炒鸡蛋）
    const defaultIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    
    let ids = [];
    try {
      const v = wx.getStorageSync('favoriteIds');
      ids = Array.isArray(v) && v.length > 0 ? v : defaultIds;
    } catch (e) {
      ids = defaultIds;
    }

    // 如果存储的列表为空，使用默认列表
    if (ids.length === 0) {
      ids = defaultIds;
    }

    // 保存到存储
    try {
      wx.setStorageSync('favoriteIds', ids);
    } catch (e) {
      // ignore
    }

    let favorites = ids
      .map((id) => RECIPES.find((r) => r.id === id))
      .filter(Boolean);

    // 应用筛选
    favorites = this.applyFilter(favorites);

    this.setData({ favorites });
  },

  // 应用筛选条件
  applyFilter(recipes) {
    const { selectedIngredients } = this.data;
    if (selectedIngredients.length === 0) {
      return recipes;
    }

    return recipes.filter(recipe => {
      // 检查菜谱的食材是否包含所有选中的筛选条件
      const recipeIngredients = recipe.ingredients.join(' ');
      return selectedIngredients.every(ingredient => 
        recipeIngredients.includes(ingredient)
      );
    });
  },

  // 打开筛选弹窗
  openFilter() {
    this.setData({ showFilter: true });
  },

  // 关闭筛选弹窗
  closeFilter() {
    // 关闭弹窗时不清除删除模式状态
    this.setData({ showFilter: false });
  },

  // 切换分类的展开/收起
  toggleCategory(e) {
    const index = e.currentTarget.dataset.index;
    const categories = this.data.filterCategories;
    categories[index].active = !categories[index].active;
    this.setData({ filterCategories: categories });
  },

  // 选择/取消选择食材（按名称切换：点击未选会加入“已选栏”，点击已选栏会移回去）
  toggleIngredientByName(e) {
    const ingredient = e.currentTarget.dataset.ingredient;
    if (!ingredient) return;

    let selectedIngredients = [...this.data.selectedIngredients];
    const idx = selectedIngredients.indexOf(ingredient);

    if (idx > -1) {
      // 已选 -> 取消（移回去）
      selectedIngredients.splice(idx, 1);
    } else {
      // 未选 -> 加入已选
      selectedIngredients.push(ingredient);
    }

    this.setData({ selectedIngredients });
  },

  // 确认筛选
  confirmFilter() {
    this.closeFilter();
    this.loadFavorites();
  },

  // 清除筛选
  clearFilter() {
    this.setData({ selectedIngredients: [] });
    this.closeFilter();
    this.loadFavorites();
  },

  // 切换删除模式
  toggleDeleteMode() {
    const isDeleteMode = !this.data.isDeleteMode;
    this.setData({ isDeleteMode });
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

