import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Notification() {
    const { flash } = usePage().props;

    if (!flash.success && !flash.error) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow">
            {flash.success && <span>{flash.success}</span>}
            {flash.error && <span>{flash.error}</span>}
        </div>
    );
}
