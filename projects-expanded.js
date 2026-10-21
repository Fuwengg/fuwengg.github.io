export const expandedProjects = {
  "answerrank": {
    "id": "answerrank",
    "title": "AnswerRank · SEO 与 AI 搜索诊断",
    "type": "SEO / AI SEARCH VISIBILITY",
    "category": "tools",
    "subtitle": "网页诊断 · 优化清单 · 报告生成",
    "intro": "面向企业网站的 SEO 与 AI 搜索可见性诊断原型：采集公开网页，检查页面内容与结构，将问题整理为评分、优化优先级和可分享的 HTML 报告。",
    "metrics": [
      [
        "10 项",
        "规则检查"
      ],
      [
        "100 分",
        "加权评分"
      ],
      [
        "HTML",
        "诊断报告"
      ]
    ],
    "points": [
      "默认采样最多 8 个同站页面，提取标题、描述、标题层级、链接及结构化数据。",
      "检查服务说明、FAQ、价格与询价、案例证明、联系入口等内容，生成优化优先级。",
      "把诊断脚本、服务介绍页、需求提交与报告交付流程组织成完整的平台原型。"
    ],
    "status": "本地平台原型 · 已有诊断脚本、页面与历史报告样例。",
    "credits": "图为原型界面与公开网站演示报告。评分依据网页规则检查；不代表客户委托、搜索排名或 AI 实际引用率。",
    "image": "archive/answerrank-home.png",
    "gallery": [
      "archive/answerrank-report.png"
    ],
    "links": [
      [
        "查看历史报告样例",
        "assets/archive/answerrank-sample-report.html"
      ]
    ]
  },
  "guilong-toolbox": {
    "id": "guilong-toolbox",
    "title": "鬼龙工具箱 · 批量图片工作台",
    "type": "LOCAL AI / IMAGE WORKFLOW",
    "category": "tools",
    "subtitle": "电商修图 · AI 抠图 · 批量处理",
    "intro": "面向电商图片处理的本地工具，将批量导入、实时调色、AI 抠图、背景替换、文字叠加与裁剪导出集中到一个工作台，减少多张商品图反复切换软件的操作。",
    "metrics": [
      [
        "14 项",
        "调色与细节参数"
      ],
      [
        "RMBG-2.0",
        "抠图模型接入"
      ],
      [
        "批量导出",
        "图片工作流"
      ]
    ],
    "points": [
      "前端 Canvas 提供实时预览、处理前后对照、参数撤销与重做。",
      "接入 RMBG-2.0 抠图，支持透明、纯色、渐变、自定义背景及文生图背景流程。",
      "提供文字样式、旋转翻转、产品位置调整、裁剪尺寸与批量文件导出。",
      "使用 Python、Flask 与 Pillow 构建本地服务，配套启动器及授权管理界面。"
    ],
    "status": "本地软件项目 · 老卜 5.0 目录版本，保留界面、处理逻辑及模型接入代码。",
    "credits": "本页使用现有源码界面的实际截图。界面保留原版本标识；AI 模型推理效果未在本轮重新测试。",
    "image": "archive/guilong-toolbox-home.png",
    "gallery": [
      "archive/guilong-toolbox-controls.png"
    ]
  },
  "shotweaver": {
    "id": "shotweaver",
    "title": "ShotWeaver",
    "type": "UNITY TOOL / 对话镜头自动导演",
    "category": "unity",
    "intro": "将对白节拍和场景演员整理为可编辑的镜头序列，在布景前检查构图、可见性与连续性风险。",
    "metrics": [
      [
        "7 类",
        "镜头模板"
      ],
      [
        "逐镜调整",
        "编排方式"
      ],
      [
        "Unity",
        "编辑器工具"
      ]
    ],
    "points": [
      "七类镜头模板生成候选机位，并按场景约束评分",
      "检查遮挡、相机安全、180°轴线与30°剪辑规则",
      "锁定或重做单个镜头，提供运行时播放及可选 Timeline / Cinemachine 输出"
    ],
    "status": "已发布工具 · 全球与中国商店均有历史公开版本。",
    "subcategory": "对话镜头自动导演",
    "image": "archive/unity-shotweaver.webp",
    "gallery": [
      "archive/unity-shotweaver.webp",
      "archive/unity-shotweaver-1.webp",
      "archive/unity-shotweaver-2.webp",
      "archive/unity-shotweaver-3.webp",
      "archive/unity-shotweaver-4.webp",
      "archive/unity-shotweaver-5.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.unity.com/packages/tools/camera/shotweaver-procedural-dialogue-camera-director-394240"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/shotweaver-zh.html"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "encounterforge": {
    "id": "encounterforge",
    "title": "EncounterForge",
    "type": "UNITY TOOL / 遭遇布局与公平性分析",
    "category": "unity",
    "intro": "把出生区域、敌人分工和预算限制转为可比较的遭遇布局，辅助策划在试玩前审查风险。",
    "metrics": [
      [
        "最多 64 套",
        "候选布局"
      ],
      [
        "5 维",
        "风险评分"
      ],
      [
        "多波次",
        "遭遇计划"
      ]
    ],
    "points": [
      "生成并排序最多64套固定种子的确定性布局",
      "以暴露、掩体、角色多样性、空间平衡与预算效率形成五维评分",
      "查看危险热力图后烘焙多波次 EncounterPlan，并导出 JSON 报告"
    ],
    "status": "已发布工具 · 全球 1.0.0、中国 1.0.1 有公开版本记录。",
    "subcategory": "遭遇布局与公平性分析",
    "image": "archive/unity-encounterforge.webp",
    "gallery": [
      "archive/unity-encounterforge.webp",
      "archive/unity-encounterforge-1.webp",
      "archive/unity-encounterforge-2.webp",
      "archive/unity-encounterforge-3.webp",
      "archive/unity-encounterforge-4.webp",
      "archive/unity-encounterforge-5.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.unity.com/packages/tools/level-design/encounterforge-tactical-encounter-design-fairness-analyzer-394234"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/encounterforge-zh.html"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "framebudget-lab": {
    "id": "framebudget-lab",
    "title": "FrameBudget Lab",
    "type": "UNITY TOOL / 性能回归与 CI 检查",
    "category": "unity",
    "intro": "采集受控帧窗口，与可比基线对照，让性能回归形成可复查的报告和自动化结果。",
    "metrics": [
      [
        "P95 / P99",
        "帧尾延迟"
      ],
      [
        "基线对照",
        "回归检查"
      ],
      [
        "CI",
        "自动化报告"
      ]
    ],
    "points": [
      "统计P95/P99尾延迟、峰值与超预算帧比例",
      "结合环境指纹检查绝对预算和相对基线，不可比较时明确标记",
      "导出 JSON、CSV、JUnit XML，并返回确定性批处理退出码"
    ],
    "status": "已发布工具 · 全球 1.0.0 有公开版本记录。",
    "subcategory": "性能回归与 CI 检查",
    "image": "archive/unity-framebudget-lab.webp",
    "gallery": [
      "archive/unity-framebudget-lab.webp",
      "archive/unity-framebudget-1.webp",
      "archive/unity-framebudget-2.webp",
      "archive/unity-framebudget-3.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.unity.com/packages/tools/utilities/framebudget-lab-performance-regression-ci-gate-394444"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/framebudget-lab.html"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "cjk-font-guard": {
    "id": "cjk-font-guard",
    "title": "CJK Font Guard",
    "type": "UNITY TOOL / TMP 字形与图集检查",
    "category": "unity",
    "intro": "收集项目使用的文字，检查 TextMesh Pro 字体与回退链中的缺字，并提示图集增长风险。",
    "metrics": [
      [
        "CJK",
        "字体覆盖"
      ],
      [
        "回退链",
        "缺字追踪"
      ],
      [
        "HTML",
        "离线报告"
      ]
    ],
    "points": [
      "扫描场景、预制体、资源文本、本地化文件和C#字符串",
      "沿本地与全局字体回退链检查缺失码点及来源",
      "导出UTF-8字符集与离线HTML报告，供字体重建后复查"
    ],
    "status": "已发布工具 · 中国商店 1.0.0 有公开版本记录。",
    "subcategory": "TMP 字形与图集检查",
    "image": "archive/unity-cjk-font-guard.webp",
    "gallery": [
      "archive/unity-cjk-font-guard.webp",
      "archive/unity-cjk-1.webp",
      "archive/unity-cjk-2.webp",
      "archive/unity-cjk-3.webp",
      "archive/unity-cjk-4.webp",
      "archive/unity-cjk-5.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.u3d.cn/packages/tools/utilities/assetstore-package-20006247"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/cjk-font-guard-zh.html"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "minigame-preflight": {
    "id": "minigame-preflight",
    "title": "MiniGame Build Preflight",
    "type": "UNITY TOOL / 小游戏发布预检",
    "category": "unity",
    "intro": "把纹理、音频、网格、大文件和WebGL设置风险集中到一次只读编辑器检查中。",
    "metrics": [
      [
        "5 类",
        "资源与设置风险"
      ],
      [
        "只读扫描",
        "检查方式"
      ],
      [
        "HTML",
        "发布前报告"
      ]
    ],
    "points": [
      "选择移动小游戏或WebGL本地检查档案",
      "扫描资源体积、内存占用与构建设置的静态风险",
      "按严重程度呈现实测值、原因与建议，并导出UTF-8 HTML报告"
    ],
    "status": "已发布工具 · 中国商店 1.0.0 有公开版本记录。",
    "subcategory": "小游戏发布预检",
    "image": "archive/unity-minigame-preflight.webp",
    "gallery": [
      "archive/unity-minigame-preflight.webp",
      "archive/unity-minigame-1.webp",
      "archive/unity-minigame-2.webp",
      "archive/unity-minigame-3.webp",
      "archive/unity-minigame-4.webp",
      "archive/unity-minigame-5.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.u3d.cn/packages/tools/utilities/assetstore-package-20006245"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/minigame-build-preflight-zh.html"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "ugui-layout-doctor": {
    "id": "ugui-layout-doctor",
    "title": "uGUI Layout Doctor",
    "type": "UNITY TOOL / 原生 UI 布局诊断",
    "category": "unity",
    "intro": "解释RectTransform宽高由谁控制，集中呈现布局冲突、异常尺寸与越界风险的排查线索。",
    "metrics": [
      [
        "9 类",
        "布局检查"
      ],
      [
        "中 / 英",
        "界面语言"
      ],
      [
        "JSON / MD",
        "报告导出"
      ]
    ],
    "points": [
      "扫描选中层级、已加载场景或选中的Prefab",
      "九类检查区分确定性问题与启发式风险，并列出轴、驱动来源和检查顺序",
      "中英文界面即时切换，支持Markdown与JSON报告导出"
    ],
    "status": "已发布工具 · 中国商店 1.0.0 有公开版本记录。",
    "subcategory": "原生 UI 布局诊断",
    "image": "archive/unity-ugui-layout-doctor.webp",
    "gallery": [
      "archive/unity-ugui-layout-doctor.webp",
      "archive/unity-layout-1.webp",
      "archive/unity-layout-2.webp",
      "archive/unity-layout-3.webp",
      "archive/unity-layout-4.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.u3d.cn/packages/tools/utilities/assetstore-package-20006296"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/ugui-layout-doctor-zh.html"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "android-16kb-source-doctor": {
    "id": "android-16kb-source-doctor",
    "title": "Android 16KB Source Doctor",
    "type": "UNITY TOOL / 原生库来源与对齐证据",
    "category": "unity",
    "intro": "查找Unity工程和构建归档里的原生库，检查ELF对齐证据、追踪本地来源，并导出审查报告。",
    "metrics": [
      [
        "16 KB",
        "对齐证据"
      ],
      [
        "5 种",
        "库与归档入口"
      ],
      [
        "来源追踪",
        "报告重点"
      ]
    ],
    "points": [
      "扫描独立.so以及AAR、ZIP、APK、AAB归档",
      "记录ABI、SHA-256与ELF 16KB对齐信息，并追踪来源",
      "导出JSON、CSV、Markdown，支持扫描前后对比"
    ],
    "status": "已完成工具与发行材料 · 历史记录为修正版提交审核。",
    "subcategory": "原生库来源与对齐证据",
    "image": "archive/unity-android-16kb-source-doctor.webp",
    "gallery": [
      "archive/unity-android-16kb-source-doctor.webp"
    ],
    "links": [
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/#tools"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "locale-glyph-coverage-auditor": {
    "id": "locale-glyph-coverage-auditor",
    "title": "LocaleGlyph Coverage Auditor",
    "type": "UNITY TOOL / 本地化表格字形覆盖审计",
    "category": "unity",
    "intro": "从Unity Localization字符串表追踪字符到TextMesh Pro字体图，把缺字与待人工复核项保留为可追溯证据。",
    "metrics": [
      [
        "3 类",
        "覆盖结果"
      ],
      [
        "语言 / 表 / 键",
        "追溯维度"
      ],
      [
        "批处理",
        "审计方式"
      ]
    ],
    "points": [
      "将覆盖结果分为已覆盖、缺失与需人工复核",
      "保留语言、表、键、实际提供字形的字体及回退链证据",
      "输出确定性JSON、Markdown与批处理结果"
    ],
    "status": "已完成工具与发行材料 · 历史记录为 1.0.0 提交审核。",
    "subcategory": "本地化表格字形覆盖审计",
    "image": "archive/unity-locale-glyph-coverage-auditor.webp",
    "gallery": [
      "archive/unity-locale-glyph-coverage-auditor.webp"
    ],
    "links": [
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/#tools"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "cjk-fallback-switch-guard": {
    "id": "cjk-fallback-switch-guard",
    "title": "CJK Fallback Switch Guard",
    "type": "UNITY TOOL / 按语言切换 TMP 回退字体",
    "category": "unity",
    "intro": "配置与校验语言专属的TextMesh Pro回退顺序，支持运行时切换并恢复原始列表。",
    "metrics": [
      [
        "按语言",
        "回退档案"
      ],
      [
        "可逆切换",
        "运行时操作"
      ],
      [
        "TMP",
        "字体系统"
      ]
    ],
    "points": [
      "为中文、日文、韩文或自定义语言码配置有序回退档案",
      "检查重复、自引用、缺失字体与已配置回退环路",
      "可逆运行时切换，提供稳定报告与自动化验证"
    ],
    "status": "已发布工具 · 中国商店 1.0.0 有公开版本记录。",
    "subcategory": "按语言切换 TMP 回退字体",
    "image": "archive/unity-cjk-fallback-switch-guard-unity-ui.webp",
    "gallery": [
      "archive/unity-cjk-fallback-switch-guard-unity-ui.webp"
    ],
    "links": [
      [
        "官方商店入口",
        "https://assetstore.u3d.cn/packages/tools/localization/assetstore-package-20006534"
      ],
      [
        "产品说明",
        "https://fuwengg.github.io/jialiiii-unity-tools/#cjk-fallback-switch-guard"
      ]
    ],
    "credits": "画廊含产品说明图与界面展示，来自本工具的既有发行材料。"
  },
  "music-goodnight": {
    "id": "music-goodnight",
    "title": "晚安留在我这边",
    "type": "ORIGINAL SONG / JIAALe",
    "subtitle": "本人原创 · AI 演唱 · 声音版权归本人所有",
    "category": "music",
    "intro": "《晚安留在我这边》由我本人创作，AI 仅用于演唱呈现。演唱声音的版权归我本人所有，本站提供原版完整音轨试听。",
    "metrics": [
      [
        "04:20",
        "完整音轨"
      ],
      [
        "本人原创",
        "歌曲创作"
      ],
      [
        "AI 演唱",
        "呈现方式"
      ]
    ],
    "points": [
      "本人完成歌曲创作，AI 只承担演唱呈现。",
      "演唱声音版权归本人所有，整理音轨、封面与作品信息用于发行。",
      "完整试听对应原版成品；另设汽水音乐作品入口。"
    ],
    "status": "本人原创歌曲 · 已有公开发行页面 · 本站提供完整音轨试听。",
    "credits": "歌曲创作：Le（JIAA LE）；演唱：AI；声音版权：Le 本人所有。",
    "image": "archive/music-goodnight.webp",
    "audio": "archive/music-1.mp3",
    "links": [
      [
        "汽水音乐作品页",
        "https://music.douyin.com/qishui/share/track?track_id=7674152881180297262"
      ]
    ]
  },
  "music-about-you": {
    "id": "music-about-you",
    "title": "关于你的歌",
    "type": "MUSIC / JIAALe",
    "subtitle": "声音版权归本人所有 · 完整试听",
    "credits": "声音版权：Le（JIAA LE）本人所有。",
    "category": "music",
    "intro": "一首围绕情感叙事展开的 AI 音乐作品。完成版本筛选及结尾修整，保留自然收尾的完整试听版本。",
    "metrics": [
      [
        "07:42",
        "完整音轨"
      ],
      [
        "自然收尾",
        "本站版本"
      ],
      [
        "JIAALe",
        "发行署名"
      ]
    ],
    "points": [
      "从多版结果中选择声线、歌词表达与整体结构。",
      "对发行音轨的结尾进行修整，形成自然收尾版本。",
      "整理音轨与发行资料，并保留对应公开作品页。"
    ],
    "status": "已有公开发行页面 · 本站试听为自然收尾版本。",
    "audio": "archive/music-2.mp3",
    "links": [
      [
        "汽水音乐作品页",
        "https://music.douyin.com/qishui/share/track?track_id=7674152881180346414"
      ]
    ]
  },
  "music-nathan": {
    "id": "music-nathan",
    "title": "凌晨四點嘅彌敦道",
    "type": "MUSIC / JIAALe",
    "subtitle": "声音版权归本人所有 · 完整试听",
    "credits": "声音版权：Le（JIAA LE）本人所有。",
    "category": "music",
    "intro": "以深夜城市与粤语表达为创作线索，完成 AI 音乐生成、听感筛选、封面和发行资料整理。",
    "metrics": [
      [
        "04:56",
        "完整音轨"
      ],
      [
        "粤语",
        "作品表达"
      ],
      [
        "JIAALe",
        "发行署名"
      ]
    ],
    "points": [
      "围绕歌词语感、声线和音乐段落判断候选版本。",
      "统一作品名称、音轨与封面，整理可发行成品。",
      "保留完整音轨与公开作品入口，便于直接试听。"
    ],
    "status": "已有公开发行页面 · 本站提供完整音轨试听。",
    "image": "archive/music-nathan.webp",
    "audio": "archive/music-3.mp3",
    "links": [
      [
        "汽水音乐作品页",
        "https://music.douyin.com/qishui/share/track?track_id=7676833446158092314"
      ]
    ]
  },
  "headphones": {
    "id": "headphones",
    "title": "耳机互动展示",
    "type": "3D PRODUCT / INTERACTIVE",
    "category": "interactive",
    "intro": "可开合盒盖、取出耳机、切换配色与查看单侧细节的浏览器 3D 产品展示。",
    "metrics": [
      [
        "开合 / 取放",
        "交互状态"
      ],
      [
        "3 种",
        "配色"
      ],
      [
        "360°",
        "旋转查看"
      ]
    ],
    "points": [
      "把盒盖、耳机取放、单侧细看与视角复原组织为清晰的产品状态。",
      "通过配色切换、旋转和光照呈现形体与材质。",
      "以程序化几何建立可直接在浏览器体验的产品展示。"
    ],
    "status": "浏览器 3D 产品展示原型 · 可开盒、取放、换色与查看细节。",
    "image": "archive/demo-headphones.webp",
    "demo": "demos/headphones/",
    "gallery": [
      "archive/demo-headphones.webp"
    ]
  },
  "island": {
    "id": "island",
    "title": "小岛开工",
    "type": "3D GAME / RESOURCE STRATEGY",
    "category": "interactive",
    "intro": "六天内建成三间小屋的资源分配小游戏，结合立体岛屿与可回看的行动记录。",
    "metrics": [
      [
        "6 天",
        "建造周期"
      ],
      [
        "12 次",
        "行动预算"
      ],
      [
        "3 间",
        "小屋目标"
      ]
    ],
    "points": [
      "把采集、修路与建屋设计为带先后关系的资源决策。",
      "让资源扣除、行动次数和建造进度同步反映在界面与岛屿中。",
      "保留行动记录、胜负结算与重玩，组成完整的小游戏流程。"
    ],
    "status": "可玩的单机资源分配原型 · 支持胜负结算和重玩。",
    "image": "archive/demo-island.webp",
    "demo": "demos/island/",
    "gallery": [
      "archive/demo-island.webp"
    ]
  },
  "dice": {
    "id": "dice",
    "title": "果冻骰子实验",
    "type": "3D MATERIAL / MOTION",
    "category": "interactive",
    "intro": "半透明材质与可调柔软度的 3D 骰子弹跳实验。",
    "metrics": [
      [
        "3 种",
        "颜色"
      ],
      [
        "柔软度",
        "可调参数"
      ],
      [
        "点击弹跳",
        "交互反馈"
      ]
    ],
    "points": [
      "用半透明材质、颜色与光照组织果冻质感。",
      "将点击、弹跳和柔软度参数连接到模型动画。",
      "通过缩放与形变动画研究触感反馈和动效节奏。"
    ],
    "status": "浏览器材质与动画实验 · 以形变动画表现弹性。",
    "image": "archive/demo-dice.webp",
    "demo": "demos/dice/",
    "gallery": [
      "archive/demo-dice.webp"
    ]
  },
  "storybook": {
    "id": "storybook",
    "title": "小狐狸借星光",
    "type": "3D STORYBOOK / AUDIO",
    "category": "interactive",
    "intro": "三页中文互动绘本，结合本地 3D 场景、配音、逐词高亮和点击反馈。",
    "metrics": [
      [
        "3 页",
        "中文绘本"
      ],
      [
        "配音 / 高亮",
        "阅读引导"
      ],
      [
        "点击场景",
        "动画反馈"
      ]
    ],
    "points": [
      "将三页故事、3D 场景与本地配音组织为连续阅读体验。",
      "支持整页播放与暂停、逐词高亮及词语短片段播放。",
      "把狐狸与星星的动画反馈融入点击阅读过程。"
    ],
    "status": "三页互动绘本原型 · 配音、翻页与场景互动可体验。",
    "image": "archive/demo-storybook.webp",
    "demo": "demos/storybook/",
    "gallery": [
      "archive/demo-storybook.webp"
    ]
  },
  "splat": {
    "id": "splat",
    "title": "Gaussian Splatting 查看实验",
    "type": "3D GAUSSIAN SPLATTING / VIEWER",
    "category": "interactive",
    "intro": "使用 SuperSplat 官方查看器与 toycat 示例，验证 3D Gaussian Splatting 在浏览器中的查看体验。",
    "metrics": [
      [
        "3DGS",
        "查看方式"
      ],
      [
        "旋转 / 缩放",
        "浏览操作"
      ],
      [
        "官方示例",
        "资产来源"
      ]
    ],
    "points": [
      "集成 SuperSplat 官方查看器，整理本地可打开的示例页面。",
      "保留旋转、缩放与工具栏，让空间表示可被直接观察。",
      "在页面中标明官方示例来源，区分查看器集成与资产创作。"
    ],
    "status": "官方查看器集成与交互实验 · toy-cat 为 PlayCanvas 示例。",
    "image": "archive/demo-splat.webp",
    "demo": "demos/splat/",
    "gallery": [
      "archive/demo-splat.webp"
    ],
    "credits": "toy-cat 资源与查看器来自 SuperSplat / PlayCanvas；本人的贡献为集成与交互查看实践。"
  },
  "personality": {
    "id": "personality",
    "title": "牛马人格测试",
    "type": "H5 / INTERACTIVE QUIZ",
    "category": "web",
    "intro": "以职场情境、行业选择和闯关节奏组织的趣味测评产品。",
    "metrics": [
      [
        "5 关",
        "情境答题"
      ],
      [
        "6 维",
        "结果展示"
      ],
      [
        "结果海报",
        "可导出"
      ]
    ],
    "points": [
      "以行业选择和职场情境组织五关答题节奏。",
      "将规则计分转为六维结果与可分享的结果海报。",
      "提供本地历史、文字复制和海报导出，完成从入口到结果的流程。"
    ],
    "status": "娱乐测评原型 · 可选择行业、答题并保存结果。",
    "image": "archive/demo-personality.webp",
    "demo": "demos/personality/",
    "gallery": [
      "archive/demo-personality.webp"
    ],
    "credits": "娱乐型规则测评，用于趣味表达。"
  },
  "weekend": {
    "id": "weekend",
    "title": "周末充电方式",
    "type": "H5 / ORIGINAL QUIZ",
    "category": "web",
    "intro": "十二道原创生活情境题，输出休息偏好与可保存的一页结果卡。",
    "metrics": [
      [
        "12 题",
        "原创情境"
      ],
      [
        "4 类",
        "休息偏好"
      ],
      [
        "PNG / 文字",
        "结果导出"
      ]
    ],
    "points": [
      "编写十二道生活情境题，用每题一票的规则呈现四类休息偏好。",
      "允许回退修改答案，并保留并列结果。",
      "提供一页结果卡、PNG 与文字导出及打印。"
    ],
    "status": "原创生活情境测试 · 可完整答题、回改并保存结果。",
    "image": "archive/demo-weekend.webp",
    "demo": "demos/weekend/",
    "gallery": [
      "archive/demo-weekend.webp"
    ]
  },
  "desk": {
    "id": "desk",
    "title": "Le Desk 私人运营台",
    "type": "PRODUCTIVITY / LOCAL APP",
    "category": "tools",
    "intro": "带本地收件箱、任务状态、人工确认项和操作记录的运营台交互原型。",
    "metrics": [
      [
        "消息 / 任务",
        "统一视图"
      ],
      [
        "人工确认",
        "流程节点"
      ],
      [
        "本地保存",
        "数据方式"
      ]
    ],
    "points": [
      "将手动录入的客户消息整理为本地分类与回复草稿。",
      "把任务新建、状态切换和人工确认项整合在同一操作台。",
      "保存本地操作记录并支持导出，便于回看每次处理。"
    ],
    "status": "本地前端原型 · 客户消息、草稿、任务和操作记录；外部邮箱与日历尚未接入。",
    "image": "archive/demo-desk.webp",
    "demo": "demos/desk/",
    "gallery": [
      "archive/demo-desk.webp"
    ]
  },
  "retouch": {
    "id": "retouch",
    "title": "照片调色与修整工作台",
    "type": "IMAGE TOOL / CANVAS",
    "category": "tools",
    "intro": "在浏览器本地上传图片、套用风格并调节细节，支持原图对比和结果下载。",
    "metrics": [
      [
        "9 组",
        "调色预设"
      ],
      [
        "原图对比",
        "效果检查"
      ],
      [
        "本地处理",
        "图片方式"
      ]
    ],
    "points": [
      "支持本地图片上传、九组风格预设与参数调整。",
      "使用 Canvas 像素处理实现调色与启发式局部修整。",
      "用原图分割线对比效果，并导出处理后的图片。"
    ],
    "status": "浏览器修图原型 · Canvas 调色与局部修整，可下载结果。",
    "image": "archive/demo-retouch.webp",
    "demo": "demos/retouch/",
    "gallery": [
      "archive/demo-retouch.webp"
    ]
  },
  "scraper": {
    "id": "scraper",
    "title": "Python 爬虫 · 公开商品列表提取",
    "type": "DATA EXTRACTION / PYTHON",
    "category": "tools",
    "intro": "把公开列表页按字段整理为 CSV，并提供分页、去重和运行报告；页面展示已保存的历史样本。",
    "metrics": [
      [
        "60 条",
        "历史样本"
      ],
      [
        "分页 / 去重",
        "采集流程"
      ],
      [
        "CSV",
        "可下载结果"
      ]
    ],
    "points": [
      "将公开同结构列表按配置字段提取，处理分页与重复记录。",
      "保存完整 CSV、原始字段与运行报告，便于追溯采集结果。",
      "将 2026 年 7 月的 60 条历史样本做成可搜索展示页。"
    ],
    "status": "公开列表提取工具与历史样本 · 页面可搜索、查看字段并下载 CSV。",
    "image": "archive/demo-scraper.webp",
    "demo": "demos/scraper/",
    "gallery": [
      "archive/demo-scraper.webp"
    ],
    "credits": "数据来自 Books to Scrape 公开演示站；展示已保存样本，浏览本页不会发起新采集。"
  },
  "cafe-courtyard": {
    "id": "cafe-courtyard",
    "title": "庭院咖啡馆 · 3D 场景",
    "type": "3D SCENE / COMPOSITION",
    "category": "interactive",
    "intro": "从庭院空间的概念方向出发，组织建筑、绿植、材质、光照与机位，形成可审阅的 3D 场景渲染。",
    "metrics": [
      [
        "场景搭建",
        "创作重点"
      ],
      [
        "材质 / 光照",
        "视觉组织"
      ],
      [
        "渲染成品",
        "当前成果"
      ]
    ],
    "points": [
      "将空间概念转为建筑、庭院与植被的场景关系。",
      "组合材质、光照与镜头，迭代空间层次和画面构图。",
      "明确区分最终场景渲染、概念参考与采用的外部素材。"
    ],
    "status": "3D 场景与渲染成果 · 画廊第一张为场景渲染，第二张为概念参考。",
    "image": "archive/cafe-hero-v3.webp",
    "gallery": [
      "archive/cafe-hero-v3.webp",
      "archive/cafe-concept-reference.webp"
    ],
    "credits": "第 1 张：本项目场景渲染。第 2 张：概念参考图，不作为建模或渲染成品。树木与木材贴图使用 Poly Haven CC0 素材。",
    "links": [
      [
        "素材许可",
        "https://polyhaven.com/license"
      ]
    ]
  },
  "house-tour": {
    "id": "house-tour",
    "title": "3D 室内看房 · 空间浏览研究",
    "type": "3D SPACE / INTERACTIVE RESEARCH",
    "category": "interactive",
    "intro": "以公开室内场景为对象，分析浏览器中的空间呈现、视角导航与观看体验，探索 3D 看房的交互组织。",
    "metrics": [
      [
        "室内空间",
        "研究对象"
      ],
      [
        "3D 浏览",
        "交互方向"
      ],
      [
        "公开场景",
        "素材基础"
      ]
    ],
    "points": [
      "观察室内空间的连续观看方式与视角组织。",
      "结合公开查看器分析空间呈现、浏览反馈与操作体验。",
      "将场景资产作者与自身技术分析、交互实践清楚区分。"
    ],
    "status": "公开场景分析与交互实践 · 原始场景由 Cameron Cone 发布。",
    "links": [
      [
        "打开原始室内场景",
        "https://superspl.at/scene/91c1e47e"
      ]
    ],
    "credits": "原始室内场景：Cameron Cone / SuperSplat。此处展示本人技术分析与交互实践，场景采集及重建归原作者。"
  },
  "factory-website": {
    "id": "factory-website",
    "title": "激光与刺绣工厂官网",
    "type": "BUSINESS WEBSITE / WEBGL",
    "category": "web",
    "intro": "把激光切割与刺绣业务整理为清楚的线上展示，结合工艺内容、响应式页面与询价入口，完成网站部署。",
    "metrics": [
      [
        "响应式",
        "桌面与手机"
      ],
      [
        "WebGL",
        "互动展示"
      ],
      [
        "HTTPS",
        "域名部署"
      ]
    ],
    "points": [
      "从真实业务整理工艺展示、服务说明与询价信息。",
      "将 WebGL 互动与常规页面结合，兼顾视觉表达和信息阅读。",
      "完成站点迁移、域名配置与 HTTPS 访问交付。"
    ],
    "status": "已公开部署 · 可访问工厂官网与工艺展示。",
    "image": "archive/factory-site.webp",
    "gallery": [
      "archive/factory-site.webp"
    ],
    "links": [
      [
        "访问工厂官网",
        "https://tanjiale.top"
      ]
    ]
  },
  "factory-ledger": {
    "id": "factory-ledger",
    "title": "工厂离线记账本",
    "type": "DESKTOP SOFTWARE / OFFLINE",
    "category": "tools",
    "intro": "针对工厂旧电脑、离线使用与不会打字的操作习惯，设计一套大字、手写输入和可靠备份的客户订单记账软件。",
    "metrics": [
      [
        "离线",
        "无需网络服务"
      ],
      [
        "9,507 字",
        "内嵌手写模型"
      ],
      [
        "订单 / 收款",
        "账目闭环"
      ]
    ],
    "points": [
      "覆盖客户、逐笔订单、分次收款、欠款、支出、作废和导出。",
      "加入大字教程、数字键盘与离线手写板，降低录入负担。",
      "使用精确金额、原子保存、快照及 U 盘备份与校验恢复。",
      "完成空账本交付包与本机检查，保留目标工厂机试用环节。"
    ],
    "status": "已完成本机验证与交付包 · 待工厂目标机试用。",
    "image": "archive/ledger-month.webp",
    "gallery": [
      "archive/ledger-month.webp",
      "archive/ledger-order.webp",
      "archive/ledger-detail.webp",
      "archive/ledger-handwriting.webp"
    ],
    "credits": "画面来自软件教程与演示账本。"
  },
  "embroidery": {
    "id": "embroidery",
    "title": "刺绣制版工作台",
    "type": "INDUSTRY TOOL / STITCH DESIGN",
    "category": "tools",
    "intro": "围绕多页工单中“哪些图案真正要做”的实际问题，建立从导入、选择与参数设置，到针迹预览和文件导出的制版流程。",
    "metrics": [
      [
        "点选 / 框选",
        "工单图案"
      ],
      [
        "多色预览",
        "针迹检查"
      ],
      [
        "DST / PES",
        "导出格式"
      ]
    ],
    "points": [
      "支持 PDF 与图片导入、页内候选以及人工点选与框选。",
      "连接尺寸和针迹参数、多色预览与 SVG 查看。",
      "提供 DST / PES 导出，以及历史 EMB 缩略图和设计信息读取。"
    ],
    "status": "本地制版原型。已有分层编辑和格式导出实现，生产试绣仍需师傅复核。"
  },
  "gpt-weapp-2024": {
    "id": "gpt-weapp-2024",
    "title": "GPT-3.5 微信小程序",
    "type": "EARLY LLM APPLICATION / 2024",
    "category": "web",
    "intro": "2024 年开展 GPT-3.5 与微信小程序接入实践，把模型能力带入微信内的应用入口，并完成开发版上传。",
    "metrics": [
      [
        "2024.02",
        "早期实践"
      ],
      [
        "GPT-3.5",
        "模型接入"
      ],
      [
        "1.0.0",
        "上传开发版"
      ]
    ],
    "points": [
      "将 GPT-3.5 接入微信小程序，探索对话能力的应用入口。",
      "推进小程序开发与上传，保留 2024 年 2 月的后台记录。",
      "把模型能力、界面流程与平台开发流程连接起来。"
    ],
    "status": "2024-02-20 开发版已上传 · 模型接入依据本人实践说明，展示为同期上传记录。",
    "image": "archive/weapp-2024.webp",
    "gallery": [
      "archive/weapp-2024.webp"
    ]
  },
  "before-expiry": {
    "id": "before-expiry",
    "title": "到期之前",
    "type": "WECHAT MINI PROGRAM / REMINDERS",
    "category": "web",
    "intro": "把截图中的到期信息转为可确认、可校正的提醒，连接小程序界面、识别服务、订阅消息和云端调度。",
    "metrics": [
      [
        "截图识别",
        "信息入口"
      ],
      [
        "确认 / 校正",
        "用户流程"
      ],
      [
        "0.1.6",
        "历史发布版"
      ]
    ],
    "points": [
      "设计从截图识别到人工确认与提醒校正的完整流程。",
      "接入登录配额、订阅消息和云端提醒调度。",
      "完成版本构建、测试及小程序审核发布流程。"
    ],
    "status": "小程序 0.1.6 有历史发布记录 · 本次展示项目与流程成果。"
  },
  "laser-production": {
    "id": "laser-production",
    "title": "激光生产文件处理",
    "type": "MANUFACTURING / VECTOR GEOMETRY",
    "category": "tools",
    "intro": "把衣片外框、孔位与真实尺寸约束转为可交付的矢量生产文件，保留原排版，并通过几何核对和读回检查输出质量。",
    "metrics": [
      [
        "8 片",
        "代表批次衣片"
      ],
      [
        "3,776 孔",
        "代表批次孔位"
      ],
      [
        "AI8 / DXF",
        "交付格式"
      ]
    ],
    "points": [
      "识别并保留完整外框与实际孔位，区分辅助图形和加工图形。",
      "保持真实尺寸与相对排版，处理重复路径及格式兼容。",
      "核对坐标、成品读回与源文件完整性，形成文件级交付。"
    ],
    "status": "已完成文件处理与几何核验 · 接收方实机生产效果待验证。"
  },
  "ai-director": {
    "id": "ai-director",
    "title": "AI 导演助手",
    "type": "MULTIMODAL / DESKTOP PROTOTYPE",
    "category": "research",
    "intro": "探索把本地图像理解接入桌面工作台，以图片导入、视觉描述和对话界面辅助分镜与导演工作。",
    "metrics": [
      [
        "图片导入",
        "输入方式"
      ],
      [
        "MiniCPM / BLIP",
        "图像理解"
      ],
      [
        "桌面原型",
        "实现形式"
      ]
    ],
    "points": [
      "组织图片导入、图像理解与桌面交互界面。",
      "尝试 MiniCPM 接口与 BLIP 描述回退路径。",
      "保留可追溯源码，用于继续研究多模态能力如何服务创作流程。"
    ],
    "status": "源码探索原型 · 已保留接口与界面实现，本轮未重跑模型。"
  },
  "accessibility-pwa": {
    "id": "accessibility-pwa",
    "title": "障碍证词 PWA",
    "type": "ACCESSIBILITY / EVIDENCE TOOL",
    "category": "tools",
    "intro": "将无障碍使用中的问题整理为可复核的记录，从脱敏、时间线确认到证据导出，让问题描述可以进入复现与回归流程。",
    "metrics": [
      [
        "记录 / 脱敏",
        "证据整理"
      ],
      [
        "时间线",
        "过程确认"
      ],
      [
        "DOM 实验室",
        "回归探索"
      ]
    ],
    "points": [
      "组织问题记录、脱敏与时间线确认，保留可复核上下文。",
      "提供证据包及自动化复现草稿的设计与实现。",
      "建设真实 DOM 回归实验室，连接记录问题与检查修复的流程。"
    ],
    "status": "本地 PWA 原型 · 已有代码与界面材料，尚未公开发布。",
    "image": "archive/pwa-home.webp",
    "gallery": [
      "archive/pwa-home.webp",
      "archive/pwa-lab.webp"
    ]
  },
  "activity-h5": {
    "id": "activity-h5",
    "title": "活动互动 H5 · 服务方案",
    "type": "H5 PRODUCT / SCOPE DESIGN",
    "category": "web",
    "intro": "将商家活动、校园活动与轻量互动需求整理为明确的页面和交付范围，围绕问答、投票、闯关与转盘设计服务表达。",
    "metrics": [
      [
        "手机页面",
        "使用入口"
      ],
      [
        "互动规则",
        "需求核心"
      ],
      [
        "源码 / 说明",
        "交付组织"
      ]
    ],
    "points": [
      "把用途、互动规则、素材和时间要求列为开工前的关键输入。",
      "区分单页与复杂系统需求，将页面数量、内容量及修改范围写清楚。",
      "制作服务说明与范围图，帮助需求方理解交付内容。"
    ],
    "status": "H5 服务方案与商品视觉稿 · 画廊为方案说明，不代表客户上线案例。",
    "image": "archive/h5-cover.webp",
    "gallery": [
      "archive/h5-cover.webp",
      "archive/h5-detail.webp"
    ],
    "credits": "两张图片为既有服务方案与交付范围说明图。"
  },
  "private-3d-research": {
    "id": "private-3d-research",
    "title": "大型 3D 交互系统原型",
    "type": "3D INTERACTION / RESEARCH",
    "category": "research",
    "intro": "围绕复杂需求推进方案拆解、数据处理与前端交互，形成代码、技术文档和本地阶段原型。",
    "metrics": [
      [
        "需求拆解",
        "方案推进"
      ],
      [
        "交互原型",
        "阶段成果"
      ],
      [
        "研发中",
        "当前状态"
      ]
    ],
    "points": [
      "将复杂需求拆分为可推进的方案与实现任务。",
      "组织数据处理、前端交互及本地原型验证。",
      "保留代码、技术文档与阶段成果。"
    ],
    "status": "研发阶段 · 公开介绍仅保留概括性说明。"
  },
  "room-layout": {
    "id": "room-layout",
    "title": "家具试摆 · 室内布局交互",
    "type": "3D SPACE / LAYOUT EXPLORER",
    "category": "interactive",
    "intro": "将自设 4 × 5 米房间的原场景尺寸与家具位置转为可旋转、缩放的网页演示，直观比较茶几调整前后的空间变化。",
    "metrics": [
      [
        "4 × 5 m",
        "房间尺寸"
      ],
      [
        "2 个方案",
        "实时切换"
      ],
      [
        "2.5 → 42.5 cm",
        "两处相邻间距"
      ]
    ],
    "points": [
      "旋转、缩放与俯视平面联动查看家具位置。",
      "保持沙发、餐桌与摆放位置一致，对比两种茶几尺寸。",
      "将原场景数据、几何计算与可见交互结合，让尺寸变化可以直接复核。"
    ],
    "status": "原有 V008 场景的网页交互展示 · 按保存的尺寸与位置，用简化几何重建。",
    "credits": "自设试摆案例。间距按家具平面矩形边界计算，范围为茶几与沙发、餐桌两组相邻关系。",
    "image": "archive/demo-room-layout.webp",
    "demo": "demos/room-layout/"
  }
};
