import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials) {
                try {
                    const user = JSON.parse(credentials.user);
                    const accessToken = credentials.accessToken;

                    if (!user || !accessToken) {
                        throw new Error("Invalid user or token data.");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        full_name: user.full_name,
                        roles: user.roles,
                        stationId: user.stationId,
                        divisionId: user.divisionId,
                        warehouseIds: user.warehouseIds,
                        accessToken: accessToken,
                    };
                } catch (error) {
                    console.error('Error in authorize:', error);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    roles: user.roles,
                    stationId: user.stationId,
                    divisionId: user.divisionId,
                    warehouseIds: user.warehouseIds,
                };
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };