import config from "@repo/config";
import parsePhoneNumberFromString, {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  NationalNumber,
} from "libphonenumber-js";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ComponentProps, useMemo, useRef } from "react";
import { cn } from "../utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const countries = getCountries();

function InputPhone({
  className,
  value = "",
  onChange,
  ...props
}: ComponentProps<"input"> & { value?: string }) {
  const t = useTranslations("Countries");
  const translatedCountries = useMemo(
    () =>
      [...countries].sort((a, b) => {
        return t(a).localeCompare(t(b));
      }),
    [t]
  );

  const parsed = useMemo(
    () => (value ? parsePhoneNumberFromString(value) : undefined),
    [value]
  );

  const country = (parsed?.country as CountryCode | undefined) ?? "US";
  const national =
    (parsed?.nationalNumber as NationalNumber | undefined) ??
    ("" as NationalNumber);

  const inputRef = useRef<HTMLInputElement>(null);

  const triggerOnChange = (newNumber: string) => {
    if (!onChange || !inputRef.current) return;
    const syntheticEvent = {
      target: {
        ...inputRef.current,
        value: newNumber,
      },
      currentTarget: inputRef.current,
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleCountryChange = (newCountry: CountryCode | null) => {
    if (!newCountry || !national) return;
    const newFullNumber = `+${getCountryCallingCode(newCountry)}${national}`;
    triggerOnChange(newFullNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNational = e.target.value.replace(/\D/g, "") as NationalNumber;

    if (newNational) {
      const newFullNumber = `+${getCountryCallingCode(country)}${newNational}`;
      triggerOnChange(newFullNumber);
    } else {
      triggerOnChange("");
    }
  };

  const callingCode = getCountryCallingCode(country);
  const { name, ...restProps } = props;

  return (
    <>
      <InputGroup className={cn(className)}>
        <InputGroupAddon align="inline-start" className="pl-1.5 my-0">
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="border-0 bg-transparent shadow-none">
              <SelectValue>
                <span className="flex flex-row gap-1.5">
                  <Image
                    src={`${config.urls.cdn}/flags/${country.toLowerCase()}.svg`}
                    alt={country}
                    width={20}
                    height={20}
                  />
                  <InputGroupText>+{callingCode}</InputGroupText>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {translatedCountries.map((country) => {
                const code = getCountryCallingCode(country);
                return (
                  <SelectItem key={country} value={country}>
                    <span className="flex flex-row gap-1.5">
                      <Image
                        src={`${config.urls.cdn}/flags/${country.toLowerCase()}.svg`}
                        alt={country}
                        width={20}
                        height={20}
                      />
                      <span className="text-muted-foreground w-10 text-end">
                        +{code}
                      </span>
                      <span className="text-muted-foreground">
                        {t(country)}
                      </span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="tel"
          value={national}
          onChange={handleInputChange}
          placeholder="Phone number"
          {...restProps}
        />
      </InputGroup>
      {name && <input type="hidden" name={name} value={value} />}
    </>
  );
}

export { InputPhone };
