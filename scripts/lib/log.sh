#!/usr/bin/env bash

log() {
  local level="$1" color="$2" message="$3"
  if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
    printf '\033[%sm[%s]\033[0m %s\n' "$color" "$level" "$message"
  else
    printf '[%s] %s\n' "$level" "$message"
  fi
}
