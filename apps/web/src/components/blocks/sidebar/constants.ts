"use client";

import {
  Bell,
  BookText,
  Globe,
  Info,
  LockKeyhole,
  LucideProps,
  Send,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface NavElement {
  title: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const business: NavElement[] = [
  {
    title: "main",
    href: "/business/main",
    icon: Store,
  },
  {
    title: "team",
    href: "/business/team",
    icon: UsersRound,
  },
  {
    title: "site",
    href: "/business/site",
    icon: Globe,
  },
];

export const personal: NavElement[] = [
  {
    title: "messages",
    href: "/messages",
    icon: Send,
  },
  {
    title: "notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "account",
    href: "/account",
    icon: UserRound,
  },
  {
    title: "guides",
    href: "/guides",
    icon: BookText,
  },
  {
    title: "help",
    href: "/help",
    icon: Info,
  },
];

export const profile: NavElement[] = [
  {
    title: "account",
    href: "/account",
    icon: UserRound,
  },
  {
    title: "notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "privacy",
    href: "/account#privacy",
    icon: LockKeyhole,
  },
];

export const routes: NavElement[] = [...business, ...personal, ...profile];
