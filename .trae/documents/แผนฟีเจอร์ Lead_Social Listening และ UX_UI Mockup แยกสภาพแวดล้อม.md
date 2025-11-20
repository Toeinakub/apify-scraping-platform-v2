## เป้าหมายและภาพรวม
- ยกระดับแพลตฟอร์มให้ตอบโจทย์นักการตลาดสำหรับ Lead Opportunity และ Social Listening โดยคงโครงสร้าง/ฐานข้อมูลเดิมและทำ Mockup UI แยกสภาพแวดล้อม
- ใช้ข้อมูลตัวอย่างที่มีอยู่เพื่อออกแบบ/ทดสอบ UX โดยไม่เรียกบริการภายนอก (Apify/OpenAI/DB)

## แนวทางฟีเจอร์: Lead Opportunity
1. การตั้งค่าแหล่งข้อมูล (Source Onboarding)
- Multi-URL/แหล่งรวม: เพิ่มตัวเลือกหลาย URL/เพจพร้อมกัน (รองรับอยู่แล้วใน `ScrapingParametersSchema`)
- เทมเพลตแหล่งข้อมูลยอดนิยม (Facebook Page/Group, Website)
2. การดึงเอนทิตี/ช่องทางติดต่อ
- Extract ชื่อองค์กร/แบรนด์/สินค้า/อีเมล/โทรศัพท์/ลิงก์ติดต่อจากผล scrape
- แสดง preview พร้อมการยืนยัน/แก้ไข
3. Lead Scoring
- กติกาเบื้องต้นจากสัญญาณ (ความถี่ mention, คำที่บ่งชี้ intent, engagement)
- ปรับคะแนนได้ตามแคมเปญ/กลุ่มเป้าหมาย
4. Pipeline & Deduplication
- กระดาน Leads (Kanban) + การรวมซ้ำด้วย heuristics
5. Alerts & Export
- แจ้งเตือน lead ใหม่ตามเงื่อนไข
- Export/ส่งออกไป CRM (CSV/Webhook)

## แนวทางฟีเจอร์: Social Listening
1. Sentiment/Topic/Intent Classification
- โมเดลจัดหมวดหมู่หัวข้อ/เจตนา/ความรู้สึกจากข้อความ (ใช้ LLM ต่อยอด `lib/services/classification.ts`)
2. Trend Over Time & Spikes
- กราฟจำนวน mention/sentiment รายวัน/สัปดาห์ พร้อมการตรวจจับ spike
3. Keyword/Hashtag Monitoring
- บัญชีคำหลัก/แท็กที่ติดตาม + ตัวกรอง/การค้นหา
4. Influencer/Source Impact
- อันดับเพจ/กลุ่ม/ผู้โพสต์ตาม reach/engagement
5. Noise/Spam Filtering
- ลดสแปม/โพสต์ซ้ำด้วยกฎและสัญญาณซ้ำ
6. Alerts & Compare Dashboards
- แจ้งเตือนเมื่อ sentiment ติดลบ, แบรนด์คู่แข่งพุ่งสูง
- หน้ารวมเปรียบเทียบแบรนด์/เพจ/คีย์เวิร์ด

## แบ่ง Phase การพัฒนา
### Phase 1: Core UX, Dashboard และ Alerts พื้นฐาน (2–3 สัปดาห์)
- หน้า Source Setup + Scraping Form ที่ชัดเจน (ปรับจาก `components/scrape/ScrapingForm.tsx`)
- Sessions List & Detail UI ปรับปรุง (เพิ่ม summary bar, quick actions)
- Alerts เบื้องต้น: ตั้งเงื่อนไขบนผลลัพธ์ (เช่น mention ของแบรนด์/คำค้น)
- Export/Sharing UI กลาง (CSV/JSON)

### Phase 2: Lead Scoring + Social Listening เบื้องต้น (3–4 สัปดาห์)
- Entity extraction + lead capture UI
- Lead scoring rules และกระดาน Leads
- Sentiment/Topic classification + dashboard ระดับพื้นฐาน
- Keyword monitoring พร้อมบันทึก preset filters

### Phase 3: Automation & Insights ขั้นสูง (4–6 สัปดาห์)
- Workflow อัตโนมัติ (เช่น เมื่อพบ lead>threshold → แจ้งเตือน+ส่ง CSV)
- Trend analysis + spike detection + compare dashboards
- Influencer detection และ source ranking
- Multi-channel scheduling สำหรับ scrape (ตั้งเวลา/ความถี่)

### Phase 4: Scale & Collaboration (ต่อเนื่อง)
- RBAC/ทีม/คอมเมนต์ใน Leads
- การจัดการต้นทุน LLM/Apify (batching/throttling)
- Indexing/ค้นหาเร็ว (เช่น Postgres full-text/Vector index สำหรับข้อความ)

## UX/UI Mockup แยกสภาพแวดล้อม (ไม่แตะโครงสร้าง/DB เดิม)
### วิธีรันคนละ localhost
- ใช้พอร์ตแยก: `npm run dev -- -p 3001` หรือ `PORT=3001 next dev` เพื่อให้รันคู่กับโปรเจกต์เดิม
- ไฟล์ `.env.mock.local`: ไม่ต้องใส่ `OPENAI_API_KEY`/`APIFY_API_TOKEN` เพื่อบังคับใช้โหมด mock

### โหมด Mock โดยไม่แตะบริการจริง
- ใช้ข้อมูลตัวอย่างจาก `testing-results/*.json` เติมเข้าสู่ UI โดยตรง
- ปิดการเรียก `app/api/*` ทั้งหมดใน mock (แทนด้วย mock adapters/ตัวแปรสถานะในหน้า)
- จุดฉีดข้อมูล:
  - ตารางผล: `components/results/DataTable.tsx` รับ `data` จาก mock
  - หน้ารายละเอียด session: แทนที่ `getSessionById` ด้วย mock ในโหมดนี้

### โครงสร้างไฟล์สำหรับ Mock (ในโฟลเดอร์ v2 ที่แยกแล้ว)
- คงไว้: `app/`, `components/`, `types/`, `lib/utils/*`, `next.config.ts`
- ตัดออกชั่วคราว (ในสำเนา v2 เท่านั้น): `app/api/**`, `lib/apify/**`, `lib/ai/**`, `lib/db/**`, `scripts/**`, `prisma/**`, `docs/**`
- เพิ่มไฟล์ mock (เมื่อได้รับอนุมัติ):
  - `mock/data/session.json` ตัวอย่างผลลัพธ์
  - `mock/services/session.ts` ส่งออกฟังก์ชันอ่าน mock data

### หน้าจอ/องค์ประกอบ Mockup ที่จะทำ
- Dashboard ใหม่: สรุปจำนวน results/mentions/sentiment และ alerts ล่าสุด
- Source Setup: ฟอร์มหลาย URL พร้อมการตรวจความถูกต้อง
- Sessions List: การกรอง/ค้นหา/แท็ก
- Session Detail: แท็บ Results/Chat-with-Data/Classification พร้อมสรุปสถิติด้านบน
- Lead Board: Kanban columns (New/Qualified/Contacted)
- Social Listening: กราฟ trend, sentiment breakdown, top topics/hashtags, top sources

### แนวทางเทคนิคการ Mock
- สร้างโหมด `UX_MOCK_MODE` (env) ให้หน้า/คอมโพเนนต์ตรวจและดึงจาก mock providers แทนบริการจริง
- หลีกเลี่ยงการแก้ import ในหลายไฟล์ด้วย pattern provider เดียว (เช่น `getSession` ถูก swap ไปที่ mock เมื่อ `UX_MOCK_MODE=true`)

## จุดเชื่อมต่อในโค้ดปัจจุบัน (สำหรับภายหลังเมื่อยืนยัน)
- สร้าง provider/mock สำหรับ:
  - Session queries: `lib/db/queries.ts:4-26, 48-76, 78-105, 107-131, 157-168`
  - Scrape runner: `app/api/scrape/route.ts:64-200`
  - Classification: `lib/services/classification.ts:192-221`
- UI ใช้ข้อมูล mock ที่ `components/sessions/SessionDetailClient.tsx:126-467` และ `components/results/DataTable.tsx:500-904`

## ความเสี่ยง/การป้องกัน
- ลบไฟล์ในสำเนา v2 เท่านั้น เพื่อไม่แตะโปรเจกต์เดิม
- ใช้ env flag + provider pattern เพื่อสลับ mock/จริงได้ง่าย
- ไม่เพิ่มไลบรารีใหม่จนกว่าจะยืนยัน (เช่น Storybook)

## การส่งมอบและตรวจสอบผล
- รัน mock UI บนพอร์ต 3001 พร้อมตัวอย่างข้อมูล และแคปหน้าจอ/เดินทดสอบฟลว์
- เช็ครายการฟีเจอร์ตาม Phase ว่าตรงความต้องการนักการตลาด (Lead/Social) และปรับแก้จาก feedback

## ขอการยืนยัน
- ยืนยันแนวทางฟีเจอร์และแผน Phase
- ยืนยันการทำโหมด Mock (ตัดไฟล์ใน v2 และเพิ่ม `mock/*`) และพอร์ต 3001
- เมื่อยืนยันแล้ว จะเริ่มลงมือปรับโค้ดเฉพาะในสำเนา v2 โดยไม่กระทบโปรเจกต์เดิม