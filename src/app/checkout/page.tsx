import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAddressesByUserId } from "@/services/addressService";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/checkout');
    }

    const addresses = await getAddressesByUserId(session.user.id);

    return <CheckoutClient addresses={addresses} />;
}