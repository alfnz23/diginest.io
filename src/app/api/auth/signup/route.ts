import { getSupabaseClient } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  userId?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    // Krok 1 - Přečtení těla a validace
    const body: SignupRequest = await request.json();
    
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const fullName = body.fullName?.trim();

    // Validace vstupních dat
    if (!email || !email.includes("@")) {
      console.log("Signup validation failed: invalid email");
      return NextResponse.json(
        { success: false, error: "Validace selhala: E-mail musí být platný a obsahovat @" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      console.log("Signup validation failed: password too short");
      return NextResponse.json(
        { success: false, error: "Validace selhala: Heslo musí mít alespoň 8 znaků" },
        { status: 400 }
      );
    }

    if (!fullName || fullName.length === 0) {
      console.log("Signup validation failed: missing full name");
      return NextResponse.json(
        { success: false, error: "Validace selhala: Jméno je povinné" },
        { status: 400 }
      );
    }

    // Krok 2 - Vytvoření Supabase klienta
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Supabase client not available - environment variables not configured");
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    // Krok 3 - Volání Supabase Auth signUp
    console.log(`Attempting signup for email: ${email}`);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      console.error("Supabase signup error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Krok 4 - Odpověď klientovi
    console.log(`Signup successful for user: ${data.user?.id}`);
    
    return NextResponse.json({
      success: true,
      message: "Signup successful. Check your email to confirm your account.",
      userId: data.user?.id
    }, { status: 200 });

  } catch (error) {
    // Krok 5 - Obecný error handling
    console.error("Unexpected error during signup:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected error during signup" },
      { status: 500 }
    );
  }
}

// Metoda GET pro health check
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ 
    message: "Signup endpoint is ready",
    timestamp: new Date().toISOString()
  });
}