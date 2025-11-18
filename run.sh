#!/bin/bash
# deno shell setup; adapted from rustup
# affix colons on either side of $PATH to simplify matching
case ":${PATH}:" in
    *:"/home/tijme/.deno/bin":*)
        ;;
    *)
        # Prepending path in case a system-installed deno executable needs to be overridden
        export PATH="/home/tijme/.deno/bin:$PATH"
        ;;
esac
cd $(dirname $0)
deno run dev
cd --
