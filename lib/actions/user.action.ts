'use server';

import { signInFormSchema, signUpFormSchema } from "@/lib/constants/validators";
import { signIn, signOut } from '@/auth';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync} from "bcrypt-ts";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

// Đăng nhập với credentials (email & password)
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    // Validate dữ liệu từ form bằng zod schema
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // Gọi hàm signIn từ NextAuth, sử dụng provider 'credentials'
    await signIn('credentials', user);

    return { success: true, message:' Signed in successfully' };

  } catch (error) {
    // Nếu là lỗi redirect, thì throw lại (bắt buộc trong Next.js 13/14 khi sử dụng server action)
    if (isRedirectError(error)) {
      throw error;
    }

    // Trường hợp còn lại: có thể là lỗi xác thực, lỗi từ zod, hoặc lỗi khác
    return { success: false, message: "Invalid email or password" };
  }
}

// Đăng xuất người dùng
export async function signOutUser() {
  // Hàm signOut cần viết đúng chữ thường: signOut (không phải SignOut)
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    // Parse form
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Mã hóa mật khẩu
    const plainPassword = user.password;
   user.password = hashSync(user.password, 10);
    // Lưu user vào DB
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: 'Signed up successfully' };
  } catch (error) {
  
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}
export async function getUserById(iserId:string){
  const user = await prisma.user.findFirst({
    where :{id:userId},
  });
  if(!user) throw new Error('User not found');
  return user;
}