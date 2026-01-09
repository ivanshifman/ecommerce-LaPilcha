// 'use client';

// interface Props {
//     open: boolean;
//     onToggle: () => void;
// }

// export function HamburgerButton({ open, onToggle }: Props) {
//     return (
//         <button
//             onClick={onToggle}
//             className="md:hidden p-2 hover:bg-accent rounded-full transition-colors"
//             aria-label="Abrir menú"
//         >
//             <div className="flex flex-col justify-between w-5 h-5">
//                 <span
//                     className={`w-full h-0.5 bg-text-muted transition-all duration-300 ${open ? 'translate-y-[9px] rotate-45' : ''
//                         }`}
//                 />
//                 <span
//                     className={`w-full h-0.5 bg-text-muted transition-all duration-300 ${open ? 'opacity-0' : ''
//                         }`}
//                 />
//                 <span
//                     className={`w-full h-0.5 bg-text-muted transition-all duration-300 ${open ? '-translate-y-[9px] -rotate-45' : ''
//                         }`}
//                 />
//             </div>
//         </button>
//     );
// }