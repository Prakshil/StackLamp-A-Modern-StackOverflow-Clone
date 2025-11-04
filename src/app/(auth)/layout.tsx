"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const layout = ({ children }: { children: React.ReactNode }) => 
{
    const {session} = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        
        if (session) {
            router.push("/");
        }
    }, [session, router]);
    if (session) {
        return null;
    }
    return (
        <div className="">
           <div className="">{children}</div>
        </div>
    )
    

    
  
    
};
export default layout;