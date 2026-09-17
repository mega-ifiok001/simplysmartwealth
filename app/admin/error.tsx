"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return <main><h1>Administration is temporarily unavailable</h1>
    <p>Please check that the database and authentication environment variables are configured and migrations have been applied.</p>
    <button type="button" onClick={reset}>Try again</button></main>;
}
