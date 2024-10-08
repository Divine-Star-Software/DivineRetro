const asciiTable: string[] = [
  "\0", // 0 - Null (NUL)
  "\x01", // 1 - Start of Heading (SOH)
  "\x02", // 2 - Start of Text (STX)
  "\x03", // 3 - End of Text (ETX)
  "\x04", // 4 - End of Transmission (EOT)
  "\x05", // 5 - Enquiry (ENQ)
  "\x06", // 6 - Acknowledge (ACK)
  "\x07", // 7 - Bell (BEL)
  "\x08", // 8 - Backspace (BS)
  "\t", // 9 - Horizontal Tab (HT)
  "\n", // 10 - Line Feed (LF)
  "\x0B", // 11 - Vertical Tab (VT)
  "\x0C", // 12 - Form Feed (FF)
  "\r", // 13 - Carriage Return (CR)
  "\x0E", // 14 - Shift Out (SO)
  "\x0F", // 15 - Shift In (SI)
  "\x10", // 16 - Data Link Escape (DLE)
  "\x11", // 17 - Device Control 1 (DC1)
  "\x12", // 18 - Device Control 2 (DC2)
  "\x13", // 19 - Device Control 3 (DC3)
  "\x14", // 20 - Device Control 4 (DC4)
  "\x15", // 21 - Negative Acknowledge (NAK)
  "\x16", // 22 - Synchronous Idle (SYN)
  "\x17", // 23 - End of Transmit Block (ETB)
  "\x18", // 24 - Cancel (CAN)
  "\x19", // 25 - End of Medium (EM)
  "\x1A", // 26 - Substitute (SUB)
  "\x1B", // 27 - Escape (ESC)
  "\x1C", // 28 - File Separator (FS)
  "\x1D", // 29 - Group Separator (GS)
  "\x1E", // 30 - Record Separator (RS)
  "\x1F", // 31 - Unit Separator (US)
  " ", // 32 - Space
  "!", // 33 - Exclamation Mark
  '"', // 34 - Quotation Mark
  "#", // 35 - Number Sign
  "$", // 36 - Dollar Sign
  "%", // 37 - Percent Sign
  "&", // 38 - Ampersand
  "'", // 39 - Apostrophe
  "(", // 40 - Left Parenthesis
  ")", // 41 - Right Parenthesis
  "*", // 42 - Asterisk
  "+", // 43 - Plus Sign
  ",", // 44 - Comma
  "-", // 45 - Hyphen-Minus
  ".", // 46 - Full Stop
  "/", // 47 - Solidus
  "0", // 48 - Digit Zero
  "1", // 49 - Digit One
  "2", // 50 - Digit Two
  "3", // 51 - Digit Three
  "4", // 52 - Digit Four
  "5", // 53 - Digit Five
  "6", // 54 - Digit Six
  "7", // 55 - Digit Seven
  "8", // 56 - Digit Eight
  "9", // 57 - Digit Nine
  ":", // 58 - Colon
  ";", // 59 - Semicolon
  "<", // 60 - Less-Than Sign
  "=", // 61 - Equals Sign
  ">", // 62 - Greater-Than Sign
  "?", // 63 - Question Mark
  "@", // 64 - At Sign
  "A", // 65 - Uppercase A
  "B", // 66 - Uppercase B
  "C", // 67 - Uppercase C
  "D", // 68 - Uppercase D
  "E", // 69 - Uppercase E
  "F", // 70 - Uppercase F
  "G", // 71 - Uppercase G
  "H", // 72 - Uppercase H
  "I", // 73 - Uppercase I
  "J", // 74 - Uppercase J
  "K", // 75 - Uppercase K
  "L", // 76 - Uppercase L
  "M", // 77 - Uppercase M
  "N", // 78 - Uppercase N
  "O", // 79 - Uppercase O
  "P", // 80 - Uppercase P
  "Q", // 81 - Uppercase Q
  "R", // 82 - Uppercase R
  "S", // 83 - Uppercase S
  "T", // 84 - Uppercase T
  "U", // 85 - Uppercase U
  "V", // 86 - Uppercase V
  "W", // 87 - Uppercase W
  "X", // 88 - Uppercase X
  "Y", // 89 - Uppercase Y
  "Z", // 90 - Uppercase Z
  "[", // 91 - Left Square Bracket
  "\\", // 92 - Reverse Solidus
  "]", // 93 - Right Square Bracket
  "^", // 94 - Circumflex Accent
  "_", // 95 - Low Line
  "`", // 96 - Grave Accent
  "a", // 97 - Lowercase a
  "b", // 98 - Lowercase b
  "c", // 99 - Lowercase c
  "d", // 100 - Lowercase d
  "e", // 101 - Lowercase e
  "f", // 102 - Lowercase f
  "g", // 103 - Lowercase g
  "h", // 104 - Lowercase h
  "i", // 105 - Lowercase i
  "j", // 106 - Lowercase j
  "k", // 107 - Lowercase k
  "l", // 108 - Lowercase l
  "m", // 109 - Lowercase m
  "n", // 110 - Lowercase n
  "o", // 111 - Lowercase o
  "p", // 112 - Lowercase p
  "q", // 113 - Lowercase q
  "r", // 114 - Lowercase r
  "s", // 115 - Lowercase s
  "t", // 116 - Lowercase t
  "u", // 117 - Lowercase u
  "v", // 118 - Lowercase v
  "w", // 119 - Lowercase w
  "x", // 120 - Lowercase x
  "y", // 121 - Lowercase y
  "z", // 122 - Lowercase z
  "{", // 123 - Left Curly Bracket
  "|", // 124 - Vertical Line
  "}", // 125 - Right Curly Bracket
  "~", // 126 - Tilde
  "\x7F", // 127 - Delete (DEL)

  // Extended ASCII characters
  "Ç", // 128
  "ü", // 129
  "é", // 130
  "â", // 131
  "ä", // 132
  "à", // 133
  "å", // 134
  "ç", // 135
  "ê", // 136
  "ë", // 137
  "è", // 138
  "ï", // 139
  "î", // 140
  "ì", // 141
  "Ä", // 142
  "Å", // 143
  "É", // 144
  "æ", // 145
  "Æ", // 146
  "ô", // 147
  "ö", // 148
  "ò", // 149
  "û", // 150
  "ù", // 151
  "ÿ", // 152
  "Ö", // 153
  "Ü", // 154
  "¢", // 155
  "£", // 156
  "¥", // 157
  "₧", // 158
  "ƒ", // 159
  "á", // 160
  "í", // 161
  "ó", // 162
  "ú", // 163
  "ñ", // 164
  "Ñ", // 165
  "ª", // 166
  "º", // 167
  "¿", // 168
  "⌐", // 169
  "¬", // 170
  "½", // 171
  "¼", // 172
  "¡", // 173
  "«", // 174
  "»", // 175
  "░", // 176
  "▒", // 177
  "▓", // 178
  "│", // 179
  "┤", // 180
  "Á", // 181
  "Â", // 182
  "À", // 183
  "©", // 184
  "╣", // 185
  "║", // 186
  "╗", // 187
  "╝", // 188
  "¢", // 189
  "¥", // 190
  "┐", // 191
  "└", // 192
  "┴", // 193
  "┬", // 194
  "├", // 195
  "─", // 196
  "┼", // 197
  "ã", // 198
  "Ã", // 199
  "╚", // 200
  "╔", // 201
  "╩", // 202
  "╦", // 203
  "╠", // 204
  "═", // 205
  "╬", // 206
  "¤", // 207
  "ð", // 208
  "Ð", // 209
  "Ê", // 210
  "Ë", // 211
  "È", // 212
  "ı", // 213
  "Í", // 214
  "Î", // 215
  "Ï", // 216
  "┘", // 217
  "┌", // 218
  "█", // 219
  "▄", // 220
  "¦", // 221
  "Ì", // 222
  "▀", // 223
  "Ó", // 224
  "ß", // 225
  "Ô", // 226
  "Ò", // 227
  "õ", // 228
  "Õ", // 229
  "µ", // 230
  "þ", // 231
  "Þ", // 232
  "Ú", // 233
  "Û", // 234
  "Ù", // 235
  "ý", // 236
  "Ý", // 237
  "¯", // 238
  "´", // 239
  "≡", // 240
  "±", // 241
  "‗", // 242
  "¾", // 243
  "¶", // 244
  "§", // 245
  "÷", // 246
  "¸", // 247
  "°", // 248
  "¨", // 249
  "·", // 250
  "¹", // 251
  "³", // 252
  "²", // 253
  "■", // 254
  "\xFF", // 255 - Blank
];

export enum ConsoleColors {
  Black = 1,
  Red,
  Green,
  Yellow,
  Blue,
  Purple,
  Cyan,
  White,
}

export class StyleObject {
  fg: ConsoleColors | null = null;
  bg: ConsoleColors | null = null;
  dim: boolean;
  blinking: boolean;
  bright: boolean;
  static Clear(object: StyleObject) {
    object.fg = null;
    object.fg = null;
    object.blinking = false;
    object.dim = false;
    object.bright = false;
  }

  static Copy(destination: StyleObject, source: Partial<StyleObject>) {
    if (source.fg !== undefined) destination.fg = source.fg;
    if (source.bg !== undefined) destination.bg = source.bg;
    destination.dim = source.dim !== undefined ? source.dim : false;
    destination.blinking =
      source.blinking !== undefined ? source.blinking : false;
    destination.bright = source.bright !== undefined ? source.bright : false;
  }

  static New(data: {
    fg?: ConsoleColors;
    bg?: ConsoleColors;
    dim?: boolean;
    blinking?: boolean;
    bright?: boolean;
  }) {
    return new StyleObject(
      data.fg,
      data.bg,
      data.dim,
      data.blinking,
      data.bright
    );
  }

  constructor(
    fg?: ConsoleColors,
    bg?: ConsoleColors,
    dim?: boolean,
    blinking?: boolean,
    bright?: boolean
  ) {
    this.fg = fg !== undefined ? fg : null;
    this.bg = bg !== undefined ? bg : null;
    this.dim = Boolean(dim);
    this.blinking = Boolean(blinking);
    this.bright = Boolean(bright);
  }
}

const asciiRecord: Record<string, number> = {};

for (let i = 0; i < asciiTable.length; i++) {
  asciiRecord[asciiTable[i]] = i;
}

export class ASCIIMapping {
  static asciiTable = asciiTable;
  static asciiRecord = asciiRecord;

  static getCharCodeAt(input: string, index = 0) {
    return this.asciiRecord[input[index]];
  }

  static getCharFromCode(code: number) {
    return this.asciiTable[code];
  }
}
