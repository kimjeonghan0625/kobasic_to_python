const kobasicParser = require("../parser/kobasicParser");
const { PyCodegen } = require("../codegen/PyCodegen");
const {
  preprocess,
  sortArrayByLineNumber,
} = require("../preprocess/preprocess");
const fs = require("node:fs");

const pyCodegen = new PyCodegen({});
const lines = [];

class KoBasic {
  compile(program) {
    const processedBasicCode = preprocess(program);
    const basicAST = kobasicParser.parse(`(${processedBasicCode})`);
    const sortBasicAST = sortArrayByLineNumber(basicAST);
    console.log(sortBasicAST);
    const pyAST = this.genProgram(sortBasicAST);
    const target = pyCodegen.generate(pyAST, lines);
    this.saveToFile("./out.py", target);
    return { ast: pyAST, target };
  }

  saveToFile(filename, code) {
    const out = code;
    fs.writeFileSync(filename, out, "utf-8");
  }

  gen(exp) {
    if (this._isNumber(exp)) {
      return {
        type: "NumericLiteral",
        value: exp,
      };
    }
    if (this._isString(exp)) {
      return {
        type: "StringLiteral",
        value: exp.slice(1, -1),
      };
    }
    if (exp[1] === "주석" || exp[1] === "REM" || exp[1] === "rem") {
      lines.push(exp[0]);
      return {
        type: "Rem",
        lineNum: exp[0],
        value: exp.slice(2).map(e => this.gen(e))
      }
    }
    if (exp[1] === "끝" || exp[1] === "end" || exp[1] === "END") {
      lines.push(exp[0])
      return {
        type: "End",
        lineNum: exp[0],
        value: "end()",
      };
    }
    if (exp[1] === "print" || exp[1] === "PRINT" || exp[1] === "출력") {
      lines.push(exp[0]);
      const res = {
        type: "Print",
        lineNum: exp[0],
        value: exp.slice(2).map((e) => this.gen(e)),
      };
      if (exp.includes(";")) {
        res["var"] = this.gen(exp[exp.length - 1]);
        res["value"] = exp.slice(2, exp.indexOf(";")).map((e) => this.gen(e));
        return res;
      }
      return res;
    }
    if (exp === "let" || exp === "LET" || exp === "할당") {
      return {
        type: "Let",
        name: "",
      };
    }
    if (this._isVariableName(exp)) {
      return {
        type: "Identifier",
        name: exp,
      };
    }
    if (Array.isArray(exp) && this._isNumber(exp[0])) {
      lines.push(exp[0]);
      return {
        type: "Line",
        lineNum: exp[0],
        body: exp.slice(1).map((e) => this.gen(e)),
      };
    }
    throw `Unexpected expression ${JSON.stringify(exp)}`;
  }

  genProgram(array) {
    const body = array.map((n) => this.gen(n));
    return {
      type: "Program",
      body,
    };
  }

  _isVariableName(exp) {
    return typeof exp === "string" && /^[\w\-+*=<>/:.가-힣;]+$/.test(exp);
  }

  _isNumber(exp) {
    return typeof exp === "number";
  }

  _isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }
}

module.exports = {
  KoBasic,
  lines,
};
