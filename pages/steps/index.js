const { RECIPES } = require('../../data/recipes');

Page({
  data: {
    recipe: null,
    current: 0
  },

  onLoad(query) {
    const { id } = query || {};
    const recipe = RECIPES.find((r) => r.id === id) || RECIPES[0];
    if (recipe) {
      this.setData({ recipe, current: 0 });
      wx.setNavigationBarTitle({ title: recipe.title || '烹饪步骤' });
    }
  },

  onChange(e) {
    this.setData({ current: e.detail.current });
  },

  goPrev() {
    const { current } = this.data;
    if (current > 0) this.setData({ current: current - 1 });
  },

  goNext() {
    const { recipe, current } = this.data;
    if (!recipe) return;
    const last = recipe.steps.length - 1;
    if (current < last) this.setData({ current: current + 1 });
  }
});

