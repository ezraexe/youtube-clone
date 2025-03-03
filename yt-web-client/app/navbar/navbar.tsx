'use client';

import Image from "next/image";    
import styles from "./navbar.module.css";
import Link from "next/link"; 
import SignIn from "./sign-in";
import {onAuthStateChangedHelper} from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
export default function Navbar() {
    const [user, setUser] = useState<User | null>(null); 

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user); 
        });
        // cleaning up the subscription when unmounting
        return () => unsubscribe(); 
    });
    
    return (
        <nav className={styles.nav}> 
            <Link href = "/">

                <Image width={90} height={20}
                    src="/youtube-logo.svg" alt = "Youtube Logo" />     
            
            </Link>
            {
                // todo: add a upload
            }
            <SignIn user={user} />
        </nav> 
    );
}