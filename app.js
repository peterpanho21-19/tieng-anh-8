// Danh sách tài liệu. Thêm / sửa tài liệu ở đây; file PDF đặt trong thư mục pdf/.
const DOCS = [
  { id: "unit-07", week: 1, title: "Unit 7 – Environmental Protection", note: "Bảo vệ môi trường. Mệnh đề trạng ngữ chỉ thời gian; phát âm /bl/ và /kl/.", pages: 3 },
  { id: "unit-08", week: 2, title: "Unit 8 – Shopping", note: "Mua sắm và tiêu dùng. Trạng từ chỉ tần suất; hiện tại đơn cho sự kiện tương lai.", pages: 3 },
  { id: "unit-09", week: 3, title: "Unit 9 – Natural Disasters", note: "Thiên tai và ứng phó. Quá khứ tiếp diễn.", pages: 3 },
  { id: "review-3", week: 4, title: "Review 3 – Units 7–9", note: "Tự làm 25–30 phút để ôn lại Unit 7–9.", pages: 1 },
  { id: "unit-10", week: 5, title: "Unit 10 – Communication in the Future", note: "Giao tiếp trong tương lai. Giới từ chỉ nơi chốn và thời gian; đại từ sở hữu.", pages: 3 },
  { id: "unit-11", week: 6, title: "Unit 11 – Science and Technology", note: "Khoa học và công nghệ. Câu tường thuật: câu trần thuật.", pages: 3 },
  { id: "unit-12", week: 7, title: "Unit 12 – Life on Other Planets", note: "Sự sống trên các hành tinh khác. Câu tường thuật: câu hỏi.", pages: 3 },
  { id: "review-4", week: 8, title: "Review 4 – Units 10–12", note: "Ôn lại Unit 10–12 và chữa lỗi.", pages: 1 }
];

const EXTRA = [
  { id: "dap-an", title: "Đáp án tất cả các Unit", note: "Chỉ xem sau khi đã tự làm bài.", pages: 5 },
  { id: "tong-hop-khong-dap-an", title: "Trọn bộ (không kèm đáp án)", note: "Gộp toàn bộ Unit 7–12 và hai bài Review trong một file.", pages: 21 }
];

const PLAN = [
  [1, "Unit 7"], [2, "Unit 8"], [3, "Unit 9"], [4, "Review 3"],
  [5, "Unit 10"], [6, "Unit 11"], [7, "Unit 12"], [8, "Review 4 và chữa lỗi"]
];

const CFG = window.SITE_CONFIG || {};
const MIN_SHOW = Number(CFG.hienThiToiThieu || 0);
const COOLDOWN_MS = 12 * 60 * 60 * 1000;

let counts = {};          // { id: { views, downloads } }
let db = null;            // Firestore, nếu kết nối được
let fs = null;            // các hàm Firestore
const els = {};           // tham chiếu phần tử đếm theo id

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function fmt(n) {
  if (n === undefined || n === null) return "–";
  if (n < MIN_SHOW) return "–";
  return Number(n).toLocaleString("vi-VN");
}

function refresh(id) {
  const c = counts[id] || {};
  const e = els[id];
  if (!e) return;
  e.views.textContent = fmt(db ? (c.views || 0) : undefined);
  e.downloads.textContent = fmt(db ? (c.downloads || 0) : undefined);
}

// Chống đếm trùng: mỗi trình duyệt tối đa 1 lần / 12 giờ cho mỗi (tài liệu, loại).
function shouldCount(kind, id) {
  const key = "cnt:" + kind + ":" + id;
  try {
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < COOLDOWN_MS) return false;
    localStorage.setItem(key, String(Date.now()));
  } catch (e) { /* localStorage bị chặn: vẫn đếm */ }
  return true;
}

async function bump(id, kind) {
  if (!db) return;
  if (!shouldCount(kind, id)) return;
  const c = counts[id] || (counts[id] = { views: 0, downloads: 0 });
  c[kind] = (c[kind] || 0) + 1;     // cập nhật giao diện ngay
  refresh(id);
  try {
    const payload = { views: fs.increment(kind === "views" ? 1 : 0), downloads: fs.increment(kind === "downloads" ? 1 : 0) };
    await fs.setDoc(fs.doc(db, "stats", id), payload, { merge: true });
  } catch (err) {
    console.warn("Không ghi được bộ đếm:", err);
  }
}

function card(d, withWeek) {
  const c = el("article", "card");
  if (withWeek) c.appendChild(el("span", "week", "Tuần " + d.week));
  c.appendChild(el("h3", "", d.title));
  c.appendChild(el("p", "note", d.note));
  c.appendChild(el("p", "meta", d.pages + " trang · PDF"));

  const row = el("div", "counts");
  const v = el("span"); v.append("Xem: "); const vb = el("b", "", "–"); v.appendChild(vb);
  const dl = el("span"); dl.append("Tải: "); const db_ = el("b", "", "–"); dl.appendChild(db_);
  row.append(v, dl);
  els[d.id] = { views: vb, downloads: db_ };
  c.appendChild(row);

  const act = el("div", "actions");
  const file = "pdf/" + d.id + ".pdf";
  const view = el("a", "btn primary", "Xem");
  view.href = file; view.target = "_blank"; view.rel = "noopener";
  view.addEventListener("click", () => bump(d.id, "views"));
  const dl2 = el("a", "btn ghost", "Tải về");
  dl2.href = file; dl2.setAttribute("download", d.id + ".pdf");
  dl2.addEventListener("click", () => bump(d.id, "downloads"));
  act.append(view, dl2);
  c.appendChild(act);
  return c;
}

function render() {
  const g = document.getElementById("grid");
  DOCS.forEach(d => g.appendChild(card(d, true)));
  const g2 = document.getElementById("grid-extra");
  EXTRA.forEach(d => g2.appendChild(card(d, false)));
  const tb = document.getElementById("plan-body");
  PLAN.forEach(([w, t]) => {
    const tr = document.createElement("tr");
    tr.append(el("td", "", "Tuần " + w), el("td", "", t));
    tb.appendChild(tr);
  });
}

async function initCounter() {
  const f = CFG.firebase || {};
  if (!f.apiKey || !f.projectId) return;        // chưa cấu hình: chạy không có bộ đếm
  try {
    const [appMod, fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
    ]);
    const app = appMod.initializeApp(f);
    db = fsMod.getFirestore(app);
    fs = fsMod;
    const snap = await fs.getDocs(fs.collection(db, "stats"));
    snap.forEach(s => { counts[s.id] = s.data(); });
    [...DOCS, ...EXTRA].forEach(d => refresh(d.id));
    const siteEl = document.getElementById("stat-site");
    const site = counts["site"] || {};
    siteEl.textContent = fmt(site.views || 0);
    // Đếm lượt truy cập trang: 1 lần mỗi 12 giờ
    if (shouldCount("views", "site")) {
      site.views = (site.views || 0) + 1;
      counts["site"] = site;
      siteEl.textContent = fmt(site.views);
      await fs.setDoc(fs.doc(db, "stats", "site"), { views: fs.increment(1), downloads: fs.increment(0) }, { merge: true });
    }
  } catch (err) {
    console.warn("Bộ đếm chưa chạy được:", err);
    db = null;
  }
}

render();
initCounter();
