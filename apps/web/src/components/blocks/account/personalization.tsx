"use client";

import { personalize } from "@/auth/actions";
import { Personalizable, Personalizables } from "@/auth/definitions";
import useSession from "@/components/hooks/use-session";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputPhone } from "@/components/ui/input-phone";
import { Label } from "@/components/ui/label";
import { cn } from "@/components/utils";
import config from "@repo/config";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  ComponentProps,
  useActionState,
  useEffect,
  useState,
} from "react";

type UserField = {
  field: Personalizable;
  value: string | undefined;
  editable: boolean;
};

export default function AccountPersonalization({
  className,
  email,
  phone,
  ...props
}: { email: string; phone: string | null } & ComponentProps<"div">) {
  const { profile } = useSession();
  const t = useTranslations("AccountPage");

  const userFields: UserField[] = [
    { field: "email" as Personalizable, value: email, editable: false },
    { field: "phone", value: phone || undefined, editable: true },
    { field: "name", value: profile?.name, editable: true },
    { field: "username", value: profile?.username, editable: true },
  ];

  return (
    <Card
      id="personalization"
      className={cn(
        "flex w-full h-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[1vw] lg:py-[5vh] p-0 gap-8 shadow-none lg:shadow-sm",
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>{t("personalizationTitle")}</CardTitle>
        <CardDescription>
          {t("personalizationDescription", { brand: config.name })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-3">
        {userFields.map((field) => (
          <ListItem
            key={field.field}
            field={field.field}
            value={field.value}
            editable={field.editable}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ListItem({
  field,
  value,
  editable,
  className,
  ...props
}: ComponentProps<"div"> & UserField) {
  const t = useTranslations("Auth");
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-full gap-4" + className
      )}
      {...props}
    >
      <div className="flex flex-col flex-2 gap-1 h-full w-full">
        <Label htmlFor={field} className="text-muted-foreground">
          {t(`${field}Label`)}
        </Label>
        <div id={field} className="text-left">
          {value ? (field === "username" ? `@${value}` : value) : t("none")}
        </div>
      </div>
      <div className="flex flex-col lg:flex-1 gap-1 h-full">
        <ListItemEdit field={field} value={value} editable={editable} />
      </div>
    </div>
  );
}

function ListItemEdit({
  field,
  value,
  editable,
  className,
  ...props
}: ComponentProps<"div"> & UserField) {
  const t = useTranslations("Auth");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [state, action, pending] = useActionState(
    personalize.bind(null, field),
    undefined
  );

  const [formData, setFormData] = useState({
    [field]: value || "",
  });

  useEffect(() => {
    if (pending) setSubmitting(true);
    if (!submitting || pending) return;
    if (!state) setOpen(false);
    setSubmitting(false);
  }, [pending, state, submitting]);

  useEffect(() => {
    if (open) {
      setFormData({ [field]: value || "" });
    }
  }, [open, field, value]);

  if (!Personalizables[field] || !editable) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <div>
          <Button
            variant={"outline"}
            className="w-full not-lg:hidden"
            onClick={() => setOpen(true)}
            disabled={!editable}
          >
            {t("edit")}
          </Button>
          <Button
            variant={"ghost"}
            className="lg:hidden"
            onClick={() => setOpen(true)}
            disabled={!editable}
          >
            <Pencil />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <form action={action} className="flex flex-col gap-4">
          <DialogHeader className="text-center">
            <DialogTitle>{t(`${field}ChangeTitle`)}</DialogTitle>
            <DialogDescription>
              {t(`${field}ChangeDescription`)}
            </DialogDescription>
          </DialogHeader>
          <div className={cn("flex flex-col gap-2", className)} {...props}>
            <Label htmlFor={field}>{t(`${field}Label`)}</Label>
            {field === "phone" ? (
              <InputPhone
                id={field}
                name={field}
                placeholder={t(`${field}Placeholder`)}
                value={formData[field]}
                onChange={handleChange}
              />
            ) : (
              <Input
                id={field}
                name={field}
                type="text"
                placeholder={t(`${field}Placeholder`)}
                value={formData[field]}
                onChange={handleChange}
              />
            )}
            {state?.errors?.[field] && (
              <Alert variant="destructive">
                <AlertDescription>{state.errors[field][0]}</AlertDescription>
              </Alert>
            )}
            {state?.message && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="w-full">
            <div className="flex flex-row gap-2 w-full">
              <DialogClose asChild>
                <Button
                  aria-disabled={pending}
                  type="button"
                  className="mt-2 w-full  flex-1"
                  size={"lg"}
                  variant={"secondary"}
                >
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button
                aria-disabled={pending}
                type="submit"
                className="mt-2 w-full flex-1"
                size={"lg"}
                variant={"secondary"}
              >
                {pending ? t("submitting") : t("submit")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
