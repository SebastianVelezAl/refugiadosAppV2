"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "lib/firebase";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Modo mock: comprobamos una flag en localStorage
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      try {
        const hasMock = typeof window !== "undefined" && localStorage.getItem("refugiapp_mock_user") === "true";
        if (!hasMock) {
          router.replace("/");
        } else {
          setChecking(false);
        }
      } catch (e) {
        router.replace("/");
      }
      return;
    }

    // Modo real: usamos onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        router.replace("/");
      } else {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <div>Comprobando sesión...</div>
      </div>
    );
  }

  return <>{children}</>;
}
