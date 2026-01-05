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
    aiSending: false,
    tipsList: [] // 分条后的小提示列表
  },

  onLoad(query) {
    const { id } = query || {};
    const recipe = RECIPES.find((r) => r.id === id) || RECIPES[0];
    if (recipe) {
      // 处理小提示分条
      const tipsList = this.processTips(recipe);
      // 处理图片路径：确保本地图片路径正确
      const processedRecipe = this.processRecipeImages(recipe);
      // 确保数据正确初始化
      this.setData({ 
        recipe: processedRecipe, 
        current: 0, 
        tipsList,
        aiTips: {},
        showAi: false
      });
      wx.setNavigationBarTitle({ title: recipe.title || '烹饪步骤' });
    } else {
      // 如果没有找到菜谱，显示默认提示
      wx.showToast({
        title: '未找到菜谱',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 处理菜谱图片路径，确保本地图片能正确加载
  processRecipeImages(recipe) {
    if (!recipe) return recipe;
    
    const processed = { ...recipe };
    
    // 处理步骤图片路径
    // 注意：小程序中如果图片文件名包含中文字符，可能无法正常加载
    // 建议将图片文件名改为英文，或者使用网络图片
    if (recipe.stepImages && Array.isArray(recipe.stepImages)) {
      processed.stepImages = recipe.stepImages.map(imgPath => {
        if (!imgPath) return imgPath;
        // 确保使用绝对路径格式（从项目根目录开始）
        if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
          return '/' + imgPath;
        }
        return imgPath;
      });
    }
    
    return processed;
  },

  // 将小提示文本分条处理
  processTips(recipe) {
    if (!recipe.stepTips || !Array.isArray(recipe.stepTips)) {
      return [];
    }
    return recipe.stepTips.map(tip => {
      if (!tip) return [];
      // 按句号、分号、换行符分割，过滤空字符串
      return tip.split(/[。；\n]/).filter(item => item.trim().length > 0).map(item => item.trim());
    });
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

      // 当前先用"本地规则回答"占位，保证录屏可演示、功能可跑通
      const answer = this.mockAiAnswer({ 
        recipeId: recipe?.id, 
        stepIndex: aiStepIndex, 
        stepText, 
        question: q 
      });

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
      // 纯前端实现，不显示网络错误
      const finalMessages = [
        ...nextMessages,
        { role: 'assistant', content: '让我想想...你可以尝试调整火候，或者告诉我具体遇到了什么问题，我会给你更详细的建议。' }
      ];
      this.setData({ aiMessages: finalMessages, aiSending: false });
    }
  },

  mockAiAnswer({ recipeId, stepIndex, stepText, question }) {
    // 一个非常轻量的占位策略：按关键词给建议
    const q = String(question || '').toLowerCase();

    // 针对西红柿炒蛋（h2）的特定步骤回答
    if (recipeId === 'h2') {
      // 第一步：番茄切块；鸡蛋加少许盐打散
      if (stepIndex === 0) {
        if (q.includes('切') || q.includes('块') || q.includes('大小') || q.includes('怎么切')) {
          return '西红柿先对半切开，再斜刀切成不规则的小块，每块直径约 2–3 厘米最好哦。这样切出来的西红柿更容易出汁，炒制时也不会太碎。如果切得太小，容易煮烂；切得太大，不容易入味。';
        }
        if (q.includes('鸡蛋') || q.includes('打散') || q.includes('盐')) {
          return '鸡蛋打散时可以加几滴水（约半勺），炒出来会更嫩滑。盐不要加太多，一小撮就够了，主要是为了给鸡蛋提味。用筷子快速打散，直到蛋清和蛋黄完全融合，表面有细密的气泡。';
        }
        return '第一步的关键是切配：西红柿要切成 2–3 厘米的不规则小块，这样更容易出汁；鸡蛋打散时加几滴水会更嫩滑，盐一小撮即可。';
      }
      
      // 第二步：热锅多油炒蛋至嫩滑盛出
      if (stepIndex === 1) {
        if (q.includes('油') || q.includes('多少') || q.includes('热') || q.includes('温度')) {
          return '热锅时记得先把锅里的水擦干，避免油溅。油量大约铺满锅底，能覆盖锅底即可（约 2–3 汤匙）。判断油热了的标准：油面开始出现细密的波纹，或者用筷子插入油中，周围会冒出小气泡。也可以用手指轻弹一滴水到锅里，如果发出"滋啦"声就说明油温够了。';
        }
        if (q.includes('炒蛋') || q.includes('嫩') || q.includes('滑') || q.includes('多久') || q.includes('熟')) {
          return '炒蛋时用中火，快速划散，看到蛋液凝固但还带点湿润时就可以盛出了，这样最嫩。一般炒 30–40 秒就够了，不要炒太久，否则会变老。如果看到鸡蛋完全凝固、颜色变深，就说明炒过了。';
        }
        if (q.includes('水') || q.includes('溅')) {
          return '记得先把锅里的水完全擦干，可以用厨房纸巾擦一下。如果锅里有水，热油时容易溅油，很危险。另外，油温不要太高，中火加热即可。';
        }
        return '第二步的关键是热锅和炒蛋：锅要擦干，油量铺满锅底即可。油热的标准是出现细密波纹或筷子周围冒泡。炒蛋用中火，30–40 秒，看到凝固但还湿润就盛出，这样最嫩。';
      }
      
      // 第三步：锅留底油爆香葱白，下番茄煸炒出汁
      if (stepIndex === 2) {
        if (q.includes('葱') || q.includes('爆香') || q.includes('香味')) {
          return '爆香葱白时用小火，闻到葱香味就可以下番茄了。葱白切段或切末都可以，小火慢慢炒，不要炒焦。如果葱白变黄或变黑，说明火太大了。';
        }
        if (q.includes('番茄') || q.includes('出汁') || q.includes('煸炒') || q.includes('多久')) {
          return '煸炒番茄时用中火，用铲子轻轻按压番茄块，帮助出汁。看到番茄开始变软、出汁水，锅底有红色汤汁时，说明火候刚好。如果番茄比较硬，可以加一勺水帮助出汁。一般炒 2–3 分钟就能出汁。';
        }
        if (q.includes('底油') || q.includes('油')) {
          return '锅留底油是指炒完鸡蛋后，锅里剩下的油。如果底油太少，可以再加一点点油，但不要太多，因为番茄会出汁。';
        }
        return '第三步的关键是爆香和出汁：小火爆香葱白，闻到香味就下番茄。中火煸炒，用铲子按压番茄帮助出汁，看到红色汤汁就说明好了。如果番茄硬，可以加一勺水。';
      }
      
      // 第四步：倒回鸡蛋，加糖和少许番茄酱翻炒均匀，撒葱花出锅
      if (stepIndex === 3) {
        if (q.includes('鸡蛋') || q.includes('倒回') || q.includes('翻炒')) {
          return '倒回鸡蛋后要快速翻炒，让鸡蛋和番茄汁充分融合。不要炒太久，30 秒左右就够了，否则鸡蛋会变老。看到鸡蛋和番茄汁混合均匀，颜色红亮就可以了。';
        }
        if (q.includes('糖') || q.includes('番茄酱') || q.includes('调味') || q.includes('多少')) {
          return '加糖可以中和番茄的酸味，提升鲜味，一般加 1 小勺就够了。番茄酱可以增加颜色和浓郁度，但不要加太多，一勺就够了。如果喜欢更甜一点，可以多加点糖；如果喜欢更酸一点，可以少加点糖。';
        }
        if (q.includes('葱花') || q.includes('出锅') || q.includes('完成')) {
          return '最后撒葱花前可以尝一下味道，根据个人口味调整盐和糖的量。葱花要最后撒，撒完就可以出锅了。如果觉得汁水太多，可以大火收一下汁；如果觉得太干，可以加一点点水。';
        }
        return '第四步的关键是融合和调味：快速翻炒让鸡蛋和番茄汁融合，加糖中和酸味，番茄酱增加浓郁度。最后尝味调整，撒葱花出锅。';
      }
    }

    // 通用回答（其他菜谱或未匹配的问题）
    if (q.includes('火') || q.includes('温度') || q.includes('火候')) {
      return '建议先中小火稳定加热，看到"微微冒泡/出香味"再调整。若容易糊锅：宁可小火多等一会儿，必要时加 1-2 勺水/高汤缓冲。';
    }
    if (q.includes('没有') || q.includes('替换') || q.includes('可不可以')) {
      return '可以替换：优先选"口感/作用相近"的食材。比如提香类（葱姜蒜）可用洋葱/蒜粉；增稠可用少量淀粉水；酸味可用醋/柠檬汁少量多次调整。';
    }
    if (q.includes('熟') || q.includes('几分钟') || q.includes('多久')) {
      return '判断是否熟：看颜色变化、质地变紧/变软、中心温度（肉类无血水、蔬菜断生）。如果不确定：小火多 1-2 分钟，比大火猛冲更稳。';
    }

    // 默认：结合当前步骤文字给通用建议
    return `针对这一步（${stepText}）：建议把动作拆成"预处理-下锅-观察-调整"四段。先确认材料切配到位；下锅后先观察颜色/香味/汁水变化；再按"偏淡加盐、偏干加少量水/汤、偏糊转小火"去微调。`;
  },

  noop() {},

  onImageError(e) {
    // 图片加载失败时，使用默认图片
    const { index } = e.currentTarget.dataset;
    const { recipe } = this.data;
    console.log('图片加载失败，index:', index, '路径:', e.currentTarget.src);
    
    // 如果是步骤图片加载失败，尝试使用主图
    if (recipe && recipe.image && index !== undefined) {
      // 更新该步骤的图片为主图
      const stepImages = [...(recipe.stepImages || [])];
      if (stepImages[index]) {
        stepImages[index] = recipe.image;
        this.setData({
          'recipe.stepImages': stepImages
        });
      }
    }
  }
});

