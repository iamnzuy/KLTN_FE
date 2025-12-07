'use client'
import { MessageCircleIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const ChatbotFloatingButton = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOpen = !!searchParams.get("chatbot");

    const openChatbot = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("chatbot", "true");
        router.replace(`/search-results?${params.toString()}`);
    }

    return (
        <div className="fixed z-40 right-9 bottom-6 rounded-full">
            {!isOpen && (
                <div className="relative w-[60px] h-[60px] group" onClick={openChatbot}>
                    <div className="bg-primary rounded-full w-full h-full pulse" />
                    <div className="bg-white rounded-full absolute top-0 right-0 w-full h-full scale-90">
                        <MessageCircleIcon className="text-black w-full h-full scale-[70%]" />
                    </div>
                    <div className="absolute group-hover:opacity-100 group-hover:-translate-x-[110%] -translate-x-2/3  opacity-0 transition-all duration-300 left-0 top-1/2 -translate-y-1/2 py-1 px-2 text-nowrap text-center text-t4-bold border-2 border-white bg-black shadow-md rounded-md">
                        Tư vấn sản phẩm với AI
                    </div>
                </div>
            )}
        </div>
    )
}
export default ChatbotFloatingButton