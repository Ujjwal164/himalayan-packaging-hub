import { describe,it,expect } from 'vitest';
import { products,filterProducts,updateQuote,quoteMessage,wholesalePolicy,requestSchema } from '@/lib/catalog';
describe('Wholesale catalog rules',()=>{
 it('includes all 57 products in the six specified categories',()=>{expect(products).toHaveLength(57);expect([1,2,3,4,5,6].map(c=>products.filter(p=>p.category===c).length)).toEqual([12,9,9,15,6,6]);});
 it('uses the specified 500-piece pack for 650ml bagasse bowls',()=>{expect(products.find(p=>p.name.startsWith('650ml Round Bagasse'))?.pack).toBe('Pack of 500 pcs');});
 it('uses the specified 50-piece garment hamper pack',()=>{expect(products.find(p=>p.name.includes('18x13x3'))?.pack).toBe('Pack of 50 pcs');});
 it('allows a single-box MOQ and rejects zero boxes',()=>{expect(updateQuote([],'p1',1)).toEqual([{id:'p1',quantity:1}]);expect(updateQuote([],'p1',0)).toEqual([]);expect(wholesalePolicy.minimumBoxes).toBe(1);});
 it('exports product names, box quantities and delivery location',()=>{const message=quoteMessage([{id:'p1',quantity:3}],'Haridwar');expect(message).toContain('250ml Bagasse Portion Bowl with Lid — 3 boxes');expect(message).toContain('Delivery location: Haridwar');});
 it('filters 500ml keyword and burger and saree',()=>{expect(filterProducts('500ml',0,'all')).toHaveLength(4);expect(filterProducts('Burger',0,'all').map(p=>p.id)).toEqual(['p8']);expect(filterProducts('Saree',0,'all').map(p=>p.id)).toEqual(['p22']);});
 it('sets 24–48 hour local delivery',()=>{expect([wholesalePolicy.deliveryMinHours,wholesalePolicy.deliveryMaxHours]).toEqual([24,48]);});
 it('sets 100 percent payment on delivery',()=>{expect(wholesalePolicy.paymentOnDeliveryPercent).toBe(100);});
 it('requires outlet name and location for samples',()=>{expect(requestSchema.safeParse({outlet:'',location:'Roorkee'}).success).toBe(false);expect(requestSchema.safeParse({outlet:'Cafe',location:''}).success).toBe(false);});
});
