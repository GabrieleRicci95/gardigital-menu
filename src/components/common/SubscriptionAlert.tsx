"use client";

import { useEffect, useState } from "react";

export default function SubscriptionAlert() {
    const [expiryInfo, setExpiryInfo] = useState<{ daysLeft: number; isExpired: boolean } | null>(null);

    useEffect(() => {
        const checkExpiry = async () => {
            try {
                const res = await fetch("/api/restaurant");
                if (res.ok) {
                    const data = await res.json();
                    const expiryDate = data.restaurant?.subscription?.endDate;

                    if (expiryDate) {
                        const exp = new Date(expiryDate);
                        const today = new Date();
                        const diffTime = exp.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays <= 7) {
                            setExpiryInfo({ daysLeft: diffDays, isExpired: diffDays < 0 });
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to check subscription expiry");
            }
        };

        checkExpiry();
    }, []);

    if (!expiryInfo) return null;

    const { daysLeft, isExpired } = expiryInfo;

    return (
        <div style={{
            backgroundColor: isExpired ? "#fecaca" : "#fef08a",
            color: isExpired ? "#991b1b" : "#854d0e",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            borderBottom: `1px solid ${isExpired ? "#ef4444" : "#eab308"}`,
            zIndex: 1000,
            width: "100%",
            textAlign: "center"
        }}>
            <span>
                {isExpired
                    ? "IL TUO SERVIZIO È SCADUTO. Clicca qui per rinnovare."
                    : `ATTENZIONE: Il tuo abbonamento scade tra ${daysLeft} ${daysLeft === 1 ? 'giorno' : 'giorni'}. Rinnova ora per evitare interruzioni.`
                }
            </span>
            <a href="/dashboard/subscription" style={{
                marginLeft: "10px",
                textDecoration: "underline",
                cursor: "pointer"
            }}>
                Gestisci Abbonamento
            </a>
        </div>
    );
}
