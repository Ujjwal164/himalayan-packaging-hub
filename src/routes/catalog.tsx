import { createFileRoute } from '@tanstack/react-router';
import { CatalogPage } from '@/components/catalog-page';
import { pageHead } from '@/lib/metadata';
import { z } from 'zod';
export const Route=createFileRoute('/catalog')({validateSearch:(search)=>{const parsed=z.object({category:z.coerce.number().int().min(0).max(6).catch(0),q:z.string().max(100).catch('')}).parse(search);return parsed},head:()=>pageHead('Wholesale Product Catalog','Explore 57 bagasse containers, kraft packaging, garment boxes, commercial disposables, eco bags and tableware. Build your wholesale quote.'),component:CatalogRoute});
function CatalogRoute(){const {category,q}=Route.useSearch();return <CatalogPage key={`${category}-${q}`} initialCategory={category} initialQuery={q}/>}
