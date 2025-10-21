import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials) {
                console.log('--- 1. AUTHORIZE CALLBACK ---');
                console.log('Received credentials:', credentials);

                try {
                    const user = JSON.parse(credentials.user);

                    // This is the object that will be passed as the `user` parameter to the `jwt` callback.
                    const userPayload = {
                        id: user.id.toString(),
                        email: user.email,
                        firstName: user.customerProfile?.firstName,
                        lastName: user.customerProfile?.lastName,
                        mobileNumber: user.customerProfile?.mobileNumber,
                        accountType: user.accountType,
                        // IMPORTANT: We are attaching the tokens from the credentials to this object.
                        accessToken: credentials.accessToken,
                        refreshToken: credentials.refreshToken,
                    };

                    console.log('Successfully authorized. Returning user payload:', userPayload);
                    return userPayload;

                } catch (error) {
                    console.error('Error in authorize callback:', error);
                    return null; // Returning null will reject the sign-in.
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: false, // Set to false to avoid noisy default logs and focus on our custom ones.
    callbacks: {
        async jwt({ token, user, account }) {
            console.log('--- 2. JWT CALLBACK ---');
            // The `user` and `account` parameters are only available on the initial sign-in.
            console.log('Received - token:', token);
            console.log('Received - user:', user);
            console.log('Received - account:', account);

            // This block runs on initial sign-in to persist data to the token.
            if (user) {
                console.log('Initial sign-in: `user` object is present.');
                // For credentials, `user` is the object returned from `authorize`.
                // For OAuth, `user` is the profile data from the provider.
                token.user = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accountType: user.accountType,
                    mobileNumber: user.mobileNumber
                };
            }

            // Handle access token for Credentials provider
            if (user && user.accessToken) {
                console.log('Saving accessToken from credentials into the token.');
                token.accessToken = user.accessToken;
            }

            // Handle access token for OAuth providers
            if (account && account.access_token) {
                console.log('Saving access_token from OAuth provider into the token.');
                token.accessToken = account.access_token;
                token.provider = account.provider;
            }

            console.log('Returning final token:', token);
            return token;
        },

        async session({ session, token }) {
            console.log('--- 3. SESSION CALLBACK ---');
            console.log('Received token from JWT callback:', token);

            // The token contains all the data we saved in the `jwt` callback.
            // We now send the properties we want to the client-side session object.
            if (token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
                session.provider = token.provider;
            }

            console.log('Returning final session object to the client:', session);
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
