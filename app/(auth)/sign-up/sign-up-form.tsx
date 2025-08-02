"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link"; 
import { useActionState} from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser,{
    success: false,
    message: ''
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () =>{
    const { pending} = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  }
  return (
    <form action ={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Enter your email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div  className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div  className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Enter your confirm password"
            required
            autoComplete="current-confirm password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
         {data && !data.success && (
          <div className="text-red-500 text-sm text-center">
            {data.message}
          </div>
         )}
        </div>
        <div>
          <SignUpButton />
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="link underline hover:text-primary">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
