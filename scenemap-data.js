/* 场景全景图数据（v2.5：全部 137 个场景）
   目的：先行组织者——进精听先看一眼整个场景是怎么回事（谁、在哪、干什么、
   每句在什么时候说），建好框架再听写。
   每场景：scene 情境句、when 时间、where 地点、who 人物、
   groups 分组（亲子场景按“什么时候说”；词汇场景按词的功能/用途）：
   icon 图标、title 中文标题、sents 句子下标（渲染时从场景数据取英文+中文，
   不在这里复制，避免两份数据不一致）。
   词汇场景的 when/where/who 不适用时为空字符串，渲染时跳过空项。
   校验：在 ~/workspace/offline-v2/ 运行 python3 validate-maps.py。 */
var SCENE_MAPS = {
  "pc01": {
    "scene": "早上，妈妈叫宝宝起床",
    "when": "早上",
    "where": "卧室",
    "who": "妈妈和宝宝",
    "groups": [
      {
        "icon": "⏰",
        "title": "闹钟响了",
        "sents": [
          2
        ]
      },
      {
        "icon": "👋",
        "title": "叫醒宝宝",
        "sents": [
          0,
          1
        ]
      },
      {
        "icon": "🥱",
        "title": "宝宝的反应",
        "sents": [
          3,
          4
        ]
      },
      {
        "icon": "💪",
        "title": "起床动作",
        "sents": [
          5,
          6
        ]
      },
      {
        "icon": "🛏️",
        "title": "整理床铺",
        "sents": [
          7
        ]
      }
    ]
  },
  "pc02": {
    "groups": [
      {
        "icon": "🪣",
        "sents": [
          0,
          1
        ],
        "title": "准备洗脸"
      },
      {
        "icon": "🧽",
        "sents": [
          2
        ],
        "title": "拧干毛巾"
      },
      {
        "icon": "🧴",
        "sents": [
          3,
          4,
          5
        ],
        "title": "擦脸擦脖"
      },
      {
        "icon": "🪞",
        "sents": [
          6,
          7
        ],
        "title": "收尾工作"
      }
    ],
    "scene": "早上，妈妈帮宝宝洗脸",
    "when": "早上",
    "where": "卫生间",
    "who": "妈妈和宝宝"
  },
  "pc03": {
    "groups": [
      {
        "icon": "🪥",
        "sents": [
          0,
          1
        ],
        "title": "准备牙刷"
      },
      {
        "icon": "🥛",
        "sents": [
          2
        ],
        "title": "准备漱口水"
      },
      {
        "icon": "🦷",
        "sents": [
          3,
          4
        ],
        "title": "开始刷牙"
      },
      {
        "icon": "💧",
        "sents": [
          5,
          7
        ],
        "title": "漱口吐水"
      },
      {
        "icon": "✨",
        "sents": [
          6
        ],
        "title": "为什么刷牙"
      }
    ],
    "scene": "早上，妈妈帮宝宝刷牙",
    "when": "早上",
    "where": "卫生间",
    "who": "妈妈和宝宝"
  },
  "pc04": {
    "groups": [
      {
        "icon": "👶",
        "sents": [
          0,
          1
        ],
        "title": "该换尿布了"
      },
      {
        "icon": "🧻",
        "sents": [
          2
        ],
        "title": "脱掉脏尿布"
      },
      {
        "icon": "🧴",
        "sents": [
          3,
          4
        ],
        "title": "清洁涂霜"
      },
      {
        "icon": "👖",
        "sents": [
          5,
          6
        ],
        "title": "换上新尿布"
      },
      {
        "icon": "🗑️",
        "sents": [
          7
        ],
        "title": "扔掉脏尿布"
      }
    ],
    "scene": "妈妈给宝宝换尿不湿",
    "when": "随时",
    "where": "卧室",
    "who": "妈妈和宝宝"
  },
  "pc05": {
    "groups": [
      {
        "icon": "💇",
        "sents": [
          0,
          1
        ],
        "title": "开始梳头"
      },
      {
        "icon": "🎀",
        "sents": [
          2,
          3,
          4
        ],
        "title": "选发型"
      },
      {
        "icon": "🧷",
        "sents": [
          5,
          6,
          7
        ],
        "title": "用发饰"
      }
    ],
    "scene": "早上，妈妈给宝宝梳头发",
    "when": "早上",
    "where": "卧室",
    "who": "妈妈和宝宝"
  },
  "pc06": {
    "groups": [
      {
        "icon": "🧴",
        "sents": [
          0
        ],
        "title": "头发油了"
      },
      {
        "icon": "🫧",
        "sents": [
          1,
          2
        ],
        "title": "涂洗发水"
      },
      {
        "icon": "💆",
        "sents": [
          3,
          4
        ],
        "title": "按摩头皮"
      },
      {
        "icon": "🚿",
        "sents": [
          5
        ],
        "title": "冲洗干净"
      },
      {
        "icon": "🧖",
        "sents": [
          6,
          7
        ],
        "title": "擦干吹干"
      }
    ],
    "scene": "妈妈给宝宝洗头发",
    "when": "洗澡时",
    "where": "卫生间",
    "who": "妈妈和宝宝"
  },
  "pc07": {
    "groups": [
      {
        "icon": "🛁",
        "sents": [
          0,
          1,
          2
        ],
        "title": "准备洗澡"
      },
      {
        "icon": "🧼",
        "sents": [
          3
        ],
        "title": "抹沐浴露"
      },
      {
        "icon": "🧽",
        "sents": [
          4,
          5
        ],
        "title": "擦洗全身"
      },
      {
        "icon": "🚿",
        "sents": [
          6,
          7
        ],
        "title": "冲洗擦干"
      }
    ],
    "scene": "晚上，妈妈给宝宝洗澡",
    "when": "晚上",
    "where": "卫生间",
    "who": "妈妈和宝宝"
  },
  "pc08": {
    "groups": [
      {
        "icon": "🚰",
        "sents": [
          0,
          1
        ],
        "title": "开水打肥皂"
      },
      {
        "icon": "🤲",
        "sents": [
          2,
          3
        ],
        "title": "搓手背指缝"
      },
      {
        "icon": "👉",
        "sents": [
          4,
          5
        ],
        "title": "搓指背指尖"
      },
      {
        "icon": "👍",
        "sents": [
          6,
          7
        ],
        "title": "搓拇指手腕"
      }
    ],
    "scene": "妈妈教宝宝洗手",
    "when": "饭前便后",
    "where": "卫生间",
    "who": "妈妈和宝宝"
  },
  "pc09": {
    "groups": [
      {
        "icon": "✂️",
        "sents": [
          0,
          1,
          2
        ],
        "title": "准备剪指甲"
      },
      {
        "icon": "🤫",
        "sents": [
          3
        ],
        "title": "别动快好了"
      },
      {
        "icon": "💅",
        "sents": [
          4,
          5
        ],
        "title": "修倒刺锉甲"
      },
      {
        "icon": "🔄",
        "sents": [
          6
        ],
        "title": "换手继续剪"
      },
      {
        "icon": "🚫",
        "sents": [
          7
        ],
        "title": "不要咬指甲"
      }
    ],
    "scene": "妈妈给宝宝剪指甲",
    "when": "平时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc10": {
    "groups": [
      {
        "icon": "🍼",
        "sents": [
          0,
          1
        ],
        "title": "倒水看刻度"
      },
      {
        "icon": "🥄",
        "sents": [
          2,
          3,
          4
        ],
        "title": "加奶粉刮平"
      },
      {
        "icon": "🫙",
        "sents": [
          5,
          6
        ],
        "title": "拧盖摇匀"
      },
      {
        "icon": "🌡️",
        "sents": [
          7
        ],
        "title": "试温度"
      }
    ],
    "scene": "妈妈给宝宝冲奶粉",
    "when": "喂奶时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc100": {
    "groups": [
      {
        "icon": "🏮",
        "sents": [
          0,
          1
        ],
        "title": "元宵节到了"
      },
      {
        "icon": "🎑",
        "sents": [
          2,
          3
        ],
        "title": "赏灯猜谜"
      },
      {
        "icon": "🎪",
        "sents": [
          4
        ],
        "title": "逛庙会"
      },
      {
        "icon": "💃",
        "sents": [
          5,
          6
        ],
        "title": "歌舞表演"
      },
      {
        "icon": "🎆",
        "sents": [
          7
        ],
        "title": "放烟花"
      }
    ],
    "scene": "元宵节，赏花灯吃汤圆",
    "when": "农历正月十五",
    "where": "家里和庙会",
    "who": "一家人"
  },
  "pc11": {
    "groups": [
      {
        "icon": "👕",
        "sents": [
          0,
          1
        ],
        "title": "挑选衣服"
      },
      {
        "icon": "👗",
        "sents": [
          2,
          3
        ],
        "title": "穿上衣"
      },
      {
        "icon": "👖",
        "sents": [
          4,
          5
        ],
        "title": "穿裤子"
      },
      {
        "icon": "🔘",
        "sents": [
          6,
          7
        ],
        "title": "扣扣子拉链"
      }
    ],
    "scene": "早上，妈妈帮宝宝穿衣服",
    "when": "早上",
    "where": "卧室",
    "who": "妈妈和宝宝"
  },
  "pc12": {
    "groups": [
      {
        "icon": "👕",
        "sents": [
          0,
          1
        ],
        "title": "衣服穿反了"
      },
      {
        "icon": "🔘",
        "sents": [
          2,
          3
        ],
        "title": "扣子拉链问题"
      },
      {
        "icon": "👖",
        "sents": [
          4,
          5
        ],
        "title": "裤子没穿好"
      },
      {
        "icon": "🧦",
        "sents": [
          6,
          7
        ],
        "title": "袜子鞋子穿反"
      }
    ],
    "scene": "妈妈帮宝宝纠正穿反的衣服",
    "when": "穿衣服时",
    "where": "卧室",
    "who": "妈妈和宝宝"
  },
  "pc13": {
    "groups": [
      {
        "icon": "🧦",
        "sents": [
          0,
          1,
          2
        ],
        "title": "开始穿袜子"
      },
      {
        "icon": "🧤",
        "sents": [
          3,
          4,
          5
        ],
        "title": "套上袜子"
      },
      {
        "icon": "🔍",
        "sents": [
          6,
          7
        ],
        "title": "检查调整"
      }
    ],
    "scene": "妈妈教宝宝穿袜子",
    "when": "早上",
    "where": "卧室",
    "who": "妈妈和宝宝"
  },
  "pc14": {
    "groups": [
      {
        "icon": "👟",
        "sents": [
          0,
          1
        ],
        "title": "拿鞋穿鞋"
      },
      {
        "icon": "🦶",
        "sents": [
          2,
          3
        ],
        "title": "脚伸进鞋里"
      },
      {
        "icon": "👞",
        "sents": [
          4,
          5
        ],
        "title": "整理鞋子"
      },
      {
        "icon": "✅",
        "sents": [
          6,
          7
        ],
        "title": "系好检查"
      }
    ],
    "scene": "出门前，妈妈帮宝宝穿鞋子",
    "when": "出门前",
    "where": "玄关",
    "who": "妈妈和宝宝"
  },
  "pc15": {
    "groups": [
      {
        "icon": "👟",
        "sents": [
          0,
          1
        ],
        "title": "开始系鞋带"
      },
      {
        "icon": "🪢",
        "sents": [
          2
        ],
        "title": "打基本结"
      },
      {
        "icon": "🔁",
        "sents": [
          3,
          4
        ],
        "title": "打两个圈"
      },
      {
        "icon": "🪡",
        "sents": [
          5,
          6
        ],
        "title": "穿洞拉紧"
      },
      {
        "icon": "🎀",
        "sents": [
          7
        ],
        "title": "蝴蝶结完成"
      }
    ],
    "scene": "妈妈教宝宝系鞋带",
    "when": "穿鞋时",
    "where": "玄关",
    "who": "妈妈和宝宝"
  },
  "pc16": {
    "groups": [
      {
        "icon": "🏠",
        "sents": [
          0,
          1
        ],
        "title": "回家换拖鞋"
      },
      {
        "icon": "👞",
        "sents": [
          2,
          3
        ],
        "title": "拿出拖鞋"
      },
      {
        "icon": "🦶",
        "sents": [
          4,
          5
        ],
        "title": "脱鞋穿拖鞋"
      },
      {
        "icon": "⚠️",
        "sents": [
          6,
          7
        ],
        "title": "安全提醒"
      }
    ],
    "scene": "回家后，宝宝换上拖鞋",
    "when": "回家时",
    "where": "玄关",
    "who": "妈妈和宝宝"
  },
  "pc17": {
    "groups": [
      {
        "icon": "🌙",
        "sents": [
          0,
          1,
          2
        ],
        "title": "睡前准备"
      },
      {
        "icon": "😴",
        "sents": [
          3
        ],
        "title": "正确睡姿"
      },
      {
        "icon": "🛏️",
        "sents": [
          4,
          5
        ],
        "title": "盖好被子"
      },
      {
        "icon": "💤",
        "sents": [
          6,
          7
        ],
        "title": "安静入睡"
      }
    ],
    "scene": "晚上，妈妈哄宝宝睡觉",
    "when": "晚上",
    "where": "卧室",
    "who": "妈妈和宝宝"
  },
  "pc18": {
    "groups": [
      {
        "icon": "📏",
        "sents": [
          0,
          1
        ],
        "title": "开始量身高"
      },
      {
        "icon": "🍦",
        "sents": [
          2,
          3
        ],
        "title": "假装小冰棍"
      },
      {
        "icon": "🚫",
        "sents": [
          4,
          5
        ],
        "title": "量身高注意"
      },
      {
        "icon": "📐",
        "sents": [
          6,
          7
        ],
        "title": "读出结果"
      }
    ],
    "scene": "妈妈给宝宝量身高",
    "when": "平时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc19": {
    "groups": [
      {
        "icon": "⚖️",
        "sents": [
          0,
          1
        ],
        "title": "开始称体重"
      },
      {
        "icon": "🧍",
        "sents": [
          2,
          3,
          4
        ],
        "title": "站稳别动"
      },
      {
        "icon": "🐘",
        "sents": [
          5,
          6
        ],
        "title": "看看多重"
      },
      {
        "icon": "💪",
        "sents": [
          7
        ],
        "title": "鼓励长大"
      }
    ],
    "scene": "妈妈给宝宝称体重",
    "when": "平时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc20": {
    "groups": [
      {
        "icon": "🚽",
        "sents": [
          0,
          1
        ],
        "title": "想上厕所"
      },
      {
        "icon": "👖",
        "sents": [
          2,
          3,
          4
        ],
        "title": "准备坐马桶"
      },
      {
        "icon": "🧻",
        "sents": [
          5,
          6
        ],
        "title": "擦屁屁"
      },
      {
        "icon": "🚿",
        "sents": [
          7
        ],
        "title": "冲水洗手"
      }
    ],
    "scene": "妈妈帮宝宝上厕所",
    "when": "需要时",
    "where": "卫生间",
    "who": "妈妈和宝宝"
  },
  "pc21": {
    "groups": [
      {
        "icon": "🍳",
        "sents": [
          0,
          1
        ],
        "title": "早餐开始了"
      },
      {
        "icon": "🥄",
        "sents": [
          2,
          3,
          4
        ],
        "title": "好好吃饭"
      },
      {
        "icon": "🤫",
        "sents": [
          5
        ],
        "title": "吃饭规矩"
      },
      {
        "icon": "😋",
        "sents": [
          6,
          7
        ],
        "title": "吃饱擦嘴"
      }
    ],
    "scene": "早上，妈妈和宝宝吃早餐",
    "when": "早上",
    "where": "餐厅",
    "who": "妈妈和宝宝"
  },
  "pc22": {
    "groups": [
      {
        "icon": "🍜",
        "sents": [
          0,
          1
        ],
        "title": "面条做好了"
      },
      {
        "icon": "🥢",
        "sents": [
          2,
          3,
          4
        ],
        "title": "用筷子吃面"
      },
      {
        "icon": "💨",
        "sents": [
          5,
          6
        ],
        "title": "吹凉别吸溜"
      },
      {
        "icon": "🍲",
        "sents": [
          7
        ],
        "title": "再喝点汤"
      }
    ],
    "scene": "妈妈和宝宝吃面条",
    "when": "吃饭时",
    "where": "餐厅",
    "who": "妈妈和宝宝"
  },
  "pc23": {
    "groups": [
      {
        "icon": "💧",
        "sents": [
          0,
          1
        ],
        "title": "口渴喝水"
      },
      {
        "icon": "🥤",
        "sents": [
          2,
          3,
          4
        ],
        "title": "小口慢喝"
      },
      {
        "icon": "🧃",
        "sents": [
          5
        ],
        "title": "用吸管喝"
      },
      {
        "icon": "🌙",
        "sents": [
          6,
          7
        ],
        "title": "喝水提醒"
      }
    ],
    "scene": "妈妈让宝宝喝水",
    "when": "口渴时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc24": {
    "groups": [
      {
        "icon": "🍪",
        "sents": [
          0,
          1
        ],
        "title": "想吃零食"
      },
      {
        "icon": "🍽️",
        "sents": [
          2
        ],
        "title": "留肚子吃晚饭"
      },
      {
        "icon": "🤝",
        "sents": [
          3,
          4,
          5
        ],
        "title": "分享与节制"
      },
      {
        "icon": "🧻",
        "sents": [
          6
        ],
        "title": "吃完擦手"
      },
      {
        "icon": "🗑️",
        "sents": [
          7
        ],
        "title": "过期要扔掉"
      }
    ],
    "scene": "宝宝向妈妈要零食吃",
    "when": "两餐之间",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc25": {
    "groups": [
      {
        "icon": "🤧",
        "sents": [
          0,
          1,
          2
        ],
        "title": "流鼻涕了"
      },
      {
        "icon": "🧻",
        "sents": [
          3,
          4,
          5
        ],
        "title": "拿纸巾擤鼻涕"
      },
      {
        "icon": "🗑️",
        "sents": [
          6,
          7
        ],
        "title": "扔纸巾洗手"
      }
    ],
    "scene": "妈妈教宝宝擤鼻涕",
    "when": "流鼻涕时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc26": {
    "groups": [
      {
        "icon": "🦟",
        "sents": [
          0,
          1,
          2
        ],
        "title": "被蚊子咬了"
      },
      {
        "icon": "🧴",
        "sents": [
          3,
          4
        ],
        "title": "止痒处理"
      },
      {
        "icon": "🛡️",
        "sents": [
          5,
          6,
          7
        ],
        "title": "防蚊办法"
      }
    ],
    "scene": "夏天，宝宝被蚊子咬了，妈妈帮忙止痒和防蚊",
    "when": "夏天",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc27": {
    "groups": [
      {
        "icon": "🤕",
        "sents": [
          0,
          1,
          2
        ],
        "title": "哪里受伤了"
      },
      {
        "icon": "🩹",
        "sents": [
          3,
          4,
          5
        ],
        "title": "消毒包扎"
      },
      {
        "icon": "🌈",
        "sents": [
          6,
          7
        ],
        "title": "等待恢复"
      }
    ],
    "scene": "宝宝不小心受伤了，妈妈帮忙处理伤口",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc28": {
    "groups": [
      {
        "icon": "⚡",
        "sents": [
          0,
          1
        ],
        "title": "插座很危险"
      },
      {
        "icon": "🔌",
        "sents": [
          2,
          3
        ],
        "title": "拔插头方法"
      },
      {
        "icon": "💧",
        "sents": [
          4,
          5
        ],
        "title": "远离水"
      },
      {
        "icon": "🔋",
        "sents": [
          6,
          7
        ],
        "title": "触电和充电"
      }
    ],
    "scene": "妈妈教宝宝安全用电",
    "when": "平时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc29": {
    "groups": [
      {
        "icon": "🧱",
        "sents": [
          0,
          1
        ],
        "title": "开始搭积木"
      },
      {
        "icon": "🏰",
        "sents": [
          2,
          3,
          4,
          5
        ],
        "title": "搭高塔"
      },
      {
        "icon": "🔄",
        "sents": [
          6
        ],
        "title": "倒了再来"
      },
      {
        "icon": "🧹",
        "sents": [
          7
        ],
        "title": "收好积木"
      }
    ],
    "scene": "妈妈和宝宝一起搭积木",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc30": {
    "groups": [
      {
        "icon": "📦",
        "sents": [
          0,
          1
        ],
        "title": "开箱看说明书"
      },
      {
        "icon": "🧩",
        "sents": [
          2,
          3
        ],
        "title": "拼搭技巧"
      },
      {
        "icon": "🔧",
        "sents": [
          4,
          5,
          6
        ],
        "title": "错了改过来"
      },
      {
        "icon": "🔄",
        "sents": [
          7
        ],
        "title": "拆了再拼"
      }
    ],
    "scene": "妈妈和宝宝一起拼乐高",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc31": {
    "groups": [
      {
        "icon": "🧩",
        "sents": [
          0,
          1,
          2
        ],
        "title": "准备拼图"
      },
      {
        "icon": "🖼️",
        "sents": [
          3,
          4
        ],
        "title": "先拼边框"
      },
      {
        "icon": "🔄",
        "sents": [
          5,
          6
        ],
        "title": "拼不进怎么办"
      },
      {
        "icon": "🎉",
        "sents": [
          7
        ],
        "title": "拼好了"
      }
    ],
    "scene": "妈妈和宝宝一起玩拼图",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc32": {
    "groups": [
      {
        "icon": "🖐️",
        "sents": [
          0,
          1
        ],
        "title": "认识橡皮泥"
      },
      {
        "icon": "🤲",
        "sents": [
          2,
          3,
          4,
          5
        ],
        "title": "捏出形状"
      },
      {
        "icon": "⭐",
        "sents": [
          6
        ],
        "title": "用模具压形"
      },
      {
        "icon": "🫙",
        "sents": [
          7
        ],
        "title": "玩完盖盖子"
      }
    ],
    "scene": "妈妈和宝宝一起玩橡皮泥",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc33": {
    "groups": [
      {
        "icon": "✂️",
        "sents": [
          0,
          1,
          2
        ],
        "title": "认识剪刀"
      },
      {
        "icon": "📏",
        "sents": [
          3,
          4,
          5
        ],
        "title": "沿着虚线剪"
      },
      {
        "icon": "🗑️",
        "sents": [
          6
        ],
        "title": "收拾纸屑"
      },
      {
        "icon": "⚠️",
        "sents": [
          7
        ],
        "title": "安全提醒"
      }
    ],
    "scene": "妈妈教宝宝剪纸",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc34": {
    "groups": [
      {
        "icon": "🐱",
        "sents": [
          0,
          1
        ],
        "title": "画只小猫"
      },
      {
        "icon": "🖍️",
        "sents": [
          2,
          3
        ],
        "title": "涂颜色"
      },
      {
        "icon": "🎨",
        "sents": [
          4,
          5,
          6,
          7
        ],
        "title": "玩颜料"
      }
    ],
    "scene": "妈妈和宝宝一起画画",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc35": {
    "groups": [
      {
        "icon": "🧸",
        "sents": [
          0,
          1
        ],
        "title": "病人来了"
      },
      {
        "icon": "🩺",
        "sents": [
          2,
          3,
          4
        ],
        "title": "检查身体"
      },
      {
        "icon": "🌡️",
        "sents": [
          5
        ],
        "title": "发烧了"
      },
      {
        "icon": "💊",
        "sents": [
          6,
          7
        ],
        "title": "打针吃药"
      }
    ],
    "scene": "妈妈和宝宝玩医生游戏，给泰迪熊看病",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈、宝宝和泰迪熊"
  },
  "pc36": {
    "groups": [
      {
        "icon": "👩‍🍳",
        "sents": [
          0,
          1
        ],
        "title": "分配角色"
      },
      {
        "icon": "🥕",
        "sents": [
          2,
          3
        ],
        "title": "准备食材"
      },
      {
        "icon": "🍳",
        "sents": [
          4,
          5
        ],
        "title": "下锅烹饪"
      },
      {
        "icon": "🍽️",
        "sents": [
          6,
          7
        ],
        "title": "饭做好了"
      }
    ],
    "scene": "妈妈和宝宝玩过家家，宝宝当厨师做饭",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc37": {
    "groups": [
      {
        "icon": "🙈",
        "sents": [
          0,
          1
        ],
        "title": "分工"
      },
      {
        "icon": "🔢",
        "sents": [
          2,
          3,
          4
        ],
        "title": "数数藏好"
      },
      {
        "icon": "🔍",
        "sents": [
          5,
          6
        ],
        "title": "开始找"
      },
      {
        "icon": "🎉",
        "sents": [
          7
        ],
        "title": "找到了"
      }
    ],
    "scene": "妈妈和宝宝玩捉迷藏",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc38": {
    "groups": [
      {
        "icon": "🪖",
        "sents": [
          0
        ],
        "title": "戴好头盔"
      },
      {
        "icon": "🚲",
        "sents": [
          1,
          2,
          3
        ],
        "title": "上车骑行"
      },
      {
        "icon": "🔔",
        "sents": [
          4,
          5
        ],
        "title": "刹车和按铃"
      },
      {
        "icon": "🛞",
        "sents": [
          6,
          7
        ],
        "title": "辅助轮和打气"
      }
    ],
    "scene": "妈妈教宝宝骑自行车",
    "when": "玩耍时",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc39": {
    "groups": [
      {
        "icon": "🚗",
        "sents": [
          0,
          1,
          2
        ],
        "title": "上车坐好"
      },
      {
        "icon": "➡️",
        "sents": [
          3,
          4
        ],
        "title": "让车前进"
      },
      {
        "icon": "↩️",
        "sents": [
          5,
          6
        ],
        "title": "减速掉头"
      },
      {
        "icon": "⚠️",
        "sents": [
          7
        ],
        "title": "注意安全"
      }
    ],
    "scene": "妈妈教宝宝骑扭扭车",
    "when": "玩耍时",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc40": {
    "groups": [
      {
        "icon": "🛴",
        "sents": [
          0,
          1,
          2
        ],
        "title": "上车起步"
      },
      {
        "icon": "👀",
        "sents": [
          3,
          5
        ],
        "title": "平衡和看路"
      },
      {
        "icon": "🛑",
        "sents": [
          4
        ],
        "title": "踩刹车"
      },
      {
        "icon": "💨",
        "sents": [
          6,
          7
        ],
        "title": "滑行加速"
      }
    ],
    "scene": "妈妈教宝宝骑滑板车",
    "when": "玩耍时",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc41": {
    "groups": [
      {
        "icon": "🪑",
        "sents": [
          0,
          1
        ],
        "title": "上秋千坐好"
      },
      {
        "icon": "🤲",
        "sents": [
          2,
          3
        ],
        "title": "妈妈推你"
      },
      {
        "icon": "🦶",
        "sents": [
          4,
          5
        ],
        "title": "自己荡"
      },
      {
        "icon": "🛑",
        "sents": [
          6,
          7
        ],
        "title": "安全下来"
      }
    ],
    "scene": "妈妈带宝宝荡秋千",
    "when": "玩耍时",
    "where": "游乐场",
    "who": "妈妈和宝宝"
  },
  "pc42": {
    "groups": [
      {
        "icon": "🪜",
        "sents": [
          0,
          1
        ],
        "title": "爬上滑梯"
      },
      {
        "icon": "🛝",
        "sents": [
          2,
          3,
          4
        ],
        "title": "滑下来"
      },
      {
        "icon": "⚠️",
        "sents": [
          5,
          7
        ],
        "title": "安全规则"
      },
      {
        "icon": "🏃",
        "sents": [
          6
        ],
        "title": "滑完快离开"
      }
    ],
    "scene": "妈妈带宝宝玩滑滑梯",
    "when": "玩耍时",
    "where": "游乐场",
    "who": "妈妈和宝宝"
  },
  "pc43": {
    "groups": [
      {
        "icon": "🪑",
        "sents": [
          0,
          1,
          2
        ],
        "title": "选边坐好"
      },
      {
        "icon": "🤲",
        "sents": [
          3,
          4
        ],
        "title": "坐稳抓牢"
      },
      {
        "icon": "↕️",
        "sents": [
          5,
          6
        ],
        "title": "上下摇晃"
      },
      {
        "icon": "👋",
        "sents": [
          7
        ],
        "title": "自己下来"
      }
    ],
    "scene": "妈妈和宝宝玩跷跷板",
    "when": "玩耍时",
    "where": "游乐场",
    "who": "妈妈和宝宝"
  },
  "pc44": {
    "groups": [
      {
        "icon": "🫧",
        "sents": [
          0,
          1,
          2
        ],
        "title": "准备蘸棒"
      },
      {
        "icon": "💨",
        "sents": [
          3,
          4
        ],
        "title": "吹泡泡"
      },
      {
        "icon": "👆",
        "sents": [
          5,
          6
        ],
        "title": "追泡泡戳破"
      },
      {
        "icon": "⚠️",
        "sents": [
          7
        ],
        "title": "小心别洒"
      }
    ],
    "scene": "妈妈和宝宝一起吹泡泡",
    "when": "玩耍时",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc45": {
    "groups": [
      {
        "icon": "🎈",
        "sents": [
          0,
          1,
          2
        ],
        "title": "用泵打气"
      },
      {
        "icon": "💨",
        "sents": [
          3,
          4
        ],
        "title": "用嘴吹"
      },
      {
        "icon": "😬",
        "sents": [
          5
        ],
        "title": "气太多了"
      },
      {
        "icon": "🎀",
        "sents": [
          6,
          7
        ],
        "title": "系好别弄破"
      }
    ],
    "scene": "妈妈和宝宝一起吹气球",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc46": {
    "groups": [
      {
        "icon": "⏳",
        "sents": [
          0,
          1
        ],
        "title": "玩沙漏斗"
      },
      {
        "icon": "💧",
        "sents": [
          2,
          3
        ],
        "title": "沙子太干"
      },
      {
        "icon": "🏰",
        "sents": [
          4,
          5,
          6
        ],
        "title": "做沙堡"
      },
      {
        "icon": "👀",
        "sents": [
          7
        ],
        "title": "别揉眼睛"
      }
    ],
    "scene": "妈妈和宝宝在沙坑玩沙子",
    "when": "玩耍时",
    "where": "户外沙坑",
    "who": "妈妈和宝宝"
  },
  "pc47": {
    "groups": [
      {
        "icon": "💦",
        "sents": [
          0,
          1
        ],
        "title": "给水枪吸水"
      },
      {
        "icon": "🔫",
        "sents": [
          2,
          3,
          6
        ],
        "title": "射水比远"
      },
      {
        "icon": "🎯",
        "sents": [
          4,
          5
        ],
        "title": "瞄准别射人"
      },
      {
        "icon": "⚠️",
        "sents": [
          7
        ],
        "title": "离水边远点"
      }
    ],
    "scene": "妈妈和宝宝玩水枪",
    "when": "玩耍时",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc48": {
    "groups": [
      {
        "icon": "✊",
        "sents": [
          0
        ],
        "title": "开始玩"
      },
      {
        "icon": "✌️",
        "sents": [
          1,
          2,
          3
        ],
        "title": "三种手势"
      },
      {
        "icon": "📏",
        "sents": [
          4,
          5,
          6
        ],
        "title": "游戏规则"
      },
      {
        "icon": "🏆",
        "sents": [
          7
        ],
        "title": "三局两胜"
      }
    ],
    "scene": "妈妈和宝宝玩石头剪刀布",
    "when": "玩耍时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc49": {
    "groups": [
      {
        "icon": "🧸",
        "sents": [
          0,
          1
        ],
        "title": "玩具满地"
      },
      {
        "icon": "🧹",
        "sents": [
          2,
          3
        ],
        "title": "开始收拾"
      },
      {
        "icon": "📦",
        "sents": [
          4,
          5,
          6
        ],
        "title": "各归其位"
      },
      {
        "icon": "✨",
        "sents": [
          7
        ],
        "title": "收拾干净"
      }
    ],
    "scene": "妈妈和宝宝一起整理玩具",
    "when": "玩完之后",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc50": {
    "groups": [
      {
        "icon": "🔧",
        "sents": [
          0,
          1
        ],
        "title": "打开电池仓"
      },
      {
        "icon": "🔋",
        "sents": [
          2,
          3
        ],
        "title": "认识电池"
      },
      {
        "icon": "🔌",
        "sents": [
          4,
          5
        ],
        "title": "装进电池"
      },
      {
        "icon": "✅",
        "sents": [
          6,
          7
        ],
        "title": "盖好试一试"
      }
    ],
    "scene": "妈妈教宝宝给玩具换电池",
    "when": "玩具没电时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc51": {
    "groups": [
      {
        "icon": "🥣",
        "sents": [
          0,
          1
        ],
        "title": "和面"
      },
      {
        "icon": "⏳",
        "sents": [
          2
        ],
        "title": "发面"
      },
      {
        "icon": "🫓",
        "sents": [
          3,
          4
        ],
        "title": "擀面皮"
      },
      {
        "icon": "🥟",
        "sents": [
          5,
          6
        ],
        "title": "包馅"
      },
      {
        "icon": "♨️",
        "sents": [
          7
        ],
        "title": "蒸包子"
      }
    ],
    "scene": "妈妈和宝宝一起做包子",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc52": {
    "groups": [
      {
        "icon": "🥣",
        "sents": [
          0
        ],
        "title": "调饺子馅"
      },
      {
        "icon": "🥄",
        "sents": [
          1,
          2
        ],
        "title": "托皮放馅"
      },
      {
        "icon": "🤏",
        "sents": [
          3,
          4,
          5
        ],
        "title": "捏饺子"
      },
      {
        "icon": "🍲",
        "sents": [
          6,
          7
        ],
        "title": "煮饺子"
      }
    ],
    "scene": "妈妈和宝宝一起包饺子",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc53": {
    "groups": [
      {
        "icon": "🍪",
        "sents": [
          0
        ],
        "title": "开始烤饼干"
      },
      {
        "icon": "🥣",
        "sents": [
          1,
          2,
          3
        ],
        "title": "搅拌面糊"
      },
      {
        "icon": "⭐",
        "sents": [
          4,
          5
        ],
        "title": "压出形状"
      },
      {
        "icon": "🔥",
        "sents": [
          6,
          7
        ],
        "title": "烤好享用"
      }
    ],
    "scene": "妈妈和宝宝一起烤饼干",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc54": {
    "groups": [
      {
        "icon": "📖",
        "sents": [
          0
        ],
        "title": "看食谱"
      },
      {
        "icon": "🥣",
        "sents": [
          1,
          2,
          3,
          4
        ],
        "title": "调面糊"
      },
      {
        "icon": "🍳",
        "sents": [
          5,
          6
        ],
        "title": "煎松饼"
      },
      {
        "icon": "🍯",
        "sents": [
          7
        ],
        "title": "淋蜂蜜"
      }
    ],
    "scene": "妈妈和宝宝一起做松饼",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc55": {
    "groups": [
      {
        "icon": "🍞",
        "sents": [
          0,
          1
        ],
        "title": "准备材料"
      },
      {
        "icon": "🔥",
        "sents": [
          2,
          3,
          4
        ],
        "title": "烤吐司"
      },
      {
        "icon": "😋",
        "sents": [
          5,
          6,
          7
        ],
        "title": "涂酱品尝"
      }
    ],
    "scene": "妈妈教宝宝烤吐司",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc56": {
    "groups": [
      {
        "icon": "🍳",
        "sents": [
          0,
          1,
          2
        ],
        "title": "准备开火"
      },
      {
        "icon": "🥚",
        "sents": [
          3,
          4
        ],
        "title": "打鸡蛋"
      },
      {
        "icon": "🔥",
        "sents": [
          5,
          6
        ],
        "title": "煎鸡蛋"
      },
      {
        "icon": "🍽️",
        "sents": [
          7
        ],
        "title": "盛出装盘"
      }
    ],
    "scene": "妈妈和宝宝一起煎鸡蛋",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc57": {
    "groups": [
      {
        "icon": "🥚",
        "sents": [
          0
        ],
        "title": "想吃鸡蛋"
      },
      {
        "icon": "🔨",
        "sents": [
          1,
          2,
          3
        ],
        "title": "敲裂蛋壳"
      },
      {
        "icon": "🤲",
        "sents": [
          4,
          5
        ],
        "title": "剥蛋壳"
      },
      {
        "icon": "🟡",
        "sents": [
          6
        ],
        "title": "认识蛋黄"
      },
      {
        "icon": "😋",
        "sents": [
          7
        ],
        "title": "小口慢吃"
      }
    ],
    "scene": "妈妈教宝宝剥水煮蛋",
    "when": "吃饭时",
    "where": "餐厅",
    "who": "妈妈和宝宝"
  },
  "pc58": {
    "groups": [
      {
        "icon": "🍚",
        "sents": [
          0,
          1
        ],
        "title": "量米"
      },
      {
        "icon": "💧",
        "sents": [
          2,
          3
        ],
        "title": "淘米加水"
      },
      {
        "icon": "🍲",
        "sents": [
          4,
          5,
          6
        ],
        "title": "开始煮饭"
      },
      {
        "icon": "♨️",
        "sents": [
          7
        ],
        "title": "煮好保温"
      }
    ],
    "scene": "妈妈和宝宝一起煮米饭",
    "when": "做饭时",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc59": {
    "groups": [
      {
        "icon": "🍽️",
        "sents": [
          0,
          1,
          2
        ],
        "title": "摆饭桌"
      },
      {
        "icon": "🍚",
        "sents": [
          3,
          4,
          5,
          6
        ],
        "title": "盛米饭"
      },
      {
        "icon": "🥘",
        "sents": [
          7
        ],
        "title": "端菜上桌"
      }
    ],
    "scene": "宝宝帮妈妈做餐前准备",
    "when": "饭前",
    "where": "餐厅",
    "who": "妈妈和宝宝"
  },
  "pc60": {
    "groups": [
      {
        "icon": "⏰",
        "sents": [
          0
        ],
        "title": "等齐开饭"
      },
      {
        "icon": "🤫",
        "sents": [
          1,
          2,
          3
        ],
        "title": "安静吃饭"
      },
      {
        "icon": "🥦",
        "sents": [
          4,
          5
        ],
        "title": "好好吃饭"
      },
      {
        "icon": "🧼",
        "sents": [
          6,
          7
        ],
        "title": "饭后洗手"
      }
    ],
    "scene": "妈妈教宝宝餐桌礼仪",
    "when": "吃饭时",
    "where": "餐厅",
    "who": "妈妈和宝宝"
  },
  "pc61": {
    "groups": [
      {
        "icon": "🍽️",
        "sents": [
          0
        ],
        "title": "帮忙收拾"
      },
      {
        "icon": "🥡",
        "sents": [
          1,
          2,
          3
        ],
        "title": "收剩菜"
      },
      {
        "icon": "🍲",
        "sents": [
          4,
          5
        ],
        "title": "收碗盘"
      },
      {
        "icon": "🧹",
        "sents": [
          6,
          7
        ],
        "title": "擦桌归位"
      }
    ],
    "scene": "宝宝帮妈妈收拾餐桌",
    "when": "饭后",
    "where": "餐厅",
    "who": "妈妈和宝宝"
  },
  "pc62": {
    "groups": [
      {
        "icon": "🧽",
        "sents": [
          0,
          1
        ],
        "title": "准备洗碗"
      },
      {
        "icon": "🫧",
        "sents": [
          2,
          3,
          4,
          5
        ],
        "title": "擦洗盘子"
      },
      {
        "icon": "💧",
        "sents": [
          6
        ],
        "title": "冲洗干净"
      },
      {
        "icon": "🍽️",
        "sents": [
          7
        ],
        "title": "沥干收好"
      }
    ],
    "scene": "妈妈和宝宝一起洗碗",
    "when": "饭后",
    "where": "厨房",
    "who": "妈妈和宝宝"
  },
  "pc63": {
    "groups": [
      {
        "icon": "🧹",
        "sents": [
          0,
          1
        ],
        "title": "开始扫地"
      },
      {
        "icon": "🗑️",
        "sents": [
          2,
          3,
          4
        ],
        "title": "扫进垃圾桶"
      },
      {
        "icon": "🧽",
        "sents": [
          5,
          6
        ],
        "title": "吸尘拖地"
      },
      {
        "icon": "⚠️",
        "sents": [
          7
        ],
        "title": "小心湿滑"
      }
    ],
    "scene": "妈妈和宝宝一起扫地拖地",
    "when": "打扫时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc64": {
    "groups": [
      {
        "icon": "🧺",
        "sents": [
          0,
          1
        ],
        "title": "准备洗衣"
      },
      {
        "icon": "🔍",
        "sents": [
          2,
          3
        ],
        "title": "检查分类"
      },
      {
        "icon": "🧼",
        "sents": [
          4,
          5,
          6
        ],
        "title": "放进洗衣机"
      },
      {
        "icon": "⏳",
        "sents": [
          7
        ],
        "title": "等它洗好"
      }
    ],
    "scene": "妈妈和宝宝一起洗衣服",
    "when": "洗衣服时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc65": {
    "groups": [
      {
        "icon": "👕",
        "sents": [
          0,
          1
        ],
        "title": "洗好了"
      },
      {
        "icon": "🪝",
        "sents": [
          2,
          3
        ],
        "title": "准备晾晒"
      },
      {
        "icon": "👗",
        "sents": [
          4,
          5,
          6
        ],
        "title": "挂上衣服"
      },
      {
        "icon": "🧦",
        "sents": [
          7
        ],
        "title": "夹小件衣物"
      }
    ],
    "scene": "妈妈和宝宝一起晾衣服",
    "when": "洗完衣服后",
    "where": "阳台",
    "who": "妈妈和宝宝"
  },
  "pc66": {
    "groups": [
      {
        "icon": "🌸",
        "sents": [
          0
        ],
        "title": "种花吧"
      },
      {
        "icon": "🪴",
        "sents": [
          1,
          2
        ],
        "title": "准备花盆"
      },
      {
        "icon": "🌱",
        "sents": [
          3,
          4
        ],
        "title": "播下种子"
      },
      {
        "icon": "💧",
        "sents": [
          5,
          6,
          7
        ],
        "title": "浇水等开花"
      }
    ],
    "scene": "妈妈和宝宝一起种花",
    "when": "白天",
    "where": "阳台",
    "who": "妈妈和宝宝"
  },
  "pc67": {
    "groups": [
      {
        "icon": "🌍",
        "sents": [
          0
        ],
        "title": "为什么分类"
      },
      {
        "icon": "🗑️",
        "sents": [
          1,
          2,
          3,
          4
        ],
        "title": "四类垃圾"
      },
      {
        "icon": "♻️",
        "sents": [
          5,
          6,
          7
        ],
        "title": "分类再利用"
      }
    ],
    "scene": "妈妈教宝宝垃圾分类",
    "when": "扔垃圾时",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc68": {
    "groups": [
      {
        "icon": "📦",
        "sents": [
          0,
          1
        ],
        "title": "出发取快递"
      },
      {
        "icon": "🔍",
        "sents": [
          2,
          3
        ],
        "title": "找到包裹"
      },
      {
        "icon": "🔐",
        "sents": [
          4,
          5,
          6,
          7
        ],
        "title": "快递柜取件"
      }
    ],
    "scene": "妈妈带宝宝去取快递",
    "when": "白天",
    "where": "快递站",
    "who": "妈妈和宝宝"
  },
  "pc69": {
    "groups": [
      {
        "icon": "🚶",
        "sents": [
          0
        ],
        "title": "走楼梯"
      },
      {
        "icon": "🤲",
        "sents": [
          1,
          2
        ],
        "title": "扶好一步步"
      },
      {
        "icon": "🛋️",
        "sents": [
          3
        ],
        "title": "平台休息"
      },
      {
        "icon": "👀",
        "sents": [
          4,
          5
        ],
        "title": "慢慢看路"
      },
      {
        "icon": "🚫",
        "sents": [
          6,
          7
        ],
        "title": "别做危险事"
      }
    ],
    "scene": "妈妈带宝宝走楼梯",
    "when": "出门时",
    "where": "楼梯",
    "who": "妈妈和宝宝"
  },
  "pc70": {
    "groups": [
      {
        "icon": "🛗",
        "sents": [
          0,
          1
        ],
        "title": "等电梯"
      },
      {
        "icon": "🚪",
        "sents": [
          2,
          3
        ],
        "title": "进电梯"
      },
      {
        "icon": "👋",
        "sents": [
          4,
          5
        ],
        "title": "下电梯"
      },
      {
        "icon": "⚠️",
        "sents": [
          6,
          7
        ],
        "title": "电梯规矩"
      }
    ],
    "scene": "妈妈带宝宝乘电梯",
    "when": "出门时",
    "where": "电梯里",
    "who": "妈妈和宝宝"
  },
  "pc71": {
    "groups": [
      {
        "icon": "🛗",
        "sents": [
          0
        ],
        "title": "乘扶梯"
      },
      {
        "icon": "👣",
        "sents": [
          1,
          2
        ],
        "title": "上扶梯"
      },
      {
        "icon": "🤲",
        "sents": [
          3,
          4,
          5
        ],
        "title": "站稳扶好"
      },
      {
        "icon": "🚶",
        "sents": [
          6
        ],
        "title": "下扶梯"
      },
      {
        "icon": "🚫",
        "sents": [
          7
        ],
        "title": "别逆向乘"
      }
    ],
    "scene": "妈妈带宝宝乘扶梯",
    "when": "出门时",
    "where": "扶梯上",
    "who": "妈妈和宝宝"
  },
  "pc72": {
    "groups": [
      {
        "icon": "🌳",
        "sents": [
          0
        ],
        "title": "出去散步"
      },
      {
        "icon": "🚶",
        "sents": [
          1,
          2
        ],
        "title": "好好走路"
      },
      {
        "icon": "⚠️",
        "sents": [
          3,
          4,
          5,
          6
        ],
        "title": "注意安全"
      },
      {
        "icon": "🤗",
        "sents": [
          7
        ],
        "title": "累了背背"
      }
    ],
    "scene": "妈妈带宝宝出去散步",
    "when": "白天",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc73": {
    "groups": [
      {
        "icon": "🧳",
        "sents": [
          0,
          1
        ],
        "title": "准备出发"
      },
      {
        "icon": "⛺",
        "sents": [
          2,
          3
        ],
        "title": "搭帐篷"
      },
      {
        "icon": "🛏️",
        "sents": [
          4,
          5,
          6
        ],
        "title": "布置营地"
      },
      {
        "icon": "😴",
        "sents": [
          7
        ],
        "title": "帐篷小睡"
      }
    ],
    "scene": "妈妈和宝宝一起去露营",
    "when": "白天",
    "where": "营地",
    "who": "妈妈和宝宝"
  },
  "pc74": {
    "groups": [
      {
        "icon": "🧺",
        "sents": [
          0
        ],
        "title": "去野餐"
      },
      {
        "icon": "🟫",
        "sents": [
          1,
          2,
          3,
          4
        ],
        "title": "铺野餐垫"
      },
      {
        "icon": "🍎",
        "sents": [
          5,
          6
        ],
        "title": "坐下吃东西"
      },
      {
        "icon": "🧹",
        "sents": [
          7
        ],
        "title": "收拾回家"
      }
    ],
    "scene": "妈妈和宝宝一起去野餐",
    "when": "白天",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc75": {
    "groups": [
      {
        "icon": "🛒",
        "sents": [
          0,
          1
        ],
        "title": "去超市"
      },
      {
        "icon": "🏷️",
        "sents": [
          2,
          3,
          4
        ],
        "title": "逛超市"
      },
      {
        "icon": "📋",
        "sents": [
          5
        ],
        "title": "核对清单"
      },
      {
        "icon": "💳",
        "sents": [
          6,
          7
        ],
        "title": "结账"
      }
    ],
    "scene": "妈妈带宝宝去超市购物",
    "when": "白天",
    "where": "超市",
    "who": "妈妈和宝宝"
  },
  "pc76": {
    "groups": [
      {
        "icon": "🎒",
        "sents": [
          0
        ],
        "title": "出发去公园"
      },
      {
        "icon": "🍞",
        "sents": [
          1
        ],
        "title": "撕碎面包"
      },
      {
        "icon": "🐟",
        "sents": [
          2,
          3,
          4
        ],
        "title": "喂鱼"
      },
      {
        "icon": "⚠️",
        "sents": [
          5,
          6
        ],
        "title": "安全提醒"
      },
      {
        "icon": "🚫",
        "sents": [
          7
        ],
        "title": "禁止钓鱼"
      }
    ],
    "scene": "妈妈带宝宝去公园喂鱼",
    "when": "白天",
    "where": "公园池塘边",
    "who": "妈妈和宝宝"
  },
  "pc77": {
    "groups": [
      {
        "icon": "🎬",
        "sents": [
          0
        ],
        "title": "出发看电影"
      },
      {
        "icon": "🎫",
        "sents": [
          1,
          2
        ],
        "title": "取票买零食"
      },
      {
        "icon": "🎟️",
        "sents": [
          3,
          4
        ],
        "title": "检票入场"
      },
      {
        "icon": "👓",
        "sents": [
          5,
          6
        ],
        "title": "观影开始"
      },
      {
        "icon": "🧹",
        "sents": [
          7
        ],
        "title": "电影结束"
      }
    ],
    "scene": "妈妈带宝宝去电影院看电影",
    "when": "白天",
    "where": "电影院",
    "who": "妈妈和宝宝"
  },
  "pc78": {
    "groups": [
      {
        "icon": "📷",
        "sents": [
          0
        ],
        "title": "开始拍照"
      },
      {
        "icon": "🚶",
        "sents": [
          1
        ],
        "title": "调整位置"
      },
      {
        "icon": "✌️",
        "sents": [
          2,
          3
        ],
        "title": "摆好姿势"
      },
      {
        "icon": "📸",
        "sents": [
          4,
          6
        ],
        "title": "抓拍放大"
      },
      {
        "icon": "🤳",
        "sents": [
          5,
          7
        ],
        "title": "重拍自拍"
      }
    ],
    "scene": "妈妈给宝宝拍照片",
    "when": "白天",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc79": {
    "groups": [
      {
        "icon": "🚶",
        "sents": [
          0,
          1
        ],
        "title": "准备过马路"
      },
      {
        "icon": "🚦",
        "sents": [
          2,
          3
        ],
        "title": "看信号灯"
      },
      {
        "icon": "👀",
        "sents": [
          4
        ],
        "title": "左右观察"
      },
      {
        "icon": "🤝",
        "sents": [
          5,
          6
        ],
        "title": "牵手过马路"
      },
      {
        "icon": "⚠️",
        "sents": [
          7
        ],
        "title": "安全提醒"
      }
    ],
    "scene": "妈妈带宝宝过马路",
    "when": "白天",
    "where": "路口",
    "who": "妈妈和宝宝"
  },
  "pc80": {
    "groups": [
      {
        "icon": "🚗",
        "sents": [
          0,
          1,
          2
        ],
        "title": "上车准备"
      },
      {
        "icon": "🛣️",
        "sents": [
          3,
          4
        ],
        "title": "出发上路"
      },
      {
        "icon": "⚠️",
        "sents": [
          5,
          6
        ],
        "title": "乘车安全"
      },
      {
        "icon": "⛽",
        "sents": [
          7
        ],
        "title": "途中加油"
      }
    ],
    "scene": "妈妈带宝宝坐车出门",
    "when": "白天",
    "where": "车上",
    "who": "妈妈和宝宝"
  },
  "pc81": {
    "groups": [
      {
        "icon": "🚌",
        "sents": [
          0,
          1
        ],
        "title": "等车"
      },
      {
        "icon": "🚏",
        "sents": [
          2,
          3
        ],
        "title": "上车买票"
      },
      {
        "icon": "💺",
        "sents": [
          4,
          5
        ],
        "title": "车上须知"
      },
      {
        "icon": "🚪",
        "sents": [
          6,
          7
        ],
        "title": "到站下车"
      }
    ],
    "scene": "妈妈带宝宝乘公交车",
    "when": "白天",
    "where": "公交车站和车上",
    "who": "妈妈和宝宝"
  },
  "pc82": {
    "groups": [
      {
        "icon": "🚇",
        "sents": [
          0
        ],
        "title": "出发坐地铁"
      },
      {
        "icon": "🔍",
        "sents": [
          1,
          2
        ],
        "title": "安检进站"
      },
      {
        "icon": "🗺️",
        "sents": [
          3,
          4
        ],
        "title": "找站台等车"
      },
      {
        "icon": "⚠️",
        "sents": [
          5,
          6
        ],
        "title": "上车注意"
      },
      {
        "icon": "🚪",
        "sents": [
          7
        ],
        "title": "到站下车"
      }
    ],
    "scene": "妈妈带宝宝坐地铁去博物馆",
    "when": "白天",
    "where": "地铁站和车厢",
    "who": "妈妈和宝宝"
  },
  "pc83": {
    "groups": [
      {
        "icon": "🚕",
        "sents": [
          0,
          1,
          2
        ],
        "title": "打车出发"
      },
      {
        "icon": "💺",
        "sents": [
          3,
          4
        ],
        "title": "上车出发"
      },
      {
        "icon": "🗺️",
        "sents": [
          5
        ],
        "title": "路上行驶"
      },
      {
        "icon": "🚪",
        "sents": [
          6,
          7
        ],
        "title": "到达下车"
      }
    ],
    "scene": "妈妈带宝宝打车去超市",
    "when": "白天",
    "where": "路边和出租车上",
    "who": "妈妈和宝宝"
  },
  "pc84": {
    "groups": [
      {
        "icon": "📱",
        "sents": [
          0
        ],
        "title": "打开软件"
      },
      {
        "icon": "📍",
        "sents": [
          1,
          2
        ],
        "title": "确认地点"
      },
      {
        "icon": "⏳",
        "sents": [
          3,
          4,
          5
        ],
        "title": "等待接单"
      },
      {
        "icon": "🚗",
        "sents": [
          6,
          7
        ],
        "title": "上车到达"
      }
    ],
    "scene": "妈妈用手机打车带宝宝出门",
    "when": "白天",
    "where": "家里和路边",
    "who": "妈妈和宝宝"
  },
  "pc85": {
    "groups": [
      {
        "icon": "🧳",
        "sents": [
          0,
          1
        ],
        "title": "准备出发"
      },
      {
        "icon": "📝",
        "sents": [
          2
        ],
        "title": "列好清单"
      },
      {
        "icon": "👕",
        "sents": [
          3,
          4
        ],
        "title": "收拾衣物"
      },
      {
        "icon": "🔌",
        "sents": [
          5,
          6
        ],
        "title": "收好杂物"
      },
      {
        "icon": "🎁",
        "sents": [
          7
        ],
        "title": "留出空间"
      }
    ],
    "scene": "妈妈和宝宝为旅行收拾行李",
    "when": "出发前一天",
    "where": "家里",
    "who": "妈妈和宝宝"
  },
  "pc86": {
    "groups": [
      {
        "icon": "✈️",
        "sents": [
          0,
          1
        ],
        "title": "办理登机"
      },
      {
        "icon": "🛫",
        "sents": [
          2,
          3
        ],
        "title": "等待登机"
      },
      {
        "icon": "💺",
        "sents": [
          4,
          5,
          6
        ],
        "title": "入座起飞"
      },
      {
        "icon": "🧳",
        "sents": [
          7
        ],
        "title": "到达取行李"
      }
    ],
    "scene": "妈妈带宝宝坐飞机旅行",
    "when": "白天",
    "where": "机场和飞机上",
    "who": "妈妈和宝宝"
  },
  "pc87": {
    "groups": [
      {
        "icon": "🚄",
        "sents": [
          0
        ],
        "title": "出发去车站"
      },
      {
        "icon": "🔍",
        "sents": [
          1,
          2
        ],
        "title": "安检进站"
      },
      {
        "icon": "🚉",
        "sents": [
          3
        ],
        "title": "站台等车"
      },
      {
        "icon": "💺",
        "sents": [
          4,
          5,
          6
        ],
        "title": "上车落座"
      },
      {
        "icon": "🚪",
        "sents": [
          7
        ],
        "title": "到站下车"
      }
    ],
    "scene": "妈妈带宝宝坐高铁出门",
    "when": "白天",
    "where": "火车站和高铁上",
    "who": "妈妈和宝宝"
  },
  "pc88": {
    "groups": [
      {
        "icon": "🏨",
        "sents": [
          0
        ],
        "title": "到达酒店"
      },
      {
        "icon": "🛎️",
        "sents": [
          1,
          2,
          3
        ],
        "title": "办理入住"
      },
      {
        "icon": "🛗",
        "sents": [
          4,
          5,
          6
        ],
        "title": "上楼进房"
      },
      {
        "icon": "🔑",
        "sents": [
          7
        ],
        "title": "退房离开"
      }
    ],
    "scene": "妈妈带宝宝住酒店",
    "when": "旅行时",
    "where": "酒店",
    "who": "妈妈和宝宝"
  },
  "pc89": {
    "groups": [
      {
        "icon": "🎂",
        "sents": [
          0,
          1
        ],
        "title": "生日快乐"
      },
      {
        "icon": "🕯️",
        "sents": [
          2,
          3
        ],
        "title": "点烛许愿"
      },
      {
        "icon": "💨",
        "sents": [
          4,
          5
        ],
        "title": "吹烛切蛋糕"
      },
      {
        "icon": "🎁",
        "sents": [
          6,
          7
        ],
        "title": "吃蛋糕收礼物"
      }
    ],
    "scene": "宝宝过五岁生日",
    "when": "生日那天",
    "where": "家里",
    "who": "宝宝和家人"
  },
  "pc90": {
    "groups": [
      {
        "icon": "🚒",
        "sents": [
          0,
          2,
          5
        ],
        "title": "守护安全"
      },
      {
        "icon": "🌾",
        "sents": [
          1,
          3
        ],
        "title": "辛勤劳动"
      },
      {
        "icon": "👩‍⚕️",
        "sents": [
          4,
          6,
          7
        ],
        "title": "帮助他人"
      }
    ],
    "scene": "劳动节，认识各行各业的劳动者",
    "when": "劳动节",
    "where": "城市里",
    "who": "妈妈和宝宝"
  },
  "pc91": {
    "groups": [
      {
        "icon": "🌸",
        "sents": [
          0
        ],
        "title": "母亲节到了"
      },
      {
        "icon": "🤱",
        "sents": [
          1,
          2
        ],
        "title": "妈妈照顾我"
      },
      {
        "icon": "🎈",
        "sents": [
          3,
          4
        ],
        "title": "妈妈陪我玩"
      },
      {
        "icon": "💖",
        "sents": [
          5,
          6
        ],
        "title": "妈妈帮助我"
      },
      {
        "icon": "👑",
        "sents": [
          7
        ],
        "title": "最好的妈妈"
      }
    ],
    "scene": "母亲节，宝宝说说为什么爱妈妈",
    "when": "五月第二个星期天",
    "where": "家里",
    "who": "宝宝和妈妈"
  },
  "pc92": {
    "groups": [
      {
        "icon": "🎉",
        "sents": [
          0,
          1
        ],
        "title": "父亲节到了"
      },
      {
        "icon": "🏔️",
        "sents": [
          2,
          3
        ],
        "title": "父爱如山"
      },
      {
        "icon": "😄",
        "sents": [
          4,
          5
        ],
        "title": "爸爸陪伴我"
      },
      {
        "icon": "🦸",
        "sents": [
          6,
          7
        ],
        "title": "我的超级英雄"
      }
    ],
    "scene": "父亲节，宝宝说说为什么爱爸爸",
    "when": "六月第三个星期日",
    "where": "家里",
    "who": "宝宝和爸爸"
  },
  "pc93": {
    "groups": [
      {
        "icon": "🎈",
        "sents": [
          0,
          1,
          2
        ],
        "title": "儿童节到了"
      },
      {
        "icon": "🏫",
        "sents": [
          3,
          4
        ],
        "title": "学校庆祝"
      },
      {
        "icon": "👗",
        "sents": [
          5
        ],
        "title": "穿新衣"
      },
      {
        "icon": "🍬",
        "sents": [
          6,
          7
        ],
        "title": "美食和礼物"
      }
    ],
    "scene": "六一儿童节，孩子们开心庆祝",
    "when": "六月一日",
    "where": "学校和家里",
    "who": "孩子们"
  },
  "pc94": {
    "groups": [
      {
        "icon": "📅",
        "sents": [
          0,
          1
        ],
        "title": "端午节到了"
      },
      {
        "icon": "🍙",
        "sents": [
          2
        ],
        "title": "吃粽子"
      },
      {
        "icon": "🎉",
        "sents": [
          3,
          4
        ],
        "title": "民俗活动"
      },
      {
        "icon": "🌿",
        "sents": [
          5,
          6,
          7
        ],
        "title": "驱邪祈福"
      }
    ],
    "scene": "端午节，吃粽子赛龙舟",
    "when": "农历五月初五",
    "where": "家里和江边",
    "who": "一家人"
  },
  "pc95": {
    "groups": [
      {
        "icon": "🫧",
        "sents": [
          0,
          1
        ],
        "title": "提前准备"
      },
      {
        "icon": "🌿",
        "sents": [
          2
        ],
        "title": "卷叶成筒"
      },
      {
        "icon": "🍚",
        "sents": [
          3
        ],
        "title": "装米压实"
      },
      {
        "icon": "🎀",
        "sents": [
          4,
          5
        ],
        "title": "包好系紧"
      },
      {
        "icon": "🍲",
        "sents": [
          6,
          7
        ],
        "title": "煮熟享用"
      }
    ],
    "scene": "端午节，妈妈和宝宝一起包粽子",
    "when": "端午节前",
    "where": "家里厨房",
    "who": "妈妈和宝宝"
  },
  "pc96": {
    "groups": [
      {
        "icon": "🌕",
        "sents": [
          0,
          1
        ],
        "title": "中秋节到了"
      },
      {
        "icon": "🥮",
        "sents": [
          2,
          3
        ],
        "title": "团圆吃饭"
      },
      {
        "icon": "🌙",
        "sents": [
          4,
          5
        ],
        "title": "赏月点灯"
      },
      {
        "icon": "🍶",
        "sents": [
          6,
          7
        ],
        "title": "习俗故事"
      }
    ],
    "scene": "中秋节，一家人团圆赏月",
    "when": "农历八月十五",
    "where": "家里",
    "who": "一家人"
  },
  "pc97": {
    "groups": [
      {
        "icon": "🌕",
        "sents": [
          0,
          1
        ],
        "title": "看月亮"
      },
      {
        "icon": "🌙",
        "sents": [
          2,
          3,
          4
        ],
        "title": "月相变化"
      },
      {
        "icon": "🌍",
        "sents": [
          5
        ],
        "title": "月亮绕地球"
      },
      {
        "icon": "🐰",
        "sents": [
          6,
          7
        ],
        "title": "玉兔和诗"
      }
    ],
    "scene": "中秋夜，妈妈和宝宝一起赏月",
    "when": "中秋节晚上",
    "where": "户外",
    "who": "妈妈和宝宝"
  },
  "pc98": {
    "groups": [
      {
        "icon": "🎄",
        "sents": [
          0,
          1
        ],
        "title": "圣诞节到了"
      },
      {
        "icon": "✨",
        "sents": [
          2,
          3
        ],
        "title": "装饰圣诞树"
      },
      {
        "icon": "🎅",
        "sents": [
          4,
          5,
          6
        ],
        "title": "圣诞老人"
      },
      {
        "icon": "🦃",
        "sents": [
          7
        ],
        "title": "圣诞大餐"
      }
    ],
    "scene": "圣诞节，装扮圣诞树等圣诞老人",
    "when": "十二月二十五日",
    "where": "家里",
    "who": "一家人"
  },
  "pc99": {
    "groups": [
      {
        "icon": "🧹",
        "sents": [
          0,
          1
        ],
        "title": "年前准备"
      },
      {
        "icon": "🍲",
        "sents": [
          2,
          3
        ],
        "title": "除夕团圆"
      },
      {
        "icon": "🧧",
        "sents": [
          4,
          5
        ],
        "title": "红包鞭炮"
      },
      {
        "icon": "🎉",
        "sents": [
          6,
          7
        ],
        "title": "拜年庆祝"
      }
    ],
    "scene": "春节，一家人团圆过大年",
    "when": "春节期间",
    "where": "家里",
    "who": "一家人"
  },
  "vc01": {
    "groups": [
      {
        "icon": "🍲",
        "sents": [
          0,
          3,
          4
        ],
        "title": "煮锅和锅盖"
      },
      {
        "icon": "🍳",
        "sents": [
          1,
          2
        ],
        "title": "煎和炒"
      },
      {
        "icon": "♨️",
        "sents": [
          5,
          6
        ],
        "title": "蒸和烤"
      }
    ],
    "scene": "厨房里做饭用的各种锅具",
    "when": "",
    "where": "厨房",
    "who": "妈妈和爸爸"
  },
  "vc02": {
    "groups": [
      {
        "icon": "🍚",
        "sents": [
          0,
          1
        ],
        "title": "盛饭菜"
      },
      {
        "icon": "🥢",
        "sents": [
          2,
          3,
          4,
          5
        ],
        "title": "吃饭工具"
      },
      {
        "icon": "🥤",
        "sents": [
          6,
          7,
          8
        ],
        "title": "喝水杯子"
      },
      {
        "icon": "🧻",
        "sents": [
          9
        ],
        "title": "擦嘴"
      }
    ],
    "scene": "餐桌上吃饭用的各种餐具",
    "when": "",
    "where": "餐厅",
    "who": "一家人"
  },
  "vc03": {
    "groups": [
      {
        "icon": "🔪",
        "sents": [
          0,
          4,
          8
        ],
        "title": "切削擦"
      },
      {
        "icon": "🥣",
        "sents": [
          3,
          5
        ],
        "title": "洗菜打蛋"
      },
      {
        "icon": "🍳",
        "sents": [
          1,
          2,
          7
        ],
        "title": "炒菜盛菜"
      },
      {
        "icon": "🍜",
        "sents": [
          6,
          9
        ],
        "title": "做面条"
      }
    ],
    "scene": "厨房里做饭用的各种小工具",
    "when": "",
    "where": "厨房",
    "who": "妈妈"
  },
  "vc04": {
    "groups": [
      {
        "icon": "🧂",
        "sents": [
          0,
          2,
          12
        ],
        "title": "咸味调料"
      },
      {
        "icon": "🍯",
        "sents": [
          1,
          10
        ],
        "title": "甜味调料"
      },
      {
        "icon": "🫗",
        "sents": [
          4,
          5,
          6,
          11
        ],
        "title": "油脂类"
      },
      {
        "icon": "🌶️",
        "sents": [
          3,
          7,
          8,
          9
        ],
        "title": "酸辣酱料"
      }
    ],
    "scene": "做饭时调味用的各种调料",
    "when": "",
    "where": "厨房",
    "who": ""
  },
  "vc05": {
    "groups": [
      {
        "icon": "🥬",
        "sents": [
          3,
          15,
          16,
          17
        ],
        "title": "叶菜类"
      },
      {
        "icon": "🥕",
        "sents": [
          1,
          2,
          8,
          9,
          18,
          19
        ],
        "title": "根茎类"
      },
      {
        "icon": "🍅",
        "sents": [
          0,
          6,
          7,
          11,
          12,
          13,
          14
        ],
        "title": "瓜果豆类"
      },
      {
        "icon": "🥦",
        "sents": [
          4,
          5,
          10
        ],
        "title": "花菜菌菇"
      }
    ],
    "scene": "餐桌上常见的各种蔬菜",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc06": {
    "groups": [
      {
        "icon": "🍓",
        "sents": [
          3,
          4,
          11,
          14
        ],
        "title": "浆果小果"
      },
      {
        "icon": "🍌",
        "sents": [
          1,
          2,
          8,
          12
        ],
        "title": "剥皮水果"
      },
      {
        "icon": "🍉",
        "sents": [
          0,
          5,
          6,
          7,
          13
        ],
        "title": "大个水果"
      },
      {
        "icon": "🍋",
        "sents": [
          9,
          10
        ],
        "title": "酸甜水果"
      }
    ],
    "scene": "水果摊和餐桌上的各种水果",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc07": {
    "groups": [
      {
        "icon": "🍚",
        "sents": [
          0,
          1,
          6
        ],
        "title": "米饭面条"
      },
      {
        "icon": "🥟",
        "sents": [
          3,
          4,
          5,
          8,
          9
        ],
        "title": "面食点心"
      },
      {
        "icon": "🍞",
        "sents": [
          2,
          7
        ],
        "title": "面包麦片"
      }
    ],
    "scene": "每天吃的各种主食",
    "when": "",
    "where": "餐厅",
    "who": "一家人"
  },
  "vc08": {
    "groups": [
      {
        "icon": "🥩",
        "sents": [
          0,
          1,
          2,
          3
        ],
        "title": "畜禽肉"
      },
      {
        "icon": "🐟",
        "sents": [
          4,
          5,
          6
        ],
        "title": "海鲜"
      },
      {
        "icon": "🥚",
        "sents": [
          7,
          8,
          9,
          10
        ],
        "title": "蛋和加工肉"
      }
    ],
    "scene": "餐桌上的肉、蛋和海鲜",
    "when": "",
    "where": "餐厅",
    "who": ""
  },
  "vc09": {
    "groups": [
      {
        "icon": "🥛",
        "sents": [
          0,
          3,
          10
        ],
        "title": "奶制品"
      },
      {
        "icon": "🥤",
        "sents": [
          1,
          2,
          4
        ],
        "title": "饮品"
      },
      {
        "icon": "🍪",
        "sents": [
          5,
          6,
          7,
          8,
          9,
          12
        ],
        "title": "甜零食"
      },
      {
        "icon": "🍿",
        "sents": [
          11
        ],
        "title": "电影小吃"
      }
    ],
    "scene": "平时喝的饮品和吃的零食",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc10": {
    "groups": [
      {
        "icon": "🛋️",
        "sents": [
          0,
          4,
          5,
          8
        ],
        "title": "活动房间"
      },
      {
        "icon": "🛏️",
        "sents": [
          1,
          6
        ],
        "title": "睡觉的房间"
      },
      {
        "icon": "🍳",
        "sents": [
          2,
          3,
          11
        ],
        "title": "家务房间"
      },
      {
        "icon": "🚪",
        "sents": [
          7,
          9,
          10
        ],
        "title": "其他空间"
      }
    ],
    "scene": "家里的各个房间",
    "when": "",
    "where": "家里",
    "who": "一家人"
  },
  "vc11": {
    "groups": [
      {
        "icon": "🛋️",
        "sents": [
          0,
          8
        ],
        "title": "坐着休息"
      },
      {
        "icon": "🪑",
        "sents": [
          1,
          2,
          3
        ],
        "title": "置物家具"
      },
      {
        "icon": "💡",
        "sents": [
          4,
          5,
          6,
          7
        ],
        "title": "装饰布置"
      }
    ],
    "scene": "客厅里的各种家具",
    "when": "",
    "where": "客厅",
    "who": ""
  },
  "vc12": {
    "groups": [
      {
        "icon": "🛏️",
        "sents": [
          0,
          1,
          2,
          3,
          9
        ],
        "title": "睡觉用品"
      },
      {
        "icon": "👗",
        "sents": [
          4,
          5,
          10
        ],
        "title": "收纳家具"
      },
      {
        "icon": "🪞",
        "sents": [
          6,
          7,
          8
        ],
        "title": "学习和梳妆"
      }
    ],
    "scene": "卧室里的各种家具",
    "when": "",
    "where": "卧室",
    "who": ""
  },
  "vc13": {
    "groups": [
      {
        "icon": "🍽️",
        "sents": [
          0
        ],
        "title": "吃饭的桌子"
      },
      {
        "icon": "🪑",
        "sents": [
          1,
          4
        ],
        "title": "宝宝座椅"
      },
      {
        "icon": "🧺",
        "sents": [
          2,
          3
        ],
        "title": "桌布餐垫"
      }
    ],
    "scene": "餐厅里吃饭用的家具",
    "when": "",
    "where": "餐厅",
    "who": "一家人"
  },
  "vc14": {
    "groups": [
      {
        "icon": "🛁",
        "sents": [
          0,
          1,
          4,
          8
        ],
        "title": "洗澡用品"
      },
      {
        "icon": "🚽",
        "sents": [
          2,
          9
        ],
        "title": "上厕所"
      },
      {
        "icon": "🪥",
        "sents": [
          3,
          5,
          6,
          7
        ],
        "title": "洗手刷牙"
      }
    ],
    "scene": "浴室里洗漱用的各种用品",
    "when": "",
    "where": "浴室",
    "who": ""
  },
  "vc15": {
    "groups": [
      {
        "icon": "🧊",
        "sents": [
          0
        ],
        "title": "保存食物"
      },
      {
        "icon": "🔥",
        "sents": [
          1,
          2,
          3,
          6
        ],
        "title": "加热做饭"
      },
      {
        "icon": "🥤",
        "sents": [
          4,
          5
        ],
        "title": "榨汁烧水"
      },
      {
        "icon": "🍽️",
        "sents": [
          7
        ],
        "title": "洗碗"
      }
    ],
    "scene": "厨房里的各种电器",
    "when": "",
    "where": "厨房",
    "who": ""
  },
  "vc16": {
    "groups": [
      {
        "icon": "🌡️",
        "sents": [
          0,
          5,
          6
        ],
        "title": "冷热调节"
      },
      {
        "icon": "🧹",
        "sents": [
          2,
          3,
          4
        ],
        "title": "打扫清洁"
      },
      {
        "icon": "💻",
        "sents": [
          1,
          8,
          9,
          10
        ],
        "title": "电子产品"
      },
      {
        "icon": "💇",
        "sents": [
          7
        ],
        "title": "吹干头发"
      }
    ],
    "scene": "家里的各种电器",
    "when": "",
    "where": "家里",
    "who": ""
  },
  "vc17": {
    "groups": [
      {
        "icon": "🐶",
        "sents": [
          0,
          1,
          2,
          3
        ],
        "title": "猫猫狗狗"
      },
      {
        "icon": "🐦",
        "sents": [
          4,
          9
        ],
        "title": "会飞的鸟"
      },
      {
        "icon": "🐟",
        "sents": [
          5
        ],
        "title": "水里游"
      },
      {
        "icon": "🐰",
        "sents": [
          6,
          7,
          8
        ],
        "title": "小小宠物"
      }
    ],
    "scene": "家里养的各种小宠物",
    "when": "",
    "where": "家里",
    "who": ""
  },
  "vc18": {
    "groups": [
      {
        "icon": "🐄",
        "sents": [
          0,
          1,
          2,
          3,
          4,
          9
        ],
        "title": "农场牲畜"
      },
      {
        "icon": "🦆",
        "sents": [
          5,
          6,
          7,
          8
        ],
        "title": "家禽"
      }
    ],
    "scene": "农场里的各种动物",
    "when": "",
    "where": "农场",
    "who": ""
  },
  "vc19": {
    "groups": [
      {
        "icon": "🦁",
        "sents": [
          0,
          1,
          5,
          10,
          11
        ],
        "title": "食肉动物"
      },
      {
        "icon": "🦒",
        "sents": [
          2,
          6,
          7
        ],
        "title": "草原动物"
      },
      {
        "icon": "🐼",
        "sents": [
          3,
          4,
          12
        ],
        "title": "森林动物"
      },
      {
        "icon": "🐧",
        "sents": [
          8,
          9
        ],
        "title": "南半球动物"
      }
    ],
    "scene": "动物园和野外的各种野生动物",
    "when": "",
    "where": "动物园",
    "who": ""
  },
  "vc20": {
    "groups": [
      {
        "icon": "🐭",
        "sents": [
          0,
          1,
          2,
          9
        ],
        "title": "小小动物"
      },
      {
        "icon": "🦋",
        "sents": [
          3,
          4
        ],
        "title": "会飞的昆虫"
      },
      {
        "icon": "🐜",
        "sents": [
          5,
          6,
          7,
          8
        ],
        "title": "爬来爬去"
      }
    ],
    "scene": "花园和草丛里的小动物和昆虫",
    "when": "",
    "where": "花园",
    "who": ""
  },
  "vc21": {
    "groups": [
      {
        "icon": "⭕",
        "sents": [
          0,
          6
        ],
        "title": "圆圆的"
      },
      {
        "icon": "🔷",
        "sents": [
          1,
          2,
          3,
          7
        ],
        "title": "直边形状"
      },
      {
        "icon": "⭐",
        "sents": [
          4,
          5,
          8
        ],
        "title": "特别形状"
      }
    ],
    "scene": "生活中常见的各种形状",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc22": {
    "groups": [
      {
        "icon": "🌈",
        "sents": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "title": "彩虹颜色"
      },
      {
        "icon": "✨",
        "sents": [
          6,
          8,
          11
        ],
        "title": "亮亮的颜色"
      },
      {
        "icon": "⬛",
        "sents": [
          7,
          9,
          10
        ],
        "title": "深深的颜色"
      }
    ],
    "scene": "生活中常见的各种颜色",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc23": {
    "groups": [
      {
        "icon": "👕",
        "sents": [
          0,
          1,
          5,
          6
        ],
        "title": "日常上衣"
      },
      {
        "icon": "🧥",
        "sents": [
          2,
          3,
          4
        ],
        "title": "保暖外套"
      },
      {
        "icon": "👗",
        "sents": [
          7
        ],
        "title": "漂亮裙子"
      }
    ],
    "scene": "穿在上身的各种衣服",
    "when": "",
    "where": "",
    "who": "一家人"
  },
  "vc24": {
    "groups": [
      {
        "icon": "👖",
        "sents": [
          0,
          1,
          2,
          3
        ],
        "title": "裤子裙子"
      },
      {
        "icon": "🧦",
        "sents": [
          4,
          5
        ],
        "title": "袜子和鞋"
      },
      {
        "icon": "👟",
        "sents": [
          6,
          7,
          8,
          9
        ],
        "title": "各种鞋子"
      }
    ],
    "scene": "穿在下身的裤子裙子和鞋袜",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc25": {
    "groups": [
      {
        "icon": "🧢",
        "sents": [
          0,
          1,
          8
        ],
        "title": "戴在头上"
      },
      {
        "icon": "🧤",
        "sents": [
          2,
          3
        ],
        "title": "保暖用品"
      },
      {
        "icon": "🌧️",
        "sents": [
          5,
          6
        ],
        "title": "雨天出门"
      },
      {
        "icon": "🎒",
        "sents": [
          4,
          7
        ],
        "title": "睡觉和上学"
      }
    ],
    "scene": "出门和日常用的各种配饰",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc26": {
    "groups": [
      {
        "icon": "👤",
        "sents": [
          0,
          1,
          2
        ],
        "title": "头和脸"
      },
      {
        "icon": "👀",
        "sents": [
          3,
          4,
          6
        ],
        "title": "看听闻"
      },
      {
        "icon": "👄",
        "sents": [
          5,
          7,
          8
        ],
        "title": "嘴和牙齿"
      },
      {
        "icon": "😊",
        "sents": [
          9,
          10,
          11
        ],
        "title": "脸的部位"
      }
    ],
    "scene": "头上的各个部位",
    "when": "",
    "where": "身体",
    "who": "宝宝"
  },
  "vc27": {
    "groups": [
      {
        "icon": "💪",
        "sents": [
          1,
          2,
          3,
          4,
          11
        ],
        "title": "手臂和手"
      },
      {
        "icon": "🦵",
        "sents": [
          5,
          6,
          7,
          8
        ],
        "title": "腿和脚"
      },
      {
        "icon": "🧍",
        "sents": [
          0,
          9,
          10
        ],
        "title": "身体躯干"
      }
    ],
    "scene": "身体上的各个部位",
    "when": "",
    "where": "身体",
    "who": "宝宝"
  },
  "vc28": {
    "groups": [
      {
        "icon": "🚗",
        "sents": [
          0,
          1,
          2,
          5
        ],
        "title": "日常出行"
      },
      {
        "icon": "🚆",
        "sents": [
          3,
          4
        ],
        "title": "轨道交通"
      },
      {
        "icon": "🚚",
        "sents": [
          6,
          7
        ],
        "title": "大车快车"
      },
      {
        "icon": "🚨",
        "sents": [
          8,
          9,
          10
        ],
        "title": "特种车辆"
      }
    ],
    "scene": "马路上跑的各种陆地交通工具",
    "when": "",
    "where": "马路",
    "who": ""
  },
  "vc29": {
    "groups": [
      {
        "icon": "✈️",
        "sents": [
          0,
          1,
          4
        ],
        "title": "天上飞"
      },
      {
        "icon": "🚢",
        "sents": [
          2,
          3
        ],
        "title": "水里游"
      }
    ],
    "scene": "天上飞的和水里航行的交通工具",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc30": {
    "groups": [
      {
        "icon": "🧸",
        "sents": [
          1,
          2
        ],
        "title": "抱抱玩具"
      },
      {
        "icon": "🧩",
        "sents": [
          3,
          4,
          8
        ],
        "title": "动手益智"
      },
      {
        "icon": "⚽",
        "sents": [
          0,
          7,
          9,
          10
        ],
        "title": "户外游乐"
      },
      {
        "icon": "🎈",
        "sents": [
          5,
          6,
          11
        ],
        "title": "飘在空中"
      }
    ],
    "scene": "宝宝常玩的各种玩具",
    "when": "",
    "where": "",
    "who": "宝宝"
  },
  "vc31": {
    "groups": [
      {
        "icon": "📚",
        "sents": [
          0,
          1
        ],
        "title": "看的书"
      },
      {
        "icon": "✏️",
        "sents": [
          2,
          3,
          4,
          5
        ],
        "title": "写字画画"
      },
      {
        "icon": "✂️",
        "sents": [
          6,
          9,
          10
        ],
        "title": "动手工具"
      },
      {
        "icon": "🎒",
        "sents": [
          7,
          8
        ],
        "title": "上学用品"
      }
    ],
    "scene": "学习时用的各种文具",
    "when": "",
    "where": "",
    "who": "宝宝"
  },
  "vc32": {
    "groups": [
      {
        "icon": "👶",
        "sents": [
          0,
          1,
          2
        ],
        "title": "宝宝用品"
      },
      {
        "icon": "🧻",
        "sents": [
          3,
          4
        ],
        "title": "擦擦干净"
      },
      {
        "icon": "💅",
        "sents": [
          5,
          6,
          7,
          8
        ],
        "title": "日常护理"
      },
      {
        "icon": "🌡️",
        "sents": [
          9
        ],
        "title": "量体温"
      }
    ],
    "scene": "照顾宝宝日常洗漱和护理用的小东西",
    "when": "",
    "where": "家里",
    "who": "宝宝"
  },
  "vc33": {
    "groups": [
      {
        "icon": "🚪",
        "sents": [
          1,
          2,
          3,
          4,
          5
        ],
        "title": "房子的部分"
      },
      {
        "icon": "🕐",
        "sents": [
          6,
          7
        ],
        "title": "看时间"
      },
      {
        "icon": "🔌",
        "sents": [
          8,
          10,
          13,
          14
        ],
        "title": "用电小物"
      },
      {
        "icon": "🗑️",
        "sents": [
          0,
          9,
          11,
          12
        ],
        "title": "日常小物"
      }
    ],
    "scene": "家里常见的各种小东西",
    "when": "",
    "where": "家里",
    "who": ""
  },
  "vc34": {
    "groups": [
      {
        "icon": "☀️",
        "sents": [
          0,
          1,
          2,
          3,
          6
        ],
        "title": "天上的"
      },
      {
        "icon": "🌧️",
        "sents": [
          4,
          5
        ],
        "title": "雨和雪"
      },
      {
        "icon": "🌳",
        "sents": [
          7,
          8,
          9,
          10
        ],
        "title": "植物"
      },
      {
        "icon": "🏔️",
        "sents": [
          11,
          12,
          13,
          14,
          15
        ],
        "title": "山水大地"
      }
    ],
    "scene": "大自然里的太阳月亮、花草和山水",
    "when": "",
    "where": "户外",
    "who": ""
  },
  "vc35": {
    "groups": [
      {
        "icon": "☀️",
        "sents": [
          0,
          2
        ],
        "title": "晴和多云"
      },
      {
        "icon": "🌧️",
        "sents": [
          1,
          3,
          4
        ],
        "title": "雨雪风"
      },
      {
        "icon": "🌡️",
        "sents": [
          5,
          6,
          7,
          8
        ],
        "title": "冷热感觉"
      }
    ],
    "scene": "每天不同的天气",
    "when": "",
    "where": "户外",
    "who": ""
  },
  "vc36": {
    "groups": [
      {
        "icon": "1️⃣",
        "sents": [
          0,
          1,
          2
        ],
        "title": "一二三"
      },
      {
        "icon": "4️⃣",
        "sents": [
          3,
          4,
          5
        ],
        "title": "四五六"
      },
      {
        "icon": "7️⃣",
        "sents": [
          6,
          7,
          8,
          9
        ],
        "title": "七八九十"
      }
    ],
    "scene": "从一数到十",
    "when": "",
    "where": "",
    "who": ""
  },
  "vc37": {
    "groups": [
      {
        "icon": "🌅",
        "sents": [
          0,
          1,
          2,
          3
        ],
        "title": "一天的时间"
      },
      {
        "icon": "📅",
        "sents": [
          4,
          5,
          6
        ],
        "title": "今明昨天"
      },
      {
        "icon": "🗓️",
        "sents": [
          7,
          8,
          9,
          10,
          11,
          12,
          13
        ],
        "title": "星期一到日"
      }
    ],
    "scene": "一天的时间和一周的星期",
    "when": "",
    "where": "",
    "who": ""
  }
};
