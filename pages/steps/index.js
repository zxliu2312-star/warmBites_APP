const { RECIPES } = require('../../data/recipes');

Page({
  data: {
    recipe: null,
    current: 0,

    // AI（仅本次做菜流程暂存，不落地存储）
    aiTips: {},
    showAi: false,
    aiStepIndex: 0,
    aiMessages: [],
    aiInput: '',
    aiSending: false
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
  },

  // ===== AI 助手（前端占位：后端接入时替换 request URL） =====
  openAi(e) {
    const stepIndex = Number(e.currentTarget.dataset.stepIndex || 0);
    const stepText = this.data.recipe?.steps?.[stepIndex] || '';

    this.setData({
      showAi: true,
      aiStepIndex: stepIndex,
      aiInput: '',
      aiSending: false,
      aiMessages: [
        {
          role: 'assistant',
          content: `我在～你正在做「步骤 ${stepIndex + 1}」：${stepText}\n\n你可以问：火候怎么控制？没有某个食材怎么办？怎么看熟没熟？`
        }
      ]
    });
  },

  closeAi() {
    this.setData({ showAi: false, aiInput: '' });
  },

  onAiInput(e) {
    this.setData({ aiInput: e.detail.value });
  },

  async sendAi() {
    const q = (this.data.aiInput || '').trim();
    if (!q || this.data.aiSending) return;

    const { recipe, aiStepIndex, aiMessages } = this.data;
    const stepText = recipe?.steps?.[aiStepIndex] || '';

    const nextMessages = [...aiMessages, { role: 'user', content: q }];

    this.setData({
      aiSending: true,
      aiMessages: nextMessages,
      aiInput: ''
    });

    try {
      // TODO：后端同学接好后，把这里替换成真实接口
      // 例如：POST https://your-domain.com/api/ai/ask
      // body: { recipeId: recipe.id, stepIndex: aiStepIndex, stepText, question: q }

      // 当前先用“本地规则回答”占位，保证录屏可演示、功能可跑通
      const answer = this.mockAiAnswer({ stepText, question: q });

      const finalMessages = [...nextMessages, { role: 'assistant', content: answer }];

      // 关闭弹窗时要把“最后一条 assistant 回复”暂存到该步骤的小提示下面
      const nextTips = { ...(this.data.aiTips || {}) };
      nextTips[aiStepIndex] = answer;

      this.setData({
        aiMessages: finalMessages,
        aiTips: nextTips,
        aiSending: false
      });
    } catch (err) {
      const finalMessages = [
        ...nextMessages,
        { role: 'assistant', content: '我这边暂时连不上服务，你可以换个问法或稍后再试～' }
      ];
      this.setData({ aiMessages: finalMessages, aiSending: false });
    }
  },

  mockAiAnswer({ stepText, question }) {
    // 一个非常轻量的占位策略：按关键词给建议
    const q = String(question || '').toLowerCase();

    if (q.includes('火') || q.includes('温度') || q.includes('火候')) {
      return '建议先中小火稳定加热，看到“微微冒泡/出香味”再调整。若容易糊锅：宁可小火多等一会儿，必要时加 1-2 勺水/高汤缓冲。';
    }
    if (q.includes('没有') || q.includes('替换') || q.includes('可不可以')) {
      return '可以替换：优先选“口感/作用相近”的食材。比如提香类（葱姜蒜）可用洋葱/蒜粉；增稠可用少量淀粉水；酸味可用醋/柠檬汁少量多次调整。';
    }
    if (q.includes('熟') || q.includes('几分钟') || q.includes('多久')) {
      return '判断是否熟：看颜色变化、质地变紧/变软、中心温度（肉类无血水、蔬菜断生）。如果不确定：小火多 1-2 分钟，比大火猛冲更稳。';
    }

    // 默认：结合当前步骤文字给通用建议
    return `针对这一步（${stepText}）：建议把动作拆成“预处理-下锅-观察-调整”四段。先确认材料切配到位；下锅后先观察颜色/香味/汁水变化；再按“偏淡加盐、偏干加少量水/汤、偏糊转小火”去微调。`;
  },

  noop() {}
});

