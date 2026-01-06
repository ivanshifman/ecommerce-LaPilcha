'use client';

import { Accordion } from '@/components/ui/accordion';
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
            className="divide-y divide-border rounded-xl overflow-hidden"
        >
            {genders.map((gender) => (
                <MobileGenderAccordion
                    key={gender}
                    gender={gender}
                    label={genderLabels[gender] || gender}
                    isActive={openGender === gender}
                />
            ))}
        </Accordion>
    );
}

