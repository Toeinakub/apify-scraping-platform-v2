// Competitor Page classification enums & keyword dictionaries
// Intended for posts from competitor Facebook Pages / brand pages.

import type { HouseZone, MaterialCategory, DesignStyleTag } from '../general/classification';

export type PagePostGoal =
  | 'PRODUCT_DEMO'
  | 'PROMOTION_SALE'
  | 'BRAND_AWARENESS'
  | 'EDU_CONTENT'
  | 'DEALER_LOCATOR'
  | 'CROSS_CHANNEL_PUSH';

export type ValuePropTag =
  | 'EASY_INSTALL'
  | 'DIY_FRIENDLY'
  | 'WATERPROOF'
  | 'TERMITE_PROOF'
  | 'DURABLE'
  | 'HEAT_REFLECTION'
  | 'ENERGY_SAVING'
  | 'FIRE_RETARDANT'
  | 'REALISTIC_LOOK'
  | 'LIGHT_WEIGHT';

export type PromoMechanic =
  | 'DIRECT_DISCOUNT'
  | 'PERCENT_DISCOUNT'
  | 'CAMPAIGN_11_11'
  | 'CAMPAIGN_12_12'
  | 'FREE_GIFT'
  | 'LIMITED_STOCK'
  | 'CHANNEL_EXCLUSIVE';

export type ChannelTag =
  | 'DEALER_OFFLINE'
  | 'SHOPEE'
  | 'LAZADA'
  | 'OFFICIAL_WEBSITE'
  | 'LINE'
  | 'CALL_CENTER';

export type CTAType =
  | 'CLICK_LINK'
  | 'CALL_PHONE'
  | 'ADD_LINE'
  | 'VISIT_DEALER'
  | 'SHOP_NOW';

export interface ClassifiedPagePostMeta {
  goals?: PagePostGoal[];
  primaryGoal?: PagePostGoal;
  valueProps?: ValuePropTag[];
  promoMechanics?: PromoMechanic[];
  channels?: ChannelTag[];
  ctas?: CTAType[];
  materialCategories?: MaterialCategory[];
  designStyles?: DesignStyleTag[];
  houseZones?: HouseZone[];
}

export const PAGE_POST_GOAL_KEYWORDS: Record<PagePostGoal, string[]> = {
  PRODUCT_DEMO: [
    'ติดตั้งเองได้เลย',
    'ผู้หญิงก็ปูได้',
    'รีวิวของดี',
    'ทดสอบแล้ว',
    'พิสูจน์แล้ว',
    'ใช้จริงหน้างาน',
    'how to',
    'ทำเองได้',
  ],
  PROMOTION_SALE: [
    'BIG SALE',
    'ชวนช้อป',
    'โปรพิเศษ',
    'โปรโมชัน',
    'ส่วนลด',
    'รับโค้ดส่วนลด',
    'ลดทันที',
    'ดีลพิเศษ',
    'หมวดโปร',
    'ลดแรง',
    'ดีลเด็ด',
    'flash sale',
    '11.11',
    '12.12',
  ],
  BRAND_AWARENESS: [
    'วัสดุก่อสร้างคุณภาพ',
    'จากตราเพชร',
    'ผลิตภัณฑ์ตราเพชร',
    'แบรนด์',
    'มั่นใจในคุณภาพ',
    'รับประกันคุณภาพ',
  ],
  EDU_CONTENT: [
    'เตรียมบ้านให้เย็นสบาย',
    'ประหยัดพลังงานได้จริง',
    'เคล็ดลับบ้านเย็น',
    'วิธีเลือก',
    'ทริกแต่งบ้าน',
    'เทคนิคเลือกวัสดุ',
  ],
  DEALER_LOCATOR: [
    'หาซื้อได้ที่',
    'ร้านตัวแทนจำหน่าย',
    'ทั่วประเทศ',
    'เช็กร้านใกล้บ้าน',
    'ค้นหาร้าน',
    'dealer',
  ],
  CROSS_CHANNEL_PUSH: [
    'สั่งซื้อได้ที่',
    'ผ่าน Shopee',
    'ผ่าน Lazada',
    'Official Store',
    'คลิกเลย',
    'shop now',
  ],
};

export const VALUE_PROP_KEYWORDS: Record<ValuePropTag, string[]> = {
  EASY_INSTALL: [
    'ติดตั้งง่าย',
    'ติดตั้งเองได้',
    'ทำเองได้',
    'ไม่ยุ่งยาก',
    'ติดตั้งสะดวก',
  ],
  DIY_FRIENDLY: ['DIY', 'ผู้หญิงก็ปูได้', 'งานบ้าน', 'ทำเองที่บ้าน'],
  WATERPROOF: ['กันน้ำ', 'ไม่กลัวน้ำ', 'ทนน้ำ'],
  TERMITE_PROOF: ['กันปลวก', 'ไม่กลัวปลวก', 'ไม่ผุ'],
  DURABLE: ['ทนทาน', 'ใช้งานได้นาน', 'ไม่บวม', 'แข็งแรง'],
  HEAT_REFLECTION: ['สะท้อนความร้อน', 'สะท้อนแดด', 'แผ่นสะท้อนความร้อน'],
  ENERGY_SAVING: ['ประหยัดพลังงาน', 'ช่วยประหยัดไฟ', 'ลดการใช้แอร์'],
  FIRE_RETARDANT: ['หน่วงไฟ', 'ไม่ลามไฟ', 'ป้องกันการลามไฟ'],
  REALISTIC_LOOK: ['สวยสมจริง', 'ลายไม้สมจริง', 'สวยเหมือนของจริง'],
  LIGHT_WEIGHT: ['น้ำหนักเบา', 'เบา', 'ไม่หนัก'],
};

export const PROMO_MECHANIC_KEYWORDS: Record<PromoMechanic, string[]> = {
  DIRECT_DISCOUNT: ['รับส่วนลดทันที', 'ลดทันที', 'ลดเพิ่ม', 'ส่วนลด 200 บาท'],
  PERCENT_DISCOUNT: ['%', 'ลดสูงสุด', 'ลดมากสุด'],
  CAMPAIGN_11_11: ['11.11', '11.11 BIG SALE'],
  CAMPAIGN_12_12: ['12.12'],
  FREE_GIFT: ['ของแถม', 'รับฟรี', 'ของสมนาคุณ'],
  LIMITED_STOCK: ['จำนวนจำกัด', 'หมดแล้วหมดเลย', 'ด่วน'],
  CHANNEL_EXCLUSIVE: ['เฉพาะ Shopee', 'เฉพาะ Lazada', 'เฉพาะออนไลน์'],
};

export const CTA_TYPE_KEYWORDS: Record<CTAType, string[]> = {
  CLICK_LINK: ['คลิกเลย', 'กดลิงก์', 'กดที่ลิงก์', 'shop now', 'สั่งซื้อได้ที่'],
  CALL_PHONE: ['Tel:', 'โทร'],
  ADD_LINE: ['LINE ID', 'แอดไลน์'],
  VISIT_DEALER: ['ร้านตัวแทนจำหน่าย', 'ที่ร้านใกล้บ้าน'],
  SHOP_NOW: ['shop now', 'ช้อปเลย', 'ช้อปตอนนี้'],
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

export function classifyPageText(text: string): ClassifiedPagePostMeta {
  const goals = matchByDict(text, PAGE_POST_GOAL_KEYWORDS);
  const primaryGoal = goals[0];

  return {
    primaryGoal,
    goals,
    valueProps: matchByDict(text, VALUE_PROP_KEYWORDS),
    promoMechanics: matchByDict(text, PROMO_MECHANIC_KEYWORDS),
    ctas: matchByDict(text, CTA_TYPE_KEYWORDS),
    // materialCategories / designStyles / houseZones
    // should be filled by reusing the helpers from general/classification if needed
  };
}