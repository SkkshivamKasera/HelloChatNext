import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@components/ToasterContext";
import Provider from "@components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Auth Hello Chat",
    description: "",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-purple-1`}>
                <Provider>
                    {children}
                    <ToasterContext />
                </Provider>
            </body>
        </html>
    );
}
