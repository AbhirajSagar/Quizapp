import { useState } from 'react';
import { Navbar } from "./Navbar";
import { AccountInfoModal } from "./AccountInfoModal";
import { useAuth } from '../authContext';

export default function MenuNavbar({showSearchBtn = true, showCreateQuiz = true})
{
    const { user } = useAuth();
    const [AccountInfoVisible, setAccountInfoVisible] = useState(false);

    return (
        <>
            <Navbar user={user} setAccountInfoVisible={setAccountInfoVisible} showSearchBtn={showSearchBtn} showCreateQuiz={showCreateQuiz}/>
            {AccountInfoVisible && <AccountInfoModal user={user} setAccountInfoVisible={setAccountInfoVisible} />}
        </>
    );
}