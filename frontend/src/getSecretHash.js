import CryptoJS from "crypto-js";

export const getSecretHash = (email, clientSecret) => {
    console.log("Email:", email);
    console.log("Client secret:", clientSecret);
  
    const message = email + clientSecret;
    console.log("Message:", message);
  
    const hash = CryptoJS.HmacSHA256(message, clientSecret);
    console.log("Hash:", hash);
  
    const secretHash = hash.toString(CryptoJS.enc.Base64);
    console.log("Secret hash:", secretHash);
  
    return secretHash;
  };