// General Group classification enums & keyword dictionaries
// Intended for posts from Facebook Groups / general user discussions about home & construction.

export type PostIntent =
  | 'ASK_ADVICE'
  | 'ASK_PRICE'
  | 'COMPLAIN'
  | 'SHOW_OFF'
  | 'PROMOTE_SERVICE'
  | 'SHARE_KNOWLEDGE';

export type HouseZone =
  | 'GENERAL'
  | 'LIVING_ROOM'
  | 'BEDROOM'
  | 'KITCHEN'
  | 'BATHROOM'
  | 'FACADE'
  | 'FLOOR'
  | 'ROOF'
  | 'BALCONY'
  | 'CARPORT'
  | 'GARDEN';

export type PainPointTag =
  | 'HEAT'
  | 'LEAKING'
  | 'NOISE'
  | 'MOLD'
  | 'SLIPPERY'
  | 'CRACKING'
  | 'DIRT'
  | 'MAINTENANCE_COMPLEXITY'
  | 'COST_CONFUSION'
  | 'CONTRACTOR_QUALITY'
  | 'DESIGN_IDEA'
  | 'PRODUCT_SELECTION_CONFUSION'
  | 'SPACE_LIMIT'
  | 'DURABILITY'
  | 'HUMIDITY_ODOR';

export type MaterialCategory =
  | 'FLOOR_TILE'
  | 'SPC_FLOOR'
  | 'LAMINATE'
  | 'WALL_TILE'
  | 'GYPSUM_BOARD'
  | 'FIBER_CEMENT_BOARD'
  | 'ROOF_TILE'
  | 'INSULATION'
  | 'WATERPROOFING'
  | 'SEALANT'
  | 'PAINT'
  | 'STRUCTURE_PILE'
  | 'BUILT_IN'
  | 'WINDOW_DOOR'
  | 'OTHER';

export type DesignStyleTag =
  | 'MUJI'
  | 'MINIMAL'
  | 'JAPANDI'
  | 'LOFT'
  | 'TROPICAL'
  | 'MODERN'
  | 'RESORT'
  | 'CONTEMPORARY_THAI';

export type JourneyStage =
  | 'PLANNING'
  | 'DESIGNING'
  | 'SELECTING_MATERIAL'
  | 'BUDGETING'
  | 'CONTRACTOR_SELECTION'
  | 'DURING_CONSTRUCTION'
  | 'POST_CONSTRUCTION_ISSUE';

export type PersonaType =
  | 'HOMEOWNER'
  | 'FUTURE_OWNER'
  | 'CONTRACTOR'
  | 'DESIGNER'
  | 'SHOP_SELLER'
  | 'INVESTOR';

export interface ClassifiedPostMeta {
  primaryIntent?: PostIntent;
  intents?: PostIntent[];
  houseZones?: HouseZone[];
  painPoints?: PainPointTag[];
  materialCategories?: MaterialCategory[];
  designStyles?: DesignStyleTag[];
  journeyStages?: JourneyStage[];
  personas?: PersonaType[];
}

export const POST_INTENT_KEYWORDS: Record<PostIntent, string[]> = {
  ASK_ADVICE: [
    'ขอคำแนะนำ',
    'ขอความคิดเห็น',
    'รบกวนขอ',
    'ช่วยแนะนำ',
    'มีใครเคย',
    'อยากถามว่า',
    'ดีไหม',
    'โอเคไหม',
    'เวิร์กไหม',
    'ควรเลือกอะไร',
    'ยี่ห้อไหนดี',
    'แบบไหนดี',
    'แนะนำหน่อย',
    'ช่วยดูให้หน่อย',
  ],
  ASK_PRICE: [
    'ราคาเท่าไหร่',
    'ราคาประมาณ',
    'งบประมาณ',
    'งบเท่าไหร่',
    'คิดยังไง',
    'คิดราคา',
    'เรตค่าช่าง',
    'ราคากลาง',
    'ต่อเมตร',
    'ต่อตร.ม.',
    'ต่อตารางเมตร',
    'แพงไหม',
    'ถูกไหม',
  ],
  COMPLAIN: [
    'ปัญหา',
    'พัง',
    'แตก',
    'ร้าว',
    'รั่ว',
    'ซึม',
    'แย่มาก',
    'ไม่โอเค',
    'เสียใจ',
    'ผิดหวัง',
    'ต้องซ่อม',
    'ซ่อมบ่อย',
    'ใช้ไม่นาน',
    'ลำบากมาก',
    'ทรมาน',
    'รำคาญ',
    'เซ็ง',
    'ท้อเลย',
  ],
  SHOW_OFF: [
    'มาอวด',
    'โชว์ผลงาน',
    'รีวิวงาน',
    'งานที่ทำเสร็จ',
    'ก่อน-หลัง',
    'before after',
    'รูปหน้างาน',
    'จบงานแล้ว',
    'เสร็จแล้ว',
    'มาแชร์งาน',
    'รูปผลงาน',
  ],
  PROMOTE_SERVICE: [
    'รับทำ',
    'รับออกแบบ',
    'รับเหมา',
    'บริการ',
    'สนใจทัก',
    'ทักแชท',
    'อินบ็อกซ์',
    'inbox',
    'ติดต่อได้ที่',
    'โทร',
    'ไลน์',
    'line id',
    'ราคาพิเศษ',
    'โปรโมชัน',
    'โปรพิเศษ',
    'ทีมงานของเรา',
    'ช่างมืออาชีพ',
  ],
  SHARE_KNOWLEDGE: [
    'มาแชร์ประสบการณ์',
    'แบ่งปันประสบการณ์',
    'เผื่อเป็นประโยชน์',
    'บอกต่อ',
    'ข้อควรรู้',
    'ควรระวัง',
    'ทริกเล็กๆ',
    'ทริคเล็กๆ',
    'เทคนิคเล็กๆ',
    'วิธีเลือก',
    'สิ่งที่ได้เรียนรู้',
    'สรุปให้ฟัง',
  ],
};

export const HOUSE_ZONE_KEYWORDS: Record<HouseZone, string[]> = {
  GENERAL: ['ในบ้าน', 'ตัวบ้าน', 'บ้านทั้งหลัง', 'รอบบ้าน'],
  LIVING_ROOM: ['ห้องนั่งเล่น', 'โซฟา', 'ทีวีวอลล์', 'ผนังทีวี', 'ส่วนรับแขก'],
  BEDROOM: ['ห้องนอน', 'เตียงนอน', 'หัวเตียง'],
  KITCHEN: [
    'ห้องครัว',
    'ครัวไทย',
    'ครัวฝรั่ง',
    'เคาน์เตอร์ครัว',
    'ท็อปครัว',
    'top ครัว',
    'เคาน์เตอร์',
    'บิ้วอินครัว',
    'บิวท์อินครัว',
  ],
  BATHROOM: ['ห้องน้ำ', 'พื้นห้องน้ำ', 'ผนังห้องน้ำ', 'โถสุขภัณฑ์', 'โซนอาบน้ำ', 'shower'],
  FACADE: [
    'หน้าบ้าน',
    'ฟาซาด',
    'หน้าฟาซาด',
    'ผนังนอก',
    'ผนังภายนอก',
    'ผนังด้านนอก',
    'ซุ้มหน้าบ้าน',
  ],
  FLOOR: [
    'พื้นบ้าน',
    'พื้นชั้นล่าง',
    'พื้นชั้นบน',
    'พื้นชั้นสอง',
    'พื้นภายใน',
    'พื้นนอกบ้าน',
    'ปูพื้น',
    'กระเบื้องพื้น',
    'พื้นกระเบื้อง',
  ],
  ROOF: ['หลังคา', 'ฝ้าเพดาน', 'ฝ้าชั้นบน', 'โครงหลังคา', 'กันความร้อนบนหลังคา'],
  BALCONY: ['ระเบียง', 'ชาน', 'ชานระเบียง', 'ดาดฟ้า'],
  CARPORT: ['ที่จอดรถ', 'โรงจอดรถ', 'โรงรถ', 'กันสาด'],
  GARDEN: ['สวน', 'สนามหญ้า', 'ลานบ้าน', 'ทางเดินนอกบ้าน'],
};

export const PAIN_POINT_KEYWORDS: Record<PainPointTag, string[]> = {
  HEAT: [
    'ร้อนมาก',
    'ร้อนอบอ้าว',
    'ร้อนเหมือนเตาอบ',
    'อยู่ไม่ไหว',
    'บ้านร้อน',
    'ห้องร้อน',
    'ร้อนทั้งวัน',
    'ร้อนสะสม',
  ],
  LEAKING: ['รั่ว', 'ซึม', 'น้ำรั่ว', 'น้ำซึม', 'ฝนสาด', 'น้ำเข้า', 'ผนังชื้น', 'เพดานชื้น'],
  NOISE: [
    'เสียงดัง',
    'เสียงลอด',
    'เสียงรบกวน',
    'ได้ยินเสียงข้างนอก',
    'กันเสียงไม่ดี',
    'เก็บเสียงไม่อยู่',
  ],
  MOLD: ['เชื้อรา', 'คราบรา', 'ดำเป็นดวง', 'ขึ้นรา', 'กลิ่นอับ', 'อับชื้น'],
  SLIPPERY: ['ลื่นไหม', 'ลื่นมาก', 'กลัวลื่น', 'ลื่นอันตราย', 'หกล้ม', 'เสี่ยงล้ม'],
  CRACKING: [
    'ร้าว',
    'แตกร้าว',
    'แตกเป็นเส้น',
    'ผนังแตก',
    'ปูแล้วแตก',
    'พื้นโก่ง',
    'กระเบื้องโก่ง',
  ],
  DIRT: [
    'คราบสกปรก',
    'เลอะง่าย',
    'เปื้อนง่าย',
    'ทำความสะอาดยาก',
    'เช็ดไม่ออก',
    'เก็บฝุ่น',
    'ฝุ่นเกาะ',
  ],
  MAINTENANCE_COMPLEXITY: [
    'ดูแลยาก',
    'ต้องคอยดูแล',
    'ต้องคอยเช็ด',
    'ยุ่งยาก',
    'บำรุงรักษายาก',
  ],
  COST_CONFUSION: [
    'คิดราคา',
    'งงเรื่องราคา',
    'ราคากลาง',
    'ไม่รู้ว่าถูกหรือแพง',
    'คิดยังไงต่อตร.ม.',
    'ตีราคา',
    'เหมาราคา',
  ],
  CONTRACTOR_QUALITY: [
    'ช่างทำ',
    'ผู้รับเหมา',
    'โดนช่างหลอก',
    'งานไม่เนี๊ยบ',
    'ทำพัง',
    'ทำไม่ดี',
    'ต้องแก้งาน',
    'แก้หน้างาน',
  ],
  DESIGN_IDEA: [
    'ไอเดียแต่งบ้าน',
    'หาไอเดีย',
    'แบบไหนดี',
    'หาภาพตัวอย่าง',
    'inspiration',
    'อินสไปร์',
    'reference',
    'เรฟเฟอเรนซ์',
  ],
  PRODUCT_SELECTION_CONFUSION: [
    'เลือกไม่ถูก',
    'ตัวเลือกเยอะ',
    'ไม่รู้จะใช้แบบไหน',
    'ไม่รู้ต่างกันยังไง',
    'เทียบยี่ห้อ',
    'เทียบรุ่น',
    'ไหนดีสุด',
  ],
  SPACE_LIMIT: ['พื้นที่จำกัด', 'บ้านเล็ก', 'คอนโดเล็ก', 'พื้นที่น้อย', 'ต้องประหยัดพื้นที่'],
  DURABILITY: ['ไม่ทน', 'พังง่าย', 'ผุง่าย', 'ไม่คงทน', 'ลอก', 'ซีด', 'สีซีด'],
  HUMIDITY_ODOR: ['กลิ่นอับ', 'อับชื้น', 'ความชื้นสูง', 'ชื้นตลอด', 'ชื้นง่าย'],
};

export const MATERIAL_CATEGORY_KEYWORDS: Record<MaterialCategory, string[]> = {
  FLOOR_TILE: ['กระเบื้องพื้น', 'ปูกระเบื้อง', 'กระเบื้องปูพื้น', 'แกรนิตโต้', 'กระเบื้องแกรนิตโต้'],
  SPC_FLOOR: ['spc', 'พื้น spc', 'กระเบื้อง spc', 'ไม้ spc'],
  LAMINATE: ['ลามิเนต', 'พื้นลามิเนต', 'laminate'],
  WALL_TILE: ['กระเบื้องผนัง', 'กระเบื้องตกแต่งผนัง', 'ผนังกระเบื้อง'],
  GYPSUM_BOARD: ['ยิปซัมบอร์ด', 'แผ่นยิปซัม', 'ฝ้ายิปซัม'],
  FIBER_CEMENT_BOARD: [
    'ไฟเบอร์ซีเมนต์',
    'แผ่นไฟเบอร์',
    'แผ่นสมาร์ทบอร์ด',
    'สมาร์ทบอร์ด',
    'แผ่นซีเมนต์บอร์ด',
  ],
  ROOF_TILE: [
    'กระเบื้องหลังคา',
    'หลังคากระเบื้อง',
    'หลังคาลอน',
    'หลังคาเหล็ก',
    'เมทัลชีท',
    'metal sheet',
  ],
  INSULATION: ['ฉนวนกันความร้อน', 'ฉนวน', 'กันความร้อนบนฝ้า', 'กันร้อนหลังคา'],
  WATERPROOFING: ['กันซึม', 'น้ำยากันซึม', 'โพลียูรีเทนกันซึม', 'ซีเมนต์กันซึม'],
  SEALANT: ['ซีลแลนต์', 'ยาแนว', 'ซิลิโคนยาแนว', 'อุดรอยต่อ'],
  PAINT: ['สีทาบ้าน', 'ทาสี', 'สีทาภายใน', 'สีทาภายนอก', 'สีกันความร้อน'],
  STRUCTURE_PILE: ['เสาเข็ม', 'ฐานราก', 'คาน', 'ตอม่อ'],
  BUILT_IN: ['บิ้วอิน', 'บิวท์อิน', 'ตู้บิ้วอิน', 'งานบิ้วอิน'],
  WINDOW_DOOR: ['หน้าต่าง', 'ประตู', 'ประตูบานเลื่อน', 'บานเฟี้ยม'],
  OTHER: ['วัสดุอื่นๆ'],
};

export const DESIGN_STYLE_KEYWORDS: Record<DesignStyleTag, string[]> = {
  MUJI: ['มูจิ', 'muji', 'บ้านมูจิ', 'โทนไม้อ่อนมูจิ'],
  MINIMAL: ['มินิมอล', 'minimal', 'บ้านมินิมอล', 'ตกแต่งแบบมินิมอล'],
  JAPANDI: ['japandi', 'แจแปนดี้', 'ญี่ปุ่นผสมสแกน', 'ญี่ปุ่นสแกนดิเนเวีย'],
  LOFT: ['loft', 'ลอฟท์', 'ปูนเปลือย', 'ผนังปูนดิบ'],
  TROPICAL: ['ทรอปิคอล', 'tropical', 'บ้านสไตล์รีสอร์ท', 'บ้านสไตล์ทะเล'],
  MODERN: ['โมเดิร์น', 'modern', 'บ้านสไตล์โมเดิร์น'],
  RESORT: ['รีสอร์ท', 'เหมือนรีสอร์ท', 'ฟีลโรงแรม', 'ฟีลพักผ่อน'],
  CONTEMPORARY_THAI: ['ไทยประยุกต์', 'ไทยโมเดิร์น', 'ร่วมสมัย', 'เรือนไทยประยุกต์'],
};

export const JOURNEY_STAGE_KEYWORDS: Record<JourneyStage, string[]> = {
  PLANNING: [
    'กำลังจะสร้างบ้าน',
    'วางแผนสร้างบ้าน',
    'กำลังหาข้อมูลสร้างบ้าน',
    'คิดจะรีโนเวท',
    'อยากรีโนเวท',
  ],
  DESIGNING: [
    'หาไอเดีย',
    'หา reference',
    'หาเรฟ',
    'ออกแบบบ้าน',
    'ออกแบบครัว',
    'ดีไซน์',
    'แบบบ้าน',
  ],
  SELECTING_MATERIAL: [
    'เลือกวัสดุ',
    'เลือกกระเบื้อง',
    'เลือกพื้น',
    'เลือกยี่ห้อ',
    'เลือกแบบไหนดี',
    'เทียบวัสดุ',
    'เทียบยี่ห้อ',
  ],
  BUDGETING: ['งบเท่าไหร่', 'วางงบ', 'งบประมาณ', 'ประมาณราคา', 'คิดค่าของ', 'คิดค่าช่าง'],
  CONTRACTOR_SELECTION: [
    'หาช่าง',
    'หาผู้รับเหมา',
    'ช่างไหนดี',
    'ฝากร้านช่างได้',
    'แนะนำช่าง',
    'หาทีมงานทำให้',
  ],
  DURING_CONSTRUCTION: [
    'กำลังทำอยู่',
    'หน้างานตอนนี้',
    'ระหว่างทำ',
    'ช่างกำลังทำ',
    'เทปูนแล้ว',
    'ปูพื้นอยู่',
    'กำลังปูกระเบื้อง',
  ],
  POST_CONSTRUCTION_ISSUE: [
    'ทำเสร็จแล้วมีปัญหา',
    'ปูไปแล้ว',
    'อยู่ไปแล้วเจอว่า',
    'หลังอยู่มา',
    'ใช้มาสักพัก',
    'หลังทำเสร็จ',
    'ใช้ไปไม่นาน',
  ],
};

export const PERSONA_TYPE_KEYWORDS: Record<PersonaType, string[]> = {
  HOMEOWNER: ['บ้านเรา', 'บ้านผม', 'บ้านหนู', 'บ้านที่อยู่', 'บ้านคุณพ่อคุณแม่', 'บ้านแฟน'],
  FUTURE_OWNER: [
    'กำลังจะสร้างบ้าน',
    'จะซื้อบ้าน',
    'มองหาบ้าน',
    'เตรียมสร้าง',
    'วางแผนบ้านหลังแรก',
  ],
  CONTRACTOR: [
    'รับเหมา',
    'ช่างทำ',
    'ช่างปู',
    'ทีมช่าง',
    'หน้างานลูกค้า',
    'งานลูกค้า',
    'ลูกค้าฝากทำ',
  ],
  DESIGNER: [
    'ออกแบบให้ลูกค้า',
    'ดีไซน์ให้ลูกค้า',
    'นักออกแบบ',
    'อินทีเรีย',
    'interior',
    'สถาปนิก',
    'architect',
  ],
  SHOP_SELLER: [
    'ร้านเรา',
    'หน้าร้าน',
    'สินค้าที่ร้าน',
    'คลังเซรามิค',
    'ศูนย์จำหน่าย',
    'สต็อกสินค้า',
  ],
  INVESTOR: ['บ้านปล่อยเช่า', 'ทำไว้ปล่อยเช่า', 'ทำห้องเช่า', 'ลงทุนปล่อยเช่า', 'ทำเอาไว้ขายต่อ'],
};

export function matchByDict<T extends string>(
  text: string,
  dict: Record<T, string[]>,
): T[] {
  const t = text.toLowerCase();
  return (Object.keys(dict) as T[]).filter((key) =>
    dict[key].some((k) => t.includes(k.toLowerCase())),
  );
}

export function classifyGeneralText(text: string): ClassifiedPostMeta {
  const intents = matchByDict(text, POST_INTENT_KEYWORDS);
  const primaryIntent = intents[0];

  return {
    primaryIntent,
    intents,
    houseZones: matchByDict(text, HOUSE_ZONE_KEYWORDS),
    painPoints: matchByDict(text, PAIN_POINT_KEYWORDS),
    materialCategories: matchByDict(text, MATERIAL_CATEGORY_KEYWORDS),
    designStyles: matchByDict(text, DESIGN_STYLE_KEYWORDS),
    journeyStages: matchByDict(text, JOURNEY_STAGE_KEYWORDS),
    personas: matchByDict(text, PERSONA_TYPE_KEYWORDS),
  };
}