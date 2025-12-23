import { RequestPasswordForm } from '@/components/request-password-form';
import { ResetPasswordForm } from '@/components/reset-password-form';
import { authIsNotRequired } from '@/lib/auth-utils';

export default async function ResetPassword() {
    await authIsNotRequired();

    return <ResetPasswordForm />;
}
