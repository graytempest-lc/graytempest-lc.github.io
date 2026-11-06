const freeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
// Independently mapped from public-domain volume 10. Conditional contexts only.
export const GRADE_ROWS = freeze([
  {
    "id": "grade-01",
    "root": "平日",
    "monthBranches": [
      "亥"
    ],
    "grade": 0,
    "reliefAny": [],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 389
  },
  {
    "id": "grade-02",
    "root": "平日",
    "monthBranches": [
      "申"
    ],
    "grade": 2,
    "reliefAny": [
      "天德",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 389
  },
  {
    "id": "grade-03",
    "root": "平日",
    "monthBranches": [
      "卯",
      "酉"
    ],
    "grade": 3,
    "reliefAny": [
      "月德"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 389
  },
  {
    "id": "grade-04",
    "root": "平日",
    "monthBranches": [
      "午"
    ],
    "grade": 3,
    "reliefAny": [
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 389
  },
  {
    "id": "grade-05",
    "root": "平日",
    "monthBranches": [
      "寅",
      "巳",
      "子"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月刑",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 389
  },
  {
    "id": "grade-06",
    "root": "平日",
    "monthBranches": [
      "辰",
      "戌",
      "丑",
      "未"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月煞",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 389
  },
  {
    "id": "grade-07",
    "root": "收日",
    "monthBranches": [
      "寅",
      "申",
      "巳",
      "亥"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "刼煞",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 393
  },
  {
    "id": "grade-08",
    "root": "收日",
    "monthBranches": [
      "子",
      "午"
    ],
    "grade": 3,
    "reliefAny": [
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 393
  },
  {
    "id": "grade-09",
    "root": "收日",
    "monthBranches": [
      "酉"
    ],
    "grade": 3,
    "reliefAny": [
      "月德"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 393
  },
  {
    "id": "grade-10",
    "root": "收日",
    "monthBranches": [
      "卯",
      "丑",
      "戌"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月刑",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 393
  },
  {
    "id": "grade-11",
    "root": "收日",
    "monthBranches": [
      "辰",
      "未"
    ],
    "grade": 2,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 393
  },
  {
    "id": "grade-12",
    "root": "閉日",
    "monthBranches": [
      "子",
      "午",
      "卯",
      "酉",
      "辰",
      "戌",
      "丑",
      "未"
    ],
    "grade": 3,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合",
      "天赦",
      "天願"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 402
  },
  {
    "id": "grade-13",
    "root": "閉日",
    "monthBranches": [
      "寅",
      "申",
      "巳",
      "亥"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月煞",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 402
  },
  {
    "id": "grade-14",
    "root": "刼煞",
    "monthBranches": [
      "寅",
      "申"
    ],
    "grade": 0,
    "reliefAny": [],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 406
  },
  {
    "id": "grade-15",
    "root": "刼煞",
    "monthBranches": [
      "巳",
      "亥"
    ],
    "grade": 2,
    "reliefAny": [
      "月德",
      "天德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 406
  },
  {
    "id": "grade-16",
    "root": "刼煞",
    "monthBranches": [
      "辰",
      "戌",
      "丑",
      "未"
    ],
    "grade": 1,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 406
  },
  {
    "id": "grade-17",
    "root": "刼煞",
    "monthBranches": [
      "子",
      "午",
      "卯",
      "酉"
    ],
    "grade": 3,
    "reliefAny": [
      "月德",
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 406
  },
  {
    "id": "grade-18",
    "root": "災煞",
    "monthBranches": [
      "寅",
      "申",
      "巳",
      "亥"
    ],
    "grade": 1,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 411
  },
  {
    "id": "grade-19",
    "root": "災煞",
    "monthBranches": [
      "辰",
      "戌",
      "丑",
      "未"
    ],
    "grade": 2,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 411
  },
  {
    "id": "grade-20",
    "root": "災煞",
    "monthBranches": [
      "子",
      "午",
      "卯",
      "酉"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月破",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 411
  },
  {
    "id": "grade-21",
    "root": "月煞",
    "monthBranches": [
      "卯",
      "酉"
    ],
    "grade": 1,
    "reliefAny": [
      "月德",
      "天願"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 416
  },
  {
    "id": "grade-22",
    "root": "月煞",
    "monthBranches": [
      "子",
      "午"
    ],
    "grade": 3,
    "reliefAny": [
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 416
  },
  {
    "id": "grade-23",
    "root": "月煞",
    "monthBranches": [
      "寅",
      "申",
      "巳",
      "亥",
      "辰",
      "戌",
      "丑",
      "未"
    ],
    "grade": 4,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 416
  },
  {
    "id": "grade-24",
    "root": "月刑",
    "monthBranches": [
      "巳"
    ],
    "grade": 1,
    "reliefAny": [
      "月德",
      "天德合",
      "天願"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 420
  },
  {
    "id": "grade-25",
    "root": "月刑",
    "monthBranches": [
      "寅",
      "辰",
      "酉",
      "亥",
      "丑",
      "戌"
    ],
    "grade": 3,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 420
  },
  {
    "id": "grade-26",
    "root": "月刑",
    "monthBranches": [
      "子",
      "卯",
      "未",
      "申"
    ],
    "grade": 4,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 420
  },
  {
    "id": "grade-27",
    "root": "月刑",
    "monthBranches": [
      "午"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月厭",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 420
  },
  {
    "id": "grade-28",
    "root": "月害",
    "monthBranches": [
      "卯",
      "酉",
      "丑",
      "未"
    ],
    "grade": 2,
    "reliefAny": [
      "天德",
      "月德"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 423
  },
  {
    "id": "grade-29",
    "root": "月害",
    "monthBranches": [
      "辰",
      "戌"
    ],
    "grade": 3,
    "reliefAny": [
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 423
  },
  {
    "id": "grade-30",
    "root": "月害",
    "monthBranches": [
      "子",
      "午"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月煞",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 423
  },
  {
    "id": "grade-31",
    "root": "月害",
    "monthBranches": [
      "巳",
      "亥"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "刼煞",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 423
  },
  {
    "id": "grade-32",
    "root": "月害",
    "monthBranches": [
      "寅"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月刑",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 423
  },
  {
    "id": "grade-33",
    "root": "月害",
    "monthBranches": [
      "申"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "平日",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 423
  },
  {
    "id": "grade-34",
    "root": "月厭",
    "monthBranches": [
      "寅",
      "申",
      "丑",
      "未"
    ],
    "grade": 2,
    "reliefAny": [
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "行幸",
      "遣使",
      "安撫邊境",
      "選將訓兵",
      "出師",
      "上官赴任",
      "臨政親民",
      "結婚姻",
      "納采問名",
      "嫁娶",
      "求醫療病",
      "般移",
      "遠迴",
      "栽種"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 428
  },
  {
    "id": "grade-35",
    "root": "月厭",
    "monthBranches": [
      "辰",
      "戌",
      "巳",
      "亥"
    ],
    "grade": 3,
    "reliefAny": [
      "天德",
      "月德",
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 428
  },
  {
    "id": "grade-36",
    "root": "月厭",
    "monthBranches": [
      "子",
      "午"
    ],
    "grade": 4,
    "reliefAny": [
      "天赦"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 428
  },
  {
    "id": "grade-37",
    "root": "月厭",
    "monthBranches": [
      "卯",
      "酉"
    ],
    "grade": 5,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 428
  },
  {
    "id": "grade-38",
    "root": "大時",
    "monthBranches": [
      "寅",
      "申",
      "巳",
      "亥",
      "辰",
      "戌"
    ],
    "grade": 0,
    "reliefAny": [],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 438
  },
  {
    "id": "grade-39",
    "root": "大時",
    "monthBranches": [
      "丑",
      "未"
    ],
    "grade": 2,
    "reliefAny": [
      "天德",
      "月德"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 438
  },
  {
    "id": "grade-40",
    "root": "大時",
    "monthBranches": [
      "子",
      "午"
    ],
    "grade": 3,
    "reliefAny": [
      "月德合"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 438
  },
  {
    "id": "grade-41",
    "root": "大時",
    "monthBranches": [
      "酉"
    ],
    "grade": 3,
    "reliefAny": [
      "月德"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 438
  },
  {
    "id": "grade-42",
    "root": "大時",
    "monthBranches": [
      "卯"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月刑",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 438
  },
  {
    "id": "grade-43",
    "root": "天吏",
    "monthBranches": [
      "寅",
      "申",
      "巳",
      "亥"
    ],
    "grade": 2,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合"
    ],
    "retainedWhenRelieved": [
      "安撫邊境",
      "選將訓兵",
      "出師",
      "求醫療病"
    ],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 446
  },
  {
    "id": "grade-44",
    "root": "天吏",
    "monthBranches": [
      "辰",
      "戌",
      "丑",
      "未"
    ],
    "grade": 3,
    "reliefAny": [
      "天德",
      "月德",
      "天德合",
      "月德合",
      "天赦",
      "天願"
    ],
    "retainedWhenRelieved": [],
    "redirectTo": null,
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 446
  },
  {
    "id": "grade-45",
    "root": "天吏",
    "monthBranches": [
      "午",
      "卯",
      "酉"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "平日",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 446
  },
  {
    "id": "grade-46",
    "root": "天吏",
    "monthBranches": [
      "子"
    ],
    "grade": null,
    "reliefAny": [],
    "retainedWhenRelieved": [],
    "redirectTo": "月刑",
    "source": "https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351",
    "sourceLine": 446
  }
]);
export const GRADE_POLICIES = freeze([{"grade": 0, "withoutRelief": "yi", "withRelief": "yi"}, {"grade": 1, "withoutRelief": "neutral", "withRelief": "yi"}, {"grade": 2, "withoutRelief": "ji", "withRelief": "yi"}, {"grade": 3, "withoutRelief": "ji", "withRelief": "neutral"}, {"grade": 4, "withoutRelief": "allForbidden", "withRelief": "ji"}, {"grade": 5, "withoutRelief": "allForbidden", "withRelief": "allForbidden"}]);
