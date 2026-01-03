// index.js
const { CATEGORIES, RECIPES } = require('../../data/recipes');

Page({
  data: {
    categories: CATEGORIES,
    recipes: [],
    filteredRecipes: [],
    leftColumnRecipes: [],
    rightColumnRecipes: [],
    selectedCategory: '全部',
    searchQuery: '',
    showModal: false,
    activeRecipe: null,
    activeStepIndex: 0,
    touchStartY: 0
  },

  onLoad() {
    // 初始化时给每个菜卡片一个随机但合理的高度，用于瀑布流效果（分段错落）
    const recipesWithHeight = RECIPES.map((r, index) => {
      const bucket = index % 3; // 0: 短, 1: 中, 2: 稍长
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
      const cardHeight =
        baseMin + Math.floor(Math.random() * (baseMax - baseMin + 1));
      return {
        ...r,
        cardHeight
      };
    });
    this.setData(
      {
        recipes: recipesWithHeight
      },
      () => this.filterRecipes()
    );
  },

  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value }, () => this.filterRecipes());
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.cat;
    this.setData({ selectedCategory: category }, () => this.filterRecipes());
  },

  filterRecipes() {
    const { recipes, selectedCategory, searchQuery } = this.data;
    const keyword = (searchQuery || '').trim();

    const filtered = recipes.filter((item) => {
      const matchCategory =
        selectedCategory === '全部' ||
        item.category === selectedCategory ||
        (item.tags && item.tags.includes(selectedCategory));
      const matchSearch =
        !keyword ||
        item.title.includes(keyword) ||
        (item.tags || []).some((t) => t.includes(keyword));
      return matchCategory && matchSearch;
    });

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
    this.setData({
      activeRecipe: recipe,
      showModal: true,
      activeStepIndex: 0,
      touchStartY: 0
    });
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
  }
});
