"use server";
import { cookies } from "next/headers";

export async function acceptAllCookies() {
  // const cookieStore = cookies()
  // const all = cookieStore.get('_all')

  // if (!all) {
  //   cookieStore.set('_all', true, {
  //     maxAge: 60 * 60 * 24 * 365,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'strict',
  //   })
  // }
  return { message: "Sve kolačiće ste prihvatili.", ok: true };
}

export async function checkCookies() {
  const cookieStore = await cookies();
  const all = cookieStore.get("_ga");

  if (!all) {
    return { message: "Kolačići nisu prihvaćeni.", all: false };
  }
  return { message: "Kolačići su prihvaćeni.", all: true };
}
