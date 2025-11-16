import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const { title, category, isToday } = await request.json();

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        category,
        isToday: isToday ?? true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// GET /api/tasks - Fetch all tasks grouped by Today/Everything Else
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    const today = tasks.filter((task: any) => task.isToday);
    const everythingElse = tasks.filter((task: any) => !task.isToday);

    return NextResponse.json({
      today,
      everythingElse,
      total: tasks.length,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
