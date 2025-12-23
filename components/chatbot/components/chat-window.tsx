"use client";
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircleIcon, SendHorizontal, X } from "lucide-react";
import TextareaAutoResize from "react-textarea-autosize";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AxiosChatbot } from "@/lib/axios";
import { ChatbotStore } from "@/app/(app)/search-results/hooks/chatbot-store";
import Image from "next/image";
import Link from "next/link";
import { CHATBOT_SAMPLE_IMAGES } from "@/lib/chatbot-sample-images";

const variants = {
    open: { opacity: 1, x: 0, display: 'block' },
    closed: { opacity: 0, x: '100%', display: 'none' },
};

const typingDotDelays = [0, 0.18, 0.36];

const shuffleArray = <T,>(array: T[]) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const enrichProductsWithImages = (products: any[] = []) => {
    if (!products?.length) return [];
    const fallbackPool = shuffleArray(CHATBOT_SAMPLE_IMAGES);
    return products.map((product, index) => {
        const fallbackImage = fallbackPool[index % fallbackPool.length];
        const originalImage =
            product?.imurl ||
            product?.image ||
            product?.imageUrl ||
            product?.thumbnail ||
            product?.thumbnailUrl ||
            null;

        return {
            ...product,
            // Always prioritize local mock images so Next/Image can render without domain config churn.
            imurl: fallbackImage,
            originalImage,
        };
    });
};

const ChatWindow = ({ setChatbotProducts }: { setChatbotProducts: (products: any[]) => void }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isOpen = !!searchParams.get("chatbot");
    const chatElementRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const productInChatbot = ChatbotStore((state: any) => state.productInChatbot);
    const setProductInChatbot = ChatbotStore((state: any) => state.setProductInChatbot);
    console.log(productInChatbot);

    const handleRemoveProductFromChatbot = (product: any, event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setProductInChatbot((prev: any[]) => prev.filter((item: any) => item.id !== product.id));
    };

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
                const normalizedProducts = enrichProductsWithImages(res.data?.products);
                setMessages((prev) => [...prev, { role: "assistant", reply: res.data.reply, products: normalizedProducts }]);
                setChatbotProducts(normalizedProducts);
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
                    <div className="flex-1 overflow-y-scroll flex flex-col items-start gap-2 px-4 relative">
                        {messages.map((message, index) => {
                            const isUser = message.role === "user";

                            const parseReplyToReact = (reply: string) => {
                                if (!reply) return null;

                                // Split by double newlines into paragraphs
                                const paragraphs = reply.split(/\n\n+/g);

                                return paragraphs.map((para, pIdx) => {
                                    // Split inline bold markers **bold**
                                    const parts = para.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

                                    const inline = parts.map((part, i) => {
                                        if (/^\*\*[^*]+\*\*$/.test(part)) {
                                            const text = part.replace(/\*\*/g, "");
                                            return (<strong key={i} className="font-semibold">{text}</strong>);
                                        }

                                        // Highlight price patterns like "Giá: 13,975,623 VND"
                                        const priceMatch = part.match(/(Giá[:\s]*[\d.,]+\s*VND)/i);
                                        if (priceMatch) {
                                            const [before, after] = part.split(priceMatch[0]);
                                            return (
                                                <span key={i}>
                                                    {before}
                                                    <span className="text-primary font-semibold">{priceMatch[0]}</span>
                                                    {after}
                                                </span>
                                            );
                                        }

                                        // Rating pattern: Đánh giá: 3.75 -> add star
                                        const ratingMatch = part.match(/(Đánh giá[:\s]*)([0-9]+(?:\.[0-9]+)?)/i);
                                        if (ratingMatch) {
                                            const replaced = part.replace(ratingMatch[0], `${ratingMatch[1]}${ratingMatch[2]} ⭐`);
                                            return <span key={i}>{replaced}</span>;
                                        }

                                        return <span key={i}>{part}</span>;
                                    });

                                    return (
                                        <p key={pIdx} className="m-0 leading-6 whitespace-pre-wrap">
                                            {inline}
                                        </p>
                                    );
                                });
                            }

                            return (
                                <div
                                    key={`${message.role}-${index}`}
                                    onClick={() => {
                                        if (message.role === "assistant") setChatbotProducts(message.products);
                                    }}
                                    className={`max-w-[80%] rounded-2xl px-5 py-4 text-t4-bold break-words ${isUser
                                        ? "bg-primary/75 text-white self-end shadow-md"
                                        : "bg-card text-foreground/95 self-start border border-border shadow-sm"
                                        }`}
                                >
                                    {parseReplyToReact(message.reply)}
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
                        <div className="absolute bottom-0 left-3 flex gap-4">
                            {productInChatbot?.map((product: any) => (
                                <Link href={`/product-details/${product?.id}`} target="_blank" key={product?.id} className="relative group flex flex-col justify-center items-center gap-2 border rounded-2xl w-28 p-3">
                                    <Image unoptimized={true} src={product?.imurl} alt={product?.title} width={80} height={80} className="w-16 h-16 object-container" />
                                    <div className="text-xs font-medium truncate w-full text-center">{product?.title}</div>
                                    <X className="absolute top-2 right-2 group-hover:block hidden" onClick={(event: any) => handleRemoveProductFromChatbot(product, event)} />
                                </Link>
                            ))}
                        </div>
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