/* 英语打字练习 · 离线版 · 学习路径版（三合集）
   单机文件：数据来自 data.js（PC_DATA）、vocab-data.js（VOCAB_DATA）与
   video-data.js（VIDEO_LESSONS），进度保存在本机 localStorage，录音保存在
   本机 IndexedDB；打开即用，不需要网络，也没有账号。
   学习法（场景）：精听 → 跟读 → 盲听 → 复述 → 场景应用 → 科学间隔复习（1/3/7/15/30 天）→ 通关
   学习法（视频课 v2.7）：看视频 → 逐句跟练 → 盲听 → 完整演绎 → 场景应用 → 复习 → 通关
   （视频课没有听写环节；音频全部取自视频文件本身，按时间点截片段播放）
   场景标识：pc01–pc100（亲子合集）、vc01–vc37（生活词汇合集）、vd01…（视频学习合集）；
   进度、收藏、录音都按场景 id 存，避免各合集的场景号撞车。 */
(function(){
  "use strict";
  var DATA = window.PC_DATA || [];
  var VOCAB = window.VOCAB_DATA || [];
  var VIDEOS = window.VIDEO_LESSONS || [];
  var MAPS = window.SCENE_MAPS || {}; /* v2.5：场景全景图数据（全部 137 个场景） */
  function hasMap(id){ return !!MAPS[id]; }
  /* v2.4.2：场景的规范句子顺序（显示顺序）。
     有全景图的场景：按分组顺序展平各组 sents（去重，首次出现为准），
     再把未被分组覆盖的句子按数据顺序追加在末尾；
     无全景图的场景：数据顺序 [0..n-1]。
     返回的是数据下标的排列；进度状态永远按数据下标存，顺序只影响显示和播放。
     防御性处理：下标越界、重复、缺失都不得报错。 */
  function sceneOrder(id){
    var sc = byId(id);
    if(!sc) return [];
    var n = sc.s.length, out = [], seen = {};
    var m = MAPS[id];
    if(m && Array.isArray(m.groups)){
      m.groups.forEach(function(g){
        if(!g || !Array.isArray(g.sents)) return;
        g.sents.forEach(function(si){
          si = parseInt(si, 10);
          if(isNaN(si) || si < 0 || si >= n || seen[si]) return;
          seen[si] = true; out.push(si);
        });
      });
    }
    for(var i=0;i<n;i++) if(!seen[i]) out.push(i);
    return out;
  }
  var pad2 = function(n){ n = parseInt(n,10); return (n<10?"0":"")+n; };
  DATA.forEach(function(sc){ sc.id = "pc"+pad2(sc.n); sc.coll = "parent-talk"; });
  VOCAB.forEach(function(sc){ sc.id = "vc"+pad2(sc.n); sc.coll = "vocab-403"; });
  /* v2.7：视频课转成场景同款对象（w/s 是 [英文，中文] 对，与 data.js 一致），
     复用同一套进度/收藏/复习/统计机制；原始字段（segments/words/video/type/duration）保留在对象上。
     视频课没有全景图，sceneOrder 对无 map 的课返回数据顺序，正好适用。 */
  VIDEOS.forEach(function(v, vi){
    v.kind = "video";
    v.coll = "video-learn";
    v.n = vi + 1;
    v.t = v.title;
    v.sub = v.type === "song" ? "儿歌" : "对话";
    v.lv = "初级";
    v.date = "2026-11-22";
    v.w = (v.words || []).map(function(w){ return [w.w, w.cn]; });
    v.s = (v.segments || []).map(function(sg){ return [sg.en, sg.cn]; });
  });
  var ALL = DATA.concat(VOCAB).concat(VIDEOS);
  function byId(id){ for(var i=0;i<ALL.length;i++) if(ALL[i].id===id) return ALL[i]; return null; }
  function isVideo(id){ var sc = byId(id); return !!(sc && sc.kind === "video"); }

  var SUBS_PARENT = ["全部","我的一天","游戏玩耍","我是小帮手","出行场景","节日"];
  var SUBS_VOCAB = ["全部","厨房用品","食物","房间","家具","家用电器","动物","形状与颜色","衣服","身体部位","交通工具","玩具与学习","日用小物","自然与天气","数字与时间"];
  var LIB_CATS = ["全部","实用口语","生活词汇","视频学习"];
  /* v2.7：视频合集的 meta 按实际数据算（以后加视频自动更新） */
  var vSegTotal = 0, vWordTotal = 0;
  VIDEOS.forEach(function(v){ vSegTotal += (v.segments||[]).length; vWordTotal += (v.words||[]).length; });
  var COLLECTIONS=[
    { id:"parent-talk", title:"100个亲子情境口语", short:"亲子口语", cat:"实用口语", level:"初级",
      tags:["亲子","口语"], date:"2026-11-16", cover:"./cover.jpg",
      meta:"100 个场景 · 800 句 · 800 词", subs:SUBS_PARENT, data:DATA },
    { id:"vocab-403", title:"403个生活词汇", short:"生活词汇", cat:"生活词汇", level:"初级",
      tags:["生活","词汇"], date:"2026-11-19", cover:"./cover-vocab.jpg",
      meta:"37 个场景 · 403 句 · 403 词", subs:SUBS_VOCAB, data:VOCAB },
    { id:"video-learn", title:"视频学习", short:"视频", cat:"视频学习", level:"初级",
      tags:["视频","儿歌"], date:"2026-11-22", cover:"./cover-video.jpg",
      meta:VIDEOS.length+" 个视频 · "+vSegTotal+" 句 · "+vWordTotal+" 词", subs:["全部","儿歌","对话"], data:VIDEOS }
  ];
  function collOf(id){ for(var i=0;i<COLLECTIONS.length;i++) if(COLLECTIONS[i].id===id) return COLLECTIONS[i]; return null; }
  function collOfScene(sc){ return collOf(sc.coll); }

  var INTERVALS = [1, 3, 7, 15, 30]; /* 复习轮次间隔（天） */
  var DAY = 86400000;
  var ROUND_NAMES = ["首轮复习","第二轮复习","第三轮复习","第四轮复习","第五轮复习"];
  var STEP_NAMES = ["逐句精听","难句跟读","全文盲听","段落复述","场景应用"];
  var STEP_SUBS = ["逐句听写，理解并标记难句","针对弱项句子反复跟读","盲听全文，抓住大意","整段复述，用自己的话说出来","说一段自己的真实场景"];
  /* v2.7：视频课 5 步（与场景路径一一对应：看视频=入口，逐句跟练=精听+跟读合并，
     盲听/完整演绎/场景应用与场景的盲听/复述/场景应用对应；视频课没有听写与单独的难句跟读步） */
  var VSTEP_NAMES = ["看视频","逐句跟练","全文盲听","完整演绎","场景应用"];
  var VSTEP_SUBS = ["完整看一遍，先看懂整个视频","逐句跟唱/跟读，练不好的标难句","只听声音不看画面，抓住大意","整首唱下来/整段演下来，可录音","实际用起来，唱给宝宝听或说自己的事"];
  var $ = function(id){ return document.getElementById(id); };
  var esc = function(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };
  var norm = function(s){ return String(s).toLowerCase().replace(/[\s]+/g," ").replace(/^\s+|\s+$/g,""); };
  var normWord = function(s){ return norm(s).replace(/[.!?,;:"“”]+$/,""); };
  var mmss = function(sec){ sec=Math.max(0,Math.floor(sec)); var m=Math.floor(sec/60), s=sec%60; return (m<10?"0":"")+m+":"+(s<10?"0":"")+s; };
  /* v2.2：录音时间戳 -> "MM-DD HH:mm"（录音列表用；无时间戳时返回空串） */
  function fmtRecTime(ts){
    if(!ts) return "";
    var d = new Date(ts);
    if(isNaN(d.getTime())) return "";
    return pad2(d.getMonth()+1)+"-"+pad2(d.getDate())+" "+pad2(d.getHours())+":"+pad2(d.getMinutes());
  }
  function dateStr(d){ d=d||new Date(); var m=d.getMonth()+1, day=d.getDate(); return d.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(day<10?"0":"")+day; }
  function todayStr(){ return dateStr(new Date()); }
  function mdStr(ts){ var d=new Date(ts); return (d.getMonth()+1)+"月"+d.getDate()+"日"; }
  function countKeys(o){ var c=0; for(var k in o) if(o[k]) c++; return c; }

  /* ---------- state: localStorage v3（场景键 = 场景 id，如 pc01 / vc01） ---------- */
  var KEY3 = "typing-trainer-offline-v3";
  var KEY2 = "typing-trainer-offline-v2";
  /* 种子：在线版账号现有进度的只读副本（2026-11-19 导出）。
     pc01 起床：单词下标 2,3,4,5,7 已掌握（alarm / awake / yawn / stretch / make the bed），
     累计学习时长 53 秒；无收藏。 */
  function freshScene(){ return { warmup:false, watchDone:false, words:{}, sents:{}, shadowDone:false, shadowIdx:{},
    blindDone:false, blindPlays:0, retellDone:false, applyDone:false, applyText:"", learnedAt:null, reviewRound:0, reviewTasks:{},
    reviewDoneCount:0, passed:false, passedAt:null, lastDoneAt:null, lastDoneKind:null,
    lastDoneRound:null, startedAt:null, studySec:0 }; }
  function freshState(){
    var st = { v:3, scenes:{}, favSents:[], favWords:[], days:{}, studySeconds:53,
      lastScene:"pc01", favColls:{}, settings:{ goalMin:120, rate:0.85 }, recDismissedFor:null };
    st.scenes["pc01"] = freshScene();
    st.scenes["pc01"].words = { "2":true, "3":true, "4":true, "5":true, "7":true };
    st.scenes["pc01"].startedAt = Date.now();
    return st;
  }
  /* 旧版用纯数字场景号（"1".."100"）做键；双合集起改为场景 id。
     数字键一律属于亲子合集，迁成 pc01…pc100。 */
  function migrateSceneId(k){
    if(/^\d+$/.test(k)) return "pc"+pad2(k);
    return k;
  }
  function migrateFavKey(k){
    var m = /^(\d+):(\d+)$/.exec(k);
    if(m) return "pc"+pad2(m[1])+":"+m[2];
    return k;
  }
  function migrateSceneRef(v){
    if(typeof v==="number") return "pc"+pad2(v);
    if(typeof v==="string" && /^\d+$/.test(v)) return "pc"+pad2(v);
    return v;
  }
  function normalizeState(st){
    if(!st || typeof st!=="object") return freshState();
    st.v = 3;
    if(!st.scenes || typeof st.scenes!=="object") st.scenes = {};
    /* 场景键迁移：数字键 -> pcNN（目标已存在时保留目标，丢弃旧键） */
    var scenes2 = {};
    for(var k in st.scenes){
      var nk = migrateSceneId(k);
      if(!scenes2[nk]) scenes2[nk] = st.scenes[k];
    }
    st.scenes = scenes2;
    if(!Array.isArray(st.favSents)) st.favSents = [];
    if(!Array.isArray(st.favWords)) st.favWords = [];
    /* 收藏键迁移：N:idx -> pcNN:idx，并去重 */
    var dedup = function(arr){
      var seen = {}, out = [];
      arr.forEach(function(x){
        var nk = migrateFavKey(String(x));
        if(!seen[nk]){ seen[nk] = true; out.push(nk); }
      });
      return out;
    };
    st.favSents = dedup(st.favSents);
    st.favWords = dedup(st.favWords);
    if(!st.days || typeof st.days!=="object") st.days = {};
    if(typeof st.studySeconds!=="number") st.studySeconds = 0;
    if(!st.settings || typeof st.settings!=="object") st.settings = { goalMin:120, rate:0.85 };
    if(typeof st.settings.goalMin!=="number") st.settings.goalMin = 120;
    if(typeof st.settings.rate!=="number") st.settings.rate = 0.85;
    if(st.lastScene!==null && st.lastScene!==undefined) st.lastScene = migrateSceneRef(st.lastScene);
    if(st.recDismissedFor!==null && st.recDismissedFor!==undefined) st.recDismissedFor = migrateSceneRef(st.recDismissedFor);
    /* 合集收藏：旧版 favOn（布尔，只管亲子合集）-> favColls */
    if(!st.favColls || typeof st.favColls!=="object"){
      st.favColls = {};
      if(st.favOn) st.favColls["parent-talk"] = true;
    }
    for(var k2 in st.scenes){
      var base = freshScene(), cur = st.scenes[k2] || {};
      for(var f in base){ if(cur[f]===undefined) cur[f] = base[f]; }
      st.scenes[k2] = cur;
    }
    return st;
  }
  function migrateFromV2(v2){
    var st = { v:3, scenes:{}, favSents:[], favWords:[], days:{}, studySeconds:0,
      lastScene:null, favColls:{}, settings:{ goalMin:120, rate:0.85 }, recDismissedFor:null };
    var prog = (v2 && v2.prog) || {};
    for(var k in prog){
      var sc = freshScene();
      var w = (prog[k] && prog[k].w) || {};
      for(var wi in w){ if(w[wi]) sc.words[wi] = true; }
      if(countKeys(sc.words) > 0) sc.startedAt = Date.now();
      st.scenes[migrateSceneId(k)] = sc;
    }
    if(typeof v2.studySeconds==="number") st.studySeconds = v2.studySeconds;
    if(typeof v2.lastScene==="number") st.lastScene = migrateSceneRef(v2.lastScene);
    if(v2.favOn) st.favColls["parent-talk"] = true;
    return st;
  }
  function readLS(key){
    try{ var raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
    catch(e){ return null; }
  }
  var S = null; /* state */
  function loadState(){
    var v3 = readLS(KEY3);
    if(v3 && v3.v===3){
      S = normalizeState(v3);
      saveState(); /* 把迁移后的键（pcNN）落盘，避免旧数字键一直残留 */
    }
    else{
      var v2 = readLS(KEY2);
      if(v2 && v2.v===2){ S = migrateFromV2(v2); }
      else{ S = freshState(); }
      saveState();
    }
  }
  function saveState(){
    try{ window.localStorage.setItem(KEY3, JSON.stringify(S)); }catch(e){}
  }
  function scState(id){
    var k = String(id);
    if(!S.scenes[k]) S.scenes[k] = freshScene();
    return S.scenes[k];
  }
  function touchScene(id){
    var sc = scState(id);
    if(!sc.startedAt) sc.startedAt = Date.now();
    S.lastScene = id;
    saveState();
  }

  /* ---------- derived progress（按场景 id；词/句数取场景实际长度） ---------- */
  function sceneTotal(id){
    var sc = byId(id);
    return sc ? sc.w.length + sc.s.length : 0;
  }
  function wordsChecked(id){ return countKeys(scState(id).words); }
  function sentsSubmitted(id){
    var s = scState(id).sents, c = 0;
    for(var k in s) if(s[k] && s[k].sub) c++;
    return c;
  }
  function listenDone(id){
    var sc = byId(id);
    if(!sc) return false;
    return wordsChecked(id)===sc.w.length && sentsSubmitted(id)===sc.s.length;
  }
  /* v2.7：视频课 5 步用另一套完成标志——看视频(watchDone) + 逐句跟练(listenDone:
     词热身全打勾 + 每句都练过) + 盲听 + 完整演绎(retellDone) + 场景应用；
     视频课没有单独的难句跟读步，shadowDone 不计入。场景课保持原规则。 */
  function stepsDoneCount(id){
    var sc = scState(id), c = 0;
    if(isVideo(id)){
      if(sc.watchDone) c++;
      if(listenDone(id)) c++;
      if(sc.blindDone) c++;
      if(sc.retellDone) c++;
      if(sc.applyDone) c++;
      return c;
    }
    if(listenDone(id)) c++;
    if(sc.shadowDone) c++;
    if(sc.blindDone) c++;
    if(sc.retellDone) c++;
    if(sc.applyDone) c++;
    return c;
  }
  function currentStep(id){
    var sc = scState(id);
    if(isVideo(id)){
      if(!sc.watchDone) return 0;
      if(!listenDone(id)) return 1;
      if(!sc.blindDone) return 2;
      if(!sc.retellDone) return 3;
      if(!sc.applyDone) return 4;
      return -1;
    }
    if(!listenDone(id)) return 0;
    if(!sc.shadowDone) return 1;
    if(!sc.blindDone) return 2;
    if(!sc.retellDone) return 3;
    if(!sc.applyDone) return 4;
    return -1;
  }
  function isLearned(id){ return !!scState(id).learnedAt; }
  function isPassed(id){ return !!scState(id).passed; }
  function detailPct(id){
    var sc = scState(id);
    var done = stepsDoneCount(id) + Math.min(sc.reviewRound, 5);
    return Math.round(done/10*100);
  }
  function itemsDone(id){ return wordsChecked(id) + sentsSubmitted(id); }
  function collDone(c){
    var t = 0;
    c.data.forEach(function(sc){ t += itemsDone(sc.id); });
    return t;
  }
  function collTotal(c){
    var t = 0;
    c.data.forEach(function(sc){ t += sc.w.length + sc.s.length; });
    return t;
  }
  function masteredCounts(list){
    var w = 0, s = 0;
    (list || ALL).forEach(function(sc){
      var st = scState(sc.id);
      w += wordsChecked(sc.id);
      for(var k in st.sents){
        var r = st.sents[k];
        /* v2.7：视频课逐句跟练只记 practiced（自评练过，无对错判定），不算"掌握" */
        if(r && r.sub && !r.practiced && (!r.wrong || r.wrong.length===0) && !r.seenAns) s++;
      }
    });
    return { w:w, s:s, total:w+s };
  }
  function passedCount(){
    var c = 0;
    ALL.forEach(function(sc){ if(isPassed(sc.id)) c++; });
    return c;
  }
  function totalReviewDone(){
    var c = 0;
    ALL.forEach(function(sc){ c += scState(sc.id).reviewDoneCount || 0; });
    return c;
  }
  function roundDue(id, r){
    var sc = scState(id);
    if(!sc.learnedAt) return null;
    return sc.learnedAt + INTERVALS[r]*DAY;
  }
  function roundState(id, r){
    var sc = scState(id);
    if(!isLearned(id)) return "locked";
    if(isPassed(id) || r < sc.reviewRound) return "done";
    if(r > sc.reviewRound) return "locked";
    var due = roundDue(id, r);
    return (due && Date.now() >= due) ? "due" : "waiting";
  }
  function roundTasksDone(id, r){
    var t = scState(id).reviewTasks[String(r)] || {};
    return (t.bu?1:0) + (t.blind?1:0);
  }
  function dueRounds(){
    var out = [];
    ALL.forEach(function(sc){
      if(!isLearned(sc.id) || isPassed(sc.id)) return;
      var st = scState(sc.id);
      if(roundState(sc.id, st.reviewRound)==="due") out.push({ id:sc.id, round:st.reviewRound, due:roundDue(sc.id, st.reviewRound) });
    });
    out.sort(function(a,b){ return a.due-b.due; });
    return out;
  }
  function checkLearned(id){
    var sc = scState(id);
    if(!sc.learnedAt && stepsDoneCount(id)===5){
      sc.learnedAt = Date.now();
      sc.lastDoneAt = Date.now();
      sc.lastDoneKind = "learned";
      saveState();
      return true;
    }
    return false;
  }

  /* ---------- favorites（键 = 场景 id:下标，如 pc01:3 / vc01:2） ---------- */
  function favKey(id, idx){ return id+":"+idx; }
  function hasFavSent(id, idx){ return S.favSents.indexOf(favKey(id,idx))>=0; }
  function hasFavWord(id, idx){ return S.favWords.indexOf(favKey(id,idx))>=0; }
  function addFavSent(id, idx){
    var k = favKey(id,idx);
    if(S.favSents.indexOf(k)<0){ S.favSents.push(k); saveState(); return true; }
    return false;
  }
  function addFavWord(id, idx){
    var k = favKey(id,idx);
    if(S.favWords.indexOf(k)<0){ S.favWords.push(k); saveState(); return true; }
    return false;
  }
  function delFavSent(id, idx){
    var i = S.favSents.indexOf(favKey(id,idx));
    if(i>=0){ S.favSents.splice(i,1); saveState(); }
  }
  function delFavWord(id, idx){
    var i = S.favWords.indexOf(favKey(id,idx));
    if(i>=0){ S.favWords.splice(i,1); saveState(); }
  }
  function sceneFavSents(id){
    var out = [];
    S.favSents.forEach(function(k){
      var p = k.split(":");
      if(p[0]===id) out.push(parseInt(p[1],10));
    });
    /* v2.4.2：按该场景的规范句子顺序（全景图顺序）排，不要按数据下标排；
       顺序里没有的下标（防御）排最后，再按数据下标排 */
    var order = sceneOrder(id), pos = {};
    order.forEach(function(di, i){ pos[di] = i; });
    out.sort(function(a,b){
      var pa = (pos[a]===undefined ? 1e9 : pos[a]);
      var pb = (pos[b]===undefined ? 1e9 : pos[b]);
      if(pa!==pb) return pa-pb;
      return a-b;
    });
    return out;
  }

  /* ---------- daily stats ---------- */
  function dayRec(date){
    if(!S.days[date]) S.days[date] = { listen:0, shadow:0, blind:0, retell:0, apply:0, newItems:0 };
    return S.days[date];
  }
  function dayTotal(date){
    var d = S.days[date];
    if(!d) return 0;
    return (d.listen||0)+(d.shadow||0)+(d.blind||0)+(d.retell||0)+(d.apply||0);
  }
  function streakDays(){
    var c = 0, d = new Date();
    if(dayTotal(dateStr(d))<=0) d = new Date(d.getTime()-DAY);
    while(dayTotal(dateStr(d))>0){ c++; d = new Date(d.getTime()-DAY); }
    return c;
  }
  function bumpNewItems(){
    var d = dayRec(todayStr());
    d.newItems = (d.newItems||0)+1;
  }

  /* ---------- toast ---------- */
  var toastTimer=null;
  function toast(msg){
    var t=$("toast"); t.textContent=msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.classList.remove("show"); },2400);
  }

  /* ---------- speech ---------- */
  var synth = ("speechSynthesis" in window) ? window.speechSynthesis : null;
  var Player = {
    stopped:false, timer:null, utter:null,
    stop:function(){
      this.stopped = true;
      if(this.timer){ clearTimeout(this.timer); this.timer = null; }
      if(synth){ try{ synth.cancel(); }catch(e){} }
    },
    speakOne:function(text, rate, cb){
      var self = this;
      self.stopped = false;
      var done = false;
      var finish = function(){
        if(done) return; done = true;
        if(self.timer){ clearTimeout(self.timer); self.timer = null; }
        if(cb) cb();
      };
      /* 兜底定时器：无语音引擎或 onend 不触发时也能继续（无头测试同样适用） */
      var fallback = Math.max(1000, String(text).length*60);
      self.timer = setTimeout(finish, fallback);
      if(!synth){ return; }
      try{
        synth.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = rate || S.settings.rate || 0.85;
        u.onend = finish; u.onerror = finish;
        self.utter = u;
        synth.speak(u);
      }catch(e){ finish(); }
    },
    playSeq:function(list, opts){
      var self = this;
      opts = opts || {};
      self.stopped = false;
      var i = 0;
      var next = function(){
        if(self.stopped) return;
        if(i>=list.length){ if(opts.onDone) opts.onDone(); return; }
        var idx = i;
        if(opts.onItem) opts.onItem(idx);
        i++;
        self.speakOne(list[idx], opts.rate, function(){ next(); });
      };
      next();
    }
  };
  function speak(text, rate){ Player.speakOne(text, rate); }

  /* ---------- 视频播放器（v2.7：统一视频学习流程） ----------
     一个共享 <video> 元素，在各视频视图的 .video-slot 之间移动；
     视频文件不进 zip，应用按相对路径引用 videos/<file>（与 index.html 同级）。
     缺失时 ok=false：各视图显示友好提示，播放按钮置灰，文字仍可查看；
     之后把文件放进来再进视频视图会自动重试（不用刷新也行）。
     播放方式：playSegment（单句：seek 到 start，播到 end 停）、
     playSeqSegs（顺序播一串分段，盲听用）、playFull（完整播放）。
     字幕同步：timeupdate 时按当前时间找所在分段，更新所有 .sub-en/.sub-cn。 */
  var VEl = document.createElement("video");
  VEl.setAttribute("playsinline", "");
  VEl.setAttribute("controls", "");
  VEl.preload = "metadata";
  /* 初始宿主：隐藏的 holder（元素必须在 DOM 里；收藏页点 🔊 播片段音频时也用它） */
  var VHolder = document.createElement("div");
  VHolder.id = "video-holder";
  VHolder.style.display = "none";
  VHolder.appendChild(VEl);
  document.body.appendChild(VHolder);
  var VPlayer = {
    lesson: null, ok: null, loadTimer: null,
    segEnd: null, segCb: null, endCb: null, seq: null,
    init: function(){
      var self = this;
      VEl.addEventListener("loadedmetadata", function(){
        self.ok = true;
        if(self.loadTimer){ clearTimeout(self.loadTimer); self.loadTimer = null; }
        applyVideoState();
      });
      VEl.addEventListener("error", function(){
        if(!VEl.getAttribute("src")) return; /* 未设置 src 时的 error 不算缺失 */
        self.setMissing();
      });
      VEl.addEventListener("timeupdate", function(){
        if(self.segEnd !== null && VEl.currentTime >= self.segEnd){
          var cb = self.segCb;
          self.segEnd = null; self.segCb = null;
          VEl.pause();
          VEl.playbackRate = 1;
          if(cb) cb();
          return;
        }
        syncSubtitles(VEl.currentTime);
      });
      VEl.addEventListener("ended", function(){
        VEl.playbackRate = 1;
        /* 分段播放时 ended 可能先于 timeupdate 触发（分段恰好到片尾）：
           有待回调的分段先走分段回调，避免顺序播放漏句 */
        if(self.segEnd !== null){
          var cb = self.segCb;
          self.segEnd = null; self.segCb = null;
          if(cb) cb();
          return;
        }
        var cb2 = self.endCb; self.endCb = null;
        if(cb2) cb2();
      });
    },
    setMissing: function(){
      this.ok = false;
      if(this.loadTimer){ clearTimeout(this.loadTimer); this.loadTimer = null; }
      applyVideoState();
    },
    /* 切换课程：换 src 并重新检测；同一课程且已加载成功时不重复加载；
       同一课程但之前缺失时重试一次（用户可能刚把文件放进来） */
    load: function(lesson){
      if(this.lesson && lesson && this.lesson.id === lesson.id && VEl.getAttribute("src") && this.ok !== false) return;
      this.stop();
      this.lesson = lesson;
      this.ok = null;
      VEl.removeAttribute("src");
      VEl.load();
      if(!lesson) return;
      var self = this;
      VEl.setAttribute("src", lesson.video);
      VEl.load();
      if(this.loadTimer) clearTimeout(this.loadTimer);
      this.loadTimer = setTimeout(function(){
        if(self.ok === null) self.setMissing();
      }, 5000);
      applyVideoState();
    },
    /* 把视频元素放进某视图的 slot（id） */
    attach: function(slotId){
      var slot = $(slotId);
      if(slot && VEl.parentNode !== slot) slot.appendChild(VEl);
    },
    /* 播放前检查：缺失时提示并返回 false；加载中返回 true（播放函数会等 metadata） */
    ensure: function(){
      if(this.ok === false){
        toast("视频文件还没放进来，按提示把文件放进 videos 文件夹");
        return false;
      }
      if(!this.lesson) return false;
      return true;
    },
    stop: function(){
      this.segEnd = null; this.segCb = null; this.endCb = null; this.seq = null;
      VEl.playbackRate = 1;
      try{ VEl.pause(); }catch(e){}
    },
    /* 等 metadata 就绪后再执行（加载中点播放时用；缺失时不等，直接返回） */
    whenReady: function(fn){
      var self = this;
      if(VEl.readyState >= 1){ fn(); return; }
      if(this.ok === false) return;
      var onMeta = function(){
        VEl.removeEventListener("loadedmetadata", onMeta);
        fn();
      };
      VEl.addEventListener("loadedmetadata", onMeta);
    },
    /* 播一个分段：seek 到 start，播到 end 停；rate 可指定慢速（如 0.65）；
       keepSeq=true 时不清除顺序播放状态（seqNext 内部调用时用） */
    playSegment: function(seg, cb, rate, keepSeq){
      if(!seg || !this.ensure()) return false;
      var self = this;
      if(!keepSeq) this.seq = null;
      this.endCb = null;
      this.whenReady(function(){
        VEl.playbackRate = rate || 1;
        var start = function(){
          self.segEnd = seg.end; self.segCb = cb || null;
          var p = null;
          try{ p = VEl.play(); }catch(e){}
          if(p && p.catch) p.catch(function(){ self.segEnd = null; self.segCb = null; });
        };
        if(Math.abs(VEl.currentTime - seg.start) < 0.3){ start(); }
        else{
          var onSeek = function(){
            VEl.removeEventListener("seeked", onSeek);
            start();
          };
          VEl.addEventListener("seeked", onSeek);
          try{ VEl.currentTime = seg.start; }catch(e){ start(); }
        }
      });
      return true;
    },
    /* 顺序播一串分段（盲听用）：opts.onItem(i) / opts.onDone() */
    playSeqSegs: function(list, opts){
      if(!this.ensure()) return false;
      var self = this;
      this.seq = { list:list, i:0, opts:opts || {} };
      this.seqNext();
      return true;
    },
    seqNext: function(){
      var sq = this.seq;
      if(!sq) return;
      if(sq.i >= sq.list.length){
        var done = sq.opts.onDone;
        this.seq = null;
        if(done) done();
        return;
      }
      var self = this;
      var idx = sq.i;
      if(sq.opts.onItem) sq.opts.onItem(idx);
      sq.i++;
      this.playSegment(sq.list[idx], function(){ self.seqNext(); }, 1, true);
    },
    /* 从头完整播放（endCb 由调用方在调用前设置，如看视频的自动完成） */
    playFull: function(){
      if(!this.ensure()) return false;
      var self = this;
      this.seq = null; this.segEnd = null; this.segCb = null;
      this.whenReady(function(){
        VEl.playbackRate = 1;
        try{ VEl.currentTime = 0; }catch(e){}
        var p = null;
        try{ p = VEl.play(); }catch(e){}
        if(p && p.catch) p.catch(function(){});
      });
      return true;
    }
  };
  /* 字幕同步：按当前时间找所在分段，更新所有字幕行（仅一个视图可见，全部更新无妨） */
  function syncSubtitles(t){
    var ls = VPlayer.lesson;
    if(!ls || !ls.segments) return;
    var idx = -1;
    for(var i=0;i<ls.segments.length;i++){
      if(t >= ls.segments[i].start && t < ls.segments[i].end){ idx = i; break; }
    }
    if(idx === syncSubtitles._last) return;
    syncSubtitles._last = idx;
    var en = idx>=0 ? ls.segments[idx].en : "";
    var cn = idx>=0 ? ls.segments[idx].cn : "";
    Array.prototype.forEach.call(document.querySelectorAll(".sub-en"), function(el){ el.textContent = en; });
    Array.prototype.forEach.call(document.querySelectorAll(".sub-cn"), function(el){ el.textContent = cn; });
  }
  syncSubtitles._last = -2;
  /* 视频缺失/就绪时刷新所有视频 UI：提示显隐、播放按钮置灰。
     只在当前打开的是视频课时才生效：盲听与跟读视图是场景课与视频课共用的，
     场景课用 TTS 不依赖视频文件，不能因为之前某视频加载失败就被置灰或提示 */
  function applyVideoState(){
    var missing = (VPlayer.ok === false) && curScene && isVideo(curScene.id);
    var fname = "";
    if(VPlayer.lesson && VPlayer.lesson.video) fname = VPlayer.lesson.video.split("/").pop();
    Array.prototype.forEach.call(document.querySelectorAll(".video-card"), function(card){
      card.classList.toggle("no-video", missing);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".video-tip"), function(tip){
      tip.hidden = !missing;
      if(missing) tip.textContent = "视频文件还没放进来：请把 " + fname + " 放进与 index.html 同一级的 videos 文件夹，然后重新进入这个页面。";
    });
    Array.prototype.forEach.call(document.querySelectorAll(".needs-video"), function(b){
      b.disabled = missing;
    });
  }
  /* 字幕中文开关（全局，所有字幕行共用） */
  var subCnVisible = true;
  function setSubCn(v){
    subCnVisible = v;
    document.body.classList.toggle("hide-sub-cn", !v);
    Array.prototype.forEach.call(document.querySelectorAll(".sub-cn-toggle"), function(b){
      b.textContent = v ? "隐藏中文" : "显示中文";
    });
  }

  /* ---------- IndexedDB: recordings（键 = 场景 id:环节，如 pc01:retell；
     v2.2 起值 = {list:[{blob,durationSec,createdAt},...]}，多条保留；
     旧格式单条值由 normRecVal 在读取时归一化并写回自愈） ---------- */
  var IDB = {
    db:null, ok:null, pending:[],
    open:function(cb){
      var self = this;
      if(self.ok===true && self.db){ cb(true); return; }
      if(self.ok===false){ cb(false); return; }
      if(!("indexedDB" in window)){ self.ok=false; cb(false); return; }
      try{
        var req = indexedDB.open("typing-trainer-recordings", 1);
        req.onupgradeneeded = function(){ try{ req.result.createObjectStore("recs"); }catch(e){} };
        req.onsuccess = function(){
          self.db = req.result;
          self.migrateKeys(function(){ self.ok = true; cb(true); });
        };
        req.onerror = function(){ self.ok = false; cb(false); };
      }catch(e){ self.ok=false; cb(false); }
    },
    /* 录音键迁移（首次打开时跑，幂等）：
       v1.7 裸数字键（场景号）-> pcNN:retell；
       v1.8 数字前缀键（N:retell / N:apply）-> pcNN:retell / pcNN:apply。
       目标已存在时只删旧键；先迁字符串键（较新的值），再迁裸数字键。 */
    migrateKeys:function(done){
      var self = this;
      var finish = function(){ if(done) done(); };
      try{
        var tx = self.db.transaction("recs","readwrite");
        var store = tx.objectStore("recs");
        if(typeof store.getAllKeys !== "function"){ finish(); return; }
        var kg = store.getAllKeys();
        kg.onsuccess = function(){
          var keys = kg.result || [];
          var pairs = [];
          keys.forEach(function(k){
            if(typeof k === "string"){
              var m = /^(\d+):(retell|apply)$/.exec(k);
              if(m) pairs.push({ oldK:k, newK:"pc"+pad2(m[1])+":"+m[2] });
            }
          });
          keys.forEach(function(k){
            if(typeof k === "number") pairs.push({ oldK:k, newK:"pc"+pad2(k)+":retell" });
          });
          if(!pairs.length){ finish(); return; }
          var left = pairs.length;
          var oneDone = function(){ if(--left===0) finish(); };
          pairs.forEach(function(pr){
            var g = store.get(pr.oldK);
            g.onsuccess = function(){
              var val = g.result;
              var tg = store.get(pr.newK);
              tg.onsuccess = function(){
                if(!tg.result && val){ try{ store.put(val, pr.newK); }catch(e){} }
                try{ store.delete(pr.oldK); }catch(e){}
                oneDone();
              };
              tg.onerror = function(){
                try{ store.delete(pr.oldK); }catch(e){}
                oneDone();
              };
            };
            g.onerror = oneDone;
          });
        };
        kg.onerror = function(){ finish(); };
      }catch(e){ finish(); }
    },
    get:function(n, cb){
      var self = this;
      self.open(function(ok){
        if(!ok){ cb(null); return; }
        try{
          var tx = self.db.transaction("recs","readonly");
          var g = tx.objectStore("recs").get(n);
          g.onsuccess = function(){ cb(g.result || null); };
          g.onerror = function(){ cb(null); };
        }catch(e){ cb(null); }
      });
    },
    put:function(n, val, cb){
      var self = this;
      self.open(function(ok){
        if(!ok){ if(cb) cb(false); return; }
        try{
          var tx = self.db.transaction("recs","readwrite");
          tx.objectStore("recs").put(val, n);
          tx.oncomplete = function(){ if(cb) cb(true); };
          tx.onerror = function(){ if(cb) cb(false); };
        }catch(e){ if(cb) cb(false); }
      });
    },
    del:function(n, cb){
      var self = this;
      self.open(function(ok){
        if(!ok){ if(cb) cb(false); return; }
        try{
          var tx = self.db.transaction("recs","readwrite");
          tx.objectStore("recs").delete(n);
          tx.oncomplete = function(){ if(cb) cb(true); };
          tx.onerror = function(){ if(cb) cb(false); };
        }catch(e){ if(cb) cb(false); }
      });
    },
    /* 全部录音：[{key, val}]；IDB 不可用时回调 null */
    getAll:function(cb){
      var self = this;
      self.open(function(ok){
        if(!ok){ cb(null); return; }
        try{
          var tx = self.db.transaction("recs","readonly");
          var store = tx.objectStore("recs");
          if(typeof store.getAllKeys === "function" && typeof store.getAll === "function"){
            var kg = store.getAllKeys();
            kg.onsuccess = function(){
              var keys = kg.result || [];
              var vg = store.getAll();
              vg.onsuccess = function(){
                var vals = vg.result || [];
                var out = [];
                for(var i=0;i<keys.length;i++) out.push({ key:keys[i], val:vals[i] });
                cb(out);
              };
              vg.onerror = function(){ cb(null); };
            };
            kg.onerror = function(){ cb(null); };
          }else{
            /* 旧实现兜底：游标遍历 */
            var out = [];
            var cr = store.openCursor();
            cr.onsuccess = function(){
              var cur = cr.result;
              if(cur){ out.push({ key:cur.key, val:cur.value }); cur.continue(); }
              else cb(out);
            };
            cr.onerror = function(){ cb(null); };
          }
        }catch(e){ cb(null); }
      });
    },
    /* 清空后逐条写入（同一事务）；IDB 不可用或写入失败时回调 false */
    replaceAll:function(list, cb){
      var self = this;
      self.open(function(ok){
        if(!ok){ if(cb) cb(false); return; }
        try{
          var tx = self.db.transaction("recs","readwrite");
          var store = tx.objectStore("recs");
          store.clear();
          list.forEach(function(item){ store.put(item.val, item.key); });
          tx.oncomplete = function(){ if(cb) cb(true); };
          tx.onerror = function(){ if(cb) cb(false); };
          tx.onabort = function(){ if(cb) cb(false); };
        }catch(e){ if(cb) cb(false); }
      });
    }
  };

  /* ---------- session timer (per activity) ---------- */
  var Sess = { activity:null, scene:null, elapsed:0, lastTick:0, timer:null, timeEls:[] };
  function startSession(activity, sceneId, timeEls){
    settleSession();
    Sess.activity = activity; Sess.scene = sceneId;
    Sess.elapsed = 0; Sess.lastTick = Date.now();
    Sess.timeEls = timeEls || [];
    Sess.timer = setInterval(function(){
      var now = Date.now();
      Sess.elapsed += (now-Sess.lastTick)/1000; Sess.lastTick = now;
      Sess.timeEls.forEach(function(id){ var el=$(id); if(el) el.textContent = mmss(Sess.elapsed); });
    }, 500);
  }
  function settleSession(){
    if(Sess.timer){ clearInterval(Sess.timer); Sess.timer = null; }
    if(Sess.activity && Sess.elapsed>0){
      var sec = Sess.elapsed;
      var d = dayRec(todayStr());
      d[Sess.activity] = (d[Sess.activity]||0) + sec;
      S.studySeconds += sec;
      if(Sess.scene){ var sc = scState(Sess.scene); sc.studySec = (sc.studySec||0) + sec; }
      Sess.elapsed = 0;
      saveState();
    }
    Sess.activity = null; Sess.scene = null;
  }
  function pauseSession(){
    if(Sess.timer){
      clearInterval(Sess.timer); Sess.timer = null;
      Sess.elapsed += (Date.now()-Sess.lastTick)/1000;
    }
  }
  function resumeSession(){
    if(Sess.activity && !Sess.timer){
      Sess.lastTick = Date.now();
      Sess.timer = setInterval(function(){
        var now = Date.now();
        Sess.elapsed += (now-Sess.lastTick)/1000; Sess.lastTick = now;
        Sess.timeEls.forEach(function(id){ var el=$(id); if(el) el.textContent = mmss(Sess.elapsed); });
      }, 500);
    }
  }

  /* ---------- confetti ---------- */
  function confetti(){
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var card=$("result-card");
    var colors=["#f6a8b8","#a8d8a8","#f9d976","#a8c8ec","#d3b8e8","#fbc4a0"];
    for(var i=0;i<44;i++){
      var d=document.createElement("span");
      d.className="confetti";
      var sz=5+Math.random()*6;
      d.style.width=sz+"px"; d.style.height=(sz*0.62)+"px";
      d.style.left=(Math.random()*96+2)+"%";
      d.style.background=colors[i%colors.length];
      d.style.animationDuration=(1.1+Math.random()*1.3)+"s";
      d.style.animationDelay=(Math.random()*0.35)+"s";
      card.appendChild(d);
      (function(el){ setTimeout(function(){ el.remove(); },3200); })(d);
    }
  }

  /* ---------- views ---------- */
  var VIEWS=["library","collection","detail","listen","scenemap","shadow","blind","retell","apply","watch","vpractice","perform","learn","fav","mine","result"];
  function show(name){
    Player.stop();
    VPlayer.stop();
    VIEWS.forEach(function(v){ $("view-"+v).classList.toggle("on", v===name); });
    $("tab-library").classList.toggle("on", ["library","collection","detail","listen","scenemap","shadow","blind","retell","apply","watch","vpractice","perform","result"].indexOf(name)>=0);
    $("tab-learn").classList.toggle("on", name==="learn");
    $("tab-fav").classList.toggle("on", name==="fav");
    $("tab-mine").classList.toggle("on", name==="mine");
    updateLearnBadge();
    window.scrollTo(0,0);
  }
  function updateLearnBadge(){
    var n = dueRounds().length, b = $("learn-badge");
    b.hidden = n===0;
    b.textContent = String(n);
  }

  /* ---------- library (card grid) ---------- */
  var curLibCat="全部";
  var libSort="default";
  function renderGrid(){
    var list=COLLECTIONS.filter(function(c){ return curLibCat==="全部" || c.cat===curLibCat; });
    if(libSort==="date"){
      list=list.slice().sort(function(a,b){ return a.date===b.date ? 0 : (a.date<b.date ? 1 : -1); });
    }
    var box=$("lib-grid");
    if(!list.length){
      box.innerHTML='<div class="empty-note" style="grid-column:1/-1">这个分类下还没有合集。</div>';
      return;
    }
    box.innerHTML=list.map(function(c){
      var done = collDone(c), total = collTotal(c);
      var pct = total>0 ? Math.round(done/total*100) : 0;
      var mc = masteredCounts(c.data);
      var fav = !!S.favColls[c.id];
      var heart='<svg width="19" height="19" viewBox="0 0 24 24" fill="'+(fav?"currentColor":"none")+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      return '<div class="card collection-card" data-coll="'+c.id+'" role="button" tabindex="0" aria-label="'+esc(c.title)+'">'
        +'<div class="cover-wrap"><img src="'+c.cover+'" alt="" />'
        +'<button class="fav'+(fav?" on":"")+'" data-favcoll="'+c.id+'" aria-label="收藏合集">'+heart+'</button>'
        +'<span class="lv-badge'+(c.level==="中级"?" mid":"")+'"><i></i>'+c.level+'</span></div>'
        +'<span class="collection-body">'
        +'<span class="collection-title">'+esc(c.title)+'</span>'
        +'<span class="tagrow">'+c.tags.map(function(t){ return '<span class="tag">'+esc(t)+'</span>'; }).join("")+'<span class="coll-date">'+c.date+'</span></span>'
        +'<span class="collection-meta">'+c.meta+'</span>'
        +'<span class="collection-prog"><span class="pbar"><i style="width:'+pct+'%"></i></span>'
        +'<span class="prog-txt">已学 '+done+' / '+total+'（句 '+mc.s+' · 词 '+mc.w+'）</span></span>'
        +'</span></div>';
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".collection-card"), function(card){
      var cid = card.getAttribute("data-coll");
      card.addEventListener("click", function(){ openCollection(cid); });
      card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openCollection(cid); } });
    });
    Array.prototype.forEach.call(box.querySelectorAll("[data-favcoll]"), function(favBtn){
      favBtn.addEventListener("click", function(e){
        e.stopPropagation();
        var cid = favBtn.getAttribute("data-favcoll");
        S.favColls[cid] = !S.favColls[cid];
        saveState();
        renderGrid();
        toast(S.favColls[cid] ? "已收藏这个合集" : "已取消收藏");
      });
    });
  }
  var libChips=$("lib-chips");
  libChips.innerHTML=LIB_CATS.map(function(c){ return '<button class="chip'+(c==="全部"?" on":"")+'" data-cat="'+c+'">'+c+'</button>'; }).join("");
  Array.prototype.forEach.call(libChips.querySelectorAll(".chip"), function(c){
    c.addEventListener("click", function(){
      curLibCat=c.getAttribute("data-cat");
      Array.prototype.forEach.call(libChips.querySelectorAll(".chip"), function(x){ x.classList.toggle("on", x===c); });
      renderGrid();
    });
  });
  $("lib-sort").addEventListener("change", function(){ libSort=this.value; renderGrid(); });

  function continueTarget(){
    if(S.lastScene && !isPassed(S.lastScene)){
      var sc = byId(S.lastScene);
      if(sc) return sc;
    }
    for(var i=0;i<ALL.length;i++){ if(!isPassed(ALL[i].id)) return ALL[i]; }
    return null;
  }
  function sceneProgressText(id){
    var sc = scState(id);
    if(isPassed(id)) return "已通关";
    if(isLearned(id)) return "复习第 "+(sc.reviewRound+1)+" 轮";
    return "首次学习 "+stepsDoneCount(id)+"/5";
  }
  function refreshLibrary(){
    var target = continueTarget();
    if(target){
      $("cont-title").textContent="继续学习";
      $("cont-sub").textContent="场景 "+target.n+" · "+target.t+" · "+collOfScene(target).short+"（"+sceneProgressText(target.id)+"）";
      $("cont-go").onclick=function(){ openDetail(target.id); };
    }else{
      $("cont-title").textContent="全部通关啦";
      $("cont-sub").textContent=ALL.length+" 个场景都已通关，太棒了";
      $("cont-go").onclick=function(){ openCollection(COLLECTIONS[0].id); };
    }
    renderGrid();
  }

  var libSearch=$("lib-search");
  libSearch.addEventListener("input", function(){
    var q=norm(libSearch.value), box=$("lib-results");
    var v=libSearch.value.trim();
    if(!v){ box.hidden=true; box.innerHTML=""; return; }
    var hits=[];
    ALL.forEach(function(sc){
      var hit = sc.t.indexOf(v)>=0;
      if(!hit){ for(var i=0;i<sc.w.length&&!hit;i++) if(norm(sc.w[i][0]).indexOf(q)>=0||sc.w[i][1].indexOf(v)>=0) hit=true; }
      if(!hit){ for(var j=0;j<sc.s.length&&!hit;j++) if(norm(sc.s[j][0]).indexOf(q)>=0||sc.s[j][1].indexOf(v)>=0) hit=true; }
      if(hit) hits.push(sc);
    });
    if(!hits.length){ box.hidden=true; box.innerHTML=""; return; }
    box.hidden=false;
    box.innerHTML=hits.slice(0,20).map(function(sc){
      return '<button class="lib-hit" data-id="'+sc.id+'"><span class="no">'+sc.n+'</span><span class="tt">'+esc(sc.t)+'</span><span class="sb">'+esc(collOfScene(sc).short+' · '+sc.sub)+'</span></button>';
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".lib-hit"), function(b){
      b.addEventListener("click", function(){ openDetail(b.getAttribute("data-id")); });
    });
  });

  /* ---------- collection list ---------- */
  var curColl = COLLECTIONS[0];
  var curSub="全部";
  var rowsColl=null;
  var chipsBox=$("coll-chips");
  var listBox=$("coll-list");
  function buildCollChips(){
    chipsBox.innerHTML=curColl.subs.map(function(s){ return '<button class="chip'+(s==="全部"?" on":"")+'" data-sub="'+s+'">'+s+'</button>'; }).join("");
    Array.prototype.forEach.call(chipsBox.querySelectorAll(".chip"), function(c){
      c.addEventListener("click", function(){
        curSub=c.getAttribute("data-sub");
        Array.prototype.forEach.call(chipsBox.querySelectorAll(".chip"), function(x){ x.classList.toggle("on", x===c); });
        renderCollection();
      });
    });
  }
  function buildCollRows(){
    listBox.innerHTML=curColl.data.map(function(sc){
      return '<button class="card sc-row" data-id="'+sc.id+'" data-sub="'+sc.sub+'" data-t="'+esc(sc.t)+'">'
        +'<span class="sc-num">'+sc.n+'</span>'
        +'<span class="sc-main"><span class="sc-title">'+esc(sc.t)+'<span class="lv">'+sc.lv+'</span></span>'
        +'<span class="sc-sub" style="display:block">'+esc(sc.sub)+' · '+sc.w.length+' 词 · '+sc.s.length+' 句</span></span>'
        +'<span class="sc-prog"><span class="pbar" style="display:block"><i data-bar></i></span><span class="prog-txt" data-ptxt style="display:block"></span></span></button>';
    }).join("");
    Array.prototype.forEach.call(listBox.querySelectorAll(".sc-row"), function(r){
      r.addEventListener("click", function(){ openDetail(r.getAttribute("data-id")); });
    });
    rowsColl = curColl.id;
  }
  function openCollection(collId){
    var c = collOf(collId); if(!c) return;
    curColl = c; curSub = "全部";
    $("coll-search").value = "";
    $("coll-title").textContent = c.title;
    buildCollChips();
    buildCollRows();
    renderCollection();
    show("collection");
  }
  $("coll-search").addEventListener("input", renderCollection);
  function renderCollection(){
    if(rowsColl!==curColl.id) buildCollRows();
    var q=$("coll-search").value.trim(), shown=0;
    Array.prototype.forEach.call(listBox.querySelectorAll(".sc-row"), function(r){
      var id=r.getAttribute("data-id");
      var okSub = curSub==="全部" || r.getAttribute("data-sub")===curSub;
      var okQ = !q || r.getAttribute("data-t").indexOf(q)>=0;
      var vis = okSub&&okQ;
      r.style.display = vis ? "" : "none";
      if(vis){
        shown++;
        var done=itemsDone(id), total=sceneTotal(id);
        var bar=r.querySelector("[data-bar]"); if(bar) bar.style.width=(total>0 ? done/total*100 : 0)+"%";
        var tx=r.querySelector("[data-ptxt]");
        if(tx) tx.textContent = isPassed(id) ? "🏆 已通关" : (done===total ? "已学完" : "已学 "+done+"/"+total);
      }
    });
    $("coll-count").textContent=shown+" 个";
    $("coll-empty").hidden = shown>0;
  }
  $("coll-back").addEventListener("click", function(){ refreshLibrary(); show("library"); });

  /* ---------- detail ---------- */
  var curScene=null;
  var casualPlaying=false;
  var warmupPlaying=false;
  function spkBtn(text){
    return '<button class="spk" data-spk="'+esc(text)+'" aria-label="朗读"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.4 5.6a9 9 0 0 1 0 12.8"/></svg></button>';
  }
  function openDetail(id){
    curScene=byId(id); if(!curScene) return;
    curColl = collOfScene(curScene);
    casualPlaying=false; warmupPlaying=false;
    $("d-casual").textContent="🎧 随心听";
    $("d-casual").classList.remove("playing");
    touchScene(id);
    renderDetail();
    show("detail");
  }
  function renderDetail(){
    var sc=curScene, id=sc.id, st=scState(id);
    var isVd = isVideo(id);
    $("d-from").textContent="来自："+collOfScene(sc).title;
    if(isVd){
      $("d-mat-title").textContent="视频课 · "+sc.t+" · "+sc.en;
      $("d-mat-meta").textContent=sc.sub+" · "+sc.lv+" · "+sc.s.length+" 句 · "+sc.w.length+" 词 · "+mmss(sc.duration);
    }else{
      $("d-mat-title").textContent="场景 "+sc.n+" · "+sc.t;
      $("d-mat-meta").textContent=sc.sub+" · "+sc.lv+" · "+sc.s.length+" 句 · "+sc.w.length+" 词";
    }
    var pct=detailPct(id);
    $("d-mat-bar").style.width=pct+"%";
    $("d-mat-pct").textContent=pct+"%";
    /* v2.7：视频课显示视频播放器卡片，隐藏听前预热卡（预热就是第 1 步看视频）；
       随心听按钮改成播放视频 */
    $("d-video-card").hidden = !isVd;
    $("d-warmup").hidden = isVd;
    $("d-casual").textContent = isVd ? "▶ 播放视频" : "🎧 随心听";
    if(isVd){
      VPlayer.load(sc);
      VPlayer.attach("d-video-slot");
      syncSubtitles(VEl.currentTime || 0);
      applyVideoState();
    }
    var wb=$("d-warmup-btn");
    wb.textContent = st.warmup ? "✓ 已完成" : "播放";
    wb.classList.toggle("done", !!st.warmup);
    /* 首次学习 5 步（视频课用视频步名与完成标志） */
    var cur = currentStep(id);
    $("d-first-count").textContent=stepsDoneCount(id)+"/5";
    var stepNames = isVd ? VSTEP_NAMES : STEP_NAMES;
    var stepSubs = isVd ? VSTEP_SUBS : STEP_SUBS;
    var doneFlags = isVd ? [st.watchDone, listenDone(id), st.blindDone, st.retellDone, st.applyDone]
                         : [listenDone(id), st.shadowDone, st.blindDone, st.retellDone, st.applyDone];
    $("d-first-list").innerHTML=stepNames.map(function(name,i){
      var done=doneFlags[i];
      var locked = !done && cur>=0 && i>cur;
      var isCur = !done && i===cur;
      var stateTxt = done ? "已完成" : (isCur ? "进行中" : (locked ? "🔒 未解锁" : ""));
      var numHtml = done ? "✓" : String(i+1);
      return '<button class="card step-row'+(done?" done":(isCur?" current":(locked?" locked":"")))+'" data-step="'+i+'">'
        +'<span class="num">'+numHtml+'</span>'
        +'<span class="step-main"><span class="step-name">'+name+'</span>'
        +'<span class="step-sub" style="display:block">'+stepSubs[i]+'</span></span>'
        +'<span class="step-state">'+stateTxt+'</span></button>';
    }).join("");
    Array.prototype.forEach.call($("d-first-list").querySelectorAll(".step-row"), function(row){
      row.addEventListener("click", function(){
        var i=parseInt(row.getAttribute("data-step"),10);
        if(!doneFlags[i] && cur>=0 && i>cur){ toast("先完成上一步"); return; }
        openStep(i);
      });
    });
    /* 复习轮次 */
    $("d-round-count").textContent=Math.min(st.reviewRound,5)+"/5";
    $("d-rounds").innerHTML=ROUND_NAMES.map(function(name,r){
      var rs=roundState(id,r), doneN=roundTasksDone(id,r);
      var sub, cls="";
      if(!isLearned(id)){ sub="学完首次学习后开启"; cls="locked"; }
      else if(rs==="done"){ sub="已完成"; cls="done"; }
      else if(rs==="due"){ sub="已到期 · 难句补练 + 全文盲听"; cls="due"; }
      else if(rs==="waiting"){ sub=mdStr(roundDue(id,r))+"到期 · 难句补练 + 全文盲听"; cls="locked"; }
      else{ sub="完成上一轮后解锁"; cls="locked"; }
      var ic = rs==="done" ? "✓" : (rs==="due" ? "⏰" : "🔒");
      return '<button class="card round-row '+cls+'" data-round="'+r+'">'
        +'<span class="r-ic">'+ic+'</span>'
        +'<span class="r-main"><span class="r-name">'+name+'</span>'
        +'<span class="r-sub" style="display:block">'+sub+'</span></span>'
        +'<span class="r-count">'+doneN+'/2</span></button>';
    }).join("");
    Array.prototype.forEach.call($("d-rounds").querySelectorAll(".round-row"), function(row){
      row.addEventListener("click", function(){ openRound(parseInt(row.getAttribute("data-round"),10)); });
    });
    /* 单词与句子参考（视频课：点 🔊 播放该词/该句的视频片段；场景课：TTS 朗读） */
    $("d-ref-count").textContent=sc.w.length+" 词 · "+sc.s.length+" 句";
    $("d-words-title").textContent="单词 · "+sc.w.length+" 个";
    $("d-sents-title").textContent="句子 · "+sc.s.length+" 个";
    $("d-words").innerHTML=sc.w.map(function(w,i){
      return '<div class="card item-row">'
        +(st.words[i]?'<span class="done-dot"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>':"")
        +'<span class="en">'+esc(w[0])+'</span><span class="cn">'+esc(w[1])+'</span>'
        +(isVd ? '<button class="spk" data-vwspk="'+i+'" aria-label="播放片段">🔊</button>' : (synth?spkBtn(w[0]):""))+'</div>';
    }).join("");
    /* v2.4.2：句子列表按该场景的规范句子顺序（全景图顺序）排；rec 仍按数据下标取
       （视频课无全景图，sceneOrder 返回数据顺序） */
    $("d-sents").innerHTML=sceneOrder(id).map(function(di){
      var s=sc.s[di];
      var rec=st.sents[di];
      return '<div class="card item-row sent">'
        +(rec&&rec.sub?'<span class="done-dot" style="margin-top:3px"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>':"")
        +'<span><span class="cn" style="display:block;color:var(--ink);font-weight:800;font-size:15px">'+esc(s[1])+'</span>'
        +'<span class="en" style="display:block;font-size:15px;margin-top:1px">'+esc(s[0])+'</span></span>'
        +(isVd ? '<button class="spk" data-vsspk="'+di+'" aria-label="播放片段">🔊</button>' : (synth?spkBtn(s[0]):""))+'</div>';
    }).join("");
    Array.prototype.forEach.call($("view-detail").querySelectorAll("[data-spk]"), function(b){
      b.addEventListener("click", function(){ speak(b.getAttribute("data-spk")); });
    });
    Array.prototype.forEach.call($("view-detail").querySelectorAll("[data-vwspk]"), function(b){
      b.addEventListener("click", function(){
        var i = parseInt(b.getAttribute("data-vwspk"),10);
        playVideoWord(curScene, i);
      });
    });
    Array.prototype.forEach.call($("view-detail").querySelectorAll("[data-vsspk]"), function(b){
      b.addEventListener("click", function(){
        var di = parseInt(b.getAttribute("data-vsspk"),10);
        playVideoSeg(curScene, di);
      });
    });
    $("d-start").textContent = isPassed(id) ? "已通关" : (isLearned(id) ? "继续复习" : "开始学习");
  }
  /* v2.7：播某词所在句的视频片段（缺视频时回退 TTS 读词）；播某句的视频片段 */
  function playVideoWord(sc, i){
    if(!sc || !sc.words || !sc.words[i]) return;
    var segIdx = sc.words[i].seg;
    if(typeof segIdx === "number" && sc.segments && sc.segments[segIdx] && VPlayer.ok !== false){
      VPlayer.load(sc);
      VPlayer.playSegment(sc.segments[segIdx]);
    }else if(synth){
      speak(sc.w[i][0]);
    }
  }
  function playVideoSeg(sc, di){
    if(!sc || !sc.segments || !sc.segments[di]) return;
    VPlayer.load(sc);
    VPlayer.playSegment(sc.segments[di]);
  }
  function openStep(i){
    if(isVideo(curScene.id)){
      if(i===0) openWatch();
      else if(i===1) openVPractice();
      else if(i===2) openBlind({ mode:"first" });
      else if(i===3) openPerform();
      else openApply();
      return;
    }
    if(i===0) openListen();
    else if(i===1) openShadow({ mode:"first" });
    else if(i===2) openBlind({ mode:"first" });
    else if(i===3) openRetell();
    else openApply();
  }
  function openRound(r){
    var id=curScene.id, st=scState(id);
    if(!isLearned(id)){ toast("学完首次学习后开启复习"); return; }
    var rs=roundState(id,r);
    if(rs==="done"){ toast("这一轮已经完成啦"); return; }
    if(rs==="locked"){ toast("完成上一轮后解锁"); return; }
    if(rs==="waiting"){ toast(mdStr(roundDue(id,r))+"到期"); return; }
    openRoundTask(id, r);
  }
  function openRoundTask(id, r){
    var t=scState(id).reviewTasks[String(r)] || {};
    if(!t.bu) openShadow({ mode:"review", round:r });
    else if(!t.blind) openBlind({ mode:"review", round:r });
  }
  $("d-back").addEventListener("click", function(){ renderCollection(); show("collection"); });
  $("d-back2").addEventListener("click", function(){ renderCollection(); show("collection"); });
  $("d-start").addEventListener("click", function(){
    var id=curScene.id, st=scState(id);
    if(isPassed(id)){ toast("这个场景已经通关啦"); return; }
    if(!isLearned(id)){ openStep(currentStep(id)); return; }
    var r=st.reviewRound;
    if(roundState(id,r)==="due"){ openRoundTask(id,r); return; }
    var due=roundDue(id,r);
    toast(due ? ("下一轮复习 "+mdStr(due)+"到期") : "复习已完成");
  });
  $("d-casual").addEventListener("click", function(){
    var btn=$("d-casual");
    /* v2.7：视频课的随心听 = 播放视频（从头播完；再点停止） */
    if(isVideo(curScene.id)){
      if(casualPlaying){ VPlayer.stop(); casualPlaying=false; btn.textContent="▶ 播放视频"; btn.classList.remove("playing"); return; }
      if(!VPlayer.ensure()) return;
      casualPlaying=true; btn.textContent="⏹ 停止"; btn.classList.add("playing");
      VPlayer.endCb = function(){ casualPlaying=false; btn.textContent="▶ 播放视频"; btn.classList.remove("playing"); };
      VPlayer.playFull();
      return;
    }
    if(casualPlaying){ Player.stop(); casualPlaying=false; btn.textContent="🎧 随心听"; btn.classList.remove("playing"); return; }
    if(warmupPlaying){ Player.stop(); warmupPlaying=false; $("d-warmup-btn").textContent = scState(curScene.id).warmup ? "✓ 已完成" : "播放"; }
    casualPlaying=true; btn.textContent="⏹ 停止"; btn.classList.add("playing");
    /* v2.4.2：按该场景的规范句子顺序（全景图顺序）播放 */
    var list=sceneOrder(curScene.id).map(function(di){ return curScene.s[di][0]; });
    Player.playSeq(list, { onDone:function(){
      casualPlaying=false; btn.textContent="🎧 随心听"; btn.classList.remove("playing");
    }});
  });
  $("d-warmup-btn").addEventListener("click", function(){
    if(isVideo(curScene.id)) return; /* 视频课没有听前预热卡（预热就是第 1 步看视频） */
    var btn=$("d-warmup-btn"), st=scState(curScene.id);
    if(warmupPlaying){ Player.stop(); warmupPlaying=false; btn.textContent = st.warmup ? "✓ 已完成" : "播放"; return; }
    if(casualPlaying){ Player.stop(); casualPlaying=false; $("d-casual").textContent="🎧 随心听"; $("d-casual").classList.remove("playing"); }
    warmupPlaying=true; btn.textContent="播放中…";
    /* v2.4.2：按该场景的规范句子顺序（全景图顺序）播放，与随心听一致 */
    var list=sceneOrder(curScene.id).map(function(di){ return curScene.s[di][0]; });
    Player.playSeq(list, { onDone:function(){
      warmupPlaying=false;
      st.warmup=true; saveState();
      btn.textContent="✓ 已完成"; btn.classList.add("done");
      toast("预热完成，先抓住大意就好");
    }});
  });
  $("d-first-toggle").addEventListener("click", function(){
    var body=$("d-first-list");
    var hidden = body.style.display==="none";
    body.style.display = hidden ? "" : "none";
    this.classList.toggle("open", hidden);
  });
  $("d-ref-toggle").addEventListener("click", function(){
    var body=$("d-ref-body");
    body.hidden = !body.hidden;
    this.classList.toggle("open", !body.hidden);
  });

  /* ---------- 逐句精听 ---------- */
  var L = null;
  function openListen(){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    L = { n:id, sc:curScene, stage:"words", pos:0, order:sceneOrder(id), submitted:false, verdict:null, seenAns:false };
    $("l-title").textContent = "逐句精听 · " + curScene.t;
    /* 看全景按钮：仅有全景图数据的场景显示，无数据的场景界面与之前完全一样 */
    $("l-map-words").hidden = !hasMap(id);
    $("l-map-dict").hidden = !hasMap(id);
    startSession("listen", id, ["l-time","l-time2"]);
    /* v2.4.1：有全景图且未看过，先显示全景图（先建框架再听写）；否则直接进现有流程 */
    if(hasMap(id) && !scState(id).mapSeen){
      openScenemap("start");
      return;
    }
    show("listen");
    enterListenStage();
  }
  function enterListenStage(){
    if(wordsChecked(L.n)===L.sc.w.length){ showDictStage(0); }
    else{ showWordsStage(); }
  }
  function showWordsStage(){
    L.stage = "words";
    $("l-words-wrap").hidden = false;
    $("l-dict-wrap").hidden = true;
    $("l-words-head").textContent = "第一步：听一听这 " + L.sc.w.length + " 个词";
    renderWordsPart();
  }
  function renderWordsPart(){
    var st = scState(L.n);
    $("l-words-done").textContent = "已认识 " + wordsChecked(L.n) + "/" + L.sc.w.length;
    $("l-words").innerHTML = L.sc.w.map(function(w,i){
      var known = !!st.words[i], fav = hasFavWord(L.n, i);
      return '<div class="card word-row">'
        +(synth ? '<button class="spk" data-wspk="'+i+'" aria-label="发音">🔊</button>' : "")
        +'<span class="en">'+esc(w[0])+'</span><span class="cn">'+esc(w[1])+'</span>'
        +'<span class="w-actions"><button class="know'+(known?" on":"")+'" data-know="'+i+'">'+(known?"✓ 认识了":"我认识了")+'</button>'
        +'<button class="star'+(fav?" on":"")+'" data-wfav="'+i+'" aria-label="标记生词">'+(fav?"★":"☆")+'</button></span></div>';
    }).join("");
    Array.prototype.forEach.call($("l-words").querySelectorAll("[data-wspk]"), function(b){
      b.addEventListener("click", function(){ speak(L.sc.w[parseInt(b.getAttribute("data-wspk"),10)][0]); });
    });
    Array.prototype.forEach.call($("l-words").querySelectorAll("[data-know]"), function(b){
      b.addEventListener("click", function(){
        var i = parseInt(b.getAttribute("data-know"),10);
        var st2 = scState(L.n);
        var now = !st2.words[i];
        st2.words[i] = now;
        if(now) bumpNewItems();
        saveState();
        renderWordsPart();
      });
    });
    Array.prototype.forEach.call($("l-words").querySelectorAll("[data-wfav]"), function(b){
      b.addEventListener("click", function(){
        var i = parseInt(b.getAttribute("data-wfav"),10);
        if(hasFavWord(L.n,i)){ delFavWord(L.n,i); toast("已取消收藏"); }
        else{ addFavWord(L.n,i); toast("已收入生词收藏"); }
        renderWordsPart();
      });
    });
    var btn = $("l-to-dict");
    var left = L.sc.w.length - wordsChecked(L.n);
    btn.disabled = left>0;
    btn.textContent = left>0 ? ("还差 "+left+" 个词") : "开始听写句子";
  }
  $("l-to-dict").addEventListener("click", function(){
    if(wordsChecked(L.n)<L.sc.w.length){ toast("先把 "+L.sc.w.length+" 个词都过一遍"); return; }
    showDictStage(0);
  });
  /* v2.4.2：当前句的数据下标 = 显示顺序里的位置换算；L.pos 是位置，数据访问一律用它 */
  function dictDi(){ return (L.order && L.order[L.pos]!==undefined) ? L.order[L.pos] : L.pos; }
  function dictTokens(){ return L.sc.s[dictDi()][0].split(/\s+/); }
  function dictTyped(){
    var v = $("l-input").value;
    return v === "" ? [] : v.split(/\s+/);
  }
  function showDictStage(pos){
    L.stage = "dict";
    L.pos = pos;
    $("l-words-wrap").hidden = true;
    $("l-dict-wrap").hidden = false;
    renderDictSentence(true);
  }
  function renderDictSentence(autoplay){
    var st = scState(L.n), di = dictDi(), rec = st.sents[di] || {};
    L.submitted = false; L.verdict = null; L.seenAns = !!rec.seenAns;
    var inp = $("l-input");
    inp.value = ""; inp.disabled = false;
    var sLen = L.sc.s.length;
    $("l-count").textContent = "第 " + (L.pos+1) + " 句 / 共 " + sLen + " 句";
    $("l-bar").style.width = (L.pos/sLen*100) + "%";
    $("l-submitted").textContent = rec.sub ? "已提交 ✓" : "第 "+(L.pos+1)+" 句";
    $("l-answer").textContent = "";
    $("l-show").textContent = "显示答案";
    $("l-submit").textContent = "提交";
    var fb = $("l-fb"); fb.textContent = ""; fb.className = "feedback";
    $("l-fav").textContent = hasFavSent(L.n, di) ? "★" : "☆";
    $("l-prev").disabled = L.pos===0;
    $("l-next").disabled = L.pos===sLen-1;
    renderUnderlines();
    setTimeout(function(){ try{ inp.focus({preventScroll:true}); }catch(e){ try{ inp.focus(); }catch(e2){} } }, 60);
    if(autoplay) setTimeout(function(){ if(L && L.stage==="dict") speak(L.sc.s[dictDi()][0]); }, 350);
  }
  function renderUnderlines(){
    var toks = dictTokens(), tw = dictTyped();
    var v = $("l-input").value;
    /* v2.7.1：active 跟随光标/选区，而不是只按已完成词数算——点词后高亮要跟着走。
       规则：光标所在词即 active；光标在词首算该词；光标在词后空格算下一词。
       实现：数"词尾在光标之前且词后是空格"的词的个数（即已完成词数，光标在词中/
       词尾未加空格时该词不算完成）。打字过程中与旧逻辑结果完全一致；选区不可读
       时沿用旧逻辑兜底。 */
    var active;
    var ss = null;
    try{ ss = $("l-input").selectionStart; }catch(e){ ss = null; }
    if(ss === null || ss === undefined){
      active = (v.match(/\S+\s+/g)||[]).length;
    } else {
      active = 0;
      var re = /\S+/g, m;
      while((m = re.exec(v))){
        var wEnd = m.index + m[0].length;
        if(wEnd < ss && /\s/.test(v.charAt(wEnd))) active++;
      }
    }
    if(active>=toks.length) active = toks.length-1;
    if(L.submitted) active = -1;
    var html = "";
    for(var i=0;i<toks.length;i++){
      var w = tw[i]||"";
      var cls = "uline";
      if(L.verdict){ cls += L.verdict[i] ? " right" : " wrong"; }
      else if(i===active) cls += " active";
      var corr = (L.verdict && !L.verdict[i]) ? esc(toks[i]) : "";
      html += '<span class="'+cls+'" data-i="'+i+'" style="min-width:'+(toks[i].length+1.5)+'ch">'
        +'<span class="uw">'+esc(w)+'</span><span class="corr">'+corr+'</span></span>';
    }
    $("l-under").innerHTML = html;
    Array.prototype.forEach.call($("l-under").querySelectorAll(".uline"), function(u){
      u.addEventListener("click", function(){
        if(L.submitted) return;
        focusDictWord(parseInt(u.getAttribute("data-i"),10));
      });
    });
  }
  /* v2.7.1：第 idx 个已输入词的字符区间 [start, end)；词不存在返回 null */
  function dictWordSpan(idx){
    var v = $("l-input").value, re = /\S+/g, m, i = 0;
    while((m = re.exec(v))){
      if(i===idx) return { start: m.index, end: m.index + m[0].length };
      i++;
    }
    return null;
  }
  function focusDictWord(idx){
    /* v2.7.1：点词选中整词（打字替换），不要只放光标；点未输入的词时光标到末尾 */
    var inp = $("l-input"), span = dictWordSpan(idx);
    var start = span ? span.start : inp.value.length;
    var end = span ? span.end : inp.value.length;
    try{ inp.focus({preventScroll:true}); }catch(e){ inp.focus(); }
    try{ inp.setSelectionRange(start, end); }catch(e){}
    renderUnderlines();
  }
  $("l-input").addEventListener("input", function(){ if(L && L.stage==="dict" && !L.submitted) renderUnderlines(); });
  $("l-input").addEventListener("click", function(){ if(L && L.stage==="dict" && !L.submitted) renderUnderlines(); });
  $("l-input").addEventListener("keydown", function(e){
    if(e.key==="Enter"){ e.preventDefault(); dictSubmit(); }
  });
  $("l-under").addEventListener("click", function(e){
    if(!L || L.stage!=="dict" || L.submitted) return;
    /* v2.7.1：点在下划线上的点击由 span 处理做聚焦+选中，这里跳过，只处理点空白处的聚焦；
       否则容器重复 focus 可能把编程式选区重置（移动端）。 */
    var t = e && e.target;
    if(t && t.closest && t.closest(".uline")) return;
    var inp = $("l-input");
    try{ inp.focus({preventScroll:true}); }catch(e){ inp.focus(); }
  });
  $("l-play").addEventListener("click", function(){ if(L) speak(L.sc.s[dictDi()][0]); });
  $("l-prev").addEventListener("click", function(){ if(L && L.pos>0){ L.pos--; renderDictSentence(true); } });
  $("l-next").addEventListener("click", function(){ if(L && L.pos<L.sc.s.length-1){ L.pos++; renderDictSentence(true); } });
  /* ---------- v2.3 精听答案发音显示：发音标记英文行 + 中文 + 音标行 + 图例 ---------- */
  function renderMarkedToken(t){
    if(!t.core) return esc(t.text);
    var text = t.text, cs = t.coreStart, ce = cs + t.core.length;
    var pre = text.slice(0, cs), coreText = text.slice(cs, ce), post = text.slice(ce);
    var silentSet = {};
    t.silentIdx.forEach(function(ix){ silentSet[ix] = true; });
    var wordHtml = "";
    for(var i=0;i<coreText.length;i++){
      var ch = esc(coreText.charAt(i));
      if(silentSet[i]) ch = '<span class="silent">'+ch+'</span>';
      else if(i === t.unrelIdx) ch = '<span class="unrel">'+ch+'</span>';
      wordHtml += ch;
    }
    if(t.isWeak) wordHtml = '<span class="weak">'+wordHtml+'</span>';
    return esc(pre) + wordHtml + esc(post);
  }
  function renderMarkedEn(res){
    var parts = [];
    var toks = res.tokens;
    for(var i=0;i<toks.length;i++){
      parts.push(renderMarkedToken(toks[i]));
      if(i < toks.length-1){
        var t = toks[i], nt = toks[i+1];
        /* 连读符号只出现在连读双方直接相邻时（中间隔了数字/标点则不连） */
        if(t.linkAfter && t.linkTarget === nt){
          if(t.linkAfter === "j") parts.push('<span class="link">‿ʲ</span>');
          else if(t.linkAfter === "w") parts.push('<span class="link">‿ʷ</span>');
          else parts.push('<span class="link">‿</span>');
        }else{
          parts.push(" ");
        }
      }
    }
    return parts.join("");
  }
  /* Pron 不可用或分析抛错时降级为 v2.1 的纯中英双语，不报错白屏；
     某词缺音标时该词按原词显示，其余标记照常（Pron.analyze 内处理）。 */
  function renderDictAnswer(en, cn){
    var res = null;
    try{
      if(typeof Pron !== "undefined" && Pron.analyze) res = Pron.analyze(en);
    }catch(e){ res = null; }
    if(!res || !res.tokens || !res.tokens.length){
      return '<span class="ans-en">'+esc(en)+'</span>'
        +'<span class="ans-cn">'+esc(cn)+'</span>';
    }
    var html = '<span class="ans-en">'+renderMarkedEn(res)+'</span>'
      +'<span class="ans-cn">'+esc(cn)+'</span>';
    if(res.sentenceIpa){
      html += '<span class="ans-ipa">/'+esc(res.sentenceIpa)+'/</span>';
    }
    html += '<span class="ans-legend">划掉 = 不发音 · ‿ = 连读 · 虚线下划线 = 失去爆破 · 灰色 = 弱读</span>';
    return html;
  }
  $("l-show").addEventListener("click", function(){
    if(!L || L.stage!=="dict") return;
    var showing = $("l-answer").textContent !== "";
    if(showing){
      $("l-answer").textContent = "";
      this.textContent = "显示答案";
    }else{
      var st = scState(L.n);
      var di = dictDi();
      var rec = st.sents[di] || {};
      rec.seenAns = true; st.sents[di] = rec; saveState();
      L.seenAns = true;
      /* v2.3：答案含发音标记英文行 + 中文翻译 + 音标行 + 图例 */
      $("l-answer").innerHTML = renderDictAnswer(L.sc.s[di][0], L.sc.s[di][1]);
      this.textContent = "隐藏答案";
    }
  });
  $("l-fav").addEventListener("click", function(){
    if(!L) return;
    var di = dictDi();
    if(hasFavSent(L.n, di)){ delFavSent(L.n, di); this.textContent = "☆"; toast("已取消标记"); }
    else{ addFavSent(L.n, di); this.textContent = "★"; toast("已标记为难句"); }
  });
  function dictSubmit(){
    if(!L || L.stage!=="dict") return;
    if(L.submitted){ dictNext(); return; }
    var toks = dictTokens(), tw = dictTyped();
    if(!tw.filter(function(x){ return x.length>0; }).length){ toast("先输入听到的句子"); return; }
    var verdict = [], wrong = [], allOk = true;
    for(var i=0;i<toks.length;i++){
      var good = normWord(tw[i]||"")===normWord(toks[i]);
      verdict.push(good);
      if(!good){ allOk = false; wrong.push(i); }
    }
    var st = scState(L.n);
    var di = dictDi();
    var rec = st.sents[di] || {};
    var firstSub = !rec.sub;
    rec.sub = true; rec.wrong = wrong; rec.seenAns = rec.seenAns || L.seenAns;
    st.sents[di] = rec;
    if(firstSub) bumpNewItems();
    saveState();
    L.submitted = true; L.verdict = verdict;
    $("l-input").disabled = true;
    renderUnderlines();
    var fb = $("l-fb");
    if(allOk && !rec.seenAns){
      fb.textContent = "全对！";
      fb.className = "feedback good";
    }else{
      fb.textContent = wrong.length>0 ? ("有 "+wrong.length+" 个词不对") : "看过答案，再听一遍吧";
      fb.className = "feedback bad";
      $("l-card").classList.remove("shake"); void $("l-card").offsetWidth; $("l-card").classList.add("shake");
    }
    if(wrong.length>0 || rec.seenAns){
      if(addFavSent(L.n, di)){
        toast("已自动加入收藏");
        $("l-fav").textContent = "★";
      }
    }
    /* v1.9：写错的词若是本场景关键词，也自动收入收藏（词汇）；多词关键词按分词匹配；虚词不触发 */
    var STOPW = { the:1, a:1, an:1, and:1, or:1, but:1, in:1, on:1, at:1, to:1, of:1, for:1, with:1, from:1, by:1, as:1, is:1, are:1, was:1, were:1, be:1, been:1, am:1, do:1, does:1, did:1, i:1, you:1, he:1, she:1, it:1, we:1, they:1, my:1, your:1, his:1, her:1, its:1, our:1, their:1, this:1, that:1, these:1, those:1, there:1, here:1, not:1, no:1, so:1, very:1 };
    wrong.forEach(function(wi){
      var tok = normWord(toks[wi]);
      if(!tok || STOPW[tok]) return;
      for(var j=0;j<L.sc.w.length;j++){
        var parts = L.sc.w[j][0].split(/\s+/);
        for(var k=0;k<parts.length;k++){
          if(normWord(parts[k])===tok){ addFavWord(L.n, j); return; }
        }
      }
    });
    $("l-submit").textContent = L.pos===L.sc.s.length-1 ? "完成" : "下一句";
    $("l-submitted").textContent = "已提交 ✓";
  }
  function dictNext(){
    if(L.pos>=L.sc.s.length-1){
      var justLearned = checkLearned(L.n);
      toast(justLearned ? "学完啦！复习计划已开启，第一轮复习明天到期" : "精听完成");
      settleSession();
      openDetail(L.n);
      return;
    }
    L.pos++;
    renderDictSentence(true);
  }
  $("l-submit").addEventListener("click", dictSubmit);
  $("l-back").addEventListener("click", function(){ settleSession(); openDetail(curScene.id); });

  /* ---------- 看视频（视频课第 1 步） ----------
     完整看一遍；看完（ended 事件）或手动点"我看完了"完成。 */
  var W = null;
  function openWatch(){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    W = { n:id, sc:curScene };
    $("w-title").textContent = "看视频 · " + curScene.t;
    $("w-meta").textContent = "完整看一遍 · " + mmss(curScene.duration);
    VPlayer.load(curScene);
    VPlayer.attach("w-slot");
    applyVideoState();
    show("watch");
    startSession("listen", id, ["w-time"]);
    /* 看完自动完成：ended 回调在 show 之后设置（show 会清掉它） */
    VPlayer.endCb = function(){ if(W) completeWatch(); };
  }
  function completeWatch(){
    if(!W) return;
    var id = W.n;
    W = null;
    settleSession();
    var st = scState(id);
    st.watchDone = true; saveState();
    var justLearned = checkLearned(id);
    toast(justLearned ? "学完啦！复习计划已开启" : "看视频完成");
    openDetail(id);
  }
  $("w-done").addEventListener("click", function(){ completeWatch(); });
  $("w-back").addEventListener("click", function(){ W = null; settleSession(); openDetail(curScene.id); });

  /* ---------- 逐句跟练（视频课第 2 步） ----------
     词热身（复用精听热身模式：打勾 + ☆ 生词；发音优先放该词所在句的视频片段，
     缺视频时回退 TTS）→ 逐句：放视频片段 → 跟唱/跟读 → "我练完了"记练过（sents
     记 {sub:true, practiced:true}，与精听听写区分开，不计入"掌握句数"）；
     ☆ 标难句进收藏。试点范围：逐句不做单句录音（录音在完整演绎做）。 */
  var VP = null;
  function openVPractice(){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    VP = { n:id, sc:curScene, stage:"words", pos:0 };
    $("vp-title").textContent = "逐句跟练 · " + curScene.t;
    VPlayer.load(curScene);
    applyVideoState();
    show("vpractice");
    startSession("shadow", id, ["vp-time","vp-time2"]);
    enterVPStage();
  }
  function enterVPStage(){
    if(wordsChecked(VP.n)===VP.sc.w.length){ showVPSegs(0); }
    else{ showVPWords(); }
  }
  function showVPWords(){
    VP.stage = "words";
    $("vp-words-wrap").hidden = false;
    $("vp-segs-wrap").hidden = true;
    $("vp-words-head").textContent = "第一步：听一听这 " + VP.sc.w.length + " 个词";
    renderVPWords();
  }
  function renderVPWords(){
    var st = scState(VP.n);
    $("vp-words-done").textContent = "已认识 " + wordsChecked(VP.n) + "/" + VP.sc.w.length;
    $("vp-words").innerHTML = VP.sc.w.map(function(w,i){
      var known = !!st.words[i], fav = hasFavWord(VP.n, i);
      return '<div class="card word-row">'
        +'<button class="spk" data-vwspk="'+i+'" aria-label="发音">🔊</button>'
        +'<span class="en">'+esc(w[0])+'</span><span class="cn">'+esc(w[1])+'</span>'
        +'<span class="w-actions"><button class="know'+(known?" on":"")+'" data-know="'+i+'">'+(known?"✓ 认识了":"我认识了")+'</button>'
        +'<button class="star'+(fav?" on":"")+'" data-wfav="'+i+'" aria-label="标记生词">'+(fav?"★":"☆")+'</button></span></div>';
    }).join("");
    Array.prototype.forEach.call($("vp-words").querySelectorAll("[data-vwspk]"), function(b){
      b.addEventListener("click", function(){ playVideoWord(VP.sc, parseInt(b.getAttribute("data-vwspk"),10)); });
    });
    Array.prototype.forEach.call($("vp-words").querySelectorAll("[data-know]"), function(b){
      b.addEventListener("click", function(){
        var i = parseInt(b.getAttribute("data-know"),10);
        var st2 = scState(VP.n);
        var now = !st2.words[i];
        st2.words[i] = now;
        if(now) bumpNewItems();
        saveState();
        renderVPWords();
      });
    });
    Array.prototype.forEach.call($("vp-words").querySelectorAll("[data-wfav]"), function(b){
      b.addEventListener("click", function(){
        var i = parseInt(b.getAttribute("data-wfav"),10);
        if(hasFavWord(VP.n,i)){ delFavWord(VP.n,i); toast("已取消收藏"); }
        else{ addFavWord(VP.n,i); toast("已收入生词收藏"); }
        renderVPWords();
      });
    });
    var btn = $("vp-to-segs");
    var left = VP.sc.w.length - wordsChecked(VP.n);
    btn.disabled = left>0;
    btn.textContent = left>0 ? ("还差 "+left+" 个词") : "开始逐句跟练";
  }
  $("vp-to-segs").addEventListener("click", function(){
    if(!VP) return;
    if(wordsChecked(VP.n)<VP.sc.w.length){ toast("先把 "+VP.sc.w.length+" 个词都过一遍"); return; }
    showVPSegs(0);
  });
  function showVPSegs(pos){
    VP.stage = "segs";
    VP.pos = pos;
    $("vp-words-wrap").hidden = true;
    $("vp-segs-wrap").hidden = false;
    VPlayer.attach("vp-slot");
    renderVPSeg(true);
  }
  function renderVPSeg(autoplay){
    var st = scState(VP.n), di = VP.pos, rec = st.sents[di] || {};
    var sLen = VP.sc.s.length;
    var seg = VP.sc.segments[di];
    $("vp-count").textContent = "第 " + (di+1) + " 句 / 共 " + sLen + " 句" + (seg ? "（第 " + seg.verse + " 段）" : "");
    $("vp-bar").style.width = (di/sLen*100) + "%";
    $("vp-submitted").textContent = rec.sub ? "已练过 ✓" : "第 "+(di+1)+" 句";
    /* v2.8：逐句跟练加发音提示——标记英文（复用 v2.3 renderMarkedEn）+ 音标行；
       Pron 不可用/抛错时降级为原英文，不报错。 */
    var en = VP.sc.s[di][0], res = null;
    try{ if(typeof Pron !== "undefined" && Pron.analyze) res = Pron.analyze(en); }catch(e){ res = null; }
    if(res && res.tokens && res.tokens.length){
      $("vp-en").innerHTML = renderMarkedEn(res);
      $("vp-ipa").textContent = res.sentenceIpa ? "/" + res.sentenceIpa + "/" : "";
    }else{
      $("vp-en").textContent = en;
      $("vp-ipa").textContent = "";
    }
    $("vp-cn").textContent = VP.sc.s[di][1];
    $("vp-fav").textContent = hasFavSent(VP.n, di) ? "★" : "☆";
    $("vp-prev").disabled = di===0;
    $("vp-next").disabled = di===sLen-1;
    var fb = $("vp-fb"); fb.textContent = ""; fb.className = "feedback";
    if(autoplay && VPlayer.ok !== false) setTimeout(function(){
      if(VP && VP.stage==="segs") playVideoSeg(VP.sc, VP.pos);
    }, 350);
  }
  $("vp-play").addEventListener("click", function(){ if(VP) playVideoSeg(VP.sc, VP.pos); });
  $("vp-prev").addEventListener("click", function(){ if(VP && VP.pos>0){ VP.pos--; renderVPSeg(true); } });
  $("vp-next").addEventListener("click", function(){ if(VP && VP.pos<VP.sc.s.length-1){ VP.pos++; renderVPSeg(true); } });
  $("vp-fav").addEventListener("click", function(){
    if(!VP) return;
    var di = VP.pos;
    if(hasFavSent(VP.n, di)){ delFavSent(VP.n, di); this.textContent = "☆"; toast("已取消标记"); }
    else{ addFavSent(VP.n, di); this.textContent = "★"; toast("已标记为难句"); }
  });
  $("vp-done").addEventListener("click", function(){
    if(!VP) return;
    var st = scState(VP.n), di = VP.pos;
    var rec = st.sents[di] || {};
    var firstSub = !rec.sub;
    rec.sub = true; rec.practiced = true;
    st.sents[di] = rec;
    if(firstSub) bumpNewItems();
    saveState();
    $("vp-submitted").textContent = "已练过 ✓";
    if(VP.pos >= VP.sc.s.length-1){
      var justLearned = checkLearned(VP.n);
      toast(justLearned ? "学完啦！复习计划已开启" : "跟练完成");
      settleSession();
      openDetail(VP.n);
      return;
    }
    VP.pos++;
    renderVPSeg(true);
  });
  $("vp-back").addEventListener("click", function(){ settleSession(); openDetail(curScene.id); });

  /* ---------- 完整演绎（视频课第 4 步） ----------
     放完整视频，跟着整首唱/整段演；录音复用 makeRecorder（键 vd01:perform，
     多条保留）；点"演绎完成"自评完成。 */
  var PF = null;
  var pfPlaying = false;
  function openPerform(){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    PF = { n:id, sc:curScene,
      rec: makeRecorder({ recBtn:"pf-rec", recTimer:"pf-rec-timer", recRow:"pf-recrow",
        keyOf:function(x){ return x+":perform"; }, dlName:function(x){ return "视频"+x+"-演绎.webm"; } }) };
    $("pf-title").textContent = "完整演绎 · " + curScene.t;
    $("pf-meta").textContent = (curScene.type==="song" ? "整首 · " : "整段 · ") + curScene.s.length + " 句";
    VPlayer.load(curScene);
    VPlayer.attach("pf-slot");
    applyVideoState();
    show("perform");
    startSession("retell", id, ["pf-time"]);
    PF.rec.open(id);
    $("pf-play").textContent = "▶ 播放整段";
  }
  $("pf-play").addEventListener("click", function(){
    if(!PF) return;
    if(pfPlaying){ VPlayer.stop(); pfPlaying = false; this.textContent = "▶ 播放整段"; return; }
    if(!VPlayer.ensure()) return;
    pfPlaying = true; this.textContent = "⏹ 停止";
    var self = this;
    VPlayer.endCb = function(){ pfPlaying = false; self.textContent = "▶ 播放整段"; };
    VPlayer.playFull();
  });
  $("pf-rec").addEventListener("click", function(){ if(PF) PF.rec.toggle(); });
  $("pf-done").addEventListener("click", function(){
    if(!PF) return;
    var id = PF.n;
    stopStreams();
    settleSession();
    var st = scState(id);
    st.retellDone = true; saveState();
    var justLearned = checkLearned(id);
    toast(justLearned ? "学完啦！复习计划已开启，第一轮复习明天到期" : "演绎完成");
    openDetail(id);
  });
  $("pf-back").addEventListener("click", function(){ stopStreams(); settleSession(); openDetail(curScene.id); });

  /* ---------- 场景全景图（v2.5：全部 137 个场景） ----------
     先行组织者：进精听先看一眼整个场景（谁、在哪、干什么、每句在什么时候说），
     建好框架再听写。两种进入方式：
     start：首次进精听（mapSeen 未设置），点「开始学习」置 mapSeen 并进热身/听写，
            返回回到场景详情页；
     peek：热身/听写中点「看全景」随时回顾，只切换视图，不碰 L、不结算/重启计时，
            返回原样回到热身/听写。 */
  var SM = null; /* { n, from:"start"|"peek" } */
  function openScenemap(from){
    var id = curScene.id, m = MAPS[id];
    if(!m) return;
    SM = { n:id, from:from };
    renderScenemap();
    $("sm-start").hidden = (from !== "start");
    show("scenemap");
  }
  function renderScenemap(){
    var sc = curScene, m = MAPS[SM.n];
    $("sm-title").textContent = "场景全景图 · " + sc.t;
    /* v2.5：when/where/who 可能为空字符串（词汇场景不适用），只渲染非空项，全空则不渲染 meta 行 */
    var meta = [];
    if(m.when) meta.push('<span>🕐 ' + esc(m.when) + '</span>');
    if(m.where) meta.push('<span>📍 ' + esc(m.where) + '</span>');
    if(m.who) meta.push('<span>👨‍👩‍👧 ' + esc(m.who) + '</span>');
    $("sm-scene").innerHTML = '<div class="sm-scene-line">' + esc(m.scene) + '</div>'
      + (meta.length ? '<div class="sm-meta">' + meta.join("") + '</div>' : '');
    $("sm-groups").innerHTML = m.groups.map(function(g){
      var rows = g.sents.map(function(si){
        var s = sc.s[si];
        if(!s) return "";
        return '<div class="sm-sent" data-smspk="' + si + '" role="button" tabindex="0">'
          + '<span class="sm-sent-txt"><span class="sm-en">' + esc(s[0]) + '</span>'
          + '<span class="sm-cn">' + esc(s[1]) + '</span></span>'
          + '<span class="sm-spk" aria-label="发音">🔊</span></div>';
      }).join("");
      return '<div class="card sm-group"><div class="sm-ghead"><span class="sm-icon">'
        + g.icon + '</span><span class="sm-gtitle">' + esc(g.title) + '</span></div>' + rows + '</div>';
    }).join("");
    Array.prototype.forEach.call($("sm-groups").querySelectorAll("[data-smspk]"), function(el){
      el.addEventListener("click", function(){
        var si = parseInt(el.getAttribute("data-smspk"), 10);
        if(curScene.s[si]) speak(curScene.s[si][0]);
      });
    });
  }
  $("sm-start").addEventListener("click", function(){
    if(!SM) return;
    var st = scState(SM.n);
    st.mapSeen = true; saveState();
    SM = null;
    show("listen");
    enterListenStage();
  });
  $("sm-back").addEventListener("click", function(){
    if(!SM) return;
    if(SM.from === "peek"){
      SM = null;
      show("listen"); /* 只切回视图：L、输入框、下划线、计时都原样不动 */
    }else{
      SM = null;
      settleSession();
      openDetail(curScene.id);
    }
  });
  $("l-map-words").addEventListener("click", function(){ if(L) openScenemap("peek"); });
  $("l-map-dict").addEventListener("click", function(){ if(L) openScenemap("peek"); });

  /* ---------- 难句跟读 / 难句补练 ---------- */
  var SH = null;
  function shadowDoneMap(){
    var st = scState(SH.n);
    if(SH.ctx.mode==="review"){
      var t = st.reviewTasks[String(SH.ctx.round)] || {};
      if(!t.buIdx) t.buIdx = {};
      st.reviewTasks[String(SH.ctx.round)] = t;
      return t.buIdx;
    }
    return st.shadowIdx;
  }
  function openShadow(ctx){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    /* v2.1：跟读逐句录音，键 = 场景 id:shadow:句子索引（如 pc01:shadow:3） */
    SH = { ctx:ctx, n:id, sc:curScene, queue:[], qi:0, ansVisible:false,
      rec: makeRecorder({ recBtn:"sh-rec", recTimer:"sh-rec-timer", recRow:"sh-recrow",
        keyOf:function(x){ return x; },
        dlName:function(x){ return "跟读"+String(x).replace(/:/g,"-")+".webm"; } }) };
    var done = shadowDoneMap();
    SH.queue = sceneFavSents(id).filter(function(si){ return !done[si]; });
    if(!SH.queue.length){
      /* 没有难句，自动完成 */
      if(ctx.mode==="review"){ completeReviewTask(id, ctx.round, "bu", true); return; }
      var st = scState(id);
      st.shadowDone = true; saveState();
      var justLearned = checkLearned(id);
      toast(justLearned ? "学完啦！复习计划已开启" : "没有标记难句，自动完成");
      openDetail(id);
      return;
    }
    $("sh-title").textContent = (ctx.mode==="review" ? "难句补练 · " : "难句跟读 · ") + curScene.t;
    $("sh-mode").textContent = ctx.mode==="review" ? ROUND_NAMES[ctx.round] : "首次学习";
    if(isVideo(id)){
      VPlayer.load(curScene);
      applyVideoState();
    }
    show("shadow");
    startSession("shadow", id, ["sh-time"]);
    renderShadow();
  }
  function renderShadow(){
    var si = SH.queue[SH.qi], st = scState(SH.n);
    var sent = SH.sc.s[si];
    var rec = st.sents[si] || {};
    var wrongIdx = rec.wrong || [];
    var toks = sent[0].split(/\s+/);
    $("sh-en").innerHTML = toks.map(function(t,i){
      return wrongIdx.indexOf(i)>=0 ? '<span class="hl">'+esc(t)+'</span>' : esc(t);
    }).join(" ");
    $("sh-cn").textContent = sent[1];
    $("sh-wrong").textContent = wrongIdx.length ? ("精听打错的词：" + wrongIdx.map(function(i){ return toks[i]; }).join("、")) : "";
    $("sh-count").textContent = "第 " + (SH.qi+1) + " 句 / 共 " + SH.queue.length + " 句";
    $("sh-bar").style.width = (SH.qi/SH.queue.length*100) + "%";
    var fb = $("sh-fb"); fb.textContent = ""; fb.className = "feedback";
    /* v2.1：切句时答案重置为隐藏，并打开本句的录音 */
    setShadowAnswer(false);
    SH.rec.open(SH.n+":shadow:"+si);
  }
  /* v2.1：跟读答案默认隐藏，显示占位提示；按钮切换显示/隐藏 */
  function setShadowAnswer(show){
    SH.ansVisible = show;
    $("sh-en").hidden = !show;
    $("sh-cn").hidden = !show;
    $("sh-wrong").hidden = !show;
    $("sh-hint").hidden = show;
    $("sh-show").textContent = show ? "隐藏答案" : "显示答案";
  }
  /* v2.1：切句/返回前，若正在录音或播放，先停掉（stopAll 会关麦克风，
     所以只在确实忙时调用，避免每句都重新请求麦克风） */
  function shadowStopIfBusy(){
    if(SH && SH.rec && SH.rec.busy()) SH.rec.stopAll();
  }
  $("sh-show").addEventListener("click", function(){ if(SH) setShadowAnswer(!SH.ansVisible); });
  $("sh-rec").addEventListener("click", function(){ if(SH) SH.rec.toggle(); });
  $("sh-orig").addEventListener("click", function(){
    if(!SH) return;
    /* v2.7：视频课难句补练播原句视频片段（常速）；场景课 TTS */
    if(isVideo(SH.n)){ playVideoSeg(SH.sc, SH.queue[SH.qi]); return; }
    speak(SH.sc.s[SH.queue[SH.qi]][0]);
  });
  $("sh-slow").addEventListener("click", function(){
    if(!SH) return;
    /* v2.7：视频课慢速播该句视频片段（0.65 倍速）；场景课 TTS 慢速 */
    if(isVideo(SH.n)){
      VPlayer.load(SH.sc);
      VPlayer.playSegment(SH.sc.segments[SH.queue[SH.qi]], null, 0.65);
      return;
    }
    speak(SH.sc.s[SH.queue[SH.qi]][0], 0.65);
  });
  $("sh-done").addEventListener("click", function(){
    if(!SH) return;
    shadowStopIfBusy();
    var si = SH.queue[SH.qi];
    var done = shadowDoneMap();
    done[si] = true; saveState();
    SH.qi++;
    if(SH.qi>=SH.queue.length){ completeShadow(); return; }
    renderShadow();
  });
  $("sh-unmark").addEventListener("click", function(){
    if(!SH) return;
    shadowStopIfBusy();
    var si = SH.queue[SH.qi];
    delFavSent(SH.n, si);
    var done = shadowDoneMap();
    delete done[si]; saveState();
    SH.queue.splice(SH.qi, 1);
    toast("已取消标记");
    if(!SH.queue.length){ completeShadow(); return; }
    if(SH.qi>=SH.queue.length) SH.qi = SH.queue.length-1;
    renderShadow();
  });
  function completeShadow(){
    var id = SH.n, ctx = SH.ctx;
    settleSession();
    if(ctx.mode==="review"){ completeReviewTask(id, ctx.round, "bu", false); return; }
    var st = scState(id);
    st.shadowDone = true; saveState();
    var justLearned = checkLearned(id);
    toast(justLearned ? "学完啦！复习计划已开启" : "跟读完成");
    openDetail(id);
  }
  $("sh-back").addEventListener("click", function(){ shadowStopIfBusy(); settleSession(); openDetail(curScene.id); });

  /* ---------- 全文盲听 ---------- */
  var B = null;
  function openBlind(ctx){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    B = { ctx:ctx, n:id, sc:curScene, playing:false, curIdx:0, order:sceneOrder(id) };
    $("b-title").textContent = "全文盲听 · " + curScene.t;
    $("b-mode").textContent = ctx.mode==="review" ? ROUND_NAMES[ctx.round] : "首次学习";
    if(isVideo(id)){
      VPlayer.load(curScene);
      applyVideoState();
    }
    show("blind");
    startSession("blind", id, ["b-time"]);
    $("b-count").textContent = "第 0/" + B.sc.s.length + " 句";
    $("b-bar").style.width = "0%";
    $("b-status").textContent = "点播放，全文按顺序播一遍";
    $("b-plays").textContent = "已听 " + (scState(id).blindPlays||0) + " 遍";
    $("b-play").textContent = "▶ 播放全文";
  }
  $("b-play").addEventListener("click", function(){
    if(!B) return;
    if(B.playing){
      Player.stop(); VPlayer.stop(); B.playing = false;
      this.textContent = "▶ 播放全文";
      $("b-status").textContent = "已暂停，可继续播放";
      return;
    }
    B.playing = true;
    this.textContent = "⏹ 停止";
    /* v2.7：视频课盲听按顺序播各句的视频片段（只听声音，画面不显示）；场景课 TTS */
    if(isVideo(B.n)){
      var segs = B.order.map(function(di){ return B.sc.segments[di]; });
      var sLenV = B.sc.s.length;
      var started = VPlayer.playSeqSegs(segs, {
        onItem:function(i){
          B.curIdx = i;
          $("b-count").textContent = "第 " + (i+1) + "/" + sLenV + " 句";
          $("b-bar").style.width = ((i+1)/sLenV*100) + "%";
          $("b-status").textContent = "正在播放第 " + (i+1) + " 句";
        },
        onDone:function(){
          B.playing = false;
          $("b-play").textContent = "▶ 播放全文";
          var st = scState(B.n);
          st.blindPlays = (st.blindPlays||0)+1; saveState();
          $("b-plays").textContent = "已听 " + st.blindPlays + " 遍";
          $("b-status").textContent = "播完了，可以再听一遍或点听懂大意了";
        }
      });
      if(!started){
        B.playing = false;
        $("b-play").textContent = "▶ 播放全文";
      }
      return;
    }
    /* v2.4.2：按该场景的规范句子顺序（全景图顺序）播放；onItem 的 i 是位置 */
    var list = B.order.map(function(di){ return B.sc.s[di][0]; });
    var sLen = B.sc.s.length;
    Player.playSeq(list, {
      onItem:function(i){
        B.curIdx = i;
        $("b-count").textContent = "第 " + (i+1) + "/" + sLen + " 句";
        $("b-bar").style.width = ((i+1)/sLen*100) + "%";
        $("b-status").textContent = "正在播放第 " + (i+1) + " 句";
      },
      onDone:function(){
        B.playing = false;
        $("b-play").textContent = "▶ 播放全文";
        var st = scState(B.n);
        st.blindPlays = (st.blindPlays||0)+1; saveState();
        $("b-plays").textContent = "已听 " + st.blindPlays + " 遍";
        $("b-status").textContent = "播完了，可以再听一遍或点听懂大意了";
      }
    });
  });
  $("b-replay").addEventListener("click", function(){
    if(!B) return;
    /* v2.4.2：curIdx 是位置，换算成数据下标再取句 */
    var di = (B.order && B.order[B.curIdx]!==undefined) ? B.order[B.curIdx] : B.curIdx;
    /* v2.7：视频课重播当前句的视频片段；场景课 TTS 重播当前句 */
    if(isVideo(B.n)){ playVideoSeg(B.sc, di); }
    else{ speak(B.sc.s[di][0]); }
    $("b-status").textContent = "正在重听第 " + (B.curIdx+1) + " 句";
  });
  $("b-done").addEventListener("click", function(){
    if(!B) return;
    var id = B.n, ctx = B.ctx;
    settleSession();
    if(ctx.mode==="review"){ completeReviewTask(id, ctx.round, "blind", false); return; }
    var st = scState(id);
    st.blindDone = true; saveState();
    var justLearned = checkLearned(id);
    toast(justLearned ? "学完啦！复习计划已开启" : "盲听完成");
    openDetail(id);
  });
  $("b-back").addEventListener("click", function(){ settleSession(); openDetail(curScene.id); });

  /* ---------- 录音器（复述、场景应用、跟读逐句共用；多条保留，见 normRecVal） ---------- */
  function pickMime(){
    if(!("MediaRecorder" in window)) return "";
    var cands = ["audio/webm;codecs=opus","audio/webm","audio/ogg","audio/mp4"];
    for(var i=0;i<cands.length;i++){ try{ if(MediaRecorder.isTypeSupported(cands[i])) return cands[i]; }catch(e){} }
    return "";
  }
  /* v2.2：录音值归一化为 {list:[...]}。
     新格式：{list:[{blob,durationSec,createdAt}|{downloaded:true,...}]}；
     旧格式（v2.1 及以前）：单条 {blob,...} 或 {downloaded:true,...}，包成单条 list。
     返回 {list, migrated}——migrated=true 表示读到旧格式，调用方应把新格式写回自愈。
     录音器 R.open 与备份 collectRecordings 共用。 */
  function normRecVal(v){
    if(!v || typeof v!=="object") return { list:[], migrated:false };
    if(Array.isArray(v.list)){
      var kept = v.list.filter(function(x){ return x && typeof x==="object" && (x.blob || x.downloaded); });
      return { list:kept, migrated:false };
    }
    if(v.downloaded) return { list:[{ downloaded:true, durationSec:v.durationSec||0, createdAt:v.createdAt||0 }], migrated:true };
    if(v.blob) return { list:[{ blob:v.blob, durationSec:v.durationSec||0, createdAt:v.createdAt||0 }], migrated:true };
    return { list:[], migrated:false };
  }
  function makeRecorder(cfg){
    var R = { n:null, stream:null, mr:null, chunks:[], timer:null, start:0,
      audio:null, audioUrl:null, items:[], playing:false, playingIdx:-1, curKey:null };
    function recBtn(){ return $(cfg.recBtn); }
    /* 是否正在录音或正在播放（跟读切句时用：只在忙时调 stopAll，避免每句都重开麦克风） */
    R.busy = function(){
      return (R.mr && R.mr.state!=="inactive") || R.playing;
    };
    /* 丢弃当前播放对象（切句/切条/删除/停止时用） */
    function dropAudio(){
      if(R.audio){ try{ R.audio.pause(); }catch(e){} R.audio = null; }
      if(R.audioUrl){ try{ URL.revokeObjectURL(R.audioUrl); }catch(e){} R.audioUrl = null; }
      R.playing = false;
      R.playingIdx = -1;
    }
    R.open = function(n){
      R.n = n;
      /* v2.1：同一实例逐句复用（跟读）时，先丢弃旧播放状态，否则点播放可能播出上一句的录音 */
      dropAudio();
      R.items = [];
      R.renderRow();
      recBtn().textContent = "● 录音";
      recBtn().classList.remove("recording");
      $(cfg.recTimer).textContent = "";
      IDB.get(cfg.keyOf(n), function(rec){
        if(R.n!==n) return;
        var norm = normRecVal(rec);
        R.items = norm.list;
        /* v2.2：读到旧格式就写回新格式自愈（尽力而为，失败不阻塞） */
        if(norm.migrated && R.items.length) IDB.put(cfg.keyOf(n), { list:R.items }, function(){});
        R.renderRow();
      });
    };
    /* v2.2：渲染多条录音列表，每条一行：序号 + 时长 + 录制时间 + 播放/删除按钮；
       按钮用 data-play/data-del + 下标绑定（不要用固定 id） */
    R.renderRow = function(){
      var row = $(cfg.recRow);
      if(!R.items || !R.items.length){ row.hidden = true; row.innerHTML = ""; return; }
      row.hidden = false;
      row.innerHTML = R.items.map(function(it, i){
        var label, playBtn;
        if(it.downloaded){
          label = "第 "+(i+1)+" 条 · 录音已下载到文件（"+mmss(it.durationSec||0)+"）";
          playBtn = "";
        }else{
          var t = fmtRecTime(it.createdAt);
          label = "第 "+(i+1)+" 条 · "+mmss(it.durationSec||0) + (t ? " · "+t : "");
          playBtn = '<button class="rec-play" data-play="'+i+'">'+((R.playingIdx===i && R.playing) ? "⏸" : "▶")+'</button>';
        }
        return '<div class="rec-saved">'+playBtn
          +'<span class="rec-info">'+esc(label)+'</span>'
          +'<button class="rec-del" data-del="'+i+'" aria-label="删除录音">🗑</button></div>';
      }).join("");
      Array.prototype.forEach.call(row.querySelectorAll("[data-play]"), function(b){
        b.addEventListener("click", function(){ R.playToggle(parseInt(b.getAttribute("data-play"),10)); });
      });
      Array.prototype.forEach.call(row.querySelectorAll("[data-del]"), function(b){
        b.addEventListener("click", function(){ R.del(parseInt(b.getAttribute("data-del"),10)); });
      });
    };
    R.toggle = function(){
      if(R.mr && R.mr.state!=="inactive"){ R.stopRec(); return; }
      R.startRec();
    };
    R.startRec = function(){
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !("MediaRecorder" in window)){
        toast("当前浏览器不支持录音");
        return;
      }
      var begin = function(stream){
        R.stream = stream;
        R.chunks = [];
        /* v2.1：录音开始时捕获目标键；录音中途若已切到别的句子，
           完成时仍存到开始时那句的键下（finishRec 里用 R.curKey） */
        R.curKey = cfg.keyOf(R.n);
        try{
          var mime = pickMime();
          R.mr = mime ? new MediaRecorder(stream, { mimeType:mime }) : new MediaRecorder(stream);
        }catch(e){ toast("无法开始录音"); return; }
        R.mr.ondataavailable = function(e){ if(e.data && e.data.size) R.chunks.push(e.data); };
        R.mr.onstop = function(){ R.finishRec(); };
        R.start = Date.now();
        recBtn().textContent = "■ 停止";
        recBtn().classList.add("recording");
        $(cfg.recTimer).textContent = "00:00";
        R.timer = setInterval(function(){ $(cfg.recTimer).textContent = mmss((Date.now()-R.start)/1000); }, 500);
        try{ R.mr.start(); }catch(e){ toast("无法开始录音"); }
      };
      if(R.stream){ begin(R.stream); return; }
      navigator.mediaDevices.getUserMedia({ audio:true }).then(begin, function(err){
        if(err && err.name==="NotAllowedError") toast("需要麦克风权限才能录音，请在浏览器设置里允许");
        else toast("无法打开麦克风");
      });
    };
    R.stopRec = function(){
      if(R.timer){ clearInterval(R.timer); R.timer = null; }
      recBtn().textContent = "● 录音";
      recBtn().classList.remove("recording");
      try{ if(R.mr && R.mr.state!=="inactive") R.mr.stop(); }catch(e){}
    };
    R.finishRec = function(){
      var dur = Math.max(1, Math.round((Date.now()-R.start)/1000));
      var blob = new Blob(R.chunks, { type:(R.mr && R.mr.mimeType) || "audio/webm" });
      if(!blob.size){ toast("没有录到声音，再试一次"); return; }
      var item = { blob:blob, durationSec:dur, createdAt:Date.now() };
      /* v2.1：存到开始录音时捕获的键（R.curKey），不要用完成时的 R.n */
      var key = R.curKey || cfg.keyOf(R.n);
      /* v2.2：追加一条，不是覆盖。仍在同一键时用内存里的 R.items；
         已切到别的键时先读目标键的现有列表再追加（避免覆盖已有条目）。 */
      var appendAndSave = function(base){
        var list = base.slice();
        list.push(item);
        IDB.put(key, { list:list }, function(ok){
          /* 录音完成时已切到另一键：只提示，不碰当前键的 UI */
          var stillCurrent = (cfg.keyOf(R.n)===key);
          if(ok){
            if(stillCurrent){ R.items = list; R.renderRow(); }
            toast("录音已保存");
          }else{
            /* 降级：下载为文件（已切到别的键时不弹下载，只提示失败，与 v2.1 一致） */
            if(!stillCurrent){ toast("录音保存失败"); return; }
            try{
              var url = URL.createObjectURL(blob);
              var a = document.createElement("a");
              a.href = url; a.download = cfg.dlName(R.n);
              document.body.appendChild(a); a.click(); a.remove();
              setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
            }catch(e){}
            R.items.push({ downloaded:true, durationSec:dur, createdAt:Date.now() });
            R.renderRow();
            toast("录音已下载为文件");
          }
        });
      };
      if(cfg.keyOf(R.n)===key){ appendAndSave(R.items); }
      else{
        IDB.get(key, function(cur){
          appendAndSave(normRecVal(cur).list);
        });
      }
    };
    /* v2.2：按下标播放。同一条：暂停/续播；不同条：先停掉当前 Audio 再为新条建 Audio */
    R.playToggle = function(idx){
      var it = R.items[idx];
      if(!it || it.downloaded || !it.blob) return;
      if(R.playingIdx===idx && R.audio){
        if(R.playing){ R.audio.pause(); R.playing = false; R.renderRow(); return; }
        var rp;
        try{ rp = R.audio.play(); }catch(e){ rp = null; }
        if(rp && rp.catch){
          rp.catch(function(){ R.playing = false; R.renderRow(); toast("无法播放录音"); });
        }
        R.playing = true;
        R.renderRow();
        return;
      }
      dropAudio();
      R.audioUrl = URL.createObjectURL(it.blob);
      R.audio = new Audio(R.audioUrl);
      R.playingIdx = idx;
      R.audio.onended = function(){ R.playing = false; R.playingIdx = -1; R.renderRow(); };
      /* 解码/加载失败也要可见，不要静默（按钮变回 ▶ 并提示） */
      R.audio.onerror = function(){
        R.playing = false;
        R.playingIdx = -1;
        R.renderRow();
        toast("录音文件无法播放");
      };
      var p;
      try{ p = R.audio.play(); }catch(e){ p = null; }
      if(p && p.catch){
        p.catch(function(){
          R.playing = false;
          R.playingIdx = -1;
          R.renderRow();
          toast("无法播放录音");
        });
      }
      R.playing = true;
      R.renderRow();
    };
    /* v2.2：按下标删除一条；删空后删整个键，否则写回剩余列表 */
    R.del = function(idx){
      var it = R.items[idx];
      if(!it) return;
      if(R.playingIdx===idx){ dropAudio(); }
      else if(R.playingIdx>idx){ R.playingIdx--; }
      R.items.splice(idx, 1);
      R.renderRow();
      var key = cfg.keyOf(R.n);
      if(!R.items.length) IDB.del(key, function(){});
      else IDB.put(key, { list:R.items }, function(){});
      toast("录音已删除");
    };
    R.stopAll = function(){
      if(R.mr && R.mr.state!=="inactive"){ try{ R.mr.stop(); }catch(e){} }
      if(R.timer){ clearInterval(R.timer); R.timer = null; }
      /* 播放对象必须一并丢弃：audioUrl 已吊销，旧 Audio 复用必定播不出声音 */
      dropAudio();
      if(R.stream){ R.stream.getTracks().forEach(function(t){ try{ t.stop(); }catch(e){} }); R.stream = null; }
      R.renderRow();
    };
    return R;
  }
  function stopStreams(){
    if(typeof RT !== "undefined" && RT && RT.rec) RT.rec.stopAll();
    if(typeof AP !== "undefined" && AP && AP.rec) AP.rec.stopAll();
    if(typeof SH !== "undefined" && SH && SH.rec) SH.rec.stopAll();
    if(typeof PF !== "undefined" && PF && PF.rec) PF.rec.stopAll();
    rtPlaying = false;
    pfPlaying = false;
  }

  /* ---------- 段落复述（整段） ---------- */
  var RT = null;
  function clozeKeywords(sc){
    var set = {};
    sc.w.forEach(function(w){
      w[0].split(/\s+/).forEach(function(x){ set[normWord(x)] = true; });
    });
    return set;
  }
  function splitToken(tok){
    var m = tok.match(/^(.+?)([.,!?;:'")]*)$/);
    return m ? { word:m[1], punct:m[2] } : { word:tok, punct:"" };
  }
  function openRetell(){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    RT = { n:id, sc:curScene, mode:"vis",
      rec: makeRecorder({ recBtn:"rt-rec", recTimer:"rt-rec-timer", recRow:"rt-recrow",
        keyOf:function(x){ return x+":retell"; }, dlName:function(x){ return "场景"+x+"-复述.webm"; } }) };
    $("rt-title").textContent = "段落复述 · " + curScene.t;
    $("rt-meta").textContent = "整段 · " + curScene.s.length + " 句";
    show("retell");
    startSession("retell", id, ["rt-time"]);
    Array.prototype.forEach.call($("rt-modes").querySelectorAll("button"), function(b){
      b.classList.toggle("on", b.getAttribute("data-mode")==="vis");
    });
    renderCloze();
    RT.rec.open(id);
    $("rt-play").textContent = "▶ 播放整段";
  }
  function renderCloze(){
    var kw = clozeKeywords(RT.sc);
    /* v2.4.2：按该场景的规范句子顺序（全景图顺序）显示 */
    $("rt-cloze").innerHTML = sceneOrder(RT.n).map(function(di){
      var s = RT.sc.s[di];
      var toks = s[0].split(/\s+/);
      var en = toks.map(function(tok, ti){
        var p = splitToken(tok);
        var nw = normWord(p.word);
        var visible = kw[nw] || /\d/.test(p.word) || (ti>0 && /^[A-Z]/.test(p.word));
        var show = RT.mode==="all" || (RT.mode==="vis" && visible);
        if(show) return esc(p.word) + esc(p.punct);
        var wch = Math.max(3, p.word.length);
        return '<span class="blk" style="width:'+wch+'ch"></span>' + esc(p.punct);
      }).join(" ");
      return '<div class="cloze-sent"><div class="cloze-en">'+en+'</div><div class="cloze-cn">'+esc(s[1])+'</div></div>';
    }).join("");
  }
  Array.prototype.forEach.call($("rt-modes").querySelectorAll("button"), function(b){
    b.addEventListener("click", function(){
      if(!RT) return;
      RT.mode = b.getAttribute("data-mode");
      Array.prototype.forEach.call($("rt-modes").querySelectorAll("button"), function(x){ x.classList.toggle("on", x===b); });
      renderCloze();
    });
  });
  var rtPlaying = false;
  $("rt-play").addEventListener("click", function(){
    if(!RT) return;
    if(rtPlaying){ Player.stop(); rtPlaying = false; this.textContent = "▶ 播放整段"; return; }
    rtPlaying = true; this.textContent = "⏹ 停止";
    var self = this;
    /* v2.4.2：按该场景的规范句子顺序（全景图顺序）播放 */
    var list = sceneOrder(RT.n).map(function(di){ return RT.sc.s[di][0]; });
    Player.playSeq(list, { onDone:function(){ rtPlaying = false; self.textContent = "▶ 播放整段"; } });
  });
  $("rt-rec").addEventListener("click", function(){ if(RT) RT.rec.toggle(); });
  $("rt-done").addEventListener("click", function(){
    if(!RT) return;
    var id = RT.n;
    stopStreams();
    settleSession();
    var st = scState(id);
    st.retellDone = true; saveState();
    var justLearned = checkLearned(id);
    toast(justLearned ? "学完啦！复习计划已开启，第一轮复习明天到期" : "复述完成");
    openDetail(id);
  });
  $("rt-back").addEventListener("click", function(){ stopStreams(); settleSession(); openDetail(curScene.id); });

  /* ---------- 场景应用 ---------- */
  var AP = null;
  var apTextTimer = null;
  /* 词数：按空白切分的非空 token 数（v2.6 文字框） */
  function countWords(text){
    var t = (text || "").trim();
    return t ? t.split(/\s+/).length : 0;
  }
  function updateApplyWc(){
    $("ap-wc").textContent = "已写 " + countWords($("ap-text").value) + " 词";
  }
  /* 文字框保存：写进当前场景的 applyText（随 state 进 localStorage 与备份） */
  function saveApplyText(){
    if(apTextTimer){ clearTimeout(apTextTimer); apTextTimer = null; }
    if(!AP) return;
    scState(AP.n).applyText = $("ap-text").value;
    saveState();
  }
  function openApply(){
    settleSession();
    var id = curScene.id;
    touchScene(id);
    AP = { n:id, sc:curScene, kwVisible:true,
      rec: makeRecorder({ recBtn:"ap-rec", recTimer:"ap-rec-timer", recRow:"ap-recrow",
        keyOf:function(x){ return x+":apply"; }, dlName:function(x){ return "场景"+x+"-场景应用.webm"; } }) };
    $("ap-title").textContent = "场景应用 · " + curScene.t;
    /* v2.7：视频课的场景应用提示按类型区分（儿歌：唱给宝宝听 / 对话：用对话的句式说自己的事）；
       innerHTML 会重建 ap-scene 占位，所以先设提示、再填场景名 */
    if(isVideo(id)){
      $("ap-prompt").innerHTML = curScene.type==="song"
        ? "唱给宝宝听，或说说你和宝宝一起唱「<span id=\"ap-scene\"></span>」的情形吧"
        : "用「<span id=\"ap-scene\"></span>」里的句式，说说你自己的真实情形吧";
    }else{
      $("ap-prompt").innerHTML = "用自己的话，说一段你真实生活中的「<span id=\"ap-scene\"></span>」场景吧";
    }
    $("ap-scene").textContent = curScene.t;
    show("apply");
    startSession("apply", id, ["ap-time"]);
    renderKwChips();
    $("ap-text").value = scState(id).applyText || "";
    updateApplyWc();
    AP.rec.open(id);
  }
  function renderKwChips(){
    var box = $("ap-kws");
    if(!AP.kwVisible){
      $("ap-kw-toggle").textContent = "显示关键词";
      box.innerHTML = '<div class="kw-hidden-note">关键词已隐藏，试着不看提示说一说</div>';
      return;
    }
    $("ap-kw-toggle").textContent = "隐藏关键词";
    box.innerHTML = AP.sc.w.map(function(w){
      return '<span class="kw-chip"><span class="kw-en">'+esc(w[0])+'</span><span class="kw-cn">'+esc(w[1])+'</span></span>';
    }).join("");
  }
  $("ap-kw-toggle").addEventListener("click", function(){
    if(!AP) return;
    AP.kwVisible = !AP.kwVisible;
    renderKwChips();
  });
  /* 文字框：输入时实时更新词数 + 防抖 500ms 保存；失焦立即保存（v2.6） */
  $("ap-text").addEventListener("input", function(){
    updateApplyWc();
    if(apTextTimer) clearTimeout(apTextTimer);
    apTextTimer = setTimeout(saveApplyText, 500);
  });
  $("ap-text").addEventListener("blur", function(){ saveApplyText(); });
  $("ap-rec").addEventListener("click", function(){ if(AP) AP.rec.toggle(); });
  $("ap-done").addEventListener("click", function(){
    if(!AP) return;
    saveApplyText(); /* 离开前落盘，避免 500ms 防抖还没跑完 */
    var id = AP.n;
    stopStreams();
    settleSession();
    var st = scState(id);
    st.applyDone = true; saveState();
    var justLearned = checkLearned(id);
    toast(justLearned ? "学完啦！复习计划已开启，第一轮复习明天到期" : "场景应用完成");
    openDetail(id);
  });
  $("ap-back").addEventListener("click", function(){ saveApplyText(); stopStreams(); settleSession(); openDetail(curScene.id); });

  /* ---------- 复习轮次执行 ---------- */
  function completeReviewTask(id, round, task, autoDone){
    var st = scState(id);
    var t = st.reviewTasks[String(round)] || {};
    t[task] = true;
    st.reviewTasks[String(round)] = t;
    saveState();
    if(t.bu && t.blind){
      st.reviewDoneCount = (st.reviewDoneCount||0)+1;
      st.reviewRound = round+1;
      st.lastDoneAt = Date.now();
      st.lastDoneKind = "round";
      st.lastDoneRound = round;
      saveState();
      if(round===4){
        st.passed = true; st.passedAt = Date.now(); saveState();
        showCelebration(id);
        return;
      }
      var due = roundDue(id, round+1);
      toast("第"+(round+1)+"轮复习完成，下一轮"+(due?mdStr(due):"")+"到期");
      openDetail(id);
      return;
    }
    if(task==="bu"){
      if(autoDone) toast("没有标记难句，补练自动完成");
      openBlind({ mode:"review", round:round });
    }else{
      openShadow({ mode:"review", round:round });
    }
  }

  /* ---------- 通关庆祝 ---------- */
  function showCelebration(id){
    settleSession();
    var sc = byId(id), st = scState(id);
    $("r-title").textContent = "通关啦 · " + sc.t;
    $("r-sub").textContent = "5 轮复习全部完成，这个场景真正掌握了";
    $("r-acc").innerHTML = passedCount() + "<small> / " + ALL.length + "</small>";
    $("r-lab1").textContent = "通关场景";
    $("r-time").textContent = mmss(st.studySec||0);
    $("r-lab2").textContent = "本场景用时";
    $("r-combo").innerHTML = totalReviewDone() + "<small> 次</small>";
    $("r-lab3").textContent = "复习完成";
    $("r-again").onclick = function(){ renderLearn(); show("learn"); };
    $("r-detail").onclick = function(){ openDetail(id); };
    show("result");
    confetti();
  }
  $("r-back").addEventListener("click", function(){ refreshLibrary(); show("library"); });

  /* ---------- 学习页 ---------- */
  function recommendScene(){
    for(var i=0;i<ALL.length;i++){
      var st = scState(ALL[i].id);
      if(!st.startedAt) return ALL[i];
    }
    for(var j=0;j<ALL.length;j++){
      if(!isLearned(ALL[j].id)) return ALL[j];
    }
    return null;
  }
  function collTag(sc){ return '<span class="coll-tag">'+esc(collOfScene(sc).short)+'</span>'; }
  function renderLearn(){
    /* 连续天数 + 今日 */
    $("ln-streak").textContent = "🔥 连续 " + streakDays() + " 天";
    var today = dayRec(todayStr());
    var listenSec = (today.listen||0)+(today.blind||0);
    var speakSec = (today.shadow||0)+(today.retell||0)+(today.apply||0);
    var totalSec = listenSec+speakSec;
    var totalMin = Math.floor(totalSec/60);
    $("ln-today-min").textContent = totalMin + " 分钟";
    $("ln-today-break").textContent = "听力 " + Math.floor(listenSec/60) + " 分 · 跟读 " + Math.floor(speakSec/60) + " 分 · 新学 " + (today.newItems||0) + " 词句";
    var goal = S.settings.goalMin||120;
    var pct = Math.min(100, Math.round(totalMin/goal*100));
    $("ln-goal-bar").style.width = pct+"%";
    $("ln-goal-txt").textContent = "每日目标 " + goal + " 分钟 · " + pct + "%";
    /* 本周 */
    var week = [];
    var maxMin = 30, weekTotal = 0;
    for(var d=6; d>=0; d--){
      var dt = new Date(Date.now()-d*DAY);
      var rec = S.days[dateStr(dt)] || {};
      var lm = Math.round(((rec.listen||0)+(rec.blind||0))/60);
      var sm = Math.round(((rec.shadow||0)+(rec.retell||0)+(rec.apply||0))/60);
      week.push({ label: d===0 ? "今" : "日一二三四五六"[dt.getDay()], listen:lm, speak:sm });
      weekTotal += lm+sm;
      if(lm+sm>maxMin) maxMin = lm+sm;
    }
    $("ln-week-total").textContent = weekTotal + " 分钟";
    $("ln-week-chart").innerHTML = week.map(function(wd){
      var tot = wd.listen+wd.speak;
      var h = tot<=0 ? 2 : Math.max(6, Math.round(tot/maxMin*84));
      var lh = tot<=0 ? 0 : Math.round(wd.listen/tot*h);
      var sh = h-lh;
      return '<div class="week-day"><div class="week-bar" style="height:'+h+'px">'
        +'<i class="b-listen" style="height:'+lh+'px"></i><i class="b-speak" style="height:'+sh+'px"></i></div>'
        +'<span class="wd">'+wd.label+'</span></div>';
    }).join("");
    /* 为你推荐 */
    var rec = recommendScene();
    var recCard = $("ln-rec");
    if(!rec || S.recDismissedFor===rec.id){
      recCard.style.display = "none";
    }else{
      recCard.style.display = "";
      $("ln-rec-title").textContent = "场景 " + rec.n + " · " + rec.t + " · " + collOfScene(rec).short;
      $("ln-rec-go").onclick = function(){ openDetail(rec.id); };
    }
    /* 待复习 */
    var due = dueRounds();
    $("ln-due-count").textContent = due.length ? ("（"+due.length+"）") : "";
    $("ln-due-empty").style.display = due.length ? "none" : "";
    $("ln-due").innerHTML = due.map(function(dr){
      var sc = byId(dr.id);
      var st = scState(dr.id);
      var doneN = roundTasksDone(dr.id, dr.round);
      var overdueDays = Math.floor((Date.now()-dr.due)/DAY);
      var tag = overdueDays<=0 ? "今天到期" : ("已逾期 "+overdueDays+" 天");
      return '<div class="card due-card">'
        +'<div class="due-top"><span class="due-title">场景 '+sc.n+' · '+esc(sc.t)+'</span>'+collTag(sc)
        +'<span class="due-tag'+(overdueDays>0?" over":"")+'">'+tag+'</span></div>'
        +'<div class="due-sub">第 '+(dr.round+1)+' 轮复习 · 难句补练 + 全文盲听</div>'
        +'<div class="due-row"><span class="pbar"><i style="width:'+(doneN/2*100)+'%"></i></span>'
        +'<button class="due-go" data-due="'+sc.id+':'+dr.round+'">复习</button></div></div>';
    }).join("");
    Array.prototype.forEach.call($("ln-due").querySelectorAll("[data-due]"), function(b){
      b.addEventListener("click", function(){
        var p = b.getAttribute("data-due").split(":");
        var id = p[0], r = parseInt(p[1],10);
        curScene = byId(id);
        openRoundTask(id, r);
      });
    });
    /* 待解锁 */
    var locked = [];
    ALL.forEach(function(sc){
      if(!isLearned(sc.id) || isPassed(sc.id)) return;
      var st = scState(sc.id);
      var r = st.reviewRound;
      if(roundState(sc.id, r)==="waiting") locked.push({ id:sc.id, round:r, due:roundDue(sc.id, r) });
    });
    locked.sort(function(a,b){ return a.due-b.due; });
    $("ln-locked-count").textContent = locked.length ? ("（"+locked.length+"）") : "";
    $("ln-locked").innerHTML = locked.map(function(lk){
      var sc = byId(lk.id);
      return '<div class="card lock-row"><span>🔒</span><span class="lk-t">场景 '+sc.n+' · '+esc(sc.t)+' · 第 '+(lk.round+1)+' 轮复习</span>'+collTag(sc)
        +'<span class="lk-d">'+mdStr(lk.due)+'到期</span></div>';
    }).join("") || '<div class="empty-note">没有待解锁的复习。</div>';
    /* 首次学习 */
    var first = ALL.filter(function(sc){
      var st = scState(sc.id);
      return st.startedAt && !isLearned(sc.id);
    });
    $("ln-first-empty").style.display = first.length ? "none" : "";
    $("ln-first").innerHTML = first.map(function(sc){
      return '<button class="card first-row" data-first="'+sc.id+'">'
        +'<span class="sc-num">'+sc.n+'</span>'
        +'<span class="f-main"><span class="f-title">'+esc(sc.t)+'</span>'+collTag(sc)
        +'<span class="f-sub" style="display:block">首次学习 '+stepsDoneCount(sc.id)+'/5</span></span>'
        +'<span class="f-go">继续</span></button>';
    }).join("");
    Array.prototype.forEach.call($("ln-first").querySelectorAll("[data-first]"), function(b){
      b.addEventListener("click", function(){ openDetail(b.getAttribute("data-first")); });
    });
    /* 最近完成 */
    var recent = ALL.filter(function(sc){ return !!scState(sc.id).lastDoneAt; })
      .sort(function(a,b){ return scState(b.id).lastDoneAt - scState(a.id).lastDoneAt; })
      .slice(0,5);
    $("ln-recent").innerHTML = recent.map(function(sc){
      var st = scState(sc.id);
      var kind = st.lastDoneKind==="round" ? ("第 "+(st.lastDoneRound+1)+" 轮复习完成") : "学完首次学习";
      return '<div class="card recent-row"><span class="rc-t">场景 '+sc.n+' · '+esc(sc.t)+'</span>'+collTag(sc)
        +'<span class="rc-d">'+kind+' · '+mdStr(st.lastDoneAt)+'</span></div>';
    }).join("") || '<div class="empty-note">还没有完成记录。</div>';
    /* 累计统计 */
    var mc = masteredCounts();
    $("ln-stat-pass").innerHTML = passedCount() + "<small> / " + ALL.length + "</small>";
    $("ln-stat-master").innerHTML = mc.total + "<small> 词句</small>";
    var mins = Math.round(S.studySeconds/60);
    $("ln-stat-time").innerHTML = (S.studySeconds<60 ? "不到 1" : mins) + "<small> 分钟</small>";
    $("ln-stat-review").innerHTML = totalReviewDone() + "<small> 次</small>";
    /* 我的场景（按合集分组） */
    var rows = ALL.filter(function(sc){
      var st = scState(sc.id);
      return st.startedAt || itemsDone(sc.id)>0;
    });
    $("ln-mine-empty").style.display = rows.length ? "none" : "";
    var mineHtml = "";
    COLLECTIONS.forEach(function(c){
      var group = rows.filter(function(sc){ return sc.coll===c.id; });
      if(!group.length) return;
      mineHtml += '<div class="coll-group-head">'+esc(c.title)+' · '+group.length+' 个场景</div>';
      mineHtml += group.map(function(sc){
        var st = scState(sc.id);
        var status = isPassed(sc.id) ? "🏆 已通关" : (isLearned(sc.id) ? ("复习第 "+(st.reviewRound+1)+" 轮") : ("首次学习 "+stepsDoneCount(sc.id)+"/5"));
        var pct2 = detailPct(sc.id);
        return '<button class="card sc-row" data-mine="'+sc.id+'">'
          +'<span class="sc-num">'+sc.n+'</span>'
          +'<span class="sc-main"><span class="sc-title">'+esc(sc.t)+'</span>'
          +'<span class="sc-sub" style="display:block">'+status+'</span></span>'
          +'<span class="sc-prog"><span class="pbar" style="display:block"><i style="width:'+pct2+'%"></i></span>'
          +'<span class="prog-txt" style="display:block;text-align:right">'+pct2+'%</span></span></button>';
      }).join("");
    });
    $("ln-mine").innerHTML = mineHtml;
    Array.prototype.forEach.call($("ln-mine").querySelectorAll("[data-mine]"), function(b){
      b.addEventListener("click", function(){ openDetail(b.getAttribute("data-mine")); });
    });
  }
  $("ln-rec-x").addEventListener("click", function(){
    var rec = recommendScene();
    if(rec) S.recDismissedFor = rec.id;
    saveState();
    renderLearn();
  });
  $("ln-locked-toggle").addEventListener("click", function(){
    var body=$("ln-locked");
    body.hidden = !body.hidden;
    this.classList.toggle("open", !body.hidden);
  });
  $("ln-recent-toggle").addEventListener("click", function(){
    var body=$("ln-recent");
    body.hidden = !body.hidden;
    this.classList.toggle("open", !body.hidden);
  });

  /* ---------- 收藏 ---------- */
  var favSeg = "sent";
  function favSort(a, b){
    var sa = byId(a.split(":")[0]), sb = byId(b.split(":")[0]);
    var oa = sa ? ALL.indexOf(sa) : 9999, ob = sb ? ALL.indexOf(sb) : 9999;
    if(oa!==ob) return oa-ob;
    return parseInt(a.split(":")[1],10)-parseInt(b.split(":")[1],10);
  }
  /* v2.7：收藏卡片的 🔊：视频课播该句/该词的视频片段，场景课 TTS 朗读 */
  function favSpeak(key, isWord){
    var p = key.split(":"), id = p[0], idx = parseInt(p[1],10);
    var sc = byId(id); if(!sc) return;
    if(isVideo(id)){
      if(isWord) playVideoWord(sc, idx);
      else playVideoSeg(sc, idx);
      return;
    }
    speak(isWord ? sc.w[idx][0] : sc.s[idx][0]);
  }
  function favSceneLabel(sc){
    return isVideo(sc.id) ? "视频课 · "+esc(sc.t) : "场景 "+sc.n+" · "+esc(sc.t);
  }
  function renderFav(){
    $("fv-seg-sent").classList.toggle("on", favSeg==="sent");
    $("fv-seg-word").classList.toggle("on", favSeg==="word");
    var list = $("fv-list"), empty = $("fv-empty");
    if(favSeg==="sent"){
      var keys = S.favSents.slice().sort(favSort);
      empty.textContent = "暂无收藏句子——在精听、跟读或逐句跟练中标记难句";
      empty.style.display = keys.length ? "none" : "";
      list.innerHTML = keys.map(function(k){
        var p = k.split(":"), id = p[0], idx = parseInt(p[1],10);
        var sc = byId(id); if(!sc) return "";
        var s = sc.s[idx];
        return '<div class="card fav-card" data-favsent="'+k+'">'
          +'<div class="f-en">'+esc(s[0])+'</div><div class="f-cn">'+esc(s[1])+'</div>'
          +'<div class="f-meta"><span class="f-scene">'+favSceneLabel(sc)+' · '+esc(collOfScene(sc).short)+'</span><span class="f-hard">难句</span>'
          +'<span class="f-actions"><button data-fspk="'+k+'" aria-label="发音">🔊</button>'
          +'<button class="unfav" data-funfav="'+k+'" aria-label="取消收藏">✕</button></span></div></div>';
      }).join("");
      Array.prototype.forEach.call(list.querySelectorAll(".fav-card"), function(card){
        card.addEventListener("click", function(e){
          if(e.target.closest("[data-fspk]") || e.target.closest("[data-funfav]")) return;
          var k = card.getAttribute("data-favsent").split(":");
          openDetail(k[0]);
        });
      });
      Array.prototype.forEach.call(list.querySelectorAll("[data-fspk]"), function(b){
        b.addEventListener("click", function(e){ e.stopPropagation(); favSpeak(b.getAttribute("data-fspk"), false); });
      });
      Array.prototype.forEach.call(list.querySelectorAll("[data-funfav]"), function(b){
        b.addEventListener("click", function(e){
          e.stopPropagation();
          var p = b.getAttribute("data-funfav").split(":");
          delFavSent(p[0], parseInt(p[1],10));
          toast("已取消收藏");
          renderFav();
        });
      });
    }else{
      var keys2 = S.favWords.slice().sort(favSort);
      empty.textContent = "暂无收藏词汇——在精听或逐句跟练中标记生词";
      empty.style.display = keys2.length ? "none" : "";
      list.innerHTML = keys2.map(function(k){
        var p = k.split(":"), id = p[0], idx = parseInt(p[1],10);
        var sc = byId(id); if(!sc) return "";
        var w = sc.w[idx];
        return '<div class="card fav-card" data-favword="'+k+'">'
          +'<div class="f-en">'+esc(w[0])+'</div><div class="f-cn">'+esc(w[1])+'</div>'
          +'<div class="f-meta"><span class="f-scene">'+favSceneLabel(sc)+' · '+esc(collOfScene(sc).short)+'</span><span class="f-hard">生词</span>'
          +'<span class="f-actions"><button data-fspk="'+k+'" aria-label="发音">🔊</button>'
          +'<button class="unfav" data-wunfav="'+k+'" aria-label="取消收藏">✕</button></span></div></div>';
      }).join("");
      Array.prototype.forEach.call(list.querySelectorAll(".fav-card"), function(card){
        card.addEventListener("click", function(e){
          if(e.target.closest("[data-fspk]") || e.target.closest("[data-wunfav]")) return;
          var k = card.getAttribute("data-favword").split(":");
          openDetail(k[0]);
        });
      });
      Array.prototype.forEach.call(list.querySelectorAll("[data-fspk]"), function(b){
        b.addEventListener("click", function(e){ e.stopPropagation(); favSpeak(b.getAttribute("data-fspk"), true); });
      });
      Array.prototype.forEach.call(list.querySelectorAll("[data-wunfav]"), function(b){
        b.addEventListener("click", function(e){
          e.stopPropagation();
          var p = b.getAttribute("data-wunfav").split(":");
          delFavWord(p[0], parseInt(p[1],10));
          toast("已取消收藏");
          renderFav();
        });
      });
    }
  }
  $("fv-seg-sent").addEventListener("click", function(){ favSeg="sent"; renderFav(); });
  $("fv-seg-word").addEventListener("click", function(){ favSeg="word"; renderFav(); });

  /* ---------- 我的：程序设置 ---------- */
  var GOAL_OPTS = [30, 60, 120, 180];
  var RATE_OPTS = [0.7, 0.85, 1.0];
  function renderSettings(){
    refreshBackupCount();
    $("m-goal").innerHTML = GOAL_OPTS.map(function(g){
      return '<button data-goal="'+g+'" class="'+(S.settings.goalMin===g?"on":"")+'">'+(g>=60 ? (g/60+" 小时") : g+" 分钟")+'</button>';
    }).join("");
    $("m-rate").innerHTML = RATE_OPTS.map(function(r){
      return '<button data-rate="'+r+'" class="'+(S.settings.rate===r?"on":"")+'">'+r.toFixed(2).replace(/0$/,"")+'x</button>';
    }).join("");
    Array.prototype.forEach.call($("m-goal").querySelectorAll("[data-goal]"), function(b){
      b.addEventListener("click", function(){
        S.settings.goalMin = parseInt(b.getAttribute("data-goal"),10);
        saveState(); renderSettings(); toast("每日目标已保存");
      });
    });
    Array.prototype.forEach.call($("m-rate").querySelectorAll("[data-rate]"), function(b){
      b.addEventListener("click", function(){
        S.settings.rate = parseFloat(b.getAttribute("data-rate"));
        saveState(); renderSettings(); toast("发音语速已保存");
      });
    });
  }

  /* ---------- 备份与恢复（v2.0；备份含录音，base64 存进同一个 JSON） ----------
     备份文件结构：{app, formatVersion, exportedAt, state, recordings, checksum}
     checksum = FNV-1a 32 位 hex，对 JSON.stringify({state, recordings}) 计算。
     恢复流程：校验 -> 确认（原生 confirm）-> 自动备份当前状态（下载 + localStorage
     兜底）-> 先写录音（失败则不碰进度）-> 写进度 -> location.reload()。
     v2.2：formatVersion 升到 2（同一键可有多条录音，recordings 按条展开）；
     恢复时兼容 v1 备份（每项还原成单条 list）。 */
  var BK_APP = "typing-trainer-offline";
  var BK_FORMAT = 2;
  var BK_PRE_KEY = "typing-trainer-offline-v3-pre-restore";
  var bkBusy = false;
  function fnv1a(str){
    var h = 0x811c9dc5;
    for(var i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193); /* 必须用 imul：普通乘法超 2^53 会丢低位 */
    }
    var hex = (h >>> 0).toString(16);
    while(hex.length<8) hex = "0"+hex;
    return hex;
  }
  function bkChecksum(state, recs){
    return fnv1a(JSON.stringify({ state:state, recordings:recs }));
  }
  function bkStamp(d){
    d = d || new Date();
    return dateStr(d)+"-"+pad2(d.getHours())+pad2(d.getMinutes());
  }
  function fmtSize(bytes){
    if(bytes>=1048576) return (bytes/1048576).toFixed(1)+" MB";
    return Math.max(1, Math.round(bytes/1024))+" KB";
  }
  function downloadBlob(blob, name){
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
  }
  function blobToDataURL(blob, cb){
    var fr = new FileReader();
    fr.onload = function(){ cb(fr.result); };
    fr.onerror = function(){ cb(null); };
    try{ fr.readAsDataURL(blob); }catch(e){ cb(null); }
  }
  /* base64 dataURL -> Blob；分块 atob，避免超大字符串一次解码。
     注意：录音 mime 常带参数（如 audio/webm;codecs=opus），dataURL 头部形如
     data:audio/webm;codecs=opus;base64,...——解析时不能假设 mime 后直接跟 ;base64 */
  function dataURLToBlob(dataURL){
    if(typeof dataURL!=="string") return null;
    var comma = dataURL.indexOf(",");
    if(dataURL.indexOf("data:")!==0 || comma<0) return null;
    var header = dataURL.slice(5, comma);
    if(header.slice(-7) !== ";base64") return null;
    var mime = header.split(";")[0] || "audio/webm";
    var b64 = dataURL.slice(comma+1).replace(/\s/g, "");
    var parts = [];
    var CH = 1048576; /* 1MB，4 的倍数，分块边界不会切断 base64 四元组 */
    try{
      for(var off=0; off<b64.length; off+=CH){
        var bin = atob(b64.slice(off, off+CH));
        var u8 = new Uint8Array(bin.length);
        for(var i=0;i<bin.length;i++) u8[i] = bin.charCodeAt(i);
        parts.push(u8);
      }
    }catch(e){ return null; }
    return new Blob(parts, { type:mime });
  }
  /* 收集全部录音为备份格式；IDB 不可用时当作无录音（不阻塞导出）。
     v2.2：每键的 list 展开成多条备份项（同键多项按 list 顺序排列），
     老格式值用 normRecVal 归一化后同样处理。 */
  function collectRecordings(cb){
    IDB.getAll(function(list){
      if(!list){ cb([]); return; }
      var out = [];
      var i = 0;
      var next = function(){
        if(i>=list.length){ cb(out); return; }
        var item = list[i++];
        var items = normRecVal(item.val).list;
        var j = 0;
        var nextItem = function(){
          if(j>=items.length){ next(); return; }
          var v = items[j++];
          if(!v || !v.blob || !(v.blob instanceof Blob) || !v.blob.size){ nextItem(); return; }
          blobToDataURL(v.blob, function(du){
            if(du) out.push({ key:item.key, mime:v.blob.type || "audio/webm",
              durationSec:v.durationSec||0, createdAt:v.createdAt||0, data:du });
            nextItem();
          });
        };
        nextItem();
      };
      next();
    });
  }
  function buildBackup(state, recs){
    var bk = { app:BK_APP, formatVersion:BK_FORMAT, exportedAt:new Date().toISOString(),
      state:state, recordings:recs, checksum:"" };
    bk.checksum = bkChecksum(state, recs);
    return bk;
  }
  function backupSummary(bk){
    var st = bk.state, scenes = st.scenes || {};
    var n = 0;
    for(var k in scenes){ if(scenes[k] && (scenes[k].startedAt || scenes[k].learnedAt)) n++; }
    var fav = (st.favSents||[]).length + (st.favWords||[]).length;
    return { scenes:n, fav:fav, recs:bk.recordings.length, exportedAt:bk.exportedAt };
  }
  function setBkBusy(busy){
    bkBusy = busy;
    var b1 = $("bk-export"), b2 = $("bk-restore");
    if(b1) b1.disabled = busy;
    if(b2) b2.disabled = busy;
  }
  function exportBackup(){
    if(bkBusy) return;
    setBkBusy(true);
    settleSession(); /* 先结算计时，避免刚练的分钟没进备份 */
    collectRecordings(function(recs){
      try{
        var bk = buildBackup(S, recs);
        var text = JSON.stringify(bk);
        var blob = new Blob([text], { type:"application/json" });
        downloadBlob(blob, "英语打字练习-备份-"+bkStamp()+".json");
        toast("备份已导出（"+recs.length+" 条录音，"+fmtSize(blob.size)+"）");
      }catch(e){
        toast("导出失败，请再试一次");
      }
      setBkBusy(false);
    });
  }
  /* 返回 null 表示校验通过，否则返回给用户看的错误原因 */
  function validateBackup(bk){
    if(!bk || typeof bk!=="object" || Array.isArray(bk)) return "文件不是备份";
    if(bk.app !== BK_APP) return "这个文件不是英语打字练习的备份";
    if(bk.formatVersion !== 1 && bk.formatVersion !== BK_FORMAT) return "备份版本不兼容，请用新版重新导出";
    if(!bk.state || typeof bk.state!=="object" || bk.state.v !== 3) return "备份版本不兼容，请用新版重新导出";
    if(!Array.isArray(bk.recordings)) return "备份文件已损坏";
    if(bk.checksum !== bkChecksum(bk.state, bk.recordings)) return "备份文件已损坏，校验未通过";
    return null;
  }
  function restoreBackupFile(file){
    if(bkBusy) return;
    var fr = new FileReader();
    fr.onload = function(){
      var bk = null;
      try{ bk = JSON.parse(fr.result); }catch(e){ bk = null; }
      if(!bk){ toast("文件不是备份"); return; }
      var err = validateBackup(bk);
      if(err){ toast(err); return; }
      var sum = backupSummary(bk);
      var when = sum.exportedAt ? new Date(sum.exportedAt) : null;
      var whenTxt = (when && !isNaN(when.getTime()))
        ? dateStr(when)+" "+pad2(when.getHours())+":"+pad2(when.getMinutes()) : "未知";
      var ok = window.confirm(
        "备份信息：\n导出时间："+whenTxt
        +"\n已学场景 "+sum.scenes+" 个 · 收藏 "+sum.fav+" 条 · 录音 "+sum.recs+" 条"
        +"\n\n恢复会覆盖当前全部进度和录音，恢复前会自动保存一份当前状态。\n确定恢复吗？");
      if(!ok){ toast("已取消恢复"); return; }
      doRestore(bk);
    };
    fr.onerror = function(){ toast("读取备份文件失败"); };
    try{ fr.readAsText(file); }catch(e){ toast("读取备份文件失败"); }
  }
  function doRestore(bk){
    if(bkBusy) return;
    setBkBusy(true);
    settleSession();
    stopStreams();
    /* 1) 恢复前自动备份：下载一份当前状态（尽力而为，失败不阻塞恢复），
          再把当前 state（不含录音）存到 localStorage 兜底 */
    collectRecordings(function(curRecs){
      try{
        var pre = buildBackup(S, curRecs);
        downloadBlob(new Blob([JSON.stringify(pre)], { type:"application/json" }),
          "英语打字练习-恢复前自动备份-"+bkStamp()+".json");
      }catch(e){}
      try{ window.localStorage.setItem(BK_PRE_KEY, JSON.stringify(S)); }catch(e){}
      /* 2) 先解码并写录音：任一条解码/写入失败都不碰进度。
         v2.2：按 key 分组，同键多项还原成 {list:[...]}（保持备份顺序）；
         v1 备份每项自然还原成单条 list。 */
      var byKey = {};
      var keyOrder = [];
      var bad = false;
      for(var i=0;i<bk.recordings.length;i++){
        var r = bk.recordings[i];
        if(!r || typeof r.key!=="string" || typeof r.data!=="string"){ bad = true; break; }
        var blob = dataURLToBlob(r.data);
        if(!blob || !blob.size){ bad = true; break; }
        if(!byKey[r.key]){ byKey[r.key] = []; keyOrder.push(r.key); }
        byKey[r.key].push({ blob:blob, durationSec:r.durationSec||0, createdAt:r.createdAt||0 });
      }
      if(bad){ setBkBusy(false); toast("恢复失败，备份里的录音无法解码"); return; }
      var recs = keyOrder.map(function(k){ return { key:k, val:{ list:byKey[k] } }; });
      var writeState = function(){
        try{
          window.localStorage.setItem(KEY3, JSON.stringify(bk.state));
        }catch(e){ setBkBusy(false); toast("恢复失败，进度写入出错"); return; }
        /* 内存里的 S 还是旧状态，必须重载让新状态生效；
           beforeunload 只结算计时（上面已结算过），不会覆盖刚写入的状态 */
        window.location.reload();
      };
      if(bk.recordings.length===0){
        /* 备份无录音：清空现有录音（尽力而为，失败也不阻塞恢复） */
        IDB.replaceAll([], function(){ writeState(); });
        return;
      }
      IDB.replaceAll(recs, function(ok){
        if(!ok){ setBkBusy(false); toast("恢复失败，录音写入出错"); return; }
        writeState();
      });
    });
  }
  /* v2.2：录音条数按总条数算（各键 list 长度之和，老格式算 1 条），不是键数 */
  function refreshBackupCount(){
    var el = $("bk-rec-count");
    if(!el) return;
    el.textContent = "录音：读取中…";
    IDB.getAll(function(list){
      if(list===null){ el.textContent = "录音：无法读取"; return; }
      var n = 0;
      list.forEach(function(item){ n += normRecVal(item.val).list.length; });
      el.textContent = "录音："+n+" 条";
    });
  }
  $("bk-export").addEventListener("click", exportBackup);
  $("bk-restore").addEventListener("click", function(){ $("bk-file").click(); });
  $("bk-file").addEventListener("change", function(){
    var f = this.files && this.files[0];
    this.value = ""; /* 清空，允许重复选同一个文件 */
    if(f) restoreBackupFile(f);
  });

  /* ---------- tabs ---------- */
  $("tab-library").addEventListener("click", function(){
    settleSession(); stopStreams();
    refreshLibrary(); show("library");
  });
  $("tab-learn").addEventListener("click", function(){
    settleSession(); stopStreams();
    renderLearn(); show("learn");
  });
  $("tab-fav").addEventListener("click", function(){
    settleSession(); stopStreams();
    renderFav(); show("fav");
  });
  $("tab-mine").addEventListener("click", function(){
    settleSession(); stopStreams();
    renderSettings(); show("mine");
  });

  /* ---------- settle timer when the page hides / closes ---------- */
  /* 注意：这里只结算计时（settleSession 内部会在有计时时长时保存），
     不要无条件 saveState()——旧页面内存里的可能是过期状态，会把别的标签页
     或外部写入的新进度覆盖掉。所有状态变更本身都会立即 saveState()。 */
  window.addEventListener("beforeunload", function(){ settleSession(); });
  document.addEventListener("visibilitychange", function(){
    if(document.hidden){ pauseSession(); }
    else{ resumeSession(); }
  });

  /* v2.7：视频播放器初始化 + 字幕中文开关（全局，所有字幕行共用） */
  VPlayer.init();
  Array.prototype.forEach.call(document.querySelectorAll(".sub-cn-toggle"), function(b){
    b.addEventListener("click", function(){ setSubCn(!subCnVisible); });
  });
  applyVideoState();

  loadState();
  refreshLibrary();
  buildCollChips();
  buildCollRows();
  renderCollection();
  updateLearnBadge();
})();
