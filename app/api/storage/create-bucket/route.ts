import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { bucketName, isPublic = true } = await request.json()

    if (!bucketName) {
      return NextResponse.json({ error: "Bucket name is required" }, { status: 400 })
    }

    // Create a Supabase client with service role key for admin operations
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
    })

    if (error) {
      console.error("Error creating bucket:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Bucket '${bucketName}' created successfully`,
      data,
    })
  } catch (error: any) {
    console.error("Error in create-bucket API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
