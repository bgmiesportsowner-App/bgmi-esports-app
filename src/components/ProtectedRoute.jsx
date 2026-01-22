import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProtectedRoute = ({ children, redirectPath = "/login" }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Firebase auth state check
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Email verification check
        if (user.emailVerified) {
          // localStorage mein user save kar (tera existing logic)
          localStorage.setItem("bgmi_user", JSON.stringify({
            uid: user.uid,
            email: user.email,
            verified: true
          }));
          setIsAuth(true);
          setIsVerified(true);
        } else {
          alert(`⚠️ ${user.email} verify kar! Email inbox/spam check kar.`);
          localStorage.removeItem("bgmi_user");
        }
      } else {
        // No user logged in
        const stored = localStorage.getItem("bgmi_user");
        if (!stored || !JSON.parse(stored).verified) {
          localStorage.removeItem("bgmi_user");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
        <div>🔄 Loading...</div>
      </div>
    );
  }

  // localStorage + Firebase verified check
  const stored = localStorage.getItem("bgmi_user");
  const userData = stored ? JSON.parse(stored) : null;

  if (!isAuth || !isVerified || !userData?.verified) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
