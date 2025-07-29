import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fetchCountries, type Country } from "./countryService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        reset();
        setIsOtpSent(false);
      }, 1000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-4 p-4 mx-auto"
    >
      <div>
        <label>Country</label>
        {selected && (
          <img
            src={selected.flag}
            alt={`${selected.name} flag`}
            className="h-5 w-7 mt-1"
          />
        )}
        <select {...register("country")} className="w-full p-2 border rounded">
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label>Phone Number</label>
        <div className="flex items-center gap-2">
          <span className="min-w-[60px] border rounded px-2 py-1">
            {watch("dialCode") || "+--"}
          </span>
          <Input type="tel" placeholder="Enter phone" {...register("phone")} />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {isOtpSent && (
        <div>
          <label>OTP</label>
          <Input
            placeholder="123456"
            {...register("otp", { required: true })}
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        {isOtpSent ? "Verify OTP" : "Send OTP"}
      </Button>
    </form>
  );
}
