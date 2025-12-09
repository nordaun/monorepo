import { verifySession } from "@/auth/sessions";
import { t } from "@/chat/actions";
import { ChatReturn } from "@/chat/definitions";
import config from "@repo/config";
import prisma from "@repo/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = await params;
  if (!chatId) return NextResponse.json(t("chatInvalid"), { status: 400 });

  const session = await verifySession();
  if (!session?.userId)
    return NextResponse.json(t("sessionInvalid"), { status: 401 });

  const url = new URL(req.url);
  const from = parseInt(url.searchParams.get("from") || "0", 10);
  const count = config.lengths.messageChunk;

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    skip: from,
    take: count,
    select: ChatReturn,
  });

  if (!messages) return NextResponse.json(t("sessionInvalid"), { status: 401 });
  return NextResponse.json(messages.reverse(), { status: 200 });
}
