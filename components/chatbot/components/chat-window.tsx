"use client";
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircleIcon, SendHorizontal, X } from "lucide-react";
import TextareaAutoResize from "react-textarea-autosize";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AxiosChatbot } from "@/lib/axios";

const variants = {
    open: { opacity: 1, x: 0, display: 'block' },
    closed: { opacity: 0, x: '100%', display: 'none' },
};

const chatbotResponse = {
    "data": {
        "reply": "Chào bạn! Hiện tại có một số điện thoại đang có chương trình khuyến mãi cực HOT mà bạn không nên bỏ lỡ:\n\n1. **Karbonn KU3i** - Giá chỉ **295,873 VND**. Bạn tiết kiệm được **một khoản kha khá** so với giá gốc!\n\n2. **Jio JioPhone Next (3GB RAM + 32GB)** - Chỉ **2.2 triệu VND**. Mức giá này giúp bạn tiết kiệm đáng kể so với các sản phẩm cùng phân khúc.\n\n3. **Xiaomi Qin 1** - Giá chỉ **534,951 VND**. Đây là một lựa chọn tuyệt vời với mức giá này!\n\n4. **Eunity U1 Livo** - Chỉ **192,987 VND**. Tiết kiệm rất nhiều so với giá gốc!\n\n5. **Jio JioPhone 2** - Giá **891,783 VND**, cũng là một lựa chọn tốt với mức giá này.\n\n**Lưu ý:** Một số sản phẩm có số lượng có hạn và chương trình khuyến mãi có thể kết thúc sớm! \n\nDeal này sắp hết, bạn muốn mình giữ cho không?",
        "products": [
            {
                "id": "965",
                "title": "Nokia X60 5G",
                "price": 11891426,
                "average_rating": 4.35,
                "specs": "{'os': 'Harmony v2.0', 'ram': '6\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported', 'camera': '200\\u2009MP Quad Rear & 16\\u2009MP Front Camera', 'battery': '6000\\u2009mAh Battery with 33W Fast Charging', 'display': '6.51 inches, 1080\\u2009x\\u20092400\\u2009px, 144 Hz Display with Punch Hole', 'processor': 'Snapdragon 870, Octa Core, 3.2\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "965",
                    "title": "Nokia X60 5G",
                    "price": 11891426,
                    "average_rating": 4.35,
                    "specs": "{'os': 'Harmony v2.0', 'ram': '6\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported', 'camera': '200\\u2009MP Quad Rear & 16\\u2009MP Front Camera', 'battery': '6000\\u2009mAh Battery with 33W Fast Charging', 'display': '6.51 inches, 1080\\u2009x\\u20092400\\u2009px, 144 Hz Display with Punch Hole', 'processor': 'Snapdragon 870, Octa Core, 3.2\\u2009GHz Processor'}"
                },
                "vector_score": 0.3574,
                "lexical_score": 0,
                "score": 0.3581,
                "price_alignment": "unknown"
            },
            {
                "id": "760",
                "title": "Xiaomi Redmi K60 Gaming Edition",
                "price": 16351826,
                "average_rating": 4.3,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v13', 'camera': '50\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 67W Fast Charging', 'display': '6.73 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Snapdragon 8 Gen2, Octa Core, 3.2\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "760",
                    "title": "Xiaomi Redmi K60 Gaming Edition",
                    "price": 16351826,
                    "average_rating": 4.3,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v13', 'camera': '50\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 67W Fast Charging', 'display': '6.73 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Snapdragon 8 Gen2, Octa Core, 3.2\\u2009GHz Processor'}"
                },
                "vector_score": 0.36,
                "lexical_score": 0,
                "score": 0.355,
                "price_alignment": "unknown"
            },
            {
                "id": "355",
                "title": "Xiaomi Redmi K60 Pro",
                "price": 11596743,
                "average_rating": 4.25,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v13', 'camera': '54\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 16\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 120W Fast Charging', 'display': '6.67 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Snapdragon 8 Gen2, Octa Core, 3.2\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "355",
                    "title": "Xiaomi Redmi K60 Pro",
                    "price": 11596743,
                    "average_rating": 4.25,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v13', 'camera': '54\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 16\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 120W Fast Charging', 'display': '6.67 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Snapdragon 8 Gen2, Octa Core, 3.2\\u2009GHz Processor'}"
                },
                "vector_score": 0.3589,
                "lexical_score": 0,
                "score": 0.3513,
                "price_alignment": "unknown"
            },
            {
                "id": "823",
                "title": "Xiaomi Redmi K50 Ultra 5G",
                "price": 11894103,
                "average_rating": 4.25,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '108\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 120W Fast Charging', 'display': '6.67 inches, 1220\\u2009x\\u20092712\\u2009px, 144 Hz Display with Punch Hole', 'processor': 'Snapdragon 8+ Gen1, Octa Core, 3.2\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "823",
                    "title": "Xiaomi Redmi K50 Ultra 5G",
                    "price": 11894103,
                    "average_rating": 4.25,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '108\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 120W Fast Charging', 'display': '6.67 inches, 1220\\u2009x\\u20092712\\u2009px, 144 Hz Display with Punch Hole', 'processor': 'Snapdragon 8+ Gen1, Octa Core, 3.2\\u2009GHz Processor'}"
                },
                "vector_score": 0.3578,
                "lexical_score": 0,
                "score": 0.3512,
                "price_alignment": "unknown"
            },
            {
                "id": "942",
                "title": "Xiaomi Civi 2",
                "price": 8920503,
                "average_rating": 4.25,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '50\\u2009MP + 20\\u2009MP + 2\\u2009MP Triple Rear & 32\\u2009MP + 32\\u2009MP Dual Front Camera', 'battery': '4500\\u2009mAh Battery with 67W Fast Charging', 'display': '6.55 inches, 1080\\u2009x\\u20092400\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Snapdragon 7 Gen1, Octa Core, 2.4\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "942",
                    "title": "Xiaomi Civi 2",
                    "price": 8920503,
                    "average_rating": 4.25,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '50\\u2009MP + 20\\u2009MP + 2\\u2009MP Triple Rear & 32\\u2009MP + 32\\u2009MP Dual Front Camera', 'battery': '4500\\u2009mAh Battery with 67W Fast Charging', 'display': '6.55 inches, 1080\\u2009x\\u20092400\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Snapdragon 7 Gen1, Octa Core, 2.4\\u2009GHz Processor'}"
                },
                "vector_score": 0.3573,
                "lexical_score": 0,
                "score": 0.3511,
                "price_alignment": "unknown"
            },
            {
                "id": "558",
                "title": "Xiaomi Redmi K60E",
                "price": 7731063,
                "average_rating": 4.15,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '48\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5500\\u2009mAh Battery with 67W Fast Charging', 'display': '6.67 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Dimensity 8200, Octa Core, 3.1\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "558",
                    "title": "Xiaomi Redmi K60E",
                    "price": 7731063,
                    "average_rating": 4.15,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '48\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5500\\u2009mAh Battery with 67W Fast Charging', 'display': '6.67 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Dimensity 8200, Octa Core, 3.1\\u2009GHz Processor'}"
                },
                "vector_score": 0.3586,
                "lexical_score": 0,
                "score": 0.3443,
                "price_alignment": "unknown"
            },
            {
                "id": "738",
                "title": "Xiaomi Redmi K50 5G",
                "price": 8323106,
                "average_rating": 4.15,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '48\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5500\\u2009mAh Battery with 67W Fast Charging', 'display': '6.67 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Dimensity 8100, Octa Core, 2.85\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "738",
                    "title": "Xiaomi Redmi K50 5G",
                    "price": 8323106,
                    "average_rating": 4.15,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi, NFC, IR Blaster', 'card': 'Android v12', 'camera': '48\\u2009MP + 8\\u2009MP + 2\\u2009MP Triple Rear & 20\\u2009MP Front Camera', 'battery': '5500\\u2009mAh Battery with 67W Fast Charging', 'display': '6.67 inches, 1440\\u2009x\\u20093200\\u2009px, 120 Hz Display with Punch Hole', 'processor': 'Dimensity 8100, Octa Core, 2.85\\u2009GHz Processor'}"
                },
                "vector_score": 0.3571,
                "lexical_score": 0,
                "score": 0.3441,
                "price_alignment": "unknown"
            },
            {
                "id": "848",
                "title": "Realme Q3i 5G",
                "price": 3267986,
                "average_rating": 3.8,
                "specs": "{'os': 'Android v11', 'ram': '4\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported', 'camera': '48\\u2009MP + 2\\u2009MP + 2\\u2009MP Triple Rear & 16\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 18W Fast Charging', 'display': '6.5 inches, 1080\\u2009x\\u20092400\\u2009px Display with Punch Hole', 'processor': 'Dimensity 700 5G, Octa Core, 2.2\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "848",
                    "title": "Realme Q3i 5G",
                    "price": 3267986,
                    "average_rating": 3.8,
                    "specs": "{'os': 'Android v11', 'ram': '4\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported', 'camera': '48\\u2009MP + 2\\u2009MP + 2\\u2009MP Triple Rear & 16\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 18W Fast Charging', 'display': '6.5 inches, 1080\\u2009x\\u20092400\\u2009px Display with Punch Hole', 'processor': 'Dimensity 700 5G, Octa Core, 2.2\\u2009GHz Processor'}"
                },
                "vector_score": 0.3569,
                "lexical_score": 0,
                "score": 0.3195,
                "price_alignment": "unknown"
            },
            {
                "id": "852",
                "title": "Realme Q2i",
                "price": 2973303,
                "average_rating": 3.45,
                "specs": "{'os': 'No FM Radio', 'ram': '4\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi', 'card': 'Android v10', 'camera': '13\\u2009MP + 2\\u2009MP + 2\\u2009MP Triple Rear & 8\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 18W Fast Charging', 'display': '6.5 inches, 720\\u2009x\\u20091600\\u2009px Display with Water Drop Notch', 'processor': 'Dimensity 720, Octa Core, 2\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "852",
                    "title": "Realme Q2i",
                    "price": 2973303,
                    "average_rating": 3.45,
                    "specs": "{'os': 'No FM Radio', 'ram': '4\\u2009GB RAM, 128\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, 5G, VoLTE, Wi-Fi', 'card': 'Android v10', 'camera': '13\\u2009MP + 2\\u2009MP + 2\\u2009MP Triple Rear & 8\\u2009MP Front Camera', 'battery': '5000\\u2009mAh Battery with 18W Fast Charging', 'display': '6.5 inches, 720\\u2009x\\u20091600\\u2009px Display with Water Drop Notch', 'processor': 'Dimensity 720, Octa Core, 2\\u2009GHz Processor'}"
                },
                "vector_score": 0.3573,
                "lexical_score": 0,
                "score": 0.2951,
                "price_alignment": "unknown"
            },
            {
                "id": "758",
                "title": "Karbonn KU3i",
                "price": 295873,
                "average_rating": 0,
                "specs": "{'os': None, 'ram': '1000\\u2009mAh Battery', 'sim': 'Dual Sim', 'card': 'Bluetooth', 'camera': 'Memory Card Supported, upto 16\\u2009GB', 'battery': '1.8 inches, 128\\u2009x\\u2009160\\u2009px Display', 'display': 'No Rear Camera', 'processor': '52\\u2009MB RAM, 32\\u2009MB inbuilt'}",
                "raw_metadata": {
                    "id": "758",
                    "title": "Karbonn KU3i",
                    "price": 295873,
                    "average_rating": 0,
                    "specs": "{'os': None, 'ram': '1000\\u2009mAh Battery', 'sim': 'Dual Sim', 'card': 'Bluetooth', 'camera': 'Memory Card Supported, upto 16\\u2009GB', 'battery': '1.8 inches, 128\\u2009x\\u2009160\\u2009px Display', 'display': 'No Rear Camera', 'processor': '52\\u2009MB RAM, 32\\u2009MB inbuilt'}"
                },
                "vector_score": 0.3721,
                "lexical_score": 0,
                "score": 0.0558,
                "price_alignment": "unknown"
            },
            {
                "id": "598",
                "title": "Jio JioPhone Next (3GB RAM + 32GB)",
                "price": 2229903,
                "average_rating": 0,
                "specs": "{'os': 'Pragati OS (Powered by Android)', 'ram': '3\\u2009GB RAM, 32\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported', 'camera': '13\\u2009MP Rear & 8\\u2009MP Front Camera', 'battery': '3000\\u2009mAh Battery', 'display': '5.5 inches, 720\\u2009x\\u20091440\\u2009px Display', 'processor': 'Qualcomm 215, Quad Core, 1.3\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "598",
                    "title": "Jio JioPhone Next (3GB RAM + 32GB)",
                    "price": 2229903,
                    "average_rating": 0,
                    "specs": "{'os': 'Pragati OS (Powered by Android)', 'ram': '3\\u2009GB RAM, 32\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported', 'camera': '13\\u2009MP Rear & 8\\u2009MP Front Camera', 'battery': '3000\\u2009mAh Battery', 'display': '5.5 inches, 720\\u2009x\\u20091440\\u2009px Display', 'processor': 'Qualcomm 215, Quad Core, 1.3\\u2009GHz Processor'}"
                },
                "vector_score": 0.3666,
                "lexical_score": 0,
                "score": 0.055,
                "price_alignment": "unknown"
            },
            {
                "id": "686",
                "title": "Xiaomi Qin 1",
                "price": 534951,
                "average_rating": 0,
                "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009MB RAM, 16\\u2009MB inbuilt', 'sim': 'Dual Sim, Wi-Fi', 'card': 'Nucleus', 'camera': 'No Rear Camera', 'battery': '1480\\u2009mAh Battery', 'display': '2.8 inches, 240\\u2009x\\u2009320\\u2009px Display', 'processor': 'Helio MT6260A'}",
                "raw_metadata": {
                    "id": "686",
                    "title": "Xiaomi Qin 1",
                    "price": 534951,
                    "average_rating": 0,
                    "specs": "{'os': 'No FM Radio', 'ram': '8\\u2009MB RAM, 16\\u2009MB inbuilt', 'sim': 'Dual Sim, Wi-Fi', 'card': 'Nucleus', 'camera': 'No Rear Camera', 'battery': '1480\\u2009mAh Battery', 'display': '2.8 inches, 240\\u2009x\\u2009320\\u2009px Display', 'processor': 'Helio MT6260A'}"
                },
                "vector_score": 0.366,
                "lexical_score": 0,
                "score": 0.0549,
                "price_alignment": "unknown"
            },
            {
                "id": "933",
                "title": "Eunity U1 Livo",
                "price": 192987,
                "average_rating": 0,
                "specs": "{'os': None, 'ram': '16\\u2009MB RAM, 16\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': None, 'camera': '0.3\\u2009MP Rear Camera', 'battery': '1000\\u2009mAh Battery', 'display': '1.8 inches, 280\\u2009x\\u2009240\\u2009px Display', 'processor': '1.77\\u2009MHz Processor'}",
                "raw_metadata": {
                    "id": "933",
                    "title": "Eunity U1 Livo",
                    "price": 192987,
                    "average_rating": 0,
                    "specs": "{'os': None, 'ram': '16\\u2009MB RAM, 16\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': None, 'camera': '0.3\\u2009MP Rear Camera', 'battery': '1000\\u2009mAh Battery', 'display': '1.8 inches, 280\\u2009x\\u2009240\\u2009px Display', 'processor': '1.77\\u2009MHz Processor'}"
                },
                "vector_score": 0.3633,
                "lexical_score": 0,
                "score": 0.0545,
                "price_alignment": "unknown"
            },
            {
                "id": "401",
                "title": "Jio JioPhone 2",
                "price": 891783,
                "average_rating": 0,
                "specs": "{'os': 'KAI OS', 'ram': '512\\u2009MB RAM, 4\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported, upto 128\\u2009GB', 'camera': '2\\u2009MP Rear & 0.3\\u2009MP Front Camera', 'battery': '2000\\u2009mAh Battery', 'display': '2.4 inches, 320\\u2009x\\u2009240\\u2009px Display', 'processor': 'Dual Core, 1\\u2009GHz Processor'}",
                "raw_metadata": {
                    "id": "401",
                    "title": "Jio JioPhone 2",
                    "price": 891783,
                    "average_rating": 0,
                    "specs": "{'os': 'KAI OS', 'ram': '512\\u2009MB RAM, 4\\u2009GB inbuilt', 'sim': 'Dual Sim, 3G, 4G, VoLTE, Wi-Fi', 'card': 'Memory Card Supported, upto 128\\u2009GB', 'camera': '2\\u2009MP Rear & 0.3\\u2009MP Front Camera', 'battery': '2000\\u2009mAh Battery', 'display': '2.4 inches, 320\\u2009x\\u2009240\\u2009px Display', 'processor': 'Dual Core, 1\\u2009GHz Processor'}"
                },
                "vector_score": 0.3627,
                "lexical_score": 0,
                "score": 0.0544,
                "price_alignment": "unknown"
            },
            {
                "id": "847",
                "title": "DIZO Star 500",
                "price": 520083,
                "average_rating": 0,
                "specs": "{'os': 'Bluetooth', 'ram': '32\\u2009MB RAM, 32\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': 'Memory Card Supported, upto 64\\u2009GB', 'camera': '0.3\\u2009MP Rear Camera', 'battery': '1900\\u2009mAh Battery', 'display': '2.8 inches, 240\\u2009x\\u2009320\\u2009px Display', 'processor': 'SC6531E, 26\\u2009MHz Processor'}",
                "raw_metadata": {
                    "id": "847",
                    "title": "DIZO Star 500",
                    "price": 520083,
                    "average_rating": 0,
                    "specs": "{'os': 'Bluetooth', 'ram': '32\\u2009MB RAM, 32\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': 'Memory Card Supported, upto 64\\u2009GB', 'camera': '0.3\\u2009MP Rear Camera', 'battery': '1900\\u2009mAh Battery', 'display': '2.8 inches, 240\\u2009x\\u2009320\\u2009px Display', 'processor': 'SC6531E, 26\\u2009MHz Processor'}"
                },
                "vector_score": 0.3613,
                "lexical_score": 0,
                "score": 0.0542,
                "price_alignment": "unknown"
            },
            {
                "id": "574",
                "title": "Nokia 105 (2019)",
                "price": 386271,
                "average_rating": 0,
                "specs": "{'os': None, 'ram': '4\\u2009MB RAM, 4\\u2009MB inbuilt', 'sim': 'Single Sim', 'card': None, 'camera': 'No Rear Camera', 'battery': '800\\u2009mAh Battery', 'display': '1.77 inches, 120\\u2009x\\u2009160\\u2009px Display', 'processor': 'No Wifi'}",
                "raw_metadata": {
                    "id": "574",
                    "title": "Nokia 105 (2019)",
                    "price": 386271,
                    "average_rating": 0,
                    "specs": "{'os': None, 'ram': '4\\u2009MB RAM, 4\\u2009MB inbuilt', 'sim': 'Single Sim', 'card': None, 'camera': 'No Rear Camera', 'battery': '800\\u2009mAh Battery', 'display': '1.77 inches, 120\\u2009x\\u2009160\\u2009px Display', 'processor': 'No Wifi'}"
                },
                "vector_score": 0.3612,
                "lexical_score": 0,
                "score": 0.0542,
                "price_alignment": "unknown"
            },
            {
                "id": "641",
                "title": "Nokia 105 Plus",
                "price": 386271,
                "average_rating": 0,
                "specs": "{'os': None, 'ram': '800\\u2009mAh Battery', 'sim': 'Dual Sim', 'card': 'Bluetooth', 'camera': 'Memory Card Supported, upto 32\\u2009GB', 'battery': '1.77 inches, 128\\u2009x\\u2009160\\u2009px Display', 'display': 'No Rear Camera', 'processor': '4\\u2009MB RAM, 4\\u2009MB inbuilt'}",
                "raw_metadata": {
                    "id": "641",
                    "title": "Nokia 105 Plus",
                    "price": 386271,
                    "average_rating": 0,
                    "specs": "{'os': None, 'ram': '800\\u2009mAh Battery', 'sim': 'Dual Sim', 'card': 'Bluetooth', 'camera': 'Memory Card Supported, upto 32\\u2009GB', 'battery': '1.77 inches, 128\\u2009x\\u2009160\\u2009px Display', 'display': 'No Rear Camera', 'processor': '4\\u2009MB RAM, 4\\u2009MB inbuilt'}"
                },
                "vector_score": 0.3607,
                "lexical_score": 0,
                "score": 0.0541,
                "price_alignment": "unknown"
            },
            {
                "id": "609",
                "title": "Namotel Achhe Din",
                "price": 29439,
                "average_rating": 0,
                "specs": "{'os': None, 'ram': '1325\\u2009mAh Battery', 'sim': 'Dual Sim, 3G, Wi-Fi', 'card': 'Bluetooth', 'camera': 'Android v5.0 (Lollipop)', 'battery': '4 inches, 720\\u2009x\\u20091280\\u2009px Display', 'display': '2\\u2009MP Rear & 0.3\\u2009MP Front Camera', 'processor': '1\\u2009GB RAM, 4\\u2009GB inbuilt'}",
                "raw_metadata": {
                    "id": "609",
                    "title": "Namotel Achhe Din",
                    "price": 29439,
                    "average_rating": 0,
                    "specs": "{'os': None, 'ram': '1325\\u2009mAh Battery', 'sim': 'Dual Sim, 3G, Wi-Fi', 'card': 'Bluetooth', 'camera': 'Android v5.0 (Lollipop)', 'battery': '4 inches, 720\\u2009x\\u20091280\\u2009px Display', 'display': '2\\u2009MP Rear & 0.3\\u2009MP Front Camera', 'processor': '1\\u2009GB RAM, 4\\u2009GB inbuilt'}"
                },
                "vector_score": 0.3596,
                "lexical_score": 0,
                "score": 0.0539,
                "price_alignment": "unknown"
            },
            {
                "id": "918",
                "title": "Nokia 150 (2020)",
                "price": 743103,
                "average_rating": 0,
                "specs": "{'os': 'Bluetooth', 'ram': '4\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': 'Memory Card Supported, upto 32\\u2009GB', 'camera': '0.3\\u2009MP Rear Camera', 'battery': '1020\\u2009mAh Battery', 'display': '2.4 inches, 240\\u2009x\\u2009320\\u2009px Display', 'processor': 'No Wifi'}",
                "raw_metadata": {
                    "id": "918",
                    "title": "Nokia 150 (2020)",
                    "price": 743103,
                    "average_rating": 0,
                    "specs": "{'os': 'Bluetooth', 'ram': '4\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': 'Memory Card Supported, upto 32\\u2009GB', 'camera': '0.3\\u2009MP Rear Camera', 'battery': '1020\\u2009mAh Battery', 'display': '2.4 inches, 240\\u2009x\\u2009320\\u2009px Display', 'processor': 'No Wifi'}"
                },
                "vector_score": 0.3573,
                "lexical_score": 0,
                "score": 0.0536,
                "price_alignment": "unknown"
            },
            {
                "id": "882",
                "title": "Nokia 110 (2022)",
                "price": 475479,
                "average_rating": 0,
                "specs": "{'os': None, 'ram': '4\\u2009MB RAM, 4\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': None, 'camera': 'Memory Card Supported, upto 32\\u2009GB', 'battery': '1000\\u2009mAh Battery', 'display': '1.77 inches, 120\\u2009x\\u2009160\\u2009px Display', 'processor': 'No Wifi'}",
                "raw_metadata": {
                    "id": "882",
                    "title": "Nokia 110 (2022)",
                    "price": 475479,
                    "average_rating": 0,
                    "specs": "{'os': None, 'ram': '4\\u2009MB RAM, 4\\u2009MB inbuilt', 'sim': 'Dual Sim', 'card': None, 'camera': 'Memory Card Supported, upto 32\\u2009GB', 'battery': '1000\\u2009mAh Battery', 'display': '1.77 inches, 120\\u2009x\\u2009160\\u2009px Display', 'processor': 'No Wifi'}"
                },
                "vector_score": 0.3565,
                "lexical_score": 0,
                "score": 0.0535,
                "price_alignment": "unknown"
            }
        ],
        "follow_up": false
    },
    "status": 200,
    "statusText": "",
    "headers": {
        "content-length": "21463",
        "content-type": "application/json"
    },
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        "baseURL": "https://847d6e835698.ngrok-free.app",
        "method": "post",
        "url": "/chat",
        "data": "{\"message\":\"Có điện thoại nào đang khuyến mãi không?\",\"user_id\":\"1\",\"k\":20}",
        "allowAbsoluteUrls": true
    },
    "request": {
        "requestMethod": "POST",
        "__METHOD__": "POST",
        "__URL__": "https://847d6e835698.ngrok-free.app/chat"
    }
}

const typingDotDelays = [0, 0.18, 0.36];

const ChatWindow = ({ setChatbotProducts }: { setChatbotProducts: (products: any[]) => void }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isOpen = !!searchParams.get("chatbot");
    const chatElementRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setChatbotProducts([]);
    }, [isOpen])

    const closeChatbot = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("chatbot");
        router.replace(`${pathname}?${params.toString()}`);
    }

    const sendMessage = async () => {
        if (!chatElementRef.current?.value) return;
        const message = chatElementRef.current?.value;
        chatElementRef.current!.value = "";
        setMessages((prev) => [...prev, { role: "user", reply: message }]);

        setIsLoading(true);
        
        
        // setTimeout(() => {
        //     setMessages((prev) => [...prev, { role: "assistant", reply: chatbotResponse.data.reply, products: chatbotResponse.data.products }]);
        //     setChatbotProducts(chatbotResponse.data.products);
        //     setIsLoading(false);
        // }, 3000);

        await AxiosChatbot.post("/chat",
            {
                message: message,
                user_id: `${1}`,
                k: 20
            })
            .then((res) => {
                setIsLoading(false);
                setMessages((prev) => [...prev, { role: "assistant", reply: res.data.reply, products: res.data.products }]);
                setChatbotProducts(res.data.products);
            }).catch((err) => {
                setIsLoading(false);
                console.log(err);
            })
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <AnimatePresence>
            <motion.nav
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                transition={{ duration: 0.2 }}
                className="border h-full sm:w-full sm:max-w-none start-auto rounded-lg inset-5 flex-shrink-0 bg-background overflow-auto"
            >
                <div className='flex flex-col gap-4 h-full w-full rounded-lg'>
                    <div className="h-11 bg-primary/75 flex items-center justify-between pr-2 pl-2.5">
                        <div className="flex items-center gap-2 text-white">
                            <div className="bg-white w-6 aspect-square rounded-full p-1"><MessageCircleIcon className="w-full h-full text-black" /></div>
                            Tư vấn sản phẩm với AI
                        </div>
                        <X className="w-7 aspect-square" onClick={closeChatbot} />
                    </div>
                    <div className="flex-1 overflow-y-scroll flex flex-col items-start gap-2 px-4">
                        {messages.map((message, index) => {
                            const isUser = message.role === "user";
                            return (
                                <div
                                    key={`${message.role}-${index}`}
                                    onClick={() => {
                                        if (message.role === "assistant") setChatbotProducts(message.products);
                                    }}
                                    className={`max-w-[80%] rounded-4xl px-5 py-4 text-t4-bold ${isUser
                                        ? "bg-primary/75 text-white self-end"
                                        : "bg-white/10 text-foreground self-start"
                                        }`}
                                >
                                    {message.reply}
                                </div>
                            );
                        })}
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div
                                    key="typing-indicator"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2 self-start bg-white/10 text-foreground rounded-full px-3 py-2 text-t4-bold"
                                >
                                    {typingDotDelays.map((delay, index) => (
                                        <motion.span
                                            key={`typing-dot-${index}`}
                                            className="text-2xl leading-none"
                                            animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                                            transition={{
                                                duration: 0.9,
                                                repeat: Infinity,
                                                repeatDelay: 0.1,
                                                ease: "easeInOut",
                                                delay
                                            }}
                                        >
                                            .
                                        </motion.span>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-5 border-t border-border">
                        <TextareaAutoResize ref={chatElementRef} className="w-full h-16 p-2 rounded-md focus:placeholder:opacity-0 resize-none text-foreground text-t4-bold placeholder:text-t4-bold placeholder:text-foreground/50 max-h-40 outline-2 outline-border outline-offset-[3px]" placeholder="Nhập tin nhắn..." />
                        <SendHorizontal onClick={sendMessage} className="w-8 h-8  flex-shrink-0 text-primary" />
                    </div>
                </div>
            </motion.nav>
        </AnimatePresence>
    )
}

export default ChatWindow