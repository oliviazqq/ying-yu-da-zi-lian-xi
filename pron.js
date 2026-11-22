/* 发音分析 v2.3：给定英文句，返回每个词的音标、弱读、不发音字母、连读与失去爆破。
   依赖 dist/pron-data.js 的全局 PRON（ipa / silent / weak 三张表）。
   PRON 缺失或某词无音标时降级：该词无音标、无连读标记，其余照常，绝不抛错。
   规则全部按音标的首/末音素判断，不按字母判断（如 make 结尾字母是 e 但音是 /k/）。
   加载顺序：pron-data.js -> pron.js -> app.js。 */
var Pron = (function(){
  "use strict";
  /* 元音音素集（含双元音与 r 化元音） */
  var VOWELS = { "i":1, "ɪ":1, "eɪ":1, "ɛ":1, "æ":1, "ɑ":1, "ɔ":1, "oʊ":1,
    "ʊ":1, "u":1, "ʌ":1, "ə":1, "ɝ":1, "ɚ":1, "aɪ":1, "aʊ":1, "ɔɪ":1 };
  /* 双字符音素（取首/末音素时优先匹配） */
  var TWO = ["tʃ", "dʒ", "aɪ", "aʊ", "eɪ", "oʊ", "ɔɪ"];
  var UNREL = "̚"; /* U+031A，失去爆破标记，加在塞音之后 */

  function stripStress(s){ return s.replace(/[ˈˌ]/g, ""); }
  function firstPhon(ipa){
    var s = stripStress(ipa);
    for(var i=0;i<TWO.length;i++){
      if(s.indexOf(TWO[i])===0) return TWO[i];
    }
    return s.charAt(0);
  }
  function lastPhon(ipa){
    var s = stripStress(ipa);
    for(var i=0;i<TWO.length;i++){
      if(s.length>=TWO[i].length && s.slice(s.length-TWO[i].length)===TWO[i]) return TWO[i];
    }
    return s.charAt(s.length-1);
  }
  function isVowel(ph){ return !!VOWELS[ph]; }
  /* 失去爆破的字母下标：核心词从后往前找最后一个塞音字母（p/t/k/d/b/g）。
     覆盖 make（k 在词尾 e 之前）、liked（d 读 /t/）、don't（t）等情况。 */
  function findStopLetter(core){
    for(var i=core.length-1;i>=0;i--){
      var c = core.charAt(i);
      if(c==="p"||c==="t"||c==="k"||c==="d"||c==="b"||c==="g") return i;
    }
    return -1;
  }

  /* analyze(en) -> { tokens, sentenceIpa }
     tokens: [{ text（原词，含标点）, core（去标点的小写词）, coreStart（core 在 text 中的下标）,
       silentIdx[], isWeak, ipa（已应用弱读或完整音标，缺音标为 null）,
       linkAfter: null | "cv" | "j" | "w" | "vv", linkTarget（连读的目标 token 或 null）,
       unreleased: bool, unrelIdx }]
     sentenceIpa：整句音标，连读处用 ‿ 连接（滑音连读为 ‿ʲ / ‿ʷ），
       失去爆破的塞音后加 ̚；缺音标的词用原词占位；数字等无字母 token 保留原文。
     注意：一条数据可能含多个句子（如 "theater 6. Our seats..."），连读/弱读/失去爆破
       都不跨越句号/问号/感叹号；"最后一个词"指所在小句的最后一个词。 */
  function analyze(en){
    var out = { tokens: [], sentenceIpa: "" };
    var P = (typeof PRON !== "undefined") ? PRON : null;
    var raw = String(en || "").split(/\s+/);
    var groups = [[]]; /* 按句子分组的词 token 列表 */
    for(var i=0;i<raw.length;i++){
      if(!raw[i]) continue;
      var m = /[A-Za-z']+/.exec(raw[i]);
      var t = { text: raw[i], core: "", coreStart: -1, silentIdx: [], isWeak: false,
        ipa: null, linkAfter: null, linkTarget: null, unreleased: false, unrelIdx: -1 };
      if(m){
        t.core = m[0].toLowerCase();
        t.coreStart = m.index;
        if(P && P.ipa) t.ipa = P.ipa[t.core] || null;
        if(P && P.silent && P.silent[t.core]) t.silentIdx = P.silent[t.core].slice();
        groups[groups.length-1].push(t);
      }
      out.tokens.push(t);
      /* 以 . ! ? 结尾的 token 结束一个小句（逗号/分号不断句） */
      if(/[.!?]$/.test(raw[i])) groups.push([]);
    }
    /* 弱读：weak 表中的词且不是所在小句的最后一个词。the 在后词以元音开头时读 /ði/。
       注意：按词身份弱读，不分词性（简化处理；如实义动词 have 也会弱读为 /əv/，
       快读中可接受，见设计文档 §4.1 已知简化）。 */
    for(var g=0;g<groups.length;g++){
      var words = groups[g];
      for(var j=0;j<words.length;j++){
        var w = words[j];
        if(P && P.weak && P.weak[w.core] && j < words.length-1){
          w.isWeak = true;
          if(w.core === "the"){
            var nx = words[j+1];
            w.ipa = (nx.ipa && isVowel(firstPhon(nx.ipa))) ? "ði" : P.weak[w.core];
          }else{
            w.ipa = P.weak[w.core];
          }
        }
      }
      /* 连读 / 失去爆破：只在同一小句内，按音标首末音素判断，两者按后词首音素互斥。 */
      for(var k=0;k<words.length-1;k++){
        var a = words[k], b = words[k+1];
        if(!a.ipa || !b.ipa) continue;
        var last = lastPhon(a.ipa), first = firstPhon(b.ipa);
        if(isVowel(first)){
          if(!isVowel(last)) a.linkAfter = "cv";
          else if(last === "i" || last === "ɪ") a.linkAfter = "j";
          else if(last === "u" || last === "ʊ" || last === "oʊ") a.linkAfter = "w";
          else a.linkAfter = "vv";
          a.linkTarget = b;
        }else if(last === "p" || last === "t" || last === "k"){
          a.unreleased = true;
          a.unrelIdx = findStopLetter(a.core);
        }
      }
    }
    /* 整句音标：按全部 token 顺序串联（数字等无字母 token 保留原文）；
       连读处用 ‿（滑音连读 ‿ʲ / ‿ʷ）代替空格，但 ‿ 只出现在连读双方直接相邻时；
       失去爆破的塞音后加 ̚。 */
    var parts = [];
    var toks = out.tokens;
    for(var n=0;n<toks.length;n++){
      var w2 = toks[n];
      var ip = w2.core ? (w2.ipa || w2.core) : w2.text;
      if(w2.unreleased) ip += UNREL;
      parts.push(ip);
      if(n < toks.length-1){
        var nt = toks[n+1];
        if(w2.linkAfter && w2.linkTarget === nt){
          if(w2.linkAfter === "j") parts.push("‿ʲ");
          else if(w2.linkAfter === "w") parts.push("‿ʷ");
          else parts.push("‿");
        }else{
          parts.push(" ");
        }
      }
    }
    out.sentenceIpa = parts.join("");
    return out;
  }

  return { analyze: analyze };
})();
