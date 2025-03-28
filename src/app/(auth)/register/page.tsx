"use client";

import { motion } from "framer-motion";
import { AuthPattern } from "@/components/auth/auth-pattern";
import RegistrationForm from "@/components/auth/registration-form";

export default function RegisterPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <AuthPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RegistrationForm />
      </motion.div>
    </div>
  );
}
