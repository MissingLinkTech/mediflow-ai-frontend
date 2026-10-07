import { spawn } from "node:child_process";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const command = process.argv[2] === "start" ? "start" : "dev";
const port = process.env.PORT || "5080";
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", command, "-p", port], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
