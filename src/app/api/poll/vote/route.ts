import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { optionId }: { optionId: string } = await req.json();

    await prisma.option.update({
      where: {
        id: optionId,
      },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for voting!",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
};
