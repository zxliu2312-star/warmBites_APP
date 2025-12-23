// index.js
const { CATEGORIES, RECIPES } = require('../../data/recipes');

Page({
  data: {
    categories: CATEGORIES,
    recipes: RECIPES,
    filteredRecipes: RECIPES,
    selectedCategory: '全部',
    searchQuery: '',
    showModal: false,
    activeRecipe: null,
    activeStepIndex: 0,
    touchStartY: 0
  },

  onLoad() {
    this.filterRecipes();
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

    this.setData({ filteredRecipes: filtered });
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
