  import NextAuth from 'next-auth';
  import CredentialsProvider from 'next-auth/providers/credentials';
  import { PrismaAdapter } from '@auth/prisma-adapter';
  import { prisma } from '@/db/prisma';
  import { compareSync } from 'bcrypt-ts';
  import type { NextAuthConfig } from 'next-auth';
  import { cookies } from 'next/headers';
  import { NextResponse } from 'next/server';


  export const config = {
    pages: {
      signIn: '/sign-in',
      error: '/sign-in', // Error code passed in query string as ?error=
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        credentials: {
          email: { type: 'email' },
          password: { type: 'password' },
        },
        async authorize(credentials) {
          if (credentials == null) return null;

          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email as string,
            },
          });

          if (user && user.password) {
            const isMatch = compareSync(
              credentials.password as string,
              user.password
            );

            if (isMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
          return null;
        },
      }),
    ],
    callbacks: {
      async session({ session, user, trigger, token }: any) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;

        if (trigger === 'update') {
          session.user.name = user.name;
        }

        return session;
      },
      async jwt({ token, user, trigger, session }: any) {
        if (user) {
          token.id =user.id;
          token.role = user.role;

          if (user.name === 'NO_NAME') {
            token.name = user.email!.split('@')[0];

            await prisma.user.update({
              where: { id: user.id },
              data: { name: token.name },
            });
          } 
        }
        if(trigger === 'signIn' || trigger === 'signUp'){
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;
          if(sessionCartId){
            const sessionCart =await prisma.cart.findFirst({
              where:{sessionCartId}
            });
            if (sessionCart){
              //delete current user cart
              await prisma.cart.deleteMany({
                where :{userId: user.id}
              });
              //Assign new cart
              await prisma.cart.update({
                where:{id: sessionCart.id},
                data:{userId: user.id}
              })
            }
          }
        }
        if (session?.user.name && trigger === 'update'){
          token.name = session.user.name;
        }
        return token;
      },
      authorized({request, auth}: any) {
        // Array of regex patterns of paths we want to  protect
        const protectedPaths = [
          /\/shipping-address/,
          /\/payment-method/,
          /\/place-order/,
          /\/profile/,
          /\/user\/(.*)/,
          /\/order\/(.*)/,
          /\/profile/,

        ];
        //Get pathName from the req URL object

        const {pathname} = request.nextUrl;

        //Check if user is not authenticated and accessing a protected path
        if(!auth && protectedPaths.some((p) => p.test(pathname))) return false;



        //check for session cart cookie
        if (!request.cookies.get('sessionCartId')) {
          const sessionCartId = crypto.randomUUID();
          //clone the request cookies
            const newRequestHeaders = new Headers(request.headers);
            //Create a new response and add the new headers
            const response = NextResponse.next({
              request: {
                headers: newRequestHeaders
              }
            });
            //Set the sessionCartId cookie
            response.cookies.set('sessionCartId', sessionCartId);
            return response;

        }else {
          return true;
        }
      } 

    },
  } satisfies NextAuthConfig;

  export const { handlers, auth, signIn, signOut } = NextAuth(config);
