import "xterm/css/xterm.css"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"

const ODE_ASCII_ART = [
  "    ██████╗ ██████╗ ███████╗",
  "   ██╔═══██╗██╔══██╗██╔════╝",
  "   ██║   ██║██║  ██║█████╗",
  "   ██║   ██║██║  ██║██╔══╝",
  "   ╚██████╔╝██████╔╝███████╗",
  "    ╚═════╝ ╚═════╝ ╚══════╝",
  "  Observatoire des Éphéméries"
];

const COLORS = {
  logo: '\x1b[36m',     // cyan for logo
  title: '\x1b[96m',    // light cyan for title
  reset: '\x1b[0m'      // reset color
}

const TerminalHook = {
  showWelcomeMessage() {
    // Top padding
    this.term.writeln('')
    // Draw the ASCII art
    for (const [i, line] of ODE_ASCII_ART.entries()) {
      const color = i === ODE_ASCII_ART.length - 1 ? COLORS.title : COLORS.logo
      this.term.writeln(`${color}${line}${COLORS.reset}`)
    }
    // Bottom padding
    this.term.writeln('')
  },

  mounted() {
    this.term = new Terminal({
      cursorBlink: true,
      fontFamily: "Iosevka",
      fontSize: 16,
      theme: {
        background: '#000000',    // Pure black background
        foreground: '#ffffff',    // White text
        cursor: '#ffffff',        // White cursor
      }
    })

    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)

    this.term.open(this.el)
    this.fitAddon.fit()

    this.showWelcomeMessage()

    this.term.focus()

    // Send terminal input to LiveView
    // this.term.onData(data => {
    //   this.pushEvent("terminal-input", { data })
    // })

    // Handle terminal output from LiveView
    // this.handleEvent("terminal-output", ({ data }) => {
    //   this.term.write(data)
    // })
  },

  destroyed() {
    if (this.term) {
      this.term.dispose()
    }
  }
}

export default TerminalHook
