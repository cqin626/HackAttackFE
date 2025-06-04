import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { submitVerification } from '../services/verificationService';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function VerifyCaptchaPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || '';

  const handleSubmit = async () => {
    if (!captchaToken) {
      setMessage('Please complete the CAPTCHA.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitVerification(token, captchaToken);
      setMessage(response.message);
      setSubmitted(true);
    } catch (error: any) {
      setMessage(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url('/binary.avif')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(6px)',
          borderRadius: '1rem',
        }}
      >
        <h4 className="card-title text-center mb-3">Verify You're Human</h4>

        {!submitted ? (
          <>
            <div className="mb-3 d-flex justify-content-center">
              <ReCAPTCHA sitekey={siteKey} onChange={setCaptchaToken} />
            </div>

            {message && (
              <div className="alert alert-warning text-center py-2" role="alert">
                {message}
              </div>
            )}

            <div className="d-grid">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="alert alert-success text-center">
            {message || 'Verification complete!'}
          </div>
        )}
      </div>
    </div>
  );
}
