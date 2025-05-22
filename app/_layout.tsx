import React, { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { Stack, useRouter, Slot } from "expo-router";
import { store, RootState } from "../redux/store";
import 'react-native-get-random-values';
import ToastManager from "toastify-react-native/components/ToastManager";

function AuthWrapper() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100); // Delay to ensure mounting

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.replace("/(Auth)/signupAuth");
    }
  }, [isMounted, isAuthenticated]);

  if (!isMounted) return null;

  return (
    <>
      <Slot />
      <ToastManager duration={5000} />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthWrapper />
    </Provider>
  );
}
