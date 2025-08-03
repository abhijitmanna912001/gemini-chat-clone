import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fetchCountries, type Country } from "./countryService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";

const phoneSchema = z.object({
  country: z.string().min(1, "Country required"),
  dialCode: z.string(),
  phone: z.string().min(8, "Invalid number"),
  otp: z.string().optional(),
});

type FormData = z.infer<typeof phoneSchema>;

export default function PhoneLoginForm() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const authLogin = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      country: "",
      dialCode: "",
      phone: "",
      otp: "",
    },
  });

  const selectedCountryCode = watch("country");
  const selected = countries.find((c) => c.code === selectedCountryCode);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  useEffect(() => {
    const selected = countries.find((c) => c.code === selectedCountryCode);
    if (selected) {
      setValue("dialCode", selected.dialCode);
    }
  }, [selectedCountryCode, countries, setValue]);

  const onSubmit = (data: FormData) => {
    if (!isOtpSent) {
      toast("Sending OTP...");
      setTimeout(() => {
        toast.success("OTP sent to your phone!");
        setIsOtpSent(true);
      }, 1000);
    } else {
      toast("Verifying OTP...");
      setTimeout(() => {
        toast.success("Logged in successfully!");
        authLogin({
          id: crypto.randomUUID(),
          email: `${data.phone}@mock.com`, // temporary email from phone
          phone: data.phone,
          dialCode: data.dialCode,
          country: data.country,
        });
        reset();
        setIsOtpSent(false);
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Country Selection */}
      <div className="space-y-1">
        <label htmlFor="country" className="block text-sm font-medium">Country</label>
        <div className="relative">
          {selected && (
            <img
              src={selected.flag}
              alt={`${selected.name} flag`}
              className="h-4 w-6 absolute top-2 left-2 pointer-events-none"
            />
          )}
          <select
            id="country"
            {...register("country")}
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>
        {errors.country && (
          <p className="text-sm text-destructive">{errors.country.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
        <div className="flex gap-2">
          <span className="min-w-[65px] py-2 px-2 border rounded-md bg-muted text-muted-foreground text-center">
            {watch("dialCode") || "+--"}
          </span>
          <Input id="phone" type="tel" placeholder="Enter phone" {...register("phone")} />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* OTP Field */}
      {isOtpSent && (
        <div className="space-y-1">
          <label htmlFor="otp" className="block text-sm font-medium">OTP</label>
          <Input id="otp" placeholder="123456" {...register("otp")} />
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        {isOtpSent ? "Verify OTP" : "Send OTP"}
      </Button>
    </form>
  );
}
