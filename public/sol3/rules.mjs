// Original transcription/segmentation of public-domain Qing text, not a daily database.
// Only the principal name's direct clauses are included. Conditions/associated gods
// are deliberately NOT merged. These hits are never the day's final recommendations.
export const RULE_VERSION = 'sol3-jianchu-evidence-1';
export const SOURCE = 'https://zh.wikisource.org/wiki/欽定協紀辨方書_(四庫全書本)/卷10';
const rows = [
  ['建', '施恩封拜 詔命公卿 招賢 舉正直 行幸遣使 上官赴任 臨政親民', '祈福 求嗣 上册進表章 結婚姻 納采問名 解除 整容剃頭 整手足甲 求醫療病 營建宮室 修宫室 繕城郭 興造動土 豎柱上梁 修倉庫 開倉庫 出貨財 修置產室 破屋壞垣 伐木 栽種 破土 安葬 啟攢'],
  ['除', '解除 沐浴 整容剃頭 整手足甲 求醫療病 掃舍宇', ''],
  ['满', '進人口 裁製 修倉庫 經絡 開市 立劵交易 納財 開倉庫 出貨財 補垣 塞穴', '施恩封拜 詔命公卿 招賢 舉正直 上官赴任 臨政親民 結婚姻 納采問名 求醫療病'],
  ['平', '修飾垣墻 平治道塗', '祈福 求嗣 上册進表章 頒詔 施恩封拜 詔命公卿 招賢 舉正直 宣布政事 慶賜賞賀 宴㑹 冠帶 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 安牀 解除 求醫療病 裁製 營建宮室 修宮室 繕城郭 築隄防 興造動土 豎柱上梁 修倉庫 鼓鑄 經絡 醞釀 開市 立劵交易 納財 開倉庫 出貨財 修置產室 開渠穿井 栽種 牧養 納畜 破土 安葬 啟攢'],
  ['定', '冠帶', ''],
  ['执', '捕捉', ''],
  ['破', '求醫療病 破屋壞垣', '祈福 求嗣 上册進表章 頒詔 施恩封拜 詔命公卿 招賢 舉正直 宣布政事 慶賜賞賀 宴㑹 冠帶 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 安牀 整容剃頭 整手足甲 裁製 營建宫室 修宫室 繕城郭 築隄防 興造動土 豎柱上梁 修倉庫 鼓鑄 經絡 醞釀 開市 立劵交易 納財 開倉庫 出貨財 修置產室 開渠穿井 安碓磑 補垣 塞穴 修飾垣墻 伐木 栽種 牧養 納畜 破土 安葬 啟攢'],
  ['危', '安撫邊境 選將訓兵 安牀', ''],
  ['成', '入學 安撫邊境 般移 築隄防 開市', ''],
  ['收', '進人口 納財 捕捉 納畜', '祈福 求嗣 上册進表章 頒詔 施恩封拜 詔命公卿 招賢 舉正直 宣布政事 慶賜賞賀 宴㑹 冠帶 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 般移 安牀 解除 求醫療病 裁製 營建宫室 修宮室 繕城郭 築隄防 興造動土 豎柱上梁 鼓鑄 經絡 醞釀 開市 立劵交易 開倉庫 出貨財 修置產室 開渠穿井 破土 安葬 啟攢'],
  ['开', '祭祀 祈福 求嗣 上册進表章 頒詔 覃恩 肆赦 施恩封拜 詔命公卿 招賢 舉正直 施恩惠 恤孤惸 宣政事 行惠愛 雪寃枉 緩刑獄 慶賜賞賀 宴㑹 入學 行幸遣使 上官赴任 臨政親民 般移 解除 求醫療病 裁製 修宮室 繕城郭 興造動土 豎柱上梁 開市 修置產室 開渠穿井 安碓磑 栽種 牧養', '伐木 畋獵 取魚 破土 安葬 啓攢'],
  ['闭', '築隄防 補垣 塞穴', '上册進表章 頒詔 施恩封拜 詔命公卿 招賢 舉正直 宣布政事 慶賜賞賀 宴㑹 行幸遣使 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 安牀 營建宫室 修宮室 興造動土 豎柱上梁 開市 開倉庫 出貨財 修置產室 開渠穿井'],
];
export const OFFICERS = Object.freeze(rows.map(row => row[0]));
export const RULES = Object.freeze(rows.map(([officer, yi, ji], index) => Object.freeze({
  ruleId: `jx10-officer-${index}`, officer,
  // A missing direct ji clause is unknown, never a claim of no prohibitions.
  directYi: Object.freeze(yi.split(' ')), directJi: ji ? Object.freeze(ji.split(' ')) : null,
  source: SOURCE, sourceSection: `${officer}日`,
  transcriptionWarnings: Object.freeze(officer==='闭'?['闭日忌在线转录有“求醫療目”疑字；该词尚未纳入，未静默改字。']:[]),
  scope: 'principal-officer-direct-clause-only',
})));
