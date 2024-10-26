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
      fontFamily: "Iosevka, monospace",
      fontSize: 16,
      theme: {                    // Original Catppuccin theme
        background: '#292c3c',    // Mantle
        foreground: '#c6d0f5',    // Text
        cursor: '#f2d5cf',        // Rosewater
        black: '#292c3c',         // Mantle
        red: '#e78284',
        green: '#a6d189',
        blue: '#8caaee',
        magenta: '#f4b8e4',       // Pink
        cyan: '#99d1db',          // Sky
        white: '#c6d0f5',
        brightBlack: '#626880',   // Surface2
        brightRed: '#e78284',
        brightGreen: '#a6d189',
        brightBlue: '#8caaee',
        brightMagenta: '#f4b8e4', // Pink
        brightCyan: '#99d1db',    // Sky
        brightWhite: '#c6d0f5',
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
