import React, { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import googleIcon from "../../assets/images/google.png";

WebBrowser.maybeCompleteAuthSession();

const GoogleAuth = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "129228478664-lpca7of5bqbm8n63rqs10jh45ia7l7de.apps.googleusercontent.com",
    androidClientId:
      "129228478664-6ps0c4lsskhu2aatvp1u4998gjf31vee.apps.googleusercontent.com",
    webClientId:
      "129228478664-nmbtmk69mdmkuau1auahojvbp5i36n9o.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({  }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token: string | undefined) => {
    if (!token) return;

    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await res.json();
    setUserInfo(user);
  };

  return (
    <View className="items-center mt-10">
      {userInfo ? (
        <>
          {userInfo.picture && (
            <Image
              source={{ uri: userInfo.picture }}
              className="w-20 h-20 rounded-full mb-3"
            />
          )}
          <Text className="text-gray-700 mb-3">
            Signed in as: {userInfo.name}
          </Text>
          <TouchableOpacity
            onPress={() => setUserInfo(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            <Text className="text-gray-800 text-sm">Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync()}
          className="flex flex-row items-center justify-center border w-full border-gray-400 py-3 rounded-lg mb-4 bg-white"
        >
          <Image
            source={googleIcon}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
          <Text className="ml-2 text-gray-800 font-semibold">
            Sign in with Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GoogleAuth;
