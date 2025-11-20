## เป้าหมาย
- จัดโครง UX/UI ให้ขยายได้จริง พร้อม Mockup ที่ใช้ข้อมูลตัวอย่าง (2 sessions) และรองรับการเพิ่มฟีเจอร์โดยไม่แตะระบบภายนอกในช่วงออกแบบ
- รวมเมนูและการเข้าถึงฟีเจอร์หลักไว้ที่ Homepage เพื่อช่วยค้นหาและเริ่มงานได้เร็ว

## หน้าหลัก (Homepage / Launcher)
- Feature Cards: New Scrape, Sessions, Dashboards, Classification Builder, Settings
- Quick Actions: "Start Scrape", "Open Last Session", "Open Page Dashboard"
- Recently Viewed: 5 รายการล่าสุด (session/page/template)
- Global Search: ค้นด้วยชื่อ session, page, tag

## Authentication & Settings
### Login/Signup
- Email + Password และ OAuth (ภายหลัง)
- UX: Minimal form, error states, remember me
### User Settings (API Keys & Models)
- บัตรตั้งค่า: Apify API Token, OpenAI (หรือเลือก Provider/Model)
- Model Picker: ลิสต์โมเดล + cost hint + default
- Usage Caps: กำหนดงบ/limit ต่อวัน (tokens/compute units)
- Proxy/Region: ตัวเลือก proxy/region (สำหรับ Apify)
- Security: masked input, verify key, ทดสอบการเชื่อมต่อแบบ sandbox

## Scrape (New Scrape)
- ใช้ฟอร์มเดิม (ปรับเป็น mock): Scraper Type, URLs/Bulk Add, count/timeframe, Facebook Group options
- Metadata: title, tags, classification toggle, sourceType/purpose
- Scheduling (ภายหลัง): one-off / recurring (daily/weekly)
- Preview Validation: ตรวจ URL/พารามิเตอร์ก่อนเริ่ม (mock)

## Sessions
### Sessions List
- Filters: status (Completed/Running/Failed), type (Website/Facebook Post/Group/Comment), date range
- Search: title/URL/tag/page name
- Saved Views: บันทึกชุด filter (เช่น "Facebook Group – last 7 days")
- Cards: ชื่อ, ประเภท, status badge, URL/page, started/updated, result count, quick actions (View, Export)
### Session Detail
- Tabs: Results, Classification, Chat with Data, Logs
- Header Summary: title, status, badges, parameters (count/timeframe), tags
- Results: ตารางไดนามิก + search/filter/visibility/export
- Classification: สรุป top intents/pain points/products/models ฯลฯ ตาม sourceType
- Chat with Data: วิเคราะห์ชุดผลด้วย LLM (mock)
- Logs: แสดงเหตุการณ์ (เริ่ม, สำเร็จ, partial, error)

## Classification Builder (Custom)
- Goal: ให้ผู้ใช้กำหนดการจัดประเภทเองโดยไม่ต้องแก้ Prompt ตรง
- Schema Designer:
  - Output Columns: สร้างคอลัมน์ (เช่น intents, pain_points, content_type)
  - Type/Enum: กำหนดชนิดข้อมูล, ตัวเลือกที่อนุญาต
- Keyword Sets:
  - เพิ่ม keyword + description (ความหมาย/ตัวอย่าง) ต่อคอลัมน์
  - Grouping และ Priority (เช่น แท็กที่น้ำหนักสูง)
- Rule Builder:
  - กฎง่าย: ถ้า text มี keyword X → ใส่ intent Y
  - กฎผสม: บวกเงื่อนไขหลายชุด (AND/OR)
- Prompt Assist:
  - Advanced Prompt Editor (สำหรับ power user)
  - Generate Prompt จาก schema/keywords อัตโนมัติ
- Test Run:
  - ใส่ตัวอย่าง text แล้วเห็นผลลัพธ์ทีละคอลัมน์ + explain
- Templates:
  - Preset สำหรับ General Group / Competitor Page / Own Page

## Dashboards (Scale)
### Global Dashboard
- KPIs: sessions (ทั้งหมด/สำเร็จ/ล้มเหลว), items scraped, top sources
- Trend: จำนวน items ต่อวัน/สัปดาห์, sentiment/intent trend
- Alerts: ล่าสุด (spikes, negative sentiment)
### Channel Dashboards
- Facebook Group / Page แยกตามชนิด
- Page-Level Views: เลือก page name แล้วดู KPIs ของ page นั้น (mentions, engagement, top topics)
- Compare: เปรียบเทียบหลาย pages (คู่แข่ง) ในกราฟเดียว (products/models/value props)
### Saved Dashboards
- บันทึกการจัดวาง widget, filters, date range เป็น view ส่วนตัว/ทีม

## Alerts & Automation (ภายหลัง)
- Rules: สร้างเงื่อนไข (เช่น negative sentiment > X, mentions keyword Y พุ่ง)
- Actions: ส่ง email/webhook/Slack, สร้าง task/lead
- Throttle: ป้องกัน spam alert

## Export & Sharing
- JSON/CSV export จาก Results และ Classification
- Share Link (mock) สำหรับดูหน้า session detail แบบ read-only

## Billing/Usage (ต่อผู้ใช้)
- Tokens/Compute Units: ใช้ไปเท่าไหร่/วัน/เดือน
- Caps: ปรับงบประมาณได้
- Warning: แจ้งเตือนใกล้ถึงลิมิต

## IA / เมนู
- Homepage รวมทางเข้า: Cards สำหรับ Features
- Navbar (Mock): Dashboard, New Scrape, Sessions, Classification Builder, Settings
- หลักการ: ทุกฟีเจอร์เข้าถึงได้ใน 1–2 คลิกจาก Home

## โครงข้อมูล & ความเป็นไปได้
- Mock Data: ใช้ไฟล์ `testing-scrape-results/*` และ `testing-classification-results/*`
- Provider Pattern: หน้าอ่านจาก mock store แทน DB/API
- เมื่อไปสู่จริง:
  - Auth: NextAuth (credentials/OAuth)
  - Tokens: เก็บต่อ user (encrypted) + Usage table
  - Job Queue: คิว scrape/LLM classification (background workers)
  - Indexing: เพิ่ม full-text/metrics index เพื่อ Dashboard และ search เร็ว

## แบ่ง Phase
### Phase 1 (Foundation)
- Login/Settings (API keys/model picker/usage caps)
- New Scrape (mock/live switch)
- Sessions List/Detail tabs (Results/Classification/Chat)
- Export/Share
### Phase 2 (Classification Builder)
- Schema Designer/Keyword Sets/Rule Builder
- Prompt Assist + Test Run
- Templates (General/Competitor/Own)
### Phase 3 (Dashboards & Scale)
- Global/Channel/Page dashboards + saved views
- Alerts basic (spike/negative sentiment)
- Compare brands/pages
### Phase 4 (Automation & Team)
- Alerts actions/webhook/Slack
- Team/RBAC (ภายหลัง)
- Scheduling/Recurring scrapes

## องค์ประกอบ UI ที่ต้องเพิ่ม
- Components: Tabs (page-level), Cards summary, Filters toolbar, Saved Views dropdown, Rule Builder UI (chips/conditions), Template picker
- Accessibility/Error States: ข้อความชัดเจน/ฟีดแบค, skeletons/loading

## Mock Implementation (สอดคล้องที่มี)
- ใช้หน้า Mock ที่มีอยู่: `/mock`, `/mock/scrape`, `/mock/sessions`, `/mock/sessions/post`, `/mock/sessions/group`
- เพิ่มหน้า Settings (Mock) และ Classification Builder (Mock) ตามแผน เพื่อทดลอง UX ก่อนเชื่อมระบบจริง

## สรุปความเป็นไปได้
- ทุกหน้ามี path สอดคล้องกับโครง Next.js ที่ใช้อยู่และสามารถเริ่มจาก Mock ได้ทันที
- เมื่อต้องต่อระบบจริง เพิ่ม auth, per-user tokens, queue/background, และอินเด็กซ์สำหรับ dashboard โดยไม่กระทบ UX ที่ออกแบบไว้