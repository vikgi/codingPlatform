import { authModalState } from '@/atoms/authModalatom';
import AuthModal from '@/components/Modals/AuthModal';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

type AuthPageProps = {
    
};

const AuthPage:React.FC<AuthPageProps> = () => {
    const authModal = useRecoilValue(authModalState)
    const router = useRouter();

    const [user, loading, error] = useAuthState(auth)
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(()=> {
        if(user) router.push("/")
            if(!loading && !user) setPageLoading(false);
    }, [user, router])

    // if(pageLoading) return null;

    return <div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
        <div className='max-w-7xl mx-auto'>
            <Navbar></Navbar>
            <div className='flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
                <img src="/hero.png" alt="Banner image" />
            </div>
            {authModal.isOpen && <AuthModal/>}

        </div>
    </div>
}
export default AuthPage;