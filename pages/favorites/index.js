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
        name: '肉类',
        items: ['猪肋排', '肥牛', '培根', '鸡胸肉', '鸡腿肉', '猪里脊', '牛里脊', '牛肉', '猪排骨', '虾仁', '扇贝', '鲈鱼', '三文鱼'],
        active: false
      },
      {
        name: '蔬菜',
        items: ['番茄', '土豆', '茄子', '青椒', '生菜', '西蓝花', '芦笋', '魔芋丝', '木耳', '大葱', '小葱', '青蒜苗', '豆芽', '红苋菜'],
        active: false
      },
      {
        name: '蛋类',
        items: ['鸡蛋', '蛋黄', '全蛋液'],
        active: false
      },
      {
        name: '主食',
        items: ['鲜面条', '意大利面', '米饭', '鲜河粉', '粉丝'],
        active: false
      },
      {
        name: '调料',
        items: ['大蒜', '姜', '白糖', '盐', '生抽', '老抽', '蚝油', '番茄酱', '冰糖', '豆瓣酱', '甜面酱', '泡椒', '花椒粉', '辣椒面', '干辣椒段', '豆豉'],
        active: false
      },
      {
        name: '烘焙',
        items: ['淡奶油', '牛奶', '低筋面粉', '面粉', '无盐黄油', '冷藏黄油', '糖粉', '可可粉', '巧克力豆', '蔓越莓碎', '芝士碎', '冷冻挞皮'],
        active: false
      },
      {
        name: '其他',
        items: ['柠檬', '皮蛋', '咸蛋黄', '高汤', '花生米', '火腿'],
        active: false
      }
    ]
  },

  onShow() {
    // 每次进入都刷新，确保和首页收藏状态一致
    this.loadFavorites();
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 从服务器重新获取收藏列表
    const { getFavorites } = require('../../utils/api');
    const that = this;
    
    getFavorites(
      (favoriteIds) => {
        // 确保收藏ID都是字符串格式
        const ids = Array.isArray(favoriteIds) 
          ? favoriteIds.map(id => String(id))
          : [];
        
        // 保存到本地存储作为缓存
        try {
          wx.setStorageSync('favoriteIds', ids);
        } catch (e) {
          console.error('保存收藏列表到本地失败:', e);
        }

        // 根据收藏ID获取菜谱详情
        let favorites = ids
          .map((id) => RECIPES.find((r) => String(r.id) === id))
          .filter(Boolean);

        // 应用筛选
        favorites = that.applyFilter(favorites);

        that.setData({ favorites });
        
        // 停止下拉刷新动画
        wx.stopPullDownRefresh();
      },
      (err) => {
        console.error('获取收藏列表失败:', err);
        // 失败时使用本地存储的收藏列表作为备用
        that.loadFavorites();
        // 停止下拉刷新动画
        wx.stopPullDownRefresh();
      }
    );
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

    // 同义词映射表（用于更智能的匹配）
    const ingredientMap = {
      '肥牛': ['肥牛', '肥牛卷'],
      '糖': ['白糖', '冰糖', '糖粉', '糖'],
      '酱油': ['生抽', '老抽', '蒸鱼豉油', '酱油'],
      '醋': ['香醋', '醋'],
      '葱': ['小葱', '大葱', '葱丝', '青蒜苗', '葱'],
      '蒜': ['大蒜', '蒜泥', '蒜末', '蒜蓉', '蒜'],
      '姜': ['姜', '葱姜'],
      '鸡蛋': ['鸡蛋', '蛋黄', '全蛋液'],
      '面粉': ['低筋面粉', '面粉'],
      '黄油': ['无盐黄油', '冷藏黄油', '黄油'],
      '芝士': ['芝士碎', '芝士'],
      '豆芽': ['豆芽', '黄豆芽'],
      '辣椒': ['干辣椒段', '辣椒面', '泡椒', '辣椒'],
      '豆瓣': ['豆瓣酱', '豆瓣'],
      '排骨': ['猪肋排', '猪排骨', '排骨'],
      '鸡肉': ['鸡胸肉', '鸡腿肉', '三黄鸡', '鸡肉'],
      '鱼肉': ['鲈鱼', '三文鱼', '鱼'],
      '虾': ['虾仁', '虾'],
      '牛肉': ['牛里脊', '牛肉', '牛肉末'],
      '猪肉': ['猪里脊', '二刀肉', '猪肋排', '猪排骨', '猪肉'],
      '土豆': ['土豆'],
      '番茄': ['番茄', '西红柿'],
      '茄子': ['茄子'],
      '青椒': ['青椒'],
      '生菜': ['生菜'],
      '西蓝花': ['西蓝花'],
      '芦笋': ['芦笋'],
      '魔芋': ['魔芋丝', '魔芋'],
      '木耳': ['黑木耳', '木耳'],
      '粉丝': ['粉丝'],
      '面条': ['鲜面条', '面条'],
      '意面': ['意大利面', '意面'],
      '河粉': ['鲜河粉', '河粉'],
      '米饭': ['米饭'],
      '培根': ['培根'],
      '火腿': ['火腿'],
      '柠檬': ['柠檬'],
      '皮蛋': ['皮蛋'],
      '咸蛋黄': ['咸蛋黄'],
      '花生': ['花生米', '花生'],
      '牛奶': ['牛奶'],
      '淡奶油': ['淡奶油', '奶油'],
      '可可粉': ['可可粉', '可可'],
      '巧克力': ['巧克力豆', '巧克力'],
      '蔓越莓': ['蔓越莓碎', '蔓越莓'],
      '吐司': ['厚吐司', '吐司']
    };

    return recipes.filter(recipe => {
      // 将菜谱的食材列表转换为小写，便于匹配
      const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
      
      // 检查所有选中的食材是否都在菜谱中
      return selectedIngredients.every(selectedIngredient => {
        const searchTerm = selectedIngredient.toLowerCase().trim();
        
        // 1. 先尝试直接匹配（检查每个食材项是否包含搜索词）
        const directMatch = recipeIngredients.some(ing => {
          // 移除数量单位等，只匹配食材名称
          return ing.includes(searchTerm);
        });
        
        if (directMatch) {
          return true;
        }
        
        // 2. 同义词匹配
        // 查找搜索词对应的所有同义词变体
        let matchedVariants = [searchTerm];
        
        // 查找是否有对应的同义词组
        for (const [key, variants] of Object.entries(ingredientMap)) {
          const keyLower = key.toLowerCase();
          const variantsLower = variants.map(v => v.toLowerCase());
          
          // 如果搜索词是key或者是variants中的一个
          if (keyLower === searchTerm || variantsLower.includes(searchTerm)) {
            matchedVariants = variantsLower;
            break;
          }
        }
        
        // 检查是否有任何同义词变体在菜谱中
        return matchedVariants.some(variant => {
          return recipeIngredients.some(ing => {
            // 检查食材项是否包含该变体（支持部分匹配）
            return ing.includes(variant);
          });
        });
      });
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

