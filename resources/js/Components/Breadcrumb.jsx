// resources/js/Components/Breadcrumb.jsx
import React from "react";
import { Link } from "@inertiajs/react";

export default function Breadcrumb({ items }) {
    return (
        <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center space-x-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-gray-700"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-gray-700">
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && (
                            <span className="mx-2">/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
