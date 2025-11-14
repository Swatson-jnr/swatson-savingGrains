import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Inventory, { IInventory } from "@/lib/models/inventory"

async function getInventorySummary() {
  await connectDB()
  const items = (await Inventory.find(
    {},
    { weight: 1, status: 1 },
  ).lean()) as unknown as IInventory[]
  const totalWeight = items.reduce(
    (sum: number, item: IInventory) => sum + (item.weight || 0),
    0,
  )
  const weightOnField = items
    .filter((item: IInventory) => item.status === "on_field")
    .reduce((sum: number, item: IInventory) => sum + (item.weight || 0), 0)
  return { totalWeight, weightOnField }
}

export async function GET() {
  try {
    const summary = await getInventorySummary()
    return NextResponse.json(summary)
  } catch (error) {
    // Log the error for debugging while keeping the response generic
    console.error("Inventory summary error:", error)
    return NextResponse.json(
      { error: "Failed to fetch inventory summary" },
      { status: 500 },
    )
  }
}

