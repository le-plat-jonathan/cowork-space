import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import ResetPasswordEmail from "../../emails/reset-password.email";
import { sendEmail } from "./mail/send-email-resend";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: `Réinitialisation de votre mot de passe `,
        react: ResetPasswordEmail({
          resetLink: url,
          username: user.name,
        }),
      });
    },
  },
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }) => {
  //     void sendEmail({
  //       to: user.email,
  //       subject: "Vérifiez votre adresse email",
  //       react: VerifyEmailEmail({
  //         verificationLink: url,
  //         username: user.name,
  //       }),
  //     });
  //   },
  // },
  plugins: [admin()],
});
