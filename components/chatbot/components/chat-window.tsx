"use client";
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircleIcon, SendHorizontal, X } from "lucide-react";
import TextareaAutoResize from "react-textarea-autosize";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosChatbot } from "@/lib/axios";
import { ChatbotStore } from "@/app/(app)/search-results/hooks/chatbot-store";
import { ComparisonStore } from "@/app/(app)/search-results/hooks/comparison-store";
import Image from "next/image";
import Link from "next/link";
import { enrichProductsWithMockImages } from "@/lib/image-utils";

const variants = {
    open: { opacity: 1, x: 0, display: 'block' },
    closed: { opacity: 0, x: '100%', display: 'none' },
};

const typingDotDelays = [0, 0.18, 0.36];

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
    const pendingMessage = ChatbotStore((state: any) => state.pendingMessage);
    const clearPendingMessage = ChatbotStore((state: any) => state.clearPendingMessage);
    const prefillComparison = ComparisonStore((state: any) => state.prefillComparison);
    const removeProduct = ComparisonStore((state: any) => state.removeProduct);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const isSendingRef = useRef(false);

    const handleRemoveProductFromChatbot = (product: any, event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setProductInChatbot((prev: any[]) => prev.filter((item: any) => item.id !== product.id));
        removeProduct(product.id);
    };

    useEffect(() => {
        setChatbotProducts([]);
    }, [isOpen])

    useEffect(() => {
        if (pendingMessage && isOpen) {
            setMessages((prev) => [...prev, pendingMessage]);
            clearPendingMessage();
        }
    }, [pendingMessage, isOpen, clearPendingMessage])

    const closeChatbot = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("chatbot");
        router.replace(`${pathname}?${params.toString()}`);
    }

    // Kiểm tra xem message có liên quan đến so sánh không
    const isComparisonMessage = (message: string): boolean => {
        const comparisonKeywords = ['so sánh', 'compare', 'khác nhau', 'giống nhau', 'nên mua', 'nào tốt hơn', 'tốt hơn', 'hơn'];
        const lowerMessage = message.toLowerCase();
        return comparisonKeywords.some(keyword => lowerMessage.includes(keyword));
    };

    const sendMessage = async () => {
        if (!chatElementRef.current?.value || isSendingRef.current) return;
        
        isSendingRef.current = true;
        setIsSendingMessage(true);
        
        const message = chatElementRef.current?.value;
        chatElementRef.current!.value = "";
        setMessages((prev) => [...prev, { role: "user", reply: message }]);

        setIsLoading(true);

        if (productInChatbot.length === 2 && isComparisonMessage(message)) {
            try {
                const compareResponse = await AxiosChatbot.post('/compare', {
                    product_a_id: productInChatbot[0].id,
                    product_b_id: productInChatbot[1].id,
                });

                const selectedProducts = productInChatbot.slice(0, 2);
                const productsKey = `${selectedProducts[0].id}-${selectedProducts[1].id}`;
                prefillComparison(selectedProducts, compareResponse.data, productsKey);

                const summaryMessage = `💡 **So sánh ${productInChatbot[0].title} và ${productInChatbot[1].title}:**\n\n${compareResponse.data.summary}\n\n${compareResponse.data.follow_up || ''}\n\n*Đã mở bảng so sánh chi tiết bên cạnh để bạn xem thêm.*`;

                setMessages((prev) => [...prev, {
                    role: "assistant",
                    reply: summaryMessage,
                    products: [],
                    comparisonData: compareResponse.data
                }]);
                setIsLoading(false);
                isSendingRef.current = false;
                setIsSendingMessage(false);
                return;
            } catch (err: any) {
                console.error('Error comparing products:', err);
                setIsLoading(false);
                isSendingRef.current = false;
                setIsSendingMessage(false);
            }
        }

        await AxiosChatbot.post("/chat",
            {
                message: message,
                user_id: `${1}`,
                k: 20
            })
            .then((res) => {
                setIsLoading(false);
                const normalizedProducts = enrichProductsWithMockImages(res.data?.products);
                setMessages((prev) => [...prev, { role: "assistant", reply: res.data.reply, products: normalizedProducts }]);
                setChatbotProducts(normalizedProducts);
            }).catch((err) => {
                setIsLoading(false);
                console.log(err);
            }).finally(() => {
                isSendingRef.current = false;
                setIsSendingMessage(false);
            });
    }

    useEffect(() => {
        const textarea = chatElementRef.current;
        if (!textarea) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Kiểm tra isComposing để tránh kích hoạt khi đang gõ tiếng Việt
            // Kiểm tra isSendingRef để tránh gửi nhiều lần
            if (event.key === "Enter" && !event.shiftKey && !event.isComposing && !isSendingRef.current) {
                event.preventDefault();
                sendMessage();
            }
        };
        
        textarea.addEventListener("keydown", handleKeyDown);
        return () => {
            textarea.removeEventListener("keydown", handleKeyDown);
        };
    }, [sendMessage]);

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
                        {productInChatbot && productInChatbot.length > 0 && productInChatbot.length !== 2 && (
                            <div className="sticky bottom-0 left-0 right-0 mt-auto border-t bg-background/95 px-3 py-3 z-30 backdrop-blur-md">
                                <div className="flex flex-wrap gap-2 justify-start items-center">
                                    {productInChatbot.map((product: any) => (
                                        <div
                                            key={product?.id}
                                            className="relative flex flex-col items-center w-[90px] p-2 bg-background border border-border/60 rounded-lg transition-all hover:border-primary hover:shadow-sm"
                                        >
                                            <button
                                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-500/90 hover:bg-red-500 text-white shadow-sm transition-colors duration-150 flex items-center justify-center"
                                                onClick={(event) => handleRemoveProductFromChatbot(product, event)}
                                                aria-label="Xóa sản phẩm"
                                                title="Xóa"
                                            >
                                                <X className="w-3 h-3" strokeWidth={3} />
                                            </button>
                                            <Image
                                                unoptimized
                                                src={product?.imurl || '/no_photo.png'}
                                                alt={product?.title || 'Product'}
                                                width={50}
                                                height={50}
                                                className="object-contain rounded-md"
                                            />
                                            <span className="block w-full text-xs text-center mt-1.5 truncate font-medium text-foreground/80">
                                                {product?.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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