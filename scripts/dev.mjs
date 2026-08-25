import { spawn } from 'node:child_process'

function run(command, args, extra = {}) {
  const child = spawn(command, args, { stdio: 'inherit', shell: true, ...extra })
  child.on('exit', (code) => {
    if (code) process.exit(code ?? 1)
  })
  return child
}

run('npm', ['run', 'dev', '--prefix', 'backend'])
run('npm', ['run', 'dev', '--prefix', 'frontend'])
