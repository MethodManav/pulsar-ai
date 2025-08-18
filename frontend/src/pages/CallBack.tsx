import axios from "axios";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CallbackLoading() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const exchangeToken = async () => {
      try {
        const queryParameter = new URLSearchParams(window.location.search);
        const code = queryParameter.get("code");
        const state = queryParameter.get("state");
        const provider = queryParameter.get("provider");


        if (code && state && provider) {
          const response = await axios.post(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/auth/callback?code=${encodeURIComponent(
              code
            )}&state=${encodeURIComponent(state) ?? ""}&provider=${encodeURIComponent(
              provider
            )}`,
            {},
            {
              headers: {
                "x-auth-token": localStorage.getItem("access_Token"),
              },
            }
          );

          if (response.status === 200 && response.data.access_Token) {
            localStorage.setItem("access_Token", response.data.access_Token);
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        } else {
          setError(
            "Authentication parameters are missing. Please try signing in again."
          );
          setIsLoading(false);
        }
      } catch (err) {
        setError(
          "Something went wrong during authentication. Please try again."
        );
        setIsLoading(false);
      }
    };

    exchangeToken();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.location.href = "https://pulsar-ai-red.vercel.app/";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground text-lg">{error}</p>
            <p className="text-sm text-muted-foreground">
              Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
            </p>
          </div>
          <Button
            onClick={() =>
              (window.location.href = "https://pulsar-ai-red.vercel.app/")
            }
            className="w-full"
          >
            Return to Application Now
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Configuring Application
            </h2>
            <p className="text-muted-foreground text-lg">
              Please wait while we set things up for you...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Configuration Complete!
          </h2>
          <p className="text-muted-foreground text-lg">
            Redirecting you now...
          </p>
        </div>
      </div>
    </div>
  );
}
