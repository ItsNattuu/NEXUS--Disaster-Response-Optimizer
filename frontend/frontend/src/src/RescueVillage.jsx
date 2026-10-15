
import React from "react";

export default function RescueVillage({ compact = false }) {
    return (
        <div className={`rescue-village ${compact ? "rescue-village--compact" : ""}`}>
            <svg
                viewBox="0 0 900 420"
                role="img"
                aria-label="Cute pastel rescue village with a clinic, homes and an ambulance"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="rescueSky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fff8fd" />
                        <stop offset="100%" stopColor="#f5e7fb" />
                    </linearGradient>
                    <linearGradient id="rescueRoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c8a6d5" />
                        <stop offset="100%" stopColor="#b493c4" />
                    </linearGradient>
                </defs>

                {/* Pastel sky and distant hills */}
                <rect width="900" height="420" rx="24" fill="url(#rescueSky)" />
                <path
                    d="M0 230 Q190 155 400 190 T900 185 L900 420 L0 420Z"
                    fill="#dfc9eb"
                />
                <path
                    d="M60 325 Q210 260 380 295 T900 285 L900 420 L60 420Z"
                    fill="#bde8d6"
                />

                {/* Sun */}
                <circle cx="750" cy="86" r="67" fill="#ffead1" opacity=".55" />
                <circle cx="750" cy="86" r="52" fill="#ffe3a6" />
                <path d="M750 25 L757 42 L774 49 L757 56 L750 73 L743 56 L726 49 L743 42Z"
                    fill="#e9a875" />

                {/* Clouds */}
                <g fill="#fff">
                    <path d="M105 105 Q105 86 126 86 Q133 61 160 77 Q180 70 190 89 Q215 85 217 105Z" />
                    <path d="M430 72 Q430 54 451 54 Q462 32 486 48 Q508 40 518 59 Q541 57 544 72Z" />
                    <path d="M770 160 Q770 145 790 145 Q807 130 821 146 Q842 142 847 160Z" />
                </g>

                {/* Sparkles */}
                <g fill="#e99ac2" fontSize="25" fontFamily="serif">
                    <text x="65" y="68">✧</text>
                    <text x="255" y="68">♡</text>
                    <text x="420" y="60">✦</text>
                    <text x="825" y="78">✧</text>
                </g>
                <text x="585" y="37" fill="#c96f9e" fontSize="12"
                    fontWeight="600" letterSpacing="1.5">
                    ♡ A LITTLE VILLAGE FULL OF HOPE ♡
                </text>

                {/* Left pink house */}
                <g stroke="#fff" strokeWidth="4" strokeLinejoin="round">
                    <path d="M140 244 L185 202 L230 244Z" fill="#df8ab2" stroke="none" />
                    <rect x="151" y="241" width="67" height="56" rx="5" fill="#ffb9d2" transform="rotate(-3 185 269)" />
                    <rect x="163" y="255" width="15" height="18" rx="5" fill="#fff0f7" stroke="none" />
                    <rect x="191" y="260" width="15" height="31" rx="7" fill="#fff0f7" stroke="none" />
                    <circle cx="199" cy="266" r="4" fill="#e99ac2" stroke="none" />
                </g>
                <text x="165" y="270" fill="#dc7ca8" fontSize="13">♡</text>

                {/* Peach house */}
                <g stroke="#fff" strokeWidth="4" strokeLinejoin="round">
                    <path d="M375 243 L418 206 L461 243Z" fill="#eaa36f" stroke="none" />
                    <rect x="384" y="240" width="67" height="57" rx="6" fill="#ffdbb6" transform="rotate(2 417 268)" />
                    <rect x="397" y="254" width="15" height="18" rx="5" fill="#fff8ee" stroke="none" />
                    <rect x="424" y="260" width="15" height="31" rx="7" fill="#fff8ee" stroke="none" />
                </g>
                <text x="398" y="268" fill="#e7a06d" fontSize="13">♡</text>

                {/* Lavender house */}
                <g stroke="#fff" strokeWidth="4" strokeLinejoin="round">
                    <path d="M580 247 L610 216 L642 247Z" fill="#b497d0" stroke="none" />
                    <rect x="587" y="245" width="48" height="49" rx="6" fill="#d8c1ed" />
                    <rect x="597" y="256" width="11" height="15" rx="4" fill="#fff8ff" stroke="none" />
                    <rect x="616" y="263" width="11" height="26" rx="6" fill="#fff8ff" stroke="none" />
                </g>
                <text x="598" y="268" fill="#b497d0" fontSize="12">♡</text>

                {/* Clinic */}
                <g>
                    <text x="700" y="167" fill="#c775a1" fontSize="11" textAnchor="middle">
                        little care clinic
                    </text>
                    <rect x="674" y="179" width="92" height="130" rx="17" fill="#e5a0c1" />
                    <rect x="674" y="179" width="92" height="28" rx="12" fill="#d875a4" />
                    <rect x="674" y="195" width="92" height="12" fill="#d875a4" />
                    <rect x="680" y="207" width="80" height="94" rx="8" fill="#fff7fc" />
                    <text x="720" y="199" textAnchor="middle" fill="#fff" fontSize="17">♡</text>
                    <path d="M718 225 H726 V233 H734 V241 H726 V249 H718 V241 H710 V233 H718Z"
                        fill="#d875a4" />
                    <rect x="689" y="253" width="12" height="18" rx="3" fill="#ffdeed" stroke="#df91b7" strokeWidth="2" />
                    <rect x="738" y="253" width="12" height="18" rx="3" fill="#ffdeed" stroke="#df91b7" strokeWidth="2" />
                    <rect x="713" y="271" width="17" height="30" rx="9" fill="#f8c0d9" />
                </g>

                {/* Flowers */}
                <g fontSize="22">
                    <text x="48" y="332">🌷</text>
                    <text x="87" y="328">🌼</text>
                    <text x="120" y="333">🌸</text>
                    <text x="158" y="329">🌷</text>
                </g>

                {/* Road */}
                <path d="M0 370 L900 300 L900 350 L0 420Z" fill="#fff" />
                <path d="M0 374 L900 304 L900 346 L0 416Z" fill="url(#rescueRoad)" />
                <path d="M0 395 L900 325" fill="none" stroke="#fff" strokeWidth="2.5"
                    strokeDasharray="8 7" />

                {/* Cute ambulance */}
                <g transform="translate(360 306)">
                    <path d="M5 18 Q5 7 17 7 H42 Q52 7 52 18 V42 H5Z"
                        fill="#fff" stroke="#d982ac" strokeWidth="3" />
                    <rect x="18" y="0" width="21" height="16" rx="7" fill="#ffb7d2" stroke="#fff" strokeWidth="2" />
                    <rect x="0" y="21" width="57" height="22" rx="7" fill="#ffb7d2" stroke="#fff" strokeWidth="2" />
                    <path d="M25 24 H31 V30 H37 V36 H31 V42 H25 V36 H19 V30 H25Z" fill="#fff" />
                    <circle cx="14" cy="44" r="7" fill="#9e7caa" stroke="#fff" strokeWidth="2" />
                    <circle cx="45" cy="44" r="7" fill="#9e7caa" stroke="#fff" strokeWidth="2" />
                    <circle cx="14" cy="44" r="3" fill="#fff" />
                    <circle cx="45" cy="44" r="3" fill="#fff" />
                    <path d="M7 17 L13 12 L19 17 L13 22Z" fill="#fff" />
                </g>

                <text x="680" y="402" fill="#a37d9c" fontSize="10" letterSpacing=".5">
                    MADE WITH LOVE, DELIVERED WITH CARE
                </text>
            </svg>
        </div>
    );
}
