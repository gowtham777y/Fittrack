import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM members ORDER BY created_at DESC'
    );
    return NextResponse.json({ success: true, members: result.rows });
  } catch (error) {
    return NextResponse.json({ 
      success: false, error: String(error) 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, start_date, end_date } = await request.json();
    
    const qr_code = `QR-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const result = await query(
      `INSERT INTO members (name, email, qr_code, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, qr_code, start_date, end_date]
    );

    return NextResponse.json({ 
      success: true, 
      member: result.rows[0] 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, error: String(error) 
    }, { status: 500 });
  }
}