/* Computer & AI Innovation — shared config, data layer and UI helpers for teacher.html and admin.html */
(() => {
'use strict';

/* ================= ตั้งค่า ================= */
const CONFIG = {
  // วาง URL ของ Google Apps Script Web App (ลงท้ายด้วย /exec) เพื่อให้ทุกเครื่องใช้ข้อมูลชุดเดียวกัน
  // เว้นว่าง '' = โหมดทดลอง เก็บข้อมูลในเบราว์เซอร์เครื่องนี้เท่านั้น
  API_URL: 'https://script.google.com/macros/s/AKfycbyE13dcZ3FvZ0NhCtMxHo3oyYrpbuBhTbt-CsVsgYfW_NZQjNIjkJ4jeJncdPRq1Tl-fA/exec',
  // PIN เข้าหน้า Admin ในโหมดทดลอง (โหมดออนไลน์ใช้ ADMIN_KEY ใน Code.gs แทน)
  LOCAL_ADMIN_PIN: '2569',
  MIN_STATIONS: 5,
  POLL_MS: 5000,
  // ให้นักเรียนตอบแบบประเมินก่อนดาวน์โหลดเกียรติบัตร
  REQUIRE_SURVEY: true,
  // ข้อมูลบนเกียรติบัตร: ใส่ชื่อจริงของผู้ลงนาม (เว้นว่าง = เส้นจุดให้เซ็นเอง)
  SIGNERS: [
    {name:'', title:'ผู้อำนวยการโรงเรียนตันตรารักษ์'},
    {name:'', title:'ประธานจัดงาน Computer & AI Innovation'},
  ],
  // โลโก้โรงเรียน: วางไฟล์ เช่น logo.png ไว้ในโฟลเดอร์เดียวกัน แล้วใส่ 'logo.png' (เว้นว่าง = ใช้ตราสัญลักษณ์ ต.ร. ชั่วคราว)
  LOGO_URL: '',
  EVENT_DATE_TEXT: '', // เช่น '30 กันยายน 2569' (เว้นว่าง = ใช้วันที่นักเรียนผ่านฐานสุดท้าย)
};
const SURVEY = [
  {id:'q1', text:'ความพึงพอใจต่อกิจกรรมโดยรวม'},
  {id:'q2', text:'ได้รับความรู้หรือทักษะใหม่ด้านคอมพิวเตอร์และ AI'},
  {id:'q3', text:'วิทยากรอธิบายเข้าใจง่าย'},
  {id:'q4', text:'อยากให้จัดกิจกรรมนี้อีกในปีหน้า'},
];

const STATIONS = [
  {id:1, name:'AI Chatbot', th:'สร้างแชตบอตอัจฉริยะ', icon:'fa-comments', h:'#2de2ff', speaker:'ครูธนากร วงศ์ใหญ่', room:'ห้องคอมพิวเตอร์ 1', desc:'ออกแบบบทสนทนาและสอนบอตให้ตอบคำถามเกี่ยวกับโรงเรียน'},
  {id:2, name:'Robotics', th:'หุ่นยนต์และการควบคุม', icon:'fa-robot', h:'#9b5cff', speaker:'ครูพิมพ์ชนก แสงทอง', room:'ห้องปฏิบัติการ STEM', desc:'เขียนโปรแกรมให้หุ่นยนต์เดินตามเส้นและหลบสิ่งกีดขวาง'},
  {id:3, name:'IoT & Smart Home', th:'บ้านอัจฉริยะ', icon:'fa-house-signal', h:'#39ff9f', speaker:'ครูอนุชา มีสุข', room:'ห้องคอมพิวเตอร์ 2', desc:'สั่งเปิดไฟและวัดอุณหภูมิผ่านบอร์ดไมโครคอนโทรลเลอร์'},
  {id:4, name:'Data Science', th:'วิทยาการข้อมูล', icon:'fa-chart-line', h:'#ffc24b', speaker:'ครูศิริพร จันทร์เพ็ญ', room:'ห้องสมุดดิจิทัล', desc:'เก็บข้อมูลจริงของห้องเรียน แล้วสร้างกราฟหาข้อสรุป'},
  {id:5, name:'AR/VR Experience', th:'โลกเสมือนจริง', icon:'fa-vr-cardboard', h:'#ff4dd8', speaker:'ครูวีระพงษ์ ทองดี', room:'ห้องโสตทัศนศึกษา', desc:'สวมแว่น VR สำรวจระบบสุริยะและวางวัตถุ AR บนโต๊ะ'},
  {id:6, name:'Generative AI Art', th:'ศิลปะจาก AI', icon:'fa-palette', h:'#ff7a45', speaker:'ครูกนกวรรณ ศรีวงศ์', room:'ห้องศิลปะ', desc:'สร้างภาพจาก prompt และเรียนรู้การใช้ AI อย่างมีจริยธรรม'},
  {id:7, name:'Cybersecurity', th:'ความปลอดภัยไซเบอร์', icon:'fa-shield-halved', h:'#4d8bff', speaker:'ครูณัฐวุฒิ เพชรสุวรรณ', room:'ห้องคอมพิวเตอร์ 3', desc:'ไขปริศนารหัสผ่าน และจับผิดอีเมลหลอกลวง'},
  {id:8, name:'Coding Game Lab', th:'สร้างเกมด้วยโค้ด', icon:'fa-gamepad', h:'#b4ff39', speaker:'ครูชุติมา บุญประเสริฐ', room:'ห้องมัลติมีเดีย', desc:'สร้างมินิเกมด้วย Scratch และ Python ภายใน 20 นาที'},
];
const ST = Object.fromEntries(STATIONS.map(s => [s.id, s]));

/* ================= Helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fullName = s => s ? `${s.prefix || ''}${s.first} ${s.last}` : '';
const initials = s => (s && s.first || '?').slice(0, 1);
const tFmt = ts => new Date(ts).toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'});
const dFmt = ts => new Date(ts).toLocaleDateString('th-TH', {day:'numeric', month:'long', year:'numeric'});
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch(e) { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} },
  sget(k){ try { return sessionStorage.getItem(k); } catch(e) { return null; } },
  sset(k, v){ try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch(e) {} },
};
const qrPayload = s => `TTR-CAI|${s.sid}|${fullName(s)}|${s.cls}`;
function parseCode(text){
  text = String(text || '').replace(/^﻿/, '').trim();
  const m = text.match(/TTR-CAI\|([A-Za-z0-9-]{3,12})/); if (m) return m[1];
  try { const j = JSON.parse(text); if (j && (j.sid || j.id)) return String(j.sid || j.id); } catch(e) {}
  if (/^[A-Za-z0-9-]{3,12}$/.test(text)) return text;
  return null;
}
/* อ่านชื่อและชั้นจาก QR ด้วย (ใช้แสดงผลตอนออฟไลน์) */
function parseQR(text){
  const sid = parseCode(text); if (!sid) return null;
  const p = String(text || '').replace(/^﻿/, '').split('|');
  return /TTR-CAI$/.test(p[0].trim()) && p.length >= 4 ? {sid, name:p[2], cls:p[3]} : {sid, name:'', cls:''};
}
function certCode(s){
  let h = 2166136261; for (const ch of s.sid + fullName(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return `TTR-CAI-69-${s.sid}-${h.toString(36).toUpperCase().slice(0,5).padStart(5,'0')}`;
}
/* รหัสยืนยัน → ลิงก์หน้าตรวจสอบเกียรติบัตร (ใส่ใน QR บนเกียรติบัตร) */
const verifyUrl = code => new URL('verify.html#' + code, location.href).href;
function fnv(str){ let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }
function visitedMap(data){
  const m = {};
  for (const c of data.checkins) (m[c.sid] ||= new Map()).set(c.st, c.ts);
  return m;
}

/* ================= Data layer =================
   local  : localStorage + BroadcastChannel (หลายแท็บในเครื่องเดียวเห็นข้อมูลกันทันที)
   remote : Google Apps Script Web App + Google Sheets (ทุกเครื่องใช้ข้อมูลร่วมกัน) */
const LKEY = 'ttr-cai-shared-v2';
const SEED = [
  ['65101','ด.ช.','กิตติพัฒน์','ศรีสมบูรณ์','ม.1/1',6], ['65102','ด.ญ.','ณัฐธิดา','แก้วประเสริฐ','ม.1/1',4],
  ['65120','ด.ช.','อชิรวัฒน์','พรหมมา','ม.1/2',2], ['65215','ด.ช.','ภูมิรพี','ชัยมงคล','ม.2/3',8],
  ['65218','ด.ญ.','พิชชาภา','บุญเรือง','ม.2/3',5], ['65330','ด.ญ.','ธัญชนก','สุขเจริญ','ม.3/2',3],
  ['64401','นาย','ปัณณวัฒน์','ทองมา','ม.4/1',7], ['64407','นางสาว','กมลชนก','รัตนพันธ์','ม.4/1',5],
  ['64512','นาย','ธนภัทร','อินทร์แก้ว','ม.5/2',1], ['64519','นางสาว','ปวีณ์ธิดา','นาคสวัสดิ์','ม.5/2',6],
  ['63601','นาย','ศุภกร','เพชรรัตน์','ม.6/1',4], ['63605','นางสาว','ชนิสรา','วงศ์สวัสดิ์','ม.6/1',0],
];
function makeSeed(){
  let seed = 2569; const r = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const base = Date.now() - 3 * 3600e3, students = {}, checkins = [];
  SEED.forEach(([sid, prefix, first, last, cls, n], i) => {
    students[sid] = {sid, prefix, first, last, cls, demo:true, created:base + i * 60e3};
    STATIONS.map(s => [r(), s.id]).sort((a,b) => a[0]-b[0]).slice(0, n)
      .forEach(([, st], k) => checkins.push({sid, st, ts: base + i * 90e3 + k * 17 * 60e3 + Math.floor(r() * 9) * 60e3, by:ST[st].speaker}));
  });
  checkins.sort((a,b) => a.ts - b.ts);
  return {v:2, students, checkins, surveys:{}};
}
const bc = ('BroadcastChannel' in window) ? new BroadcastChannel('ttr-cai') : null;
const Local = {
  read(){ const d = store.get(LKEY, null); if (d && d.v === 2) { d.surveys ||= {}; return d; } const s = makeSeed(); store.set(LKEY, s); return s; },
  write(d){ store.set(LKEY, d); bc && bc.postMessage('changed'); },
};
let apiKey = store.sget('ttr-cai-admin-key') || '';

/* err.network = true เมื่อส่งไม่ถึงเซิร์ฟเวอร์ (เน็ตหลุด / หมดเวลา / เซิร์ฟเวอร์ล่ม) → หน้าครูเก็บเข้าคิวรอส่ง */
function netError(msg){ const e = new Error(msg); e.network = true; return e; }
/* GET (อ่านข้อมูล) ลองซ้ำ 1 ครั้งถ้าเซิร์ฟเวอร์ Google ตื่นช้า (cold start) */
async function api(method, payload, timeoutMs = 25000){
  try { return await apiOnce(method, payload, timeoutMs); }
  catch(e) { if (e.network && method === 'GET' && navigator.onLine) return apiOnce(method, payload, timeoutMs); throw e; }
}
async function apiOnce(method, payload, timeoutMs){
  const url = CONFIG.API_URL;
  if (!navigator.onLine) throw netError('ไม่มีอินเทอร์เน็ต');
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  let res;
  try {
    res = method === 'GET'
      ? await fetch(url + '?' + new URLSearchParams(payload), {method:'GET', signal:ctl.signal})
      : await fetch(url, {method:'POST', body:JSON.stringify(payload), signal:ctl.signal}); // text/plain → ไม่มี CORS preflight
  } catch(e) { throw netError(e.name === 'AbortError' ? 'เซิร์ฟเวอร์ตอบช้าเกินไป' : 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); }
  finally { clearTimeout(timer); }
  if (res.status >= 500) throw netError('เซิร์ฟเวอร์ขัดข้อง ' + res.status);
  if (!res.ok) throw new Error('เซิร์ฟเวอร์ตอบกลับ ' + res.status);
  const j = await res.json();
  if (j.ok === false) {
    const msg = {unauthorized:'รหัสผู้ดูแลไม่ถูกต้อง', bad_token:'ลิงก์ฐานนี้ไม่ถูกต้อง ขอลิงก์ใหม่จาก Admin'}[j.error] || j.error || 'เกิดข้อผิดพลาด';
    const e = new Error(msg); e.code = j.error; throw e;
  }
  return j;
}
function normalizeRemote(j){
  const students = {};
  (j.students || []).forEach(s => students[String(s.sid)] = {...s, sid:String(s.sid)});
  const checkins = (j.checkins || []).map(c => ({ts:+new Date(c.ts), sid:String(c.sid), st:+c.st, by:c.by || ''})).sort((a,b) => a.ts - b.ts);
  const surveys = {};
  (j.surveys || []).forEach(x => surveys[String(x.sid)] = x);
  return {v:2, students, checkins, surveys};
}

const DB = {
  mode: CONFIG.API_URL ? 'remote' : 'local',
  setKey(k){ apiKey = k || ''; store.sset('ttr-cai-admin-key', k || null); },
  hasKey(){ return !!apiKey; },
  async login(pin){
    if (DB.mode === 'local') { if (pin !== CONFIG.LOCAL_ADMIN_PIN) throw new Error('PIN ไม่ถูกต้อง'); DB.setKey(pin); return true; }
    await api('POST', {action:'ping', key:pin}); DB.setKey(pin); return true;
  },
  logout(){ DB.setKey(''); },
  /* ข้อมูลทั้งหมด (Admin) */
  async all(){
    if (DB.mode === 'local') return Local.read();
    return normalizeRemote(await api('GET', {action:'all', key:apiKey}));
  },
  /* เช็กอิน (ครู) → {status:'ok'|'dup'|'unknown', student, count} */
  async checkin(sid, st, by = '', ts = Date.now(), tk = ''){
    if (DB.mode === 'remote') return api('POST', {action:'checkin', sid, st, by, ts, tk});
    const d = Local.read(), s = d.students[sid];
    if (!s) return {status:'unknown'};
    const mine = d.checkins.filter(c => c.sid === sid);
    if (mine.some(c => c.st === st)) return {status:'dup', student:s, count:mine.length};
    d.checkins.push({sid, st, ts, by}); Local.write(d);
    return {status:'ok', student:s, count:mine.length + 1};
  },
  /* หน้านักเรียน: กรอกเลขประจำตัว 4 หลักเพื่อดูข้อมูลของตัวเอง → {student, checkins, surveyed} | null */
  async studentView(sid){
    sid = String(sid).trim();
    if (DB.mode === 'remote') {
      const j = await api('GET', {action:'student', sid});
      if (!j.student) return null;
      return {student:{...j.student, sid:String(j.student.sid)}, surveyed:!!j.surveyed, checkins:(j.checkins || []).map(c => ({ts:+new Date(c.ts), sid:String(c.sid), st:+c.st, by:c.by || ''}))};
    }
    const d = Local.read(), s = d.students[sid];
    if (!s) return null;
    return {student:s, surveyed:!!d.surveys[sid], checkins:d.checkins.filter(c => c.sid === sid)};
  },
  /* แบบประเมินของนักเรียน (ตอบได้ครั้งเดียว) */
  async survey(sid, answers){
    if (DB.mode === 'remote') return api('POST', {action:'survey', sid, answers});
    const d = Local.read(), s = d.students[sid];
    if (!s) throw new Error('ไม่พบข้อมูลนักเรียน');
    d.surveys[sid] = {sid, ts:Date.now(), ...answers}; Local.write(d);
    return {ok:true};
  },
  /* ตรวจสอบเกียรติบัตรจากรหัสยืนยัน (สาธารณะ) → {valid, name, cls, count} */
  async verify(code){
    code = String(code || '').trim().toUpperCase();
    if (DB.mode === 'remote') return api('GET', {action:'verify', code});
    const m = code.match(/^TTR-CAI-69-([A-Z0-9]{3,12})-[0-9A-Z]{5}$/);
    const d = Local.read(), s = m && d.students[m[1]];
    if (!s || certCode(s) !== code) return {valid:false};
    const count = d.checkins.filter(c => c.sid === s.sid).length;
    return {valid:count >= CONFIG.MIN_STATIONS, name:fullName(s), cls:s.cls, count, reason:count >= CONFIG.MIN_STATIONS ? '' : 'not_eligible'};
  },
  /* ลิงก์ครูประจำฐานพร้อมรหัสกำกับ (Admin) → {1:'a1b2c3', ...} */
  async stationTokens(){
    if (DB.mode === 'remote') return (await api('GET', {action:'tokens', key:apiKey})).tokens;
    return Object.fromEntries(STATIONS.map(s => [s.id, fnv('demo-station:' + s.id).toString(36).slice(0, 6)]));
  },
  async register(stu){
    if (DB.mode === 'remote') return api('POST', {action:'register', key:apiKey, student:stu});
    const d = Local.read();
    if (d.students[stu.sid]) return {status:'exists', student:d.students[stu.sid]};
    d.students[stu.sid] = {...stu, created:Date.now()}; Local.write(d);
    return {status:'ok', student:d.students[stu.sid]};
  },
  async importMany(list){
    if (DB.mode === 'remote') return api('POST', {action:'import', key:apiKey, students:list});
    const d = Local.read(); let added = 0, skipped = 0, removedDemo = 0;
    // นำเข้ารายชื่อจริงครั้งแรก → ลบนักเรียนตัวอย่างและเช็กอินของพวกเขาออก
    const demo = Object.values(d.students).filter(s => s.demo).map(s => s.sid);
    if (demo.length && list.length) {
      demo.forEach(sid => { delete d.students[sid]; delete d.surveys[sid]; });
      d.checkins = d.checkins.filter(c => !demo.includes(c.sid)); removedDemo = demo.length;
    }
    list.forEach(s => { if (d.students[s.sid]) skipped++; else { d.students[s.sid] = {...s, created:Date.now()}; added++; } });
    Local.write(d); return {added, skipped, removedDemo};
  },
  async removeCheckin(sid, st){
    if (DB.mode === 'remote') return api('POST', {action:'uncheck', key:apiKey, sid, st});
    const d = Local.read(); d.checkins = d.checkins.filter(c => !(c.sid === sid && c.st === st)); Local.write(d); return {ok:true};
  },
  resetDemo(){ if (DB.mode === 'local') Local.write(makeSeed()); },
  /* แก้ไขชื่อฐาน / วิทยากร / ห้อง (Admin) → ทุกเครื่องเห็นชื่อใหม่ */
  async saveStation(st){
    const row = {id:st.id, name:st.name, th:st.th, speaker:st.speaker, room:st.room, desc:st.desc};
    if (DB.mode === 'remote') await api('POST', {action:'saveStation', key:apiKey, station:row});
    const list = store.get(SKEY, []).filter(x => x.id !== row.id).concat([row]);
    store.set(SKEY, list); applyStations(list);
    window.dispatchEvent(new Event('stations-updated'));
    return {ok:true};
  },
  clearAll(){ if (DB.mode === 'local') Local.write({v:2, students:{}, checkins:[]}); },
  /* จำลองผู้เข้าร่วม (เฉพาะโหมดทดลอง แตะเฉพาะนักเรียนตัวอย่าง) */
  simTick(){
    if (DB.mode !== 'local') return;
    const d = Local.read();
    const F = ['ปุณยวีร์','ชญาดา','อรปรียา','ณิชาภัทร','พิมพ์มาดา','กัญญาณัฐ','ศศิกานต์','ภัทรวดี'], M = ['ธีรภัทร','วรเมธ','ณภัทร','ปกรณ์','ชยพล','กันตภณ','ภาคิน','สิรวิชญ์'];
    const L = ['ใจดี','สายทอง','เรืองศรี','ปัญญาวงศ์','ศรีสุข','บุญมี','ทองคำ','แสงจันทร์'];
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const demo = Object.values(d.students).filter(s => s.demo);
    if (demo.length < 60 && Math.random() < .22) {
      const f = Math.random() < .5, lvl = 1 + Math.floor(Math.random() * 6);
      let sid; do { sid = String(60000 + lvl * 1000 + 100 + Math.floor(Math.random() * 900)); } while (d.students[sid]);
      d.students[sid] = {sid, prefix: lvl <= 3 ? (f ? 'ด.ญ.' : 'ด.ช.') : (f ? 'นางสาว' : 'นาย'), first:pick(f ? F : M), last:pick(L), cls:`ม.${lvl}/${1 + Math.floor(Math.random() * 4)}`, demo:true, created:Date.now()};
    }
    const vm = visitedMap(d);
    const pool = Object.values(d.students).filter(s => s.demo && (vm[s.sid]?.size || 0) < STATIONS.length);
    if (pool.length) {
      const s = pick(pool), v = vm[s.sid] || new Map();
      const st = pick(STATIONS.filter(x => !v.has(x.id)));
      d.checkins.push({sid:s.sid, st:st.id, ts:Date.now(), by:st.speaker});
    }
    Local.write(d);
  },
  /* แจ้งเมื่อข้อมูลเปลี่ยน */
  subscribe(fn){
    if (DB.mode === 'local') {
      bc && bc.addEventListener('message', fn);
      window.addEventListener('storage', e => { if (e.key === LKEY) fn(); });
    } else {
      setInterval(() => { if (!document.hidden) fn(); }, CONFIG.POLL_MS);
    }
  },
};
const _write = Local.write; Local.write = d => { _write(d); DB._onLocal && DB._onLocal(); };

/* ================= ชื่อฐานที่ Admin แก้ไข =================
   ใช้ค่าที่จำไว้ในเครื่องก่อน (เปิดหน้าได้ทันที) แล้วดึงค่าล่าสุดจากเซิร์ฟเวอร์ ถ้าเปลี่ยนจะแจ้ง 'stations-updated' */
const SKEY = 'ttr-stations-v1';
function applyStations(list){
  let changed = false;
  (list || []).forEach(o => {
    const s = ST[+o.id]; if (!s) return;
    ['name', 'th', 'speaker', 'room', 'desc'].forEach(k => {
      const v = o[k] == null ? '' : String(o[k]).trim();
      if (v && s[k] !== v) { s[k] = v; changed = true; }
    });
  });
  return changed;
}
applyStations(store.get(SKEY, []));
async function refreshStations(){
  if (DB.mode !== 'remote') return;
  try {
    const list = (await api('GET', {action:'stations'})).stations || [];
    store.set(SKEY, list);
    if (applyStations(list)) window.dispatchEvent(new Event('stations-updated'));
  } catch(e) {}
}
setTimeout(refreshStations, 0);

/* ================= QR ================= */
/* สร้าง QR เป็น <img> (qrcode-generator รองรับภาษาไทยแบบ UTF-8 และคัดลอกไปหน้าพิมพ์ได้) */
function drawQR(el, text, size, dark = '#05060f'){
  el.innerHTML = '';
  if (!window.qrcode) { el.textContent = 'QR'; return; }
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const q = qrcode(0, 'M'); q.addData(String(text), 'Byte'); q.make();
  const n = q.getModuleCount(), quiet = 2, cell = Math.max(2, Math.floor(size * 2 / (n + quiet * 2)));
  const c = document.createElement('canvas'); c.width = c.height = (n + quiet * 2) * cell;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = dark;
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) ctx.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
  const img = new Image(); img.src = c.toDataURL('image/png'); img.alt = 'QR Code';
  el.appendChild(img);
}
function decodeImageFile(file){
  return new Promise((resolve, reject) => {
    if (!window.jsQR) return reject(new Error('ตัวอ่าน QR ยังโหลดไม่เสร็จ'));
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'), k = Math.min(1, 1200 / Math.max(img.width, img.height));
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, c.width, c.height);
        const code = jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height, {inversionAttempts:'attemptBoth'});
        code ? resolve(code.data) : reject(new Error('ไม่พบ QR Code ในรูปนี้ ลองถ่ายให้ชัดและเต็มกรอบขึ้น'));
      };
      img.onerror = () => reject(new Error('เปิดไฟล์รูปไม่ได้'));
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
/* กล้องสแกน QR ต่อเนื่อง */
function createCamera({video, canvas, onCode, onState}){
  let stream = null, raf = 0;
  const loop = () => {
    if (!stream) return;
    if (video.readyState >= 2 && window.jsQR) {
      const k = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
      canvas.width = Math.round(video.videoWidth * k); canvas.height = Math.round(video.videoHeight * k);
      const ctx = canvas.getContext('2d', {willReadFrequently:true});
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const code = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, {inversionAttempts:'dontInvert'});
      if (code && code.data) onCode(code.data);
    }
    raf = requestAnimationFrame(loop);
  };
  return {
    get on(){ return !!stream; },
    async start(){
      if (!navigator.mediaDevices?.getUserMedia) { onState('unavailable'); return false; }
      try {
        onState('requesting');
        stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}, width:{ideal:1280}}, audio:false});
        video.srcObject = stream; video.hidden = false; await video.play();
        onState('live'); loop(); return true;
      } catch(e) { stream = null; onState('blocked'); return false; }
    },
    stop(){
      cancelAnimationFrame(raf);
      if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
      video.srcObject = null; video.hidden = true; onState('off');
    },
  };
}

/* ================= Feedback: sound, toast, flash ================= */
let actx;
function beep(kind){
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === 'ok' ? [880, 1320, 1760] : kind === 'dup' ? [520, 520] : [300, 200];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = kind === 'ok' ? 'triangle' : 'square'; o.frequency.value = f;
      const t = actx.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.18);
    });
  } catch(e) {}
  if (navigator.vibrate) try { navigator.vibrate(kind === 'ok' ? 60 : [40, 60, 40]); } catch(e) {}
}
function toast({kind='ok', title, body, icon}){
  const wrap = $('#toastWrap'); if (!wrap) return;
  wrap.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'toast ' + (kind === 'ok' ? '' : kind);
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="toast-icon"><i class="fa-solid ${icon || (kind==='ok'?'fa-check':kind==='warn'?'fa-triangle-exclamation':'fa-xmark')}"></i></div>
    <div class="min-w-0"><div style="font-family:var(--f-display);font-weight:700;font-size:17px;line-height:1.3">${title}</div><div class="text-sm muted mt-0.5">${body || ''}</div></div>`;
  wrap.appendChild(el);
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 2800);
}
function flash(){ const f = $('#flash'); if (!f) return; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }

/* ================= SVG emblem (self-contained so exports keep it) ================= */
const GOLD_DEFS = '<defs><linearGradient id="gGoldS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".45" stop-color="#d9a93c"/><stop offset="1" stop-color="#7d5410"/></linearGradient><linearGradient id="gEmbS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2de2ff"/><stop offset="1" stop-color="#9b5cff"/></linearGradient></defs>';
function emblemSVG(gold, size){
  if (CONFIG.LOGO_URL) return `<img src="${esc(CONFIG.LOGO_URL)}" alt="ตราโรงเรียนตันตรารักษ์" ${size ? `width="${size}" height="${size}"` : ''} style="object-fit:contain;${size ? '' : 'width:100%;height:100%'}">`;
  const stroke = gold ? 'url(#gGoldS)' : 'url(#gEmbS)', fill = gold ? '#1a2a6c' : '#0b1030', txt = gold ? '#fff1b8' : '#e9edff';
  return `<svg viewBox="0 0 64 64" ${size ? `width="${size}" height="${size}"` : ''} aria-hidden="true">${GOLD_DEFS}
    <path d="M32 3 57 17v30L32 61 7 47V17Z" fill="${fill}" stroke="${stroke}" stroke-width="3.2"/>
    <path d="M32 11 50 21v22L32 53 14 43V21Z" fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".7"/>
    <text x="32" y="38" text-anchor="middle" font-family="${gold ? 'Noto Serif Thai, serif' : 'Chakra Petch, sans-serif'}" font-weight="700" font-size="16" fill="${txt}">ต.ร.</text></svg>`;
}

/* ================= 3D tilt for [data-tilt] ================= */
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('pointermove', e => {
    const el = e.target.closest('[data-tilt]');
    $$('[data-tilt]').forEach(t => { if (t !== el) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); } });
    if (!el) return;
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const k = el.hasAttribute('data-tilt-soft') ? 5 : 12;
    el.style.setProperty('--ry', ((px - .5) * k * 2).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((.5 - py) * k * 2).toFixed(2) + 'deg');
    el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
  });
}

/* ================= Files ================= */
function loadScript(src){ return new Promise((res, rej) => { if ([...document.scripts].some(s => s.src === src)) return res(); const el = document.createElement('script'); el.src = src; el.onload = res; el.onerror = () => rej(new Error('โหลดไลบรารีไม่สำเร็จ')); document.head.appendChild(el); }); }
function download(url, name){ const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }

/* ================= Shared UI: pass card, gauge, certificate, export ================= */
function passHTML(s, v){
  return `<div class="pass tilt" data-tilt id="passCard">
    <div class="pass-sheen"></div>
    ${s.demo ? '<span class="pill pill-dim demo-flag">ตัวอย่าง</span>' : ''}
    <div class="pass-top">${emblemSVG(false, 38)}<div><div class="t1">STATION PASS · 2569</div><div class="t2">Computer &amp; AI Innovation · โรงเรียนตันตรารักษ์</div></div></div>
    <div class="pass-body">
      <div class="min-w-0"><div class="avatar">${esc(initials(s))}</div><div class="pass-name">${esc(fullName(s))}</div>
        <div class="pass-meta"><span class="pill pill-blue">${esc(s.cls)}</span><span class="pill pill-dim mono">ID ${esc(s.sid)}</span></div></div>
      <div class="pass-qr" data-pass-qr></div>
    </div>
    <div class="pass-foot"><div class="dots">${STATIONS.map(st => `<span class="dot ${v.has(st.id)?'on':''}" style="--h:${st.h}" title="${esc(st.name)}"></span>`).join('')}</div>
      <div class="mono text-sm"><b class="${v.size>=CONFIG.MIN_STATIONS?'neon-green':'neon-blue'}">${v.size}</b><span class="faint">/${STATIONS.length} ฐาน</span></div></div>
  </div>`;
}
function mountPass(holder, s, v){ holder.innerHTML = passHTML(s, v); drawQR($('[data-pass-qr]', holder), qrPayload(s), 118); }
function gaugeSVG(v){
  const total = STATIONS.length, MIN = CONFIG.MIN_STATIONS;
  const segs = STATIONS.map((st, i) => { const on = v.has(st.id);
    return `<circle cx="100" cy="100" r="84" fill="none" pathLength="${total * 10}" stroke="${on ? st.h : 'rgba(255,255,255,.07)'}" stroke-width="16"
      stroke-dasharray="8.6 ${total * 10 - 8.6}" stroke-dashoffset="${-(i * 10 + 0.7)}" transform="rotate(-90 100 100)" ${on ? `style="filter:drop-shadow(0 0 6px ${st.h})"` : ''}/>`; }).join('');
  const rad = ((MIN / total) * 360 - 90) * Math.PI / 180;
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${segs}<line x1="${(100 + 72 * Math.cos(rad)).toFixed(1)}" y1="${(100 + 72 * Math.sin(rad)).toFixed(1)}" x2="${(100 + 97 * Math.cos(rad)).toFixed(1)}" y2="${(100 + 97 * Math.sin(rad)).toFixed(1)}" stroke="#fff1b8" stroke-width="2.5" style="filter:drop-shadow(0 0 4px #d9a93c)"/></svg>`;
}
function sealSVG(){
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${GOLD_DEFS}
    <defs><path id="sealArc" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs>
    <g fill="url(#gGoldS)">${Array.from({length:24}, (_, i) => `<path transform="rotate(${i*15} 60 60)" d="M60 2 L64 14 L56 14 Z"/>`).join('')}</g>
    <circle cx="60" cy="60" r="52" fill="url(#gGoldS)"/><circle cx="60" cy="60" r="47" fill="none" stroke="#7d5410" stroke-width="1"/>
    <circle cx="60" cy="60" r="34" fill="#1a2a6c" stroke="#fff1b8" stroke-width="1.5"/>
    <text font-family="Chakra Petch, sans-serif" font-size="8.2" font-weight="700" fill="#5a3a08" letter-spacing="1.6"><textPath href="#sealArc">COMPUTER &amp; AI INNOVATION • TANTRARAK 2569 •</textPath></text>
    <text x="60" y="66" text-anchor="middle" font-family="Chakra Petch, sans-serif" font-size="20" font-weight="700" fill="#fff1b8">AI</text>
    <text x="60" y="80" text-anchor="middle" font-family="Chakra Petch, sans-serif" font-size="6.5" fill="#fff1b8" letter-spacing="1">VERIFIED</text></svg>`;
}
/* 'ป.4/2 EP' → 'ประถมศึกษาปีที่ 4/2 (EP)' */
function levelText(cls){
  const m = String(cls || '').match(/^(ป|ม)\.(\d)\/(\d+)\s*(.*)$/);
  return m ? `${m[1] === 'ป' ? 'ประถมศึกษา' : 'มัธยมศึกษา'}ปีที่ ${m[2]}/${m[3]}${m[4] ? ' (' + m[4] + ')' : ''}` : String(cls || '');
}
/* อ่านไฟล์รายงานรายชื่อนักเรียนจากระบบทะเบียน (แถวเป็น array) → เฉพาะ ป./ม. ที่กำลังศึกษา */
const PREFIX_SHORT = {'เด็กชาย':'ด.ช.', 'เด็กหญิง':'ด.ญ.', 'นาย':'นาย', 'นางสาว':'นางสาว', 'ด.ช.':'ด.ช.', 'ด.ญ.':'ด.ญ.'};
function parseStudentReport(rows){
  const hi = rows.findIndex(r => r && r.some(c => String(c ?? '').trim() === 'ชั้น/ห้อง') && r.some(c => /รหัสนัก/.test(String(c ?? ''))));
  if (hi < 0) throw new Error('ไม่พบหัวตาราง "ชั้น/ห้อง" และ "รหัสนักศึกษา/รหัสนักเรียน" ในไฟล์');
  const h = rows[hi].map(c => String(c ?? '').trim());
  const col = names => h.findIndex(x => names.includes(x));
  const C = {cls:col(['ชั้น/ห้อง']), status:col(['สถานะ']), sid:col(['รหัสนักศึกษา', 'รหัสนักเรียน', 'เลขประจำตัวนักเรียน']), prefix:col(['คำนำหน้า']), first:col(['ชื่อ']), last:col(['นามสกุล'])};
  if ([C.cls, C.sid, C.first].some(i => i < 0)) throw new Error('คอลัมน์ในไฟล์ไม่ครบ (ต้องมี ชั้น/ห้อง, รหัสนักศึกษา, ชื่อ)');
  const out = [], skip = {kinder:0, inactive:0, invalid:0};
  for (const r of rows.slice(hi + 1)) {
    if (!r) continue;
    const cls = String(r[C.cls] ?? '').trim(); if (!cls) continue;
    if (/^อ\.|อนุบาล/.test(cls)) { skip.kinder++; continue; }
    if (C.status >= 0 && String(r[C.status] ?? '').trim() && String(r[C.status]).trim() !== 'กำลังศึกษา') { skip.inactive++; continue; }
    const sid = String(r[C.sid] ?? '').trim().toUpperCase(), first = String(r[C.first] ?? '').trim();
    if (!/^[A-Z0-9]{4,10}$/.test(sid) || !first) { skip.invalid++; continue; }
    const pre = String(r[C.prefix] ?? '').trim();
    out.push({sid, prefix:PREFIX_SHORT[pre] ?? pre, first, last:String(r[C.last] ?? '').trim(), cls});
  }
  return {students:out, skip};
}
const sigHTML = g => `<div class="sig"><div class="line"></div>( ${g && g.name ? esc(g.name) : '................................................'} )<br>${esc(g ? g.title : '')}</div>`;
function certificateHTML(s, v){
  const passed = STATIONS.filter(st => v.has(st.id));
  return `<div class="cert" id="certificate"><div class="cert-paper">
    <div class="cert-circuit"></div>
    <div class="cert-corner a"></div><div class="cert-corner b"></div><div class="cert-corner c"></div><div class="cert-corner d"></div>
    <div class="cert-head">${emblemSVG(true)}<div class="cert-school">โรงเรียนตันตรารักษ์<small>TANTRARAK SCHOOL</small></div></div>
    <div class="cert-title">CERTIFICATE</div><div class="cert-kind">เกียรติบัตร</div>
    <div class="cert-lead">ฉบับนี้ให้ไว้เพื่อแสดงว่า</div>
    <div class="cert-name">${esc(fullName(s))}</div>
    <div class="cert-class">นักเรียนชั้น${esc(levelText(s.cls))} · เลขประจำตัว ${esc(s.sid)}</div>
    <div class="cert-body">ได้เข้าร่วมและผ่านการเรียนรู้ฐานกิจกรรมครบ ${passed.length} จาก ${STATIONS.length} ฐาน ในงาน</div>
    <div class="cert-event">Computer <span>&amp;</span> AI Innovation</div>
    <div class="cert-stations">${passed.map(st => esc(st.name)).join(' · ')}</div>
    <div class="cert-date">ขอให้มีความสุข ความเจริญ และเป็นนักนวัตกรรุ่นใหม่สืบไป · ให้ไว้ ณ วันที่ ${esc(CONFIG.EVENT_DATE_TEXT || dFmt(Math.max(...v.values())))}</div>
    <div class="cert-foot">
      ${sigHTML(CONFIG.SIGNERS[0])}
      <div class="seal">${sealSVG()}</div>
      ${sigHTML(CONFIG.SIGNERS[1])}
    </div>
    <div class="cert-verify"><div class="code">รหัสยืนยันเกียรติบัตร<b>${certCode(s)}</b></div><div class="cert-qr" data-cert-qr></div></div>
  </div></div>`;
}
/* แสดงเกียรติบัตรพร้อมปุ่มพิมพ์ / PDF / PNG */
function mountCertificate(out, s, v){
  out.innerHTML = `<div class="cert-stage"><div class="cert-wrap tilt" data-tilt data-tilt-soft>${certificateHTML(s, v)}</div></div>
    <div class="glass panel-pad mt-6 flex flex-wrap items-center gap-3 justify-between">
      <div class="min-w-0"><span class="pill pill-green"><i class="fa-solid fa-unlock"></i> ปลดล็อกแล้ว</span> <span class="mono text-xs faint">${certCode(s)}</span></div>
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-gold" data-act="print"><i class="fa-solid fa-print"></i> พิมพ์ / Save PDF</button>
        <button class="btn btn-ghost" data-act="pdf"><i class="fa-solid fa-file-pdf"></i> ดาวน์โหลด PDF</button>
        <button class="btn btn-ghost" data-act="png"><i class="fa-solid fa-image"></i> PNG</button>
      </div>
    </div>`;
  drawQR($('[data-cert-qr]', out), verifyUrl(certCode(s)), 64, '#1f1830');
  $('[data-act="print"]', out).onclick = () => { prepareCertPrint(); window.print(); };
  $('[data-act="png"]', out).onclick = () => exportPng($('#certificate'), `certificate-${s.sid}.png`, 3);
  $('[data-act="pdf"]', out).onclick = () => exportPdf(s);
}
function prepareCertPrint(){
  const c = $('#certificate'), root = $('#printRoot'); if (!root) return;
  root.innerHTML = c ? c.outerHTML.replace('id="certificate"', 'id="certificatePrint"') : '';
  root.dataset.kind = 'cert';
}
async function snap(el, scale = 2){
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  const holders = [el, el.closest('[data-tilt]')].filter(Boolean);
  holders.forEach(h => { h.dataset.prevT = h.style.transform; h.style.transform = 'none'; });
  try { return await html2canvas(el, {scale, backgroundColor:null, useCORS:true, logging:false}); }
  finally { holders.forEach(h => h.style.transform = h.dataset.prevT || ''); }
}
async function exportPng(el, name, scale = 2){
  try { const c = await snap(el, scale); download(c.toDataURL('image/png'), name); toast({title:'บันทึก PNG แล้ว', body:esc(name), icon:'fa-image'}); }
  catch(err) { toast({kind:'err', title:'บันทึกภาพไม่สำเร็จ', body:esc(err.message)}); }
}
async function exportPdf(s){
  try {
    toast({title:'กำลังสร้าง PDF…', icon:'fa-spinner'});
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    const c = await snap($('#certificate'), 3);
    const pdf = new window.jspdf.jsPDF({orientation:'landscape', unit:'mm', format:'a4'});
    pdf.addImage(c.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
    pdf.save(`certificate-${s.sid}.pdf`);
    toast({title:'สร้าง PDF แล้ว', body:`certificate-${esc(s.sid)}.pdf`, icon:'fa-file-pdf'});
  } catch(err) { toast({kind:'err', title:'สร้าง PDF ไม่สำเร็จ', body:esc(err.message)}); }
}

window.CAI = {levelText, parseStudentReport, SURVEY, verifyUrl, CONFIG, STATIONS, ST, DB, $, $$, esc, fullName, initials, tFmt, dFmt, store, qrPayload, parseCode, parseQR, certCode, visitedMap,
  drawQR, decodeImageFile, createCamera, beep, toast, flash, emblemSVG, GOLD_DEFS, loadScript, download,
  passHTML, mountPass, gaugeSVG, certificateHTML, mountCertificate, prepareCertPrint, exportPng, exportPdf};
})();
