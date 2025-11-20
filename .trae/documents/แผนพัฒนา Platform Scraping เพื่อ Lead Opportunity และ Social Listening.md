## วิสัยทัศน์

* ยกระดับแพลตฟอร์มให้นักการตลาดค้นหาโอกาสทางลูกค้า (Lead) และฟังเสียงผู้บริโภค (Social Listening) แบบ end‑to‑end: เก็บข้อมูลจาก Web/Social → จัดระเบียบ → วิเคราะห์ด้วย AI → แจ้งเตือน/ส่งต่อเข้าเครื่องมือทำงาน

* ใช้สแต็กปัจจุบัน (Next.js + Apify + Prisma + OpenAI) ขยายฟีเจอร์โดยเน้นความเสถียรและต้นทุนที่คุมได้

## ผู้ใช้เป้าหมาย/กรณีใช้งาน

* Marketer: ค้นหา Lead จากเว็บไซต์/เพจคู่แข่ง, สร้างรายชื่อและติดตาม Intent

* Social team: ฟังเสียงแบรนด์/แคมเปญ, วิเคราะห์ Sentiment/Trend, แจ้งเตือน Spike/วิกฤต

* Analyst/BD: เจาะลึกข้อมูลเชิงหัวข้อ, Benchmark คู่แข่ง, ค้นหา Influencer/แหล่งกระจายข่าว

## โครงฟีเจอร์หลัก

* Lead Opportunity

  * Extract ข้อมูลติดต่อพื้นฐาน (ชื่อ/อีเมล/โทรศัพท์/ตำแหน่ง) และข้อมูลบริษัท/โดเมน

  * Intent Signals จากคอนเทนต์/หน้าเว็บไซต์ (เช่น CTA, Pricing/Contact page, Job posts) + Rule/LLM scoring

  * Lead Lists: จัดกลุ่ม, de‑dup, tag/notes, export CSV/API

* Social Listening

  * Keyword/Brand/Competitor Monitoring จากหลายแหล่ง (Facebook Page/Group, Website ข่าว/บล็อก)

  * Sentiment/Topic Clustering/Trend (รายวัน/รายสัปดาห์), Spike/Anomaly Alerts

  * Influencer/Source Discovery: ระบุผู้โพสต์/แหล่งที่มีอิทธิพลและการแพร่กระจาย

* Automation & Alerts

  * Saved Queries/Templates, Schedule Scraping (รายวัน/รายสัปดาห์)

  * Alerts ผ่าน Email/Slack/Webhook เมื่อพบโอกาส/วิกฤตตามเงื่อนไข

* Data Management & Discovery

  * Unified schema + Tagging/Filters, Full‑text & Semantic Search (Embeddings)

  * Dashboards สำหรับ Leads/Listening (สรุป, Drill‑down)

* Governance

  * Role‑based access, Audit trail, PII handling (redaction/masking), Quotas

## Roadmap ตามระยะ (Incremental)

### Phase 1: Foundation & Quick Wins (2–3 สัปดาห์)

* Saved Queries/Template สำหรับประเภท scrape ที่ใช้บ่อย

* Scheduling ขั้นต้น (เวลาคงที่ + queue เบื้องต้น) และหน้าจอสถานะงาน

* Lead Basics: ตรวจจับอีเมล/โทรศัพท์/ชื่อ/ตำแหน่งจากผล scrape + de‑dup

* Export/Share: CSV/JSON และลิงก์แชร์ session พร้อมสิทธิ์พื้นฐาน

* Basic Alerts: แจ้งเตือนเมื่อพบ keyword/PII/intent พื้นฐาน หรือเมื่อ scrape เสร็จ/ล้มเหลว

* UX: ปรับหน้า Sessions/Details ให้เห็นผลเร็ว, ค้นหา/กรอง/แท็ก

* Definition of Done: เปิดใช้กับเว็บไซต์ทั่วไป + Facebook, แจ้งเตือน/บันทึก Lead ได้, ไม่พึ่งพาเครื่องมือภายนอกมาก

### Phase 2: Lead & Listening v1 (3–4 สัปดาห์)

* Intent Scoring v1: Rule‑based + LLM Assist พร้อมปรับเกณฑ์ได้ต่อ session/source

* Social Listening Dashboard v1: Sentiment, Keyword Trend, Top Topics/Posts/Authors

* Influencer/Source Discovery เบื้องต้น: อันดับผู้โพสต์/แหล่งข่าวตาม engagement/ความถี่

* Alerts เงื่อนไขยืดหยุ่น (keyword + sentiment + spike) และช่องทางส่งต่อ (Email/Slack/Webhook)

* API สำหรับ Lead Lists (อ่าน/เพิ่ม/อัปเดต/ส่งออก)

* Acceptance: Marketer ใช้งานจริงเพื่อหา Lead/ติดตามเสียงแบรนด์แบบรายสัปดาห์

### Phase 3: Automation & Integrations (3–4 สัปดาห์)

* Workflow Builder: playbooks เช่น “เจอ intent สูง → สร้าง lead → ส่ง webhook”

* CRM/MarTech Connectors (generic ผ่าน webhook + CSV; ตัวเชื่อมเฉพาะค่อยตามมา)

* Batch Classification & Throttling: จัด batch, backoff, retry, รายงานความคืบหน้า

* Job Queue/Worker แยกจาก API เพื่อความเสถียรงานยาว

* Streaming Progress/SSE: อัปเดตผลระหว่าง scrape/classify

* Role‑Based Access & Audit เบื้องต้น

### Phase 4: Advanced Insights (4+ สัปดาห์)

* Topic Taxonomy Builder: สร้างหมวดหมู่หัวข้อเฉพาะธุรกิจและ training prompts

* Competitor Benchmarking: เปรียบเทียบแบรนด์/คู่แข่งตาม sentiment/volume/value props

* Anomaly Detection/Spike Root‑Cause (เชื่อมเวลา/เหตุการณ์)

* Multi‑channel เพิ่มเติม (X/YouTube/Instagram ผ่าน Actors/feeds ที่เหมาะสม)

* RAG over Historical Data: Q\&A บนคลังผล scrape ย้อนหลัง

### Phase 5: Scale, Compliance, Observability (ต่อเนื่อง)

* Multi‑tenant, Quotas/Rate limit ต่อองค์กร/ผู้ใช้

* PII governance, opt‑out lists, consent policies

* Monitoring/Tracing/Cost dashboards, Error budgets

* Hardening security และ Legal guidance สำหรับ scraping แหล่งข้อมูลสาธารณะ

## แนวทางเทคนิคหลัก

* Background Processing: แยก worker/queue สำหรับ scrape/classification; ใช้ backoff/retry + partial save

* Embeddings/Search: เก็บ embeddings (เช่น pgvector บน Postgres) เพื่อ semantic search/listening

* Scoring Pipeline: Layering กฎ + LLM + feedback loop ปรับคะแนน/น้ำหนัก

* Alerts Engine: rule evaluator + dedup + ช่องทางส่งต่อหลายแบบ

* Data Contracts: unified schema/typing ต่อ source, tagging/metadata สม่ำเสมอ

## ตัวชี้วัดความสำเร็จ (KPIs)

* Leads ที่ตรวจจับ/ส่งออกต่อสัปดาห์, อัตรา de‑dup, อัตราเปิด/คลิกแจ้งเตือน

* Scrape success rate/latency, Cost per 1k items, Classification accuracy

* Adoption: จำนวน Saved Queries/Workflows, การใช้งานแดชบอร์ดฟังเสียงแบรนด์

## ความเสี่ยง/ข้อควรระวัง

* ข้อจำกัดแพลตฟอร์มดีพลอยสำหรับงานยาว (ใช้ worker/queue แยก)

* กฎหมาย/นโยบายแหล่งข้อมูลสาธารณะ (กำกับ PII/consent, robots/ToS)

* ต้นทุน LLM/Embeddings (ทำ batching/limit, เลือกโมเดลเหมาะงาน)

โปรดยืนยัน Roadmap นี้หรือระบุลำดับความสำคัญที่ต้องการก่อน แล้วผมจะลงรายละเอียดสเปก/งานแต่ละ Phase และเสนอวิธีติดตั้งเชิงเทคนิคให้พร้อมดำเนินการ
