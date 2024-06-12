'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    const handleClient1 = () => {
        router.push('/client1');
    };

    const handleClient2 = () => {
        router.push('/client2');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl mb-4">Choose Client</h1>
            <div className="flex gap-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleClient1}
                >
                    Client 1
                </button>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={handleClient2}
                >
                    Client 2
                </button>
            </div>
        </div>
    );
}
