// index.js
const { CATEGORIES, RECIPES } = require('../../data/recipes');
const { toggleFavorite: apiToggleFavorite, getFavorites } = require('../../utils/api');

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
    // 从服务器获取收藏列表
    this.fetchFavoritesFromServer();
  },

  onUnload() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 重新获取收藏列表
    this.fetchFavoritesFromServer(() => {
      // 刷新完成后停止下拉刷新动画
      wx.stopPullDownRefresh();
    });
  },



  initRecipes() {
    const all = RECIPES;
    // 加载所有菜谱，不再限制数量
    const recipesWithHeight = this.attachStableCardHeight(all);

    // 初始化时使用空收藏列表，等待从服务器获取
    this.setData(
      {
        recipes: recipesWithHeight,
        favoriteIds: [],
        likedIds: [],
        hasMore: false, // 已加载全部，无需分页
        errorMsg: ''
      },
      () => {
        this.filterRecipes();
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
  fetchFavoritesFromServer(callback) {
    const that = this;
    getFavorites(
      (favoriteIds) => {
        if (!Array.isArray(favoriteIds)) {
          // 如果返回的不是数组，使用本地存储
          const localIds = that.getFavoriteIds();
          if (localIds.length > 0) {
            that.setData(
              { favoriteIds: localIds },
              () => {
                that.filterRecipes();
                callback && callback();
              }
            );
          } else {
            callback && callback();
          }
          return;
        }
        // 确保收藏ID都是字符串格式（后端返回的可能是字符串数组）
        const ids = favoriteIds.map(id => String(id));
        that.setFavoriteIds(ids);
        that.setData(
          { favoriteIds: ids },
          () => {
            that.filterRecipes();
            callback && callback();
          }
        );
      },
      (err) => {
        console.error('获取收藏列表失败:', err);
        // 失败时使用本地存储的收藏列表作为备用，不影响菜品显示
        const localIds = that.getFavoriteIds();
        if (localIds.length > 0) {
          that.setData(
            { favoriteIds: localIds },
            () => {
              that.filterRecipes();
              callback && callback();
            }
          );
        } else {
          // 如果本地也没有，至少确保菜品能正常显示（只是没有收藏状态）
          that.filterRecipes();
          callback && callback();
        }
      }
    );
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

  // 收藏/取消收藏（调用后端API）
  toggleFavorite(e) {
    e?.stopPropagation?.();

    const id = e.currentTarget.dataset.id;
    if (!id) return;

    const currentIds = this.data.favoriteIds || [];
    const exists = currentIds.includes(id);
    const nextIsFav = !exists;

    // 触发收藏动画
    this.setData({ favAnimId: id });
    setTimeout(() => {
      this.setData({ favAnimId: '' });
    }, 300);

    // 先更新UI（乐观更新）
    let nextIds;
    if (exists) {
      nextIds = currentIds.filter((x) => x !== id);
    } else {
      nextIds = [id, ...currentIds];
    }

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

    // 调用后端API
    apiToggleFavorite(
      String(id), // 确保recipeId是字符串
      (statusText) => {
        // 成功：显示提示信息
        wx.showToast({
          title: statusText || (nextIsFav ? '已收藏' : '已取消收藏'),
          icon: 'none',
          duration: 1500
        });
        // 保存到本地存储作为缓存
        this.setFavoriteIds(nextIds);
      },
      (err) => {
        // 失败：回滚UI状态
        console.error('收藏操作失败:', err);
        const rollbackIds = exists ? [...nextIds, id] : nextIds.filter((x) => x !== id);
        this.setData(
          {
            favoriteIds: rollbackIds,
            recipes: (this.data.recipes || []).map((r) =>
              r.id === id ? { ...r, isFav: exists, favoriteCount: currentCount } : r
            ),
            activeRecipe:
              this.data.activeRecipe && this.data.activeRecipe.id === id
                ? {
                    ...this.data.activeRecipe,
                    isFav: exists,
                    favoriteCount: currentCount
                  }
                : this.data.activeRecipe
          },
          () => this.filterRecipes()
        );
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
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
