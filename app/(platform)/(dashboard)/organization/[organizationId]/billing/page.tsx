import { checkSubscription } from "@/lib/subscription";
import { Info } from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { SubscriptionButton } from "./_components/subscription-button";

const BillingPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro}></Info>
      <Separator className="my-2"></Separator>
      <SubscriptionButton
        isPro={isPro}
      ></SubscriptionButton>
    </div>
  );
};

export default BillingPage;
