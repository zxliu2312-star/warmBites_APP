const CATEGORIES = [
    "全部",
    "家常菜",
    "快手菜",
    "烘焙",
    "川菜",
    "粤菜"
  ];
  
  const RECIPES = [
    {
      id: "1",
      title: "经典番茄炒蛋",
      image: "https://th.bing.com/th/id/R.c6bb4910f2abedad1c29abf1d7b8b2db?rik=lI9LjcI8PB35bQ&riu=http%3a%2f%2fi2.chuimg.com%2f78efc32a192011e7947d0242ac110002_800w_450h.jpg%3fimageView2%2f2%2fw%2f660%2finterlace%2f1%2fq%2f90&ehk=wHIeknD3pLXYihaPU8JPSYf%2fMtMteH8jpoqT3%2fPLlU4%3d&risl=&pid=ImgRaw&r=0",
      time: "15分钟",
      likes: 899,
      tags: ["国民菜", "酸甜", "快手"],
      description: "酸甜多汁的番茄搭配嫩滑鸡蛋，每一口都是家的味道。",
      ingredients: ["番茄 2个", "鸡蛋 3个", "小葱 2根", "白糖 1勺", "盐 适量", "番茄酱 1勺"],
      steps: ["准备两个番茄并切块；准备鸡蛋三个加少许盐打散。", "热锅多油炒蛋至嫩滑盛出。", "锅留底油爆香葱白，下番茄煸炒出汁。", "倒回鸡蛋，加糖和少许番茄酱翻炒均匀，撒葱花出锅。"],
      stepImages: ["/data/eggsAndTomatosSteps/step1.png", "/data/eggsAndTomatosSteps/step2.png", "/data/eggsAndTomatosSteps/step3.png", "/data/eggsAndTomatosSteps/step4.png"],
      stepTips: ["听说西红柿先对半切开，再斜刀切成不规则的小块，每块直径约 2–3 厘米最好哦。这样切出来的西红柿更容易出汁，口感也更好。鸡蛋打散时可以加几滴水，炒出来会更嫩滑。", "热锅时记得先把锅里的水擦干，避免油溅。油量大约铺满锅底，能覆盖锅底即可。判断油热了的标准：油面开始出现细密的波纹，或者用筷子插入油中，周围会冒出小气泡。炒蛋时用中火，快速划散，看到蛋液凝固但还带点湿润时就可以盛出了，这样最嫩。", "爆香葱白时用小火，闻到葱香味就可以下番茄了。煸炒番茄时用中火，用铲子轻轻按压番茄块，帮助出汁。看到番茄开始变软、出汁水，锅底有红色汤汁时，说明火候刚好。如果番茄比较硬，可以加一勺水帮助出汁。", "倒回鸡蛋后要快速翻炒，让鸡蛋和番茄汁充分融合。加糖可以中和番茄的酸味，提升鲜味。番茄酱可以增加颜色和浓郁度，但不要加太多，一勺就够了。最后撒葱花前可以尝一下味道，根据个人口味调整盐和糖的量。"],
      category: "家常菜"
    },
    {
      id: "2",
      title: "红烧土豆炖排骨",
      image: "https://th.bing.com/th/id/R.c6bb4910f2abedad1c29abf1d7b8b2db?rik=lI9LjcI8PB35bQ&riu=http%3a%2f%2fi2.chuimg.com%2f78efc32a192011e7947d0242ac110002_800w_450h.jpg%3fimageView2%2f2%2fw%2f660%2finterlace%2f1%2fq%2f90&ehk=wHIeknD3pLXYihaPU8JPSYf%2fMtMteH8jpoqT3%2fPLlU4%3d&risl=&pid=ImgRaw&r=0",
      time: "90分钟",
      likes: 420,
      tags: ["红烧", "家常", "下饭"],
      description: "排骨酥烂脱骨，土豆吸满肉汁，酱香浓郁，非常下饭。",
      ingredients: ["猪肋排 500g", "土豆 2个", "姜 1块", "冰糖 20g", "老抽 1勺"],
      steps: ["排骨冷水下锅焯水去血沫，洗净备用。", "小火炒糖色至枣红色，下排骨翻炒上色。", "加入调料和热水，小火炖45分钟。", "加入土豆再炖20分钟，大火收汁。"],
      category: "家常菜"
    },
    {
      id: "3",
      title: "地三鲜",
      image: "https://tse4.mm.bing.net/th/id/OIP.0jdz0J-OFLl5ngKDAb7N9wHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      time: "30分钟",
      likes: 380,
      tags: ["东北菜", "素菜", "下饭"],
      description: "土豆、茄子、青椒外酥里糯，浓油赤酱，经典东北味。",
      ingredients: ["土豆 1个", "茄子 1根", "青椒 1个", "大蒜 4瓣"],
      steps: ["土豆茄子切块，茄子撒盐腌制。", "调好酱汁备用。", "三样食材分别过油。", "爆香蒜末，下食材和酱汁翻炒。"],
      category: "家常菜"
    },
    {
      id: "4",
      title: "蒜蓉粉丝蒸扇贝",
      image: "https://cp1.douguo.com/upload/caiku/f/4/e/yuan_f46d69c74dbc1caa226c267762cb036e.jpeg",
      time: "20分钟",
      likes: 510,
      tags: ["海鲜", "蒜香", "清蒸"],
      description: "蒜香浓郁，粉丝吸满海鲜鲜味，鲜甜可口。",
      ingredients: ["扇贝 6只", "粉丝 1把", "大蒜 1头", "蚝油 1勺"],
      steps: ["粉丝泡软铺底，扇贝洗净摆放。", "蒜蓉炒香调味。", "蒜蓉铺在扇贝上。", "水开后大火蒸5-6分钟。"],
      category: "家常菜"
    },
    {
      id: "5",
      title: "蚝油生菜",
      image: "https://tse1.mm.bing.net/th/id/OIP.5jGbC3wSo0VyrxiEzdxdyQHaF7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      time: "10分钟",
      likes: 290,
      tags: ["素菜", "清爽", "快手"],
      description: "生菜爽脆，蚝油蒜香浓郁，清爽解腻。",
      ingredients: ["生菜 300g", "大蒜 5瓣", "蚝油 2勺", "白糖 少许"],
      steps: ["生菜焯水迅速捞出。", "蒜末小火炒香。", "加入蚝油和少量水煮开。", "勾薄芡浇在生菜上。"],
      category: "家常菜"
    },
    {
      id: "6",
      title: "葱油拌面",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600",
      time: "15分钟",
      likes: 460,
      tags: ["面食", "经典", "快手"],
      description: "焦香葱油配酱油，简单却极致好吃。",
      ingredients: ["鲜面条 200g", "小葱 50g", "生抽 2勺", "白糖 1勺"],
      steps: ["小火熬葱油至焦香。", "加入酱油和糖煮开。", "面条煮熟沥干。", "拌入葱油即可。"],
      category: "快手餐"
    },
    {
      id: "7",
      title: "滑蛋虾仁",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600",
      time: "10分钟",
      likes: 520,
      tags: ["嫩滑", "快手", "鲜美"],
      description: "虾仁爽脆，鸡蛋滑嫩，口感极佳。",
      ingredients: ["虾仁 150g", "鸡蛋 3个", "小葱 1根"],
      steps: ["虾仁焯水备用。", "蛋液调味。", "虾仁拌入蛋液。", "小火推炒至滑嫩。"],
      category: "快手餐"
    },
    {
      id: "8",
      title: "蒜香培根炒意面",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600",
      time: "20分钟",
      likes: 410,
      tags: ["西餐", "蒜香", "快手"],
      description: "培根油脂和蒜香包裹意面，筋道咸香。",
      ingredients: ["意大利面 100g", "培根 3片", "大蒜 5瓣"],
      steps: ["意面煮熟。", "蒜片和培根煎香。", "下意面翻炒。", "加黑胡椒调味。"],
      category: "快手餐"
    },
    {
      id: "9",
      title: "葱爆肥牛卷",
      image: "https://th.bing.com/th/id/R.6cb352aa31dce7bea28b43e15e81614c",
      time: "15分钟",
      likes: 600,
      tags: ["快手", "下饭", "肉菜"],
      description: "大葱香甜，肥牛滑嫩，非常下饭。",
      ingredients: ["肥牛卷 250g", "大葱 1根"],
      steps: ["肥牛焯水备用。", "大葱爆香。", "下肥牛大火翻炒。", "调味收汁。"],
      category: "快手餐"
    },
    {
      id: "10",
      title: "黄金蛋炒饭",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600",
      time: "15分钟",
      likes: 700,
      tags: ["炒饭", "经典", "快手"],
      description: "蛋液包裹米粒，粒粒分明。",
      ingredients: ["米饭 1碗", "鸡蛋 2个", "火腿 1根"],
      steps: ["米饭拌蛋黄。", "火腿炒香。", "下米饭大火翻炒。", "加葱花调味。"],
      category: "快手餐"
    },
    {
      id: "11",
      title: "柠檬手撕鸡胸肉",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=600",
      time: "30分钟",
      likes: 330,
      tags: ["减脂", "高蛋白", "清爽"],
      description: "低脂高蛋白，清爽开胃。",
      ingredients: ["鸡胸肉 250g", "柠檬 半个"],
      steps: ["鸡胸肉煮熟。", "顺纹手撕。", "调柠檬料汁。", "抓匀静置。"],
      category: "减脂餐"
    },
    {
      id: "12",
      title: "清蒸鲈鱼",
      image: "https://tse2.mm.bing.net/th/id/OIP.gZRy4CQd4Hp49UtywUqYiAHaE8",
      time: "20分钟",
      likes: 480,
      tags: ["清淡", "蒸菜", "健康"],
      description: "鱼肉鲜嫩，最大程度保留营养。",
      ingredients: ["鲈鱼 1条", "葱姜 适量"],
      steps: ["鲈鱼处理干净。", "水开后蒸8分钟。", "倒掉腥水。", "淋蒸鱼豉油。"],
      category: "减脂餐"
    },
    {
      id: "13",
      title: "西蓝花拌虾仁",
      image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6",
      time: "15分钟",
      likes: 360,
      tags: ["减脂", "清爽", "高蛋白"],
      description: "清爽低脂，营养均衡。",
      ingredients: ["西蓝花 300g", "虾仁 150g"],
      steps: ["焯西蓝花和虾仁。", "蒜末拌油。", "混合抓匀。"],
      category: "减脂餐"
    },
    {
      id: "14",
      title: "凉拌魔芋酸辣粉",
      image: "https://ibeauty.media/wp-content/uploads/2023/03/1680243451_maxresdefault.jpg",
      time: "15分钟",
      likes: 310,
      tags: ["减脂", "酸辣", "爽口"],
      description: "低热量代餐，酸辣开胃。",
      ingredients: ["魔芋丝 200g", "木耳 50g"],
      steps: ["魔芋去碱。", "配菜焯水。", "拌入调料。"],
      category: "减脂餐"
    },
    {
      id: "15",
      title: "香煎三文鱼配芦笋",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
      time: "25分钟",
      likes: 540,
      tags: ["西餐", "健康", "低脂"],
      description: "鱼皮焦香，肉质嫩滑。",
      ingredients: ["三文鱼 200g", "芦笋 1把"],
      steps: ["三文鱼吸干水分。", "煎至金黄。", "翻面煎熟。", "挤柠檬汁。"],
      category: "减脂餐"
    },
    {
      id: "16",
      title: "葡式蛋挞（懒人版）",
      image: "https://th.bing.com/th/id/R.6869fba3fff640fc85675cd542b65878",
      time: "30分钟",
      likes: 520,
      tags: ["烘焙", "甜点", "奶香"],
      description: "外酥内滑，奶香浓郁，表面焦糖斑点是成功标志。",
      ingredients: [
        "冷冻挞皮 12个",
        "淡奶油 150g",
        "牛奶 100g",
        "蛋黄 3个"
      ],
      steps: [
        "牛奶加热化糖，加入淡奶油轻轻搅匀。",
        "加入蛋黄搅匀，至少过筛两次保证顺滑。",
        "蛋液倒入挞皮至8-9分满。",
        "210度烤25分钟至出现焦糖斑。"
      ],
      category: "烘焙"
    },
    {
      id: "17",
      title: "黄油曲奇饼干",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
      time: "40分钟",
      likes: 610,
      tags: ["烘焙", "曲奇", "黄油香"],
      description: "浓郁黄油香气，入口即化的经典挤花曲奇。",
      ingredients: [
        "无盐黄油 130g",
        "低筋面粉 200g",
        "糖粉 50g",
        "全蛋液 30g"
      ],
      steps: [
        "黄油软化加糖粉打发至蓬松。",
        "分次加入蛋液打匀防止油水分离。",
        "筛入面粉切拌至无干粉。",
        "挤花后170度烤18分钟至边缘微黄。"
      ],
      category: "烘焙"
    },
    {
      id: "18",
      title: "蔓越莓司康",
      image: "https://tse2.mm.bing.net/th/id/OIP.R8k_bBdXpPTAd79RZUVH-AHaFj",
      time: "35分钟",
      likes: 430,
      tags: ["烘焙", "下午茶", "英式"],
      description: "外酥内软，微酸果香的英式经典司康。",
      ingredients: [
        "面粉 250g",
        "冷藏黄油 60g",
        "牛奶 100g",
        "蔓越莓碎 50g"
      ],
      steps: [
        "黄油与面粉快速搓成粗砂状。",
        "加入牛奶和蔓越莓拌成团。",
        "折叠一次，压至2cm厚切块。",
        "刷蛋液，180度烤20分钟。"
      ],
      category: "烘焙"
    },
    {
      id: "19",
      title: "巧克力麦芬",
      image: "https://tse1.explicit.bing.net/th/id/OIP.fcJbL0p7czCUvK1VmE14TwHaE8",
      time: "35分钟",
      likes: 560,
      tags: ["烘焙", "巧克力", "美式甜点"],
      description: "湿润扎实，巧克力豆半融化的爆浆口感。",
      ingredients: [
        "可可粉 20g",
        "鸡蛋 1个",
        "牛奶 120ml",
        "巧克力豆 50g"
      ],
      steps: [
        "干料混合，湿料充分乳化。",
        "湿料倒入干料粗拌20次。",
        "装杯撒巧克力豆。",
        "180度烤25分钟至爆顶。"
      ],
      category: "烘焙"
    },
    {
      id: "20",
      title: "香蒜芝士烤吐司",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
      time: "15分钟",
      likes: 480,
      tags: ["烘焙", "早餐", "蒜香"],
      description: "蒜香黄油与芝士高温融合，拉丝浓郁。",
      ingredients: [
        "厚吐司 2片",
        "黄油 30g",
        "蒜泥 10g",
        "芝士碎 适量"
      ],
      steps: [
        "黄油融化混合蒜泥和盐。",
        "蒜酱均匀涂抹吐司。",
        "铺满芝士。",
        "190度烤10分钟至冒泡。"
      ],
      category: "烘焙"
    },
    {
      id: "21",
      title: "麻婆豆腐",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
      time: "25分钟",
      likes: 780,
      tags: ["川菜", "麻辣", "下饭"],
      description: "麻、辣、烫、嫩、酥兼具的川菜灵魂。",
      ingredients: [
        "嫩豆腐 400g",
        "牛肉末 50g",
        "豆瓣酱 20g",
        "花椒粉 适量"
      ],
      steps: [
        "豆腐切块盐水焯烫防碎。",
        "肉末小火炒至酥香。",
        "豆瓣酱炒红下豆腐焖煮。",
        "三次勾芡，撒花椒粉出锅。"
      ],
      category: "川菜"
    },
    {
      id: "22",
      title: "宫保鸡丁",
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
      time: "25分钟",
      likes: 690,
      tags: ["川菜", "经典", "酸甜微辣"],
      description: "鸡肉滑嫩，花生酥脆，胡辣荔枝味。",
      ingredients: [
        "鸡腿肉 250g",
        "花生米 50g",
        "干辣椒段 10g",
        "白糖 20g"
      ],
      steps: [
        "鸡丁腌制，调好碗汁。",
        "大火滑炒鸡丁盛出。",
        "炸辣椒出糊香。",
        "回锅合炒收汁。"
      ],
      category: "川菜"
    },
    {
      id: "23",
      title: "回锅肉",
      image: "https://th.bing.com/th/id/R.b3e4f7f41141b9e9570a215919ebdf96",
      time: "40分钟",
      likes: 820,
      tags: ["川菜", "经典", "酱香"],
      description: "肥而不腻，灯盏窝是成功标志。",
      ingredients: [
        "二刀肉 300g",
        "青蒜苗 100g",
        "甜面酱 5g",
        "豆瓣酱 1勺"
      ],
      steps: [
        "五花肉煮八成熟切片。",
        "煸炒至卷曲吐油。",
        "下豆瓣甜面酱炒香。",
        "下蒜苗断生出锅。"
      ],
      category: "川菜"
    },
    {
      id: "24",
      title: "鱼香肉丝",
      image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da",
      time: "25分钟",
      likes: 760,
      tags: ["川菜", "酸甜", "经典"],
      description: "不见鱼却满是鱼香的经典代表。",
      ingredients: [
        "猪里脊 200g",
        "泡椒 20g",
        "黑木耳 50g",
        "鱼香汁 适量"
      ],
      steps: [
        "肉丝腌制滑散。",
        "泡椒炒出红油。",
        "下配菜和肉丝。",
        "淋鱼香汁收浓。"
      ],
      category: "川菜"
    },
    {
      id: "25",
      title: "水煮牛肉",
      image: "https://vsd-picture.cdn.bcebos.com/757f9e12487821a4dce0354216dd59250e60fe96.jpg",
      time: "35分钟",
      likes: 880,
      tags: ["川菜", "麻辣", "重口"],
      description: "滑嫩牛肉配热油爆香，视觉味觉双重冲击。",
      ingredients: [
        "牛里脊 300g",
        "黄豆芽 100g",
        "豆瓣酱 30g",
        "辣椒面 15g"
      ],
      steps: [
        "牛肉抓水上浆。",
        "炒底料熬汤。",
        "逐片下牛肉滑熟。",
        "泼热油爆香。"
      ],
      category: "川菜"
    },
    {
      id: "26",
      title: "粤式清蒸鱼",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      time: "20分钟",
      likes: 640,
      tags: ["粤菜", "清淡", "鲜"],
      description: "火候决定一切，追求极致鲜甜。",
      ingredients: [
        "鲈鱼 600g",
        "葱丝 20g",
        "蒸鱼豉油 30ml",
        "食用油 15ml"
      ],
      steps: [
        "葱段垫底架空鱼身。",
        "大火蒸8-9分钟。",
        "倒掉腥水。",
        "泼热油淋豉油。"
      ],
      category: "粤菜"
    },
    {
      id: "27",
      title: "干炒牛河",
      image: "https://th.bing.com/th/id/R.981c92174744185993b3c1c88dceadd1",
      time: "20分钟",
      likes: 720,
      tags: ["粤菜", "锅气", "经典"],
      description: "河粉干爽不油，锅气十足。",
      ingredients: [
        "鲜河粉 300g",
        "牛肉 100g",
        "豆芽 50g",
        "老抽 10ml"
      ],
      steps: [
        "牛肉滑散盛出。",
        "极热锅下河粉。",
        "颠锅上色。",
        "回锅合炒断生。"
      ],
      category: "粤菜"
    },
    {
      id: "28",
      title: "白切鸡",
      image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
      time: "60分钟",
      likes: 850,
      tags: ["粤菜", "原味", "经典"],
      description: "皮爽肉滑，追求鸡肉本味。",
      ingredients: [
        "三黄鸡 1000g",
        "姜葱油 1份",
        "花生油 适量"
      ],
      steps: [
        "三提三放紧皮。",
        "微沸水泡煮。",
        "冰水浸泡定型。",
        "斩件配姜葱油。"
      ],
      category: "粤菜"
    },
    {
      id: "29",
      title: "豉汁蒸排骨",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
      time: "25分钟",
      likes: 610,
      tags: ["粤菜", "蒸菜", "下饭"],
      description: "豆豉陈香，排骨爽滑弹嫩。",
      ingredients: [
        "猪排骨 300g",
        "豆豉 10g",
        "生粉 适量",
        "花生油 10ml"
      ],
      steps: [
        "排骨吸干水分。",
        "厚浆抓匀锁味。",
        "平铺上盘。",
        "大火蒸15分钟。"
      ],
      category: "粤菜"
    },
    {
      id: "30",
      title: "上汤苋菜",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
      time: "15分钟",
      likes: 520,
      tags: ["粤菜", "清淡", "养生"],
      description: "汤色乳白，鲜甜层次丰富。",
      ingredients: [
        "红苋菜 300g",
        "皮蛋 1个",
        "咸蛋黄 1个",
        "高汤 1碗"
      ],
      steps: [
        "炸蒜炒咸蛋黄。",
        "加高汤和皮蛋煮开。",
        "下苋菜大火煮2分钟。"
      ],
      category: "粤菜"
    }    
  ];
  
  module.exports = {
    CATEGORIES,
    RECIPES
  };
  
  