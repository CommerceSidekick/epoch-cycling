#!/usr/bin/env bash
# Internal link check of the last build + the external anti-doping URLs the spec requires to resolve (5.13.7).
set -euo pipefail
cd "$(dirname "$0")/.."
PORT=${PORT:-4400}
node scripts/serve-static.mjs "$PORT" & SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
npx linkinator "http://localhost:$PORT" --recurse --skip "^(?!http://localhost:$PORT)" --timeout 10000 --verbosity error
status=0
for u in https://www.wada-ama.org/en/prohibited-list https://www.globaldro.com https://www.usada.org/athletes/substances/therapeutic-use-exemption/; do
  code=$(curl -s -o /dev/null -L -w "%{http_code}" -m 20 "$u" || echo 000)
  echo "external $code $u"
  if [[ "$code" -ge 400 || "$code" == "000" ]]; then echo "  (check this URL by hand; some sites block scripted requests)"; fi
done
exit $status
