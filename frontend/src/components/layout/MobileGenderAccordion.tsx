// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import {
//     AccordionItem,
//     AccordionTrigger,
//     AccordionContent,
// } from '../../components/ui/accordion';
// import { useProductActions } from '../../store/productStore';
// import { ArrowRight, Baby, ChevronDown, PersonStanding, Shirt, ShoppingBag } from 'lucide-react';

// interface Props {
//     gender: string;
//     label: string;
//     isActive: boolean;
// }

// export function MobileGenderAccordion({ gender, label, isActive }: Props) {
//     const { fetchCategoriesByGender, fetchSubcategories } = useProductActions();
//     const [categories, setCategories] = useState<string[]>([]);
//     const [openCategory, setOpenCategory] = useState<string | null>(null);
//     const [subcategories, setSubcategories] = useState<string[]>([]);

//     const genderIcon = {
//         male: Shirt,
//         female: ShoppingBag,
//         kid: Baby,
//         unisex: PersonStanding,
//     };

//     const Icon = genderIcon[gender as keyof typeof genderIcon];

//     useEffect(() => {
//         fetchCategoriesByGender(gender).then(setCategories);
//     }, [gender, fetchCategoriesByGender]);

//     useEffect(() => {
//         if (!isActive) {
//             // eslint-disable-next-line react-hooks/set-state-in-effect
//             setOpenCategory(null);
//             setSubcategories([]);
//         }
//     }, [isActive]);

//     const handleCategory = async (category: string) => {
//         if (openCategory === category) {
//             setOpenCategory(null);
//             return;
//         }

//         setOpenCategory(category);
//         const subs = await fetchSubcategories(category);
//         setSubcategories(subs);
//     };

//     return (
//         <AccordionItem
//             value={gender}
//             className="rounded-2xl bg-card border border-border/60 overflow-hidden transition-all data-[state=open]:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)]"
//         >
//             {/* HEADER */}
//             <AccordionTrigger
//                 className="px-4 py-3 flex items-center gap-3 text-base font-semibold tracking-tight text-text-primary hover:bg-accent [&[data-state=open]>span]:rotate-0"
//             >
//                 {Icon && (
//                     <span className="shrink-0">
//                         <Icon className="h-4 w-4 text-text-muted" />
//                     </span>
//                 )}
//                 <span>{label}</span>
//             </AccordionTrigger>
//             {/* CONTENIDO */}
//             <AccordionContent className="px-4 overflow-hidden transition-all duration-300 ease-out data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
//                 <Link
//                     href={`/products?gender=${gender}`}
//                     className="mb-4 flex items-center justify-between rounded-lg bg-accent/40 px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent transition"
//                 >
//                     Ver todo {label}
//                     <ArrowRight className="h-4 w-4 opacity-60" />
//                 </Link>

//                 <ul className="space-y-0 divide-y divide-text-muted/30">
//                     {categories.map((cat) => (
//                         <li key={cat} className="py-2">
//                             {/* BOTÓN DE CATEGORÍA */}
//                             <button
//                                 onClick={() => handleCategory(cat)}
//                                 className="w-full flex items-center justify-between py-3 text-sm font-medium capitalize transition-colors active:scale-[0.98]"
//                             >
//                                 <span className={openCategory === cat ? 'text-primary' : 'text-text-secondary'}>
//                                     {cat}
//                                 </span>

//                                 <ChevronDown
//                                     className={`h-4 w-4 transition-transform ${openCategory === cat ? 'rotate-180 text-primary' : 'text-text-muted'
//                                         }`}
//                                 />
//                             </button>
//                             {/* SUBCATEGORÍAS */}
//                             <div
//                                 className={`grid overflow-hidden transition-all duration-300 ease-out ${openCategory === cat
//                                     ? 'grid-rows-[1fr] opacity-100 translate-y-0'
//                                     : 'grid-rows-[0fr] opacity-0 -translate-y-1'
//                                     }`}
//                             >
//                                 <div className="overflow-hidden">
//                                     {subcategories.length > 0 && (
//                                         <div className="h-px bg-linear-to-r from-transparent via-primary/50 to-transparent my-2" />
//                                     )}
//                                     <Link
//                                         href={`/products?gender=${gender}&category=${cat}`}
//                                         className="block py-2 text-sm font-medium text-text-secondary hover:text-primary transition"
//                                     >
//                                         Ver todo {cat}
//                                     </Link>

//                                     <ul className="pl-2 pb-4 divide-y divide-border/60">
//                                         {subcategories.map((sub) => (
//                                             <li key={sub} className="py-2">
//                                                 <Link
//                                                     href={`/products?gender=${gender}&category=${cat}&subcategory=${sub}`}
//                                                     className="group flex items-center gap-2 py-1.5 text-sm text-text-muted hover:text-primary transition"
//                                                 >
//                                                     <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition" />
//                                                     {sub}
//                                                 </Link>
//                                             </li>
//                                         ))}
//                                     </ul>

//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </AccordionContent>
//         </AccordionItem>
//     );
// }