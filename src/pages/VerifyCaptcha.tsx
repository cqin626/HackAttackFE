// src/pages/VerifyCaptcha.tsx
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { submitVerification } from '../services/verificationService';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function VerifyCaptchaPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || '';

  const handleSubmit = async () => {
    if (!captchaToken) {
      setMessage('Please complete the captcha');
      return;
    }

    try {
      const response = await submitVerification(token, captchaToken);
      setMessage(response.message);
      setSubmitted(true);
    } catch (error: any) {
      setMessage(error.message || 'Verification failed');
    }
  };

  return (
    <div>
      <h2>Verification</h2>
      {!submitted ? (
        <>
          <ReCAPTCHA sitekey={siteKey} onChange={setCaptchaToken} />
          <button onClick={handleSubmit}>Verify</button>
        </>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
