import React, { useState, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function MenuDetail() {
    const { props } = usePage();
    const { menuItem, auth } = props;

    const [selectedOptions, setSelectedOptions] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState(""); // 🆕 Catatan
    const [currentPrice, setCurrentPrice] = useState(menuItem.base_price || 0);

    // Group variants by type
    const groupVariants = () => {
        const groups = {};

        if (menuItem.variant_prices && menuItem.variant_prices.length > 0) {
            menuItem.variant_prices.forEach((variant) => {
                if (
                    variant.variant_combination.includes("Panas") ||
                    variant.variant_combination.includes("Dingin")
                ) {
                    if (!groups.Temperature) groups.Temperature = [];
                    groups.Temperature.push(variant);
                } else if (
                    variant.variant_combination.includes("Jumbo") ||
                    variant.variant_combination.includes("Normal")
                ) {
                    if (!groups.Size) groups.Size = [];
                    groups.Size.push(variant);
                } else if (
                    variant.variant_combination.includes("Double") ||
                    variant.variant_combination.includes("Biasa")
                ) {
                    if (!groups.Variant) groups.Variant = [];
                    groups.Variant.push(variant);
                } else {
                    if (!groups.Other) groups.Other = [];
                    groups.Other.push(variant);
                }
            });
        }

        return groups;
    };

    const variantGroups = groupVariants();

    useEffect(() => {
        if (menuItem.has_variants && menuItem.variant_prices) {
            const selectedVariant = menuItem.variant_prices.find((variant) => {
                return Object.entries(selectedOptions).every(([key, value]) =>
                    variant.variant_combination.includes(value)
                );
            });

            if (selectedVariant) {
                setCurrentPrice(selectedVariant.price);
            } else if (menuItem.base_price) {
                setCurrentPrice(menuItem.base_price);
            }
        }
    }, [selectedOptions, menuItem]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(price)
            .replace("Rp", "Rp ");
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleOptionSelect = (group, value) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [group]: value,
        }));
    };

    // useForm + transform
    const { post, processing, transform } = useForm({
        menu_item_id: "",
        name: "",
        variant_combination: null,
        quantity: 1,
        price: 0,
        image: "",
        notes: "", // 🆕 Tambah di form
    });

    transform((data) => ({
        menu_item_id: menuItem.id,
        name: menuItem.name,
        variant_combination: Object.values(selectedOptions).join(" + ") || null,
        quantity: quantity,
        price: currentPrice,
        image: menuItem.image,
        notes: notes.trim() || null, // 🆕 Kirim notes ke backend
    }));

    const handleAddToCart = () => {
        post(route("customer.cart.store"), {
            onSuccess: () => {
                console.log("✅ Item berhasil ditambahkan");
            },
            onError: (errors) => {
                console.error("❌ Error dari server:", errors);
            },
        });
    };

    const isVariantSelectionComplete =
        menuItem.has_variants &&
        Object.keys(variantGroups).length > 0 &&
        Object.keys(variantGroups).every(
            (group) => selectedOptions[group]
        );

    const imageUrl = menuItem.image;

    return (
        <SidebarLayout auth={auth}>
            <div className="text-white">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Link
                        href="/customer"
                        className="text-red-500 hover:text-red-400 text-sm"
                    >
                        &larr; Kembali ke Dashboard
                    </Link>
                </div>

                {/* Menu Detail Card */}
                <div className="bg-[#2E2E2E] rounded-xl p-4 shadow-lg mb-6">
                    {/* Image */}
                    <img
                        src={`/storage/${imageUrl}`}
                        alt={menuItem.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />

                    {/* Name and Description */}
                    <h1 className="text-xl font-bold mb-2">
                        {menuItem.name}
                    </h1>
                    {menuItem.description && (
                        <p className="text-gray-400 text-sm mb-4">
                            {menuItem.description}
                        </p>
                    )}

                    {/* Current Price */}
                    <div className="mb-4">
                        <p className="text-lg font-semibold">
                            {formatPrice(currentPrice * quantity)}
                            {quantity > 1 && (
                                <span className="text-sm text-gray-400 ml-2">
                                    ({formatPrice(currentPrice)} × {quantity})
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Variants */}
                    {menuItem.has_variants &&
                        Object.keys(variantGroups).length > 0 && (
                            <div className="mb-4 space-y-4">
                                {Object.entries(variantGroups).map(
                                    ([group, variants]) => (
                                        <div key={group}>
                                            <h3 className="text-md font-semibold mb-2">
                                                Varian (Wajib Pilih 1)
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {variants.map((variant) => (
                                                    <button
                                                        key={variant.id}
                                                        onClick={() =>
                                                            handleOptionSelect(
                                                                group,
                                                                variant.variant_combination
                                                            )
                                                        }
                                                        className={`p-2 rounded-lg border text-sm ${
                                                            selectedOptions[
                                                                group
                                                            ] ===
                                                            variant.variant_combination
                                                                ? "bg-red-500 border-red-500 text-white"
                                                                : "bg-[#3E3E3E] border-gray-600 text-gray-200 hover:bg-[#4D4D4D]"
                                                        }`}
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <span>
                                                                {
                                                                    variant.variant_combination
                                                                }
                                                            </span>
                                                            <span className="font-semibold mt-1">
                                                                {formatPrice(
                                                                    variant.price
                                                                )}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )
                    }

                    {/* 🆕 Input Catatan */}
                    <div className="mb-4">
                        <h3 className="text-md font-semibold mb-2">Catatan (Opsional)</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Misalnya: Jangan pakai es, level pedas sedang..."
                            className="w-full bg-[#3E3E3E] border border-gray-600 rounded-lg p-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows={2}
                        ></textarea>
                    </div>
                    
                    {/* Quantity */}
                    <div className="mb-4">
                        <h3 className="text-md font-semibold mb-2">
                            Jumlah
                        </h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={decrementQuantity}
                                className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 transition text-sm"
                            >
                                -
                            </button>
                            <span className="text-md font-semibold">
                                {quantity}
                            </span>
                            <button
                                onClick={incrementQuantity}
                                className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 transition text-sm"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 p-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={
                                processing ||
                                (menuItem.has_variants &&
                                    !isVariantSelectionComplete)
                            }
                            className={`w-full py-3 rounded-lg font-semibold transition text-sm ${
                                (menuItem.has_variants &&
                                    !isVariantSelectionComplete) ||
                                processing
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600"
                            }`}
                        >
                            {processing
                                ? "Menambahkan..."
                                : menuItem.has_variants &&
                                  !isVariantSelectionComplete
                                ? "Pilih Varian Terlebih Dahulu"
                                : `Tambah ke Keranjang - ${formatPrice(
                                      currentPrice * quantity
                                  )}`}
                        </button>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
