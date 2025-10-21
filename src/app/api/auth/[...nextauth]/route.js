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
                    // This is correct.
                    // credentials.user is the JSON string
                    // credentials.accessToken is the token string
                    const user = JSON.parse(credentials.user);
                    const accessToken = credentials.accessToken;

                    if (!user || !accessToken) {
                        throw new Error("Invalid user or token data received from login page.");
                    }

                    // This maps your API response fields
                    const userPayload = {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        roles: user.roles,
                        accessToken: accessToken, // Pass the token to the jwt callback
                    };

                    console.log('Successfully authorized. Returning user payload:', userPayload);
                    return userPayload;

                } catch (error) {
                    console.error('Error in authorize callback:', error);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: false,
    callbacks: {
        async jwt({ token, user, account }) {
            console.log('--- 2. JWT CALLBACK ---');
            console.log('Received - token:', token);
            console.log('Received - user:', user);
            console.log('Received - account:', account);

            // This block runs on initial sign-in
            if (user) {
                console.log('Initial sign-in: `user` object is present.');
                
                // This is also correct.
                // It saves your user data into the 'token.user' object
                token.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles,
                };
                
                // This is also correct.
                // It saves your API token into 'token.accessToken'
                if (user.accessToken) { 
                    console.log('Saving accessToken from credentials into the token.');
                    token.accessToken = user.accessToken;
                }
            }

            // Handle OAuth
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

            // This is also correct.
            // It passes the data from the JWT token to the client-side session.
            if (token) {
                session.user = token.user; // { id, email, name, roles }
                session.accessToken = token.accessToken; // Your API JWT
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