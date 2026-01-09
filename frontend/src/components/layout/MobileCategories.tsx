'use client';

import { Accordion } from '@/src/components/ui/accordion';
import { useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';
import { MobileGenderAccordion } from './MobileGenderAccordion';
import { useState } from 'react';

export function MobileCategories() {
    const { genders } = useProducts();
    const [openGender, setOpenGender] = useState<string | null>(null);

    return (
        <Accordion
            type="single"
            collapsible
            value={openGender ?? undefined}
            onValueChange={(value) => setOpenGender(value)}
            className="space-y-2"
        >
            {genders.map((gender, index) => (
                <div key={gender}>
                    {index > 0 && (
                        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent my-2" />
                    )}
                    <MobileGenderAccordion
                        gender={gender}
                        label={genderLabels[gender] || gender}
                        isActive={openGender === gender}
                    />
                </div>
            ))}
        </Accordion>
    );
}
