import fs from "node:fs/promises";

const response = await fetch("http://localhost:3100/");
const html = await response.text();
const output = new URL("../tmp/verify-output.html", import.meta.url);
await fs.mkdir(new URL("../tmp/", import.meta.url), { recursive: true });
await fs.writeFile(output, html.replace(/></g, ">\n<"));
const staleLinks = [...html.matchAll(/(?:href|src)="[^"]*\.html[^"]*"/g)].map(match => match[0]);
console.log(JSON.stringify({ status: response.status, output: output.pathname, staleLinks }, null, 2));
if (!response.ok || staleLinks.length) process.exitCode = 1;
