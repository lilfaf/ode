import "xterm/css/xterm.css"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"

const ODE_ASCII_ART = [
  "  ██████╗ ██████╗ ███████╗",
  " ██╔═══██╗██╔══██╗██╔════╝",
  " ██║   ██║██║  ██║█████╗",
  " ██║   ██║██║  ██║██╔══╝",
  " ╚██████╔╝██████╔╝███████╗",
  "  ╚═════╝ ╚═════╝ ╚══════╝",
  " Observatoire des Éphéméries"
];

const COLORS = {
  logo: '\x1b[36m',     // cyan for logo
  title: '\x1b[96m',    // light cyan for title
  reset: '\x1b[0m'      // reset color
}

class Box {
  constructor(term, options = {}) {
    this.term = term;
    this.minWidth = options.minWidth || 40;
    this.maxWidth = options.maxWidth || term.cols - 2; // Account for margins
    this.content = [];
    this.padding = options.padding || 1;
    this.currentWidth = this.minWidth;

    // ANSI colors
    this.RED = '\x1b[31m';
    this.RESET = '\x1b[0m';

    // Box characters
    this.chars = {
      topLeft: '┌',
      topRight: '┐',
      bottomLeft: '└',
      bottomRight: '┘',
      horizontal: '─',
      vertical: '│'
    };

    // Initial render
    this.drawBox();
  }

  // Calculate optimal width based on content
  calculateOptimalWidth() {
    if (this.content.length === 0) return this.minWidth;

    const maxContentWidth = Math.max(
      ...this.content.map(line => line.length)
    );

    // Add padding and border space
    const optimalWidth = maxContentWidth + (this.padding * 2) + 2;

    // Constrain between min and max width
    return Math.min(
      Math.max(optimalWidth, this.minWidth),
      this.maxWidth
    );
  }

  // Add new text to the box with word wrapping
  appendText(text) {
    const words = text.split(' ');
    let currentLine = this.content.length > 0 ? this.content.pop() : '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const effectiveWidth = this.maxWidth - (this.padding * 2) - 2;

      if (testLine.length <= effectiveWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          this.content.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      this.content.push(currentLine);
    }

    // Update box width based on new content
    this.currentWidth = this.calculateOptimalWidth();
    this.redraw();
  }

  // Clear previous box and redraw
  redraw() {
    // Clear previous box by moving cursor up
    const boxHeight = this.content.length + 2; // content lines + top/bottom borders
    this.term.write('\x1b[' + boxHeight + 'A'); // Move cursor up
    this.term.write('\x1b[G'); // Move to start of line

    this.drawBox();
  }

  // Draw the box with current content
  drawBox() {
    const width = this.currentWidth;

    // Top border
    this.term.write(
      `${this.RED}${this.chars.topLeft}${this.chars.horizontal.repeat(width - 2)}${this.chars.topRight}\n\r`
    );

    // Content area
    for (const line of this.content) {
      const padding = ' '.repeat(this.padding);
      const remainingSpace = width - line.length - (this.padding * 2) - 2;
      this.term.write(
        `${this.chars.vertical}${padding}${line}${' '.repeat(Math.max(0, remainingSpace))}${padding}${this.chars.vertical}\n\r`
      );
    }

    // Bottom border
    this.term.write(
      `${this.chars.bottomLeft}${this.chars.horizontal.repeat(width - 2)}${this.chars.bottomRight}${this.RESET}\n\r`
    );
  }
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
      fontFamily: 'Iosevka',
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

    const box = new Box(this.term, {
      minWidth: 40,
      maxWidth: this.term.cols - 2,
      padding: 1
    });

    // Stream the welcome message
    const welcomeMessage = "Bienvenu dans le générateur de Pensées Magiques de l'Observatoire des Éphéméries."
    const words = welcomeMessage.split(' ')

    let i = 0
    const streamInterval = setInterval(() => {
      if (i < words.length) {
        box.appendText(words[i])
        i++
      } else {
        clearInterval(streamInterval)

        // After the box is complete, add the prompt on a new line
        this.term.writeln('') // Add some spacing
        this.term.writeln('\x1b[36mAppuyez sur ENTER pour générer une pensée magique...\x1b[0m')
      }
    }, 100)

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
