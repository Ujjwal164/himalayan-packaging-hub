import data from './catalog-data.json';
import bagasse from '@/assets/category-1.jpg';
import kraft from '@/assets/category-2.jpg';
import boxes from '@/assets/category-3.jpg';
import standard from '@/assets/category-4.jpg';
import bags from '@/assets/category-5.jpg';
import cutlery from '@/assets/category-6.jpg';
import { z } from 'zod';
const productImages=import.meta.glob<string>('@/assets/products/*.jpg',{eager:true,import:'default'});
const imageFor=(id:string)=>Object.entries(productImages).find(([k])=>k.endsWith(`/${id}.jpg`))?.[1];

export const categories = [
 { id:1, name:'Sugarcane Bagasse', short:'Bagasse Containers', description:'Naturally better food packaging', image:bagasse, material:'Sugarcane bagasse', tags:['Compostable','Microwave Safe'], sub:['Round bowls','Meal prep boxes','Clamshells','Compartment trays'] },
 { id:2, name:'Kraft Food Packaging', short:'Kraft Food Packaging', description:'Made for meals on the move', image:kraft, material:'Food-grade kraft paper', tags:['Food Grade','Eco-Friendly'], sub:['Salad bowls','Snack boxes & trays','Wraps & sleeves'] },
 { id:3, name:'Apparel & Gift Boxes', short:'Apparel & Gift Boxes', description:'A beautiful first impression', image:boxes, material:'Kraft & corrugated board', tags:['Customizable','Recyclable'], sub:['Garment boxes','Gift hampers','Bakery & sweet boxes'] },
 { id:4, name:'Standard Disposables', short:'Standard Disposables', description:'Everyday essentials, bulk value', image:standard, material:'PP / paper / aluminium', tags:['Bulk Value','Food Grade'], sub:['PP containers','Bento boxes','Plates & thalis','Cups & cutlery','Foil & essentials'] },
 { id:5, name:'Eco Carry Bags', short:'Eco Carry Bags', description:'Carry your brand responsibly', image:bags, material:'Kraft paper / cornstarch', tags:['Eco-Friendly','Strong & Durable'], sub:['Handle bags','Grocery bags','Compostable bags'] },
 { id:6, name:'Cutlery & Tableware', short:'Cutlery & Tableware', description:'The finishing touch to every meal', image:cutlery, material:'Wood / paper / palm leaf', tags:['Biodegradable','Food Grade'], sub:['Wooden cutlery','Cups & straws','Palm leaf plates'] },
];
export const products = data.map(p => {
 const c=categories.find(c=>c.id===p.category);
 if(!c)throw new Error(`Unknown category ${p.category}`);
 let material=c.material;
 if(p.category===4) material=/PP|Plastic|Bento|Cling|Gloves/i.test(p.name)?'Standard plastic':/Aluminium/i.test(p.name)?'Aluminium':'Paper';
 return {...p, image:c.image as string, material, tags:c.tags};
});
export type Product = typeof products[number];
export type QuoteItem = {id:string; quantity:number};
export const deliveryLocations=['Roorkee','Haridwar','Rishikesh','Bhagwanpur','Dehradun','Other'];
export const wholesalePolicy={deliveryMinHours:24,deliveryMaxHours:48,paymentOnDeliveryPercent:100,minimumBoxes:1};
export const requestSchema=z.object({outlet:z.string().trim().min(2,'Enter your outlet name').max(100),location:z.string().trim().min(2,'Enter your delivery location').max(150)});
export function filterProducts(query:string,category:number,kind:string) {
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return products.filter(p=>(!category||p.category===category)&&terms.every(t=>`${p.name} ${p.material} ${p.tags.join(' ')}`.toLowerCase().includes(t))&&(kind==='all'||(kind==='eco'&&p.category!==3&&p.category!==4)||(kind==='plastic'&&p.material==='Standard plastic')||(kind==='boxes'&&p.category===3)));
}
export function updateQuote(items:QuoteItem[],id:string,quantity:number) {
 const valid=z.number().int().min(1).max(999).safeParse(quantity);
 if(!valid.success||!products.some(p=>p.id===id))return items;
 return [...items.filter(i=>i.id!==id),{id,quantity:valid.data}];
}
export function quoteMessage(items:QuoteItem[],location:string) {
 const valid=z.string().trim().min(2).max(150).parse(location);
 const rows=items.map(i=>{const p=products.find(p=>p.id===i.id);return p?`• ${p.name} — ${i.quantity} box${i.quantity===1?'':'es'} (${p.pack})`:''}).filter(Boolean);
 return `Hello Himalayan Eco Packaging!\nI'd like a wholesale quote for:\n${rows.join('\n')}\n\nDelivery location: ${valid}\nPlease share bulk pricing and availability.`;
}
// Business WhatsApp recipient supplied by the owner: +91 7310710532.
export const businessWhatsAppNumber='917310710532';
export const businessWhatsAppDisplay='+91 73107 10532';
export const generalEnquiryMessage='Hello Himalayan Eco Packaging! I would like to enquire about wholesale packaging.';
export function whatsappUrl(message:string) {
 const text=z.string().min(1).max(12000).parse(message);
 if(!/^\d{10,15}$/.test(businessWhatsAppNumber))throw new Error('Business WhatsApp recipient is not a valid number');
 return `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(text)}`;
}

// Size variants shown as one card with a size picker; each size keeps its own quote id.
const variantGroups=[
 {name:'Round Bagasse Meal Bowl with Airtight Lid',ids:['p2','p3','p4']},
 {name:'Rectangular Bagasse Meal Prep Box with Lid',ids:['p6','p7']},
 {name:'Kraft Round Salad Bowl with Clear Bio-Lid',ids:['p15','p16','p17']},
 {name:'Clear Round PP Plastic Container with Snap Lid',ids:['p31','p32','p33','p34']},
 {name:'Brown Kraft Paper Shopping Bag with Twisted Handle',ids:['p46','p47']},
];
export function sizeLabel(name:string){return name.match(/^(\d+ml)/)?.[1]??name.match(/- (\w+)$/)?.[1]??name}
export type ProductGroup={id:string;name:string;variants:Product[]};
export const productGroups:ProductGroup[]=[];
for(const p of products){
 const g=variantGroups.find(g=>g.ids.includes(p.id));
 if(!g){productGroups.push({id:p.id,name:p.name,variants:[{...p,image:imageFor(p.id)??p.image}]});continue}
 if(g.ids[0]!==p.id)continue;
 productGroups.push({id:p.id,name:g.name,variants:g.ids.map(id=>{const v=products.find(x=>x.id===id)!;return {...v,image:imageFor(g.ids[0]!)??v.image}})});
}
export function filterGroups(query:string,category:number,kind:string){
 const ids=new Set(filterProducts(query,category,kind).map(p=>p.id));
 return productGroups.filter(g=>g.variants.some(v=>ids.has(v.id)));
}
