// index.js
const { CATEGORIES, RECIPES } = require('../../data/recipes');

// 后端基础地址 & 临时 userId（按需修改为实际服务地址和登录用户）
const BASE_URL = 'http://localhost:8080'; // TODO: 按实际后端地址修改
const USER_ID = 'demoUser001';           // TODO: 接入登录后替换为真实 userId

Page({
  data: {
    categories: CATEGORIES,

    // 数据
    recipes: [],
    filteredRecipes: [],
    leftColumnRecipes: [],
    rightColumnRecipes: [],

    // 筛选
    selectedCategory: '全部',
    searchQuery: '',

    // 收藏（⭐）
    favoriteIds: [],

    // 喜欢（❤️）- 仅前端演示用，不做存储
    likedIds: [],

    // UI
    showModal: false,
    activeRecipe: null,
    activeStepIndex: 0,
    touchStartY: 0,

    // 点赞动画标记：用于重复触发 CSS 动画
    likeAnimId: '',
    // 收藏动画标记：用于重复触发 CSS 动画
    favAnimId: '',

    // 头部展开/收起
    heroHeight: 480, // 展开状态的高度
    dayCount: 10, // 一起吃饭的天数

    // 状态：为后端/分页预留
    loading: false,
    errorMsg: '',
    pageSize: 10,
    hasMore: true
  },

  onLoad() {
    this.initRecipes();
    // 初始化头部高度为展开状态
    this.setData({
      heroHeight: 480
    });
  },

  onUnload() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  },

  // ====== 通用请求封装（简单版） ======
  request(options) {
    const { url, method = 'GET', data = {}, success, fail, complete } = options;
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      success: (res) => {
        const body = res.data || {};
        if (body.success) {
          success && success(body.data);
        } else {
          wx.showToast({
            title: body.message || '请求失败',
            icon: 'none'
          });
          fail && fail(body);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        fail && fail(err);
      },
      complete
    });
  },


  initRecipes() {
    const all = RECIPES;
    const { pageSize } = this.data;
    const slice = all.slice(0, pageSize);

    const recipesWithHeight = this.attachStableCardHeight(slice);

    // 默认所有菜都收藏
    const defaultFavoriteIds = all.map(r => r.id);

    this.setData(
      {
        recipes: recipesWithHeight,
        favoriteIds: defaultFavoriteIds,
        likedIds: [],
        hasMore: all.length > slice.length,
        errorMsg: ''
      },
      () => {
        // 保存默认收藏列表
        this.setFavoriteIds(defaultFavoriteIds);
        this.filterRecipes();
        // 不再从服务器获取，使用默认收藏
        // this.fetchFavoritesFromServer();
      }
    );
  },

  // 根据 recipe.id 生成可复现的伪随机高度（避免每次进入瀑布流“抖动/变化”）
  // 同时为“点赞量/收藏量”提供可演示的假数据字段：likeCount / favoriteCount
  attachStableCardHeight(list) {
    return (list || []).map((r) => {
      const seed = this.hashStringToInt(r.id || r.title || '');

      const bucket = seed % 3;
      let baseMin = 240;
      let baseMax = 420;
      if (bucket === 0) {
        baseMax = 300;
      } else if (bucket === 1) {
        baseMin = 280;
        baseMax = 360;
      } else {
        baseMin = 320;
      }
      const range = baseMax - baseMin + 1;
      const cardHeight = baseMin + (seed % range);

      const likeCount = (r.likes != null ? r.likes : 0);
      // 为每个菜谱设置不同的默认收藏量（50-350之间）
      const favoriteCount = 50 + (seed % 301);

      return {
        ...r,
        cardHeight,
        likeCount,
        favoriteCount
      };
    });
  },

  // 简单字符串 hash（确定性），用于伪随机
  hashStringToInt(str) {
    const s = String(str);
    let hash = 2166136261;
    for (let i = 0; i < s.length; i++) {
      hash ^= s.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash);
  },

  // ====== 从后端获取当前用户的收藏列表 ======
  fetchFavoritesFromServer() {
    const that = this;
    this.request({
      url: '/api/favorite',
      method: 'GET',
      data: {
        userId: USER_ID
      },
      success(favoriteIds) {
        if (!Array.isArray(favoriteIds)) {
          return;
        }
        that.setFavoriteIds(favoriteIds);
        that.setData(
          { favoriteIds },
          () => that.filterRecipes()
        );
      }
    });
  },

  onSearchInput(e) {
    const value = e.detail.value;
    this.setData({ searchQuery: value });

    if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
    this._searchDebounceTimer = setTimeout(() => {
      this.filterRecipes();
    }, 300);
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.cat;
    this.setData({ selectedCategory: category }, () => this.filterRecipes());
  },

  filterRecipes() {
    const { recipes, selectedCategory, searchQuery, favoriteIds, likedIds } = this.data;
    const keyword = (searchQuery || '').trim();

    const filtered = recipes
      .filter((item) => {
        const matchCategory =
          selectedCategory === '全部' ||
          item.category === selectedCategory ||
          (item.tags && item.tags.includes(selectedCategory));
        const matchSearch =
          !keyword ||
          item.title.includes(keyword) ||
          (item.tags || []).some((t) => t.includes(keyword));
        return matchCategory && matchSearch;
      })
      .map((item) => ({
        ...item,
        isFav: favoriteIds.includes(item.id),
        isLiked: likedIds.includes(item.id)
      }));

    const { left, right } = this.distributeToColumns(filtered);

    this.setData({
      filteredRecipes: filtered,
      leftColumnRecipes: left,
      rightColumnRecipes: right
    });
  },

  distributeToColumns(list) {
    const left = [];
    const right = [];
    let leftHeight = 0;
    let rightHeight = 0;

    list.forEach((item) => {
      const h = item.cardHeight || 320;
      if (leftHeight <= rightHeight) {
        left.push(item);
        leftHeight += h;
      } else {
        right.push(item);
        rightHeight += h;
      }
    });

    return { left, right };
  },

  openRecipe(e) {
    const id = e.currentTarget.dataset.id;
    const recipe = this.data.recipes.find((r) => r.id === id);
    if (!recipe) return;

    const isFav = this.data.favoriteIds.includes(id);
    const isLiked = this.data.likedIds.includes(id);

    const favoriteCount = (this.data.favoriteIds || []).length;

    this.setData({
      activeRecipe: { ...recipe, isFav, isLiked, favoriteCount: recipe.favoriteCount ?? favoriteCount },
      showModal: true,
      activeStepIndex: 0,
      touchStartY: 0
    });
  },

  // ===== 收藏：现在以后端为准，本地仅做缓存 =====
  getFavoriteIds() {
    try {
      const ids = wx.getStorageSync('favoriteIds');
      return Array.isArray(ids) ? ids : [];
    } catch (e) {
      return [];
    }
  },

  setFavoriteIds(ids) {
    try {
      wx.setStorageSync('favoriteIds', ids);
    } catch (e) {
      // ignore
    }
  },

  // 收藏/取消收藏（纯前端实现）
  toggleFavorite(e) {
    e?.stopPropagation?.();

    const id = e.currentTarget.dataset.id;
    if (!id) return;

    const currentIds = this.data.favoriteIds || [];
    const exists = currentIds.includes(id);
    let nextIds;
    let nextIsFav;

    if (exists) {
      nextIds = currentIds.filter((x) => x !== id);
      nextIsFav = false;
    } else {
      nextIds = [id, ...currentIds];
      nextIsFav = true;
    }

    // 触发收藏动画
    this.setData({ favAnimId: id });
    setTimeout(() => {
      this.setData({ favAnimId: '' });
    }, 300);

    // 保存到本地存储
    this.setFavoriteIds(nextIds);

    // 更新收藏数量：在原有基础上加一或减一
    const currentRecipe = this.data.recipes.find(r => r.id === id);
    const currentCount = currentRecipe ? (currentRecipe.favoriteCount || 0) : 0;
    const newFavoriteCount = nextIsFav ? currentCount + 1 : Math.max(0, currentCount - 1);

    const updateRecipeFavFlag = (r) =>
      r.id === id ? { ...r, isFav: nextIsFav, favoriteCount: newFavoriteCount } : r;

    this.setData(
      {
        favoriteIds: nextIds,
        recipes: (this.data.recipes || []).map(updateRecipeFavFlag),
        activeRecipe:
          this.data.activeRecipe && this.data.activeRecipe.id === id
            ? {
                ...this.data.activeRecipe,
                isFav: nextIsFav,
                favoriteCount: newFavoriteCount
              }
            : this.data.activeRecipe
      },
      () => this.filterRecipes()
    );
  },

  // 喜欢（❤️）- 仅前端演示用，不做存储
  toggleLike(e) {
    e?.stopPropagation?.();
    const id = e.currentTarget.dataset.id;
    if (!id) return;

    const { likedIds } = this.data;
    const nextLikedIds = likedIds.includes(id)
      ? likedIds.filter(x => x !== id)
      : [...likedIds, id];

    const nextIsLiked = !likedIds.includes(id);

    // 触发一次“点赞动画”，保证每次点击都能重复播放
    this.setData({ likeAnimId: id });
    setTimeout(() => {
      this.setData({ likeAnimId: '' });
    }, 300);

    const updateRecipeLikeFlag = (r) => (r.id === id
      ? { ...r, isLiked: nextIsLiked }
      : r);

    this.setData({
      likedIds: nextLikedIds,
      recipes: (this.data.recipes || []).map(updateRecipeLikeFlag),
      activeRecipe: this.data.activeRecipe && this.data.activeRecipe.id === id
        ? { ...this.data.activeRecipe, isLiked: nextIsLiked }
        : this.data.activeRecipe
    }, () => this.filterRecipes());
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  onStepChange(e) {
    this.setData({ activeStepIndex: e.detail.current });
  },

  goPrevStep() {
    const { activeStepIndex } = this.data;
    if (activeStepIndex > 0) {
      this.setData({ activeStepIndex: activeStepIndex - 1 });
    }
  },

  goNextStep() {
    const { activeRecipe, activeStepIndex } = this.data;
    if (!activeRecipe) return;
    const last = activeRecipe.steps.length - 1;
    if (activeStepIndex < last) {
      this.setData({ activeStepIndex: activeStepIndex + 1 });
    }
  },

  startCook() {
    const { activeRecipe } = this.data;
    if (!activeRecipe) return;
    wx.navigateTo({
      url: `/pages/steps/index?id=${activeRecipe.id}`
    });
  },

  onModalTouchStart(e) {
    this.setData({ touchStartY: e.touches?.[0]?.clientY || 0 });
  },

  onModalTouchEnd(e) {
    const endY = e.changedTouches?.[0]?.clientY || 0;
    const delta = endY - this.data.touchStartY;
    if (delta > 80) {
      this.closeModal();
    }
  },

  noop() {
    // 占位，阻止遮罩滑动穿透
  },

  // 手动切换展开/收起
  toggleHero() {
    const { heroHeight } = this.data;
    const EXPANDED_HEIGHT = 480;
    const COLLAPSED_HEIGHT = 140;
    
    const newHeight = heroHeight > 160 ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
    
    this.setData({
      heroHeight: newHeight
    });
  }
});
