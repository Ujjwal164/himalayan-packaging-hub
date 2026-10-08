import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/home-page';
import { pageHead } from '@/lib/metadata';
export const Route=createFileRoute('/')({head:()=>pageHead('Wholesale Packaging & Sustainable Disposables','Bulk packaging for cafés, hotels, bakeries and retailers. Browse Himalayan Eco Packaging’s wholesale catalog, with single-box orders and local Uttarakhand delivery.'),component:HomePage});
