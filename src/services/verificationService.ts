// src/services/verificationService.ts
import axios from 'axios';

export async function submitVerification(token: string, captchaToken: string) {
  try {
    const res = await axios.post('http://localhost:8080/verification/submit', {
      token,
      captchaToken,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'API error');
  }
}


