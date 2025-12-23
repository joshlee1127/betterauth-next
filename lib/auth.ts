import { ac, roles } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin, twoFactor } from 'better-auth/plugins';
import { sendOtpEmail } from './send-otp-email';
import { sendResetPasswordEmail } from './send-reset-password-email';
import { sendVerificationEmail } from './send-verification-email';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            void sendResetPasswordEmail({
                to: user.email,
                subject: 'Reset your password',
                url,
            });
        },
    },
    rateLimit: {
        enabled: true,
        window: 10,
        max: 2,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({
                to: user.email,
                verificationUrl: url,
                userName: user.name,
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            prompt: 'select_account',
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },

    plugins: [
        admin({
            ac,
            roles,
            defaultRole: 'user',
            adminRoles: ['admin', 'superadmin'],
        }),
        nextCookies(),
        twoFactor({
            skipVerificationOnEnable: true,
            otpOptions: {
                async sendOTP({ user, otp }) {
                    sendOtpEmail({ to: user.email, otp });
                },
            },
        }),
    ],
});
