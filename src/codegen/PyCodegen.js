class PyCodegen {
  // 프로그램을 위한 코드를 만든다.
  constructor({ indent = 4 }) {
    this.indent = indent;
    this.currentIndent = 0;
  }
  generate(exp, lines) {
    this.lines = lines;
    return this.gen(exp);
  }

  // js node를 위한 코드를 만든다.
  gen(exp) {
    if (this[exp.type] == null) {
      throw `Unexpected expression: "${exp.type}."`;
    }
    return this[exp.type](exp);
  }

  Let(exp) {
    return exp.name;
  }
  
  Rem(exp) {
    let func = this._header(exp)
    func += `    # ${exp.value.map(e => this.gen(e)).join(' ')}\n`
    func += `    pass`
    return func
  }
  
  End(exp) {
    let func = this._header(exp)
    func += `${" ".repeat(this.indent)}${exp.value}`
    return func
  }

  Print(exp) {
    let func = this._header(exp);
    if (exp.var) {
      func += `${" ".repeat(this.indent)}print(${exp.value
        .map((e) => this.gen(e))
        .filter((e) => e)
        .join(" ")}, ${this.gen(exp.var)})`;
    } else {
      func += `${" ".repeat(this.indent)}print(${exp.value
        .map((e) => this.gen(e))
        .filter((e) => e)
        .join(" ")})`;
    }
    return func;
  }
  Line(exp) {
    let func = this._header(exp);
    const tmp = [];
    exp.body.forEach((e) => {
      tmp.push(e);
      if (e.type === "Identifier" && e.name === "=") {
        func += `    global ${tmp[tmp.length - 2].name}\n`;
      }
    });
    func += "    " + tmp.map(e => this.gen(e)).join(" ");
    return func;
  }

  Identifier(exp) {
    return exp.name;
  }

  NumericLiteral(exp) {
    return `${exp.value}`;
  }

  StringLiteral(exp) {
    return `"${exp.value}"`;
  }

  BlockStatement(exp) {
    this.currentIndent += this.indent;
    let res =
      `\n` +
      `${exp.body
        .map((exp) => this._ind(this.currentIndent) + this.gen(exp))
        .join("\n")}\n`;
    this.currentIndent -= this.indent;
    res = res + this._ind(this.currentIndent);
    return res;
  }

  Program(tree) {
    const indent = "    ";
    let top = `def main():\n${indent}try:\n`;
    this.lines.forEach((l) => {
      top += `${indent + indent}stmt${l}()\n`;
    });
    top += `${indent}except End:\n${
      indent + indent
    }return\n${indent}except GosubReturn:\n${
      indent + indent
    }print("'반환'은 '서브루틴'과 함께 사용되어야 합니다.")\n${indent}return\n\nlines = {}\n`;
    let mid = tree.body.map((n) => this.gen(n)).join("\n");
    console.log("hello hello", mid);
    let tail = `\n\ndef goto(from_line, to_line):
    linenums = list(lines.keys())
    if from_line > to_line:
        linenums_goto_use = linenums[
            linenums.index(to_line) : linenums.index(from_line) + 1
        ]
        for linenum in linenums_goto_use:
            lines[linenum]()
    else:
        linenums_goto_use = linenums[linenums.index(to_line) :]
        for linenum in linenums_goto_use:
            lines[linenum]()
        raise End()

def gosub(from_line, to_line):
    try:
        goto(from_line, to_line)
    except:
        return

def gosub_return():
    raise GosubReturn()

def end():
    raise End()

class End(Exception):
    pass

class GosubReturn(Exception):
    pass


main()
`;
    return top + mid + tail;
  }

  _ind(ind) {
    return " ".repeat(ind);
  }

  _header(exp) {
    return `\ndef stmt${exp.lineNum}():\n`;
  }
}

module.exports = {
  PyCodegen,
};
