/* 视频课数据 v2.7：vd01 五只小猴子（Super Simple Learning, Five Little Monkeys）。
   台词与时间点均逐帧核对烧录字幕：5fps 字幕带差分定位变化点，逐个边界用 -ss 直取帧前后确认，
   再以 0.1s 中点帧数值分类收窄到 0.1 秒。start = 首个出现该句字幕的 0.1s 采样点；
   end = 首个不再出现该句字幕的 0.1s 采样点。英文/中文按烧录字幕逐字转录（含第 4 句的引号）。 */
var VIDEO_LESSONS = [
  {
    id: "vd01",
    title: "五只小猴子",
    en: "Five Little Monkeys",
    type: "song",
    video: "videos/five-little-monkeys.mp4",
    duration: 129.4,
    cover: "cover-video.jpg",
    words: [
      {w: "five", cn: "五", seg: 0},
      {w: "four", cn: "四", seg: 4},
      {w: "three", cn: "三", seg: 8},
      {w: "two", cn: "二", seg: 12},
      {w: "one", cn: "一", seg: 16},
      {w: "monkey", cn: "猴子", seg: 16},
      {w: "monkeys", cn: "猴子们", seg: 0},
      {w: "little", cn: "小的", seg: 0},
      {w: "jumping", cn: "跳跃", seg: 0},
      {w: "bed", cn: "床", seg: 0},
      {w: "fell", cn: "掉下来", seg: 1},
      {w: "bumped", cn: "撞到", seg: 1},
      {w: "head", cn: "头", seg: 1},
      {w: "his", cn: "他的", seg: 1},
      {w: "her", cn: "她的", seg: 9},
      {w: "mama", cn: "妈妈", seg: 2},
      {w: "called", cn: "打电话叫", seg: 2},
      {w: "doctor", cn: "医生", seg: 2},
      {w: "said", cn: "说", seg: 2},
      {w: "no more", cn: "不再", seg: 3}
    ],
    segments: [
      {start: 16.3, end: 20.1, en: "Five little monkeys jumping on the bed.", cn: "五只小猴子在床上跳。", verse: 1},
      {start: 20.3, end: 24.0, en: "One fell off and bumped his head.", cn: "其中一人掉了下来，撞到了头。", verse: 1},
      {start: 24.3, end: 28.4, en: "Mama called the doctor and the doctor said,", cn: "妈妈打电话给医生，医生说，", verse: 1},
      {start: 28.6, end: 31.9, en: "\"No more monkeys jumping on the bed!\"", cn: "“不会再有猴子在床上跳了！”", verse: 1},
      {start: 38.5, end: 42.3, en: "Four little monkeys jumping on the bed.", cn: "四只小猴子在床上跳。", verse: 2},
      {start: 42.3, end: 46.3, en: "One fell off and bumped his head.", cn: "其中一人掉了下来，撞到了头。", verse: 2},
      {start: 46.5, end: 49.9, en: "Mama called the doctor and the doctor said,", cn: "妈妈打电话给医生，医生说，", verse: 2},
      {start: 50.1, end: 54.6, en: "\"No more monkeys jumping on the bed!\"", cn: "“不会再有猴子在床上跳了！”", verse: 2},
      {start: 60.2, end: 64.2, en: "Three little monkeys jumping on the bed.", cn: "三只小猴子在床上跳。", verse: 3},
      {start: 64.2, end: 68.6, en: "One fell off and bumped her head.", cn: "其中一个掉了下来，撞到了她的头。", verse: 3},
      {start: 68.6, end: 72.3, en: "Mama called the doctor and the doctor said,", cn: "妈妈打电话给医生，医生说，", verse: 3},
      {start: 72.5, end: 76.7, en: "\"No more monkeys jumping on the bed!\"", cn: "“不会再有猴子在床上跳了！”", verse: 3},
      {start: 82.6, end: 86.3, en: "Two monkeys jumping on the bed.", cn: "两只猴子在床上跳。", verse: 4},
      {start: 86.3, end: 90.4, en: "One fell off and bumped his head.", cn: "其中一人掉了下来，撞到了头。", verse: 4},
      {start: 90.6, end: 93.9, en: "Mama called the doctor and the doctor said,", cn: "妈妈打电话给医生，医生说，", verse: 4},
      {start: 94.4, end: 98.6, en: "\"No more monkeys jumping on the bed!\"", cn: "“不会再有猴子在床上跳了！”", verse: 4},
      {start: 104.5, end: 108.4, en: "One little monkey jumping on the bed.", cn: "一只小猴子在床上跳。", verse: 5},
      {start: 108.5, end: 112.1, en: "She fell off and bumped her head.", cn: "她从地上摔下来，撞到了头。", verse: 5},
      {start: 112.3, end: 116.1, en: "Mama called the doctor and the doctor said,", cn: "妈妈打电话给医生，医生说，", verse: 5},
      {start: 116.5, end: 119.7, en: "\"No more monkeys jumping on the bed!\"", cn: "“不会再有猴子在床上跳了！”", verse: 5}
    ]
  }
];
