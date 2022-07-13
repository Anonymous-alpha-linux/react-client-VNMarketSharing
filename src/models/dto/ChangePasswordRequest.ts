export type ChangePasswordRequest = {
   email: string;
   token: string;
   returnUrl?: string;
   password: string;
   confirmPassword: string;
};
